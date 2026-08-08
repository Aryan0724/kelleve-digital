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

              return (
                <div key={req.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 ${isRFQ ? 'bg-blue-50 dark:bg-blue-900/10' : isJob ? 'bg-green-50 dark:bg-green-900/10' : isBuilder ? 'bg-purple-50 dark:bg-purple-900/10' : 'bg-orange-50 dark:bg-orange-900/10'}`}></div>
                  
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3 relative z-10">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {req.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${isRFQ ? 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950' : isJob ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950' : isBuilder ? 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950' : 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950'}`}>
                            {isRFQ ? 'Material RFQ' : isJob ? 'Worker Job' : isBuilder ? 'Builder Project' : 'Client Project'}
                          </Badge>
                          {req.category?.name && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded line-clamp-1">
                              {req.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 mt-2 mb-3 gap-3 relative z-10">
                      {req.city && (
                        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {locationName(req.city)}</span>
                      )}
                      {req.project_type && (
                        <span className="flex items-center"><Search className="w-3.5 h-3.5 mr-1 text-slate-400" /> {req.project_type}</span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed relative z-10 mb-4">{req.description}</p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10 flex flex-col gap-3">
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
