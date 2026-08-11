'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import Link from 'next/link';
import { 
  ArrowLeft, Briefcase, FileText, Send, Paperclip, 
  MoreVertical, Check, CheckCheck, IndianRupee, MapPin 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ChatWindowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { isCustomer } = useRole();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);

  useEffect(() => {
    // Mock fetching conversation details and messages
    setTimeout(() => {
      setConversation({
        id,
        with: isCustomer ? "SpaceCrafters Interiors" : "John Doe (Homeowner)",
        status: "active",
        project: {
          id: 101,
          title: "3BHK Full Interior Renovation",
          type: "project",
          budget: "12,00,000 - 15,00,000",
          location: "Mumbai",
          status: "open"
        },
        bid: {
          amount: 1350000,
          status: "shortlisted"
        }
      });

      setMessages([
        {
          id: 1,
          senderId: 999, // Someone else
          text: "Hello! We reviewed your requirement for the 3BHK renovation.",
          time: "10:00 AM",
          status: "read",
          isMe: false
        },
        {
          id: 2,
          senderId: 999,
          text: "Based on our experience in Mumbai, we can complete this in 45 days.",
          time: "10:01 AM",
          status: "read",
          isMe: false
        },
        {
          id: 3,
          senderId: user?.id || 1, // Me
          text: "That sounds great. Does the quote include modular kitchen materials?",
          time: "10:15 AM",
          status: "read",
          isMe: true
        },
        {
          id: 4,
          senderId: 999,
          text: "Yes, it includes premium marine plywood and Hettich hardware.",
          time: "10:30 AM",
          status: "unread",
          isMe: false
        }
      ]);
      setLoading(false);
      
      // H4: Smart Polling Implementation Example (In real app, this polls API every 3s)
      const pollInterval = setInterval(() => {
        // fetch('/api/messages/poll?last_id=...')
      }, 3000);

      return () => clearInterval(pollInterval);
    }, 800);
  }, [id, isCustomer, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      senderId: user?.id || 1,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
      isMe: true
    }]);
    setMessageText('');
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-muted-foreground h-full flex items-center justify-center">Loading conversation...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-2rem)] bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Top Header - User Info */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/messages" className="p-2 hover:bg-muted rounded-full transition text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            {conversation.with.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-foreground leading-tight">{conversation.with}</h2>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full transition text-muted-foreground">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Contextual Project Header */}
      <div className="bg-muted/30 p-3 px-6 border-b border-border flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            {conversation.project.type === 'project' ? <Briefcase className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div>
            <Link href={`/dashboard/requirements/${conversation.project.id}`} className="text-sm font-bold text-foreground hover:text-primary transition hover:underline">
              {conversation.project.title}
            </Link>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {conversation.project.location}</span>
              <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3 text-green-500" /> {conversation.project.budget}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conversation.bid && (
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
              Bid: ₹{conversation.bid.amount.toLocaleString()} ({conversation.bid.status})
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 relative">
        <div className="text-center my-4">
          <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full font-medium">Today</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
              msg.isMe 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-card border border-border text-foreground rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-medium ${msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {msg.time}
                {msg.isMe && (
                  msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Check className="w-3 h-3" />
                )}
              </div>
            </div>
          </div>
        ))}
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
          <Button type="submit" disabled={!messageText.trim()} className="rounded-xl px-4 h-[44px] shrink-0">
            <Send className="w-5 h-5" />
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
