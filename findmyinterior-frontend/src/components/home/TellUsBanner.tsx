import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";

export function TellUsBanner() {
  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-background py-3 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-[#FFF8F0] via-[#FFECD9] to-[#FFE0C4] dark:from-[#0f2142] dark:via-[#162d5a] dark:to-[#1b366b] rounded-[24px] p-5.5 sm:p-6 flex items-center justify-between shadow-md border-2 border-orange-200/80 dark:border-orange-500/40 relative overflow-hidden">
          
          {/* Left Text & CTA Button */}
          <div className="flex flex-col max-w-[64%] z-10">
            <h3 className="text-base sm:text-lg font-black text-[#0a1c3a] dark:text-white leading-tight mb-1 tracking-tight">
              Tell us what you need.
            </h3>
            <p className="text-xs sm:text-[13px] font-bold text-[#6D3D14] dark:text-orange-100 leading-snug mb-3.5">
              Get quotes from verified professionals.
            </p>
            <Link href="/post-requirement">
              <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 w-max shadow-md shadow-orange-600/30 transition-transform hover:-translate-y-0.5">
                <span>Post your requirement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          
          {/* Right Side - Custom Figma-Style Requirement Clipboard & Quote Badge Illustration */}
          <div className="w-[36%] flex justify-end items-center pr-1 pointer-events-none">
            <svg className="w-22 h-22 drop-shadow-md" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Warm glow background circle */}
              <circle cx="44" cy="40" r="28" fill="#FFE0C6" fillOpacity="0.9" />
              
              {/* Main Clipboard / Project Sheet */}
              <rect x="24" y="16" width="36" height="46" rx="5" fill="#FFFFFF" stroke="#0A1C3A" strokeWidth="2.5" />
              <path d="M34 16V12C34 10.8954 34.8954 10 36 10H48C49.1046 10 50 10.8954 50 12V16" fill="#E8701A" stroke="#0A1C3A" strokeWidth="2" />
              
              {/* Checklist Lines & Orange Checkmarks */}
              <path d="M36 28H52" stroke="#0A1C3A" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M36 36H48" stroke="#0A1C3A" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M36 44H50" stroke="#0A1C3A" strokeWidth="2.5" strokeLinecap="round" />
              
              <circle cx="30" cy="28" r="2.5" fill="#E8701A" />
              <circle cx="30" cy="36" r="2.5" fill="#E8701A" />
              <circle cx="30" cy="44" r="2.5" fill="#0A1C3A" />
              
              {/* Floating Verified Quote Badge overlapping bottom left */}
              <g transform="translate(14, 42)">
                <rect width="32" height="22" rx="4" fill="#0A1C3A" stroke="#FFFFFF" strokeWidth="2" />
                <path d="M8 11L13 16L24 6" stroke="#E8701A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Sparkles */}
              <circle cx="64" cy="24" r="2.5" fill="#E8701A" />
              <circle cx="18" cy="24" r="2" fill="#0A1C3A" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}

