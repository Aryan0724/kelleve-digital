"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, MapPin, ShieldCheck, Star, Building2, ArrowRight } from "lucide-react";
import { TrueDialAPI } from "@/lib/api";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserLocation } from "@/context/LocationContext";

export default function AutocompleteSearch() {
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

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    fetchAutocomplete();
  }, [debouncedQuery]);


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
    <div className="relative w-full max-w-lg mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative flex items-center bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-primary/50">
        {/* Location Switcher inside Search Bar */}
        <button
          type="button"
          onClick={openLocationModal}
          className="flex items-center gap-1 pl-3.5 pr-2.5 py-2.5 text-xs font-extrabold text-primary hover:bg-orange-50 dark:hover:bg-slate-700 transition border-r border-gray-200 dark:border-slate-700 shrink-0"
          title="Select Location"
        >
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate max-w-[85px]">{city || "Mumbai"}</span>
        </button>

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
          placeholder="Search for individual companies, businesses..."
          className="w-full h-10 pl-3 pr-10 bg-transparent focus:outline-none text-sm font-medium text-navy dark:text-white placeholder:text-gray-400"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-primary text-white hover:bg-orange-600 transition shadow-sm">
          <SearchIcon className="w-4 h-4" />
        </button>
      </form>

      {/* Autocomplete Dropdown showing Individual Companies & Businesses */}
      {showDropdown && debouncedQuery.trim().length >= 2 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-orange-50 dark:bg-slate-800/80 px-3.5 py-1.5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
              🏢 Matching Companies &amp; Businesses in {city || "Mumbai"}
            </span>
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-gray-400">Searching businesses...</div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((item) => (
                <Link 
                  href={`/businesses/${item.slug || "#"}`} 
                  key={item.id}
                  className="flex items-center gap-3.5 p-3 hover:bg-orange-50/70 dark:hover:bg-slate-800 transition border-b border-gray-100 dark:border-slate-800 last:border-0 group"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                    {item.gallery && item.gallery[0] ? (
                      <img src={item.gallery[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : item.cover_image ? (
                      <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span>{item.title?.charAt(0) || "B"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-navy dark:text-white truncate group-hover:text-primary transition">
                        {item.title}
                      </h4>
                      {(item.is_verified || item.rating) && (
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded ml-2 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.rating || "4.8"}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <span className="font-semibold text-primary">{item.category?.name || item.category || "Verified Business"}</span>
                      <span>•</span>
                      <span className="flex items-center truncate">
                        <MapPin className="w-3 h-3 mr-0.5 text-gray-400 shrink-0"/> {item.city || item.locality || "Mumbai"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              <div 
                className="p-3 text-center text-xs font-extrabold text-primary hover:bg-orange-50 dark:hover:bg-slate-800 cursor-pointer bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex items-center justify-center gap-1"
                onClick={handleSearch}
              >
                <span>See all businesses matching &quot;{query}&quot;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p className="font-medium">No individual company matching &quot;{query}&quot;.</p>
              <button
                type="button"
                onClick={handleSearch}
                className="mt-2 text-xs font-bold text-primary hover:underline"
              >
                Search all categories for &quot;{query}&quot; →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
