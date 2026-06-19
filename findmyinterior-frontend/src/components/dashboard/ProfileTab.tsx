import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

export function ProfileTab() {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchListings = async () => {
    try {
      const res = await api.get("/user/listings");
      if (res.data.data.length > 0) {
        setListing(res.data.data[0]);
        setFormData({
          title: res.data.data[0].title,
          tagline: res.data.data[0].tagline || "",
          description: res.data.data[0].description || "",
          phone: res.data.data[0].phone || "",
          city: res.data.data[0].city || "",
          district: res.data.data[0].district || "",
          years_experience: res.data.data[0].years_experience || 0,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!listing) return;
    setSaving(true);
    try {
      await api.put(`/user/listings/${listing.id}`, formData);
      alert("Profile updated successfully!");
      fetchListings();
    } catch (e) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  if (!listing) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-slate-500">
          No business profile found. Please contact support.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Business Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name / Title</label>
          <Input name="title" value={formData.title} onChange={handleChange} />
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
        </div>
        
        <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white w-full">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
