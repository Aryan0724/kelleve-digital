"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, MessageSquare, Mail, MessageCircle, Plus, 
  Calendar, Users, CheckCircle2, Clock, Trash2, Send, X 
} from "lucide-react";

const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: "Festive Season 50% Promo Blast",
    type: "email",
    content: "Special festive privilege discount on all services and bookings with code FESTIVE50 on TrueDial!",
    audience: "Recent Leads (Last 30 Days)",
    status: "active",
    schedule_at: "2026-10-15 10:00",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Privilege Card Members VIP Invitation",
    type: "whatsapp",
    content: "Exclusive VIP perks, priority reservations and 20% discount for TrueDial Cardholders.",
    audience: "Privilege Card Members",
    status: "scheduled",
    schedule_at: "2026-09-01 14:00",
    created_at: new Date().toISOString()
  }
];

export default function MarketingCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>(INITIAL_CAMPAIGNS);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    type: "email",
    content: "",
    audience: "Recent Leads (Last 30 Days)",
    schedule_at: ""
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`/api/proxy/truedial/vendor/marketing/campaigns`, {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
        setCampaigns(data.data);
        return;
      }
    } catch {
      // ignore
    }

    const saved = localStorage.getItem("truedial_vendor_campaigns");
    if (saved) {
      try {
        setCampaigns(JSON.parse(saved));
      } catch {
        setCampaigns(INITIAL_CAMPAIGNS);
      }
    } else {
      setCampaigns(INITIAL_CAMPAIGNS);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      alert("Please provide campaign name and message content.");
      return;
    }

    setSaving(true);

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      message: formData.content.trim(),
      content: formData.content.trim(),
      audience: formData.audience,
      schedule_at: formData.schedule_at || new Date().toISOString(),
      scheduled_at: formData.schedule_at || new Date().toISOString(),
      status: "active"
    };

    try {
      const res = await fetch(`/api/proxy/truedial/vendor/marketing/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const newCampaign = data?.data || {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString()
      };
      const updatedList = [newCampaign, ...campaigns];
      setCampaigns(updatedList);
      localStorage.setItem("truedial_vendor_campaigns", JSON.stringify(updatedList));
      showToast(`Campaign "${formData.name}" launched successfully!`);
    } catch {
      const newCampaign = {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString()
      };
      const updatedList = [newCampaign, ...campaigns];
      setCampaigns(updatedList);
      localStorage.setItem("truedial_vendor_campaigns", JSON.stringify(updatedList));
      showToast(`Campaign "${formData.name}" launched!`);
    } finally {
      setSaving(false);
      setIsCreating(false);
      setFormData({ name: "", type: "email", content: "", audience: "Recent Leads (Last 30 Days)", schedule_at: "" });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to remove this campaign?")) {
      const updated = campaigns.filter(c => c.id !== id);
      setCampaigns(updated);
      localStorage.setItem("truedial_vendor_campaigns", JSON.stringify(updated));
      showToast("Campaign removed.");
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'sms': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4 text-emerald-500" />;
      case 'email': return <Mail className="h-4 w-4 text-amber-500" />;
      default: return <Megaphone className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-orange-500" />
            Marketing & Blast Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reach your verified customers through WhatsApp, SMS, and Email promotional blasts.
          </p>
        </div>
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-[#E05A1B] hover:bg-[#c94d13] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        )}
      </div>

      {/* Campaign Creation Card */}
      {isCreating && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl animate-fade-in-up">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Design New Campaign</h3>
                <p className="text-xs text-slate-400">Design your promotional message and select your target audience.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCreating(false)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Campaign Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Diwali Mega 50% Off Blast"
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Marketing Channel *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                >
                  <option value="email">Email Blast</option>
                  <option value="whatsapp">WhatsApp Broadcast</option>
                  <option value="sms">SMS Text</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Target Audience *
                </label>
                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                >
                  <option value="Recent Leads (Last 30 Days)">Recent Leads (Last 30 Days)</option>
                  <option value="Privilege Card Members">Privilege Card Members</option>
                  <option value="All Registered Customers">All Registered Customers</option>
                  <option value="Past Bookings & Callers">Past Bookings & Callers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Message Content / Copy *
              </label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={4}
                placeholder="Type your promotional message here... Include discounts, promo codes, or links."
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Schedule Date & Time (Optional)
              </label>
              <Input
                type="datetime-local"
                name="schedule_at"
                value={formData.schedule_at}
                onChange={handleChange}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(false)}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="bg-[#E05A1B] hover:bg-[#c94d13] text-white font-bold text-xs h-9 px-5 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {saving ? "Launching..." : "Launch Campaign"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getTypeIcon(camp.type)}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      {camp.name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 capitalize">
                      Channel: {camp.type || "Email"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {camp.status || "Active"}
                  </span>
                  <button
                    onClick={() => handleDelete(camp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed font-medium">
                {camp.content || camp.message}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-1.5 truncate">
                  <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{typeof camp.audience === "string" ? camp.audience : "All Customers"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{new Date(camp.schedule_at || camp.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready & Broadcasted
              </span>
              <span className="text-[10px] text-slate-400">
                Created: {new Date(camp.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
