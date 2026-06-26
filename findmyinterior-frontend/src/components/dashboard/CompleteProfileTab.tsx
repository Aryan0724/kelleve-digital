"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Camera, CheckCircle2, Loader2, ShieldCheck, Star, Upload,
  User, Building2, MapPin, Phone, Globe, Briefcase, Users, Hash, Check, Lock, AlertCircle, XCircle, ShieldAlert, UploadCloud, ArrowRight
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

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setSuccess(false);

    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await api.post("/user/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  const initials = userName?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-100 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-2xl shadow-md">
          {preview ? (
            <img src={preview} alt={userName} className="w-full h-full object-cover" />
          ) : (
            initials || <User className="w-10 h-10" />
          )}
        </div>
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
        {success && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
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
      {score !== undefined && <span className="ml-1 opacity-70">· Trust {score}/100</span>}
    </div>
  );
}

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

const REQUIRED_DOCS = [
  { id: "gst_certificate", label: "GST Certificate", requiredFor: "Business" },
  { id: "pan_card", label: "PAN Card", requiredFor: "Business" },
  { id: "business_logo", label: "Business Logo", requiredFor: "Business" },
  { id: "business_image", label: "Office/Business Image", requiredFor: "Business" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function CompleteProfileTab() {
  const { user, updateUser } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  const [profileType, setProfileType] = useState<string>("none");
  const [verificationData, setVerificationData] = useState<any>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const role = user?.role || 'homeowner';
  const isBusiness = ['interior_designer', 'contractor', 'architect', 'supplier', 'builder'].includes(role);
  const isWorker = role === 'worker';

  // Completion score calculation
  const fieldsToCheck = [
    formData.phone, formData.city, formData.district, formData.address
  ];
  if (isBusiness) {
    fieldsToCheck.push(formData.title || formData.company_name, formData.description || formData.tagline);
  }
  if (isWorker) {
    fieldsToCheck.push(formData.skill, formData.experience_years, formData.daily_rate);
  }

  const filledFields = fieldsToCheck.filter((v) => v && String(v).trim().length > 0).length;
  const completionScore = fieldsToCheck.length === 0 ? 100 : Math.min(100, Math.round((filledFields / fieldsToCheck.length) * 100));
  const isProfileComplete = completionScore >= 50;

  const fetchData = async () => {
    try {
      // Parallel fetch profile data and verification status
      const [profileRes, verifRes] = await Promise.all([
        api.get("/user/professional-profile"),
        api.get("/verification/status").catch(() => ({ data: { data: null } }))
      ]);

      const type = profileRes.data.type;
      const data = profileRes.data.data;
      
      setProfileType(type);
      setVerificationData(verifRes.data?.data);

      if (data) {
        setFormData({
          // Base
          phone: user?.phone || data.phone || "",
          city: data.city || "",
          district: data.district || "",
          address: data.address || "",
          
          // Listing specific
          title: data.title || "",
          description: data.description || "",
          website: data.website || "",
          years_experience: data.years_experience || "",
          team_size: data.team_size || "",
          
          // Shared Business
          tagline: data.tagline || "",
          gst_number: data.gst_number || "",
          pan_number: data.pan_number || "",
          
          // Worker specific
          skill: data.skill || "",
          experience_years: data.experience_years || "",
          daily_rate: data.daily_rate || "",
          bio: data.bio || "",
          
          // Supplier / Builder specific
          company_name: data.company_name || "",
          total_projects: data.total_projects || "",
        });
      } else {
        setFormData({ phone: user?.phone || "" });
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
      // First update base user data if needed
      if (formData.phone !== user?.phone) {
        const userRes = await api.put("/user/profile", { phone: formData.phone, name: user?.name });
        if (user) updateUser(userRes.data.data);
      }

      // Then update professional profile if applicable
      if (isBusiness || isWorker) {
        await api.put(`/user/professional-profile`, formData);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploadingDoc(docType);
    const form = new FormData();
    form.append("file", file);
    form.append("document_type", docType);

    try {
      await api.post("/verification/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Document uploaded successfully and is pending review.");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploadingDoc(null);
      if (e.target) e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile…
      </div>
    );
  }

  const docs = verificationData?.documents || [];
  const getDocStatus = (type: string) => docs.find((d: any) => d.document_type === type);
  const requiredDocsSubmitted = REQUIRED_DOCS.every(doc => ['pending', 'approved'].includes(getDocStatus(doc.id)?.status));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ─── Header card: avatar + trust ──────────────────────── */}
      <Card className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#0a1c3a] to-indigo-900" />
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <AvatarUploader currentAvatar={user?.avatar ?? null} userName={user?.name ?? ""} />
            <div className="flex-1 pb-1">
              <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{user?.email}</p>
              <TrustBadge level={user?.verification_level ?? "basic"} score={user?.trust_score} />
            </div>
            {/* Completion ring */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ea580c" strokeWidth="3"
                    strokeDasharray={`${completionScore} ${100 - completionScore}`} strokeLinecap="round" />
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

      <div className="relative border-l-2 border-indigo-100 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12 pb-10">
        
        {/* Step 1: Basic Info */}
        <div className="relative">
          <div className={`absolute -left-[41px] md:-left-[57px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white flex items-center justify-center font-bold text-white shadow-sm transition-colors ${isProfileComplete ? 'bg-green-500' : 'bg-indigo-600'}`}>
            {isProfileComplete ? <Check className="w-5 h-5" /> : "1"}
          </div>
          <Card className={isProfileComplete ? "border-green-100 bg-green-50/30" : "border-indigo-200 shadow-md"}>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xl">Basic Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Homeowner / General Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name (View Only)" icon={User}>
                  <Input value={user?.name} disabled className="bg-slate-50" />
                </Field>
                <Field label="Phone Number" icon={Phone}>
                  <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9876543210" />
                </Field>
                <Field label="City" icon={MapPin}>
                  <Input name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Patna" />
                </Field>
                <Field label="District" icon={MapPin}>
                  <Input name="district" value={formData.district} onChange={handleChange} placeholder="e.g. Patna" />
                </Field>
              </div>

              {/* Worker Specific Info */}
              {isWorker && (
                <>
                  <div className="border-t pt-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Field label="Primary Skill" icon={Briefcase}>
                      <Input name="skill" value={formData.skill} onChange={handleChange} placeholder="e.g. Electrician, Carpenter" />
                    </Field>
                    <Field label="Years Experience" icon={Star}>
                      <Input name="experience_years" type="number" value={formData.experience_years} onChange={handleChange} placeholder="e.g. 5" />
                    </Field>
                    <Field label="Daily Rate (₹)" icon={Hash}>
                      <Input name="daily_rate" type="number" value={formData.daily_rate} onChange={handleChange} placeholder="e.g. 800" />
                    </Field>
                  </div>
                  <Field label="Professional Bio" icon={User}>
                    <Textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell customers about your expertise..." rows={3} />
                  </Field>
                </>
              )}

              {/* Business Specific Info */}
              {isBusiness && (
                <>
                  <div className="border-t pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label={profileType === 'listing' ? "Listing Title" : "Company Name"} icon={Building2}>
                      <Input name={profileType === 'listing' ? "title" : "company_name"} value={profileType === 'listing' ? formData.title : formData.company_name} onChange={handleChange} placeholder="Your Business Name" />
                    </Field>
                    <Field label="Tagline" icon={Star}>
                      <Input name="tagline" value={formData.tagline} onChange={handleChange} placeholder="e.g. Bihar's best interiors" />
                    </Field>
                  </div>
                  
                  {profileType === 'listing' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Field label="Experience (Years)" icon={Star}>
                        <Input type="number" name="years_experience" value={formData.years_experience} onChange={handleChange} placeholder="e.g. 10" />
                      </Field>
                      <Field label="Team Size" icon={Users}>
                        <Input type="number" name="team_size" value={formData.team_size} onChange={handleChange} placeholder="e.g. 15" />
                      </Field>
                      <Field label="Website" icon={Globe}>
                        <Input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" />
                      </Field>
                    </div>
                  )}
                  
                  {(profileType === 'listing' || profileType === 'supplier') && (
                    <Field label="Business Description" icon={Building2}>
                      <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your services, specialities, etc." rows={4} />
                    </Field>
                  )}
                  
                  <div className="border-t pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg">
                    <Field label="GST Number (Optional)" icon={Hash}>
                      <Input name="gst_number" value={formData.gst_number} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
                    </Field>
                    <Field label="PAN Number (Optional)" icon={Hash}>
                      <Input name="pan_number" value={formData.pan_number} onChange={handleChange} placeholder="ABCDE1234F" />
                    </Field>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4 border-t mt-6">
                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Step 2: Verification (For Professionals Only) */}
        {(isBusiness || isWorker) && (
          <div className="relative">
            <div className={`absolute -left-[41px] md:-left-[57px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white flex items-center justify-center font-bold text-white shadow-sm transition-colors ${!isProfileComplete ? 'bg-slate-300' : requiredDocsSubmitted ? 'bg-green-500' : 'bg-indigo-600'}`}>
              {requiredDocsSubmitted ? <Check className="w-5 h-5" /> : "2"}
            </div>
            <Card className={!isProfileComplete ? "opacity-50 pointer-events-none" : requiredDocsSubmitted ? "border-green-100 bg-green-50/30" : "border-indigo-200 shadow-md"}>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Business Verification</CardTitle>
                <CardDescription>Upload official documents to get the Verified Badge.</CardDescription>
              </CardHeader>
              <CardContent>
                {!isProfileComplete && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50 rounded-lg backdrop-blur-[1px]">
                    <div className="bg-white px-6 py-3 rounded-full shadow border flex items-center text-slate-500 font-medium">
                      <Lock className="w-4 h-4 mr-2" /> Complete Step 1 First
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REQUIRED_DOCS.map(doc => {
                    const currentDoc = getDocStatus(doc.id);
                    return (
                      <div key={doc.id} className={`border rounded-lg p-4 flex flex-col justify-between ${currentDoc?.status === 'approved' ? 'bg-green-50/50 border-green-200' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">{doc.label}</h4>
                          </div>
                          {currentDoc?.status === "approved" && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                          {currentDoc?.status === "pending" && <AlertCircle className="h-6 w-6 text-yellow-500" />}
                          {currentDoc?.status === "rejected" && <XCircle className="h-6 w-6 text-red-500" />}
                          {!currentDoc && <ShieldAlert className="h-6 w-6 text-slate-300" />}
                        </div>

                        {currentDoc?.status === "rejected" && (
                          <div className="bg-red-50 text-red-700 p-2 text-xs rounded-md mb-3 border border-red-100">
                            <strong>Rejected:</strong> {currentDoc.rejection_reason}
                          </div>
                        )}

                        <div className="mt-auto">
                          {currentDoc?.status === "approved" ? (
                            <div className="text-sm text-green-600 font-medium flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Document Verified
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="file" accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleDocUpload(e, doc.id)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                disabled={uploadingDoc === doc.id || currentDoc?.status === 'pending'}
                              />
                              <Button variant={currentDoc?.status === 'rejected' ? 'destructive' : 'outline'} 
                                className={`w-full ${!currentDoc ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700' : ''}`}
                                disabled={uploadingDoc === doc.id || currentDoc?.status === 'pending'}>
                                {uploadingDoc === doc.id ? "Uploading..." : currentDoc?.status === 'pending' ? "Pending Review" : <><UploadCloud className="h-4 w-4 mr-2" /> Upload</>}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
