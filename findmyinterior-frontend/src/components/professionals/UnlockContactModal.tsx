"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { toast } from "react-toastify";

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

  const handleUnlock = async () => {
    if (!token) {
      toast.info("Please log in to unlock this contact.");
      setShowLoginModal(true, window.location.pathname);
      return;
    }

    setLoading(true);
    try {
      await api.post(`/listings/${listing.id}/unlock`);
      
      toast.success("Contact unlocked! You can now chat on WhatsApp.");
      onUnlockSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 402 || err.response?.data?.message?.toLowerCase().includes('balance')) {
        toast.error("Insufficient wallet balance. Redirecting to wallet recharge...");
        router.push("/dashboard?tab=wallet");
      } else {
        toast.error(err.response?.data?.message || "Failed to unlock contact. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-600" />
            Unlock Contact Details
          </DialogTitle>
          <DialogDescription>
            Unlock {listing.title}'s WhatsApp number to chat directly. This requires a ₹49 fee which will be deducted from your wallet.
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
            {loading ? "Unlocking..." : "Unlock & Chat on WhatsApp"}
          </Button>
          
          <p className="text-xs text-center text-slate-500">
            This helps us ensure high-quality leads for our professionals.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
