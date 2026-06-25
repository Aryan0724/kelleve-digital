import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

export function ProfileTab() {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const [categories, setCategories] = useState<any[]>([]);

  const completionScore = Math.min(100, Math.round((Object.values(formData).filter((val) => {
    if (typeof val === 'string') return val.trim().length > 0;
    if (typeof val === 'number') return val > 0;
    return false;
  }).length / 12) * 100)); // 12 is the total number of fields including category_id

  const fetchData = async () => {
    try {
      const [listingsRes, categoriesRes] = await Promise.all([
        api.get("/user/listings"),
        api.get("/categories")
      ]);
      
      setCategories(categoriesRes.data || []);

      if (listingsRes.data.data.length > 0) {
        setListing(listingsRes.data.data[0]);
        setFormData({
          title: listingsRes.data.data[0].title,
          tagline: listingsRes.data.data[0].tagline || "",
          description: listingsRes.data.data[0].description || "",
          phone: listingsRes.data.data[0].phone || "",
          city: listingsRes.data.data[0].city || "",
          district: listingsRes.data.data[0].district || "",
          years_experience: listingsRes.data.data[0].years_experience || 0,
          gst_number: listingsRes.data.data[0].gst_number || "",
          pan_number: listingsRes.data.data[0].pan_number || "",
          address: listingsRes.data.data[0].address || "",
          website: listingsRes.data.data[0].website || "",
          category_id: listingsRes.data.data[0].category?.id || "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (listing) {
        await api.put(`/user/listings/${listing.id}`, formData);
      } else {
        await api.post(`/user/listings`, formData);
      }
      alert("Profile updated successfully!");
      fetchData();
    } catch (e) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Business Profile</CardTitle>
            <CardDescription>Complete your profile to rank higher and win more trust.</CardDescription>
          </div>
          <div className="w-32 text-right space-y-1">
            <div className="text-xs font-medium text-slate-500">Profile Completion</div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-600 transition-all duration-500 ease-out" 
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <div className="text-xs font-bold text-orange-600">{completionScore}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!listing && (
          <div>
            <label className="block text-sm font-medium mb-1">Business Category</label>
            <select 
              name="category_id" 
              value={formData.category_id || ""} 
              onChange={handleChange} 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a Category</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Business Name / Title</label>
          <Input name="title" value={formData.title || ""} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tagline</label>
          <Input name="tagline" value={formData.tagline} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea name="description" value={formData.description} onChange={handleChange} className="h-24" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Years of Experience</label>
            <Input type="number" name="years_experience" value={formData.years_experience} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input name="city" value={formData.city} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <Input name="district" value={formData.district} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GST Number (Optional)</label>
            <Input name="gst_number" value={formData.gst_number || ""} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PAN Number (Optional)</label>
            <Input name="pan_number" value={formData.pan_number || ""} onChange={handleChange} placeholder="ABCDE1234F" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Website URL (Optional)</label>
            <Input name="website" value={formData.website || ""} onChange={handleChange} placeholder="https://mywebsite.com" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Full Office Address</label>
          <Textarea name="address" value={formData.address || ""} onChange={handleChange} className="h-16" placeholder="Plot 123, Street Name..." />
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white w-full md:w-auto">
            {saving ? "Saving..." : "Save Profile Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
