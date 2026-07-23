"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import B2BQuoteModal from "./B2BQuoteModal";

export default function PostRequirementButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-navy/90 transition shadow-lg shadow-navy/30 text-lg flex items-center gap-2 border border-navy"
      >
        <Sparkles className="w-5 h-5 text-primary" />
        Get Multiple Quotes
      </button>

      <B2BQuoteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
