"use client";

import React from "react";
import { ShieldCheck, Clock, DollarSign, Flame } from "lucide-react";

export function TrustBadgesBanner() {
  const badges = [
    {
      icon: <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />,
      label: "Free Quotes in 24 Hours",
      subtitle: "Instant callback guarantee",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />,
      label: "100% Verified Pros",
      subtitle: "Background checked in Bihar",
    },
    {
      icon: <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />,
      label: "No Hidden Charges",
      subtitle: "100% transparent pricing",
    },
    {
      icon: <Flame className="h-4 w-4 text-red-500 flex-shrink-0" />,
      label: "Limited Free Listings",
      subtitle: "Join Bihar's #1 network",
    },
  ];

  return (
    <div className="w-full bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm border-y border-slate-200 dark:border-slate-800 py-3 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {badges.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {item.label}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
