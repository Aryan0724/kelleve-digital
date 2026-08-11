"use client";

import React, { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Store, MapPin, Phone, Globe, ShieldCheck, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  });

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await TrueDialAPI.getMyBusiness();
      if (res.success && res.data) {
        setBusiness(res.data);
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          website: res.data.website || "",
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

  const handleSave = async () => {
    if (!business) return;
    setSaving(true);
    try {
      const res = await TrueDialAPI.updateBusiness(business.id, formData);
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Business Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business information visible to customers.
        </p>
      </div>

      <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
            <Store className="mr-2 h-5 w-5 text-[#E8701A]" />
            Basic Information
          </CardTitle>
          <CardDescription>Update your primary business details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300">
              Business Name
            </label>
            <Input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
              placeholder="e.g. Royal Restaurant"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300">
              Description
            </label>
            <Textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[120px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
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
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
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
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
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
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
            />
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 mt-6">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-emerald-500" />
                Verification & Documents
              </CardTitle>
              <CardDescription className="mt-1">Upload legal documents to get the TrueDial Verified Badge.</CardDescription>
            </div>
            <Badge className={business?.verification_level === 'verified' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}>
              {business?.verification_level === 'verified' ? 'Verified' : 'Pending Verification'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-1 flex items-center justify-between">
                GST / Trade License
                <Upload className="w-4 h-4 text-muted-foreground" />
              </h4>
              <p className="text-xs text-muted-foreground mb-3">Required for B2B transactions and RFQs</p>
              <Input type="file" className="text-xs" accept=".pdf,.jpg,.png" />
            </div>
            
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-1 flex items-center justify-between">
                Aadhar / PAN Card
                <Upload className="w-4 h-4 text-muted-foreground" />
              </h4>
              <p className="text-xs text-muted-foreground mb-3">Required for identity verification</p>
              <Input type="file" className="text-xs" accept=".pdf,.jpg,.png" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} disabled={saving} className="bg-[#E8701A] hover:bg-[#c95d13] text-white">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
