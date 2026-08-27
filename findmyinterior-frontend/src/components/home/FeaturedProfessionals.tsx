"use client";

import Link from "next/link";
import { Star, MapPin, ChevronRight, Check } from "lucide-react";
import { useRef } from "react";

export function FeaturedProfessionals({ pros }: { pros?: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultPros = [
    {
      id: 1,
      slug: "the-design-studio",
      name: "The Design Studio",
      category: "Interior Designer",
      city: "Patna",
      rating: 4.8,
      reviews: 128,
      cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 2,
      slug: "urban-spaces",
      name: "Urban Spaces",
      category: "Architect",
      city: "Patna",
      rating: 4.7,
      reviews: 96,
      cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 3,
      slug: "creative-interiors",
      name: "Creative Interiors",
      category: "Interior Designer",
      city: "Patna",
      rating: 4.6,
      reviews: 78,
      cover: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 4,
      slug: "build-right-constructions",
      name: "Build Right Constructions",
      category: "Builder",
      city: "Patna",
      rating: 4.5,
      reviews: 64,
      cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
  ];

  // Map API listings or fallback
  const displayPros = pros?.length
    ? pros.map((p, idx) => ({
        id: p.id || idx + 1,
        slug: p.slug || p.id,
        name: p.title || p.name || defaultPros[idx % defaultPros.length].name,
        category: typeof p.category === "object" ? p.category?.name : p.category || defaultPros[idx % defaultPros.length].category,
        city: p.city || "Patna",
        rating: p.rating || (4.8 - idx * 0.1).toFixed(1),
        cover: p.cover_image || defaultPros[idx % defaultPros.length].cover,
        avatar: p.avatar || p.user?.profile_image || defaultPros[idx % defaultPros.length].avatar,
      }))
    : defaultPros;

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full py-4 lg:py-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* MOBILE HEADER (mockup style) */}
        <div className="flex lg:hidden items-center justify-between mb-4">
          <h2 className="text-[1.15rem] font-black text-[#0a1c3a] dark:text-white tracking-tight">
            Top Professionals Near You
          </h2>
          <Link
            href="/professionals"
            className="text-xs font-bold text-[#E8701A] hover:underline"
          >
            View All
          </Link>
        </div>

        {/* MOBILE CAROUSEL: Exact visual parity with reference mockup */}
        <div className="lg:hidden flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
          {displayPros.map((pro, i) => (
            <Link
              key={pro.id || i}
              href={`/professionals/${pro.slug || pro.id}`}
              className="block shrink-0 w-[205px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden active:scale-95 transition-transform"
            >
              <div className="relative h-[110px] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={pro.cover}
                  alt={pro.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                  <span className="text-[11px] font-black text-slate-800 dark:text-white leading-none">
                    {pro.rating}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0 border border-white shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs text-[#0a1c3a] dark:text-white leading-tight truncate">
                      {pro.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                      {pro.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{pro.city}</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* DESKTOP VIEW: 100% Original Desktop Layout from d3e258f */}
        <div className="hidden lg:block w-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
              Top Professionals Near You
            </h2>
            <Link
              href="/professionals"
              className="group flex items-center text-[#FF6B00] font-bold text-[13px] hover:text-[#e66000] transition-colors"
            >
              View All Professionals
              <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative flex items-center">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-none pb-1 flex-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayPros.map((pro, i) => (
                <Link
                  key={i}
                  href={`/professionals/${pro.slug || pro.id}`}
                  className="block shrink-0 w-[220px]"
                >
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 h-full">
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
                          {typeof pro.category === 'object' ? (pro.category as any)?.name : pro.category || "Professional"}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {pro.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                      <span className="text-[12px] font-bold text-[#374151] dark:text-white">
                        {pro.rating}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        ({(pro as any).reviews || 128})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {(pro as any).projects || 50} Projects
                      </span>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                        Available
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={scrollRight}
              className="ml-3 w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors shrink-0"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
