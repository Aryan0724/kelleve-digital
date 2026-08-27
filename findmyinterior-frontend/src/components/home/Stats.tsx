"use client";

import { Users, ShieldCheck, ClipboardCheck, Building2 } from "lucide-react";

export function Stats({ stats }: { stats?: any }) {
  // Mobile 4 items from mockup
  const mobileStatItems = [
    {
      value: "10K+",
      label: "Happy Customers",
      icon: <Users className="w-4 h-4 text-[#E8701A]" strokeWidth={2} />
    },
    {
      value: "5K+",
      label: "Verified Professionals",
      icon: <ShieldCheck className="w-4 h-4 text-[#E8701A]" strokeWidth={2} />
    },
    {
      value: "25K+",
      label: "Projects Completed",
      icon: <ClipboardCheck className="w-4 h-4 text-[#E8701A]" strokeWidth={2} />
    },
    {
      value: "50+",
      label: "Cities Covered",
      icon: <Building2 className="w-4 h-4 text-[#E8701A]" strokeWidth={2} />
    }
  ];

  // Desktop 5 items from original design
  const desktopStatItems = [
    { value: "4.9/5", label: "Average Rating" },
    { value: "10,000+", label: "Happy Customers" },
    { value: "5,000+", label: "Verified Professionals" },
    { value: "25,000+", label: "Projects Completed" },
    { value: "50+", label: "Cities Covered" },
  ];

  return (
    <>
      {/* MOBILE VIEW: Exact 4-metric strip from reference mockup */}
      <div className="lg:hidden w-full py-2 my-2 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-2 shadow-xs">
            {mobileStatItems.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1 mb-0.5">
                  {item.icon}
                  <span className="text-[12px] sm:text-sm font-black text-[#0a1c3a] dark:text-white leading-none">
                    {item.value}
                  </span>
                </div>
                <span className="text-[8.5px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW: 100% Original Desktop Stats Bar */}
      <div className="hidden lg:block w-full bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 relative z-10 py-12 my-20">
        <div className="container max-w-[1320px] mx-auto px-4">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6 w-full divide-x divide-slate-100 dark:divide-slate-800">
            {desktopStatItems.map((item, i) => (
              <div key={i} className={`flex flex-col items-center justify-center flex-1 ${i === 0 ? 'pl-0' : 'pl-6'}`}>
                <span className="text-2xl lg:text-[32px] font-black text-[#111827] dark:text-white leading-tight mb-2 tracking-tight">
                  {item.value}
                </span>
                <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
