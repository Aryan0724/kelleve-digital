"use client";

import { CheckCircle2, Award, XCircle, IndianRupee, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function BidComparisonMatrix({ bids, onAward, reqType }: { bids: any[], onAward: (bidId: number) => void, reqType?: string }) {
  const router = useRouter();
  
  const handleMessageVendor = async (vendorId: number) => {
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      const res = await api.post(`/requirements/${bids[0].requirement_id}/conversations${typeStr}`, { vendor_id: vendorId });
      router.push(`/messages/${res.data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to start conversation.");
    }
  };
  if (!bids || bids.length === 0) {
    return <div className="p-4 text-center text-slate-500">No bids to compare yet.</div>;
  }

  // Find recommended bid based on highest smart_bid_score
  const recommendedBidId = bids.reduce((prev, current) => {
    return (current.smart_bid_score > prev.smart_bid_score) ? current : prev;
  }, bids[0])?.id;

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {bids.map((bid) => {
          const isRecommended = bid.id === recommendedBidId;
          const professional = bid.professional;

          return (
            <div 
              key={bid.id} 
              className={`w-80 border rounded-xl overflow-hidden bg-white shadow-sm flex flex-col ${
                isRecommended ? 'ring-2 ring-orange-500 border-orange-500' : 'border-slate-200'
              }`}
            >
              {isRecommended && (
                <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1.5 flex justify-center items-center gap-1">
                  <Award className="w-4 h-4" /> Recommended Bid
                </div>
              )}
              
              <div className="p-5 flex-grow space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {professional?.avatar ? (
                      <img src={professional.avatar} alt={professional.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-slate-400 text-lg">{professional?.name?.charAt(0) || 'V'}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">
                      <a href={`/professionals/${professional?.id}`} target="_blank" rel="noreferrer" className="hover:text-[#ff6b00] hover:underline">
                        {professional?.name || 'Unknown Vendor'}
                      </a>
                    </h3>
                    {professional?.verification_level === 'business_verified' && (
                      <div className="flex items-center gap-1 text-green-600 text-xs mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Business
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold">Quote Amount</div>
                    <div className="text-2xl font-bold text-slate-900 flex items-center">
                      <IndianRupee className="w-5 h-5 mr-0.5" />
                      {Number(bid.amount).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-slate-100">
                    <div>
                      <div className="text-slate-500 text-xs">Timeline</div>
                      <div className="font-medium text-slate-800">{bid.timeline_days} Days</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">Warranty</div>
                      <div className="font-medium text-slate-800">{bid.warranty_months} Months</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">Projects</div>
                      <div className="font-medium text-slate-800">{bid.previous_projects_count}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">Score</div>
                      <div className="font-medium text-slate-800">{bid.smart_bid_score}/100</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-xs text-slate-500 font-semibold mb-2">Inclusions</div>
                    <div className="flex items-center text-xs text-slate-700">
                      {bid.material_included ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2" /> : <XCircle className="w-3.5 h-3.5 text-slate-300 mr-2" />}
                      Material
                    </div>
                    <div className="flex items-center text-xs text-slate-700">
                      {bid.labour_included ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2" /> : <XCircle className="w-3.5 h-3.5 text-slate-300 mr-2" />}
                      Labour
                    </div>
                    <div className="flex items-center text-xs text-slate-700">
                      {bid.design_included ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2" /> : <XCircle className="w-3.5 h-3.5 text-slate-300 mr-2" />}
                      Design
                    </div>
                    <div className="flex items-center text-xs text-slate-700">
                      {bid.supervision_included ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2" /> : <XCircle className="w-3.5 h-3.5 text-slate-300 mr-2" />}
                      Supervision
                    </div>
                  </div>

                  {bid.proposal_message && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-xs text-slate-500 font-semibold mb-1">Proposal snippet</div>
                      <p className="text-xs text-slate-600 line-clamp-3 italic">
                        "{bid.proposal_message}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto flex flex-col gap-2">
                <Button 
                  onClick={() => onAward(bid.id)}
                  className={`w-full ${isRecommended ? 'bg-[#E8701A] hover:bg-[#E8701A]/90' : 'bg-[#0a1c3a] hover:bg-[#0a1c3a]/90'} text-white font-bold`}
                >
                  Award to {professional?.name?.split(' ')[0] || 'Vendor'}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => handleMessageVendor(bid.professional_id)}>
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                  </Button>
                  <Button variant="outline" onClick={() => router.push(`/professionals/${professional?.id}`)}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
