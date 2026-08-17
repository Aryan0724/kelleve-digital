"use client";

import React, { useState } from "react";
import { 
  CalendarDays, MapPin, Phone, Users, CheckCircle, 
  XCircle, Clock, Search, Filter, Home, Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ─── MOCK DATA ────────────────────────────────────────────────────────
const MOCK_VISITS = [
  {
    id: "SV-1001",
    clientName: "Rajesh Kumar",
    phone: "9812345678",
    property: "Ocean View 3BHK, Andheri",
    type: "Apartment",
    date: "Today",
    time: "4:00 PM",
    status: "Confirmed",
    agent: "Amit Sharma"
  },
  {
    id: "SV-1002",
    clientName: "Sunita Gupta",
    phone: "9812345679",
    property: "Green Valley Villas, Borivali",
    type: "Villa",
    date: "Today",
    time: "5:30 PM",
    status: "Pending",
    agent: "Neha Patil"
  },
  {
    id: "SV-1003",
    clientName: "Kunal Shah",
    phone: "9812345680",
    property: "Skyline Towers (Commercial), BKC",
    type: "Office Space",
    date: "Tomorrow",
    time: "11:00 AM",
    status: "Confirmed",
    agent: "Amit Sharma"
  },
  {
    id: "SV-1004",
    clientName: "Farida Malik",
    phone: "9812345681",
    property: "Ocean View 2BHK, Andheri",
    type: "Apartment",
    date: "Yesterday",
    time: "2:00 PM",
    status: "Completed",
    agent: "Neha Patil",
    feedback: "Highly interested, negotiating price."
  }
];

export default function SiteVisitsManager() {
  const [visits, setVisits] = useState(MOCK_VISITS);
  const [search, setSearch] = useState("");

  const filteredVisits = visits.filter(v => 
    v.clientName.toLowerCase().includes(search.toLowerCase()) || 
    v.property.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'Pending': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'Completed': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'Cancelled': return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'Apartment': return <Building className="w-4 h-4" />;
      case 'Villa': return <Home className="w-4 h-4" />;
      case 'Office Space': return <Building className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-[#E8701A]" />
            Site Visit Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Schedule and track property viewings with potential buyers.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search clients or properties..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
          <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{visits.filter(v => v.date === "Today").length}</div>
            <div className="text-sm font-medium text-slate-500">Visits Today</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{visits.filter(v => v.status === "Pending").length}</div>
            <div className="text-sm font-medium text-slate-500">Pending Confirmation</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{visits.filter(v => v.status === "Completed").length}</div>
            <div className="text-sm font-medium text-slate-500">Completed (All Time)</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 font-semibold text-slate-700 dark:text-slate-300 grid grid-cols-12 gap-4">
          <div className="col-span-3">Client details</div>
          <div className="col-span-4">Property</div>
          <div className="col-span-2">Schedule</div>
          <div className="col-span-3 text-right">Status & Action</div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredVisits.map(visit => (
            <div key={visit.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
              <div className="col-span-3">
                <div className="font-bold text-slate-900 dark:text-white">{visit.clientName}</div>
                <div className="text-xs text-slate-500 flex items-center mt-1">
                  <Phone className="w-3 h-3 mr-1" /> {visit.phone}
                </div>
              </div>
              
              <div className="col-span-4">
                <div className="font-medium text-slate-900 dark:text-white flex items-start gap-2">
                  <span className="mt-0.5 text-slate-400">{getPropertyIcon(visit.type)}</span>
                  {visit.property}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center">
                  <Users className="w-3 h-3 mr-1" /> Agent: {visit.agent}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className={`font-semibold ${visit.date === 'Today' ? 'text-blue-500' : 'text-slate-900 dark:text-white'}`}>
                  {visit.date}
                </div>
                <div className="text-xs text-slate-500 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" /> {visit.time}
                </div>
              </div>
              
              <div className="col-span-3 flex flex-col items-end gap-2">
                <Badge className={`px-2.5 py-1 ${getStatusColor(visit.status)}`}>
                  {visit.status}
                </Badge>
                
                {visit.status === 'Pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus(visit.id, 'Confirmed')} className="h-7 text-xs bg-blue-500 hover:bg-blue-600 text-white">Confirm</Button>
                    <Button size="sm" onClick={() => updateStatus(visit.id, 'Cancelled')} variant="outline" className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50">Decline</Button>
                  </div>
                )}
                
                {visit.status === 'Confirmed' && (
                  <Button size="sm" onClick={() => updateStatus(visit.id, 'Completed')} className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white">Mark Completed</Button>
                )}
                
                {visit.status === 'Completed' && !visit.feedback && (
                  <Button size="sm" variant="outline" className="h-7 text-xs border-[#E8701A] text-[#E8701A] hover:bg-[#E8701A]/10">Add Feedback</Button>
                )}
              </div>
              
              {visit.feedback && (
                <div className="col-span-12 mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-white">Feedback: </span> {visit.feedback}
                </div>
              )}
            </div>
          ))}
          {filteredVisits.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              No site visits found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
