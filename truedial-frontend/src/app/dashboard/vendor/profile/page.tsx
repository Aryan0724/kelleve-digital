"use client";

import React, { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Store, MapPin, Phone, Globe, ShieldCheck, Upload, Link as LinkIcon, Clock, Zap, Star } from "lucide-react";
import { useVendorType } from "@/hooks/useVendorType";
import { useAuth } from "@/context/AuthContext";

export default function VendorProfilePage() {
  const { user } = useAuth();
  const config = useVendorType();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phone: "",
    address: "",
    website: "",
    availability: "",
    response_time: "",
    social_links: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: ""
    },
    services: [] as string[]
  });

  const [newService, setNewService] = useState("");

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await TrueDialAPI.getMyBusiness();
      if (res.success && res.data) {
        setBusiness(res.data);
        const sl = res.data.social_links || {};
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          website: res.data.website || "",
          availability: res.data.availability || "",
          response_time: res.data.response_time || "",
          social_links: {
            facebook: sl.facebook || "",
            instagram: sl.instagram || "",
            linkedin: sl.linkedin || "",
            twitter: sl.twitter || ""
          },
          services: res.data.services || []
        });
      }
    } catch (error) {
      console.error("Failed to fetch business:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value
      }
    }));
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let res;
      if (business) {
        res = await TrueDialAPI.updateBusiness(business.id, formData);
      } else {
        res = await TrueDialAPI.createBusiness(formData);
      }
      
      if (res.success) {
        setBusiness(res.data);
        alert("Business profile saved successfully!");
      } else {
        alert(res.message || "Failed to save business");
      }
    } catch (error) {
      console.error("Failed to save business:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {config.catalogLabel?.includes('Menu') ? 'Restaurant Profile' : config.catalogLabel?.includes('Medical') ? 'Clinic Profile' : 'Business Profile'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your {user?.professional_type ? user.professional_type.replace('_', ' ') : 'business'} information and preferences.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 transition-all">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" /> Core Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Business / Clinic Name</label>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-background/50 border-border focus:ring-primary/20 transition-all"
                  placeholder="e.g. Royal Dental Clinic"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Description</label>
                <Textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[120px] bg-background/50 border-border focus:ring-primary/20 transition-all"
                  placeholder="Describe your specialties and services..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" /> Contact Number
                  </label>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" /> Website URL
                  </label>
                  <Input 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="bg-background/50"
                    placeholder="https://"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> Full Address
                </label>
                <Input 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Specialties & Services
              </h2>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <Input 
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  placeholder="e.g. Root Canal, Modular Kitchen, Free Delivery..."
                  className="bg-background/50"
                />
                <Button onClick={addService} variant="secondary">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.services.map((srv, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center gap-2">
                    {srv}
                    <button onClick={() => removeService(idx)} className="hover:text-red-500 transition-colors">&times;</button>
                  </span>
                ))}
                {formData.services.length === 0 && (
                  <span className="text-sm text-muted-foreground italic">No specialties added yet.</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar Settings) */}
        <div className="space-y-8">
          
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> Operations
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Business Hours</label>
                <Input 
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g. Mon-Sat: 10 AM - 8 PM"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> Avg Response Time
                </label>
                <select 
                  name="response_time"
                  value={formData.response_time}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Response Time</option>
                  <option value="under_1_hour">Under 1 Hour</option>
                  <option value="same_day">Same Day</option>
                  <option value="within_24_hours">Within 24 Hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground">Social Presence</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-pink-500" />
                <Input 
                  name="instagram"
                  value={formData.social_links.instagram}
                  onChange={handleSocialChange}
                  placeholder="Instagram URL"
                  className="pl-9 bg-background/50"
                />
              </div>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-blue-600" />
                <Input 
                  name="facebook"
                  value={formData.social_links.facebook}
                  onChange={handleSocialChange}
                  placeholder="Facebook URL"
                  className="pl-9 bg-background/50"
                />
              </div>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-blue-400" />
                <Input 
                  name="linkedin"
                  value={formData.social_links.linkedin}
                  onChange={handleSocialChange}
                  placeholder="LinkedIn URL"
                  className="pl-9 bg-background/50"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5">
              <h2 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verification Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${business?.verification_level === 'verified' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {business?.verification_level === 'verified' ? 'Verified' : 'Pending'}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Upload your trade license and identity proof to unlock the Verified Badge.
              </p>
              <Button variant="outline" className="w-full text-xs font-medium border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-900/30">
                <Upload className="w-3.5 h-3.5 mr-2" /> Upload Documents
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
