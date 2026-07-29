"use client";

import React, { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Store, MapPin, Phone, Globe, Link, Briefcase, Users } from "lucide-react";

export default function VendorProfilePage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phone: "",
    address: "",
    website: "",
    years_experience: "",
    team_size: "",
    budget_tier: "",
    social_links: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: ""
    }
  });

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await TrueDialAPI.getMyBusiness();
      if (res.success && res.data) {
        setBusiness(res.data);
        const data = res.data;
        setFormData({
          title: data.title || "",
          description: data.description || "",
          phone: data.phone || "",
          address: data.address || "",
          website: data.website || "",
          years_experience: data.years_experience?.toString() || "",
          team_size: data.team_size?.toString() || "",
          budget_tier: data.budget_tier || "medium",
          social_links: {
            facebook: data.social_links?.facebook || "",
            instagram: data.social_links?.instagram || "",
            twitter: data.social_links?.twitter || "",
            linkedin: data.social_links?.linkedin || ""
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch business:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [name]: value }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!business) return;
    setSaving(true);
    
    // Prepare payload
    const payload = {
      ...formData,
      years_experience: formData.years_experience ? parseInt(formData.years_experience, 10) : null,
      team_size: formData.team_size ? parseInt(formData.team_size, 10) : null
    };

    try {
      const res = await TrueDialAPI.updateBusiness(business.id, payload);
      if (res.success) {
        setBusiness(res.data);
        alert("Business profile updated successfully!");
      } else {
        alert(res.message || "Failed to update business");
      }
    } catch (error) {
      console.error("Failed to update business:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-20 border border-dashed rounded-xl border-slate-300 dark:border-slate-700">
        <Store className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No business found</h3>
        <p className="mt-2 text-sm text-slate-500">Please complete your business registration first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Business Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business information visible to customers.
        </p>
      </div>

      <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
            <Store className="mr-2 h-5 w-5 text-[#E8701A]" />
            Basic Information
          </CardTitle>
          <CardDescription>Update your primary business details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-slate-300">
              Business Name
            </label>
            <Input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 transition-all focus:ring-2 focus:ring-[#E8701A]" 
              placeholder="e.g. Royal Restaurant"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-slate-300">
              Description
            </label>
            <Textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[120px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 transition-all focus:ring-2 focus:ring-[#E8701A]" 
              placeholder="Describe your business and services..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center dark:text-slate-300">
                <Phone className="mr-2 h-4 w-4 text-slate-400" />
                Phone Number
              </label>
              <Input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center dark:text-slate-300">
                <Globe className="mr-2 h-4 w-4 text-slate-400" />
                Website URL
              </label>
              <Input 
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none flex items-center dark:text-slate-300">
              <MapPin className="mr-2 h-4 w-4 text-slate-400" />
              Full Address
            </label>
            <Input 
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-[#E8701A]" />
            Business Details
          </CardTitle>
          <CardDescription>Tell customers about your experience and scale.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none dark:text-slate-300">
                Years of Experience
              </label>
              <Input 
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
                placeholder="e.g. 5"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none dark:text-slate-300 flex items-center">
                <Users className="mr-2 h-4 w-4 text-slate-400" />
                Team Size
              </label>
              <Input 
                type="number"
                name="team_size"
                value={formData.team_size}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
                placeholder="e.g. 15"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none dark:text-slate-300">
                Pricing Tier
              </label>
              <select 
                value={formData.budget_tier} 
                onChange={(e) => handleSelectChange('budget_tier', e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8701A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
              >
                <option value="" disabled>Select a tier</option>
                <option value="low">$ Budget</option>
                <option value="medium">$$ Standard</option>
                <option value="high">$$$ Premium</option>
                <option value="premium">$$$$ Luxury</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
            <Globe className="mr-2 h-5 w-5 text-[#E8701A]" />
            Social Links
          </CardTitle>
          <CardDescription>Connect your social media accounts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center dark:text-slate-300">
                <Link className="mr-2 h-4 w-4 text-slate-400" />
                Facebook URL
              </label>
              <Input 
                name="facebook"
                value={formData.social_links.facebook}
                onChange={handleSocialChange}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center dark:text-slate-300">
                <Link className="mr-2 h-4 w-4 text-slate-400" />
                Instagram URL
              </label>
              <Input 
                name="instagram"
                value={formData.social_links.instagram}
                onChange={handleSocialChange}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center dark:text-slate-300">
                <Link className="mr-2 h-4 w-4 text-slate-400" />
                Twitter URL
              </label>
              <Input 
                name="twitter"
                value={formData.social_links.twitter}
                onChange={handleSocialChange}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center dark:text-slate-300">
                <Link className="mr-2 h-4 w-4 text-slate-400" />
                LinkedIn URL
              </label>
              <Input 
                name="linkedin"
                value={formData.social_links.linkedin}
                onChange={handleSocialChange}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end sticky bottom-6 z-10 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <Button onClick={handleSave} disabled={saving} className="bg-[#E8701A] hover:bg-[#c95d13] text-white w-full sm:w-auto px-8 transition-transform active:scale-95">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
