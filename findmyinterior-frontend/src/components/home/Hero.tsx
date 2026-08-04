"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search as SearchIcon,
  MapPin,
  ChevronDown
} from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [city, setCity] = useState("Location");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (city && city !== "Location" && city !== "All Bihar") params.set("city", city);
    const queryString = params.toString();
    router.push(`/professionals${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="relative w-full bg-white dark:bg-slate-900 font-sans">
      
      <div className="container max-w-[1320px] mx-auto px-4 flex flex-col lg:flex-row items-center justify-between min-h-[600px] py-12">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-20 pr-0 lg:pr-12">
          
          <h1 className="text-5xl lg:text-[64px] font-black text-[#111827] dark:text-white leading-[1.1] mb-6 tracking-tight">
            Where Projects <br /> 
            Meet <span className="text-[#FF6B00]">Professionals</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium mb-12 max-w-[480px] leading-relaxed">
            Post your requirement and get multiple quotes from verified interior professionals.
          </p>

          {/* Search Bar - Embedded on the left side */}
          <div className="w-full max-w-[600px] mb-6">
            <div className="bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center w-full">
              
              {/* Location Segment */}
              <div className="flex items-center gap-2 px-4 py-3 w-full sm:w-44 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0">
                <MapPin className="w-5 h-5 text-[#111827] dark:text-white" />
                <span className="font-bold text-[#111827] dark:text-white flex-1 text-[15px] truncate">{city}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

              {/* Search Input Segment */}
              <form onSubmit={handleSearch} className="flex-1 w-full flex items-center pl-3 pr-1 gap-2">
                <input 
                  type="text" 
                  placeholder="Search Architects, Builders, Interior Designers..."
                  className="w-full bg-transparent border-none outline-none text-[#111827] dark:text-white font-semibold placeholder-slate-400 py-3 text-[15px] truncate"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="flex items-center justify-center bg-[#FF6B00] hover:bg-[#e66000] text-white p-3.5 rounded-full transition-colors shrink-0 shadow-sm"
                >
                  <SearchIcon className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-bold text-[#111827] dark:text-white mr-1">Popular searches:</span>
            {["Modular Kitchen", "Living Room", "False Ceiling", "Wardrobe", "Home Renovation", "Office Interiors"].map((tag) => (
              <span key={tag} className="text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#FF6B00] cursor-pointer transition-colors">
                {tag},
              </span>
            ))}
          </div>

        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 h-[500px] lg:h-[600px] relative mt-16 lg:mt-0 flex justify-end items-center">
          <div className="w-full h-full relative rounded-[32px] lg:rounded-l-[48px] lg:rounded-r-none overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" 
              alt="Premium Interior" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
