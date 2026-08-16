"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronRight, Mic, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
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
    <div className="w-full">
      <div className="bg-[#0A1C3A] rounded-[32px] p-6 sm:p-10 overflow-hidden shadow-2xl border border-[#1E40AF]/40 relative">
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full -ml-10 -mb-10 blur-3xl" />
        
        <div className="max-w-4xl mx-auto z-10 relative">
          {/* Location Bar & Voice */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
            <button 
              type="button" 
              onClick={openLocationModal}
              className="flex-row inline-flex items-center bg-white px-5 py-3 rounded-full shadow-md w-full sm:w-auto hover:bg-gray-50 transition"
            >
              <MapPin className="w-5 h-5 text-[#1E40AF]" />
              <span className="text-sm font-bold text-slate-900 mx-3 truncate max-w-[200px]">{city || "Select Location"}</span>
              <ChevronRight className="w-5 h-5 text-slate-400 ml-auto sm:ml-2 rotate-90 sm:rotate-0" />
            </button>

            <button type="button" className="hidden sm:flex w-12 h-12 rounded-full bg-white items-center justify-center shadow-md hover:bg-gray-50 transition">
              <Mic className="w-5 h-5 text-[#1E40AF]" />
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full mb-10 z-20" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="flex flex-row items-center bg-white rounded-full pl-5 pr-2 h-16 shadow-xl w-full hover:shadow-2xl transition-shadow duration-300">
              <Search className="w-6 h-6 text-slate-400 mr-3 hidden sm:block" />
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
                className="flex-1 text-slate-900 text-base font-medium outline-none bg-transparent h-full placeholder:text-gray-400"
                placeholder="Search Business, Service, Product..."
              />
              <button type="submit" className="bg-[#1E40AF] hover:bg-blue-800 transition-colors h-12 px-6 rounded-full items-center justify-center flex shadow-md">
                <span className="text-white font-bold hidden sm:inline mr-2">Search</span>
                <Search className="w-5 h-5 text-white" />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {showDropdown && debouncedQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
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
                      <div 
                        key={item.id}
                        onClick={() => {
                          setQuery(item.name || item.title);
                          setShowDropdown(false);
                          router.push(`/search?q=${encodeURIComponent(item.name || item.title)}&city=${encodeURIComponent(city || "Mumbai")}`);
                        }}
                        className="flex flex-col p-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-gray-50 dark:border-slate-800/50 last:border-0 transition"
                      >
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
                  <div className="p-6 text-center text-sm text-gray-400">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hero Text */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-semibold text-blue-200 mb-2 uppercase tracking-wide">India's Emerging</h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#F59E0B] leading-tight md:leading-[1.1]">Business Growth</h1>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight md:leading-[1.1] mb-4">Platform</h1>
              <p className="text-lg md:text-xl text-blue-100 font-medium mb-1">Beyond Listing.</p>
              <p className="text-lg md:text-xl text-blue-100 font-medium mb-8">We Help Businesses Grow.</p>

              <Link href="/search">
                <button className="bg-[#F59E0B] hover:bg-amber-400 transition-colors py-4 px-8 rounded-full inline-flex items-center shadow-xl group">
                  <span className="text-base font-black text-slate-900 mr-3 uppercase tracking-wide">Explore Now</span>
                  <ArrowRight className="w-5 h-5 text-slate-900 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Right side floating badge */}
            <div className="md:w-48 bg-[#1E40AF]/40 backdrop-blur-md border border-blue-400/30 p-4 md:p-6 rounded-3xl items-center text-center shadow-2xl">
              <Trophy className="w-12 h-12 text-[#F59E0B] mb-3 mx-auto" />
              <p className="text-sm font-bold text-white leading-snug">Trusted by Thousands of Businesses Across India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
