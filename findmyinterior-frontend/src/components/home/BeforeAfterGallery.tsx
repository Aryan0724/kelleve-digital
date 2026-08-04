"use client";

import { useState } from "react";
import { ArrowRight, MoveHorizontal } from "lucide-react";
import Link from "next/link";

export function BeforeAfterGallery() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">
            Real Transformations
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">See the magic our professionals create.</p>
        </div>
        <Link href="/projects" className="group flex items-center text-[#FF6B00] font-bold text-base hover:text-[#e66000] transition-colors">
          View Gallery
          <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div 
        className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[24px] overflow-hidden select-none cursor-ew-resize shadow-2xl"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" 
            alt="After Renovation" 
            className="w-full h-full object-cover object-center pointer-events-none"
          />
          <div className="absolute top-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white/20">
            <span className="font-bold text-[#111827] dark:text-white">After</span>
          </div>
        </div>

        {/* Before Image (Foreground, Clipped) */}
        <div 
          className="absolute inset-0 border-r-4 border-white dark:border-[#FF6B00]"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop" 
            alt="Before Renovation" 
            className="w-full h-full object-cover object-center pointer-events-none"
          />
          <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white/20">
            <span className="font-bold text-[#111827] dark:text-white">Before</span>
          </div>
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-white dark:border-[#FF6B00] -ml-6 transition-transform hover:scale-110 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <MoveHorizontal className="w-6 h-6 text-[#111827] dark:text-[#FF6B00]" />
        </div>
      </div>
    </div>
  );
}
