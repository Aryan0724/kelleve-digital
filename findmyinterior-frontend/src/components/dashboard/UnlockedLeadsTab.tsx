"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, User, Send, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

export function UnlockedLeadsTab({ unlockedContacts, onRefresh }: { unlockedContacts: any[], onRefresh: () => void }) {
  const [biddingId, setBiddingId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [timeline, setTimeline] = useState("");
  const [proposal, setProposal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [messaging, setMessaging] = useState<number | null>(null);
  const router = useRouter();

  const handleMessage = async (requirementId: number) => {
    setMessaging(requirementId);
    try {
      const res = await api.post(`/requirements/${requirementId}/conversations`);
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
        amount: parseFloat(amount),
        timeline_days: parseInt(timeline),
        proposal
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
                    <div className="text-sm text-slate-500 mb-4">{unlock.requirement?.city?.name} • ₹{unlock.requirement?.budget_min} - ₹{unlock.requirement?.budget_max}</div>

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
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleMessage(unlock.requirement.id)}
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
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                        placeholder="Explain why you are the best fit for this project..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleSubmitBid(unlock.requirement.id)}
                        disabled={submitting}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {submitting ? "Submitting..." : "Confirm & Submit Bid"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 border border-dashed rounded-lg bg-slate-50">
            You haven't unlocked any contacts yet. Go to Available Leads to unlock your first client!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
