'use client';

import React from 'react';
import { LayoutDashboard, Users, ShieldAlert, FileText, Banknote, FileImage, Headphones, LineChart, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardOverview() {
  const { user } = useAuth();

  const METRICS = [
    { title: "Total Users", value: "24,592", trend: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Vendors", value: "1,204", trend: "+5%", icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Open Inquiries", value: "342", trend: "-2%", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Revenue (MTD)", value: "₹4,20,500", trend: "+18%", icon: Banknote, color: "text-green-500", bg: "bg-green-500/10" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name || 'Admin'}! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground bg-card border border-border px-4 py-2 rounded-lg">
            Last synced: Just now
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                <h3 className="text-2xl font-bold text-foreground">{metric.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.bg} ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className={`font-semibold flex items-center gap-1 ${metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp className={`w-3.5 h-3.5 ${metric.trend.startsWith('-') ? 'rotate-180' : ''}`} />
                {metric.trend}
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6 h-[400px] flex flex-col">
          <h3 className="font-bold text-lg mb-4">Platform Activity</h3>
          <div className="flex-1 border border-dashed border-border rounded-lg flex items-center justify-center bg-muted/5">
            <div className="text-center text-muted-foreground">
              <LineChart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Chart Component Placeholder</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-lg mb-4">Recent System Logs</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">New Vendor Registered</p>
                  <p className="text-xs text-muted-foreground mt-0.5">SpaceCrafters Studio has completed onboarding.</p>
                  <p className="text-[10px] font-bold text-primary/70 mt-1 uppercase tracking-wider">{i * 12} mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
