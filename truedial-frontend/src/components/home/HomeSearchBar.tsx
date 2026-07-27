"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Grid, Search as SearchIcon, ArrowRight, Navigation, Star, ShieldCheck } from "lucide-react";
import { useUserLocation } from "@/context/LocationContext";
import { TrueDialAPI } from "@/lib/api";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

const POPULAR_CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Chennai", "Ahmedabad"];
const POPULAR_CATEGORIES = ["Interior Designers", "Restaurants", "Hotels", "Hospitals", "Architects", "Packers & Movers", "B2B Wholesalers"];

export default function HomeSearchBar() {
  const router = useRouter();
  const { city: globalCity, setCity: setGlobalCity, detectLocation, isDetecting } = useUserLocation();
  const [city, setCity] = useState(globalCity || "Mumbai");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [companyResults, setCompanyResults] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const debouncedQuery = useDebounce(query, 250);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (globalCity) setCity(globalCity);
  }, [globalCity]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
        setShowCategoryDropdown(false);
        setShowCompanyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setCompanyResults([]);
      return;
    }
    fetchCompanies();
  }, [debouncedQuery]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const response = await TrueDialAPI.autocompleteSearch(debouncedQuery);
      const items = response.data?.data || response.data || [];
      setCompanyResults(Array.isArray(items) ? items : []);
      setShowCompanyDropdown(true);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      setCompanyResults([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCompanyDropdown(false);
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (category.trim()) params.set("category", category.trim());
    if (query.trim()) params.set("q", query.trim());

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative" ref={containerRef}>
      <form 
        onSubmit={handleSearch} 
        className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2 border border-gray-200 dark:border-slate-800 w-full relative"
      >
        {/* City / Location Input with GPS Detection */}
        <div className="relative flex items-center gap-2 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 flex-1 w-full md:w-auto">
          <MapPin className="text-primary w-5 h-5 shrink-0" />
          <input 
            type="text" 
            placeholder="City or Pincode" 
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setGlobalCity(e.target.value);
            }}
            onFocus={() => {
              setShowCityDropdown(true);
              setShowCategoryDropdown(false);
              setShowCompanyDropdown(false);
            }}
            className="bg-transparent outline-none w-full text-sm sm:text-base font-bold text-navy dark:text-white placeholder:text-gray-400" 
          />
          {showCityDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  detectLocation();
                  setShowCityDropdown(false);
                }}
                disabled={isDetecting}
                className="w-full mb-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center gap-1.5 justify-center transition shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isDetecting ? "Detecting GPS..." : "📍 Detect Current Location"}</span>
              </button>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1">Top Cities</div>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCity(c);
                    setGlobalCity(c);
                    setShowCityDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                    city === c ? "bg-primary text-white font-bold" : "hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Input */}
        <div className="relative flex items-center gap-2 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 flex-1 w-full md:w-auto">
          <Grid className="text-primary w-5 h-5 shrink-0" />
          <input 
            type="text" 
            placeholder="Category (e.g. Interiors)" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onFocus={() => {
              setShowCategoryDropdown(true);
              setShowCityDropdown(false);
              setShowCompanyDropdown(false);
            }}
            className="bg-transparent outline-none w-full text-sm sm:text-base font-bold text-navy dark:text-white placeholder:text-gray-400" 
          />
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1">Popular Categories</div>
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-primary rounded-lg font-medium transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Query Input (with Individual Company Autocomplete) */}
        <div className="relative flex items-center gap-2 px-4 py-3 flex-[1.5] w-full md:w-auto">
          <SearchIcon className="text-primary w-5 h-5 shrink-0" />
          <input 
            type="text" 
            placeholder="Search individual company or business name..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowCompanyDropdown(true);
            }}
            onFocus={() => {
              if (query.trim().length >= 2) setShowCompanyDropdown(true);
              setShowCityDropdown(false);
              setShowCategoryDropdown(false);
            }}
            className="bg-transparent outline-none w-full text-sm sm:text-base font-bold text-navy dark:text-white placeholder:text-gray-400" 
          />
        </div>

        {/* Search Submit Button */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <button 
            type="submit" 
            className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 w-full md:w-auto transition shadow-lg shadow-primary/30 text-base flex items-center justify-center gap-2"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Individual Company Autocomplete Dropdown */}
      {showCompanyDropdown && debouncedQuery.trim().length >= 2 && (
        <div className="absolute top-full right-0 w-full md:w-[60%] mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-orange-50 dark:bg-slate-800/80 px-4 py-2 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
              🏢 Matching Individual Companies in {city || "Mumbai"}
            </span>
          </div>

          {loadingCompanies ? (
            <div className="p-6 text-center text-sm text-gray-400">Searching companies...</div>
          ) : companyResults.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {companyResults.map((item) => (
                <Link 
                  href={`/businesses/${item.slug || "#"}`} 
                  key={item.id}
                  className="flex items-center gap-3.5 p-3.5 hover:bg-orange-50/70 dark:hover:bg-slate-800 transition border-b border-gray-100 dark:border-slate-800 last:border-0 group"
                  onClick={() => setShowCompanyDropdown(false)}
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
