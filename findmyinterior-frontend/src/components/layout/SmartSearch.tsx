"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown, LocateFixed, Loader2 } from "lucide-react";
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
  const [isLocating, setIsLocating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery, showSuggestions]);
  
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

  const handleLocateMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.county || data.address.state_district;
            if (city) {
              // Check if city exists in our locations, otherwise use raw
              const exactMatch = locations.find(l => l.toLowerCase() === city.toLowerCase());
              setSelectedLocation(exactMatch || city);
              setShowLocationDropdown(false);
            }
          }
        } catch (error) {
          console.error("Error fetching city from coordinates", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, { capture: true });
    document.addEventListener("touchstart", handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, { capture: true });
      document.removeEventListener("touchstart", handleClickOutside, { capture: true });
    };
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
    const q = query.trim().toLowerCase();
    
    const ALL_SERVICES = [
      "Interior Designer",
      "Interior Company",
      "Interior Decorator",
      "Architect",
      "Building Contractor",
      "Civil Contractor",
      "Skilled Workers",
      "Modular Kitchen",
      "False Ceiling Contractor",
      "Furniture Supplier",
      "Material Supplier",
      "Painter",
      "Plumber",
      "Electrician",
      "Carpenter"
    ];
    
    let matchedServices: string[] = [];
    
    if (!q) {
      matchedServices = ["Interior Designer", "Architect", "Modular Kitchen", "Building Contractor", "Skilled Workers"];
    } else {
      matchedServices = ALL_SERVICES.filter(s => s.toLowerCase().includes(q)).slice(0, 5);
    }
    
    const newSuggestions: any[] = matchedServices.map(s => ({
      type: "service",
      text: s,
      href: `/professionals?search=${encodeURIComponent(s)}`
    }));

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
    <div className="flex flex-1 w-full max-w-2xl relative z-50">
      <form onSubmit={handleSearch} className="flex flex-1 items-center bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl p-1.5 shadow-inner transition-all duration-300 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-md focus-within:border-orange-200">
        
        {/* Location Dropdown Trigger */}
        <div 
          ref={locationRef}
          onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          className="flex items-center px-2 sm:px-4 border-r border-gray-300 dark:border-slate-600 min-w-[90px] sm:min-w-[130px] cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-700/50 rounded-l-lg transition-colors py-1 relative"
        >
          <MapPin className="w-4 h-4 text-[#E8701A] mr-2" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap hidden sm:block">Searching in</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">{selectedLocation}</span>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
          
          {/* Location Dropdown Menu */}
          {showLocationDropdown && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <ul className="max-h-64 overflow-y-auto py-2">
                <li>
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    disabled={isLocating}
                    className="w-full text-left px-4 py-2 text-sm font-semibold text-[#E8701A] hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors flex items-center border-b border-gray-100 dark:border-slate-700 pb-3 mb-1"
                  >
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LocateFixed className="w-4 h-4 mr-2" />
                    )}
                    Use current location
                  </button>
                </li>
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
        <div ref={containerRef} className={`flex-1 relative min-w-[150px] ${compact ? 'px-2' : 'px-4'}`}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (showSuggestions && suggestions.length > 0) {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                  } else if (e.key === "Enter" && selectedIndex >= 0) {
                    e.preventDefault();
                    const suggestion = suggestions[selectedIndex];
                    if (suggestion) {
                      setSearchQuery(suggestion.text);
                      handleSearch(undefined, suggestion.text, suggestion.href);
                      setShowSuggestions(false);
                    }
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }
              }}
              placeholder={compact ? "Search..." : "Search services, professionals, projects, suppliers..."} 
              className={`w-full bg-transparent font-medium outline-none text-gray-800 dark:text-white placeholder:text-gray-400 placeholder:font-normal ${compact ? 'text-[13px] py-1.5' : 'text-sm py-2'}`}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 w-full min-w-[320px] mt-3 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
                <ul className="py-2">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery(suggestion.text);
                          handleSearch(undefined, suggestion.text, suggestion.href);
                        }}
                        className={`w-full text-left px-5 py-2.5 text-sm flex items-center transition-colors overflow-hidden ${
                          selectedIndex === idx
                            ? 'bg-orange-100 dark:bg-slate-600 text-orange-700 dark:text-orange-400'
                            : 'text-slate-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-700 dark:hover:text-orange-500'
                        }`}
                      >
                        <Search className={`w-4 h-4 mr-3 shrink-0 ${selectedIndex === idx ? 'text-orange-500' : 'text-slate-400 group-hover:text-orange-500'}`} />
                        <span className="truncate flex-1">{suggestion.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        <button type="submit" className={`flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#E8701A] to-[#c25a12] hover:from-[#c25a12] hover:to-[#E8701A] text-white transition-all duration-300 shadow-sm hover:shadow-md ${compact ? 'w-8 h-8 rounded-full' : 'px-4 min-w-[48px] sm:min-w-[120px] rounded-lg py-2.5 ml-2 mr-1'}`}>
          <div className="flex items-center justify-center gap-2">
            <Search className="w-4 h-4 shrink-0" />
            {!compact && <span className="hidden sm:inline text-sm font-bold tracking-wide">SEARCH</span>}
          </div>
        </button>
      </form>
    </div>
  );
}
