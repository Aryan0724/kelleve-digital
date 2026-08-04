"use client";

import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, MapPin, Briefcase, IndianRupee } from "lucide-react";

export function FeaturedProfessionals({ pros }: { pros?: any[] }) {
  const defaultPros = [
    {
      name: "The Design Studio",
      category: "Interior Designer",
      city: "Patna",
      rating: 4.8,
      reviews: 128,
      projects: 50,
      price: "₹1500/sqft",
      available: true,
      avatar: "https://i.pravatar.cc/150?u=1",
      cover: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Urban Spaces",
      category: "Architect",
      city: "Patna",
      rating: 4.7,
      reviews: 96,
      projects: 35,
      price: "₹1800/sqft",
      available: true,
      avatar: "https://i.pravatar.cc/150?u=2",
      cover: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Creative Interiors",
      category: "Interior Designer",
      city: "Patna",
      rating: 4.6,
      reviews: 78,
      projects: 42,
      price: "₹1200/sqft",
      available: true,
      avatar: "https://i.pravatar.cc/150?u=3",
      cover: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Build Right Constructions",
      category: "Builder",
      city: "Patna",
      rating: 4.5,
      reviews: 64,
      projects: 68,
      price: "₹2500/sqft",
      available: true,
      avatar: "https://i.pravatar.cc/150?u=4",
      cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const displayPros = pros?.length ? pros : defaultPros;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#111827] dark:text-white">
          Top Professionals Near You
        </h2>
        <Link href="/professionals" className="group flex items-center text-[#FF6B00] font-bold text-[15px] hover:text-[#e66000] transition-colors">
          View All Professionals
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {displayPros.slice(0, 4).map((pro, i) => (
          <div key={i} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] overflow-hidden group hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-full">
            
            {/* Cover Image */}
            <div className="relative h-32 bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
              <img src={pro.cover} alt="Cover" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
              {pro.available && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                  Available Today
                </div>
              )}
            </div>

            {/* Profile Content */}
            <div className="p-5 relative flex-1 flex flex-col pt-12">
              
              {/* Avatar overlapping cover */}
              <div className="absolute -top-10 left-5">
                <div className="relative">
                  <img src={pro.avatar} alt={pro.name} className="w-20 h-20 rounded-full border-[4px] border-white dark:border-slate-900 object-cover bg-slate-100 shadow-sm" />
                  <div className="absolute bottom-1 right-0 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-slate-900 shadow-sm" title="Verified Professional">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-bold text-lg text-[#111827] dark:text-white truncate pr-2">
                    {pro.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded text-xs font-bold text-[#FF6B00]">
                    <Star className="w-3.5 h-3.5 fill-[#FF6B00]" />
                    {pro.rating} <span className="text-slate-400 font-medium">({pro.reviews})</span>
                  </div>
                </div>
                
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-5 flex items-center">
                  {pro.category} <span className="mx-1.5 text-slate-300 dark:text-slate-600">•</span> <MapPin className="w-3.5 h-3.5 mr-1" /> {pro.city}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-800">
                    <Briefcase className="w-4 h-4 text-slate-400 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Projects</span>
                    <span className="text-[13px] font-black text-[#111827] dark:text-white">{pro.projects}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-800">
                    <IndianRupee className="w-4 h-4 text-slate-400 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Starting</span>
                    <span className="text-[13px] font-black text-[#111827] dark:text-white">{pro.price}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link href={`/professionals/${pro.id || 1}`}>
                    <button className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-[15px] text-[#111827] dark:text-white hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
