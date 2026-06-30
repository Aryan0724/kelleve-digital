"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";

export function SmartSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const q = query.toLowerCase();
    if (q.startsWith("con")) {
      return [
        { text: "Contractors", href: "/professionals?category=contractor" },
        { text: "Construction Projects", href: "/dashboard?tab=projects" },
        { text: "Concrete Suppliers", href: "/materials?search=concrete" }
      ];
    }
    if (q.startsWith("int")) {
      return [
        { text: "Interior Designers", href: "/professionals?category=interior" },
        { text: "Interior Projects", href: "/dashboard?tab=projects" },
      ];
    }
    if (q.startsWith("wor")) {
      return [
        { text: "Workers", href: "/workers" },
        { text: "Worker Jobs", href: "/workers?tab=jobs" },
      ];
    }
    if (q.startsWith("arc")) {
      return [
        { text: "Architects", href: "/professionals?category=architect" },
      ];
    }
    if (q.startsWith("bui")) {
      return [
        { text: "Builders", href: "/professionals?category=builder" },
        { text: "Building Materials", href: "/materials" },
      ];
    }
    if (q.trim() !== "") {
      return [
        { text: `${q} in Patna`, href: `/professionals?search=${encodeURIComponent(q)}&city=Patna` },
        { text: `${q} professionals`, href: `/professionals?search=${encodeURIComponent(q)}` }
      ];
    }
    return [];
  };

  const suggestions = getSuggestions(searchQuery);

  return (
    <div ref={containerRef} className="hidden lg:flex flex-1 max-w-2xl relative z-50">
      <form onSubmit={handleSearch} className="flex flex-1 items-center bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1.5 shadow-inner transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:border-orange-200">
        <div className="flex items-center px-4 border-r border-gray-300 min-w-[130px] cursor-pointer hover:bg-gray-100/50 rounded-l-lg transition-colors py-1">
          <MapPin className="w-4 h-4 text-[#E8701A] mr-2" />
          <span className="text-sm font-semibold text-gray-700">Patna</span>
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
