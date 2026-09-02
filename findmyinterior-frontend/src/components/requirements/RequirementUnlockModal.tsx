import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Phone } from "lucide-react";
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

interface RequirementUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementId: number;
  requirementType: string;
  unlockPrice?: number;
  onUnlockSuccess?: (contact?: { name?: string; phone?: string; email?: string }) => void;
}

export function RequirementUnlockModal({ 
  isOpen, 
  onClose, 
  requirementId, 
  requirementType, 
  unlockPrice = 49,
  onUnlockSuccess 
}: RequirementUnlockModalProps) {
  const { token, user, setShowLoginModal } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isFree = user?.role === 'worker' || user?.role === 'skilled_worker';
  const displayPrice = isFree ? 0 : (unlockPrice ?? 49);

  const startRazorpayPayment = async (amountToPay: number = unlockPrice || 49) => {
    try {
      const orderRes = await api.post("/payments/create-order", {
        purpose: "lead_unlock",
        requirement_id: requirementId,
        requirement_type: requirementType || "project",
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
        description: `Unlock Requirement Contact: ₹${amountToPay}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment verified! Unlocking contact...");
            const typeStr = requirementType ? `?requirement_type=${requirementType}` : '';
            const unlockRes = await api.post(`/requirements/${requirementId}/unlock${typeStr}`);
            toast.success("Contact unlocked successfully!");
            if (onUnlockSuccess) onUnlockSuccess(unlockRes.data?.contact);
            onClose();
          } catch (verErr: any) {
            toast.error(verErr.response?.data?.message || "Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name || "User",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#ea580c",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment gateway.");
    }
  };

  const handleUnlockAttempt = async () => {
    if (!token) {
      toast.info("Please log in to unlock this contact.");
      setShowLoginModal(true, window.location.pathname);
      return;
    }

    setLoading(true);
    try {
      const typeStr = requirementType ? `?requirement_type=${requirementType}` : '';
      const res = await api.post(`/requirements/${requirementId}/unlock${typeStr}`);
      
      if (res.data.requires_payment) {
        // User has no quota, trigger Razorpay
        await startRazorpayPayment(res.data.amount);
      } else if (res.data.success) {
        // User had free quota and it succeeded
        toast.success("Contact unlocked successfully using your monthly quota!");
        if (onUnlockSuccess) onUnlockSuccess(res.data.contact);
        onClose();
      } else {
        toast.error(res.data.message || "Failed to unlock contact.");
      }
    } catch (err: any) {
      if (err.response?.status === 402 || err.response?.data?.needs_recharge || err.response?.data?.requires_payment) {
         // Fallback for legacy errors
         const amountToPay = err.response?.data?.required_amount || err.response?.data?.amount || unlockPrice || 49;
         await startRazorpayPayment(amountToPay);
      } else {
        toast.error(err.response?.data?.message || "Failed to unlock contact.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unlock Contact Details</DialogTitle>
          <DialogDescription>
            Get direct access to this client's phone number and email address.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-slate-600">
              Unlock this lead to view complete contact details instantly.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUnlockAttempt} 
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            disabled={loading}
          >
            {loading ? "Processing..." : (
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Unlock Now
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
