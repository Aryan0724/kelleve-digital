"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronRight, ChevronDown, Mic, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUserLocation } from "@/context/LocationContext";
import { TrueDialAPI } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

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
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    fetchAutocomplete();
  }, [debouncedQuery]);

  const fetchAutocomplete = async () => {
    setLoading(true);
    try {
      const response = await TrueDialAPI.autocompleteSearch(debouncedQuery);
      const items = response.data?.data || response.data || [];
      setResults(Array.isArray(items) ? items : []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Autocomplete fetch failed", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&city=${encodeURIComponent(city || "Mumbai")}`);
    } else {
      router.push(`/search?city=${encodeURIComponent(city || "Mumbai")}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-0 md:pb-20 flex flex-col" ref={dropdownRef}>
      
      {/* === MOBILE SEARCH BAR (Visible < MD) === */}
      <div className="md:hidden flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 relative z-30">
        <form onSubmit={handleSearch} className="flex flex-col w-full">
          {/* Top Row: Location & Mic */}
          <div className="flex items-center justify-between border-b border-slate-100 p-3">
            <button type="button" onClick={openLocationModal} className="flex items-center gap-1.5 text-slate-800 flex-1">
              <MapPin className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-bold truncate max-w-[150px]">{city || "Patna, Bihar"}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button type="button" className="p-2 text-slate-500 bg-slate-50 rounded-full border border-slate-100">
              <Mic className="w-4 h-4" />
            </button>
          </div>
          
          {/* Bottom Row: Search Input & Button */}
          <div className="flex items-center p-2 relative">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (query.trim().length >= 2) setShowDropdown(true);
              }}
              className="flex-1 text-slate-800 text-sm font-medium outline-none bg-transparent px-3 h-10 placeholder:text-gray-400"
              placeholder="Search Business, Service, Product..."
            />
            <button type="submit" className="bg-[#1E40AF] text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md shrink-0">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Mobile Autocomplete Dropdown */}
        {showDropdown && debouncedQuery.trim().length >= 2 && (
          <div className="absolute top-[100%] left-0 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="bg-orange-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                🏢 Matching Businesses in {city || "Patna"}
              </span>
            </div>
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-400">Searching businesses...</div>
            ) : results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {results.map((item) => (
                  <div key={item.id} onClick={() => {
                    setQuery(item.name || item.title);
                    setShowDropdown(false);
                    router.push(`/search?q=${encodeURIComponent(item.name || item.title)}&city=${encodeURIComponent(city || "Patna")}`);
                  }} className="flex flex-col p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">{item.name || item.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-primary bg-orange-100 px-1.5 py-0.5 rounded">
                        {item.category?.name || "Business"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-400">No results found for "{query}"</div>
            )}
          </div>
        )}
      </div>

      {/* === HERO BANNER (Desktop bg container, Mobile second block) === */}
      <div className="bg-[#0B1530] rounded-3xl md:rounded-[2rem] p-6 sm:p-10 shadow-2xl border border-[#1E40AF]/40 relative z-10">
        
        {/* Background elements */}
        <div className="absolute inset-0 rounded-3xl md:rounded-[2rem] overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full -ml-10 -mb-10 blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto z-10 relative">
          {/* Hero Text */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 z-10 relative">
            {/* Left side: Text Content */}
            <div className="flex-1 max-w-2xl">
              <h2 className="text-lg md:text-xl font-normal text-white mb-2">India's Emerging</h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-[1.1]"><span className="text-[#F59E0B]">Business Growth</span> <span className="text-white">Platform</span></h1>
              <p className="text-lg md:text-xl text-blue-100 font-medium mt-4 mb-8">
                Beyond Listing. We Help Businesses <span className="text-[#F59E0B] font-bold">Grow.</span>
              </p>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-0">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 w-max">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <p className="text-white font-medium text-sm">Find Verified Businesses</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 w-max">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                  <p className="text-white font-medium text-sm">Get Best Deals & Offers</p>
                </div>
              </div>
            </div>

            {/* Right side: Hero Image & Floating Badge */}
            <div className="flex relative w-full md:w-[40%] justify-center md:justify-end items-center h-[250px] md:h-[320px] z-10">
              {/* Hero Image as a stylish Card */}
              <div className="relative w-full h-full max-w-[400px] rounded-2xl overflow-hidden border-4 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <Image 
                  src="/images/hero-family.png"
                  alt="Business Growth"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              
              {/* Floating Badge overlapping the image slightly */}
              <div className="absolute -right-2 md:-right-8 top-10 flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-6 rounded-2xl items-center text-center shadow-2xl max-w-[140px] md:max-w-[160px] z-20">
                <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[#F59E0B] mb-2" />
                <p className="text-xs md:text-sm font-bold text-white leading-tight">Trusted by<br/>Thousands of<br/><span className="text-[#F59E0B]">Businesses</span><br/>Across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === DESKTOP SEARCH BAR (Visible >= MD) === */}
      <div className="hidden md:block relative w-full -mt-10 z-20 max-w-4xl mx-auto px-4 md:px-0">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center bg-white rounded-2xl md:rounded-[24px] p-2 md:p-2 h-auto md:h-[72px] shadow-2xl w-full border border-gray-100 gap-0">
          
          <button type="button" onClick={openLocationModal} className="flex items-center justify-between w-full md:w-auto px-4 py-3 md:py-0 h-full hover:bg-gray-50 transition rounded-xl md:rounded-l-[20px] md:rounded-r-none border-b md:border-b-0 md:border-r border-gray-200 shrink-0 md:min-w-[180px]">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-700" />
              <span className="text-base font-medium text-slate-800">{city || "Mumbai"}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          <div className="flex-1 flex items-center h-[52px] md:h-full w-full px-4 md:px-4">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (query.trim().length >= 2) setShowDropdown(true);
              }}
              className="flex-1 text-slate-900 text-base font-medium outline-none bg-transparent h-full placeholder:text-gray-400 w-full"
              placeholder="Search for Restaurant, Hospital, School, Hotel, Service..."
            />
          </div>

          <button type="submit" className="bg-[#1E40AF] hover:bg-blue-800 transition-colors h-full px-10 rounded-[18px] flex items-center justify-center shadow-md shrink-0">
            <span className="text-white font-bold text-base">Search</span>
          </button>
        </form>

        {/* Desktop Autocomplete Dropdown */}
        {showDropdown && debouncedQuery.trim().length >= 2 && (
          <div className="absolute top-[100%] left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-orange-50 dark:bg-slate-800/80 px-4 py-2 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                🏢 Matching Businesses in {city || "Mumbai"}
              </span>
            </div>
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-400">Searching businesses...</div>
            ) : results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {results.map((item) => (
                  <div key={item.id} onClick={() => {
                    setQuery(item.name || item.title);
                    setShowDropdown(false);
                    router.push(`/search?q=${encodeURIComponent(item.name || item.title)}&city=${encodeURIComponent(city || "Mumbai")}`);
                  }} className="flex flex-col p-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-gray-50 dark:border-slate-800/50 last:border-0 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.name || item.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-primary bg-orange-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                        {item.category?.name || "Business"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-400">No results found for "{query}"</div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
