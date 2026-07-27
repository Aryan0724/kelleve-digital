"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Phone, Clock, ChevronRight, UserCircle } from "lucide-react";

export default function CrmPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/crm/leads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/crm/leads/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      
      // Update local state
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status } : lead));
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'contacted': return 'bg-yellow-500 text-white';
      case 'interested': return 'bg-[#E8701A] text-white';
      case 'converted': return 'bg-green-500 text-white';
      case 'lost': return 'bg-slate-500 text-white';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  const statuses = ['new', 'contacted', 'interested', 'converted', 'lost'];

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">CRM & Leads</h1>
        <p className="text-muted-foreground mt-2">
          Manage your customer pipeline and incoming inquiries.
        </p>
      </div>

      {/* Kanban Board View */}
      <div className="flex overflow-x-auto pb-8 space-x-6">
        {statuses.map(status => {
          const statusLeads = leads.filter(l => l.status === status);
          return (
            <div key={status} className="flex-shrink-0 w-80 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white capitalize">{status}</h3>
                <Badge variant="secondary" className="bg-white dark:bg-slate-800 text-slate-500">{statusLeads.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {statusLeads.map(lead => (
                  <Card key={lead.id} className="border-0 shadow-sm bg-white dark:bg-[#0a1c3a]/70 dark:border dark:border-white/10 hover:shadow-md transition-shadow cursor-grab">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <UserCircle className="h-8 w-8 text-slate-400" />
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white text-sm">{lead.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {lead.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <Badge variant="outline" className="text-[10px] py-0">{lead.source}</Badge>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Status Action Buttons (Quick move to next) */}
                      <div className="mt-4 flex gap-1 justify-end border-t border-slate-100 dark:border-slate-800 pt-2">
                        <select 
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="text-xs bg-slate-100 dark:bg-slate-800 border-0 rounded px-2 py-1 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-[#E8701A]"
                        >
                          {statuses.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {statusLeads.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed rounded-lg border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
