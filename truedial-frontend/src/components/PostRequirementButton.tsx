"use client";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BusinessEnquiryButton({ businessSlug, businessName }: { businessSlug?: string; businessName?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Button onClick={() => setOpen(true)} variant="outline" className="gap-2">
      <MessageSquare className="w-4 h-4" />
      Send Enquiry
    </Button>
  );
}
