"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState([
    { id: 1, business: "Sharma Interior Decorators", category: "Interior Designers", requested: "2 hours ago", status: "pending" },
    { id: 2, business: "Royal Palace Hotel", category: "Hotels", requested: "5 hours ago", status: "pending" },
    { id: 3, business: "Quick Fix Plumbers", category: "Plumbers", requested: "1 day ago", status: "pending" },
  ]);

  const handleApprove = (id: number) => {
    setApprovals(approvals.filter(a => a.id !== id));
    // Ideally this calls the API: PATCH /api/v1/truedial/admin/vendors/{id}/approve
  };

  const handleReject = (id: number) => {
    setApprovals(approvals.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">Vendor Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve new vendor registration requests.</p>
      </div>

      {approvals.length === 0 ? (
        <div className="premium-card p-12 text-center rounded-xl border border-border">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-80" />
          <h3 className="text-lg font-medium text-foreground">All Caught Up!</h3>
          <p className="text-muted-foreground text-sm mt-2">There are no pending vendor approvals at this time.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {approvals.map((request) => (
            <div key={request.id} className="premium-card p-6 rounded-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{request.business}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="bg-secondary text-foreground px-2 py-0.5 rounded text-xs font-medium border border-border">
                      {request.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Requested {request.requested}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition">
                  <ExternalLink className="w-4 h-4" />
                  View Details
                </button>
                <button 
                  onClick={() => handleReject(request.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button 
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow-lg shadow-green-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
