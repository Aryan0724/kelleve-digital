import React from "react";
import { Star, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const mockProjects = [
  {
    id: 1,
    title: "Living Room Renovation",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
    budget: "₹2.8L",
    timeline: "3 Weeks",
    professional: "The Design Studio",
    city: "Patna",
    rating: 5.0,
  },
  {
    id: 2,
    title: "Modern Modular Kitchen",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop",
    budget: "₹1.9L",
    timeline: "2 Weeks",
    professional: "Urban Kitchens",
    city: "Ranchi",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Luxury Villa Exterior",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop",
    budget: "₹8.5L",
    timeline: "2 Months",
    professional: "Elite Architects",
    city: "Delhi",
    rating: 4.9,
  },
  {
    id: 4,
    title: "Master Bedroom Makeover",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop",
    budget: "₹1.5L",
    timeline: "1 Week",
    professional: "Cozy Interiors",
    city: "Patna",
    rating: 5.0,
  }
];

export function FeaturedProjects() {
  return (
    <div className="w-full flex flex-col h-full bg-transparent">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-white tracking-tight mb-2">
            Recently Completed Projects
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Get inspired by outcomes from top professionals</p>
        </div>
        <Link 
          href="/projects" 
          className="text-sm font-bold text-[#FF6B00] hover:text-[#e66000] hover:underline flex items-center gap-1 transition-colors"
        >
          View Portfolio <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>

      {/* Horizontal Scroll / Grid */}
      <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 hide-scrollbar pb-4 snap-x snap-mandatory">
        {mockProjects.map((project) => (
          <div 
            key={project.id} 
            className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-full snap-start group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#FF6B00] dark:hover:border-[#FF6B00] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 text-[#FF6B00] fill-current" />
                <span className="text-xs font-bold text-[#111827]">{project.rating}</span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col gap-3">
              <div>
                <h3 className="font-bold text-[#111827] dark:text-white text-lg leading-tight mb-1 group-hover:text-[#FF6B00] transition-colors">{project.title}</h3>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{project.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Budget</span>
                  <span className="font-black text-[#111827] dark:text-white">{project.budget}</span>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex-1 flex flex-col pl-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Timeline</span>
                  <span className="font-black text-[#111827] dark:text-white">{project.timeline}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-300">
                    {project.professional.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[100px]">{project.professional}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-[#111827] dark:text-white group-hover:bg-[#FF6B00] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
