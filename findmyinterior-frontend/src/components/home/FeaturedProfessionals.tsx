"use client";

import Link from "next/link";
import { ArrowRight, Star, MapPin, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function FeaturedProfessionals({ pros }: { pros?: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultPros = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
      name: "Creative Interiors",
      category: "Interior Designer",
      city: "Patna",
      rating: 4.6,
      reviews: 78,
      projects: 42,
      available: true,
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: 4,
      name: "Build Right Constructions",
      category: "Builder",
      city: "Patna",
      rating: 4.5,
      reviews: 64,
      projects: 68,
      available: true,
      avatar: "https://i.pravatar.cc/150?u=4",
    },
    {
      id: 5,
      name: "Modern Contractors",
      category: "Contractor",
      city: "Patna",
      rating: 4.4,
      reviews: 53,
      projects: 32,
      available: true,
      avatar: "https://i.pravatar.cc/150?u=5",
    },
  ];

  const displayPros = pros?.length ? pros : defaultPros;

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
          Top Professionals Near You
        </h2>
        <Link
          href="/professionals"
          className="group flex items-center text-[#FF6B00] font-bold text-[13px] hover:text-[#e66000] transition-colors"
        >
          View All Professionals
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Scrollable Row */}
      <div className="relative flex items-center">
        {/* Scrollable Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none pb-1 flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayPros.map((pro, i) => (
            <Link
              key={i}
              href={`/professionals/${pro.id || i + 1}`}
              className="block shrink-0 w-[220px]"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 h-full">
                {/* Avatar + Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={pro.avatar || `https://i.pravatar.cc/150?u=${i}`}
                    alt={pro.name}
                    className="w-12 h-12 rounded-full object-cover bg-slate-100 shrink-0 border-2 border-white shadow-sm"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-[13px] text-[#111827] dark:text-white leading-tight truncate">
                      {pro.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      {typeof pro.category === 'object' ? pro.category?.name : pro.category || "Professional"}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {pro.city}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                  <span className="text-[12px] font-bold text-[#374151] dark:text-white">
                    {pro.rating}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    ({pro.reviews})
                  </span>
                </div>

                {/* Projects + Available */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {pro.projects} Projects
                  </span>
                  {pro.available && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="ml-3 w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
