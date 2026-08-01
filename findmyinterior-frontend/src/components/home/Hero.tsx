"use client";

import Link from "next/link";
import { PlusCircle, PlayCircle, ShieldCheck, ClipboardList, BadgeIndianRupee, Clock } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full bg-white dark:bg-background pt-8 pb-4">
      <div className="container mx-auto px-4">
        
        {/* Main Hero Content */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col z-10 text-center md:text-left order-2 md:order-1">
            <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-4 tracking-tight">
              Where Projects <br className="hidden md:block"/>
              <span className="text-primary">Meet Professionals</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg mx-auto md:mx-0">
              Post your requirement, get multiple quotes & hire the best for your dream space.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link 
                href="/post-requirement" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold text-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
              >
                <PlusCircle className="w-5 h-5" /> Post a Project
              </Link>
              <button 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 px-8 py-3.5 rounded-full font-semibold text-lg transition-all"
              >
                <PlayCircle className="w-5 h-5" /> How It Works
              </button>
            </div>
          </div>
          
          {/* Image Content */}
          <div className="w-full md:w-1/2 relative order-1 md:order-2 h-[250px] sm:h-[350px] md:h-[400px]">
            {/* The image from the screenshot shows a family looking at plans with a professional */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                alt="Family with Interior Designer" 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[600px] md:min-w-0 gap-4">
            
            <div className="flex items-center gap-3 flex-1 justify-center border-r border-slate-200 dark:border-slate-700 last:border-0 pr-4">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Verified</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-center border-r border-slate-200 dark:border-slate-700 last:border-0 px-4">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Multiple</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quotes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-center border-r border-slate-200 dark:border-slate-700 last:border-0 px-4">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg">
                <BadgeIndianRupee className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Best Price</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-center pl-4">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">On-Time</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Delivery</p>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}
