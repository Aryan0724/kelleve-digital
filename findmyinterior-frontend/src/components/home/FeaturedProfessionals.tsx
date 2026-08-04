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
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent rounded-[24px] lg:border-0 border-slate-100 dark:border-slate-800 lg:p-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg lg:text-xl font-black text-[#1A1A1A] dark:text-white">Top Professionals Near You</h2>
        <Link href="/professionals" className="text-sm font-bold text-[#E8701A] hover:underline flex items-center gap-1">
          View All Professionals <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>
      <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 no-scrollbar gap-4 pb-4">
        {displayPros.map((pro, i) => (
          <div key={pro.id || i} className="flex-shrink-0 w-[240px] lg:w-full bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative h-[120px] bg-slate-200 dark:bg-slate-700">
              <img 
                src={pro.cover_image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"} 
                alt={pro.title || "Professional"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              {/* Rating Pill */}
              <div className="absolute top-2 left-2 bg-white dark:bg-slate-800 text-[#1A1A1A] dark:text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                {pro.rating || "4.9"}
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex -space-x-2 mb-1">
                <img className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover" src={pro.avatar || "https://i.pravatar.cc/100?img=" + (i+10)} alt="User" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#1A1A1A] dark:text-white text-sm truncate leading-tight">
                  {pro.title || "Space Interior Studio"}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {pro.category?.name || "Interior Designers"}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {pro.city || "Patna"}
                  <ShieldCheck className="w-3 h-3 text-green-500 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
