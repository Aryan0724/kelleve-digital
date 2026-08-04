"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PopularCities() {
  const cities = [
    { name: "Patna", pros: "1,200+", img: "https://images.unsplash.com/photo-1598928506311-c55dd6584283?q=80&w=400&auto=format&fit=crop", span: "col-span-2 row-span-2" },
    { name: "Gaya", pros: "450+", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400&auto=format&fit=crop", span: "col-span-1 row-span-1" },
    { name: "Muzaffarpur", pros: "320+", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop", span: "col-span-1 row-span-1" },
    { name: "Bhagalpur", pros: "280+", img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=400&auto=format&fit=crop", span: "col-span-2 row-span-1" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">
            Popular Cities
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Find top professionals in major cities across Bihar.</p>
        </div>
        <Link href="/professionals" className="group flex items-center text-[#FF6B00] font-bold text-base hover:text-[#e66000] transition-colors">
          View All Locations
          <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full h-auto min-h-[400px]">
        {cities.map((city, i) => (
          <Link 
            key={i} 
            href={`/professionals?city=${city.name}`}
            className={`relative rounded-[24px] overflow-hidden group hover:shadow-xl transition-all duration-300 block ${city.span} min-h-[180px]`}
          >
            <img 
              src={city.img} 
              alt={city.name} 
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{city.name}</h3>
              <p className="text-sm font-semibold text-white/80">{city.pros} Professionals</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
