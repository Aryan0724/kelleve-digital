"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, Clock, XCircle, Trophy, MessageSquare, Gavel } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function MyBidsTab({ bids, title = "My Submitted Bids", showAwardedOnly = false, statuses }: { bids: any[], title?: string, showAwardedOnly?: boolean, statuses?: string[] }) {
  
  const filteredBids = statuses 
    ? bids.filter(b => statuses.includes(b.status))
    : showAwardedOnly 
      ? bids.filter(b => b.status === 'awarded' || b.status === 'completed') 
      : bids.filter(b => b.status !== 'awarded' && b.status !== 'completed'); // Hide awarded from normal bids tab if we have a dedicated tab

  const router = useRouter();
  const [messaging, setMessaging] = useState<number | null>(null);
  const { user } = useAuthStore();

  const handleMessage = async (bid: any) => {
    const reqId = bid.requirement_id;
    const reqType = bid.requirement_type;

    // Warn before charging if bid is not awarded
    const isAwarded = bid.status === 'awarded' || bid.status === 'accepted' || bid.is_awarded === true;
    const isWorker = user?.roles?.some((r: any) => r.slug === 'worker' || r.slug === 'skilled_worker') || user?.role === 'worker' || user?.role === 'skilled_worker';
    
    if (!isAwarded && !isWorker) {
      const confirmed = window.confirm(
        "Sending a message to this client requires a ₹49 messaging unlock fee that will be deducted from your wallet. Proceed?"
      );
      if (!confirmed) return;
    }

    setMessaging(bid.id);
    try {
      let mappedType = 'project';
      if (reqType && (reqType.toLowerCase().includes('rfq'))) mappedType = 'rfq';
      if (reqType && (reqType.toLowerCase().includes('job') || reqType.toLowerCase().includes('workerjob'))) mappedType = 'job';
      
      const typeStr = `?requirement_type=${mappedType}`;
      const res = await api.post(`/requirements/${reqId}/conversations${typeStr}`);
      router.push(`/messages/${res.data.id}`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 402) {
        alert(`💰 Insufficient Wallet Balance\n\n${err.response.data.message}\n\nPlease top up your wallet and try again.`);
      } else {
        alert(err.response?.data?.message || "Failed to start conversation.");
      }
    } finally {
      setMessaging(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'accepted': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Accepted (Awaiting Award)</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case 'awarded': return <Badge className="bg-orange-600 hover:bg-orange-700 text-white"><Trophy className="w-3 h-3 mr-1" /> Won Project!</Badge>;
      case 'completed': return <Badge className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getQueryType = (type: string) => {
    if (!type) return '';
    const lower = type.toLowerCase();
    if (lower.includes('rfq')) return '?type=rfq';
    if (lower.includes('job')) return '?type=job';
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredBids.length > 0 ? (
          <div className="space-y-4">
            {filteredBids.map((bid: any) => (
              <div key={bid.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row justify-between gap-4 border-l-4 border-l-blue-500">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-blue-600 border-blue-200 bg-blue-50">
                          {bid.requirement_type || 'Project'} Bid
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">
                          Submitted on {new Date(bid.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg mt-1">{bid.requirement?.title || "Untitled Project"}</h4>
                    </div>
                    <Badge variant={bid.status === 'awarded' || bid.status === 'accepted' ? 'default' : bid.status === 'rejected' ? 'destructive' : 'secondary'} className={bid.status === 'awarded' || bid.status === 'accepted' ? 'bg-green-500 hover:bg-green-600' : ''}>
                      {bid.status === 'accepted' ? 'awarded' : bid.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center text-sm text-slate-500 mt-2 mb-3 gap-3">
                    <span className="font-bold text-slate-900">Bid Amount: ₹{bid.amount}</span>
                    <span>Timeline: {bid.timeline_days} days</span>
                    {bid.warranty_months && <span>Warranty: {bid.warranty_months} months</span>}
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-2">{bid.proposal_message}</p>

                  {bid.status === 'completed' && (
                    <div className="mt-3 bg-green-50 text-green-800 text-xs font-semibold px-3 py-2 rounded-md border border-green-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Job successfully completed! 
                      {bid.requirement?.completed_at && 
                        <span className="font-normal text-green-700 ml-1">
                          (Finished on {new Date(bid.requirement.completed_at).toLocaleDateString()})
                        </span>
                      }
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 pl-0 md:pl-4 min-w-[150px] justify-center">
                  {bid.requirement && (
                    <Link href={`/requirements/${bid.requirement_id}${getQueryType(bid.requirement_type)}`}>
                      <Button variant="outline" size="sm" className="w-full bg-slate-50 hover:bg-slate-100 shadow-sm border-slate-200 text-slate-700 font-medium">
                        View Requirement
                      </Button>
                    </Link>
                  )}
                  {(bid.status === 'pending' || bid.status === 'awarded' || bid.status === 'accepted') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-slate-700"
                        onClick={() => handleMessage(bid)}
                        disabled={messaging === bid.id}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" /> 
                        {messaging === bid.id ? "Opening..." : "Message Customer"}
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border border-dashed rounded-xl bg-slate-50">
            {showAwardedOnly ? (
              <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            ) : (
              <Gavel className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {showAwardedOnly ? "No Projects Won Yet" : "No Active Bids"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {showAwardedOnly 
                ? "You haven't won any projects yet. Keep bidding on unlocked leads!" 
                : "You don't have any active bids. Go to Unlocked Leads to submit a bid on an available project."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
