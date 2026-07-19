"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, User, Send, ExternalLink, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";

function locationName(value: any) {
  return typeof value === "string" ? value : value?.name || "Location not set";
}

export function UnlockedLeadsTab({ unlockedContacts, onRefresh }: { unlockedContacts: any[], onRefresh: () => void }) {
  const [biddingId, setBiddingId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [timeline, setTimeline] = useState("");
  const [proposal, setProposal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [messaging, setMessaging] = useState<number | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  const handleMessage = async (requirementId: number, reqType?: string) => {
    setMessaging(requirementId);
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      const res = await api.post(`/requirements/${requirementId}/conversations${typeStr}`);
      router.push(`/messages/${res.data.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to start conversation.");
    } finally {
      setMessaging(null);
    }
  };

  const handleSubmitBid = async (requirementId: number) => {
    if (!amount || !timeline || !proposal) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/bids", {
        requirement_id: requirementId,
        estimated_cost: parseFloat(amount),
        timeline_days: parseInt(timeline),
        proposal_message: proposal,
        experience_years: 0,
        previous_projects_count: 0,
      });
      alert("Bid submitted successfully!");
      setBiddingId(null);
      setAmount("");
      setTimeline("");
      setProposal("");
      onRefresh(); // Refresh dashboard data to move this to "My Bids"
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit bid.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptAward = async (requirementId: number, reqType?: string) => {
    if (!confirm("Are you sure you want to accept this project and start work?")) return;
    setAcceptingId(requirementId);
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      await api.patch(`/requirements/${requirementId}/accept-award${typeStr}`);
      alert("Project accepted! Status updated to In Progress.");
      onRefresh();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to accept project.");
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unlocked Customer Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        {unlockedContacts && unlockedContacts.length > 0 ? (
          <div className="space-y-4">
            {unlockedContacts.map((unlock: any) => (
              <div key={unlock.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{unlock.requirement?.title}</h4>
                      <Badge variant="outline" className={unlock.requirement?.status === 'open' ? 'text-green-600 border-green-200' : 'text-slate-500'}>
                        Status: {unlock.requirement?.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-500 mb-4">{locationName(unlock.requirement?.city)} • ₹{unlock.requirement?.budget_min} - ₹{unlock.requirement?.budget_max}</div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2 mb-4">
                      <div className="font-semibold text-green-900 flex items-center mb-2">
                        <User className="w-4 h-4 mr-2" /> Contact Details
                      </div>
                      <div className="flex items-center text-sm text-slate-700">
                        <User className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                        <span className="font-medium">{unlock.requirement?.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-700">
                        <Phone className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                        <span className="font-medium">{unlock.requirement?.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-700">
                        <Mail className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                        <span className="font-medium">{unlock.requirement?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:w-48 shrink-0">
                    <Link href={`/requirements/${unlock.requirement?.id}`}>
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" /> View Details
                      </Button>
                    </Link>
                    {unlock.requirement?.status === 'open' && (
                      <Button 
                        onClick={() => setBiddingId(biddingId === unlock.requirement.id ? null : unlock.requirement.id)} 
                        className="bg-orange-600 hover:bg-orange-700 w-full"
                      >
                        <Send className="w-4 h-4 mr-2" /> 
                        {biddingId === unlock.requirement.id ? "Cancel Bid" : "Submit Bid"}
                      </Button>
                    )}
                    {/* DEBUG INFO */}
                    <div className="text-xs text-red-500">
                      Req ID: {unlock.requirement?.id} | 
                      Req Status: {unlock.requirement?.status} | 
                      Prof ID: {unlock.requirement?.professional_id} | 
                      User ID: {user?.id}
                    </div>
                    {unlock.requirement?.status === 'awarded' && (Number(unlock.requirement?.professional_id) === Number(user?.id) || Number(unlock.requirement?.worker_id) === Number(user?.id) || Number(unlock.requirement?.supplier_id) === Number(user?.id) || Number(unlock.requirement?.awarded_vendor_id) === Number(user?.id)) && (
                      <Button
                        onClick={() => handleAcceptAward(unlock.requirement.id, unlock.requirement_type === 'App\\Models\\Rfq' ? 'rfq' : (unlock.requirement_type === 'App\\Models\\WorkerJob' ? 'job' : 'project'))}
                        className="bg-green-600 hover:bg-green-700 w-full text-white"
                        disabled={acceptingId === unlock.requirement.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {acceptingId === unlock.requirement.id ? "Accepting..." : "Accept Award"}
                      </Button>
                    )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMessage(unlock.requirement.id, unlock.requirement_type === 'App\\Models\\Rfq' ? 'rfq' : (unlock.requirement_type === 'App\\Models\\WorkerJob' ? 'job' : 'project'))}
                        disabled={messaging === unlock.requirement.id}
                      >
                      <MessageSquare className="w-4 h-4 mr-2" /> 
                      {messaging === unlock.requirement.id ? "Opening..." : "Message Customer"}
                    </Button>
                  </div>
                </div>

                {/* Inline Bid Form */}
                {biddingId === unlock.requirement?.id && (
                  <div className="mt-4 border-t pt-4">
                    <h5 className="font-bold text-slate-800 mb-3">Submit your bid</h5>
                    <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 p-3 rounded-lg text-sm mb-4">
                      <strong>Pro tip:</strong> Clients are 3x more likely to accept bids from professionals with a complete profile. Don't forget to upload your portfolio and previous work in the <strong>Profile</strong> section!
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Bid Amount (₹)</label>
                        <input 
                          type="number" 
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                          placeholder="e.g. 50000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Estimated Timeline (Days)</label>
                        <input 
                          type="number" 
                          value={timeline}
                          onChange={e => setTimeline(e.target.value)}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                          placeholder="e.g. 30"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Cover Letter / Proposal</label>
                      <textarea 
                        rows={3}
                        value={proposal}
                        onChange={e => setProposal(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="Detail your approach and why you are the best fit..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setBiddingId(null)}>Cancel</Button>
                      <Button onClick={() => handleSubmitBid(unlock.requirement.id)} className="bg-orange-600 hover:bg-orange-700" disabled={submitting}>
                        {submitting ? "Placing Bid..." : "Submit Bid"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border border-dashed rounded-xl bg-slate-50">
            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Unlocked Contacts</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              You haven't unlocked any contacts yet. Go to Available Leads to find projects and unlock your first client!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
