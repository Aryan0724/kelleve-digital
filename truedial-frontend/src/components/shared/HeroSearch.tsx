"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, ChevronRight, ChevronDown, Mic, ArrowRight,
  Utensils, Building, HeartPulse, GraduationCap, HardHat, Car,
  Smartphone, Shirt, Wrench, Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUserLocation } from "@/context/LocationContext";
import { TrueDialAPI } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

// ─── Service highlight cards (right of banner, JustDial style) ───────────────
const SERVICE_CARDS = [
  {
    title: "Restaurant\n& Food",
    sub: "Order · Reserve · Catering",
    color: "#EA580C",
    bg: "linear-gradient(135deg,#EA580C 0%,#C2410C 100%)",
    image: "/images/hero-businessman.png", // real photo slot
    icon: Utensils,
  },
  {
    title: "Hospital\n& Doctors",
    sub: "Book Appointment Now",
    color: "#0891B2",
    bg: "linear-gradient(135deg,#0891B2 0%,#0E7490 100%)",
    image: "/images/hero-businessman.png",
    icon: HeartPulse,
  },
  {
    title: "Real Estate",
    sub: "Buy · Sell · Rent",
    color: "#7C3AED",
    bg: "linear-gradient(135deg,#7C3AED 0%,#6D28D9 100%)",
    image: "/images/hero-businessman.png",
    icon: Building,
  },
  {
    title: "Repairs &\nServices",
    sub: "Get Nearest Vendor",
    color: "#059669",
    bg: "linear-gradient(135deg,#059669 0%,#047857 100%)",
    image: "/images/hero-businessman.png",
    icon: Wrench,
  },
];

const QUICK_CATS = [
  { name: "Restaurants",          icon: Utensils,      color: "#EA580C", bg: "#FFF3E8" },
  { name: "Hotels",               icon: Building,      color: "#7C3AED", bg: "#F5EEFF" },
  { name: "Hospitals",            icon: HeartPulse,    color: "#DC2626", bg: "#FEF2F2" },
  { name: "Education",            icon: GraduationCap, color: "#2563EB", bg: "#EFF6FF" },
  { name: "Interior & Const.",    icon: HardHat,       color: "#D97706", bg: "#FFFBEB" },
  { name: "Automobile",           icon: Car,           color: "#0284C7", bg: "#F0F9FF" },
  { name: "Electronics",          icon: Smartphone,    color: "#059669", bg: "#ECFDF5" },
  { name: "Fashion",              icon: Shirt,         color: "#DB2777", bg: "#FDF2F8" },
  { name: "Home Services",        icon: Wrench,        color: "#0F766E", bg: "#F0FDFA" },
  { name: "Deals & Offers",       icon: Tag,           color: "#B45309", bg: "#FFFBEB" },
];

export default function HeroSearch() {
  const router = useRouter();
  const { city, openLocationModal } = useUserLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) { setResults([]); return; }
    fetchAutocomplete();
  }, [debouncedQuery]);

  const fetchAutocomplete = async () => {
    setLoading(true);
    try {
      const response = await TrueDialAPI.autocompleteSearch(debouncedQuery);
      const items = response.data?.data || response.data || [];
      setResults(Array.isArray(items) ? items : []);
      setShowDropdown(true);
    } catch { setResults([]); } finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&city=${encodeURIComponent(city || "Patna")}`);
    } else {
      router.push(`/search?city=${encodeURIComponent(city || "Patna")}`);
    }
  };

  const AutocompleteDropdown = () => (
    <div className="absolute top-[100%] left-0 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-orange-50 px-4 py-2 border-b border-gray-100 flex items-center">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EA580C]">
          🏢 Matching Businesses in {city || "Patna"}
        </span>
      </div>
      {loading ? (
        <div className="p-6 text-center text-sm text-gray-400">Searching businesses...</div>
      ) : results.length > 0 ? (
        <div className="max-h-80 overflow-y-auto">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setQuery(item.name || item.title);
                setShowDropdown(false);
                router.push(`/search?q=${encodeURIComponent(item.name || item.title)}&city=${encodeURIComponent(city || "Patna")}`);
              }}
              className="flex flex-col p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">{item.name || item.title}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-[#EA580C] bg-orange-100 px-1.5 py-0.5 rounded">
                  {item.category?.name || "Business"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-sm text-gray-400">No results found for &quot;{query}&quot;</div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col relative" ref={dropdownRef}>

      {/* ════════════════════════════════════════════════════
          MOBILE SEARCH (< md)
      ════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col bg-white shadow-sm border-b border-slate-200 relative z-30 w-full px-4 pt-3 pb-3">
        <form onSubmit={handleSearch} className="flex flex-col w-full gap-2">
          <button type="button" onClick={openLocationModal}
            className="flex items-center gap-1.5 text-slate-700 self-start px-1">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            <span className="text-sm font-bold">{city || "Patna"}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input type="text" value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => { if (query.trim().length >= 2) setShowDropdown(true); }}
              className="flex-1 text-slate-800 text-sm font-medium outline-none bg-transparent h-10 placeholder:text-gray-400"
              placeholder="Search Business, Service..." />
            <button type="submit"
              className="bg-[#1E40AF] text-white w-9 h-9 rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
        {showDropdown && debouncedQuery.trim().length >= 2 && (
          <div className="relative"><AutocompleteDropdown /></div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          DESKTOP HERO — JustDial-style layout
      ════════════════════════════════════════════════════ */}
      <div
        className="hidden md:block w-full relative z-10"
        style={{ background: "linear-gradient(180deg, #0B1D3A 0%, #0F2A55 100%)" }}
      >
        {/* Subtle dot-grid texture */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="max-w-7xl mx-auto px-6 xl:px-10 py-10 pb-6 relative z-10">

          {/* ── Headline + Search ───────────────────────── */}
          <div className="mb-6">
            <p className="text-white/60 text-[14px] font-semibold mb-1 tracking-wide">India&apos;s Emerging</p>
            <h1 className="font-black text-[36px] lg:text-[44px] leading-[1.05] tracking-tight mb-1">
              <span style={{ color: "#FBBF24" }}>Business Growth</span>
              <span className="text-white"> Platform</span>
            </h1>
            <p className="text-white/70 text-[15px] font-medium mb-5">
              <em>Beyond Listing.</em> We Help Businesses{" "}
              <strong className="text-[#FBBF24]">Grow.</strong>
            </p>

            {/* ── SEARCH BAR (JustDial style — split left + right) ── */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-stretch bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25)] border border-white/10 h-[62px] max-w-3xl">
                {/* Location selector */}
                <button type="button" onClick={openLocationModal}
                  className="flex items-center gap-2 px-5 h-full hover:bg-gray-50 transition-colors shrink-0 border-r border-gray-200 min-w-[170px] group">
                  <MapPin className="w-4 h-4 text-[#EA580C] shrink-0" />
                  <span className="text-[15px] font-semibold text-slate-700 truncate max-w-[100px]">{city || "Patna"}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-auto group-hover:text-slate-600 transition-colors" />
                </button>

                {/* Search input */}
                <div className="flex-1 flex items-center px-4 h-full gap-3">
                  <Search className="w-5 h-5 text-slate-300 shrink-0" />
                  <input type="text" value={query}
                    onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => { if (query.trim().length >= 2) setShowDropdown(true); }}
                    className="flex-1 text-slate-900 text-[15px] font-medium outline-none bg-transparent placeholder:text-gray-400"
                    placeholder="Search for Restaurant, Hospital, Hotel, Service..." />
                  {/* Mic icon */}
                  <button type="button" className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <Mic className="w-4 h-4 text-blue-500" />
                  </button>
                </div>

                {/* Orange search button */}
                <button type="submit"
                  className="bg-[#EA580C] hover:bg-[#C2410C] transition-colors h-full px-7 flex items-center justify-center shrink-0 gap-2">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Autocomplete */}
              {showDropdown && debouncedQuery.trim().length >= 2 && (
                <div className="max-w-3xl"><AutocompleteDropdown /></div>
              )}
            </form>

            {/* ── Feature pills row ── */}
            <div className="flex items-center gap-6 mt-4">
              {[
                { label: "Find",  sub: "Verified Businesses", svgPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                { label: "Get",   sub: "Best Deals & Offers",  svgPath: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
                { label: "Grow",  sub: "Your Business",        svgPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-white/10 rounded-lg border border-white/15">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.svgPath} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-[13px] leading-none">{item.label}</p>
                    <p className="text-white/60 text-[11px] leading-none mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
              <div className="ml-auto flex items-center gap-1.5 bg-white/8 border border-white/10 rounded-xl px-3 py-1.5">
                <div className="w-4 h-4 rounded-full bg-[#EA580C] flex items-center justify-center">
                  <span className="text-white font-black text-[7px]">TD</span>
                </div>
                <span className="text-white/80 text-[11px] font-bold">50,000+ Businesses</span>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              SERVICE CARDS ROW — JustDial style (Banner + 4 Cards)
          ════════════════════════════════════════════════ */}
          <div className="flex gap-3 pb-2 h-[220px]">

            {/* Left Promo Banner */}
            <Link href="/business/register" className="w-[42%] relative rounded-2xl overflow-hidden group">
              <Image 
                src="/images/promo-banner.jpg" 
                alt="Grow your business" 
                fill 
                sizes="40vw"
                className="object-cover object-[80%_center] group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D3A]/95 via-[#0B1D3A]/70 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                <span className="text-[#FBBF24] text-[10px] font-black uppercase tracking-widest mb-2 border border-[#FBBF24]/30 bg-[#FBBF24]/10 rounded px-2 py-0.5 w-max">
                  Business Solutions
                </span>
                <h3 className="text-white font-black text-[24px] leading-[1.1] mb-2">
                  Grow Your Business<br/>With TrueDial
                </h3>
                <p className="text-white/80 text-[13px] font-medium mb-5 max-w-[200px]">
                  Get premium leads, expand your reach, and manage customers.
                </p>
                <div className="flex items-center gap-2 bg-[#EA580C] hover:bg-[#C2410C] transition-colors text-white px-4 py-2 rounded-xl w-max shadow-[0_4px_15px_rgba(234,88,12,0.3)]">
                  <span className="text-[13px] font-bold">List Business FREE</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Right 4 Cards */}
            <div className="flex-1 grid grid-cols-4 gap-3">
              {[
                {
                  title: "B2B\nServices",
                  sub: "Quick Quotes",
                  bg: "linear-gradient(135deg,#1E40AF 0%,#1E3A8A 100%)",
                  badge: "Tenders",
                  image: "/images/card-b2b.jpg",
                },
                {
                  title: "Repairs &\nServices",
                  sub: "Nearest Vendor",
                  bg: "linear-gradient(135deg,#0891B2 0%,#0E7490 100%)",
                  badge: "Home/Office",
                  image: "/images/card-repair.jpg",
                },
                {
                  title: "Real\nEstate",
                  sub: "Buy · Sell · Rent",
                  bg: "linear-gradient(135deg,#7C3AED 0%,#6D28D9 100%)",
                  badge: "Top Agents",
                  image: "/images/card-realestate.jpg",
                },
                {
                  title: "Doctors &\nHospitals",
                  sub: "Appointments",
                  bg: "linear-gradient(135deg,#059669 0%,#047857 100%)",
                  badge: "Verified",
                  image: "/images/card-doctor.jpg",
                },
              ].map((card, i) => (
                <Link
                  href="/search"
                  key={i}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ background: card.bg }}
                >
                  {/* Real solid photo as FULL background */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="20vw"
                      className="object-cover object-top opacity-100"
                    />
                  </div>

                  {/* Top-down gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent pointer-events-none" />

                  {/* Content (Z-10 so it sits above the image) */}
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-white/80 text-[9px] font-bold uppercase tracking-wider border border-white/30 bg-white/10 backdrop-blur-md rounded px-1.5 py-0.5 shadow-sm">
                        {card.badge}
                      </span>
                      <h3 className="text-white font-black text-[15px] leading-[1.1] mt-2 whitespace-pre-line drop-shadow-md">{card.title}</h3>
                      <p className="text-white/90 text-[11px] font-medium mt-1 drop-shadow-sm">{card.sub}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
