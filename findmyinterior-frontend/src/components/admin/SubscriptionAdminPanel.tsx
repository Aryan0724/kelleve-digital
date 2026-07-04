"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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
    features: "", // We'll parse to array of strings
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
      name: plan.name,
      slug: plan.slug,
      description: plan.description || "",
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly,
      features: (plan.features || []).join("\n"),
      is_active: plan.is_active
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
      features: "Feature 1\nFeature 2",
      is_active: true
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
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
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Subscription Plans</CardTitle>
            <p className="text-sm text-slate-500">Manage the platform subscription plans, pricing, and features.</p>
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
                  <ul className="text-sm space-y-2 mt-4 list-disc pl-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingPlan === "new" ? "Create New Plan" : "Edit Plan"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
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
              <div className="space-y-1.5">
                <Label>Features (One per line)</Label>
                <Textarea 
                  rows={5} 
                  value={formData.features} 
                  onChange={e => setFormData({ ...formData, features: e.target.value })} 
                  placeholder="Feature 1&#10;Feature 2" 
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_active} onCheckedChange={c => setFormData({ ...formData, is_active: c })} />
                <Label>Is Active?</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
