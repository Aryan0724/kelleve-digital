"use client";

import { useState } from "react";
import { Megaphone, Send, Clock, CheckCircle2, Users, BarChart3, Plus, Sparkles, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Diwali Interior Fit-Out Special (20% Off)",
      channel: "SMS + Email",
      audience: "1,240 Privilege Card Holders",
      sentDate: "Oct 15, 2026",
      delivered: "99.1%",
      clicks: 412,
      status: "Completed"
    },
    {
      id: 2,
      title: "New Modular Kitchen Catalog Launch",
      channel: "SMS Broadcast",
      audience: "845 Recent Inquiries",
      sentDate: "Nov 1, 2026",
      delivered: "98.7%",
      clicks: 289,
      status: "Completed"
    },
    {
      id: 3,
      title: "Weekend VIP Consultation Campaign",
      channel: "Email Newsletter",
      audience: "3,100 TrueDial Members",
      sentDate: "Nov 28, 2026",
      delivered: "Scheduled",
      clicks: 0,
      status: "Scheduled"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    channel: "SMS + Email",
    audience: "Privilege Card Holders",
    message: ""
  });

  const [toastMessage, setToastMessage] = useState("");

  const TEMPLATES = [
    {
      name: "Festival Offer Blast",
      desc: "Announce seasonal 20%–50% discounts to nearby Privilege Card holders",
      text: "Celebrate the season with Aesthete Interiors! Enjoy Flat 25% Off on Modular Kitchens & Woodwork for TrueDial VIP Members. Show code VIP25. Call 9876543210."
    },
    {
      name: "New Product Arrival",
      desc: "Notify previous leads about your newly added luxury furniture or materials",
      text: "New arrival alert at our studio! Explore imported Italian Marble tables and fluted acoustics. Visit our Bandra showroom or check our TrueDial catalog."
    },
    {
      name: "Free Site Visit Invitation",
      desc: "High-conversion invite offering complimentary 3D consultation & estimate",
      text: "Planning a home or office renovation? Book a Free On-Site Consultation & 3D Design Estimate with our senior architects this week. Reply YES to schedule."
    }
  ];

  const handleApplyTemplate = (tmp: any) => {
    setSelectedTemplate(tmp.name);
    setForm({
      ...form,
      title: tmp.name,
      message: tmp.text
    });
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;

    const newCampaign = {
      id: Date.now(),
      title: form.title,
      channel: form.channel,
      audience: form.audience,
      sentDate: "Just now",
      delivered: "In Progress",
      clicks: 0,
      status: "Active"
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsCreating(false);
    setForm({ title: "", channel: "SMS + Email", audience: "Privilege Card Holders", message: "" });
    setSelectedTemplate(null);
    setToastMessage("Marketing campaign queued and broadcasting to TrueDial audience!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-1">SMS & Email Marketing Automation</h1>
          <p className="text-muted-foreground text-sm">
            Launch targeted promotions to verified TrueDial Privilege Card members and past leads.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          className="flex items-center gap-2 font-semibold shadow-sm"
        >
          {isCreating ? "View All Campaigns" : "Create New Campaign"}
          {!isCreating && <Plus className="w-4 h-4" />}
        </Button>
      </div>

      {/* CREATE CAMPAIGN SECTION */}
      {isCreating ? (
        <div className="premium-card p-6 rounded-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">Campaign Builder & AI Templates</h3>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Instant Delivery via Verified Sender ID
            </Badge>
          </div>

          {/* Quick AI Templates */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
              1. Choose a High-Conversion Template (or write from scratch)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TEMPLATES.map((tmp) => (
                <div 
                  key={tmp.name}
                  onClick={() => handleApplyTemplate(tmp)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    selectedTemplate === tmp.name 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="font-bold text-sm text-foreground mb-1">{tmp.name}</div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{tmp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleLaunchCampaign} className="space-y-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Campaign Name *
                </label>
                <Input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. November Kitchen VIP Blast" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Delivery Channel
                </label>
                <select
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="SMS + Email">SMS + Email Broadcast</option>
                  <option value="SMS Broadcast">SMS Only</option>
                  <option value="Email Newsletter">Email Only</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Target Audience
                </label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Privilege Card Holders (Multi-City)">Privilege Card Holders (All Cities)</option>
                  <option value="Recent Inquiries & Leads">Recent Inquiries & Leads</option>
                  <option value="Mumbai Suburban VIP Members">Local City VIP Members</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Message Content (Max 160 chars for SMS standard) *
              </label>
              <Textarea 
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Type your promotional SMS or email body here..."
                required 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{form.message.length} characters</span>
                <span>Contains verified link tracking</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold px-8 flex items-center gap-2">
                <Send className="w-4 h-4" /> Launch Campaign
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="premium-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase">Total Audience Reached</div>
                <div className="text-2xl font-bold text-foreground">5,185</div>
              </div>
            </div>

            <div className="premium-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase">Avg. Delivery Rate</div>
                <div className="text-2xl font-bold text-foreground">98.9%</div>
              </div>
            </div>

            <div className="premium-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase">Link Clicks & Engagements</div>
                <div className="text-2xl font-bold text-foreground">701</div>
              </div>
            </div>
          </div>

          {/* CAMPAIGN TABLE / LIST */}
          <div className="premium-card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg text-foreground">Recent Campaigns & Broadcasts</h3>
              <Badge variant="outline" className="text-xs">
                {campaigns.length} Campaigns
              </Badge>
            </div>

            <div className="divide-y divide-border">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-base text-foreground">{camp.title}</h4>
                      <Badge className={`text-xs ${
                        camp.status === "Completed" ? "bg-green-500/20 text-green-600 border-green-200" :
                        camp.status === "Active" ? "bg-primary text-primary-foreground animate-pulse" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {camp.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {camp.channel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {camp.audience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {camp.sentDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Delivery</div>
                      <div className="font-bold text-sm text-foreground">{camp.delivered}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Link Clicks</div>
                      <div className="font-bold text-sm text-primary">{camp.clicks}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
