"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatModal } from "@/components/professionals/ChatModal";
import { MessageSquare } from "lucide-react";

export function MessageProfessionalButton({ professionalId, professionalName }: { professionalId: number, professionalName: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="lg" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:border-orange-900/50 dark:text-orange-400 dark:hover:bg-orange-900/20" onClick={() => setIsModalOpen(true)}>
        <MessageSquare className="w-4 h-4 mr-2" /> Message Professional
      </Button>
      
      <ChatModal 
        professionalId={professionalId}
        professionalName={professionalName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
