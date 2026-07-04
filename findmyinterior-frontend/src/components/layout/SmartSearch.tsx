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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>(["Patna"]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
    
    api.get("/locations?active_only=1").then(res => {
      if(res.data?.data) {
        setLocations(res.data.data.map((l:any) => l.name));
      }
    }).catch(console.error);
  }, []);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent, term?: string, href?: string) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    
    if (href) {
      router.push(href);
      return;
    }

    const finalTerm = term !== undefined ? term : searchQuery;
    if (finalTerm.trim()) {
      router.push(`/professionals?search=${encodeURIComponent(finalTerm.trim())}`);
    } else {
      router.push("/professionals");
    }
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
    if (matchedServices.length > 0 && locations.length > 0) {
      newSuggestions.push({
        type: "service_in_city",
        text: `${matchedServices[0]} in ${locations[0]}`,
        href: `/professionals?search=${encodeURIComponent(matchedServices[0])}&city=${encodeURIComponent(locations[0])}`
      });
    }

    return newSuggestions;
  };

  const suggestions = getSuggestions(searchQuery);

  return (
    <div ref={containerRef} className="hidden lg:flex flex-1 max-w-2xl relative z-50">
      <form onSubmit={handleSearch} className="flex flex-1 items-center bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1.5 shadow-inner transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:border-orange-200">
        <div className="flex items-center px-4 border-r border-gray-300 min-w-[130px] cursor-pointer hover:bg-gray-100/50 rounded-l-lg transition-colors py-1">
          <MapPin className="w-4 h-4 text-[#E8701A] mr-2" />
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap hidden sm:block">Searching in</span>
          <span className="text-sm font-semibold text-gray-700 ml-1">{locations[0] || "Patna"}</span>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
        <div className="flex-1 px-4 relative">
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
            className="w-full bg-transparent text-sm font-medium outline-none text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
        <button type="submit" className="flex items-center px-4 border-l border-transparent min-w-[120px] cursor-pointer bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] hover:from-[#E8701A] hover:to-[#c25a12] text-white rounded-lg py-2 transition-all duration-300 transform shadow-sm hover:shadow-md">
          <div className="flex items-center justify-center w-full">
            <Search className="w-4 h-4 mr-2" />
            <span className="text-sm font-bold tracking-wide">SEARCH</span>
          </div>
        </button>
      </form>

      {/* Dropdown Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="py-2">
            {suggestions.map((suggestion, idx) => (
              <li key={idx}>
                <button
                  onClick={() => {
                    setSearchQuery(suggestion.text);
                    handleSearch(undefined, suggestion.text, suggestion.href);
                  }}
                  className="w-full text-left px-5 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 flex items-center transition-colors"
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
  );
}
