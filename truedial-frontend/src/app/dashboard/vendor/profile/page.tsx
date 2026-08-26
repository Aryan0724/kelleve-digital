"use client";

import React, { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, Save, Store, MapPin, Phone, Globe, ShieldCheck, Upload, 
  Link as LinkIcon, Clock, Zap, Star, UserCircle, Image as ImageIcon,
  Mail, MessageCircle, Calendar, Trash2, Plus, CheckCircle2, Eye
} from "lucide-react";
import { useVendorType } from "@/hooks/useVendorType";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/categories";

const TIME_SLOTS = [
  "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
  "24 Hours", "Closed"
];

const PREDEFINED_SPECIALTIES: Record<string, string[]> = {
  restaurant: ['Dine-in', 'Takeaway', 'Home Delivery', 'Outdoor Seating', 'Live Music', 'Valet Parking', 'Bar/Drinks', 'Buffet', 'Catering'],
  clinic: ['General Checkup', 'Emergency Care', 'Dental Care', 'Pediatrics', 'Vaccination', 'X-Ray / Lab', 'Physiotherapy', 'Cardiology'],
  hospital: ['ICU', 'Emergency 24x7', 'Ambulance', 'Surgery', 'Maternity', 'Blood Bank', 'Pharmacy'],
  interior_designer: ['Residential Design', 'Commercial Space', 'Modular Kitchens', '3D Rendering', 'False Ceiling', 'Turnkey Projects', 'Furniture Design'],
  carpenter: ['Custom Furniture', 'Repairs', 'Wood Polishing', 'Door & Window Fitting', 'Wardrobes'],
  builder: ['Apartments', 'Villas', 'Commercial Space', 'Plots', 'Townships'],
  salon: ['Haircut & Styling', 'Facials', 'Bridal Makeup', 'Manicure & Pedicure', 'Spa Services', 'Hair Coloring'],
  gym: ['Weight Training', 'Cardio', 'CrossFit', 'Personal Training', 'Zumba', 'Yoga', 'Diet Counseling', 'Steam & Sauna', 'Nutrition Coaching'],
  default: ['Consultation', 'Installation', 'Maintenance', 'Repairs', 'Home Delivery', 'Online Booking', '24x7 Support']
};

export default function VendorProfilePage() {
  const { user, refreshUser } = useAuth();
  const config = useVendorType();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [openTime, setOpenTime] = useState("09:00 AM");
  const [closeTime, setCloseTime] = useState("06:00 PM");
  
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    state: "",
    website: "",
    cover_image: "",
    logo: "",
    gallery: [] as string[],
    years_experience: "",
    gst_number: "",
    availability: "",
    response_time: "",
    professional_type: "",
    social_links: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: ""
    },
    services: [] as string[]
  });

  const [newService, setNewService] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await TrueDialAPI.getMyBusiness();
      if (res.success && res.data) {
        const b = res.data;
        setBusiness(b);
        const sl = b.social_links || {};
        
        // Parse availability
        let parsedOpen = "09:00 AM";
        let parsedClose = "06:00 PM";
        if (b.availability && b.availability.includes(" to ")) {
          const parts = b.availability.split(" to ");
          if (parts.length === 2) {
            parsedOpen = parts[0];
            parsedClose = parts[1];
          }
        }
        
        setOpenTime(parsedOpen);
        setCloseTime(parsedClose);

        // Extract gallery URLs
        let extractedGallery: string[] = [];
        if (Array.isArray(b.gallery)) {
          extractedGallery = b.gallery.map((g: any) => (typeof g === 'string' ? g : g.url || ''));
        } else if (Array.isArray(b.media)) {
          extractedGallery = b.media.map((m: any) => m.url || '');
        }

        setFormData({
          title: b.title || "",
          tagline: b.tagline || "",
          description: b.description || "",
          phone: b.phone || "",
          whatsapp: b.whatsapp || "",
          email: b.email || user?.email || "",
          address: b.address || "",
          city: b.city || "",
          state: b.state || "",
          website: b.website || "",
          cover_image: b.cover_image || "",
          logo: b.logo || "",
          gallery: extractedGallery.filter(Boolean),
          years_experience: b.years_experience ? String(b.years_experience) : "",
          gst_number: b.gst_number || "",
          availability: b.availability || "",
          response_time: b.response_time || "",
          professional_type: b.professional_type || user?.professional_type || "",
          social_links: {
            facebook: sl.facebook || "",
            instagram: sl.instagram || "",
            linkedin: sl.linkedin || "",
            twitter: sl.twitter || ""
          },
          services: Array.isArray(b.services) ? b.services : []
        });
      } else {
        setFormData(prev => ({ 
          ...prev, 
          professional_type: user?.professional_type || "",
          title: user?.name || "",
          phone: user?.phone || "",
          email: user?.email || ""
        }));
      }
    } catch (error) {
      console.error("Failed to fetch business:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value
      }
    }));
  };

  // Handle Cover Photo Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, cover_image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Gallery Photo Upload
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setFormData(prev => ({
              ...prev,
              gallery: [...prev.gallery, reader.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addGalleryUrl = () => {
    if (newGalleryUrl.trim() && !formData.gallery.includes(newGalleryUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryUrl.trim()]
      }));
      setNewGalleryUrl("");
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const toggleService = (srv: string) => {
    setFormData(prev => {
      const exists = prev.services.includes(srv);
      if (exists) {
        return { ...prev, services: prev.services.filter(s => s !== srv) };
      } else {
        return { ...prev, services: [...prev.services, srv] };
      }
    });
  };

  const addCustomService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService("");
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.display_name) {
              setFormData(prev => ({ ...prev, address: data.display_name }));
            } else {
              setFormData(prev => ({ ...prev, address: `${latitude}, ${longitude}` }));
            }
          } catch {
            setFormData(prev => ({ ...prev, address: `${latitude}, ${longitude}` }));
          }
        },
        () => {
          alert("Failed to get location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalAvailability = `${openTime} to ${closeTime}`;
      
      const payload = { 
        ...formData, 
        availability: finalAvailability,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        category_id: business?.category_id || 1,
        city_id: business?.city_id || 1,
        district: formData.city || business?.district || "Default",
        state: formData.state || business?.state || "Default"
      };

      let res;
      if (business) {
        res = await TrueDialAPI.updateBusiness(business.id, payload);
      } else {
        res = await TrueDialAPI.createBusiness(payload);
      }
      
      if (res.success) {
        setBusiness(res.data);
        if (payload.professional_type && payload.professional_type !== user?.professional_type) {
           await refreshUser(); 
        }
        alert("Business profile saved successfully!");
      } else {
        alert(res.message || "Failed to save business. Ensure you are logged in.");
      }
    } catch (error) {
      console.error("Failed to save business:", error);
      alert("Failed to save business due to a network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const currentType = formData.professional_type?.toLowerCase() || 'default';
  const availableSpecialties = PREDEFINED_SPECIALTIES[currentType] || PREDEFINED_SPECIALTIES['default'];
  const publicSlug = business?.slug || (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'my-business');

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {config.catalogLabel?.includes('Menu') ? 'Restaurant Profile' : config.catalogLabel?.includes('Medical') ? 'Clinic Profile' : 'Business Profile'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your business information, cover photos, gallery images, hours, and contact details.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <a 
            href={`/businesses/${publicSlug}`} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Globe className="w-4 h-4" /> View Public Profile ↗
          </a>
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 transition-all flex-1 sm:flex-none">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Info + Photos) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Core Information */}
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" /> Core Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
            
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-muted-foreground" /> Business Category / Type <span className="text-red-500">*</span>
                </label>
                <select 
                  name="professional_type"
                  value={formData.professional_type}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="">Select your business type</option>
                  <option value="gym">Gym & Fitness Center</option>
                  <option value="restaurant">Restaurant / Cafe</option>
                  <option value="clinic">Clinic & Healthcare</option>
                  <option value="salon">Salon & Spa</option>
                  <option value="interior_designer">Interior Designer</option>
                  {CATEGORIES.map(category => (
                    <optgroup key={category.id} label={category.name}>
                      {category.subTypes.map(sub => (
                        <option key={sub.value} value={sub.value}>{sub.label}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="vendor">Other Business</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Business / Clinic / Gym Name <span className="text-red-500">*</span></label>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-background/50 border-border focus:ring-primary/20 transition-all font-semibold text-base"
                  placeholder="e.g. Integral Fitness & Gym"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Tagline / Slogan</label>
                <Input 
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="bg-background/50 border-border focus:ring-primary/20 transition-all"
                  placeholder="e.g. Premier Unisex Gym & Strength Training Center in Patna"
                />
                <p className="text-xs text-muted-foreground">Appears directly below your business name across the site.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">About / Description</label>
                <Textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[120px] bg-background/50 border-border focus:ring-primary/20 transition-all"
                  placeholder="Describe your facilities, equipment, certified trainers, pricing, and what makes you unique..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-500" /> Calling Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 95349 00999"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp Number
                  </label>
                  <Input 
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="+91 95349 00999"
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" /> Business Email
                  </label>
                  <Input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@mybusiness.com"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-500" /> Website URL
                  </label>
                  <Input 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="bg-background/50"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" /> Years in Business / Experience
                  </label>
                  <Input 
                    name="years_experience"
                    type="number"
                    value={formData.years_experience}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> GST / Registration No.
                  </label>
                  <Input 
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleChange}
                    placeholder="e.g. 10AAAAA0000A1Z5"
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" /> Full Address & Location <span className="text-red-500">*</span>
                  </label>
                  <button type="button" onClick={detectLocation} className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3 h-3" /> Auto-Detect GPS Location
                  </button>
                </div>
                <Textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, landmark, area..."
                  className="bg-background/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">City</label>
                  <Input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Patna, Delhi, Mumbai"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">State</label>
                  <Input 
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Bihar, Maharashtra"
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Photo & Cover Image Uploader */}
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-gradient-to-r from-orange-500/10 to-transparent">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-500" /> Business Photos & Cover Gallery
              </h2>
            </div>
            <div className="p-6 space-y-6">

              {/* Main Cover Image */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center justify-between">
                  <span>Primary Cover Image</span>
                  <span className="text-xs font-normal text-muted-foreground">Appears at the top of your public profile</span>
                </label>

                {formData.cover_image && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-48 w-full group shadow-md">
                    <img 
                      src={formData.cover_image} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, cover_image: "" }))}
                      className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-xl p-4 text-center transition-all">
                    <Upload className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary">Upload Cover File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCoverUpload} 
                      className="hidden" 
                    />
                  </label>
                  <Input
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={handleChange}
                    placeholder="Or paste Direct Image URL (https://...)"
                    className="flex-1 bg-background/50 h-auto"
                  />
                </div>
              </div>

              {/* Gallery Photos */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <label className="text-sm font-bold text-foreground flex items-center justify-between">
                  <span>Gallery Photos ({formData.gallery.length})</span>
                  <span className="text-xs font-normal text-muted-foreground">Showcase your gym floor, clinic, showroom, or work</span>
                </label>

                {/* Thumbnails grid */}
                {formData.gallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.gallery.map((url, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-28 group shadow-sm bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={url} 
                          alt={`Gallery ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryPhoto(idx)}
                          className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded-full shadow-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload & Add Gallery */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3.5 text-center transition-all">
                    <Upload className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Upload Multiple Photos</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleGalleryUpload} 
                      className="hidden" 
                    />
                  </label>
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryUrl())}
                      placeholder="Paste Image URL"
                      className="bg-background/50 text-xs"
                    />
                    <Button onClick={addGalleryUrl} type="button" variant="secondary" className="text-xs shrink-0">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Services & Specialties */}
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Specialties & Key Offerings
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Select your amenities and services. These are displayed directly on your public profile.
              </p>
              
              {/* Predefined Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {availableSpecialties.map((srv, idx) => {
                  const isSelected = formData.services.includes(srv);
                  return (
                    <button 
                      key={idx} 
                      type="button"
                      onClick={() => toggleService(srv)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected 
                        ? 'bg-primary text-white shadow-md border border-primary' 
                        : 'bg-background hover:bg-primary/10 text-foreground border border-border'
                      }`}
                    >
                      {srv}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Or Add Custom Service</span>
                <div className="h-px bg-border flex-1"></div>
              </div>

              {/* Custom Input */}
              <div className="flex gap-2 mb-4">
                <Input 
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomService())}
                  placeholder="e.g. 24x7 Steam Room, Personal Trainer, Yoga..."
                  className="bg-background/50"
                />
                <Button onClick={addCustomService} type="button" variant="secondary">Add</Button>
              </div>

              {/* Render custom selected pills */}
              <div className="flex flex-wrap gap-2">
                {formData.services.filter(s => !availableSpecialties.includes(s)).map((srv, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-foreground text-sm font-medium flex items-center gap-2">
                    {srv}
                    <button type="button" onClick={() => toggleService(srv)} className="hover:text-red-500 transition-colors">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar Settings) */}
        <div className="space-y-8">
          
          {/* Operations & Timings */}
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> Working Hours & Operations
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/80 block">Business Hours</label>
                <div className="flex items-center gap-2">
                  <div className="w-full">
                    <span className="text-xs text-muted-foreground mb-1 block">Opens At</span>
                    <select 
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <span className="text-muted-foreground mt-4">-</span>
                  <div className="w-full">
                    <span className="text-xs text-muted-foreground mb-1 block">Closes At</span>
                    <select 
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> Avg Response Time
                </label>
                <select 
                  name="response_time"
                  value={formData.response_time}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Response Time</option>
                  <option value="under_1_hour">Under 1 Hour</option>
                  <option value="same_day">Same Day</option>
                  <option value="within_24_hours">Within 24 Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground">Social Links</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-pink-500" />
                <Input 
                  name="instagram"
                  value={formData.social_links.instagram}
                  onChange={handleSocialChange}
                  placeholder="Instagram URL"
                  className="pl-9 bg-background/50"
                />
              </div>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-blue-600" />
                <Input 
                  name="facebook"
                  value={formData.social_links.facebook}
                  onChange={handleSocialChange}
                  placeholder="Facebook URL"
                  className="pl-9 bg-background/50"
                />
              </div>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-blue-400" />
                <Input 
                  name="linkedin"
                  value={formData.social_links.linkedin}
                  onChange={handleSocialChange}
                  placeholder="LinkedIn URL"
                  className="pl-9 bg-background/50"
                />
              </div>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-sky-400" />
                <Input 
                  name="twitter"
                  value={formData.social_links.twitter}
                  onChange={handleSocialChange}
                  placeholder="Twitter / X URL"
                  className="pl-9 bg-background/50"
                />
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5">
              <h2 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verification Status</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500 text-white">
                  {business?.is_verified ? 'Verified Business' : 'Pending Verification'}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Your business is verified by TrueDial for trusted customer discovery.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
