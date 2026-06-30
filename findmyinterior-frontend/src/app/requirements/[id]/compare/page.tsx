"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, ShieldCheck, Star, Trophy, Clock, IndianRupee, MessageSquare } from "lucide-react";
import { AwardProjectModal } from "@/components/bids/AwardProjectModal";

interface BidComparison {
  bid_id: number;
  vendor_id: number;
  company_name: string | null;
  price: string;
  experience_years: number | null;
  rating: number;
  projects_completed: number | null;
  warranty_months: number | null;
  timeline_days: number;
  verification_level: string | null;
  smart_bid_score: string;
  recommended: boolean;
}

export default function CompareBidsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const reqId = params?.id;

  const [bids, setBids] = useState<BidComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedBid, setSelectedBid] = useState<number | null>(null);
  const [messaging, setMessaging] = useState<number | null>(null);

  const fetchBids = async () => {
    try {
      const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      const rType = searchParams.get("requirement_type") || "";
      const typeStr = rType ? `?requirement_type=${rType}` : '';
      const res = await api.get(`/requirements/${reqId}/bids/compare${typeStr}`);
      setBids(res.data.comparison_matrix);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load bids.");
    } finally {
      setLoading(false);
    }
  };

  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const reqType = searchParams.get("requirement_type") || "";

  const handleMessage = async (vendorId: number) => {
    setMessaging(vendorId);
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      const res = await api.post(`/requirements/${reqId}/conversations${typeStr}`, { vendor_id: vendorId });
      router.push(`/messages/${res.data.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to start conversation.");
    } finally {
      setMessaging(null);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchBids();
  }, [token, reqId, router]);

  if (loading) return <div className="p-20 text-center">Loading comparison...</div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;
  if (!bids || bids.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No Bids Yet</h2>
        <p className="text-slate-500 mb-8">You haven't received any bids for this requirement yet.</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Compare Bids</h1>
          </div>
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">
            {bids.length} Bids Received
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="overflow-x-auto pb-8">
          <div className="inline-flex gap-6 min-w-full items-start">
            
            {/* Metric Labels Column */}
            <div className="w-48 shrink-0 flex flex-col gap-4 mt-20 hidden md:flex font-medium text-slate-500 text-sm">
              <div className="h-14 flex items-center">Bid Amount</div>
              <div className="h-14 flex items-center">Timeline</div>
              <div className="h-14 flex items-center">Match Score</div>
              <div className="h-14 flex items-center">Professional Rating</div>
              <div className="h-14 flex items-center">Projects Won</div>
              <div className="h-14 flex items-center">Verification</div>
            </div>

            {/* Bids Columns */}
            {bids.map((bid) => (
              <Card key={bid.bid_id} className={`w-80 shrink-0 relative transition-all ${bid.recommended ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md'}`}>
                {bid.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm z-10">
                    <Star className="w-3 h-3 mr-1 fill-white" /> Recommended
                  </div>
                )}
                
                <CardHeader className="text-center pb-4 border-b bg-slate-50/50 rounded-t-xl">
                  <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto flex items-center justify-center text-xl font-bold text-slate-500 mb-2">
                    {bid.company_name ? bid.company_name.charAt(0) : "P"}
                  </div>
                  <CardTitle className="text-lg">{bid.company_name || `Professional #${bid.vendor_id}`}</CardTitle>
                  <Button 
                    className="w-full mt-4 bg-slate-900 hover:bg-slate-800"
                    onClick={() => setSelectedBid(bid.bid_id)}
                  >
                    Award Project
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full mt-2 border-slate-300 hover:bg-slate-50"
                    onClick={() => handleMessage(bid.vendor_id)}
                    disabled={messaging === bid.vendor_id}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {messaging === bid.vendor_id ? "Opening..." : "Message Professional"}
                  </Button>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-4">
                  <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Bid Amount</div>
                    <div className="text-2xl font-bold flex items-center text-slate-900">
                      <IndianRupee className="w-5 h-5" /> {parseInt(bid.price).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center text-sm font-medium text-slate-600"><Clock className="w-4 h-4 mr-2" /> Timeline</div>
                    <div className="font-bold">{bid.timeline_days} Days</div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center text-sm font-medium text-slate-600"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Match Score</div>
                    <div className="font-bold">{parseFloat(bid.smart_bid_score) > 0 ? `${(parseFloat(bid.smart_bid_score) * 10).toFixed(0)}%` : "N/A"}</div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center text-sm font-medium text-slate-600"><Star className="w-4 h-4 mr-2 text-yellow-500" /> Rating</div>
                    <div className="font-bold">{bid.rating > 0 ? bid.rating : "New"}</div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center text-sm font-medium text-slate-600"><Trophy className="w-4 h-4 mr-2 text-orange-400" /> Projects</div>
                    <div className="font-bold">{bid.projects_completed || 0}</div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center text-sm font-medium text-slate-600"><ShieldCheck className="w-4 h-4 mr-2 text-blue-500" /> Verified</div>
                    <div className="font-bold capitalize">{bid.verification_level || "Basic"}</div>
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        </div>
      </div>

      <AwardProjectModal 
        isOpen={!!selectedBid} 
        onClose={() => setSelectedBid(null)} 
        bidId={selectedBid!} 
        onSuccess={() => {
          setSelectedBid(null);
          router.push('/dashboard');
        }} 
      />
    </div>
  );
}
