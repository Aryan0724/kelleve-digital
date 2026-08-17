'use client';

import React, { useState, useEffect, use } from 'react';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import { TrueDialAPI } from '@/lib/api';
import { 
  Building2, MapPin, IndianRupee, Clock, CalendarDays, 
  CheckCircle2, AlertCircle, FileText, Send, Star, ShieldCheck,
  ChevronRight, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RequirementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isCustomer, isVendor } = useRole();
  const { user } = useAuth();
  
  const [requirement, setRequirement] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bid submission state (Vendor)
  const [bidAmount, setBidAmount] = useState('');
  const [bidTimeline, setBidTimeline] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    // Mock fetch for demonstration (in real app, call API)
    setTimeout(() => {
      setRequirement({
        id,
        title: "3BHK Full Interior Renovation",
        description: "Looking for a complete interior design and execution for my 3BHK flat in Andheri West. Includes modular kitchen, wardrobes, false ceiling, and painting.",
        budget_range: "12,00,000 - 15,00,000",
        location: "Mumbai, Maharashtra",
        status: "open",
        created_at: "2026-08-10T10:00:00Z",
        type: "project",
        user_id: isCustomer ? user?.id : 999 // If customer, pretend it's theirs
      });

      if (isCustomer) {
        setBids([
          {
            id: 1,
            vendor_id: 101,
            company_name: "SpaceCrafters Interiors",
            price: 1350000,
            timeline_days: 45,
            rating: 4.8,
            projects_completed: 120,
            smart_bid_score: 9.2,
            recommended: true,
            status: "submitted"
          },
          {
            id: 2,
            vendor_id: 102,
            company_name: "Modern Living Studio",
            price: 1200000,
            timeline_days: 60,
            rating: 4.5,
            projects_completed: 45,
            smart_bid_score: 7.8,
            recommended: true,
            status: "submitted"
          }
        ]);
      } else {
        setBids([]);
      }
      setLoading(false);
    }, 1000);
  }, [id, isCustomer, user]);

  const submitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBid(true);
    // Real implementation: await TrueDialAPI.post(...)
    setTimeout(() => {
      setSubmittingBid(false);
      alert("Bid submitted successfully!");
    }, 1000);
  };

  const handleAward = (bidId: number) => {
    alert("Project awarded to bid ID: " + bidId);
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-muted-foreground">Loading requirement details...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up p-4">
      {/* Header */}
      <div className="premium-card p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Building2 className="w-32 h-32"/></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">
                {requirement?.type?.toUpperCase()}
              </Badge>
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {requirement?.status?.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{requirement?.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {requirement?.location}</div>
              <div className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4" /> {requirement?.budget_range}</div>
              <div className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Posted 2 days ago</div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border relative z-10">
          <h3 className="font-bold text-foreground mb-2">Description</h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
            {requirement?.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* VENDOR VIEW: BID SUBMISSION */}
          {isVendor && requirement?.status === 'open' && (
            <div className="premium-card p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-foreground">
                <Send className="w-5 h-5 text-primary" /> Submit Your Bid
              </h2>
              <form onSubmit={submitBid} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Estimated Cost (₹)</label>
                    <input 
                      type="number" 
                      required 
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="e.g. 1250000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Timeline (Days)</label>
                    <input 
                      type="number" 
                      required 
                      value={bidTimeline}
                      onChange={e => setBidTimeline(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="e.g. 45"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Proposal Message</label>
                  <textarea 
                    required 
                    value={bidMessage}
                    onChange={e => setBidMessage(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:border-primary"
                    placeholder="Describe your approach and why you are the best fit..."
                  />
                </div>
                <Button type="submit" disabled={submittingBid} className="w-full font-bold">
                  {submittingBid ? "Submitting..." : "Submit Bid for ₹10"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  10 Wallet Credits will be deducted upon submission.
                </p>
              </form>
            </div>
          )}

          {/* HOMEOWNER VIEW: BIDS COMPARISON */}
          {isCustomer && (
            <div className="premium-card p-6 rounded-2xl">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-foreground">
                <ShieldCheck className="w-5 h-5 text-primary" /> Received Bids ({bids.length})
              </h2>
              
              {bids.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">No bids received yet. We are notifying matching professionals.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map(bid => (
                    <div key={bid.id} className={`border rounded-xl p-4 transition ${bid.recommended ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground text-lg">{bid.company_name}</h3>
                            {bid.recommended && <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none text-[10px] uppercase">Highly Recommended</Badge>}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {bid.rating} Rating</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {bid.projects_completed} Projects</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-2xl font-bold text-primary">₹{bid.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground font-medium mt-1">Est. {bid.timeline_days} days</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border flex justify-end gap-3">
                        <Button variant="outline" size="sm" className="font-semibold">View Profile</Button>
                        <Button size="sm" onClick={() => handleAward(bid.id)} className="font-bold bg-green-600 hover:bg-green-700 text-white">Award Project</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Area: Activity Timeline */}
        <div className="space-y-6">
          <div className="premium-card p-6 rounded-2xl">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary" /> Activity Timeline
            </h3>
            <div className="relative border-l-2 border-border ml-3 space-y-6">
              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1 ring-4 ring-background" />
                <h4 className="text-sm font-bold text-foreground">Requirement Posted</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Aug 10, 2026 - 10:00 AM</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-1 ring-4 ring-background" />
                <h4 className="text-sm font-bold text-foreground">Verified & Approved</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Aug 10, 2026 - 10:15 AM</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-amber-500 rounded-full -left-[9px] top-1 ring-4 ring-background" />
                <h4 className="text-sm font-bold text-foreground">Syndicated to B2B</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Aug 10, 2026 - 10:16 AM</p>
              </div>
              {bids.length > 0 && isCustomer && (
                <div className="relative pl-6">
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 ring-4 ring-background animate-pulse" />
                  <h4 className="text-sm font-bold text-foreground">Receiving Bids</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{bids.length} bids received so far</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
