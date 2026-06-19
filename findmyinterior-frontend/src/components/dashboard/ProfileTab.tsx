import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

export function ProfileTab() {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const completionScore = Object.values(formData).filter((val) => {
    if (typeof val === 'string') return val.trim().length > 0;
    if (typeof val === 'number') return val > 0;
    return false;
  }).length * 10; // Simple mock calculation

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
          gst_number: res.data.data[0].gst_number || "",
          pan_number: res.data.data[0].pan_number || "",
          address: res.data.data[0].address || "",
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

    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Business Profile</CardTitle>
            <CardDescription>Complete your profile to rank higher and win more trust.</CardDescription>
          </div>
          <div className="w-32 text-right space-y-1">
            <div className="text-xs font-medium text-slate-500">Profile Completion</div>
            <Progress value={completionScore} className="h-2" />
            <div className="text-xs font-bold text-orange-600">{completionScore}%</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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
          <div>
            <label className="block text-sm font-medium mb-1">GST Number (Optional)</label>
            <Input name="gst_number" value={formData.gst_number || ""} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PAN Number (Optional)</label>
            <Input name="pan_number" value={formData.pan_number || ""} onChange={handleChange} placeholder="ABCDE1234F" />
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
