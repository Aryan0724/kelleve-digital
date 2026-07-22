"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, MapPin, ShieldCheck, Star } from "lucide-react";
import { TrueDialAPI } from "@/lib/api";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce"; // Will create this hook

export default function AutocompleteSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

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
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    fetchAutocomplete();
  }, [debouncedQuery]);

  const fetchAutocomplete = async () => {
    setLoading(true);
    try {
      const response = await TrueDialAPI.autocompleteSearch(debouncedQuery);
      setResults(response.data.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Autocomplete fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Search for businesses, services..."
          className="w-full h-10 pl-4 pr-10 rounded-full border border-border bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition">
          <SearchIcon className="w-5 h-5" />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (debouncedQuery.length >= 2) && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((item) => (
                <Link 
                  href={`/businesses/${item.slug}`} 
                  key={item.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition border-b border-border last:border-0"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-700">
                    {item.cover_image ? (
                      <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold">{item.title.charAt(0)}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                      {item.is_verified && <ShieldCheck className="w-3 h-3 text-green-500 flex-shrink-0 ml-1 mt-0.5" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="truncate">{item.category}</span>
                      {item.locality && (
                        <>
                          <span>•</span>
                          <span className="flex items-center truncate"><MapPin className="w-3 h-3 mr-0.5"/> {item.locality}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                      {item.rating} <Star className="w-3 h-3 fill-green-700" />
                    </div>
                  )}
                </Link>
              ))}
              <div 
                className="p-3 text-center text-sm font-semibold text-primary hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer bg-gray-50/50 dark:bg-slate-800/50"
                onClick={handleSearch}
              >
                See all results for "{query}"
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No matches found.</div>
          )}
        </div>
      )}
    </div>
  );
}
