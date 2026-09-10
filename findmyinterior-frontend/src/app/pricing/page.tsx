"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Rocket, Zap, Gem, ShieldCheck, Sparkles, Lock, RotateCcw, Headphones, Check, Loader2
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import api from "@/lib/api";

interface PlanItem {
  id?: number;
  name: string;
  slug: string;
  badge: string;
  badgeColor: string;
  price: string;
  numericPrice: number;
  subtitle: string;
  isPopular?: boolean;
  themeColor: "gray" | "purple" | "orange" | "green";
  icon: any;
  features: string[];
}

const CANONICAL_FALLBACK_PLANS: PlanItem[] = [
  {
    name: "Starter",
    slug: "starter",
    badge: "FREE",
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    price: "Free",
    numericPrice: 0,
    subtitle: "Essential tools to list your business",
    themeColor: "gray",
    icon: Rocket,
    features: [
      "1 Verified Business Listing",
      "Up to 5 Portfolio Images",
      "Standard Search Listing",
      "Standard Customer Support",
    ],
  },
  {
    name: "Growth",
    slug: "growth",
    badge: "1 YEAR",
    badgeColor: "bg-purple-600 text-white",
    price: "₹4,499.00",
    numericPrice: 4499,
    subtitle: "Ideal for growing independent designers",
    themeColor: "purple",
    icon: Zap,
    features: [
      "1 Verified Business Listing",
      "Up to 15 Portfolio Images",
      "+5 Recommendation Score Boost",
      "Category Matching Lead Alerts",
      "10% Contact Unlock Discount",
      "Standard Customer Support",
    ],
  },
  {
    name: "Professional",
    slug: "professional",
    badge: "1 YEAR",
    badgeColor: "bg-orange-500 text-white",
    price: "₹8,999.00",
    numericPrice: 8999,
    isPopular: true,
    subtitle: "Most popular for established interior studios",
    themeColor: "orange",
    icon: Gem,
    features: [
      "Up to 3 Verified Business Listings",
      "Up to 30 Portfolio Images",
      "2-Hour Early Lead Access",
      "Category Spotlight Placement",
      "+15 Recommendation Score Boost",
      "20% Contact Unlock Discount",
      "Instant Lead Notifications",
      "Summary Analytics & Profile Stats",
    ],
  },
  {
    name: "Elite",
    slug: "elite",
    badge: "1 YEAR",
    badgeColor: "bg-emerald-600 text-white",
    price: "₹17,999.00",
    numericPrice: 17999,
    subtitle: "Complete market domination & maximum leads",
    themeColor: "green",
    icon: ShieldCheck,
    features: [
      "Up to 5 Verified Business Listings",
      "Up to 60 Portfolio Images",
      "Immediate 0-Delay Lead Access",
      "Reserved Top-3 Category Placement",
      "Homepage Featured Slot Eligibility",
      "+25 Recommendation Score Boost",
      "30% Contact Unlock Discount",
      "Full Deep-Dive & Competitor Insights",
      "Responds Fast Badge Qualification",
      "High Priority Inquiries Support",
    ],
  },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<PlanItem[]>(CANONICAL_FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await api.get("/subscriptions/plans");
        const apiPlans = res.data?.data || [];
        if (apiPlans.length > 0) {
          // Filter to active plans and map
          const mapped: PlanItem[] = apiPlans
            .filter((p: any) => p.is_active && !p.is_archived)
            .map((p: any) => {
              const slug = (p.slug || "").toLowerCase();
              let matched = CANONICAL_FALLBACK_PLANS.find(c => c.slug === slug);
              const numPrice = Number(p.price_yearly || p.price_monthly || 0);

              return {
                id: p.id,
                name: p.name || matched?.name || "Plan",
                slug: p.slug,
                badge: numPrice > 0 ? "1 YEAR" : "FREE",
                badgeColor: matched?.badgeColor || "bg-blue-600 text-white",
                price: numPrice > 0 ? (p.formatted_price || `₹${numPrice.toLocaleString('en-IN')}.00`) : "Free",
                numericPrice: numPrice,
                isPopular: matched?.isPopular || false,
                subtitle: matched?.subtitle || "Annual subscription plan",
                themeColor: matched?.themeColor || "purple",
                icon: matched?.icon || Gem,
                features: (p.features && p.features.length > 0) ? p.features : (matched?.features || []),
              };
            });

          mapped.sort((a, b) => a.numericPrice - b.numericPrice);
          if (mapped.length >= 4) {
            setPlans(mapped);
          }
        }
      } catch (err) {
        console.warn("Using canonical fallback plans for pricing page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="bg-[#f8f9fa] dark:bg-slate-950 min-h-screen font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200 dark:border-orange-800">
            <Sparkles className="w-3.5 h-3.5" /> Canonical Subscription Plans
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Grow Your Interior Business Faster
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Choose the perfect plan to get direct verified client leads, top category rankings, and premium verified badges.
          </p>
        </div>

        {/* 4 Canonical Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
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
                accentColor: "text-slate-700 dark:text-slate-300",
                dotColor: "bg-slate-500",
                btnClass: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:text-white",
              };
            };

            const theme = getThemeStyles();

            return (
              <div
                key={plan.slug || plan.name}
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
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
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
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <div className="p-5 pt-0">
                  <Link href="/dashboard?tab=subscription" className="w-full block">
                    <Button className={`w-full h-11 rounded-xl font-black text-xs transition-all active:scale-95 uppercase tracking-wide ${theme.btnClass}`}>
                      {plan.numericPrice === 0 ? "Get Started Free" : "Upgrade Plan"}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Secure Payments</div>
              <div className="text-xs text-slate-500">256-bit SSL encrypted via Razorpay</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Direct Lead Access</div>
              <div className="text-xs text-slate-500">Zero commission on client deals</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Dedicated Support</div>
              <div className="text-xs text-slate-500">Fast assistance for verified pros</div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
