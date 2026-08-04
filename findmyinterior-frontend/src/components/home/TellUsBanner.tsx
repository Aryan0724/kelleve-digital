import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";

export function TellUsBanner() {
  return (
    <div className="bg-gradient-to-r from-[#FFF8F0] via-[#FFECD9] to-[#FFE0C4] dark:from-[#0f2142] dark:via-[#162d5a] dark:to-[#1b366b] rounded-[24px] p-6 lg:p-8 flex flex-col items-start justify-between shadow-sm border-2 border-orange-200/80 dark:border-orange-500/40 relative overflow-hidden h-full">
      
      {/* Text & CTA Button */}
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
      
      {/* Right Side - Phone Illustration with Checks */}
      <div className="absolute right-[-20px] bottom-[-20px] w-[180px] h-[180px] flex justify-end items-end pointer-events-none opacity-90 lg:opacity-100">
        <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Phone Body */}
          <rect x="20" y="10" width="40" height="80" rx="6" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2.5" />
          {/* Phone Header */}
          <rect x="35" y="15" width="10" height="3" rx="1.5" fill="#1A1A1A" />
          {/* Checkbox items inside phone */}
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
  );
}

