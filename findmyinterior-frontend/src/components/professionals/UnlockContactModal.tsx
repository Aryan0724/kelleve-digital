"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { toast } from "react-toastify";

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface UnlockContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
  onUnlockSuccess: () => void;
}

export function UnlockContactModal({ isOpen, onClose, listing, onUnlockSuccess }: UnlockContactModalProps) {
  const { token, user, setShowLoginModal } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isFree = user?.role === 'worker' || user?.role === 'skilled_worker';

  const startRazorpayPayment = async (amountToPay: number = 49) => {
    try {
      const orderRes = await api.post("/payments/create-order", {
        purpose: "lead_unlock",
        requirement_id: listing.id,
        requirement_type: "listing",
        amount: amountToPay,
      });
      const orderId = orderRes.data.order_id;
      const amountInPaise = orderRes.data.amount;

      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please check internet connection.");
        return;
      }

      const rzpKey = orderRes.data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TRfrjzfAExcLjs";
      const options = {
        key: rzpKey,
        amount: amountInPaise.toString(),
        currency: "INR",
        name: "FindMyInterior",
        description: `Unlock Contact Details: ₹${amountToPay}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment verified! Unlocking contact...");
            // Auto unlock contact
            await api.post(`/listings/${listing.id}/unlock`);
            toast.success("Contact unlocked! You can now view details.");
            onUnlockSuccess();
            onClose();
          } catch (verErr: any) {
            toast.error(verErr.response?.data?.message || "Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#ea580c",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (res: any) {
        toast.error("Payment Failed: " + (res.error?.description || "Transaction cancelled"));
      });
      paymentObject.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment gateway.");
    }
  };

  const displayPrice = listing?.unlock_price || 49;

  const handleUnlock = async () => {
    if (!token) {
      toast.info("Please log in to unlock this contact.");
      setShowLoginModal(true, window.location.pathname);
      return;
    }

    if (!isFree) {
      await startRazorpayPayment(displayPrice);
      return;
    }

    setLoading(true);
    try {
      await api.post(`/listings/${listing.id}/unlock`);
      
      toast.success("Contact unlocked! You can now view details.");
      onUnlockSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || "";
      toast.error(msg || "Failed to unlock contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-600" />
            Unlock Contact Details
          </DialogTitle>
          <DialogDescription>
            Unlock {listing.title}'s phone and WhatsApp details. 
            {!isFree && ` This requires a ₹${displayPrice} fee processed directly via online payment.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-700">
              <MessageCircle className="w-8 h-8 text-[#25D366]" />
              <div className="text-xl font-bold tracking-widest">+91 XXXXX XXXXX</div>
            </div>
          </div>
          
          <Button 
            onClick={handleUnlock} 
            className="w-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-base"
            disabled={loading}
          >
            {loading ? "Processing..." : isFree ? "Unlock for Free" : `Pay ₹${displayPrice} & Unlock Contact`}
          </Button>
          
          {!isFree && (
            <p className="text-xs text-center text-slate-500">
              Secure payment powered by Razorpay.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
