'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import Link from 'next/link';
import { MessageSquare, Search, Clock, Briefcase, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TrueDialAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { isCustomer } = useRole();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchConversations = async () => {
      try {
        const res = await (TrueDialAPI as any).get('/conversations');
        setConversations(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, authLoading]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up p-4 h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" /> Messages
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Chat securely with {isCustomer ? 'professionals' : 'homeowners'} about your projects.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      {/* Main List */}
      <div className="premium-card rounded-2xl flex-1 overflow-hidden flex flex-col border border-border bg-card">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-muted-foreground text-sm animate-pulse">Loading conversations...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="font-bold text-foreground">No Messages Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Your conversations regarding projects and bids will appear here.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {conversations.map(conv => {
              const otherUser = isCustomer ? conv.vendor : conv.customer;
              const unreadCount = isCustomer ? conv.customer_unread_count : conv.vendor_unread_count;
              const lastMessageObj = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
              const timestamp = lastMessageObj ? formatDistanceToNow(new Date(lastMessageObj.created_at), { addSuffix: true }) : formatDistanceToNow(new Date(conv.created_at), { addSuffix: true });
              const lastMessage = lastMessageObj?.message || "Conversation started";
              
              return (
                <Link 
                  key={conv.id} 
                  href={`/dashboard/messages/${conv.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-muted/50 transition cursor-pointer group"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 relative">
                    {otherUser?.name?.charAt(0) || "U"}
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-card flex items-center justify-center text-[10px] text-white font-bold">
                        {unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-foreground truncate pr-4 group-hover:text-primary transition">
                        {otherUser?.name || "User"}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {timestamp}
                      </span>
                    </div>
                    
                    {/* Contextual Project Tag */}
                    {conv.project && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm inline-flex items-center gap-1">
                          {conv.project.type === 'project' ? <Briefcase className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {conv.project.title || "Project"}
                        </span>
                      </div>
                    )}

                    <p className={`text-sm truncate ${unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                      {lastMessage}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
