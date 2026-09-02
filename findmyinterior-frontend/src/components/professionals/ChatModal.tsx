"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, Send, Loader2, MessageSquare, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function ChatModal({
  professionalId,
  professionalName,
  isOpen,
  onClose,
}: {
  professionalId: number;
  professionalName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { user, setShowLoginModal } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (typeof window !== "undefined") {
        setShowLoginModal?.(true, window.location.pathname);
      } else {
        router.push("/login");
      }
      return;
    }
    if (!message.trim()) return;

    setSending(true);
    try {
      // Initiate or find direct conversation
      const res = await api.post("/conversations", {
        vendor_id: professionalId,
        customer_id: user.id,
      });

      const conversationId = res.data.id;

      // Send the initial direct message
      await api.post(`/conversations/${conversationId}/messages`, {
        message: message.trim(),
        message_type: "text",
      });

      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setMessage("");
      }, 1800);
    } catch (err: any) {
      console.error("Failed to send message", err);
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.message || "You are not authorized to send a message.");
      } else {
        toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                Chat with {professionalName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct message to vendor</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-950/50 rounded-full flex items-center justify-center mb-3 text-green-600 text-2xl font-bold shadow-inner">
                ✓
              </div>
              <p className="text-slate-900 dark:text-white font-bold text-lg">Message sent successfully!</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-xs">
                {professionalName} will receive your message and notify you shortly.
              </p>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center mb-3">
                <LogIn className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Sign in to Message
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs">
                Please log in to your account to send direct messages and receive replies in your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <Button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (typeof window !== "undefined") {
                      setShowLoginModal?.(true, window.location.pathname);
                    }
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md"
                >
                  <LogIn className="w-4 h-4 mr-2" /> Log In / Register
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full border-slate-200 text-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Send a direct message to <span className="font-semibold text-slate-900 dark:text-slate-200">{professionalName}</span>. Your conversation will appear in your dashboard messages.
              </p>
              <form onSubmit={handleSend} className="space-y-3">
                <div className="relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message or project question..."
                    className="pr-12 py-3 text-sm h-11 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-xl focus-visible:ring-orange-500"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={sending || !message.trim()}
                    className="absolute right-1.5 top-1.5 h-8 w-8 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Press Enter or tap send</span>
                  <span>Instant notification sent to vendor</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
