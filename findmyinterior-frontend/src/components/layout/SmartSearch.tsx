"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import api from "@/lib/api";

export function SmartSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("Patna");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
    
    api.get("/locations?active_only=1").then(res => {
      if(res.data?.data) {
        const locs = res.data.data.map((l:any) => l.name);
        setLocations(locs);
        if (locs.length > 0) {
          // Check if Patna is in the list, otherwise use the first one
          if (locs.includes("Patna")) {
            setSelectedLocation("Patna");
          } else {
            setSelectedLocation(locs[0]);
          }
        }
      }
    }).catch(console.error);
  }, []);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent, term?: string, href?: string) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    setShowLocationDropdown(false);
    
    if (href) {
      router.push(href);
      return;
    }

    const finalTerm = term !== undefined ? term : searchQuery;
    let url = `/professionals`;
    const params = new URLSearchParams();
    
    if (finalTerm.trim()) {
      params.append('search', finalTerm.trim());
    }
    if (selectedLocation) {
      params.append('city', selectedLocation);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    router.push(url);
  };

  const getSuggestions = (query: string) => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return [];
    
    let newSuggestions: any[] = [];
    
    // Basic match for services
    const matchedServices = [
      "Interior Designer", "Modular Kitchen", "False Ceiling", 
      "Painter", "Carpenter", "Architect", "Plumber", "Electrician", "Contractor"
    ].filter(s => s.toLowerCase().includes(q)).slice(0, 3);
    
    newSuggestions = matchedServices.map(s => ({
      type: "service",
      text: s,
      href: `/professionals?search=${encodeURIComponent(s)}`
    }));

    // Combine with locations
    if (matchedServices.length > 0 && selectedLocation) {
      newSuggestions.push({
        type: "service_in_city",
        text: `${matchedServices[0]} in ${selectedLocation}`,
        href: `/professionals?search=${encodeURIComponent(matchedServices[0])}&city=${encodeURIComponent(selectedLocation)}`
      });
    }

    return newSuggestions;
  };

  const suggestions = getSuggestions(searchQuery);

  return (
    <div className="hidden lg:flex flex-1 max-w-2xl relative z-50">
      <form onSubmit={handleSearch} className="flex flex-1 items-center bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-1.5 shadow-inner transition-all duration-300 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-md focus-within:border-orange-200">
        
        {/* Location Dropdown Trigger */}
        <div 
          ref={locationRef}
          onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          className="flex items-center px-4 border-r border-gray-300 dark:border-slate-600 min-w-[130px] cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-700/50 rounded-l-lg transition-colors py-1 relative"
        >
          <MapPin className="w-4 h-4 text-[#E8701A] mr-2" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap hidden sm:block">Searching in</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">{selectedLocation}</span>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
          
          {/* Location Dropdown Menu */}
          {showLocationDropdown && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <ul className="max-h-64 overflow-y-auto py-2">
                {locations.length > 0 ? locations.map((loc, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedLocation === loc ? 'bg-orange-50 text-orange-700 font-semibold dark:bg-slate-700 dark:text-orange-400' : 'text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-orange-600'}`}
                    >
                      {loc}
                    </button>
                  </li>
                )) : (
                  <li className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">No locations found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div ref={containerRef} className="flex-1 px-4 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setShowSuggestions(true);
              }}
              placeholder="Search services, professionals, projects, suppliers..." 
              className="w-full bg-transparent text-sm font-medium outline-none text-gray-800 dark:text-white placeholder:text-gray-400 placeholder:font-normal"
            />

            {/* Dropdown Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <ul className="py-2">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery(suggestion.text);
                          handleSearch(undefined, suggestion.text, suggestion.href);
                        }}
                        className="w-full text-left px-5 py-2.5 text-sm text-slate-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-700 dark:hover:text-orange-500 flex items-center transition-colors"
                      >
                        <Search className="w-4 h-4 mr-3 text-slate-400 group-hover:text-orange-500" />
                        {suggestion.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        <button type="submit" className="flex items-center px-4 border-l border-transparent min-w-[120px] cursor-pointer bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] hover:from-[#E8701A] hover:to-[#c25a12] text-white rounded-lg py-2 transition-all duration-300 transform shadow-sm hover:shadow-md">
          <div className="flex items-center justify-center w-full">
            <Search className="w-4 h-4 mr-2" />
            <span className="text-sm font-bold tracking-wide">SEARCH</span>
          </div>
        </button>
      </form>
    </div>
  );
}
