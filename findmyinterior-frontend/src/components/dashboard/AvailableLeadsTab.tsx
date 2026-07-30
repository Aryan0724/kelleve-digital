"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Link from "next/link";

function locationName(value: any) {
  return typeof value === "string" ? value : value?.name || "Location not set";
}

export function AvailableLeadsTab({ leads }: { leads?: any[] }) {
  const { user } = useAuthStore();
  const [unlockingId, setUnlockingId] = useState<number | null>(null);
  const [unlockedContacts, setUnlockedContacts] = useState<Record<number, any>>({});

  const requirements = leads || [];

  const handleUnlock = async (e: React.MouseEvent, id: number, reqType: string = '') => {
    e.preventDefault();
    e.stopPropagation();
    setUnlockingId(id);
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      const response = await api.post(`/requirements/${id}/unlock${typeStr}`);
      if (response.data?.contact) {
        setUnlockedContacts(prev => ({ ...prev, [id]: response.data.contact }));
      } else if (response.data?.data?.contact) {
        setUnlockedContacts(prev => ({ ...prev, [id]: response.data.data.contact }));
      } else {
        setUnlockedContacts(prev => ({ ...prev, [id]: { name: "Customer", phone: "Unlocked", email: "" } }));
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to unlock contact. Check your wallet balance.");
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
          <div className="space-y-4">
            {requirements.map((req: any) => {
              const oppType = req.opportunity_type || "PROJECT";
              const isRFQ = oppType === "RFQ";
              const isJob = oppType === "JOB";
              const isBuilder = oppType === "BUILDER_PROJECT";
              const isUnlocked = unlockedContacts[req.id] || (req.is_unlocked ? (req.unlocked_contact || { phone: req.phone, email: req.email, name: req.name }) : null);

              return (
                <div key={req.id} className={`p-4 border-l-4 rounded-lg bg-white dark:bg-slate-900/50 shadow-sm flex flex-col md:flex-row justify-between md:items-start gap-4 ${isRFQ ? 'border-l-blue-500' : isJob ? 'border-l-green-500' : isBuilder ? 'border-l-purple-500' : 'border-l-orange-500'} border-y border-r border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800`}>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${isRFQ ? 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950' : isJob ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950' : isBuilder ? 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950' : 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950'}`}>
                            {isRFQ ? 'Material RFQ' : isJob ? 'Worker Job' : isBuilder ? 'Builder Project' : 'Client Project'}
                          </Badge>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Posted recently</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{req.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-200">
                          {req.budget_min && req.budget_max ? `₹${req.budget_min} - ₹${req.budget_max}` : (req.budget || "Budget negotiable")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-sm text-slate-500 dark:text-slate-400 mt-2 mb-3 gap-3">
                      {req.city && (
                        <span className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500" /> {locationName(req.city)}</span>
                      )}
                      {req.category?.name && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300">
                          {req.category.name}
                        </span>
                      )}
                      {req.project_type && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300">{req.project_type}</span>
                      )}
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">{req.description}</p>
                  </div>
                  
                  {req.user_id !== user?.id && (
                    <div className="flex flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 pl-0 md:pl-4 md:items-center justify-center min-w-[150px]">
                      <Link href={`/requirements/${req.id}${isRFQ ? '?type=rfq' : isJob ? '?type=job' : ''}`} className="w-full">
                        <Button variant="outline" className="w-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                          View Details
                        </Button>
                      </Link>
                      {isUnlocked ? (
                        <div className="flex flex-col gap-1.5 w-full mt-1 bg-green-50 dark:bg-green-950/40 p-3 rounded-lg border border-green-200 dark:border-green-800 shadow-sm animate-in fade-in-50 duration-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-green-700 dark:text-green-400 uppercase tracking-wider">Unlocked Contact</span>
                            <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0">Active</Badge>
                          </div>
                          {isUnlocked.name && (
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              👤 {isUnlocked.name}
                            </div>
                          )}
                          <div className="text-sm font-extrabold text-slate-900 dark:text-white break-all flex items-center gap-1.5">
                            📞 <a href={`tel:${isUnlocked.phone}`} className="hover:underline text-green-700 dark:text-green-400 font-mono">{isUnlocked.phone || 'Phone available'}</a>
                          </div>
                          {isUnlocked.email && (
                            <div className="text-xs text-slate-600 dark:text-slate-300 break-all">
                              ✉️ {isUnlocked.email}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button 
                          type="button"
                          onClick={(e) => handleUnlock(e, req.id, isRFQ ? 'rfq' : isJob ? 'job' : '')} 
                          disabled={unlockingId === req.id}
                          className={`w-full mt-1 shadow-sm text-white ${isRFQ ? 'bg-blue-600 hover:bg-blue-700' : isJob ? 'bg-green-600 hover:bg-green-700' : isBuilder ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                        >
                          {unlockingId === req.id 
                            ? "Unlocking..." 
                            : `Unlock (${(user?.role === 'worker' || user?.role === 'skilled_worker' || user?.roles?.some((r: any) => r.slug === 'worker' || r.slug === 'skilled_worker')) ? 'Free' : (req.unlock_price_display || ('₹' + (req.unlock_price || 49)))})`}
                        </Button>
                      )}
                    </div>
                  )}
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
      </CardContent>
    </Card>
  );
}
