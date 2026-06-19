"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, Clock, XCircle, Trophy, MessageSquare, Gavel } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

export function MyBidsTab({ bids, title = "My Submitted Bids", showAwardedOnly = false }: { bids: any[], title?: string, showAwardedOnly?: boolean }) {
  
  const filteredBids = showAwardedOnly 
    ? bids.filter(b => b.status === 'awarded') 
    : bids.filter(b => b.status !== 'awarded'); // Hide awarded from normal bids tab if we have a dedicated tab

  const router = useRouter();
  const [messaging, setMessaging] = useState<number | null>(null);

  const handleMessage = async (requirementId: number) => {
    setMessaging(requirementId);
    try {
      const res = await api.post(`/requirements/${requirementId}/conversations`);
      router.push(`/messages/${res.data.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to start conversation.");
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
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredBids && filteredBids.length > 0 ? (
          <div className="space-y-4">
            {filteredBids.map((bid: any) => (
              <div key={bid.id} className={`p-4 border rounded-lg shadow-sm ${bid.status === 'awarded' ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}>
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-slate-900 text-lg">For: {bid.requirement?.title}</span>
                        <div className="text-sm text-slate-500 mt-1">{bid.requirement?.city?.name} • Req Status: {bid.requirement?.status}</div>
                      </div>
                      {getStatusBadge(bid.status)}
                    </div>
                    
                    <div className="flex gap-8 my-4 bg-slate-50 p-3 rounded-lg border">
                      <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">My Bid Amount</div>
                        <div className="font-bold text-orange-600 text-lg">₹{bid.amount}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Timeline</div>
                        <div className="font-bold text-slate-700 text-lg">{bid.timeline_days} Days</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-slate-500 mb-1">My Proposal</div>
                      <p className="text-slate-600 text-sm whitespace-pre-line">{bid.proposal}</p>
                    </div>
                  </div>
                  
                  <div className="shrink-0 pt-2 flex flex-col gap-2">
                    <Link href={`/requirements/${bid.requirement?.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" /> View Requirement
                      </Button>
                    </Link>
                    {(bid.status === 'pending' || bid.status === 'awarded' || bid.status === 'accepted') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-slate-700"
                        onClick={() => handleMessage(bid.requirement?.id)}
                        disabled={messaging === bid.requirement?.id}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" /> 
                        {messaging === bid.requirement?.id ? "Opening..." : "Message Customer"}
                      </Button>
                    )}
                  </div>
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
