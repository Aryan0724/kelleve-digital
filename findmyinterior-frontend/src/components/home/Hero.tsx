"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search as SearchIcon,
  MapPin,
  ChevronDown,
  ShieldCheck,
  ClipboardList,
  Award,
  Clock,
  Plus,
  User,
  PhoneCall,
  Calendar,
  FileText
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
    router.push(`/professionals${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    // The hero takes full page width. Left side is the text content, right side is the image
    // that bleeds all the way to the right edge of the viewport.
    <div className="relative w-full bg-white dark:bg-slate-900 font-sans overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch min-h-[560px]">

        {/* ──────────────── LEFT CONTENT ──────────────── */}
        <div className="w-full lg:w-[48%] flex flex-col justify-center px-6 xl:pl-[max(2rem,calc((100vw-1320px)/2+1rem))] xl:pr-10 py-10 lg:py-16 z-10">

          {/* Platform badge */}
          <div className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#374151] dark:text-white mb-5 self-start">
            <ShieldCheck className="w-4 h-4 text-[#FF6B00]" strokeWidth={2.5} />
            India's Most Trusted Interior Platform
          </div>

          {/* Headline */}
          <h1 className="text-[42px] lg:text-[56px] font-black text-[#111827] dark:text-white leading-[1.08] mb-4 tracking-tight">
            Where Projects <br />
            Meet <span className="text-[#FF6B00]">Professionals</span>
          </h1>

          {/* Sub-heading */}
          <p className="text-[15px] text-slate-600 dark:text-slate-300 font-medium mb-7 max-w-[420px] leading-relaxed">
            Post your requirement and get multiple quotes from verified interior professionals.
          </p>

          {/* 2×2 Trust Badges */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-7 max-w-[380px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-[18px] h-[18px] text-[#374151] dark:text-white shrink-0" strokeWidth={1.8} />
              <span className="text-[12px] font-bold text-[#374151] dark:text-white leading-tight">
                Verified<br />Professionals
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-[18px] h-[18px] text-[#374151] dark:text-white shrink-0" strokeWidth={1.8} />
              <span className="text-[12px] font-bold text-[#374151] dark:text-white leading-tight">
                Multiple<br />Quotes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-[18px] h-[18px] text-[#374151] dark:text-white shrink-0" strokeWidth={1.8} />
              <span className="text-[12px] font-bold text-[#374151] dark:text-white leading-tight">
                Best Price<br />Guarantee
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-[18px] h-[18px] text-[#374151] dark:text-white shrink-0" strokeWidth={1.8} />
              <span className="text-[12px] font-bold text-[#374151] dark:text-white leading-tight">
                On-Time<br />Delivery
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link href="/post-requirement">
              <button className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-[14px] px-7 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Post a Project
              </button>
            </Link>
            <Link href="/professionals">
              <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-[#374151] dark:text-white font-bold text-[14px] px-7 py-3 rounded-lg hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                <User className="w-4 h-4" strokeWidth={2} />
                Browse Professionals
              </button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-[580px] mb-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center overflow-hidden">
              {/* Location */}
              <div className="flex items-center gap-1.5 px-4 py-3.5 border-r border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <MapPin className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-[14px] font-semibold text-[#374151] dark:text-white whitespace-nowrap">{city}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              {/* Input */}
              <form onSubmit={handleSearch} className="flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Search Architects, Builders, Interior Designers..."
                  className="w-full bg-transparent border-none outline-none text-[13.5px] text-[#374151] dark:text-white font-medium placeholder-slate-400 px-4 py-3.5"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-[14px] px-5 py-3.5 transition-colors shrink-0 whitespace-nowrap"
                >
                  <SearchIcon className="w-4 h-4" strokeWidth={2.5} />
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Popular Searches — pill chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold text-[#374151] dark:text-white">Popular Searches:</span>
            {["Modular Kitchen", "Living Room", "False Ceiling", "Wardrobe", "Home Renovation", "Office Interiors"].map((tag) => (
              <button
                key={tag}
                onClick={() => { setSearchQuery(tag); }}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 hover:border-[#FF6B00] hover:text-[#FF6B00] cursor-pointer transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ──────────────── RIGHT IMAGE ──────────────── */}
        <div className="w-full lg:w-[52%] relative mt-8 lg:mt-0 min-h-[400px] lg:min-h-0">
          {/* Image bleeds to the right viewport edge */}
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop"
            alt="Premium Interior Design"
            className="w-full h-full object-cover object-center"
            style={{ borderRadius: "0" }}
          />

          {/* Floating Right Widget — overlapping the image on the right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-l-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 flex flex-col divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden z-20">
            <Link href="/post-requirement" className="flex flex-col items-center justify-center gap-1.5 px-4 py-4 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
              <FileText className="w-5 h-5 text-[#FF6B00] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-[#374151] dark:text-white text-center leading-tight">Get Free<br />Quote</span>
            </Link>
            <Link href="/post-requirement" className="flex flex-col items-center justify-center gap-1.5 px-4 py-4 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
              <Calendar className="w-5 h-5 text-[#FF6B00] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-[#374151] dark:text-white text-center leading-tight">Book<br />Consultation</span>
            </Link>
            <a href="tel:9534900999" className="flex flex-col items-center justify-center gap-1.5 px-4 py-4 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
              <PhoneCall className="w-5 h-5 text-[#FF6B00] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-[#374151] dark:text-white text-center leading-tight">Call<br />Expert</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
