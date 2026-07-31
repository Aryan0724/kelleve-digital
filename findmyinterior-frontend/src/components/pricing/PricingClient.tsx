"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, ShieldCheck, Zap, Sparkles, TrendingUp, HelpCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export interface Plan {
  id: number;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_listings: number;
  max_gallery_images: number;
  lead_unlocks_per_month: number;
  unlock_discount_percent: number;
  can_see_all_leads: boolean;
  is_featured_listing: boolean;
  is_active: boolean;
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: 1,
    name: "Basic",
    slug: "basic",
    price_monthly: 0,
    price_yearly: 0,
    features: [
      "1 Active Listing",
      "Up to 5 Gallery Images",
      "Contact Inquiry Form",
      "Basic Profile Page",
    ],
    max_listings: 1,
    max_gallery_images: 5,
    lead_unlocks_per_month: 0,
    unlock_discount_percent: 0,
    can_see_all_leads: false,
    is_featured_listing: false,
    is_active: true,
  },
  {
    id: 2,
    name: "Professional",
    slug: "professional",
    price_monthly: 999,
    price_yearly: 9990,
    features: [
      "3 Active Listings",
      "Up to 20 Gallery Images per Listing",
      "Priority in Search Results",
      "Verified Badge",
      "View All Project Requirements",
      "Inquiry Notifications (Email)",
      "WhatsApp Inquiry Alerts",
    ],
    max_listings: 3,
    max_gallery_images: 20,
    lead_unlocks_per_month: 0,
    unlock_discount_percent: 0,
    can_see_all_leads: true,
    is_featured_listing: false,
    is_active: true,
  },
  {
    id: 3,
    name: "Premium",
    slug: "premium",
    price_monthly: 4999,
    price_yearly: 49990,
    features: [
      "10 Active Listings",
      "Unlimited Gallery Images",
      "Featured Placement on Homepage",
      "Top of Search Results",
      "Gold Verified Badge",
      "View All Project Requirements",
      "Priority Inquiry Routing",
      "WhatsApp + Email Alerts",
      "Dedicated Account Support",
    ],
    max_listings: 10,
    max_gallery_images: 999,
    lead_unlocks_per_month: 0,
    unlock_discount_percent: 20,
    can_see_all_leads: true,
    is_featured_listing: true,
    is_active: true,
  },
  {
    id: 4,
    name: "Elite",
    slug: "elite",
    price_monthly: 14999,
    price_yearly: 149990,
    features: [
      "Unlimited Active Listings",
      "Unlimited Gallery Images",
      "Top 10 Ranking Guarantee",
      "Dedicated Account Manager",
      "50% Discount on Lead Unlocks",
      "Featured in Weekly Newsletter",
      "Custom SEO Profile Link",
      "WhatsApp + Email Alerts",
      "VIP Support",
    ],
    max_listings: 99,
    max_gallery_images: 999,
    lead_unlocks_per_month: 0,
    unlock_discount_percent: 50,
    can_see_all_leads: true,
    is_featured_listing: true,
    is_active: true,
  },
];

export function PricingClient() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await api.get("/subscription-plans");
        if (res.data?.data && res.data.data.length > 0) {
          setPlans(res.data.data);
        }
      } catch (e) {
        // Fallback to DEFAULT_PLANS
        console.warn("Using default plans fallback:", e);
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="space-y-12">
      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-semibold transition-colors ${billingCycle === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
          Monthly Billing
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className="relative inline-flex h-8 w-14 items-center rounded-full bg-indigo-600 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Toggle billing cycle"
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <span className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
          Yearly Billing
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-none text-[10px] font-bold px-2 py-0.5">
            SAVE 20%
          </Badge>
        </span>
      </div>

      {/* 4-Plan Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const isRecommended = plan.slug === "premium";
          const isElite = plan.slug === "elite";
          const price = billingCycle === "yearly" ? Math.round(plan.price_yearly / 12) : plan.price_monthly;

          return (
            <div
              key={plan.slug}
              className={`rounded-2xl border transition-all duration-300 relative flex flex-col justify-between overflow-hidden ${
                isRecommended
                  ? "bg-[#0b1b36] text-white border-indigo-500/50 shadow-2xl scale-[1.03] lg:-translate-y-2 dark:bg-slate-900 dark:border-indigo-500"
                  : isElite
                  ? "bg-gradient-to-b from-amber-500/10 via-white to-white border-amber-300/80 shadow-xl dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 dark:border-amber-700/50"
                  : "bg-white border-slate-200 shadow-md hover:shadow-lg dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              } p-6`}
            >
              {/* Top Recommended Banner */}
              {isRecommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-bl-xl shadow-md">
                  RECOMMENDED
                </div>
              )}
              {isElite && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-600 to-yellow-500 text-white text-[11px] font-extrabold tracking-wider uppercase px-3.5 py-1 rounded-bl-xl shadow-md">
                  VIP TIER
                </div>
              )}

              <div>
                {/* Title & Subtitle */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    {isRecommended && <Star className="w-5 h-5 text-orange-400 fill-orange-400" />}
                    {isElite && <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />}
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 ${isRecommended ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                    {plan.slug === "basic" && "Perfect for new professionals getting started."}
                    {plan.slug === "professional" && "For active professionals wanting more reach."}
                    {plan.slug === "premium" && "For growing businesses seeking maximum leads."}
                    {plan.slug === "elite" && "Ultimate VIP reach & top 10 ranking guarantee."}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className={`text-xs font-medium ${isRecommended ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                      /month
                    </span>
                  </div>
                  {billingCycle === "yearly" && plan.price_yearly > 0 && (
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      Billed ₹{plan.price_yearly.toLocaleString("en-IN")} yearly
                    </div>
                  )}
                </div>

                {/* Dynamic Backend Enforcement Badges */}
                <div className="mb-6 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Backend Limits & Perks
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className={`text-xs ${isRecommended ? "bg-white/10 text-white border-white/20" : "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                      {plan.max_listings >= 99 ? "Unlimited" : plan.max_listings} {plan.max_listings === 1 ? "Listing" : "Listings"}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${isRecommended ? "bg-white/10 text-white border-white/20" : "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                      {plan.max_gallery_images >= 999 ? "Unlimited" : plan.max_gallery_images} Photos
                    </Badge>
                    {plan.unlock_discount_percent > 0 && (
                      <Badge className="text-xs bg-indigo-500 text-white border-none font-bold">
                        {plan.unlock_discount_percent}% Off Unlocks
                      </Badge>
                    )}
                    {plan.can_see_all_leads && (
                      <Badge className="text-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-none">
                        See All Leads
                      </Badge>
                    )}
                    {plan.is_featured_listing && (
                      <Badge className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 border-none">
                        Priority Search
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isRecommended
                            ? "text-orange-400"
                            : isElite
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-indigo-600 dark:text-indigo-400"
                        }`}
                      />
                      <span className={isRecommended ? "text-slate-200" : "text-slate-700 dark:text-slate-300"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link href="/dashboard" className="block w-full">
                  <Button
                    className={`w-full h-11 text-sm font-semibold rounded-xl shadow-md transition-transform active:scale-[0.98] ${
                      isRecommended
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-none"
                        : isElite
                        ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                    }`}
                  >
                    {plan.price_monthly === 0 ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
