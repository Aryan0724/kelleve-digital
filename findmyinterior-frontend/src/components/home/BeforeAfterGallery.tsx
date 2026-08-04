import React from "react";
import { ArrowRight } from "lucide-react";

export function BeforeAfterGallery() {
  return (
    <div className="w-full flex flex-col bg-transparent">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-white tracking-tight mb-2">
            Transformations That Inspire
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">See the difference our professionals make.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <div className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 relative">
          <div className="absolute top-4 left-4 z-20 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 uppercase tracking-wider">Before & After</div>
          <div className="flex w-full h-[300px] relative">
            <div className="w-1/2 h-full overflow-hidden relative border-r-2 border-white dark:border-slate-800 z-10">
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" className="absolute top-0 left-0 w-[200%] h-full max-w-none object-cover grayscale brightness-75" alt="Before" />
              <div className="absolute bottom-4 left-4 text-white/90 font-bold text-sm tracking-widest uppercase shadow-black drop-shadow-md">Before</div>
            </div>
            <div className="w-1/2 h-full overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop" className="absolute top-0 right-0 w-[200%] h-full max-w-none object-cover" alt="After" />
              <div className="absolute bottom-4 right-4 text-white font-bold text-sm tracking-widest uppercase shadow-black drop-shadow-md">After</div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-xl text-[#111827] dark:text-white mb-2">Complete Living Room Overhaul</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">A dull, outdated space transformed into a bright, modern family room with custom carpentry and ambient lighting.</p>
            <div className="flex items-center text-[#FF6B00] font-bold text-sm hover:text-[#e66000] cursor-pointer w-fit">
              View Project Details <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 relative">
          <div className="absolute top-4 left-4 z-20 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 uppercase tracking-wider">Before & After</div>
          <div className="flex w-full h-[300px] relative">
            <div className="w-1/2 h-full overflow-hidden relative border-r-2 border-white dark:border-slate-800 z-10">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" className="absolute top-0 left-0 w-[200%] h-full max-w-none object-cover grayscale brightness-75" alt="Before" />
              <div className="absolute bottom-4 left-4 text-white/90 font-bold text-sm tracking-widest uppercase shadow-black drop-shadow-md">Before</div>
            </div>
            <div className="w-1/2 h-full overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop" className="absolute top-0 right-0 w-[200%] h-full max-w-none object-cover" alt="After" />
              <div className="absolute bottom-4 right-4 text-white font-bold text-sm tracking-widest uppercase shadow-black drop-shadow-md">After</div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-xl text-[#111827] dark:text-white mb-2">Modular Kitchen Upgrade</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">Replaced cramped traditional kitchen with a smart modular setup featuring island counter and built-in appliances.</p>
            <div className="flex items-center text-[#FF6B00] font-bold text-sm hover:text-[#e66000] cursor-pointer w-fit">
              View Project Details <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
