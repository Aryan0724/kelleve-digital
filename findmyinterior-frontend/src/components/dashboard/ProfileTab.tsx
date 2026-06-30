"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Camera, CheckCircle2, Loader2, ShieldCheck, Star, Upload,
  User, Building2, MapPin, Phone, Globe, Briefcase, Users, Hash
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

// ─── Avatar Uploader ─────────────────────────────────────────────────────────

function AvatarUploader({ currentAvatar, userName }: { currentAvatar: string | null; userName: string }) {
  const { user, updateUser } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentAvatar);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Photo must be less than 4MB.");
      return;
    }

    // Instant preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setSuccess(false);

    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await api.post("/user/avatar", form);
      // Update global user store
      if (user) updateUser({ ...user, avatar: res.data.avatar });
      setPreview(res.data.avatar);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed. Please try again.");
      setPreview(currentAvatar);
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar circle */}
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-100 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-2xl shadow-md">
          {preview ? (
            <img src={preview} alt={userName} className="w-full h-full object-cover" />
          ) : (
            initials || <User className="w-10 h-10" />
          )}
        </div>

        {/* Hover overlay */}
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
          <span className="text-white text-[10px] font-medium">
            {uploading ? "Uploading…" : "Change"}
          </span>
        </button>

        {/* Success badge */}
        {success && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1.5 text-xs text-orange-600 font-medium hover:text-orange-700 transition-colors"
        disabled={uploading}
      >
        <Upload className="w-3 h-3" />
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
      <p className="text-xs text-slate-400">JPG, PNG or WebP · Max 4MB</p>
    </div>
  );
}

// ─── Trust Score Badge ────────────────────────────────────────────────────────

function TrustBadge({ level, score }: { level: string; score?: number }) {
  const levels: Record<string, { label: string; color: string; icon: any }> = {
    basic:              { label: "Basic Member",         color: "bg-slate-100 text-slate-600",    icon: User },
    mobile_verified:    { label: "Mobile Verified",      color: "bg-blue-50 text-blue-700",       icon: Phone },
    verified_business:  { label: "Verified Business ✓",  color: "bg-green-50 text-green-700",     icon: ShieldCheck },
    trusted_professional: { label: "Trusted Pro ★",     color: "bg-purple-50 text-purple-700",   icon: Star },
    elite_professional: { label: "Elite Professional",   color: "bg-orange-50 text-orange-700",  icon: Star },
    site_verified:      { label: "Site Verified",        color: "bg-yellow-50 text-yellow-800",  icon: CheckCircle2 },
  };
  const cfg = levels[level] || levels.basic;
  const Icon = cfg.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
      {score !== undefined && (
        <span className="ml-1 opacity-70">· Trust {score}/100</span>
      )}
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfileTab() {
  const { user } = useAuthStore();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);

  // Completion score (out of 13 fields)
  const fields = [
    formData.title, formData.tagline, formData.description,
    formData.phone, formData.city, formData.district,
    formData.address, formData.website, formData.years_experience,
    formData.team_size, formData.gst_number, formData.pan_number,
    user?.avatar,
  ];
  const completionScore = Math.min(
    100,
    Math.round((fields.filter((v) => v && String(v).trim().length > 0).length / fields.length) * 100)
  );

  const fetchData = async () => {
    try {
      const [listingsRes, categoriesRes] = await Promise.all([
        api.get("/user/listings").catch(() => ({ data: { data: [] } })),
        api.get("/categories"),
      ]);
      setCategories(categoriesRes.data || []);
      if (listingsRes.data.data.length > 0) {
        const l = listingsRes.data.data[0];
        setListing(l);
        setFormData({
          title:            l.title              ?? "",
          tagline:          l.tagline            ?? "",
          description:      l.description        ?? "",
          phone:            l.phone              ?? "",
          whatsapp:         l.whatsapp           ?? "",
          city:             l.city               ?? "",
          district:         l.district           ?? "",
          address:          l.address            ?? "",
          website:          l.website            ?? "",
          years_experience: l.years_experience   ?? "",
          team_size:        l.team_size          ?? "",
          gst_number:       l.gst_number         ?? "",
          pan_number:       l.pan_number         ?? "",
          category_id:      l.category?.id       ?? "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      if (listing) {
        await api.put(`/user/listings/${listing.id}`, formData);
      } else {
        await api.post(`/user/listings`, formData);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchData();
    } catch (e: any) {
      if (e.response?.data?.errors) {
        const msgs = Object.values(e.response.data.errors).flat().join("\n");
        alert(`Validation Error:\n${msgs}`);
      } else {
        alert(e.response?.data?.message || "Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile…
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ─── Header card: avatar + trust ──────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#0a1c3a] to-indigo-900" />
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <AvatarUploader currentAvatar={user?.avatar ?? null} userName={user?.name ?? ""} />
            <div className="flex-1 pb-1">
              <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{user?.email}</p>
              <TrustBadge
                level={user?.verification_level ?? "basic"}
                score={user?.trust_score}
              />
            </div>
            {/* Completion ring */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9"
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="3"
                    strokeDasharray={`${completionScore} ${100 - completionScore}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-orange-600">
                  {completionScore}%
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">Profile</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Business Profile Form ─────────────────────────────── */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-600" />
            Business Profile
          </CardTitle>
          <CardDescription>
            Complete your profile to rank higher in search results. Verified + complete profiles receive 3× more enquiries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Category — only on create */}
          {!listing && (
            <Field label="Business Category" icon={Briefcase}>
              <select
                name="category_id"
                value={formData.category_id || ""}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select a Category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Field label="Business Name / Title" icon={Building2}>
                <Input name="title" value={formData.title || ""} onChange={handleChange} placeholder="e.g. Sharma Interior Designs" />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Tagline" icon={Star}>
                <Input name="tagline" value={formData.tagline || ""} onChange={handleChange} placeholder="A short punchy description of your business" />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Business Description" icon={Hash}>
                <Textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="h-28 resize-none"
                  placeholder="Describe your services, expertise, and what makes you different…"
                />
              </Field>
            </div>

            <Field label="Phone Number" icon={Phone}>
              <Input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="9876543210" />
            </Field>

            <Field label="WhatsApp (Optional)" icon={Phone}>
              <Input name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} placeholder="Same as phone or different" />
            </Field>

            <Field label="City" icon={MapPin}>
              <Input name="city" value={formData.city || ""} onChange={handleChange} placeholder="Patna" />
            </Field>

            <Field label="District" icon={MapPin}>
              <Input name="district" value={formData.district || ""} onChange={handleChange} placeholder="Patna" />
            </Field>

            <Field label="Years of Experience" icon={Briefcase}>
              <Input type="number" name="years_experience" value={formData.years_experience || ""} onChange={handleChange} placeholder="5" min={0} />
            </Field>

            <Field label="Team Size" icon={Users}>
              <Input type="number" name="team_size" value={formData.team_size || ""} onChange={handleChange} placeholder="10" min={1} />
            </Field>

            <Field label="GST Number (Optional)" icon={Hash}>
              <Input name="gst_number" value={formData.gst_number || ""} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
            </Field>

            <Field label="PAN Number (Optional)" icon={Hash}>
              <Input name="pan_number" value={formData.pan_number || ""} onChange={handleChange} placeholder="ABCDE1234F" />
            </Field>

            <div className="md:col-span-2">
              <Field label="Website URL (Optional)" icon={Globe}>
                <Input name="website" value={formData.website || ""} onChange={handleChange} placeholder="https://mywebsite.com" />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Full Office Address" icon={MapPin}>
                <Textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="h-16 resize-none"
                  placeholder="Plot 123, Street Name, Landmark, City"
                />
              </Field>
            </div>
          </div>

          {/* Save */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm text-slate-500">
              {saved ? (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
                </span>
              ) : (
                "Changes are saved to your public listing."
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700 text-white min-w-36"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
