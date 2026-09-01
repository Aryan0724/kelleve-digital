'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import Link from 'next/link';
import { 
  ArrowLeft, Briefcase, FileText, Send, Paperclip, 
  MoreVertical, Check, CheckCheck, IndianRupee, MapPin, Loader2, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrueDialAPI } from '@/lib/api';
import { format } from 'date-fns';

export default function ChatWindowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoading: authLoading } = useAuth();
  const { isCustomer } = useRole();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = async (isPolling = false) => {
    if (!id) return;
    try {
      const res = await (TrueDialAPI as any).get(`/conversations/${id}/messages`);
      if (res && res.data) {
        setMessages(prev => {
          if (isPolling && prev.length === res.data.length) return prev;
          return Array.isArray(res.data) ? res.data : [];
        });
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const fetchConversationInfo = async () => {
    if (!id) return;
    try {
      const res = await (TrueDialAPI as any).get(`/conversations/${id}`);
      if (res && res.data) {
        setConversation(res.data);
      }
    } catch (err) {
      console.error("Failed to load conversation details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    
    if (id) {
      fetchConversationInfo();
      fetchMessages();

      pollingInterval.current = setInterval(() => {
        fetchMessages(true);
      }, 5000);
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [id, user, authLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !conversation || !id) return;

    setSending(true);
    const msgText = messageText;
    setMessageText('');

    const tempId = Date.now();
    setMessages(prev => [...prev, {
      id: tempId,
      sender_id: user?.id!,
      message: msgText,
      created_at: new Date().toISOString(),
      isTemp: true
    }]);

    try {
      await (TrueDialAPI as any).post(`/conversations/${id}/messages`, {
        message: msgText,
        message_type: "text"
      });
      fetchMessages(true);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center h-full flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <span className="text-muted-foreground text-sm">Loading conversation...</span>
      </div>
    );
  }

  if (!conversation) {
    return <div className="p-20 text-center text-red-500 font-medium h-full flex items-center justify-center">Conversation not found.</div>;
  }

  const otherUser = isCustomer ? conversation.vendor : conversation.customer;

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-2rem)] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Top Header - User Info */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/messages" className="p-2 hover:bg-muted rounded-full transition text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            {otherUser?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="font-bold text-foreground leading-tight">{otherUser?.name || "User"}</h2>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full transition text-muted-foreground">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Contextual Project Header */}
      {conversation.project && (
        <div className="bg-muted/30 p-3 px-6 border-b border-border flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              {conversation.project.type === 'project' ? <Briefcase className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <Link href={`/dashboard/requirements/${conversation.project.id}`} className="text-sm font-bold text-foreground hover:text-primary transition hover:underline">
                {conversation.project.title || "Project"}
              </Link>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                {conversation.project.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {conversation.project.location}</span>
                )}
                {conversation.project.budget_min && (
                  <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3 text-green-500" /> {conversation.project.budget_min}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 relative">
        {messages.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
             <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
               <MessageSquare className="w-6 h-6 text-muted" />
             </div>
             <p>Start the conversation</p>
           </div>
        ) : (
          messages.map((msg) => {
            const isMe = Number(msg.sender_id) === Number(user?.id);
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  isMe 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-card border border-border text-foreground rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-medium ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {msg.created_at ? format(new Date(msg.created_at), 'p') : 'Sending...'}
                    {isMe && (
                      msg.read_at ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <button type="button" className="p-3 text-muted-foreground hover:bg-muted rounded-xl transition shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <TextareaAutoResize 
              value={messageText} 
              onChange={setMessageText} 
              onEnter={handleSend}
            />
          </div>
          <Button type="submit" disabled={!messageText.trim() || sending} className="rounded-xl px-4 h-[44px] shrink-0">
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Helper component for auto-resizing textarea
function TextareaAutoResize({ value, onChange, onEnter }: { value: string, onChange: (v: string) => void, onEnter: (e: any) => void }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnter(e);
    }
  };

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type a message..."
      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none max-h-32 min-h-[44px]"
      rows={1}
      style={{ height: 'auto', overflow: 'hidden' }}
    />
  );
}
