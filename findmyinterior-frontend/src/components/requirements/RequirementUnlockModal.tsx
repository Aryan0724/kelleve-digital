import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { toast } from "react-toastify";

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

  const isFreeUnlock = user?.role === 'worker' || 
                       user?.role === 'skilled_worker' || 
                       user?.roles?.some((r: any) => r.slug === 'worker' || r.slug === 'skilled_worker') || 
                       user?.subscription?.plan?.can_see_all_leads;

  const handleUnlock = async () => {
    if (!token) {
      toast.info("Please log in to unlock this contact.");
      setShowLoginModal(true, window.location.pathname);
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
      console.error(err);
      if (err.response?.status === 402 || err.response?.data?.message?.toLowerCase().includes('balance')) {
        toast.error("Insufficient wallet balance. Redirecting to wallet recharge...");
        router.push("/dashboard?tab=wallet");
      } else {
        toast.error(err.response?.data?.message || "Failed to unlock contact.");
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
            {isFreeUnlock ? (
              <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded text-sm">FREE</span>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 line-through">₹99</span>
                <span className="font-bold text-slate-800">₹{unlockPrice ?? 49}</span>
              </div>
            )}
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
            {loading ? "Unlocking..." : "Confirm Unlock"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
