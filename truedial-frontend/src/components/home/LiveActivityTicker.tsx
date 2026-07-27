"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, Star, ShieldCheck, Award, Bell } from "lucide-react";

const LIVE_EVENTS = [
  {
    icon: Zap,
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
    text: "24 people in Mumbai just requested quotes for Modular Kitchens & Interiors",
    time: "Just now",
    tag: "HIGH DEMAND"
  },
  {
    icon: ShieldCheck,
    color: "text-green-500 bg-green-50 dark:bg-green-950/50",
    text: "Sharma Interior Decorators accepted a new design project in Delhi NCR",
    time: "2 mins ago",
    tag: "VERIFIED DEAL"
  },
  {
    icon: Star,
    color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/50",
    text: "Royal Palace Hotel received a 5.0 ★ verified review from Rahul S.",
    time: "4 mins ago",
    tag: "TOP REVIEW"
  },
  {
    icon: Award,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/50",
    text: "18 new users claimed the TrueDial Multi-City VIP Privilege Card today",
    time: "6 mins ago",
    tag: "VIP CLUB"
  },
  {
    icon: TrendingUp,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
    text: "1,420 businesses in Bangalore & Pune active online right now",
    time: "Live now",
    tag: "PLATFORM PULSE"
  }
];

export default function LiveActivityTicker() {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
        setIsFading(false);
      }, 300);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const current = LIVE_EVENTS[index];
  const IconComponent = current.icon;

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-orange-200/60 dark:border-slate-800 rounded-full px-4 py-2.5 shadow-lg shadow-orange-500/5 flex items-center justify-between gap-3 overflow-hidden transition-all duration-300">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-900">
            Live Pulse
          </span>
        </div>

        <div 
          className={`flex-1 flex items-center gap-2.5 text-xs sm:text-sm font-medium text-navy dark:text-gray-200 truncate transition-opacity duration-300 ${
            isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${current.color}`}>
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">{current.text}</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 hidden sm:inline">({current.time})</span>
        </div>

        <div className="shrink-0 hidden md:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          <span>{current.tag}</span>
        </div>
      </div>
    </div>
  );
}
