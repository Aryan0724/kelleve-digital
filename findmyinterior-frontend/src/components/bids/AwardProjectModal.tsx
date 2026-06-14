import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AwardProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidId: number;
  onSuccess: () => void;
}

export function AwardProjectModal({ isOpen, onClose, bidId, onSuccess }: AwardProjectModalProps) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAward = async () => {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      await api.patch(`/bids/${bidId}/award`);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to award project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Award Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to award this project to this professional? This will close the requirement and notify the professional to start the work.
          </DialogDescription>
        </DialogHeader>
        
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            className="bg-slate-900 hover:bg-slate-800 text-white" 
            onClick={handleAward} 
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Award"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
