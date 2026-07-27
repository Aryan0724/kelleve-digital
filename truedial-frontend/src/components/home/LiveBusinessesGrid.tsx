"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, Star, MapPin, PhoneCall, MessageSquare, 
  ArrowRight, Sparkles, CheckCircle2, Flame, Heart 
} from "lucide-react";

interface BizItem {
  id: number;
  title: string;
  slug?: string;
  category?: { name: string };
  city?: string;
  address?: string;
  rating?: number;
  reviews_count?: number;
  description?: string;
  gallery?: string[];
  phone?: string;
  features?: string[];
}

const CATEGORY_TABS = [
  { label: "🔥 All Trending", filter: "all" },
  { label: "🏠 Interior Designers", filter: "interior" },
  { label: "🍽️ Restaurants", filter: "restaurant" },
  { label: "🏥 Doctors & Hospitals", filter: "hospital" },
  { label: "🏨 Hotels & Stays", filter: "hotel" },
  { label: "⚡ B2B Wholesalers", filter: "b2b" },
];

export default function LiveBusinessesGrid({ businesses }: { businesses: BizItem[] }) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = businesses.filter((b) => {
    if (activeTab === "all") return true;
    const catName = (b.category?.name || "").toLowerCase();
    const titleName = (b.title || "").toLowerCase();
    if (activeTab === "interior") return catName.includes("interior") || catName.includes("architect") || titleName.includes("interior") || titleName.includes("sharma");
    if (activeTab === "restaurant") return catName.includes("restaurant") || catName.includes("food") || titleName.includes("cafe");
    if (activeTab === "hospital") return catName.includes("hospital") || catName.includes("clinic") || catName.includes("doctor") || titleName.includes("dental") || titleName.includes("apollo");
    if (activeTab === "hotel") return catName.includes("hotel") || catName.includes("resort") || titleName.includes("palace");
    if (activeTab === "b2b") return catName.includes("b2b") || catName.includes("wholesale") || catName.includes("supplier") || catName.includes("building");
    return true;
  });

  const displayList = filtered.length > 0 ? filtered : businesses;

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.filter}
            type="button"
            onClick={() => setActiveTab(tab.filter)}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold shrink-0 transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === tab.filter
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-primary"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Lively Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayList.map((biz) => (
          <div 
            key={biz.id} 
            className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
          >
            <div className="h-48 w-full relative bg-gray-100 dark:bg-slate-800 overflow-hidden">
              {biz.gallery && biz.gallery.length > 0 ? (
                <img 
                  src={biz.gallery[0]} 
                  alt={biz.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm font-medium bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900">
                  TrueDial Verified
                </div>
              )}

              {/* Online Now Green Pulse Indicator */}
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-navy dark:text-white flex items-center gap-1.5 shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Online Now</span>
              </div>

              {/* Verified Shield Badge */}
              <div className="absolute top-3 right-3 bg-navy/90 dark:bg-slate-900/90 text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md border border-amber-400/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{biz.rating || "4.8"}</span>
                <span className="text-gray-300 text-[10px]">({biz.reviews_count || "120"})</span>
              </div>

              {/* Category Pill Over Image Bottom */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-primary/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                  {biz.category?.name || "Verified Studio"}
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <Link href={`/businesses/${biz.slug || '#'}`}>
                  <h4 className="text-lg font-bold text-navy dark:text-white mt-1 mb-1.5 line-clamp-1 group-hover:text-primary transition">
                    {biz.title}
                  </h4>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                  {biz.description}
                </p>

                {/* Features Tags */}
                {biz.features && biz.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {biz.features.slice(0, 2).map((f, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="line-clamp-1 font-medium">{biz.address || biz.city || "Mumbai"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                <Link href={`/businesses/${biz.slug || '#'}`} className="flex-1">
                  <button className="w-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 hover:from-primary hover:to-orange-600 text-primary hover:text-white dark:text-orange-400 dark:hover:text-white font-bold py-2.5 rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-1.5 shadow-sm">
                    <span>View Profile &amp; Quotes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>

                <a 
                  href={`tel:${biz.phone || '+919876543210'}`} 
                  className="bg-navy dark:bg-slate-800 hover:bg-green-600 dark:hover:bg-green-600 text-white p-2.5 rounded-xl transition-colors duration-300 shadow-sm" 
                  title="Call Now"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
