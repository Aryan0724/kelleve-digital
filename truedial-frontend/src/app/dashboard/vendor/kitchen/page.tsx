"use client";

import React, { useState, useEffect } from "react";
import { 
  Utensils, Clock, CheckCircle2, AlertCircle, ChefHat, 
  Play, Check, Flame, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── MOCK DATA ────────────────────────────────────────────────────────
const MOCK_TICKETS = [
  {
    id: "KDS-1042",
    type: "Dine-In",
    table: "T-04",
    timeElapsed: 2, // minutes
    status: "new",
    items: [
      { name: "Paneer Tikka Masala", qty: 2, notes: "Extra spicy" },
      { name: "Butter Naan", qty: 4, notes: "" },
      { name: "Sweet Lassi", qty: 2, notes: "" }
    ]
  },
  {
    id: "KDS-1043",
    type: "Delivery",
    table: "Zomato",
    timeElapsed: 12,
    status: "preparing",
    items: [
      { name: "Chicken Biryani (Family Pack)", qty: 1, notes: "" },
      { name: "Raita", qty: 2, notes: "" },
      { name: "Gulab Jamun", qty: 4, notes: "" }
    ]
  },
  {
    id: "KDS-1044",
    type: "Dine-In",
    table: "T-12",
    timeElapsed: 25, // Getting late
    status: "preparing",
    items: [
      { name: "Veg Hakka Noodles", qty: 1, notes: "No MSG" },
      { name: "Manchurian Dry", qty: 1, notes: "" }
    ]
  },
  {
    id: "KDS-1045",
    type: "Takeaway",
    table: "Walk-in",
    timeElapsed: 0,
    status: "new",
    items: [
      { name: "Masala Dosa", qty: 2, notes: "Crispy" },
      { name: "Filter Coffee", qty: 2, notes: "Less sugar" }
    ]
  }
];

export default function KitchenDisplaySystem() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate time passing to update timers (every minute)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTickets(prev => prev.map(t => ({
        ...t,
        timeElapsed: t.status !== 'ready' ? t.timeElapsed + 1 : t.timeElapsed
      })));
    }, 60000); // 1 min in real life, but we just increment the mock number
    return () => clearInterval(timer);
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    if (newStatus === "ready") {
      // If marked ready, we might want to keep it on screen for a bit or remove it.
      // For this KDS, we'll remove it after 3 seconds, or keep it in a "Done" column.
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      setTimeout(() => {
        setTickets(prev => prev.filter(t => t.id !== id));
      }, 3000);
    } else {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  };

  const getTimerColor = (minutes: number) => {
    if (minutes >= 20) return "bg-red-500/10 text-red-600 border-red-500/20";
    if (minutes >= 10) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Dine-In': return "bg-blue-500 text-white";
      case 'Delivery': return "bg-purple-500 text-white";
      case 'Takeaway': return "bg-orange-500 text-white";
      default: return "bg-slate-500 text-white";
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-[#E8701A]" />
            Kitchen Display System (KDS)
          </h1>
          <p className="text-muted-foreground mt-1">
            Live order tickets. Keep preparation times under 15 minutes.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Live Sync</div>
          </div>
        </div>
      </div>

      {/* Grid of Tickets */}
      <div className="flex-1 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-4 h-full items-start">
          {tickets.map(ticket => (
            <div 
              key={ticket.id} 
              className={`w-80 shrink-0 flex flex-col rounded-xl border-2 transition-all duration-300 shadow-sm
                ${ticket.status === 'ready' 
                  ? 'border-emerald-500 bg-emerald-500/5 scale-95 opacity-80' 
                  : ticket.timeElapsed >= 20 
                    ? 'border-red-500/50 bg-red-50 dark:bg-red-950/20 shadow-red-500/10' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-sm'
                }`}
            >
              {/* Ticket Header */}
              <div className={`p-3 rounded-t-lg border-b border-slate-200 dark:border-slate-800 flex justify-between items-start ${ticket.timeElapsed >= 20 && ticket.status !== 'ready' ? 'bg-red-500/10' : ''}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">#{ticket.id.split('-')[1]}</span>
                    <Badge className={`${getTypeColor(ticket.type)} border-0 text-[10px] uppercase tracking-wider px-2 py-0`}>
                      {ticket.type}
                    </Badge>
                  </div>
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {ticket.type === 'Dine-In' ? `Table: ${ticket.table}` : ticket.table}
                  </div>
                </div>
                
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-sm ${getTimerColor(ticket.timeElapsed)}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {ticket.timeElapsed}m
                </div>
              </div>

              {/* Ticket Items */}
              <div className="p-3 flex-1 overflow-y-auto min-h-[200px]">
                <ul className="space-y-3">
                  {ticket.items.map((item, idx) => (
                    <li key={idx} className="flex gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shrink-0">
                        {item.qty}x
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                          {item.name}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-red-500 font-medium mt-1 bg-red-50 dark:bg-red-500/10 inline-block px-1.5 py-0.5 rounded">
                            * {item.notes}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ticket Footer Actions */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
                {ticket.status === 'new' && (
                  <Button 
                    onClick={() => updateStatus(ticket.id, 'preparing')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 text-lg shadow-lg shadow-blue-500/20"
                  >
                    <Flame className="w-5 h-5 mr-2" /> Start Cooking
                  </Button>
                )}
                {ticket.status === 'preparing' && (
                  <Button 
                    onClick={() => updateStatus(ticket.id, 'ready')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 text-lg shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-5 h-5 mr-2" /> Mark Ready
                  </Button>
                )}
                {ticket.status === 'ready' && (
                  <div className="w-full h-12 flex items-center justify-center font-bold text-emerald-600 bg-emerald-500/10 rounded-md">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Ready to Serve
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {tickets.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <CheckCircle2 className="w-16 h-16 mb-4 opacity-50" />
              <h2 className="text-xl font-medium">All caught up!</h2>
              <p className="text-sm mt-1">Waiting for new orders...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
