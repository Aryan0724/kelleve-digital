"use client";

import Link from "next/link";
import { ArrowRight, Star, ChevronLeft, ChevronRight, ShieldCheck, MapPin } from "lucide-react";
import { useRef } from "react";

export function FeaturedProfessionals({ pros }: { pros?: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultPros = [
    {
      name: "The Design Studio",
      category: "Interior Designer",
      city: "Patna",
      rating: 4.8,
      reviews: 128,
      projects: 50,
      available: true,
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      name: "Urban Spaces",
      category: "Architect",
      city: "Patna",
      rating: 4.7,
      reviews: 96,
      projects: 35,
      available: true,
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      name: "Creative Interiors",
      category: "Interior Designer",
      city: "Delhi",
      rating: 4.6,
      reviews: 78,
      projects: 42,
      available: true,
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      name: "Build Right",
      category: "Builder",
      city: "Gurugram",
      rating: 4.5,
      reviews: 64,
      projects: 68,
      available: false,
      avatar: "https://i.pravatar.cc/150?u=4",
    },
    {
      name: "Studio AR",
      category: "Architect",
      city: "Noida",
      rating: 4.9,
      reviews: 210,
      projects: 85,
      available: true,
      avatar: "https://i.pravatar.cc/150?u=5",
    }
  ];

  const displayPros = pros?.length ? pros : defaultPros;

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
          Top Professionals Near You
        </h2>
        <div className="flex items-center gap-4">
          <Link href="/professionals" className="group flex items-center text-[#FF6B00] font-bold text-sm hover:text-[#e66000] transition-colors">
            View All Professionals
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={scrollLeft} className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <button onClick={scrollRight} className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
          {displayPros.map((pro, i) => (
            <Link key={i} href={`/professionals/${pro.id || i}`} className="min-w-[340px] max-w-[340px] sm:min-w-[380px] sm:max-w-[380px] flex-shrink-0 snap-start block group">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-[#FF6B00] transition-all duration-300">
                
                {/* Avatar Left */}
                <div className="relative shrink-0">
                  <img src={pro.avatar} alt={pro.name} className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-slate-900" title="Verified Professional">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Middle Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[15px] text-[#111827] dark:text-white truncate group-hover:text-[#FF6B00] transition-colors mb-0.5">
                    {pro.name}
                  </h3>
                  <div className="flex items-center text-[12px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 truncate">
                    {pro.category} <span className="mx-1.5">•</span> 
                    <MapPin className="w-3 h-3 mr-0.5 inline" /> {pro.city}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
                    <span className="text-[12px] font-bold text-[#111827] dark:text-white">{pro.rating}</span>
                    <span className="text-[12px] text-slate-400 font-medium">({pro.reviews})</span>
                  </div>
                </div>

                {/* Right Stats */}
                <div className="shrink-0 flex flex-col items-end text-right border-l border-slate-100 dark:border-slate-800 pl-4 py-1">
                  <div className="text-[15px] font-bold text-[#111827] dark:text-white leading-tight">
                    {pro.projects}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">
                    Projects
                  </div>
                  {pro.available ? (
                    <div className="text-[11px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                      Available
                    </div>
                  ) : (
                    <div className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Busy
                    </div>
                  )}
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
