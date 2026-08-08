"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EducationalBlogsFeed } from "@/components/shared/EducationalBlogsFeed";

function locationName(value: any) {
  return typeof value === "string" ? value : value?.name || "Location not set";
}

export function AvailableLeadsTab({ leads }: { leads?: any[] }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [unlockingId, setUnlockingId] = useState<number | null>(null);

  const requirements = leads || [];

  const handleUnlock = async (id: number, reqType: string = '') => {
    setUnlockingId(id);
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      await api.post(`/requirements/${id}/unlock${typeStr}`);
      alert("Contact unlocked successfully! Check your Unlocked Leads tab.");
      router.push(`/requirements/${id}${typeStr}`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 402 || err.response?.data?.message?.toLowerCase().includes('balance')) {
        alert("Insufficient wallet balance. Redirecting to wallet recharge...");
        router.push("/dashboard?tab=wallet");
      } else {
        alert(err.response?.data?.message || "Failed to unlock contact.");
      }
    } finally {
      setUnlockingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Leads</CardTitle>
      </CardHeader>
      <CardContent>
        {requirements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req: any) => {
              const oppType = req.opportunity_type || "PROJECT";
              const isRFQ = oppType === "RFQ";
              const isJob = oppType === "JOB";
              const isBuilder = oppType === "BUILDER_PROJECT";
              const isWorkerJob = isJob || req.category?.slug === 'workers' || req.opportunity_type === 'WORKER_JOB';

              const displayImage = req.images?.[0]?.image_url || req.image || (isRFQ ? "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80" : isJob ? "https://images.unsplash.com/photo-1504307651254-35680f356f27?w=400&q=80" : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80");

              return (
                <div key={req.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden">
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img src={displayImage} alt={req.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider text-white border-white/20 shadow-sm backdrop-blur-md ${isRFQ ? 'bg-blue-600/80' : isJob ? 'bg-green-600/80' : isBuilder ? 'bg-purple-600/80' : 'bg-orange-600/80'}`}>
                        {isRFQ ? 'Material RFQ' : isJob ? 'Worker Job' : isBuilder ? 'Builder Project' : 'Client Project'}
                      </Badge>
                      {req.category?.name && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black/50 text-white rounded backdrop-blur-md border border-white/20 line-clamp-1">
                          {req.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-3">
                      {req.title}
                    </h4>
                    
                    <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 mb-3 gap-3">
                      {req.city && (
                        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {locationName(req.city)}</span>
                      )}
                      {req.project_type && (
                        <span className="flex items-center"><Search className="w-3.5 h-3.5 mr-1 text-slate-400" /> {req.project_type}</span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">{req.description}</p>
                  
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-slate-400 font-medium">
                          Posted recently
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Budget</div>
                          <div className={`text-sm font-black ${isRFQ ? 'text-blue-600 dark:text-blue-500' : isJob ? 'text-green-600 dark:text-green-500' : isBuilder ? 'text-purple-600 dark:text-purple-500' : 'text-orange-600 dark:text-orange-500'}`}>
                            {req.budget_min && req.budget_max ? `₹${(req.budget_min/1000).toFixed(0)}k - ₹${(req.budget_max/1000).toFixed(0)}k` : (req.budget || "Negotiable")}
                          </div>
                        </div>
                      </div>

                      {req.user_id !== user?.id && (
                        <div className="flex gap-2 w-full mt-2">
                          <Link href={`/requirements/${req.id}${isRFQ ? '?type=rfq' : isJob ? '?type=job' : ''}`} className="flex-1">
                            <Button variant="outline" className="w-full text-xs h-9 hover:bg-slate-50 dark:hover:bg-slate-800">
                              View Details
                            </Button>
                          </Link>
                          <Button 
                            onClick={() => handleUnlock(req.id, isRFQ ? 'rfq' : isJob ? 'job' : '')} 
                            disabled={unlockingId === req.id}
                            className="flex-1 text-xs h-9 bg-slate-900 text-white hover:bg-orange-600 dark:bg-white dark:text-slate-900 dark:hover:bg-orange-500"
                          >
                            {unlockingId === req.id 
                              ? "Unlocking..." 
                              : isWorkerJob 
                                ? "Apply" 
                                : `Unlock (${(user?.role === 'worker' || user?.role === 'skilled_worker' || user?.roles?.some((r: any) => r.slug === 'worker' || r.slug === 'skilled_worker') || user?.subscription?.plan?.can_see_all_leads) ? 'Free' : '₹' + (req.unlock_price || 49)})`}
                          </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border border-dashed rounded-xl bg-slate-50">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Available Leads</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              There are no new leads matching your profile right now. We will notify you when new requirements are posted!
            </p>
          </div>
        )}
        <div className="mt-8">
          <EducationalBlogsFeed role={user?.role || "designer"} />
        </div>
      </CardContent>
    </Card>
  );
}
