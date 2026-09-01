"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  color: string;
  gradient: string;
  buttonText: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "BASIC",
    subtitle: "PERFECT FOR SMALL BUSINESSES",
    price: "FREE",
    color: "text-[#1E40AF]",
    gradient: "from-[#1E40AF] to-[#3B82F6]",
    buttonText: "Start Free",
  },
  {
    id: "gold",
    name: "GOLD (GROWTH)",
    subtitle: "BEST FOR BUSINESSES",
    price: "₹4,900 / YEAR",
    color: "text-[#F59E0B]",
    gradient: "from-[#D97706] to-[#FBBF24]",
    buttonText: "Upgrade to Gold",
    popular: true,
  },
  {
    id: "premium",
    name: "PREMIUM",
    subtitle: "BEST FOR BRAND BUILDING",
    price: "₹14,900 / YEAR",
    color: "text-[#7C3AED]",
    gradient: "from-[#6D28D9] to-[#8B5CF6]",
    buttonText: "Get Premium",
  },
  {
    id: "elite",
    name: "ELITE",
    subtitle: "ULTIMATE GROWTH PARTNER",
    price: "₹29,900 / YEAR",
    color: "text-[#DC2626]",
    gradient: "from-[#B91C1C] to-[#EF4444]",
    buttonText: "Go Elite",
  },
];

const FEATURES = [
  { name: "Business Listing", values: ["✓", "✓", "✓", "✓"] },
  { name: "Business Profile Page", values: ["✓", "✓", "✓", "✓"] },
  { name: "Contact & Location", values: ["✓", "✓", "✓", "✓"] },
  { name: "Photo Gallery", values: ["✓", "✓", "✓", "✓"] },
  { name: "Video Gallery", values: ["✕", "Up to 1", "Up to 3", "Unlimited"] },
  { name: "Reviews & Ratings", values: ["Basic", "Basic", "Priority", "Top Priority"] },
  { name: "Lead Generation", values: ["Shared", "Basic", "Priority Leads", "Exclusive Leads"] },
  { name: "Dedicated Microsite", values: ["✕", "✕", "✓", "✓"] },
  { name: "Featured Placement", values: ["✕", "Basic", "Priority", "Top Priority"] },
  { name: "Promotional Reel Video", values: ["✕", "1 Reel/Quarter", "2 Reels/Quarter", "1 Reels/ Reels"] },
  { name: "Corporate / Business Video", values: ["✕", "✕", "Up to 1", "Up to 5"] },
  { name: "Social Media Promotion", values: ["✕", "Basic", "Advanced", "Premium"] },
  { name: "SMS Campaign Access", values: ["✕", "Optional", "Yes", "Priority"] },
  { name: "Privilege Card Integration", values: ["✕", "✕", "Basic", "Priority"] },
];

const MEDIA_FEATURES = [
  { name: "Multi City Digital Card", values: ["(No Card)", "5 CARDS FREE", "10 CARDS FREE", "20 CARDS FREE"] },
  { name: "Free Digital Card", values: ["(No Card)", "✕", "✕", "✕"] },
  { name: "Festival / Offer Campaign", values: ["✕", "1 Campaign", "3 Campaigns", "6 Campaigns"] },
  { name: "TD News Channel Coverage", values: ["✕", "✕", "Basic Feature", "Featured Segment"] },
  { name: "Business Documentary", values: ["✕", "✕", "Short (3-5 Min)", "Full (5-10 Min)"] },
  { name: "Podcast Interview", values: ["✕", "✕", "Quarterly", "Monthly"] },
  { name: "Monthly Analytics Report", values: ["✕", "Basic", "Advanced", "Advanced"] },
  { name: "Area Exclusive Benefits", values: ["✕", "✕", "Limited", "Priority"] },
  { name: "Customer Acquisition Focus", values: ["Low", "Medium", "High", "High"] },
];

export default function PricingTable() {
  const renderValue = (value: string) => {
    if (value === "✓") return <Check className="w-5 h-5 text-green-500 mx-auto" strokeWidth={3} />;
    if (value === "✕") return <X className="w-5 h-5 text-red-500/50 mx-auto" strokeWidth={2.5} />;
    
    const isHighlighted = ["Priority", "Top Priority", "Exclusive Leads", "Unlimited"].some(h => value.includes(h));
    const isFree = value.includes("FREE");

    return (
      <span className={`text-sm font-bold ${
        isFree ? "text-amber-600 dark:text-amber-400" : 
        isHighlighted ? "text-indigo-600 dark:text-indigo-400" : 
        "text-slate-700 dark:text-slate-300"
      }`}>
        {value}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* ── Desktop Table ── */}
      <div className="hidden lg:block overflow-x-auto pb-10">
        <div className="min-w-[1000px] w-full">
          {/* Header Row */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            <div className="flex flex-col justify-end pb-6 px-4">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-2">
                One Listing,
                <br /> Multiple Benefits,
                <br /> <span className="text-[#E8701A]">Maximum Growth!</span>
              </h3>
              <p className="text-sm font-bold text-slate-500">Choose the right plan for your business</p>
            </div>
            
            {PLANS.map((plan) => (
              <div key={plan.id} className="relative flex flex-col items-center text-center bg-white dark:bg-slate-800 rounded-t-3xl border border-b-0 border-slate-200 dark:border-slate-700 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className={`w-full h-2 bg-gradient-to-r ${plan.gradient}`} />
                {plan.popular && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                    Most Popular
                  </div>
                )}
                <div className="p-6 pb-4 flex flex-col flex-1 w-full relative">
                  <h4 className={`text-xl font-black ${plan.color} mb-1 mt-2 tracking-tight`}>{plan.name}</h4>
                  <div className="text-[20px] font-black text-slate-900 dark:text-white mb-2 leading-none whitespace-nowrap">
                    {plan.price}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-auto">
                    {plan.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Standard Features Body */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
            <div className="grid grid-cols-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 p-4">
              <div className="col-span-1 font-black text-slate-800 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span> Features
              </div>
              <div className="col-span-4" />
            </div>
            
            {FEATURES.map((feature, i) => (
              <div key={i} className={`grid grid-cols-5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${i !== FEATURES.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}`}>
                <div className="py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center border-r border-slate-100 dark:border-slate-700/50">
                  {feature.name}
                </div>
                {feature.values.map((val, j) => (
                  <div key={j} className={`py-4 px-2 flex items-center justify-center text-center ${j !== 3 ? 'border-r border-slate-100 dark:border-slate-700/50' : ''}`}>
                    {renderValue(val)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Media & Promotion Features */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="grid grid-cols-5 bg-[#FFF7ED] dark:bg-orange-950/20 border-b border-slate-200 dark:border-slate-700 p-4">
              <div className="col-span-1 font-black text-[#E8701A] uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#E8701A] rounded-full"></span> Free Media & Promotion Benefits
              </div>
              <div className="col-span-4" />
            </div>
            
            {MEDIA_FEATURES.map((feature, i) => (
              <div key={i} className={`grid grid-cols-5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${i !== MEDIA_FEATURES.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}`}>
                <div className="py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center border-r border-slate-100 dark:border-slate-700/50">
                  {feature.name}
                </div>
                {feature.values.map((val, j) => (
                  <div key={j} className={`py-4 px-2 flex items-center justify-center text-center ${j !== 3 ? 'border-r border-slate-100 dark:border-slate-700/50' : ''}`}>
                    {renderValue(val)}
                  </div>
                ))}
              </div>
            ))}
            
            {/* Action Row */}
            <div className="grid grid-cols-5 p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <div className="col-span-1" />
              {PLANS.map((plan) => (
                <div key={plan.id} className="px-4 flex justify-center">
                  <Link href="/privilege-card/checkout" className="w-full">
                    <button className={`w-full py-3 px-4 rounded-xl font-black text-white text-sm shadow-lg hover:scale-105 transition-transform bg-gradient-to-r ${plan.gradient}`}>
                      {plan.buttonText}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Layout ── */}
      <div className="block lg:hidden space-y-8">
        {PLANS.map((plan, index) => (
          <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${plan.gradient}`} />
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                Most Popular
              </div>
            )}
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h4 className={`text-2xl font-black ${plan.color} tracking-tight`}>{plan.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                {plan.subtitle}
              </p>
              <div className="text-[24px] font-black text-slate-900 dark:text-white leading-none">
                {plan.price}
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 space-y-3">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">Features</div>
                {FEATURES.map((feature, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{feature.name}</span>
                    <span className="text-right">{renderValue(feature.values[index])}</span>
                  </div>
                ))}
              </div>
              
              <div className="mb-8 space-y-3">
                <div className="text-xs font-black text-[#E8701A] uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">Media & Promotion Benefits</div>
                {MEDIA_FEATURES.map((feature, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{feature.name}</span>
                    <span className="text-right">{renderValue(feature.values[index])}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/privilege-card/checkout" className="block w-full">
                <button className={`w-full py-4 rounded-xl font-black text-white text-base shadow-lg hover:opacity-90 transition-opacity bg-gradient-to-r ${plan.gradient}`}>
                  {plan.buttonText}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
