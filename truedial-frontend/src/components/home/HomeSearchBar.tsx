"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Grid, Search as SearchIcon, ArrowRight, Sparkles } from "lucide-react";

const POPULAR_CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Chennai"];
const POPULAR_CATEGORIES = ["Restaurants", "Hotels", "Hospitals", "Interior Designers", "Architects", "Packers & Movers"];

export default function HomeSearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (category.trim()) params.set("category", category.trim());
    if (query.trim()) params.set("q", query.trim());

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form 
        onSubmit={handleSearch} 
        className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-3 border border-gray-100 w-full relative"
      >
        {/* City / Location Input */}
        <div className="relative flex items-center gap-2 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100 flex-1 w-full md:w-auto">
          <MapPin className="text-primary w-5 h-5 shrink-0" />
          <input 
            type="text" 
            placeholder="City or Pincode" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => {
              setShowCityDropdown(true);
              setShowCategoryDropdown(false);
            }}
            onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
            className="bg-transparent outline-none w-full text-sm sm:text-base font-medium text-navy placeholder:text-gray-400" 
          />
          {showCityDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1">Top Cities</div>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCity(c);
                    setShowCityDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 hover:text-primary rounded-lg font-medium transition"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Input */}
        <div className="relative flex items-center gap-2 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100 flex-1 w-full md:w-auto">
          <Grid className="text-primary w-5 h-5 shrink-0" />
          <input 
            type="text" 
            placeholder="Category (e.g. Restaurants)" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onFocus={() => {
              setShowCategoryDropdown(true);
              setShowCityDropdown(false);
            }}
            onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
            className="bg-transparent outline-none w-full text-sm sm:text-base font-medium text-navy placeholder:text-gray-400" 
          />
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1">Popular Categories</div>
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50 hover:text-primary rounded-lg font-medium transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Query Input */}
        <div className="flex items-center gap-2 px-4 py-3 flex-[1.5] w-full md:w-auto">
          <SearchIcon className="text-primary w-5 h-5 shrink-0" />
          <input 
            type="text" 
            placeholder="Search business name..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm sm:text-base font-medium text-navy placeholder:text-gray-400" 
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
    </div>
  );
}
