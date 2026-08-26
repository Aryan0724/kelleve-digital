"use client";

import { Button } from "@/components/ui/button";
import { 
  Rocket, Zap, BarChart3, Gem, ShieldCheck, Sparkles, Lock, RotateCcw, Headphones
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      badge: "FREE",
      badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      price: "Free",
      subtitle: "Get started with basic features",
      themeColor: "purple",
      icon: Rocket,
      features: [
        "1 Business Listing",
        "Up to 10 Portfolio Images",
        "Basic Lead Access",
        "Standard Support",
      ],
    },
    {
      name: "QuickStart",
      badge: "3 MONTHS",
      badgeColor: "bg-purple-600 text-white",
      price: "₹4,999.00",
      themeColor: "purple",
      icon: Zap,
      features: [
        "3 Business Listings",
        "Elite Professional Badge",
        "Gold Verification",
        "Early Lead Access",
        "Real-time Notifications",
        "Up to 30 Portfolio Images",
        "Priority Support",
      ],
    },
    {
      name: "GrowthPlus",
      badge: "6 MONTHS",
      badgeColor: "bg-blue-600 text-white",
      price: "₹9,999.00",
      themeColor: "blue",
      icon: BarChart3,
      features: [
        "5 Business Listings",
        "Elite Professional Badge",
        "Gold Verification",
        "Early Lead Access",
        "Real-time Notifications",
        "Website Link Integration",
        "Up to 60 Portfolio Images",
        "Priority Support",
      ],
    },
    {
      name: "ProBusiness",
      badge: "1 YEAR",
      badgeColor: "bg-orange-500 text-white",
      price: "₹17,999.00",
      isPopular: true,
      themeColor: "orange",
      icon: Gem,
      features: [
        "10 Business Listings",
        "Search Ranking Boost",
        "Instant Lead Notifications",
        "Website Link Integration",
        "Up to 100 Portfolio Images",
        "Detailed Lead Insights",
        "Priority Support",
        "Custom Profile URL",
      ],
    },
    {
      name: "EliteBusiness",
      badge: "1 YEAR",
      badgeColor: "bg-emerald-600 text-white",
      price: "₹35,999.00",
      themeColor: "green",
      icon: ShieldCheck,
      features: [
        "Unlimited Business Listings",
        "Search Ranking Boost",
        "Instant Lead Notifications",
        "Website Link Integration",
        "Up to 200 Portfolio Images",
        "Detailed Lead Insights",
        "Featured Listing",
        "Dedicated Account Manager",
        "Custom Profile URL",
        "Premium Support",
      ],
    },
  ];

  return (
    <div className="bg-[#f8f9fa] dark:bg-slate-950 min-h-screen font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200 dark:border-orange-800">
            <Sparkles className="w-3.5 h-3.5" /> Professional Subscription Plans
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Grow Your Interior Business Faster
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Choose the perfect plan to get direct verified client leads, top category rankings, and premium verified badges.
          </p>
        </div>

        {/* 5 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isPopular = plan.isPopular;

            const getThemeStyles = () => {
              if (isPopular) {
                return {
                  cardBorder: "border-2 border-[#ff6b00] shadow-xl md:-translate-y-2",
                  iconBg: "bg-orange-500 text-white",
                  accentColor: "text-[#ff6b00]",
                  dotColor: "bg-[#ff6b00]",
                  btnClass: "bg-[#ff6b00] hover:bg-orange-600 text-white shadow-md shadow-orange-500/20",
                };
              }
              if (plan.themeColor === "purple") {
                return {
                  cardBorder: "border border-slate-200 dark:border-slate-800 shadow-sm",
                  iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
                  accentColor: "text-purple-600 dark:text-purple-400",
                  dotColor: "bg-purple-600",
                  btnClass: "bg-[#7c3aed] hover:bg-purple-700 text-white shadow-md shadow-purple-600/20",
                };
              }
              if (plan.themeColor === "blue") {
                return {
                  cardBorder: "border border-slate-200 dark:border-slate-800 shadow-sm",
                  iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
                  accentColor: "text-blue-600 dark:text-blue-400",
                  dotColor: "bg-blue-600",
                  btnClass: "bg-[#0284c7] hover:bg-sky-700 text-white shadow-md shadow-sky-600/20",
                };
              }
              if (plan.themeColor === "green") {
                return {
                  cardBorder: "border border-slate-200 dark:border-slate-800 shadow-sm",
                  iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
                  accentColor: "text-emerald-600 dark:text-emerald-400",
                  dotColor: "bg-emerald-600",
                  btnClass: "bg-[#16a34a] hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
                };
              }
              return {
                cardBorder: "border border-slate-200 dark:border-slate-800 shadow-sm",
                iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                accentColor: "text-slate-700",
                dotColor: "bg-slate-500",
                btnClass: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:text-white",
              };
            };

            const theme = getThemeStyles();

            return (
              <div
                key={plan.name}
                className={`bg-white dark:bg-slate-900 rounded-2xl flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${theme.cardBorder}`}
              >
                {/* Popular Ribbon */}
                {isPopular && (
                  <div className="bg-[#ff6b00] text-white text-[11px] font-extrabold text-center py-1.5 uppercase tracking-wider flex items-center justify-center gap-1">
                    <span>★ MOST POPULAR</span>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  {/* Duration Badge */}
                  <div className="flex justify-center mb-4">
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  {/* Plan Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${theme.iconBg} shadow-inner`}>
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Plan Name & Price */}
                  <div className="text-center mb-4">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className={`text-2xl font-black mt-1 ${theme.accentColor}`}>
                      {plan.price}
                    </div>
                    {plan.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {plan.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Sparkle Divider */}
                  <div className="flex items-center justify-center gap-2 my-2 text-slate-300 dark:text-slate-700">
                    <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1"></div>
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 my-4 flex-1 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${theme.dotColor}`}></div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <div className="p-5 pt-0">
                  <Link href="/dashboard?tab=subscription" className="w-full block">
                    <Button className={`w-full h-11 rounded-xl font-black text-xs transition-all active:scale-95 uppercase tracking-wide ${theme.btnClass}`}>
                      Choose Plan
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Bar */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-around gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">100% Secure Payments</div>
              <div className="text-xs text-slate-500">256-bit Encrypted Checkout</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Cancel Anytime</div>
              <div className="text-xs text-slate-500">No Long-Term Lock-In</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">24/7 Dedicated Support</div>
              <div className="text-xs text-slate-500">Fast Resolution</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Money Back Guarantee</div>
              <div className="text-xs text-slate-500">Guaranteed Quality</div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
