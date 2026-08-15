"use client";

import React, { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Store, MapPin, Phone, Globe, ShieldCheck, Upload, Link as LinkIcon, Clock, Zap, Star, UserCircle } from "lucide-react";
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
  gym: ['Weight Training', 'Cardio', 'CrossFit', 'Personal Training', 'Zumba', 'Yoga', 'Diet Counseling'],
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
    description: "",
    phone: "",
    address: "",
    website: "",
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

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await TrueDialAPI.getMyBusiness();
      if (res.success && res.data) {
        setBusiness(res.data);
        const sl = res.data.social_links || {};
        
        // Parse availability (e.g. "09:00 AM to 06:00 PM")
        let parsedOpen = "09:00 AM";
        let parsedClose = "06:00 PM";
        if (res.data.availability && res.data.availability.includes(" to ")) {
          const parts = res.data.availability.split(" to ");
          if (parts.length === 2) {
            parsedOpen = parts[0];
            parsedClose = parts[1];
          }
        }
        
        setOpenTime(parsedOpen);
        setCloseTime(parsedClose);

        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          website: res.data.website || "",
          availability: res.data.availability || "",
          response_time: res.data.response_time || "",
          professional_type: res.data.professional_type || user?.professional_type || "",
          social_links: {
            facebook: sl.facebook || "",
            instagram: sl.instagram || "",
            linkedin: sl.linkedin || "",
            twitter: sl.twitter || ""
          },
          services: res.data.services || []
        });
      } else {
        // Init empty but pre-populate with auth user data
        setFormData(prev => ({ 
          ...prev, 
          professional_type: user?.professional_type || "",
          title: user?.name || "",
          phone: user?.phone || ""
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
          // Reverse geocode to get an address (using a free API like OpenStreetMap Nominatim)
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.display_name) {
              setFormData(prev => ({ ...prev, address: data.display_name }));
            } else {
              setFormData(prev => ({ ...prev, address: `${latitude}, ${longitude}` }));
            }
          } catch (error) {
            setFormData(prev => ({ ...prev, address: `${latitude}, ${longitude}` }));
          }
        },
        (error) => {
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
      // Build final availability string
      const finalAvailability = `${openTime} to ${closeTime}`;
      
      // We inject default category_id, city_id, district, state to satisfy backend validation
      // if this is a brand new business creation.
      const payload = { 
        ...formData, 
        availability: finalAvailability,
        category_id: business?.category_id || 1,
        city_id: business?.city_id || 1,
        district: business?.district || "Default",
        state: business?.state || "Default"
      };

      let res;
      if (business) {
        res = await TrueDialAPI.updateBusiness(business.id, payload);
      } else {
        res = await TrueDialAPI.createBusiness(payload);
      }
      
      if (res.success) {
        setBusiness(res.data);
        // Important: Update React user state if they changed their professional_type
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {config.catalogLabel?.includes('Menu') ? 'Restaurant Profile' : config.catalogLabel?.includes('Medical') ? 'Clinic Profile' : 'Business Profile'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your {user?.professional_type ? user.professional_type.replace('_', ' ') : 'business'} information, hours, and specialties.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 transition-all w-full sm:w-auto">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" /> Core Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
            
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-muted-foreground" /> Business Type / Category <span className="text-red-500">*</span>
                </label>
                <select 
                  name="professional_type"
                  value={formData.professional_type}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select your business type</option>
                  {CATEGORIES.map(category => (
                    <optgroup key={category.id} label={category.name}>
                      {category.subTypes.map(sub => (
                        <option key={sub.value} value={sub.value}>{sub.label}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="vendor">Other Business</option>
                </select>
                <p className="text-xs text-muted-foreground">Changing this will update your personalized sidebar tabs.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Business / Clinic Name <span className="text-red-500">*</span></label>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-background/50 border-border focus:ring-primary/20 transition-all"
                  placeholder="e.g. Royal Dental Clinic"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Description</label>
                <Textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[120px] bg-background/50 border-border focus:ring-primary/20 transition-all"
                  placeholder="Describe your history, mission, and what makes you unique..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" /> Contact Number <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" /> Website URL
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
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> Full Address <span className="text-red-500">*</span>
                  </label>
                  <button type="button" onClick={detectLocation} className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Detect Location
                  </button>
                </div>
                <Textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Specialties & Services
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Select the services you offer. These help customers find you easily.
              </p>
              
              {/* Predefined Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {availableSpecialties.map((srv, idx) => {
                  const isSelected = formData.services.includes(srv);
                  return (
                    <button 
                      key={idx} 
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
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Or Add Custom</span>
                <div className="h-px bg-border flex-1"></div>
              </div>

              {/* Custom Input */}
              <div className="flex gap-2 mb-4">
                <Input 
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomService())}
                  placeholder="e.g. 24x7 Support, Specialized Treatment..."
                  className="bg-background/50"
                />
                <Button onClick={addCustomService} variant="secondary">Add</Button>
              </div>

              {/* Render custom selected pills that aren't in the predefined list */}
              <div className="flex flex-wrap gap-2">
                {formData.services.filter(s => !availableSpecialties.includes(s)).map((srv, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-foreground text-sm font-medium flex items-center gap-2">
                    {srv}
                    <button onClick={() => toggleService(srv)} className="hover:text-red-500 transition-colors">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar Settings) */}
        <div className="space-y-8">
          
          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> Operations
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

          <div className="rounded-2xl border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground">Social Presence</h2>
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
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-5">
              <h2 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verification Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${business?.verification_level === 'verified' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {business?.verification_level === 'verified' ? 'Verified' : 'Pending'}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Upload your trade license and identity proof to unlock the Verified Badge.
              </p>
              <Button variant="outline" className="w-full text-xs font-medium border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-900/30">
                <Upload className="w-3.5 h-3.5 mr-2" /> Upload Documents
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
