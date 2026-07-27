"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Tag, Percent, PartyPopper, Plus, Calendar } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    discount_type: "percentage",
    discount_value: "",
    promo_code: "",
    status: "active",
    valid_until: ""
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("token") || "mock-token";
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/offers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setOffers(data.data.data || data.data); // Handle pagination or flat array
      } else {
        // Fallback mock if API fails/not fully seeded
        setOffers([
          { id: 1, title: 'Diwali Bonanza', discount_type: 'percentage', discount_value: '20', promo_code: 'DIWALI20', status: 'active', valid_until: new Date(Date.now() + 864000000).toISOString() },
          { id: 2, title: 'Happy Hours (2-5 PM)', discount_type: 'flat', discount_value: '500', promo_code: 'HAPPY', status: 'paused', valid_until: new Date(Date.now() + 8640000000).toISOString() }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
      // Fallback
      setOffers([
        { id: 1, title: 'Diwali Bonanza', discount_type: 'percentage', discount_value: '20', promo_code: 'DIWALI20', status: 'active', valid_until: new Date(Date.now() + 864000000).toISOString() },
        { id: 2, title: 'Happy Hours (2-5 PM)', discount_type: 'flat', discount_value: '500', promo_code: 'HAPPY', status: 'paused', valid_until: new Date(Date.now() + 8640000000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      // Create local mock for immediate UI update in MVP
      const newOffer = {
        id: Date.now(),
        ...formData,
      };
      
      setOffers([newOffer, ...offers]);
      setIsCreating(false);
      setFormData({ title: "", discount_type: "percentage", discount_value: "", promo_code: "", status: "active", valid_until: "" });
    } catch (error) {
      console.error("Failed to create offer:", error);
    } finally {
      setSaving(false);
    }
  };

  const getIcon = (type: string) => {
    if (type === 'percentage') return <Percent className="h-4 w-4" />;
    if (type === 'festival' || type === 'combo') return <PartyPopper className="h-4 w-4" />;
    return <Tag className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Offers & Discounts</h1>
          <p className="text-muted-foreground mt-2">
            Create promotional offers to attract more customers.
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-[#E8701A] hover:bg-[#c95d13] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Offer
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center">
              <Tag className="mr-2 h-5 w-5 text-[#E8701A]" />
              New Promotional Offer
            </CardTitle>
            <CardDescription>Setup your discount rules and validity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-slate-300">Offer Title</label>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Diwali Bonanza 20% Off" className="bg-slate-50 dark:bg-slate-900" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Discount Type</label>
                <select 
                  name="discount_type" 
                  value={formData.discount_type} 
                  onChange={handleChange}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="festival">Festival Special</option>
                  <option value="combo">Combo Offer</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Discount Value</label>
                <Input type="number" name="discount_value" value={formData.discount_value} onChange={handleChange} placeholder="e.g. 20" className="bg-slate-50 dark:bg-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Promo Code (Optional)</label>
                <Input name="promo_code" value={formData.promo_code} onChange={handleChange} placeholder="DIWALI20" className="bg-slate-50 dark:bg-slate-900" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-slate-300">Valid Until</label>
                <Input type="date" name="valid_until" value={formData.valid_until} onChange={handleChange} className="bg-slate-50 dark:bg-slate-900" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving || !formData.title || !formData.discount_value} className="bg-[#E8701A] hover:bg-[#c95d13] text-white">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tag className="mr-2 h-4 w-4" />}
                Launch Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div 
            key={offer.id} 
            className="relative overflow-hidden rounded-2xl border border-white/20 p-6 shadow-xl backdrop-blur-md bg-white dark:bg-gradient-to-br dark:from-[#0a1c3a] dark:to-[#050f24] transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-[#E8701A]">
                  {getIcon(offer.discount_type)}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white capitalize">{offer.discount_type.replace('_', ' ')}</h3>
              </div>
              <Badge variant={offer.status === 'active' ? 'default' : 'secondary'} className={offer.status === 'active' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}>
                {offer.status.toUpperCase()}
              </Badge>
            </div>

            <div className="my-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{offer.title}</h2>
              {offer.promo_code && (
                <div className="inline-block bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded px-3 py-1 font-mono text-sm text-slate-800 dark:text-slate-300">
                  CODE: {offer.promo_code}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/10 pt-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> 
                {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : 'No Expiry'}
              </div>
              <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 px-0">Edit</Button>
            </div>
          </div>
        ))}
        {offers.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-20 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
            <Tag className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No active offers</h3>
            <p className="mt-2 text-sm text-slate-500">Create an offer to boost your visibility and sales.</p>
          </div>
        )}
      </div>
    </div>
  );
}
