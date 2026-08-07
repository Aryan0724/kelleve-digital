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
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (!token) {
      toast.info("Please log in to unlock this contact.");
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);
    try {
      // Create an inquiry automatically as a way of "unlocking"
      await api.post("/inquiries", {
        type: "Listing",
        id: listing.id,
        message: "I am interested in your services and unlocked your contact details on FindMyInterior.",
      });
      
      toast.success("Contact unlocked! You can now chat on WhatsApp.");
      onUnlockSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlock contact. Please try again.");
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
            Unlock {listing.title}'s WhatsApp number to chat directly. By unlocking, they will be notified of your interest.
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
