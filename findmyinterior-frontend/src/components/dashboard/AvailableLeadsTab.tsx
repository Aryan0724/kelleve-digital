"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wallet } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function AvailableLeadsTab() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockingId, setUnlockingId] = useState<number | null>(null);
  const { user } = useAuthStore();

  const fetchRequirements = async () => {
    try {
      const res = await api.get("/requirements");
      setRequirements(res.data.data);
    } catch (err) {
      console.error("Failed to fetch requirements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleUnlock = async (id: number) => {
    setUnlockingId(id);
    try {
      await api.post(`/requirements/${id}/unlock`);
      alert("Contact unlocked successfully! Check your Unlocked Leads tab.");
      // Refresh to update wallet balance if needed (can be handled globally or refetched)
      fetchRequirements();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to unlock contact. Check your wallet balance.");
    } finally {
      setUnlockingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading available leads...</div>;

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
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {req.city.name}</span>
                    )}
                    <span className="capitalize px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                      {req.category?.name || 'General'}
                    </span>
                    <span>• {req.property_type || "N/A"}</span>
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-2">{req.description}</p>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0 border-l pl-4 md:items-center justify-center">
                  <div className="text-sm font-medium text-slate-600 mb-1 text-center">
                    Unlock Contact
                  </div>
                  <Button 
                    onClick={() => handleUnlock(req.id)} 
                    disabled={unlockingId === req.id}
                    className="bg-orange-600 hover:bg-orange-700 w-full"
                  >
                    {unlockingId === req.id ? "Unlocking..." : "Unlock (₹50)"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 border border-dashed rounded-lg bg-slate-50">
            No new leads available at the moment. Check back later!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
