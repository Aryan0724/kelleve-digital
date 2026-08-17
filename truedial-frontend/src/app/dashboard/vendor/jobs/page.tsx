"use client";

import React, { useState } from "react";
import { 
  Briefcase, MapPin, Clock, CheckCircle, 
  Wallet, Phone, Map, AlertCircle, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_JOBS = [
  {
    id: "JB-771",
    title: "Complete Home Plumbing Repair",
    customer: "Vikram R.",
    location: "Malad West, Mumbai",
    distance: "4.2 km",
    date: "Today",
    time: "02:00 PM",
    estPayout: "₹1,200",
    status: "Accepted"
  },
  {
    id: "JB-772",
    title: "Kitchen Sink Installation",
    customer: "Priya S.",
    location: "Borivali East, Mumbai",
    distance: "1.5 km",
    date: "Tomorrow",
    time: "10:00 AM",
    estPayout: "₹800",
    status: "New Lead"
  },
  {
    id: "JB-765",
    title: "Bathroom Leakage Fix",
    customer: "Amit D.",
    location: "Andheri West, Mumbai",
    distance: "7.8 km",
    date: "Yesterday",
    time: "11:00 AM",
    estPayout: "₹1,500",
    status: "Completed"
  }
];

export default function JobBoardPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New Lead': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'Accepted': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'Completed': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const acceptJob = (id: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'Accepted' } : j));
  };

  const markCompleted = (id: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'Completed' } : j));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-[#E8701A]" />
            Job Board & Dispatch
          </h1>
          <p className="text-muted-foreground mt-2">
            Find new service requests nearby, accept jobs, and track your daily payout.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-500">My Status:</span>
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-3 py-1 text-sm font-bold shadow-md shadow-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></div>
            Online & Available
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Earned (Week)</div>
          <div className="text-3xl font-bold text-emerald-500">₹8,450</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jobs Completed</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{jobs.filter(j => j.status === 'Completed').length}</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Jobs</div>
          <div className="text-3xl font-bold text-amber-500">{jobs.filter(j => j.status === 'Accepted').length}</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">New Leads Nearby</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
            {jobs.filter(j => j.status === 'New Lead').length}
            <span className="flex h-3 w-3 rounded-full bg-blue-500 ml-3 animate-ping"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <div key={job.id} className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
            <div className={`p-5 flex-1 ${job.status === 'New Lead' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <Badge className={`px-2 py-0.5 border-0 ${getStatusColor(job.status)}`}>
                  {job.status === 'New Lead' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {job.status}
                </Badge>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                  <Wallet className="w-4 h-4 mr-1.5" /> {job.estPayout}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2">{job.title}</h3>
              
              <div className="space-y-3">
                <div className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 mr-3 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">{job.location}</span>
                    <div className="text-xs text-blue-500 font-bold mt-0.5 flex items-center">
                      <Map className="w-3 h-3 mr-1" /> {job.distance} away
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 mr-3 text-slate-400" />
                  <span><span className="font-semibold text-slate-900 dark:text-white">{job.date}</span> at {job.time}</span>
                </div>
                {job.status !== 'New Lead' && (
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 mr-3 text-slate-400" />
                    <span>Customer: <strong className="text-slate-900 dark:text-white">{job.customer}</strong></span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50">
              {job.status === 'New Lead' && (
                <div className="flex gap-2">
                  <Button onClick={() => acceptJob(job.id)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
                    Accept Job
                  </Button>
                  <Button variant="outline" className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">Pass</Button>
                </div>
              )}
              
              {job.status === 'Accepted' && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
                    <Map className="w-4 h-4 mr-2" /> Navigate
                  </Button>
                  <Button onClick={() => markCompleted(job.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20">
                    Finish <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
              
              {job.status === 'Completed' && (
                <div className="w-full h-10 flex items-center justify-center font-bold text-emerald-600 bg-emerald-500/10 rounded-md">
                  <CheckCircle className="w-5 h-5 mr-2" /> Payment Received
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
