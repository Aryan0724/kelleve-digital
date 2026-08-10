import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdvancedBidForm } from "@/components/bids/AdvancedBidForm";
import { Gavel } from "lucide-react";

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementId: number;
  requirementType: string;
  onSuccess?: () => void;
}

export function PlaceBidModal({ isOpen, onClose, requirementId, requirementType, onSuccess }: PlaceBidModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white">
        <div className="bg-[#ff6b00] p-5 text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Gavel className="w-5 h-5"/> Submit Your Bid
          </DialogTitle>
          <DialogDescription className="text-orange-100 hidden">
            Fill out the form below to submit your bid for this project.
          </DialogDescription>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <AdvancedBidForm 
            requirementId={requirementId}
            requirementType={requirementType} 
            onSuccess={() => {
              onClose();
              if (onSuccess) onSuccess();
            }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
