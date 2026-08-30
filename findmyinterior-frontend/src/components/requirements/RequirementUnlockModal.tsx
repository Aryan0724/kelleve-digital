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
  onUnlockSuccess?: () => void;
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

  const startRazorpayPayment = async (amountToRecharge: number = unlockPrice || 49) => {
    try {
      const orderRes = await api.post("/payments/create-order", {
        purpose: "wallet_recharge",
        amount: amountToRecharge,
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
        description: `Unlock Requirement Contact: ₹${amountToRecharge}`,
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
            if (unlockRes.data?.wallet_balance !== undefined && user) {
              useAuthStore.getState().updateUser({ ...user, wallet_balance: unlockRes.data.wallet_balance });
            }
            toast.success("Contact unlocked successfully!");
            if (onUnlockSuccess) onUnlockSuccess();
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

  const handleUnlock = async () => {
    if (!token) {
      toast.info("Please log in to unlock this contact.");
      setShowLoginModal(true, window.location.pathname);
      return;
    }

    if (!isFree && user?.wallet_balance !== undefined && Number(user.wallet_balance) < displayPrice) {
      toast.info(`Recharging wallet ₹${displayPrice} to unlock contact...`);
      await startRazorpayPayment(displayPrice);
      return;
    }

    setLoading(true);
    try {
      const typeStr = requirementType ? `?requirement_type=${requirementType}` : '';
      const response = await api.post(`/requirements/${requirementId}/unlock${typeStr}`);
      
      if (response.data?.wallet_balance !== undefined && user) {
        useAuthStore.getState().updateUser({
          ...user,
          wallet_balance: response.data.wallet_balance
        });
      }

      toast.success("Contact unlocked successfully!");
      if (onUnlockSuccess) {
        onUnlockSuccess();
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || "";
      const isBalance = err.response?.status === 402 || 
                        err.response?.data?.needs_recharge || 
                        msg.toLowerCase().includes('balance') || 
                        msg.toLowerCase().includes('recharge') || 
                        err.response?.status === 400;
      if (isBalance) {
        toast.info("Opening Razorpay to recharge wallet...");
        await startRazorpayPayment(displayPrice);
      } else {
        toast.error(msg || "Failed to unlock contact.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-600" /> Unlock Contact Details
          </DialogTitle>
          <DialogDescription className="text-slate-600 pt-2">
            Get instant access to the client's direct phone number and message them to discuss the project.
            {!isFree && ` This requires a ₹${displayPrice} fee.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 my-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Direct Contact Number</p>
              <p className="text-sm text-slate-500">Call or WhatsApp instantly</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end">
              {isFree ? (
                <span className="font-bold text-green-600 text-lg">FREE</span>
              ) : (
                <>
                  <span className="text-xs text-slate-500 line-through">₹99</span>
                  <span className="font-bold text-slate-800">₹{displayPrice}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUnlock} 
            disabled={loading}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? "Processing..." : isFree ? "Unlock for Free" : "Confirm Unlock"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
