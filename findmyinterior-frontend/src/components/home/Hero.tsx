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
      <div className="container relative mx-auto px-4 py-2 md:py-8 lg:py-12 flex flex-col items-center">
        
        {/* Main Hero Banner Card */}
        <div className="w-full rounded-[24px] md:rounded-[32px] lg:rounded-[40px] p-6 md:p-12 lg:p-16 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-4 md:mb-8 min-h-[280px] md:min-h-[400px] lg:min-h-[500px] flex flex-col justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=2070&auto=format&fit=crop"
              alt="Beautiful interior space"
              className="w-full h-full object-cover object-right"
            />
            {/* Gradient Overlay - Cream on Left to Transparent on Right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/90 md:via-[#FFFDF9]/80 to-transparent dark:from-[#050f24] dark:via-[#050f24]/90 dark:to-transparent" />
            
            {/* Subtle warm orange accent glow */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-50 md:opacity-100"
              style={{
                background: `radial-gradient(circle at 85% 60%, rgba(232, 112, 26, 0.15) 0%, transparent 70%)`
              }}
            />
          </div>

          {/* Left Content */}
          <div className="relative z-10 w-full sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-[55%] 2xl:w-1/2 pt-4 sm:pt-0">
            {isWorker ? (
              <>
                <h1 className="text-[28px] md:text-5xl lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-black text-[#0a1c3a] dark:text-white leading-[1.12] mb-3 md:mb-6 tracking-tight">
                  Find Regular<br/>
                  Work in <span className="text-[#E8701A]">Bihar</span>
                </h1>
                <p className="text-[12px] md:text-base lg:text-lg text-slate-700 dark:text-gray-300 font-semibold leading-[1.4] mb-6 pr-2 md:pr-10 max-w-lg">
                  Connect with top contractors, builders, and homeowners. Get daily wage and contract work directly on your dashboard.
                </p>
                <div className="flex flex-row flex-wrap items-center gap-3">
                  <Link href="/jobs">
                    <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-[12px] md:text-sm lg:text-base px-4 py-3 md:px-6 md:py-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5">
                      <SearchIcon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} /> 
                      <span>Browse Jobs</span>
                    </button>
                  </Link>
                </div>
              </>
            ) : isPro ? (
              <>
                <h1 className="text-[28px] md:text-5xl lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-black text-[#0a1c3a] dark:text-white leading-[1.12] mb-3 md:mb-6 tracking-tight">
                  Grow Your<br/>
                  Business in <span className="text-[#E8701A]">Bihar</span>
                </h1>
                <p className="text-[12px] md:text-base lg:text-lg text-slate-700 dark:text-gray-300 font-semibold leading-[1.4] mb-6 pr-2 md:pr-10 max-w-lg">
                  Find new projects, submit quotes, and manage your incoming leads directly from your dashboard.
                </p>
                <div className="flex flex-row flex-wrap items-center gap-3">
                  <Link href="/projects">
                    <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-[12px] md:text-sm lg:text-base px-4 py-3 md:px-6 md:py-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5">
                      <FileText className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} /> 
                      <span>View Open Projects</span>
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-[32px] sm:text-[36px] md:text-5xl lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5.5rem] font-black text-[#0a1c3a] dark:text-white leading-[1.12] mb-3 md:mb-6 tracking-tight">
                  Where Projects<br/>
                  <span className="text-[#E8701A]">Meet Professionals</span>
                </h1>
                
                {/* SEO Keywords - Visually Hidden */}
                <h2 className="sr-only">
                  Find the Best Interior Designer Near Me, Interior Designers in Patna, Home Interior Design Company, Civil Contractor, Modular Kitchen Designer, and Builders in Patna, Bihar.
                </h2>

                <p className="text-[12px] md:text-base lg:text-lg text-slate-700 dark:text-gray-300 font-semibold leading-[1.4] mb-6 pr-2 md:pr-10 max-w-lg">
                  Post your requirement, get multiple quotes & hire the best for your dream space.
                </p>



                <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
                  {(!user || user?.role === 'customer') && (
                    <Link href="/post-requirement">
                      <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-[12px] sm:text-[13px] md:text-sm lg:text-base px-4 py-3 md:px-6 md:py-4 rounded-full flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 w-full sm:w-auto">
                        <div className="bg-white/20 rounded-full p-1 md:p-1.5"><Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" strokeWidth={2.5} /></div> 
                        <span>Post Requirement</span>
                      </button>
                    </Link>
                  )}
                  <button 
                    type="button" 
                    onClick={() => setIsHowItWorksOpen(true)}
                    className="bg-white dark:bg-white/10 dark:text-white text-[#0a1c3a] font-bold text-[12px] sm:text-[13px] md:text-sm lg:text-base px-4 py-3 md:px-6 md:py-4 rounded-full flex items-center justify-center gap-2 shadow-sm border border-slate-200 dark:border-white/20 transition-transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 w-full sm:w-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a1c3a] dark:text-white w-4 h-4 md:w-5 md:h-5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    <span>How It Works</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Feature Strip (Responsive Pill) */}
        <div className="w-[95%] md:w-full max-w-5xl 2xl:max-w-6xl bg-white dark:bg-slate-900 rounded-2xl md:rounded-full shadow-sm border border-slate-100 dark:border-slate-800 py-3 px-3 md:py-6 md:px-12 -mt-10 md:-mt-14 relative z-10 mx-auto">
          <div className="grid grid-cols-4 gap-2 md:gap-6 items-center justify-between">
            <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 text-center md:text-left group cursor-default">
              <div className="md:bg-orange-50 md:dark:bg-orange-900/20 md:p-3 md:rounded-full group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-[#E8701A]" strokeWidth={2} />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-[13px] font-bold text-slate-700 dark:text-white leading-tight md:uppercase md:tracking-wide">Verified<br className="md:hidden" /> Professionals</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 text-center md:text-left group cursor-default">
              <div className="md:bg-orange-50 md:dark:bg-orange-900/20 md:p-3 md:rounded-full group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4 md:w-6 md:h-6 text-[#E8701A]" strokeWidth={2} />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-[13px] font-bold text-slate-700 dark:text-white leading-tight md:uppercase md:tracking-wide">Multiple<br className="md:hidden" /> Quotes</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 text-center md:text-left group cursor-default">
              <div className="md:bg-orange-50 md:dark:bg-orange-900/20 md:p-3 md:rounded-full group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4 md:w-6 md:h-6 text-[#E8701A]" strokeWidth={2} />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-[13px] font-bold text-slate-700 dark:text-white leading-tight md:uppercase md:tracking-wide">Best Price<br className="md:hidden" /> Guarantee</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 text-center md:text-left group cursor-default">
              <div className="md:bg-orange-50 md:dark:bg-orange-900/20 md:p-3 md:rounded-full group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4 md:w-6 md:h-6 text-[#E8701A]" strokeWidth={2} />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-[13px] font-bold text-slate-700 dark:text-white leading-tight md:uppercase md:tracking-wide">On-Time<br className="md:hidden" /> Delivery</span>
            </div>
          </div>
        </div>

      </div>

      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
    </section>
  );
}
