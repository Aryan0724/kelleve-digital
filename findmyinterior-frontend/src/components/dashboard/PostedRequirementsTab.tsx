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
            {requirements.map((req: any) => (
              <div key={req.id + (req.material_type ? '-rfq' : req.skill_required ? '-job' : '-proj')} className="flex flex-col md:flex-row justify-between p-4 border rounded-xl hover:shadow-md transition-shadow bg-white">
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
            ))}
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
