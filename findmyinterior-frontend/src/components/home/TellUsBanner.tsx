import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";

export function TellUsBanner() {
  return (
    <>
      {/* MOBILE VIEW: Exact mockup design */}
      <div className="lg:hidden container mx-auto px-4 my-2.5">
        <div className="bg-[#FFF5ED] dark:bg-slate-900 rounded-[22px] p-3.5 sm:p-5 flex items-center justify-between shadow-sm border border-orange-100 dark:border-slate-800 relative overflow-hidden">
          {/* Left Side - Text and Post Requirement CTA */}
          <div className="flex flex-col z-10 max-w-[48%] sm:max-w-[50%]">
            <h3 className="text-[15px] sm:text-lg font-black text-[#0a1c3a] dark:text-white leading-tight mb-1 tracking-tight">
              Tell us what you need
            </h3>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 leading-snug mb-3">
              Get free quotes from trusted professionals
            </p>
            <Link href="/post-requirement">
              <button className="bg-[#0a1c3a] hover:bg-slate-900 text-white font-bold text-[10px] sm:text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform whitespace-nowrap w-max">
                <span>Post Your Requirement</span>
                <div className="w-3.5 h-3.5 rounded-full bg-white text-[#0a1c3a] flex items-center justify-center font-black text-[9px] shrink-0">
                  &rarr;
                </div>
              </button>
            </Link>
          </div>

          {/* Center Illustration - Phone Checklist */}
          <div className="flex items-center justify-center relative z-10 w-[24%] sm:w-[22%]">
            <img 
              src="/tell-us-illustration.jpg" 
              alt="Checklist requirement" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-xs"
            />
          </div>

          {/* Right Side Badges - Quick, Easy, 100% Free */}
          <div className="flex flex-col gap-1.5 z-10">
            <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white dark:bg-slate-800 rounded-full shadow-xs border border-slate-100 dark:border-slate-700">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black shrink-0">
                ✓
              </div>
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-800 dark:text-slate-100">
                Quick
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white dark:bg-slate-800 rounded-full shadow-xs border border-slate-100 dark:border-slate-700">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] shrink-0">
                🛡
              </div>
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-800 dark:text-slate-100">
                Easy
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white dark:bg-slate-800 rounded-full shadow-xs border border-slate-100 dark:border-slate-700">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 text-white flex items-center justify-center text-[8px] shrink-0">
                ★
              </div>
              <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-800 dark:text-slate-100">
                100% Free
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW: 100% Original Desktop Design */}
      <div className="hidden lg:block container mx-auto px-4 my-8">
        <div className="bg-gradient-to-r from-[#FFF8F0] via-[#FFECD9] to-[#FFE0C4] dark:from-[#0f2142] dark:via-[#162d5a] dark:to-[#1b366b] rounded-[24px] p-6 lg:p-8 flex flex-col items-start justify-between shadow-sm border-2 border-orange-200/80 dark:border-orange-500/40 relative overflow-hidden h-full">
          <div className="flex flex-col z-10 w-full mb-8">
            <h3 className="text-xl lg:text-2xl font-black text-[#1A1A1A] dark:text-white leading-tight mb-2 tracking-tight">
              Tell us what you need
            </h3>
            <p className="text-sm lg:text-base font-bold text-[#6D3D14] dark:text-orange-100 leading-snug mb-6">
              Get free quotes from trusted professionals
            </p>
            <Link href="/post-requirement">
              <button className="bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm px-5 py-3 rounded-full flex items-center gap-2 transition-transform hover:-translate-y-0.5">
                <span>Post Your Requirement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          
          <div className="absolute right-[-20px] bottom-[-20px] w-[180px] h-[180px] flex justify-end items-end pointer-events-none opacity-90 lg:opacity-100">
            <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="10" width="40" height="80" rx="6" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2.5" />
              <rect x="35" y="15" width="10" height="3" rx="1.5" fill="#1A1A1A" />
              <rect x="28" y="30" width="8" height="8" rx="2" fill="#4ADE80" />
              <path d="M30 34L32 36L35 32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="42" y="33" width="12" height="2" fill="#1A1A1A" rx="1" />

              <rect x="28" y="45" width="8" height="8" rx="2" fill="#60A5FA" />
              <path d="M30 49L32 51L35 47" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="42" y="48" width="12" height="2" fill="#1A1A1A" rx="1" />

              <rect x="28" y="60" width="8" height="8" rx="2" fill="#FBBF24" />
              <path d="M30 64L32 66L35 62" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="42" y="63" width="12" height="2" fill="#1A1A1A" rx="1" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

