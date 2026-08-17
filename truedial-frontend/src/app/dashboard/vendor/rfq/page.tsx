"use client";

import React, { useState } from "react";
import { 
  ClipboardList, Search, FileText, CheckCircle, 
  XCircle, Filter, Download, ArrowRight, PackageOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── MOCK DATA ────────────────────────────────────────────────────────
const MOCK_RFQS = [
  {
    id: "RFQ-8820",
    client: "L&T Construction (West Zone)",
    project: "Skyline Residency, Malad",
    date: "Today",
    dueDate: "Tomorrow, 5 PM",
    items: "500 Bags UltraTech Cement, 2 Tonnes TMT Bars",
    status: "New",
    estimatedValue: "₹8,50,000"
  },
  {
    id: "RFQ-8819",
    client: "Aura Interiors",
    project: "Office Renovation, BKC",
    date: "Yesterday",
    dueDate: "20 Aug 2026",
    items: "120 Sheets 18mm Marine Plywood, 50 Sheets Laminate",
    status: "Quoted",
    estimatedValue: "₹4,20,000"
  },
  {
    id: "RFQ-8815",
    client: "Rajesh Builders",
    project: "Green Valley Villas",
    date: "10 Aug 2026",
    dueDate: "14 Aug 2026",
    items: "Premium Floor Tiles (1200x600) - 5000 sqft",
    status: "Accepted",
    estimatedValue: "₹6,00,000"
  },
  {
    id: "RFQ-8812",
    client: "Urban Homemakers",
    project: "Private Villa, Juhu",
    date: "05 Aug 2026",
    dueDate: "08 Aug 2026",
    items: "Jaquar Sanitary Fittings (Complete Set for 4 Baths)",
    status: "Lost",
    estimatedValue: "₹1,50,000"
  }
];

export default function RFQBoardManager() {
  const [rfqs, setRfqs] = useState(MOCK_RFQS);
  const [search, setSearch] = useState("");

  const filteredRfqs = rfqs.filter(r => 
    r.client.toLowerCase().includes(search.toLowerCase()) || 
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.project.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'Quoted': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'Accepted': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'Lost': return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const submitQuote = (id: string) => {
    alert(`Generating quotation template for ${id}...`);
    setRfqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Quoted' } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-teal-500" />
            B2B RFQ Board
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage incoming Requests For Quotation from builders and contractors.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search RFQs, Clients..." 
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

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New RFQs", value: rfqs.filter(r => r.status === 'New').length, color: "text-blue-500" },
          { label: "Quotes Sent", value: rfqs.filter(r => r.status === 'Quoted').length, color: "text-amber-500" },
          { label: "Orders Won", value: rfqs.filter(r => r.status === 'Accepted').length, color: "text-emerald-500" },
          { label: "Win Rate", value: "35%", color: "text-teal-500" },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRfqs.map(rfq => (
          <Card key={rfq.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition bg-white dark:bg-slate-900/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded text-sm border border-teal-200 dark:border-teal-800">
                        {rfq.id}
                      </span>
                      <Badge className={`border-0 ${getStatusColor(rfq.status)}`}>{rfq.status}</Badge>
                      {rfq.status === 'New' && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Est. Value: <span className="text-emerald-600 dark:text-emerald-400">{rfq.estimatedValue}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{rfq.client}</h3>
                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <FileText className="w-4 h-4" /> Project: <span className="font-medium text-slate-700 dark:text-slate-300">{rfq.project}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Required Items</div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white flex items-start gap-2">
                      <PackageOpen className="w-4 h-4 mt-0.5 text-slate-400" />
                      {rfq.items}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div><span className="text-slate-500">Received:</span> <span className="font-medium text-slate-700 dark:text-slate-300">{rfq.date}</span></div>
                    <div><span className="text-slate-500">Quote Due By:</span> <span className="font-bold text-red-500">{rfq.dueDate}</span></div>
                  </div>
                </div>
                
                <div className="md:w-48 flex flex-col gap-3 shrink-0 pt-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
                  {rfq.status === 'New' && (
                    <>
                      <Button onClick={() => submitQuote(rfq.id)} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold shadow-md shadow-teal-500/20">
                        Submit Quote
                      </Button>
                      <Button variant="outline" className="w-full text-slate-600 dark:text-slate-300">
                        <Download className="w-4 h-4 mr-2" /> Download Specs
                      </Button>
                      <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                        Decline RFQ
                      </Button>
                    </>
                  )}
                  
                  {rfq.status === 'Quoted' && (
                    <>
                      <Button variant="outline" className="w-full border-teal-200 text-teal-600 hover:bg-teal-50">
                        Update Quote
                      </Button>
                      <Button variant="ghost" className="w-full text-slate-600">
                        Send Follow-up
                      </Button>
                    </>
                  )}
                  
                  {rfq.status === 'Accepted' && (
                    <>
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
                        Process Order <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Invoice
                      </Button>
                    </>
                  )}

                  {rfq.status === 'Lost' && (
                    <div className="text-sm text-slate-500 text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      Quote rejected by client. Price was higher than competition.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredRfqs.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#0a1c3a]/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No RFQs found</h3>
            <p>You don't have any requests matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
