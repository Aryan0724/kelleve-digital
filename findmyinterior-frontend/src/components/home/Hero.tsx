"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  ClipboardList, 
  Award,
  Clock,
  Search as SearchIcon,
  MapPin,
  ChevronDown,
  User,
  PhoneCall,
  Calendar,
  Plus
} from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [city, setCity] = useState("Patna");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (city && city !== "All Bihar") params.set("city", city);
    const queryString = params.toString();
    router.push(`/professionals${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="relative w-full bg-white dark:bg-slate-900 pt-10 pb-36 font-sans">
      
      <div className="container max-w-[1320px] mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Content */}
        <div className="w-full lg:w-[45%] flex flex-col items-start text-left z-20">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 dark:bg-orange-900/30 text-[#FF6B00] text-[11px] font-bold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            India's Most Trusted Interior Platform
          </div>

          <h1 className="text-5xl lg:text-[64px] font-black text-[#111827] dark:text-white leading-[1.05] mb-4 tracking-tight">
            Where Projects <br /> 
            Meet <span className="text-[#FF6B00]">Professionals</span>
          </h1>

          <p className="text-[17px] text-slate-600 dark:text-slate-300 font-medium mb-8 max-w-[420px] leading-relaxed">
            Post your requirement and get multiple quotes from verified interior professionals.
          </p>

          {/* 2x2 Trust Badges */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-10 w-full max-w-[420px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#111827] dark:text-white" strokeWidth={1.5} />
              <span className="text-xs font-bold text-[#111827] dark:text-white">Verified<br/>Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#111827] dark:text-white" strokeWidth={1.5} />
              <span className="text-xs font-bold text-[#111827] dark:text-white">Multiple<br/>Quotes</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#111827] dark:text-white" strokeWidth={1.5} />
              <span className="text-xs font-bold text-[#111827] dark:text-white">Best Price<br/>Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#111827] dark:text-white" strokeWidth={1.5} />
              <span className="text-xs font-bold text-[#111827] dark:text-white">On-Time<br/>Delivery</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/post-requirement">
              <button className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-sm px-8 py-3.5 rounded-lg shadow-md transition-all">
                <Plus className="w-4 h-4 bg-white/20 rounded-full p-0.5" />
                Post a Project
              </button>
            </Link>
            <Link href="/professionals">
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-[#111827] dark:text-white font-bold text-sm px-8 py-3.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                <User className="w-4 h-4" />
                Browse Professionals
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-[55%] h-[550px] relative mt-10 lg:mt-0 flex justify-end items-center">
          <div className="w-[95%] h-full relative rounded-l-[48px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" 
              alt="Premium Interior" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {/* Floating Action Widget */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 flex flex-col p-2">
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700">
              <ClipboardList className="w-5 h-5 text-[#FF6B00] mb-1.5" />
              <span className="text-[10px] font-bold text-center leading-tight">Get Free<br/>Quote</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700">
              <Calendar className="w-5 h-5 text-[#FF6B00] mb-1.5" />
              <span className="text-[10px] font-bold text-center leading-tight">Book<br/>Consultation</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <PhoneCall className="w-5 h-5 text-[#FF6B00] mb-1.5" />
              <span className="text-[10px] font-bold text-center leading-tight">Call<br/>Expert</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 z-30 w-[95%] lg:w-[900px]">
        <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-[0_15px_50px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 flex flex-col lg:flex-row items-center justify-between">
          
          {/* Location Segment */}
          <div className="flex items-center gap-2 px-5 py-2 w-full lg:w-48 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors">
            <MapPin className="w-5 h-5 text-[#111827] dark:text-white" />
            <span className="font-bold text-[#111827] dark:text-white flex-1 text-[15px]">{city}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <div className="hidden lg:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>

          {/* Search Input Segment */}
          <form onSubmit={handleSearch} className="flex-1 w-full flex items-center pl-4 pr-1 gap-3">
            <SearchIcon className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search Architects, Builders, Interior Designers..."
              className="w-full bg-transparent border-none outline-none text-[#111827] dark:text-white font-semibold placeholder-slate-400 py-3 text-[15px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="flex items-center justify-center bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold px-8 py-3.5 rounded-full transition-colors shrink-0 shadow-sm text-[15px]"
            >
              Search
            </button>
          </form>
        </div>

        {/* Popular Searches below bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 pl-4">
          <span className="text-xs font-bold text-[#111827] dark:text-white mr-1">Popular Searches:</span>
          {["Modular Kitchen", "Living Room", "False Ceiling", "Wardrobe", "Home Renovation", "Office Interiors"].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:border-[#FF6B00] cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
