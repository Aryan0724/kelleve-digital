"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ContactProfessionalButtonProps {
  slug: string;
}

export function ContactProfessionalButton({ slug }: ContactProfessionalButtonProps) {
  const { token } = useAuthStore();
  const router = useRouter();

  const handleContactClick = () => {
    if (!token) {
      toast.info("Please login to view contact details");
      router.push(`/login?redirect=/professionals/${slug}`);
      return;
    }
    
    router.push(`/professionals/${slug}`);
  };

  return (
    <Button 
      variant="outline" 
      className="w-full rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
      onClick={handleContactClick}
    >
      <Phone className="w-4 h-4 mr-2 text-slate-400" /> Contact Now
    </Button>
  );
}
