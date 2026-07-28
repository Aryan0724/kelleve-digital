"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TrueDialAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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
  };
  vendor: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    title: string;
  };
  messages: Message[];
}

export default function InboxPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await (TrueDialAPI as any).get("/conversations");
      setConversations(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    fetchConversations();
  }, [isLoggedIn, router, isLoading]);

  if (!user) return null;
  const isCustomer = user.role === 'customer' || user.role === 'homeowner';

  return (
    <div className="bg-background min-h-[calc(100vh-64px)] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Inbox</h1>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-navy dark:text-white mb-2">No conversations yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {isCustomer 
                  ? "When you start a chat with businesses, your messages will appear here." 
                  : "When customers contact you, their inquiries and messages will appear here."}
              </p>
              <Button onClick={() => router.push('/dashboard')} className="bg-primary hover:bg-primary/90 text-white font-semibold">
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => {
                const otherUser = isCustomer ? conv.vendor : conv.customer;
                const unreadCount = isCustomer ? conv.customer_unread_count : conv.vendor_unread_count;
                const lastMessage = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
                
                return (
                  <Link href={`/messages/${conv.id}`} key={conv.id} className="block hover:bg-muted/50 transition-colors p-4 md:p-6 border-l-4 border-transparent hover:border-primary">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <UserIcon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold text-navy dark:text-white truncate">
                              {conv.project?.title || "Direct Inquiry"}
                            </h3>
                            <div className="text-sm font-medium text-muted-foreground">
                              {otherUser?.name || "User"}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {lastMessage && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
                              </span>
                            )}
                            {unreadCount > 0 && (
                              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {lastMessage ? (
                          <p className={`text-sm mt-2 truncate ${unreadCount > 0 ? 'text-navy dark:text-white font-medium' : 'text-muted-foreground'}`}>
                            {lastMessage.message}
                          </p>
                        ) : (
                          <p className="text-sm mt-2 text-muted-foreground italic">No messages yet.</p>
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
