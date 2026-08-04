"use client";

import { Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { InquiryForm } from "@/components/forms/InquiryForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FeaturedProfessionals({ pros = [] }: { pros?: any[] }) {
  // Use passed data or empty array if not loaded yet
  const displayPros = pros && pros.length > 0 ? pros.slice(0, 4) : [];

  if (displayPros.length === 0) {
    return null; // or a skeleton loader if preferred
  }

  return (
    <section className="py-6 lg:py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* UNIFIED VIEW */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[1.15rem] font-black text-[#0a1c3a] dark:text-white">Top Professionals</h2>
            <Link href="/professionals" className="text-xs font-bold text-[#E8701A] hover:underline">
              View All
            </Link>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-4 px-4">
            {displayPros.map((pro, i) => (
              <div key={pro.id || i} className="flex-shrink-0 w-[240px] bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 overflow-hidden group">
                <div className="relative h-[120px] bg-slate-200 dark:bg-slate-700">
                  <img 
                    src={pro.cover_image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"} 
                    alt={pro.title || "Professional"} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Rating Pill */}
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    {pro.rating || "4.9"}
                  </div>
                  {/* Heart Icon */}
                  <button className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-extrabold text-[#0a1c3a] dark:text-white text-sm truncate flex items-center gap-1">
                    {pro.title || "Space Interior Studio"} <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-medium">
                    {pro.category?.name || "Interior Designers"} | Modular Kitchens
                  </p>
                  <div className="mt-3">
                    <Link href={`/professionals/${pro.slug || pro.id}`}>
                      <button className="w-full py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-[#0a1c3a] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


    </section>
  );
}
