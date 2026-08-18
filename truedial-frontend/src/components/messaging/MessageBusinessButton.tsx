"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TrueDialAPI } from "@/lib/api";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  vendorUserId: number | string;
  businessName: string;
}

export default function MessageBusinessButton({ vendorUserId, businessName }: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!isLoggedIn) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!vendorUserId) return;
    setLoading(true);
    try {
      const result = await TrueDialAPI.post('/conversations', {
        vendor_id: Number(vendorUserId),
      });
      const convId = result?.id ?? result?.data?.id;
      if (convId) {
        router.push(`/messages/${convId}`);
      } else {
        router.push('/messages');
      }
    } catch (e) {
      console.error('Failed to start conversation:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStartChat}
      disabled={loading}
      className="w-full bg-primary hover:bg-primary/90 text-white font-bold flex items-center justify-center gap-2 h-11 rounded-xl shadow-md transition-all"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
      <span className="truncate">{loading ? 'Starting Chat...' : `Message ${businessName || 'Business'}`}</span>
    </Button>
  );
}
