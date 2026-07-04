"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Gavel } from "lucide-react";

export function PostedRequirementsTab({ data, fetchDashboard, onReviewClick }: { data: any, fetchDashboard: () => void, onReviewClick?: (professionalId: number, requirementId: number) => void }) {
  const router = useRouter();
  
  const requirements = ((data?.projects || []).concat(data?.rfqs || []).concat(data?.jobs || []));

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>My Posted Requirements</CardTitle>
        <Button onClick={() => router.push("/post-requirement")} size="sm" className="bg-orange-600 hover:bg-orange-700">Post New</Button>
      </CardHeader>
      <CardContent>
        {requirements.length > 0 ? (
          <div className="space-y-4 mt-4">
            {requirements.map((req: any) => {
              // Group bids that belong to this specific requirement
              const reqTypeStr = req.material_type ? 'rfq' : req.skill_required ? 'job' : 'project';
              const reqBids = (data?.received_bids || []).filter((b: any) => {
                if (b.requirement_id !== req.id) return false;
                const bType = String(b.requirement_type).toLowerCase();
                if (reqTypeStr === 'project' && (bType.includes('project') || bType.includes('requirement'))) return true;
                if (reqTypeStr === 'rfq' && bType.includes('rfq')) return true;
                if (reqTypeStr === 'job' && bType.includes('workerjob')) return true;
                return false;
              });

              return (
              <div key={req.id + '-' + reqTypeStr} className="flex flex-col p-4 border rounded-xl hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg text-slate-900">{req.title || req.material_type || req.skill_required}</h4>
                      <Badge variant="outline" className="bg-slate-100">{req.status}</Badge>
                      {req.material_type && <Badge variant="secondary">Material RFQ</Badge>}
                      {req.skill_required && <Badge variant="secondary">Worker Job</Badge>}
                    </div>
                    <div className="text-sm text-slate-500 mb-2 flex items-center gap-4">
                      <span>{req.city}</span>
                      <span>•</span>
                      <span>{req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2">{req.description || `Required: ${req.quantity || req.number_of_workers}`}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => router.push(`/requirements/${req.id}?type=${req._type || 'project'}`)} variant="outline" size="sm">View Detail</Button>
                      {(req.status === 'open' || req.status === 'posted') && (
                        <Button onClick={() => router.push(`/post-requirement?edit=${req.id}&type=${req._type || 'project'}`)} variant="secondary" size="sm">Edit</Button>
                      )}
                    </div>
                    
                    {(req.status === 'awarded' || req.status === 'in_progress') && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={async () => {
                          try {
                            const reqType = req._type || 'project';
                            await import('@/lib/api').then(m => m.default.patch(`/requirements/${req.id}/complete?requirement_type=${reqType}`));
                            alert("Project marked as completed!");
                            fetchDashboard();
                          } catch (err: any) {
                            alert(err.response?.data?.message || "Failed to complete project");
                          }
                        }}
                      >
                        Mark Completed
                      </Button>
                    )}
                    
                    {req.status === 'completed' && onReviewClick && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          if(req.professional_id) {
                            onReviewClick(req.professional_id, req.id);
                          } else {
                              alert("Cannot find awarded professional details. Please contact support.");
                          }
                        }}
                      >
                        Leave Review
                      </Button>
                    )}
                  </div>
                </div>

                {/* Received Bids Section */}
                {reqBids.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Gavel className="w-4 h-4 text-orange-500" /> 
                        Received Bids ({reqBids.length})
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {reqBids.slice(0, 4).map((bid: any) => (
                        <div key={bid.id} className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-between hover:bg-orange-50 transition-colors cursor-pointer" onClick={() => router.push(`/requirements/${req.id}?type=${req._type || 'project'}`)}>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{bid.professional?.name || 'Professional'}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">Bid: ₹{bid.amount || bid.proposed_amount || bid.price || 'N/A'}</div>
                          </div>
                          {bid.is_awarded || bid.status === 'accepted' ? (
                            <Badge className="bg-green-500 border-0">Awarded</Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-400 border-slate-200">Pending</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    {reqBids.length > 4 && (
                      <div className="mt-3 text-center">
                        <Button variant="link" size="sm" className="text-orange-600 h-auto p-0" onClick={() => router.push(`/requirements/${req.id}?type=${req._type || 'project'}`)}>
                          View all {reqBids.length} bids
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )})}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 border rounded-lg text-slate-500">
            You haven't posted any requirements yet.
            <div className="mt-4">
              <Link href="/post-requirement">
                <Button className="bg-orange-600 hover:bg-orange-700">Post a Requirement</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
