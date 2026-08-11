'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import Link from 'next/link';
import { MessageSquare, Search, Clock, Briefcase, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MessagesPage() {
  const { user } = useAuth();
  const { isCustomer } = useRole();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching conversations
    setTimeout(() => {
      setConversations([
        {
          id: 1,
          with: isCustomer ? "SpaceCrafters Interiors" : "John Doe (Homeowner)",
          project: {
            title: "3BHK Full Interior Renovation",
            type: "project"
          },
          lastMessage: "Sure, we can schedule a site visit this Saturday.",
          timestamp: "10 mins ago",
          unread: 2,
          status: "active"
        },
        {
          id: 2,
          with: isCustomer ? "Modern Living Studio" : "Jane Smith (Homeowner)",
          project: {
            title: "Modular Kitchen Upgrade",
            type: "rfq"
          },
          lastMessage: "I have shared the catalog with you.",
          timestamp: "2 hours ago",
          unread: 0,
          status: "active"
        }
      ]);
      setLoading(false);
    }, 800);
  }, [isCustomer]);

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
            {conversations.map(conv => (
              <Link 
                key={conv.id} 
                href={`/dashboard/messages/${conv.id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-muted/50 transition cursor-pointer group"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 relative">
                  {conv.with.charAt(0)}
                  {conv.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-card flex items-center justify-center text-[10px] text-white font-bold">
                      {conv.unread}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-foreground truncate pr-4 group-hover:text-primary transition">
                      {conv.with}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> {conv.timestamp}
                    </span>
                  </div>
                  
                  {/* Contextual Project Tag */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm inline-flex items-center gap-1">
                      {conv.project.type === 'project' ? <Briefcase className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {conv.project.title}
                    </span>
                  </div>

                  <p className={`text-sm truncate ${conv.unread > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
