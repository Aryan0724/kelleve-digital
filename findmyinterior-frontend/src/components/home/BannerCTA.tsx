"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

export function BannerCTA() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          {/* Background Decor */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-200/50 dark:bg-orange-900/30 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

          {/* Text Content */}
          <div className="w-full md:w-3/5 z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Tell us what you need
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-6">
              Get free quotes from trusted professionals
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> Quick
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" /> Easy
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" /> 100% Free
              </li>
            </ul>

            <Link href="/post-requirement">
              <button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-transform hover:-translate-y-0.5">
                Post Your Requirement <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Illustration/Image */}
          <div className="w-full md:w-2/5 flex justify-center z-10 relative">
             <div className="w-48 h-64 md:w-64 md:h-80 relative">
               {/* Using a placeholder SVG or a relevant image */}
               <Image 
                 src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070&auto=format&fit=crop"
                 alt="Phone App Illustration"
                 fill
                 className="object-contain rounded-xl drop-shadow-xl"
               />
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
