"use client";

import React from "react";

export function BrandPartners() {
  const brands = [
    { name: "Asian Paints", logo: "asianpaints" },
    { name: "Hafele", logo: "hafele" },
    { name: "Godrej Interio", logo: "godrejinterio" },
    { name: "Ultratech Cement", logo: "ultratech" },
    { name: "Duravit", logo: "duravit" },
    { name: "Greenlam Laminates", logo: "greenlam" },
    { name: "Jaquar Group", logo: "jaquar" },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-8">
      
      {/* Left Title */}
      <div className="w-full md:w-[35%] shrink-0">
        <h2 className="text-xl md:text-[22px] font-bold text-[#111827] dark:text-white leading-tight">
          Trusted by Thousands of Customers & Top Brands
        </h2>
      </div>

      {/* Right Scrolling Logos */}
      <div className="w-full md:w-[65%] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 hidden md:block"></div>
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 hidden md:block"></div>
        
        <div className="flex items-center space-x-12 animate-scroll-x">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <div className="text-xl md:text-2xl font-black tracking-tighter text-[#111827] dark:text-white select-none whitespace-nowrap">
                {brand.name.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll-x {
          animation: scrollX 15s linear infinite;
          width: fit-content;
        }
        .animate-scroll-x:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
