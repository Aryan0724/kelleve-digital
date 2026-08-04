"use client";

import { Star, User, ShieldCheck, Briefcase, Building2 } from "lucide-react";

export function Stats({ stats }: { stats?: any }) {
  const statItems = [
    {
      icon: <Star className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      value: "4.9/5",
      label: "Average Rating",
    },
    {
      icon: <User className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      value: "10,000+",
      label: "Happy Customers",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      value: "5,000+",
      label: "Verified Professionals",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      value: "25,000+",
      label: "Projects Completed",
    },
    {
      icon: <Building2 className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      value: "50+",
      label: "Cities Covered",
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 relative z-10 pt-16 pb-10">
      <div className="container max-w-[1320px] mx-auto px-6">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6 w-full px-4">
          {statItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 flex-1 justify-center md:justify-start">
              <div className="shrink-0">{item.icon}</div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
                  {item.value}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
