"use client";

import { Star, ShieldCheck, MapPin, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FeaturedProfessionals({ pros = [] }: { pros?: any[] }) {
  // Use passed data or empty array if not loaded yet
  const displayPros = pros && pros.length > 0 ? pros.slice(0, 4) : [];

  if (displayPros.length === 0) {
    return null; // or a skeleton loader if preferred
  }

  return (
    <div className="w-full flex flex-col h-full bg-transparent">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-white tracking-tight mb-2">
            Top Professionals Near You
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Hire trusted experts for your next project</p>
        </div>
        <Link 
          href="/professionals" 
          className="text-sm font-bold text-[#FF6B00] hover:text-[#e66000] hover:underline flex items-center gap-1 transition-colors"
        >
          View All <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>

      <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 no-scrollbar gap-6 pb-4 snap-x snap-mandatory">
        {displayPros.map((pro, i) => (
          <div key={pro.id || i} className="flex-shrink-0 w-[280px] lg:w-full snap-start flex flex-col bg-white dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-[#FF6B00] dark:hover:border-[#FF6B00] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
            
            <div className="relative h-48 bg-slate-200 dark:bg-slate-700 w-full overflow-hidden">
              <img 
                src={pro.cover_image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"} 
                alt={pro.title || "Professional"} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#111827] text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                ₹₹₹ Premium
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#111827] text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                {pro.rating || "4.9"}
              </div>
            </div>

            <div className="p-5 flex flex-col relative flex-1">
              <div className="absolute -top-8 left-5">
                <div className="relative">
                  <img 
                    className="w-16 h-16 rounded-xl border-4 border-white dark:border-slate-800 object-cover shadow-sm bg-white" 
                    src={pro.avatar || "https://i.pravatar.cc/100?img=" + (i+10)} 
                    alt="User" 
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <CheckCircle className="w-4 h-4 text-blue-500 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              <div className="mt-8 mb-4">
                <h3 className="font-black text-[#111827] dark:text-white text-lg truncate leading-tight group-hover:text-[#FF6B00] transition-colors">
                  {pro.title || "Space Interior Studio"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-2">
                  {pro.category?.name || "Interior Designers"}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {pro.city || "Patna"}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                  <div>{pro.projects_completed || (50 + i * 15)} Projects</div>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-md text-[11px] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  Available Today
                </div>
                <Link 
                  href={`/professionals/${pro.slug || 'slug'}`} 
                  className="text-sm font-bold text-[#FF6B00] hover:text-[#e66000] hover:underline"
                >
                  View Profile
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
