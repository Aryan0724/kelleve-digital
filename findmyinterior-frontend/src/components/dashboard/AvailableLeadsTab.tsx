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

  const requirements = leads || [];

  const handleUnlock = async (id: number) => {
    setUnlockingId(id);
    try {
      await api.post(`/requirements/${id}/unlock`);
      alert("Contact unlocked successfully! Check your Unlocked Leads tab.");
      // Refresh to update wallet balance if needed
      window.location.reload();
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
            {requirements.map((req: any) => (
              <div key={req.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-lg">{req.title}</h4>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      ₹{req.budget_min} - ₹{req.budget_max}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500 mt-1 mb-2 gap-3">
                    {req.city && (
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {locationName(req.city)}</span>
                    )}
                    <span className="capitalize px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                      {req.category?.name || 'General'}
                    </span>
                    <span>{req.project_type || "General project"}</span>
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-2">{req.description}</p>
                </div>
                
                {req.user_id !== user?.id && (
                  <div className="flex flex-col gap-2 shrink-0 border-l pl-4 md:items-center justify-center min-w-[140px]">
                    <div className="text-sm font-medium text-slate-600 text-center mb-1">
                      Action
                    </div>
                    <Link href={`/requirements/${req.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => handleUnlock(req.id)} 
                      disabled={unlockingId === req.id}
                      className="bg-orange-600 hover:bg-orange-700 w-full mt-1"
                    >
                      {unlockingId === req.id ? "Unlocking..." : "Unlock (₹50)"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
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
