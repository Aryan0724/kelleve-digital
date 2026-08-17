"use client";

import React, { useState } from "react";
import { 
  CalendarCheck, AlertCircle, Clock, FileText, 
  CheckCircle2, Plus, Filter, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const MOCK_DEADLINES = [
  {
    id: "DL-101",
    client: "Acme Corp Ltd.",
    task: "Annual Tax Filing (ITR-6)",
    dueDate: "Today",
    status: "Critical",
    assignedTo: "Rahul (Senior CA)"
  },
  {
    id: "DL-102",
    client: "Mr. Sharma",
    task: "Property Registration Drafting",
    dueDate: "Tomorrow",
    status: "Pending",
    assignedTo: "Neha (Associate)"
  },
  {
    id: "DL-103",
    client: "TechVision Solutions",
    task: "GST R1 Filing",
    dueDate: "18 Aug 2026",
    status: "In Progress",
    assignedTo: "Rahul (Senior CA)"
  },
  {
    id: "DL-104",
    client: "Global Imports",
    task: "Customs Clearance Documentation",
    dueDate: "Yesterday",
    status: "Completed",
    assignedTo: "Vikram (Partner)"
  }
];

export default function DeadlinesCalendarPage() {
  const [deadlines, setDeadlines] = useState(MOCK_DEADLINES);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return "bg-red-500/10 text-red-600 border-red-500/20";
      case 'Pending': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'In Progress': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'Completed': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const markComplete = (id: string) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, status: 'Completed' } : d));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-indigo-500" />
            Compliance & Deadlines
          </h1>
          <p className="text-muted-foreground mt-2">
            Track statutory deadlines, client deliverables, and compliance tasks.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-10 px-6">
            <Plus className="w-4 h-4 mr-2" /> Add Deadline
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-3xl font-bold text-red-500">{deadlines.filter(d => d.status === 'Critical').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Due Today</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-3xl font-bold text-amber-500">{deadlines.filter(d => d.status === 'Pending').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Upcoming (7 days)</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-3xl font-bold text-blue-500">{deadlines.filter(d => d.status === 'In Progress').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">In Progress</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-3xl font-bold text-emerald-500">{deadlines.filter(d => d.status === 'Completed').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Completed</div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 dark:text-white">Active Tasks</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center text-red-500 font-medium">
              <AlertTriangle className="w-4 h-4 mr-1" /> Overdue tasks highlighted
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {deadlines.map(item => (
            <div key={item.id} className={`p-5 flex flex-col md:flex-row justify-between gap-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition
              ${item.dueDate === 'Yesterday' && item.status !== 'Completed' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}
            `}>
              <div className="flex-1 space-y-1 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`px-2 py-0.5 border-0 ${getStatusColor(item.status)}`}>{item.status}</Badge>
                  <span className="text-xs font-mono text-slate-400">{item.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.task}</h3>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Client: {item.client}</div>
              </div>
              
              <div className="w-full md:w-48 flex items-center md:justify-center gap-2">
                <Clock className={`w-4 h-4 ${item.dueDate === 'Today' ? 'text-red-500' : 'text-slate-400'}`} />
                <span className={`font-semibold ${item.dueDate === 'Today' ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                  Due: {item.dueDate}
                </span>
              </div>
              
              <div className="w-full md:w-48 flex items-center md:justify-center gap-2 text-sm text-slate-500">
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-medium">
                  {item.assignedTo}
                </span>
              </div>
              
              <div className="w-full md:w-auto flex justify-end shrink-0">
                {item.status !== 'Completed' ? (
                  <Button onClick={() => markComplete(item.id)} className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-9">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Done
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full md:w-auto text-slate-500 border-slate-200 h-9" disabled>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Completed
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
