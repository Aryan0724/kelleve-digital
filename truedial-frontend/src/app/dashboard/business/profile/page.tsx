"use client";

import { useState, useEffect } from "react";
import { Building2, MapPin, Phone, Globe, Save, Mail, Clock, Share2, Award, FileText, CheckCircle2, Plus, X, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const DEFAULT_PROFILE = {
  id: 1,
  title: "Aesthete Interior & Architectural Studio",
  tagline: "Crafting Timeless Living & Commercial Spaces Since 2012",
  description: "We are an award-winning architectural and interior design practice specializing in luxury residential, bespoke furniture, modular kitchens, and turnkey commercial fit-outs across India.",
  phone: "+91 9876543210",
  whatsapp: "+91 9876543210",
  email: "studio@aestheteinteriors.com",
  website: "https://www.aestheteinteriors.com",
  address: "402, Pinnacle Corporate Tower, Bandra Kurla Complex",
  city: "Mumbai",
  district: "Mumbai Suburban",
  state: "Maharashtra",
  pincode: "400051",
  gstin: "27AABCU9603R1ZM",
  working_hours: "9:00 AM - 8:00 PM (Mon-Sat)",
  google_maps_url: "https://maps.google.com/?q=19.0657,72.8687",
  facebook: "https://facebook.com/aesthete.studio",
  instagram: "https://instagram.com/aesthete.studio",
  linkedin: "https://linkedin.com/company/aesthete-studio",
  youtube: "https://youtube.com/@aestheteinteriors",
  logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop",
  cover_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  specialties: ["Luxury Residential", "Modular Kitchens", "Turnkey Interiors", "Bespoke Furniture", "Architectural Woodwork", "Commercial Fit-outs"],
};

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState<any>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || "";
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/truedial/vendor/my-business`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setProfile({ ...DEFAULT_PROFILE, ...data.data });
        }
      } catch (err) {
        // Fallback to DEFAULT_PROFILE if offline or unseeded
        setProfile(DEFAULT_PROFILE);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialty.trim()) return;
    if (!profile.specialties.includes(newSpecialty.trim())) {
      setProfile((prev: any) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
    }
    setNewSpecialty("");
  };

  const handleRemoveSpecialty = (item: string) => {
    setProfile((prev: any) => ({
      ...prev,
      specialties: prev.specialties.filter((s: string) => s !== item)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || "";
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/truedial/vendor/businesses/${profile.id || 1}`;
      
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setToastMessage("Business profile saved successfully!");
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white mb-1">Business Profile & Details</h1>
          <p className="text-muted-foreground text-sm">
            Complete your listing information to match TrueDial & Find My Interior search rankings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/30 py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Verified Listing
          </Badge>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 font-semibold">
            {saving ? "Saving..." : "Save Changes"}
            {!saving && <Save className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: Branding & Media (Logo & Cover) */}
        <div className="premium-card p-6 rounded-xl space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 pb-3 border-b border-border">
            <ImageIcon className="w-5 h-5 text-primary" /> Branding & Media
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo URL */}
            <div className="md:col-span-1 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Business Logo URL
              </label>
              <div className="flex items-center gap-3">
                {profile.logo ? (
                  <img src={profile.logo} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-border shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-bold">Logo</div>
                )}
                <Input 
                  value={profile.logo} 
                  onChange={(e) => handleChange("logo", e.target.value)} 
                  placeholder="https://..." 
                  className="text-xs" 
                />
              </div>
            </div>

            {/* Cover Banner URL */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Cover / Banner Image URL
              </label>
              <div className="flex items-center gap-3">
                {profile.cover_image ? (
                  <img src={profile.cover_image} alt="Cover" className="w-32 h-16 rounded-xl object-cover border border-border shadow-sm" />
                ) : (
                  <div className="w-32 h-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-bold">Banner</div>
                )}
                <Input 
                  value={profile.cover_image} 
                  onChange={(e) => handleChange("cover_image", e.target.value)} 
                  placeholder="https://..." 
                  className="text-xs" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Basic Information */}
        <div className="premium-card p-6 rounded-xl space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 pb-3 border-b border-border">
            <Building2 className="w-5 h-5 text-primary" /> Basic Business Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Business Name *</label>
              <Input 
                value={profile.title} 
                onChange={(e) => handleChange("title", e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Tagline / Subtitle</label>
              <Input 
                value={profile.tagline} 
                onChange={(e) => handleChange("tagline", e.target.value)} 
                placeholder="e.g. Award-Winning Architectural Studio" 
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-foreground">About Us / Description *</label>
              <Textarea 
                rows={4} 
                value={profile.description} 
                onChange={(e) => handleChange("description", e.target.value)} 
                placeholder="Describe your services, expertise, and years in business..." 
                required 
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Registration & Working Hours */}
        <div className="premium-card p-6 rounded-xl space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 pb-3 border-b border-border">
            <Award className="w-5 h-5 text-primary" /> Registration & Operating Hours
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">GSTIN / Tax Registration Number</label>
              <Input 
                value={profile.gstin} 
                onChange={(e) => handleChange("gstin", e.target.value)} 
                placeholder="e.g. 27AABCU9603R1ZM" 
                className="font-mono uppercase" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Working Days & Hours</label>
              <Input 
                value={profile.working_hours} 
                onChange={(e) => handleChange("working_hours", e.target.value)} 
                placeholder="e.g. 9:00 AM - 8:00 PM (Mon-Sat)" 
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Specialties / Services Offered */}
        <div className="premium-card p-6 rounded-xl space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 pb-3 border-b border-border">
            <FileText className="w-5 h-5 text-primary" /> Specialties & Expertise Tags
          </h3>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((item: string) => (
                <Badge 
                  key={item} 
                  className="bg-primary/10 text-primary border-primary/20 py-1.5 px-3 text-xs font-semibold flex items-center gap-2"
                >
                  {item}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSpecialty(item)}
                    className="hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <Input 
                value={newSpecialty} 
                onChange={(e) => setNewSpecialty(e.target.value)} 
                placeholder="Add specialty tag (e.g. Modular Kitchens)..." 
                className="h-10" 
              />
              <Button type="button" onClick={handleAddSpecialty} variant="outline" className="h-10 shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Add Tag
              </Button>
            </div>
          </div>
        </div>

        {/* SECTION 5: Contact & Location */}
        <div className="premium-card p-6 rounded-xl space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 pb-3 border-b border-border">
            <MapPin className="w-5 h-5 text-primary" /> Contact & Location
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Primary Phone Number *</label>
              <Input 
                value={profile.phone} 
                onChange={(e) => handleChange("phone", e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">WhatsApp Number</label>
              <Input 
                value={profile.whatsapp} 
                onChange={(e) => handleChange("whatsapp", e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Official Email *</label>
              <Input 
                type="email"
                value={profile.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Website URL</label>
              <Input 
                value={profile.website} 
                onChange={(e) => handleChange("website", e.target.value)} 
                placeholder="https://" 
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-foreground">Full Street Address *</label>
              <Input 
                value={profile.address} 
                onChange={(e) => handleChange("address", e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">City *</label>
              <Input 
                value={profile.city} 
                onChange={(e) => handleChange("city", e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">District</label>
              <Input 
                value={profile.district} 
                onChange={(e) => handleChange("district", e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">State *</label>
              <Input 
                value={profile.state} 
                onChange={(e) => handleChange("state", e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Pincode *</label>
              <Input 
                value={profile.pincode} 
                onChange={(e) => handleChange("pincode", e.target.value)} 
                required 
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-foreground">Google Maps URL / Coordinates</label>
              <Input 
                value={profile.google_maps_url} 
                onChange={(e) => handleChange("google_maps_url", e.target.value)} 
                placeholder="https://maps.google.com/?q=..." 
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: Social Media Links */}
        <div className="premium-card p-6 rounded-xl space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2 pb-3 border-b border-border">
            <Share2 className="w-5 h-5 text-primary" /> Social Media Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Facebook URL</label>
              <Input 
                value={profile.facebook} 
                onChange={(e) => handleChange("facebook", e.target.value)} 
                placeholder="https://facebook.com/..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Instagram URL</label>
              <Input 
                value={profile.instagram} 
                onChange={(e) => handleChange("instagram", e.target.value)} 
                placeholder="https://instagram.com/..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">LinkedIn URL</label>
              <Input 
                value={profile.linkedin} 
                onChange={(e) => handleChange("linkedin", e.target.value)} 
                placeholder="https://linkedin.com/company/..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">YouTube Channel URL</label>
              <Input 
                value={profile.youtube} 
                onChange={(e) => handleChange("youtube", e.target.value)} 
                placeholder="https://youtube.com/@..." 
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving} className="px-8 h-12 font-semibold text-md shadow-lg shadow-primary/20">
            {saving ? "Saving Profile..." : "Save All Changes"}
            {!saving && <Save className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
