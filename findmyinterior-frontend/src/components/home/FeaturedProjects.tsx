"use client";

import Link from "next/link";
import { ArrowRight, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function FeaturedProjects() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      title: "Modern Living Room",
      city: "Patna",
      budget: "₹2.8 Lakh",
      rating: "4.8",
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Luxury Kitchen",
      city: "Patna",
      budget: "₹1.9 Lakh",
      rating: "4.9",
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Villa Interior",
      city: "Delhi",
      budget: "₹8.5 Lakh",
      rating: "4.7",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Bedroom Makeover",
      city: "Gurugram",
      budget: "₹1.2 Lakh",
      rating: "4.6",
      img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Office Space",
      city: "Noida",
      budget: "₹4.3 Lakh",
      rating: "4.9",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
    }
  ];

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
          Featured Projects
        </h2>
        <div className="flex items-center gap-4">
          <Link href="/projects" className="group flex items-center text-[#FF6B00] font-bold text-sm hover:text-[#e66000] transition-colors">
            View All Projects
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
          {projects.map((proj, i) => (
            <div key={i} className="min-w-[300px] max-w-[300px] sm:min-w-[310px] sm:max-w-[310px] flex-shrink-0 snap-start group cursor-pointer">
              <div className="relative h-[220px] rounded-xl overflow-hidden mb-4">
                
                {/* Rating Pill */}
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm flex items-center gap-1 font-bold text-xs text-[#111827]">
                  <Star className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
                  {proj.rating}
                </div>
                
                {/* Heart Icon */}
                <button className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm text-slate-400 hover:text-red-500 hover:bg-white transition-colors">
                  <Heart className="w-4 h-4" />
                </button>

                <img 
                  src={proj.img} 
                  alt={proj.title} 
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[15px] text-[#111827] dark:text-white leading-tight mb-0.5 group-hover:text-[#FF6B00] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    {proj.city}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[15px] text-[#111827] dark:text-white leading-tight">
                    {proj.budget}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
