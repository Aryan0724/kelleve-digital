"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: number;
  message: string;
  created_at: string;
}

interface Conversation {
  id: number;
  customer_id: number;
  vendor_id: number;
  project_stage: string;
  last_message_at: string;
  customer_unread_count: number;
  vendor_unread_count: number;
  customer: {
    id: number;
    name: string;
    avatar?: string;
  };
  vendor: {
    id: number;
    name: string;
    avatar?: string;
  };
  project?: {
    id: number;
    title: string;
  };
  messages: Message[];
}

export default function InboxPage() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/conversations");
      setConversations(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!token) {
      router.push("/login");
      return;
    }
    fetchConversations();
  }, [token, router, _hasHydrated]);

  if (!user) return null;
  const isCustomer = user.role === 'customer' || user.role === 'homeowner';

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Inbox</h1>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No conversations yet</h3>
              <p className="text-slate-500 mb-6 max-w-md">
                {isCustomer 
                  ? "When professionals bid on your projects or you start a chat, your messages will appear here." 
                  : "Unlock leads or submit bids to start conversations with customers."}
              </p>
              <Button onClick={() => router.push('/dashboard')} className="bg-orange-600 hover:bg-orange-700">
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => {
                const isCurrentUserCustomer = Number(user.id) === Number(conv.customer_id);
                const otherUser = isCurrentUserCustomer ? conv.vendor : conv.customer;
                const unreadCount = isCurrentUserCustomer ? conv.customer_unread_count : conv.vendor_unread_count;
                const lastMessage = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
                const isOfficial = otherUser?.id === 1 || otherUser?.roles?.some((r: any) => (r.slug || r.name || r) === 'admin');
                const displayName = isOfficial ? "FindMyInterior Admin" : (otherUser?.name || "User");
                const conversationTitle = conv.project?.title || (isOfficial ? "FindMyInterior Official Welcome & Support" : "Direct Inquiry");
                
                return (
                  <Link href={`/messages/${conv.id}`} key={conv.id} className="block hover:bg-slate-50 transition-colors p-4 md:p-6 border-l-4 border-transparent hover:border-orange-500">
                    <div className="flex gap-4 items-center">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm shrink-0">
                        <AvatarImage src={otherUser?.avatar} alt={displayName} />
                        <AvatarFallback className={isOfficial ? "bg-indigo-100 text-indigo-700 font-semibold" : "bg-orange-100 text-orange-600 font-semibold"}>
                          {isOfficial ? "A" : (displayName.charAt(0).toUpperCase() || <UserIcon className="h-6 w-6" />)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 truncate">
                                {conversationTitle}
                              </h3>
                              {isOfficial && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                                  Official
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-medium text-slate-700">
                              {displayName}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {lastMessage && (
                              <span className="text-xs text-slate-400 whitespace-nowrap">
                                {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
                              </span>
                            )}
                            {unreadCount > 0 && (
                              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {lastMessage ? (
                          <p className={`text-sm mt-2 truncate ${unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                            {lastMessage.message}
                          </p>
                        ) : (
                          <p className="text-sm mt-2 text-slate-400 italic">No messages yet.</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
