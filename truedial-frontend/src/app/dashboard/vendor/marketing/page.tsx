"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Megaphone, MessageSquare, Mail, MessageCircle, Plus, Calendar, Users } from "lucide-react";

export default function MarketingCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "sms",
    content: "",
    audience: "all_customers",
    schedule_at: ""
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/marketing/campaigns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/marketing/campaigns`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setCampaigns([data.data, ...campaigns]);
        setIsCreating(false);
        setFormData({ name: "", type: "sms", content: "", audience: "all_customers", schedule_at: "" });
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'email': return <Mail className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-2">
            <Megaphone className="w-8 h-8 text-primary" /> Marketing Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Reach your customers through SMS, WhatsApp, and Email blasts.
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90 text-white shadow-md transition">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border border-border shadow-lg bg-card mb-8 animate-in fade-in slide-in-from-top-4 duration-300 rounded-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              New Campaign
            </CardTitle>
            <CardDescription>Design your message and select your audience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-300">Campaign Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Festival 50% Off" className="bg-slate-50 dark:bg-slate-900" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Channel</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Audience</label>
                <select 
                  name="audience" 
                  value={formData.audience} 
                  onChange={handleChange}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all_customers">All Past Customers</option>
                  <option value="recent_leads">Recent Leads (Last 30 Days)</option>
                  <option value="custom">Custom List</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-300">Message Content</label>
              <Textarea 
                name="content" 
                value={formData.content} 
                onChange={handleChange} 
                className="min-h-[100px] bg-slate-50 dark:bg-slate-900" 
                placeholder="Write your promotional message here..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-300">Schedule (Optional)</label>
              <Input type="datetime-local" name="schedule_at" value={formData.schedule_at} onChange={handleChange} className="bg-slate-50 dark:bg-slate-900" />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving} className="bg-primary hover:bg-primary/90 text-white transition">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Megaphone className="mr-2 h-4 w-4" />}
                Launch Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            className="relative overflow-hidden rounded-xl border border-border p-6 shadow-sm bg-card transition-all duration-300 hover:shadow-md group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-lg ${campaign.type === 'whatsapp' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {getTypeIcon(campaign.type)}
                </div>
                <h3 className="font-bold text-foreground">{campaign.name}</h3>
              </div>
              <Badge variant={campaign.status === 'completed' ? 'default' : 'secondary'} className={campaign.status === 'completed' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>
                {campaign.status}
              </Badge>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center"><Users className="mr-2 h-4 w-4" /> Audience</div>
                <span className="font-medium text-slate-900 dark:text-white">{campaign.audience_size} contacts</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> Sent Date</div>
                <span className="font-medium text-slate-900 dark:text-white">
                  {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-20 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
            <Megaphone className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No campaigns yet</h3>
            <p className="mt-2 text-sm text-slate-500">Create your first marketing blast to reach more customers.</p>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-navy dark:text-white mb-6">More Ways to Grow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border shadow-sm bg-card hover:border-[#E8701A]/50 transition cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-[#E8701A]/10 text-[#E8701A] rounded-lg">
                  <Megaphone className="w-5 h-5" />
                </div>
                TrueDial Promoted Listings
              </CardTitle>
              <CardDescription>Boost your business to the top of search results in your city.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold">Start Promoting</Button>
            </CardContent>
          </Card>
          
          <Card className="border border-border shadow-sm bg-card hover:border-blue-500/50 transition cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                Customer Loyalty Program
              </CardTitle>
              <CardDescription>Reward repeat customers with points and special discounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-blue-500/20 text-blue-600 font-bold hover:bg-blue-500/10">Configure Loyalty</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
