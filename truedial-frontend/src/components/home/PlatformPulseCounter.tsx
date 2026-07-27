"use client";

import { Users, Star, Clock, MapPin, Award } from "lucide-react";

export default function PlatformPulseCounter() {
  const stats = [
    { label: "Verified Businesses", val: "50,000+", icon: Users, color: "text-orange-500 bg-orange-100 dark:bg-orange-950" },
    { label: "Customer Reviews", val: "2,40,000+", icon: Star, color: "text-amber-500 bg-amber-100 dark:bg-amber-950" },
    { label: "Avg. Quote Reply Time", val: "15 Mins", icon: Clock, color: "text-blue-500 bg-blue-100 dark:bg-blue-950" },
    { label: "Cities Across India", val: "50+ Cities", icon: MapPin, color: "text-green-500 bg-green-100 dark:bg-green-950" },
    { label: "VIP Card Savings", val: "₹12+ Crore", icon: Award, color: "text-purple-500 bg-purple-100 dark:bg-purple-950" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-12 px-6 md:px-12">
      <div className="bg-gradient-to-r from-navy via-slate-900 to-navy dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {stats.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${item.color} shadow-md`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">{item.val}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
