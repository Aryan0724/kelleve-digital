"use client";

import { Star, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function FeaturedProfessionals({ pros = [] }: { pros?: any[] }) {
  if (!pros || pros.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Top Professionals Near You
          </h2>
          <Link href="/professionals" className="text-primary font-semibold text-sm hover:underline">
            View All
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
          {pros.map((pro, i) => (
            <Link 
              href={`/professionals/${pro.slug || pro.id}`} 
              key={pro.id || i}
              className="min-w-[260px] md:min-w-[280px] max-w-[280px] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden snap-center group hover:shadow-md transition-shadow relative block"
            >
              {/* Cover Image */}
              <div className="w-full h-32 relative bg-slate-200 dark:bg-slate-800">
                <Image 
                  src={pro.cover_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"} 
                  alt={pro.title || "Cover"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Rating Badge Overlay */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{pro.rating || "4.8"}</span>
                </div>
              </div>
              
              {/* Profile Image & Content */}
              <div className="p-4 pt-0 flex-1 flex flex-col relative">
                {/* Overlapping Avatar */}
                <div className="w-14 h-14 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 -mt-7 mb-2 relative z-10 shadow-sm">
                  <Image 
                    src={pro.user?.profile_image || pro.cover_image || "/placeholder-avatar.png"} 
                    alt={pro.title || "Profile"}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 mb-1">
                  {pro.title || "The Design Studio"}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {pro.category?.name || "Interior Designer"}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{pro.city?.name || pro.city || "Patna"}</span>
                  </div>
                  
                  {pro.is_verified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
