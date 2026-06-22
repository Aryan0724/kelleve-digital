"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, UserCircle, CheckCircle, MessageSquare, ArrowLeft } from "lucide-react";

export default function RfqDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [rfq, setRfq] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    api.get(`/rfqs/${params.id}`)
      .then(res => {
        setRfq(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id, user]);

  if (loading) return <div className="p-8 text-center">Loading RFQ...</div>;
  if (!rfq) return <div className="p-8 text-center text-red-500">RFQ not found or unauthorized.</div>;

  const isClient = user?.id === rfq.user_id;
  const isSupplier = user?.id === rfq.supplier_id;

  const handleMarkProgress = async (status: string) => {
    try {
      await api.post(`/rfqs/${rfq.id}/progress`, { status });
      alert(`RFQ status updated to ${status}`);
      window.location.reload();
    } catch (e) {
      alert("Failed to update progress.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <button onClick={() => router.back()} className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-widest text-[10px]">
                {rfq.status.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-slate-500 font-medium">RFQ #{rfq.id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">{rfq.title || "Untitled RFQ"}</h1>
          </div>
          
          <div className="flex gap-2">
            {isSupplier && rfq.status !== 'completed' && rfq.status !== 'cancelled' && (
              <select 
                onChange={(e) => handleMarkProgress(e.target.value)}
                value={rfq.status}
                className="h-10 px-3 rounded-md border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="awarded">Awarded</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Details Column */}
          <div className="col-span-2 p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">RFQ Details</h2>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3">
                <Package className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Description</div>
                  <div className="text-sm text-slate-600">{rfq.description}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 font-medium mb-1">Created On</div>
                  <div className="text-sm font-bold text-slate-900">
                    {new Date(rfq.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="border border-slate-100 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 font-medium mb-1">Status</div>
                  <div className="text-sm font-bold text-slate-900 capitalize">
                    {rfq.status.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* People Column */}
          <div className="col-span-1 p-6 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Participants</h2>
            
            <div className="space-y-6">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-2">Client (Creator)</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {isClient ? "You" : rfq.user?.name || "Client"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 font-medium mb-2">Supplier</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {isSupplier ? "You" : (rfq.supplier_id ? "Assigned Supplier" : "None yet")}
                    </div>
                  </div>
                </div>
              </div>
              
              <hr className="border-slate-200" />
              
              <Button 
                onClick={() => router.push(`/messages`)}
                className="w-full bg-[#0b1b36] hover:bg-slate-800"
              >
                <MessageSquare className="w-4 h-4 mr-2" /> Open Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
