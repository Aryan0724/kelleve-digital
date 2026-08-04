"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

export function ChatModal({ professionalId, professionalName, isOpen, onClose }: { professionalId: number, professionalName: string, isOpen: boolean, onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!message.trim()) return;

    setSending(true);
    try {
      // First try to start a conversation or find existing one
      const res = await api.post('/conversations', {
        vendor_id: professionalId,
        customer_id: user.id
      });
      
      const conversationId = res.data.id;
      
      // Then send the message
      await api.post(`/conversations/${conversationId}/messages`, {
        message,
        message_type: 'text'
      });
      
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setMessage("");
      }, 2000);
    } catch (err: any) {
      console.error("Failed to send message", err);
      if (err.response?.status === 403) {
        alert(err.response?.data?.message || "You are not authorized to send a message.");
      } else {
        alert("Failed to send message. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-4 sm:p-0">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-900 dark:text-white">Chat with {professionalName}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-slate-500">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600 text-xl font-bold">✓</div>
              <p className="text-slate-900 dark:text-white font-medium">Message sent successfully!</p>
              <p className="text-slate-500 text-sm mt-1">The professional will reply shortly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Send a direct message to start a conversation.
              </p>
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  autoFocus
                />
                <Button type="submit" disabled={sending || !message.trim()} className="bg-orange-600 hover:bg-orange-700 shrink-0">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
