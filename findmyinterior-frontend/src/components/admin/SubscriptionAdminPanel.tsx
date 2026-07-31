"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function SubscriptionAdminPanel() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price_monthly: "",
    price_yearly: "",
    features: "",
    max_listings: 1,
    max_gallery_images: 10,
    lead_unlocks_per_month: 0,
    unlock_discount_percent: 0,
    can_see_all_leads: false,
    is_featured_listing: false,
    is_active: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/subscription-plans");
      setPlans(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan.id);
    setFormData({
      name: plan.name || "",
      slug: plan.slug || "",
      description: plan.description || "",
      price_monthly: plan.price_monthly ?? 0,
      price_yearly: plan.price_yearly ?? 0,
      features: (plan.features || []).join("\n"),
      max_listings: plan.max_listings ?? 1,
      max_gallery_images: plan.max_gallery_images ?? 10,
      lead_unlocks_per_month: plan.lead_unlocks_per_month ?? 0,
      unlock_discount_percent: plan.unlock_discount_percent ?? 0,
      can_see_all_leads: !!plan.can_see_all_leads,
      is_featured_listing: !!plan.is_featured_listing,
      is_active: !!plan.is_active
    });
  };

  const handleCreateNew = () => {
    setEditingPlan("new");
    setFormData({
      name: "",
      slug: "",
      description: "",
      price_monthly: "0",
      price_yearly: "0",
      features: "1 Active Listing\nUp to 5 Gallery Images\nContact Inquiry Form",
      max_listings: 1,
      max_gallery_images: 10,
      lead_unlocks_per_month: 0,
      unlock_discount_percent: 0,
      can_see_all_leads: false,
      is_featured_listing: false,
      is_active: true
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        price_monthly: Number(formData.price_monthly) || 0,
        price_yearly: Number(formData.price_yearly) || 0,
        max_listings: Number(formData.max_listings) || 0,
        max_gallery_images: Number(formData.max_gallery_images) || 0,
        lead_unlocks_per_month: Number(formData.lead_unlocks_per_month) || 0,
        unlock_discount_percent: Number(formData.unlock_discount_percent) || 0,
        features: formData.features.split("\n").map(f => f.trim()).filter(f => f)
      };

      if (editingPlan === "new") {
        await api.post("/admin/subscription-plans", payload);
      } else {
        await api.put(`/admin/subscription-plans/${editingPlan}`, payload);
      }
      
      setEditingPlan(null);
      fetchPlans();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to save plan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.delete(`/admin/subscription-plans/${id}`);
      fetchPlans();
    } catch (e: any) {
      alert("Failed to delete plan");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading plans...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subscription Plans</CardTitle>
            <p className="text-sm text-slate-500">Manage the platform subscription plans, pricing, and live backend enforcement limits.</p>
          </div>
          <Button onClick={handleCreateNew}>+ Create Plan</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(plan => (
              <Card key={plan.id} className="border shadow-sm flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{plan.name}</span>
                    <Badge variant={plan.is_active ? 'default' : 'secondary'}>{plan.is_active ? 'Active' : 'Disabled'}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="text-2xl font-bold">₹{plan.price_monthly}<span className="text-sm font-normal text-slate-500">/mo</span></div>
                  <div className="text-sm text-slate-500">₹{plan.price_yearly}/yr</div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Backend Enforced Limits</div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-xs bg-slate-50">
                        Listings: {plan.max_listings >= 99 ? "Unlimited" : plan.max_listings}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-slate-50">
                        Gallery: {plan.max_gallery_images >= 999 ? "Unlimited" : plan.max_gallery_images}
                      </Badge>
                      {plan.unlock_discount_percent > 0 && (
                        <Badge className="text-xs bg-indigo-100 text-indigo-800 border-none">
                          {plan.unlock_discount_percent}% Off Unlocks
                        </Badge>
                      )}
                      {plan.can_see_all_leads && (
                        <Badge className="text-xs bg-emerald-100 text-emerald-800 border-none">
                          See All Leads
                        </Badge>
                      )}
                      {plan.is_featured_listing && (
                        <Badge className="text-xs bg-amber-100 text-amber-800 border-none">
                          Priority Search Rank
                        </Badge>
                      )}
                    </div>
                  </div>

                  <ul className="text-sm space-y-2 mt-4 list-disc pl-4 text-slate-700">
                    {(plan.features || []).map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(plan.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl font-bold">
                {editingPlan === "new" ? "Create New Plan" : "Edit Subscription Plan"}
              </CardTitle>
              <p className="text-xs text-slate-500">
                Configure both user-facing feature descriptions and live backend execution rules.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Plan Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Elite" />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. elite" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Short subtitle for pricing card" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Monthly Price (₹)</Label>
                  <Input type="number" value={formData.price_monthly} onChange={e => setFormData({ ...formData, price_monthly: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Yearly Price (₹)</Label>
                  <Input type="number" value={formData.price_yearly} onChange={e => setFormData({ ...formData, price_yearly: e.target.value })} />
                </div>
              </div>

              {/* BACKEND ENFORCEMENT SECTION */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-semibold text-sm text-slate-800">Backend Enforced Limits (Dynamic Execution)</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Auto-enforced by system</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Max Active Listings</Label>
                    <Input
                      type="number"
                      value={formData.max_listings}
                      onChange={e => setFormData({ ...formData, max_listings: parseInt(e.target.value) || 0 })}
                      className="h-8 text-sm"
                    />
                    <p className="text-[10px] text-slate-500">99+ = Unlimited</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max Gallery Images</Label>
                    <Input
                      type="number"
                      value={formData.max_gallery_images}
                      onChange={e => setFormData({ ...formData, max_gallery_images: parseInt(e.target.value) || 0 })}
                      className="h-8 text-sm"
                    />
                    <p className="text-[10px] text-slate-500">999+ = Unlimited</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unlock Discount (%)</Label>
                    <Input
                      type="number"
                      value={formData.unlock_discount_percent}
                      onChange={e => setFormData({ ...formData, unlock_discount_percent: parseInt(e.target.value) || 0 })}
                      className="h-8 text-sm"
                    />
                    <p className="text-[10px] text-slate-500">0% to 100% discount</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="can_see_all_leads"
                      checked={formData.can_see_all_leads}
                      onCheckedChange={c => setFormData({ ...formData, can_see_all_leads: !!c })}
                    />
                    <Label htmlFor="can_see_all_leads" className="text-xs font-medium cursor-pointer">
                      View All Leads & Requirement Contacts
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="is_featured_listing"
                      checked={formData.is_featured_listing}
                      onCheckedChange={c => setFormData({ ...formData, is_featured_listing: !!c })}
                    />
                    <Label htmlFor="is_featured_listing" className="text-xs font-medium cursor-pointer">
                      Priority Search Ranking & Gold Badge
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Features Display List (One per line)</Label>
                <Textarea 
                  rows={5} 
                  value={formData.features} 
                  onChange={e => setFormData({ ...formData, features: e.target.value })} 
                  placeholder="Unlimited Active Listings&#10;Unlimited Gallery Images&#10;50% Discount on Lead Unlocks" 
                />
                <p className="text-xs text-slate-400">These bullet points are displayed to vendors on the pricing and checkout pages.</p>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={c => setFormData({ ...formData, is_active: !!c })} />
                <Label htmlFor="is_active" className="font-semibold text-sm cursor-pointer">Is Plan Active & Publicly Available?</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-slate-50/50">
              <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">Save Plan</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
