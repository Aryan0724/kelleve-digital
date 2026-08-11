"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Phone } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { PlaceBidModal } from "@/components/requirements/PlaceBidModal";
import { RequirementUnlockModal } from "@/components/requirements/RequirementUnlockModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LeadActionButtonsProps {
  req: any;
  className?: string;
}

export function LeadActionButtons({ req, className = "flex flex-col gap-2 w-full" }: LeadActionButtonsProps) {
  const { token, setShowLoginModal } = useAuthStore();
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const router = useRouter();

  const isJob = req.opportunity_type === "JOB";
  const reqType = req.opportunity_type ? req.opportunity_type.toLowerCase() : "project";

  return (
    <>
      <div className={className}>
        <Button 
          onClick={() => {
            if (!token) setShowLoginModal(true, window.location.pathname);
            else setBidModalOpen(true);
          }}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-9 text-xs flex items-center justify-center gap-2"
        >
          <Briefcase className="w-3.5 h-3.5" /> {isJob ? "Apply for Job" : "Place Bid"}
        </Button>
        {req.is_unlocked ? (
          <a href={`tel:${req.phone}`} className="w-full">
            <Button 
              variant="outline" 
              className="w-full border-green-500 text-green-600 hover:bg-green-50 font-bold h-9 text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" /> {req.phone}
            </Button>
          </a>
        ) : (
          <Button 
            onClick={() => {
              if (!token) setShowLoginModal(true, window.location.pathname);
              else setUnlockModalOpen(true);
            }}
            variant="outline" 
            className="w-full border-green-500 text-green-600 hover:bg-green-50 font-bold h-9 text-xs flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> Unlock {req.phone || 'Contact'}
          </Button>
        )}
        <Link href={`/requirements/${req.id}?type=${reqType}`} className="w-full">
          <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold h-9 text-xs flex items-center justify-center gap-2">
            <Search className="w-3.5 h-3.5" /> View Details
          </Button>
        </Link>
      </div>

      {bidModalOpen && (
        <PlaceBidModal
          isOpen={bidModalOpen}
          onClose={() => setBidModalOpen(false)}
          requirementId={req.id}
          requirementType={reqType}
          onSuccess={() => {
            router.refresh();
          }}
        />
      )}
      
      {unlockModalOpen && (
        <RequirementUnlockModal
          isOpen={unlockModalOpen}
          onClose={() => setUnlockModalOpen(false)}
          requirementId={req.id}
          requirementType={reqType}
          unlockPrice={req.unlock_price}
          onUnlockSuccess={() => {
            router.refresh();
          }}
        />
      )}
    </>
  );
}
