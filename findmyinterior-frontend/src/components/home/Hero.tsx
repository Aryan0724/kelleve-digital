"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  FileText, 
  Award,
  Clock,
  Plus,
  Search as SearchIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useState } from "react";
import { HowItWorksModal } from "./HowItWorksModal";

export function Hero() {
  const { user } = useAuthStore();
  const [isHowItWorksOpenState, setIsHowItWorksOpen] = useState(false);
  const isHowItWorksOpen = isHowItWorksOpenState;



  const isCustomer = !user || user?.role === 'customer';
  const isPro = user && ['interior_designer', 'architect', 'contractor', 'builder', 'supplier'].includes(user.role);
  const isWorker = user?.role === 'worker';

  return (
    <section className="relative w-full bg-white dark:bg-background">
      {/* MOBILE HERO VIEW (lg:hidden) - Exact visual match with reference mockup */}
      <div className="lg:hidden container mx-auto px-4 pt-2 pb-4">
        {/* Hero Card with Family Photo Background */}
        <div className="w-full rounded-[24px] p-4 sm:p-6 relative overflow-hidden border border-orange-100/80 dark:border-slate-800 shadow-sm min-h-[220px] flex flex-col justify-center bg-[#FFFDF9] dark:bg-slate-900">
          {/* Background image on right */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/hero-family-mockup.jpg"
              alt="Happy family planning dream home"
              className="w-full h-full object-cover object-right"
            />
            {/* Smooth left-to-right fade for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/95 sm:via-[#FFFDF9]/90 to-transparent dark:from-[#050f24] dark:via-[#050f24]/95 dark:to-transparent" />
          </div>

          {/* Left Hero Content */}
          <div className="relative z-10 w-[68%] sm:w-[65%]">
            <h1 className="text-[22px] sm:text-[26px] font-black text-[#0a1c3a] dark:text-white leading-[1.15] mb-2 tracking-tight">
              Where Projects<br />
              Meet <span className="text-[#E8701A]">Professionals</span>
            </h1>

            <p className="text-[10.5px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium leading-[1.35] mb-4 pr-1">
              Post your requirement, get multiple quotes &amp; hire the best for your dream space.
            </p>

            <div className="flex items-center gap-2">
              <Link href="/post-requirement">
                <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-[10.5px] sm:text-xs px-3.5 py-2 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25 active:scale-95 transition-transform whitespace-nowrap">
                  <div className="bg-white/20 rounded-full p-0.5"><Plus className="w-3 h-3" strokeWidth={3} /></div> 
                  <span>Post a Project</span>
                </button>
              </Link>
              <button 
                type="button" 
                onClick={() => setIsHowItWorksOpen(true)}
                className="bg-white dark:bg-slate-800 text-[#0a1c3a] dark:text-white font-bold text-[10.5px] sm:text-xs px-3.5 py-2 rounded-full flex items-center justify-center gap-1.5 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a1c3a] dark:text-white shrink-0"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                <span>How It Works</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Trust Strip (Mobile) */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 py-3 px-2 mt-3">
          <div className="grid grid-cols-4 gap-1 items-center justify-between">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#E8701A]" strokeWidth={1.75} />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-white leading-tight">Verified<br/>Professionals</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <FileText className="w-4 h-4 shrink-0 text-[#E8701A]" strokeWidth={1.75} />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-white leading-tight">Multiple<br/>Quotes</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4 shrink-0 text-[#E8701A]" strokeWidth={1.75} />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-white leading-tight">Best Price<br/>Guarantee</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 shrink-0 text-[#E8701A]" strokeWidth={1.75} />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-white leading-tight">On-Time<br/>Delivery</span>
            </div>
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          <span className="w-4 h-1.5 bg-[#E8701A] rounded-full"></span>
          <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
          <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
        </div>
      </div>

      {/* DESKTOP HERO VIEW (hidden on mobile, visible on lg+) */}
      <div className="hidden lg:flex container relative mx-auto px-4 py-8 lg:py-12 flex-col items-center">
        {/* Main Hero Banner Card */}
        <div className="w-full rounded-[32px] lg:rounded-[40px] p-12 lg:p-16 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8 min-h-[400px] lg:min-h-[500px] flex flex-col justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=2070&auto=format&fit=crop"
              alt="Beautiful interior space"
              className="w-full h-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/80 to-transparent dark:from-[#050f24] dark:via-[#050f24]/90 dark:to-transparent" />
            <div 
              className="absolute inset-0 pointer-events-none opacity-100"
              style={{
                background: `radial-gradient(circle at 85% 60%, rgba(232, 112, 26, 0.15) 0%, transparent 70%)`
              }}
            />
          </div>

          {/* Left Content */}
          <div className="relative z-10 w-3/5 lg:w-1/2 xl:w-[55%] 2xl:w-1/2">
            {isWorker ? (
              <>
                <h1 className="text-5xl lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-black text-[#0a1c3a] dark:text-white leading-[1.12] mb-6 tracking-tight">
                  Find Regular<br/>
                  Work in <span className="text-[#E8701A]">Bihar</span>
                </h1>
                <p className="text-base lg:text-lg text-slate-700 dark:text-gray-300 font-semibold leading-[1.4] mb-6 pr-10 max-w-lg">
                  Connect with top contractors, builders, and homeowners. Get daily wage and contract work directly on your dashboard.
                </p>
                <div className="flex flex-row flex-wrap items-center gap-3">
                  <Link href="/jobs">
                    <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-sm lg:text-base px-6 py-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5">
                      <SearchIcon className="w-5 h-5" strokeWidth={2.5} /> 
                      <span>Browse Jobs</span>
                    </button>
                  </Link>
                </div>
              </>
            ) : isPro ? (
              <>
                <h1 className="text-5xl lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-black text-[#0a1c3a] dark:text-white leading-[1.12] mb-6 tracking-tight">
                  Grow Your<br/>
                  Business in <span className="text-[#E8701A]">Bihar</span>
                </h1>
                <p className="text-base lg:text-lg text-slate-700 dark:text-gray-300 font-semibold leading-[1.4] mb-6 pr-10 max-w-lg">
                  Find new projects, submit quotes, and manage your incoming leads directly from your dashboard.
                </p>
                <div className="flex flex-row flex-wrap items-center gap-3">
                  <Link href="/projects">
                    <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-sm lg:text-base px-6 py-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5">
                      <FileText className="w-5 h-5" strokeWidth={2.5} /> 
                      <span>View Open Projects</span>
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-5xl lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-black text-[#0a1c3a] dark:text-white leading-[1.12] mb-6 tracking-tight">
                  Where Projects<br/>
                  <span className="text-[#E8701A]">Meet Professionals</span>
                </h1>
                
                <h2 className="sr-only">
                  Find the Best Interior Designer Near Me, Interior Designers in Patna, Home Interior Design Company, Civil Contractor, Modular Kitchen Designer, and Builders in Patna, Bihar.
                </h2>

                <p className="text-base lg:text-lg text-slate-700 dark:text-gray-300 font-semibold leading-[1.4] mb-6 pr-10 max-w-lg">
                  Post your requirement, get multiple quotes &amp; hire the best for your dream space.
                </p>

                <div className="flex flex-row items-center gap-3">
                  {(!user || user?.role === 'customer') && (
                    <Link href="/post-requirement">
                      <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-sm lg:text-base px-6 py-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5 whitespace-nowrap">
                        <div className="bg-white/20 rounded-full p-1.5"><Plus className="w-5 h-5" strokeWidth={2.5} /></div> 
                        <span>Post Requirement</span>
                      </button>
                    </Link>
                  )}
                  <button 
                    type="button" 
                    onClick={() => setIsHowItWorksOpen(true)}
                    className="bg-white dark:bg-white/10 dark:text-white text-[#0a1c3a] font-bold text-sm lg:text-base px-6 py-4 rounded-full flex items-center justify-center gap-2 shadow-sm border border-slate-200 dark:border-white/20 transition-transform hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a1c3a] dark:text-white"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    <span>How It Works</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Desktop Feature Strip */}
        <div className="w-full max-w-5xl 2xl:max-w-6xl bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 py-6 px-12 -mt-14 relative z-10 mx-auto">
          <div className="grid grid-cols-4 gap-6 items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-3 text-left group cursor-default">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#E8701A]" strokeWidth={2} />
              </div>
              <span className="text-[13px] font-bold text-slate-700 dark:text-white leading-tight uppercase tracking-wide">Verified Professionals</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 text-left group cursor-default">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#E8701A]" strokeWidth={2} />
              </div>
              <span className="text-[13px] font-bold text-slate-700 dark:text-white leading-tight uppercase tracking-wide">Multiple Quotes</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 text-left group cursor-default">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-[#E8701A]" strokeWidth={2} />
              </div>
              <span className="text-[13px] font-bold text-slate-700 dark:text-white leading-tight uppercase tracking-wide">Best Price Guarantee</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 text-left group cursor-default">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-[#E8701A]" strokeWidth={2} />
              </div>
              <span className="text-[13px] font-bold text-slate-700 dark:text-white leading-tight uppercase tracking-wide">On-Time Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
    </section>
  );
}
