"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

export function AdvertisementsAdminPanel() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "hero_banner",
    media_type: "image",
    banner_url: "",
    custom_code: "",
    link: "",
    target_city: "",
    target_category_id: "",
    target_role: "",
    starts_at: "",
    ends_at: "",
    max_impressions: "",
    max_clicks: "",
    is_active: true
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: "",
      location: "hero_banner",
      media_type: "image",
      banner_url: "",
      custom_code: "",
      link: "",
      target_city: "",
      target_category_id: "",
      target_role: "",
      starts_at: "",
      ends_at: "",
      max_impressions: "",
      max_clicks: "",
      is_active: true
    });
  };

  const handleEdit = (ad: any) => {
    setFormData({
      title: ad.title || "",
      location: ad.location || "hero_banner",
      media_type: ad.media_type || "image",
      banner_url: ad.banner_url || "",
      custom_code: ad.custom_code || "",
      link: ad.link || "",
      target_city: ad.target_city || "",
      target_category_id: ad.target_category_id || "",
      target_role: ad.target_role || "",
      starts_at: ad.starts_at ? new Date(ad.starts_at).toISOString().split('T')[0] : "",
      ends_at: ad.ends_at ? new Date(ad.ends_at).toISOString().split('T')[0] : "",
      max_impressions: ad.max_impressions || "",
      max_clicks: ad.max_clicks || "",
      is_active: ad.is_active === undefined ? true : ad.is_active
    });
    setEditingId(ad.id);
    setIsCreating(true);
  };

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/advertisements");
      setAds(res.data.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/advertisements/${editingId}`, formData);
      } else {
        await api.post("/admin/advertisements", formData);
      }
      resetForm();
      fetchAds();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${editingId ? 'update' : 'save'} advertisement.`);
    }
  };

  const deleteAd = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/admin/advertisements/${id}`);
      fetchAds();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (ad: any) => {
    try {
      await api.put(`/admin/advertisements/${ad.id}`, { is_active: !ad.is_active });
      fetchAds();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advertisements Management</h2>
        <Button onClick={() => isCreating ? resetForm() : setIsCreating(true)}>
          {isCreating ? "Cancel" : <><PlusCircle className="w-4 h-4 mr-2" /> Create Ad</>}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Advertisement" : "Create New Advertisement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Title</label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div>
                  <label className="text-sm font-semibold">Location</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="hero_banner">Hero Banner</option>
                    <option value="mid_page">Mid Page</option>
                    <option value="right_sidebar">Right Sidebar</option>
                    <option value="popup">Popup</option>
                    <option value="top_ribbon">Top Ribbon</option>
                    <option value="search_feed">Search Feed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Media Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.media_type} 
                    onChange={e => setFormData({...formData, media_type: e.target.value as any})}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="html">HTML</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Target Link URL</label>
                  <Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold">Target City (Optional)</label>
                  <Input placeholder="e.g. Patna" value={formData.target_city} onChange={e => setFormData({...formData, target_city: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold">Target Category ID (Optional)</label>
                  <Input type="number" placeholder="e.g. 1" value={formData.target_category_id} onChange={e => setFormData({...formData, target_category_id: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold">Target Role (Optional)</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.target_role} 
                    onChange={e => setFormData({...formData, target_role: e.target.value})}
                  >
                    <option value="">All Users</option>
                    <option value="customer">Customer</option>
                    <option value="interior_designer">Interior Designer</option>
                    <option value="architect">Architect</option>
                    <option value="contractor">Contractor</option>
                    <option value="supplier">Supplier</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Start Date (Optional)</label>
                  <Input type="date" value={formData.starts_at} onChange={e => setFormData({...formData, starts_at: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold">End Date (Optional)</label>
                  <Input type="date" value={formData.ends_at} onChange={e => setFormData({...formData, ends_at: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold">Max Impressions (0 = Unlimited)</label>
                  <Input type="number" min="0" value={formData.max_impressions} onChange={e => setFormData({...formData, max_impressions: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold">Max Clicks (0 = Unlimited)</label>
                  <Input type="number" min="0" value={formData.max_clicks} onChange={e => setFormData({...formData, max_clicks: e.target.value})} />
                </div>
              </div>
              
              {(formData.media_type === "image" || formData.media_type === "video") && (
                <div>
                  <label className="text-sm font-semibold">Media URL</label>
                  <Input value={formData.banner_url} onChange={e => setFormData({...formData, banner_url: e.target.value})} required />
                </div>
              )}

              {formData.media_type === "html" && (
                <div>
                  <label className="text-sm font-semibold">HTML Code</label>
                  <textarea 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={4}
                    value={formData.custom_code} 
                    onChange={e => setFormData({...formData, custom_code: e.target.value})} 
                    required 
                  />
                </div>
              )}

              <Button type="submit">Save Advertisement</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : ads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No advertisements found.</div>
        ) : (
          ads.map(ad => (
            <Card key={ad.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {ad.media_type === 'image' && ad.banner_url ? (
                    <img src={ad.banner_url} alt={ad.title} className="w-24 h-16 object-cover rounded bg-slate-100" />
                  ) : (
                    <div className="w-24 h-16 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500 uppercase">
                      {ad.media_type}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{ad.title || "Untitled Ad"}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{ad.location}</Badge>
                      <Badge variant={ad.is_active ? "default" : "secondary"}>{ad.is_active ? "Active" : "Paused"}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Stats: {ad.stats?.reduce((acc: any, curr: any) => acc + curr.impressions, 0) || 0} Impressions, {ad.stats?.reduce((acc: any, curr: any) => acc + curr.clicks, 0) || 0} Clicks
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                    <Edit2 className="w-4 h-4 mr-1 text-slate-500" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleStatus(ad)}>
                    {ad.is_active ? <XCircle className="w-4 h-4 mr-1 text-red-500" /> : <CheckCircle className="w-4 h-4 mr-1 text-green-500" />}
                    {ad.is_active ? "Pause" : "Activate"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteAd(ad.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
