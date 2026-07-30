"use client";

import React, { useState } from "react";
import {
  Clock, MapPin, Award, Utensils, Check, ShieldCheck, Plus, Trash2,
  CalendarDays, Wifi, Car, Music, Stethoscope, Wrench, Briefcase,
  Layers, CheckSquare, Sparkles, Building2, Flame
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── 1. Clinic Hours & Holiday Manager (Medical) ───────────────────────────────
function ClinicHoursSection() {
  const [schedule, setSchedule] = useState([
    { day: "Monday", open: "09:00 AM", close: "08:00 PM", isOpen: true },
    { day: "Tuesday", open: "09:00 AM", close: "08:00 PM", isOpen: true },
    { day: "Wednesday", open: "09:00 AM", close: "08:00 PM", isOpen: true },
    { day: "Thursday", open: "09:00 AM", close: "08:00 PM", isOpen: true },
    { day: "Friday", open: "09:00 AM", close: "08:00 PM", isOpen: true },
    { day: "Saturday", open: "10:00 AM", close: "04:00 PM", isOpen: true },
    { day: "Sunday", open: "Closed", close: "Closed", isOpen: false },
  ]);
  const [emergencyAccepted, setEmergencyAccepted] = useState(true);

  const toggleDay = (idx: number) => {
    setSchedule(schedule.map((s, i) => i === idx ? { ...s, isOpen: !s.isOpen } : s));
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Clinic Operating Hours & Schedule</CardTitle>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Live on TrueDial Profile
          </Badge>
        </div>
        <CardDescription>
          Patients rely on your consultation timings when booking appointments.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Schedule Table */}
        <div className="space-y-3">
          {schedule.map((row, idx) => (
            <div key={row.day} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/30 transition">
              <div className="flex items-center gap-3 w-32">
                <input
                  type="checkbox"
                  checked={row.isOpen}
                  onChange={() => toggleDay(idx)}
                  className="w-4 h-4 rounded border-border text-[#E8701A] focus:ring-[#E8701A]"
                />
                <span className={`font-semibold text-sm ${row.isOpen ? "text-foreground" : "text-muted-foreground line-through"}`}>
                  {row.day}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {row.isOpen ? (
                  <>
                    <Input value={row.open} readOnly className="w-28 h-8 text-xs text-center font-mono" />
                    <span className="text-muted-foreground text-xs">to</span>
                    <Input value={row.close} readOnly className="w-28 h-8 text-xs text-center font-mono" />
                  </>
                ) : (
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider px-3 py-1 bg-red-500/10 rounded-lg">
                    Closed / Holiday
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency priority option */}
        <div className="p-4 rounded-xl border border-border bg-muted/40 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-foreground">Accept Emergency & Walk-in Priority Cases</h4>
            <p className="text-xs text-muted-foreground">Allows patients with urgent symptoms to book immediate slots.</p>
          </div>
          <input
            type="checkbox"
            checked={emergencyAccepted}
            onChange={() => setEmergencyAccepted(!emergencyAccepted)}
            className="w-5 h-5 rounded border-border text-[#E8701A] focus:ring-[#E8701A]"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 2. Service Area & PIN Code Coverage (Home Services) ────────────────────────
function ServiceAreaSection() {
  const [pincodes, setPincodes] = useState(["400050", "400051", "400052", "400053", "400054"]);
  const [newPin, setNewPin] = useState("");
  const [radius, setRadius] = useState("15 km");

  const addPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim() || pincodes.includes(newPin.trim())) return;
    setPincodes([...pincodes, newPin.trim()]);
    setNewPin("");
  };

  const removePin = (pin: string) => {
    setPincodes(pincodes.filter((p) => p !== pin));
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#E8701A]" />
            <CardTitle className="text-lg">Service Area & PIN Code Coverage</CardTitle>
          </div>
          <Badge className="bg-primary/10 text-primary border border-primary/20">
            Radius: {radius}
          </Badge>
        </div>
        <CardDescription>
          We only match you with service requests within your selected PIN codes and travel radius.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Radius selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Maximum Travel Radius from Your Address</label>
          <div className="flex gap-2 flex-wrap">
            {["5 km", "10 km", "15 km", "25 km", "50 km"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadius(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  radius === r ? "bg-[#E8701A] text-white border-[#E8701A]" : "bg-background border-border text-foreground hover:border-primary/50"
                }`}
              >
                Within {r}
              </button>
            ))}
          </div>
        </div>

        {/* PIN Code tags */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Active PIN Codes Covered</label>
          <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-border bg-muted/20">
            {pincodes.map((pin) => (
              <span
                key={pin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs font-mono font-bold shadow-sm"
              >
                {pin}
                <button
                  type="button"
                  onClick={() => removePin(pin)}
                  className="text-muted-foreground hover:text-red-500 transition"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={addPin} className="flex gap-2 max-w-sm">
            <Input
              placeholder="Add PIN Code (e.g. 400055)"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              maxLength={6}
              className="h-10 text-sm font-mono"
            />
            <Button type="submit" className="h-10 bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 3. Real Estate Awards & Credentials Manager ───────────────────────────────
function BuilderCredentialsSection() {
  const [badges, setBadges] = useState({
    griha: true,
    igbc: true,
    credai: true,
    rera: true,
    gst: true,
  });
  const [reraId, setReraId] = useState("P51800012345");

  const toggleBadge = (key: keyof typeof badges) => {
    setBadges({ ...badges, [key]: !badges[key] });
  };

  const badgeConfig = [
    { key: "rera" as const, name: "RERA Registered Builder", desc: "Verifies compliance with Real Estate Regulatory Authority" },
    { key: "credai" as const, name: "CREDAI Certified Member", desc: "National body of real estate developers" },
    { key: "igbc" as const, name: "IGBC Green Homes Member", desc: "Indian Green Building Council sustainable design" },
    { key: "griha" as const, name: "GRIHA Green Rating", desc: "Green Rating for Integrated Habitat Assessment" },
    { key: "gst" as const, name: "GST Registered Enterprise", desc: "Verified corporate GSTIN and legal entity" },
  ];

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Industry Credentials, Awards & RERA Verification</CardTitle>
          </div>
          <Badge className="bg-primary/10 text-primary border border-primary/20">
            Trust Score: 98%
          </Badge>
        </div>
        <CardDescription>
          High-value project leads check your RERA ID and credentials before requesting quotations.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* RERA input */}
        <div className="space-y-1.5 max-w-md">
          <label className="text-sm font-semibold text-foreground">RERA Registration Number</label>
          <Input
            value={reraId}
            onChange={(e) => setReraId(e.target.value)}
            placeholder="e.g. P51800012345"
            className="h-10 font-mono text-sm"
          />
        </div>

        {/* Certifications grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badgeConfig.map((item) => {
            const active = badges[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleBadge(item.key)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  active
                    ? "bg-primary/5 border-primary/40 text-foreground"
                    : "bg-background border-border text-muted-foreground opacity-60"
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                  active ? "bg-[#E8701A] border-[#E8701A] text-white" : "border-border bg-background"
                }`}>
                  {active && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 4. Restaurant Dining Amenities & FSSAI ────────────────────────────────────
function RestaurantAmenitiesSection() {
  const [amenities, setAmenities] = useState({
    ac: true,
    valet: true,
    rooftop: false,
    wifi: true,
    liveMusic: true,
    family: true,
    bar: false,
  });
  const [fssai, setFssai] = useState("11521005001234");

  const toggleAmenity = (key: keyof typeof amenities) => {
    setAmenities({ ...amenities, [key]: !amenities[key] });
  };

  const list = [
    { key: "ac" as const, name: "Air Conditioned Dining", icon: "❄️" },
    { key: "valet" as const, name: "Valet Parking Available", icon: "🚗" },
    { key: "wifi" as const, name: "Complimentary High-Speed Wi-Fi", icon: "📶" },
    { key: "rooftop" as const, name: "Rooftop / Open-Air Seating", icon: "🌅" },
    { key: "liveMusic" as const, name: "Live Music / Acoustic Nights", icon: "🎸" },
    { key: "family" as const, name: "Family & Kid Friendly Area", icon: "👨‍👩‍👧‍👦" },
    { key: "bar" as const, name: "Bar / Alcohol Served", icon: "🍸" },
  ];

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#E8701A]" />
            <CardTitle className="text-lg">Dining Amenities & FSSAI License</CardTitle>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            FSSAI Verified
          </Badge>
        </div>
        <CardDescription>
          Showcase dining amenities to guests booking tables on your listing.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* FSSAI License number */}
        <div className="space-y-1.5 max-w-md">
          <label className="text-sm font-semibold text-foreground">FSSAI Registration License Number</label>
          <Input
            value={fssai}
            onChange={(e) => setFssai(e.target.value)}
            placeholder="14-digit FSSAI License"
            maxLength={14}
            className="h-10 font-mono text-sm"
          />
        </div>

        {/* Amenities grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {list.map((item) => {
            const active = amenities[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleAmenity(item.key)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                  active
                    ? "bg-primary/5 border-primary/40 text-foreground"
                    : "bg-background border-border text-muted-foreground opacity-60"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-semibold text-sm flex-1">{item.name}</span>
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                  active ? "bg-[#E8701A] border-[#E8701A] text-white" : "border-border"
                }`}>
                  {active && <Check className="w-3 h-3" />}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Section Router ───────────────────────────────────────────────────────
export default function VendorProfileRoleSection({ roles }: { roles: string[] }) {
  const isMedical = roles.some((r) => ["doctor", "hospital", "clinic", "dentist"].includes(r));
  const isRestaurant = roles.some((r) => ["restaurant", "cafe", "bakery", "food"].includes(r));
  const isService = roles.some((r) => ["worker", "skilled_worker", "plumber", "electrician", "mechanic", "cleaner"].includes(r));
  const isRealEstate = roles.some((r) => ["builder", "architect", "interior_designer", "contractor", "supplier", "material_supplier"].includes(r));

  if (isMedical) return <ClinicHoursSection />;
  if (isRestaurant) return <RestaurantAmenitiesSection />;
  if (isService) return <ServiceAreaSection />;
  if (isRealEstate) return <BuilderCredentialsSection />;
  return null;
}
