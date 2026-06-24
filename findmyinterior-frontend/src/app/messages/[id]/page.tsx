"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User as UserIcon, Loader2, ArrowLeft, Info, MessageSquare } from "lucide-react";

interface Conversation {
  id: number;
  customer_id: number;
  vendor_id: number;
  project_stage: string;
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
    budget_min: string;
    budget_max: string;
    status: string;
  };
}

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = async (isPolling = false) => {
    try {
      const res = await api.get(`/conversations/${params.id}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const fetchConversationInfo = async () => {
    try {
      const res = await api.get(`/conversations/${params.id}`);
      if (res.data) {
        setConversation(res.data);
      }
    } catch (err) {
      console.error("Failed to load conversation details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    
    fetchConversationInfo();
    fetchMessages();

    // 5-second polling
    pollingInterval.current = setInterval(() => {
      fetchMessages(true);
    }, 5000);

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [token, params.id, router]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    setSending(true);
    const msgText = newMessage;
    setNewMessage("");

    // Optimistic UI update
    const tempId = Date.now();
    setMessages(prev => [...prev, {
      id: tempId,
      sender_id: user?.id!,
      message: msgText,
      created_at: new Date().toISOString()
    }]);

    try {
      await api.post(`/conversations/${params.id}/messages`, {
        message: msgText,
        message_type: "text"
      });
      fetchMessages(true);
    } catch (err) {
      console.error("Failed to send message", err);
      // Revert optimistic update
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;
  if (loading) {
    return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }
  if (!conversation) {
    return <div className="p-20 text-center text-red-500 font-medium">Conversation not found.</div>;
  }

  const isCustomer = user.role === 'customer';
  const otherUser = isCustomer ? conversation.vendor : conversation.customer;

  return (
    <div className="bg-slate-50 h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shrink-0">
        <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/messages')} className="-ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <UserIcon className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-900 truncate">{otherUser?.name || "User"}</h2>
            <div className="text-xs text-slate-500 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Online
            </div>
          </div>
        </div>
      </div>

        {conversation.project && (
          <div className="bg-orange-50 border-b shrink-0">
            <div className="container mx-auto px-4 py-3 max-w-4xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full text-sm">
                  <div>
                    <span className="text-orange-900/60 block text-xs font-semibold uppercase tracking-wider">Project</span>
                    <span className="font-medium text-slate-900">{conversation.project.title}</span>
                  </div>
                  <div>
                    <span className="text-orange-900/60 block text-xs font-semibold uppercase tracking-wider">Budget</span>
                    <span className="font-medium text-slate-900">₹{conversation.project.budget_min || '0'} - ₹{conversation.project.budget_max || '0'}</span>
                  </div>
                  <div>
                    <span className="text-orange-900/60 block text-xs font-semibold uppercase tracking-wider">Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white text-slate-700 border border-slate-200 capitalize">
                      {conversation.project.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4">
        <div className="container mx-auto max-w-4xl flex flex-col space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-500 py-10 my-auto">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border">
                <MessageSquare className="w-6 h-6 text-slate-300" />
              </div>
              <p>Start the conversation</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-orange-600 text-white rounded-tr-sm' : 'bg-white border text-slate-800 rounded-tl-sm'}`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-orange-200' : 'text-slate-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4 shrink-0">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Input 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full rounded-full bg-slate-50 border-slate-200 focus-visible:ring-orange-500 pr-12"
              />
            </div>
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sending} 
              className="rounded-full w-10 h-10 p-0 bg-orange-600 hover:bg-orange-700 shrink-0 shadow-md"
            >
              <Send className="h-4 w-4 ml-1" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
