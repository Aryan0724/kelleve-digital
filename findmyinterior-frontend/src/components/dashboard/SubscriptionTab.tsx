"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  Crown, Loader2, CreditCard, Zap, Rocket, BarChart3, 
  Gem, ShieldCheck, Lock, RotateCcw, Headphones, Sparkles, Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckoutButton } from "@/components/payments/CheckoutButton";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "react-toastify";

interface PlanTier {
  id?: number;
  name: string;
  slug: string;
  badge: string;
  badgeColor: string;
  price: string;
  numericPrice: number;
  isPopular?: boolean;
  themeColor: "purple" | "blue" | "orange" | "green" | "gray";
  icon: any;
  features: string[];
  subtitle?: string;
}

const STATIC_PLANS: PlanTier[] = [
  {
    name: "Starter",
    slug: "starter",
    badge: "FREE",
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    price: "Free",
    numericPrice: 0,
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
    slug: "quickstart",
    badge: "3 MONTHS",
    badgeColor: "bg-purple-600 text-white",
    price: "₹4,999.00",
    numericPrice: 4999,
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
    slug: "growthplus",
    badge: "6 MONTHS",
    badgeColor: "bg-blue-600 text-white",
    price: "₹9,999.00",
    numericPrice: 9999,
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
    slug: "probusiness",
    badge: "1 YEAR",
    badgeColor: "bg-orange-500 text-white",
    price: "₹17,999.00",
    numericPrice: 17999,
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
    slug: "elitebusiness",
    badge: "1 YEAR",
    badgeColor: "bg-emerald-600 text-white",
    price: "₹35,999.00",
    numericPrice: 35999,
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

export function SubscriptionTab({ currentPlan }: { currentPlan: any }) {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<any>(null);

  const currentPlanName =
    typeof currentPlan === "string"
      ? currentPlan
      : currentPlan?.plan?.name ?? currentPlan?.name ?? "Basic (Free)";

  const determineUserCategory = (): "worker" | "business" | "professional" => {
    const role = (user?.role || "").toLowerCase();
    const profType = (user?.professional_type || "").toLowerCase();
    const allRoles = (user?.roles || []).map((r: any) => (typeof r === "string" ? r : r.slug || r.name || "").toLowerCase());

    const isWorker = 
      role.includes("worker") || 
      allRoles.some((r: string) => r.includes("worker") || r === "carpenter" || r === "electrician" || r === "plumber" || r === "painter") ||
      profType.includes("worker");

    if (isWorker) return "worker";

    const isBusiness = 
      role.includes("business") || 
      role.includes("supplier") || 
      role.includes("builder") ||
      allRoles.some((r: string) => r.includes("business") || r.includes("supplier") || r.includes("builder"));

    if (isBusiness) return "business";

    return "professional";
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/subscriptions/plans");
      const apiPlans: any[] = res.data.data || [];
      const userCategory = determineUserCategory();

      // Filter plans for this user's category (or fallback to all active plans if category not found)
      const categoryPlans = apiPlans.filter((p: any) => {
        const target = (p.target_role_category || "").toLowerCase();
        return target === userCategory || target === "" || !p.target_role_category;
      });

      const candidatePlans = categoryPlans.length > 0 ? categoryPlans : apiPlans;

      // Map backend plans into UI Tier objects
      // Tiers in DB: Starter (₹0), Growth (₹4,499), Professional (₹8,999), Elite (₹17,999 or ₹35,999)
      const UI_TIER_CONFIGS: Record<string, Partial<PlanTier>> = {
        starter: {
          badge: "FREE",
          badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
          subtitle: "Get started with basic features",
          themeColor: "gray",
          icon: Rocket,
        },
        growth: {
          badge: "1 YEAR",
          badgeColor: "bg-purple-600 text-white",
          subtitle: "Ideal for growing businesses",
          themeColor: "purple",
          icon: Zap,
        },
        professional: {
          badge: "1 YEAR",
          badgeColor: "bg-orange-500 text-white",
          subtitle: "Most popular for top designers",
          isPopular: true,
          themeColor: "orange",
          icon: Gem,
        },
        elite: {
          badge: "1 YEAR",
          badgeColor: "bg-emerald-600 text-white",
          subtitle: "Maximum visibility & instant leads",
          themeColor: "green",
          icon: ShieldCheck,
        },
      };

      const resolvedPlans: PlanTier[] = candidatePlans.map((apiPlan: any) => {
        const slug = (apiPlan.slug || "").toLowerCase();
        let tierKey = "starter";
        if (slug.includes("elite")) tierKey = "elite";
        else if (slug.includes("professional") || slug.includes("pro")) tierKey = "professional";
        else if (slug.includes("growth")) tierKey = "growth";
        else if (slug.includes("quickstart")) tierKey = "growth";

        const config = UI_TIER_CONFIGS[tierKey] || UI_TIER_CONFIGS.starter;
        const numPrice = Number(apiPlan.price_yearly || apiPlan.price || 0);

        return {
          id: apiPlan.id,
          name: apiPlan.name || "Plan",
          slug: apiPlan.slug,
          badge: config.badge || "1 YEAR",
          badgeColor: config.badgeColor || "bg-blue-600 text-white",
          price: numPrice > 0 ? (apiPlan.formatted_price || `₹${numPrice.toLocaleString('en-IN')}`) : "Free",
          numericPrice: numPrice,
          isPopular: config.isPopular || false,
          themeColor: config.themeColor || "blue",
          icon: config.icon || Gem,
          features: (apiPlan.features && apiPlan.features.length > 0) ? apiPlan.features : [
            "Verified Business Profile",
            "Priority Lead Notifications",
            "Portfolio Showcase",
            "Search Visibility Boost"
          ],
          subtitle: config.subtitle,
        };
      });

      // Sort by price ascending
      resolvedPlans.sort((a, b) => a.numericPrice - b.numericPrice);

      if (resolvedPlans.length > 0) {
        setPlans(resolvedPlans);
      } else {
        setPlans(STATIC_PLANS);
      }
    } catch (e) {
      console.error("Failed to fetch subscription plans:", e);
      setPlans(STATIC_PLANS);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="font-semibold text-sm">Loading subscription plans...</p>
      </div>
    );
  }

  const isCurrentActive = (plan: PlanTier) => {
    const currentId = typeof currentPlan === "object" ? (currentPlan?.plan?.id ?? currentPlan?.id) : undefined;
    if (currentId && plan.id && currentId === plan.id) {
      return true;
    }

    const normCurrent = (currentPlanName || "").toLowerCase();
    const normPlanName = (plan.name || "").toLowerCase();
    const normPlanSlug = (plan.slug || "").toLowerCase();

    if (normCurrent.includes("basic") || normCurrent.includes("free")) {
      return normPlanSlug.includes("starter") || normPlanName.includes("starter");
    }

    return normCurrent.includes(normPlanName) || normCurrent.includes(normPlanSlug);
  };

  return (
    <div className="space-y-6">
      
      {/* ─── CURRENT PLAN TOP BANNER ─────────────────────────────────── */}
      <div className="bg-[#0b1b36] text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
            <Crown className="w-9 h-9 text-[#ff6b00]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              CURRENT PLAN
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
              {currentPlanName.toUpperCase()}
            </h2>
            <div className="mt-2 inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-slate-300 border border-white/10">
              Billing: <span className="text-white ml-1 font-bold">{currentPlanName.toLowerCase().includes("free") || currentPlanName.toLowerCase().includes("basic") ? "Free" : "Active"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs md:text-sm text-slate-300 font-medium w-full md:w-auto text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-slate-700/60">
          <div className="flex items-center md:justify-end gap-2 text-slate-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Perfect for getting started</span>
          </div>
          <div className="flex items-center md:justify-end gap-2 text-slate-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Upgrade anytime to unlock more features</span>
          </div>
        </div>
      </div>

      {/* ─── 5-TIER PRICING CARDS GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = isCurrentActive(plan);
          const isPopular = plan.isPopular;

          // Theme styling helper
          const getThemeStyles = () => {
            if (isPopular) {
              return {
                cardBorder: "border-2 border-[#ff6b00] shadow-lg",
                iconBg: "bg-orange-500 text-white",
                accentColor: "text-[#ff6b00]",
                dotColor: "bg-[#ff6b00]",
                btnClass: "bg-[#ff6b00] hover:bg-orange-600 text-white shadow-md shadow-orange-500/20",
              };
            }
            if (plan.themeColor === "purple") {
              return {
                cardBorder: "border border-slate-200 dark:border-slate-800",
                iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
                accentColor: "text-purple-600 dark:text-purple-400",
                dotColor: "bg-purple-600",
                btnClass: "bg-[#7c3aed] hover:bg-purple-700 text-white shadow-md shadow-purple-600/20",
              };
            }
            if (plan.themeColor === "blue") {
              return {
                cardBorder: "border border-slate-200 dark:border-slate-800",
                iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
                accentColor: "text-blue-600 dark:text-blue-400",
                dotColor: "bg-blue-600",
                btnClass: "bg-[#0284c7] hover:bg-sky-700 text-white shadow-md shadow-sky-600/20",
              };
            }
            if (plan.themeColor === "green") {
              return {
                cardBorder: "border border-slate-200 dark:border-slate-800",
                iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
                accentColor: "text-emerald-600 dark:text-emerald-400",
                dotColor: "bg-emerald-600",
                btnClass: "bg-[#16a34a] hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
              };
            }
            return {
              cardBorder: "border border-slate-200 dark:border-slate-800",
              iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
              accentColor: "text-slate-700",
              dotColor: "bg-slate-500",
              btnClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
            };
          };

          const theme = getThemeStyles();

          return (
            <div
              key={plan.slug}
              className={`bg-white dark:bg-slate-900 rounded-2xl flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${theme.cardBorder}`}
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

                {/* Decorative Sparkle Divider */}
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
                {isCurrent ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full h-11 rounded-xl font-bold text-xs bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSelectedPlanForUpgrade(plan)}
                    className={`w-full h-11 rounded-xl font-black text-xs transition-all active:scale-95 uppercase tracking-wide ${theme.btnClass}`}
                  >
                    Choose Plan
                  </Button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ─── BOTTOM TRUST BADGES ────────────────────────────────────── */}
      <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <span>Secure Payments</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Cancel Anytime</span>
        </div>
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-slate-500" />
          <span>24/7 Support</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span>Money Back Guarantee</span>
        </div>
      </div>

      {/* ─── UPGRADE PAYMENT DIALOG ──────────────────────────────────── */}
      {selectedPlanForUpgrade && (
        <Dialog open={!!selectedPlanForUpgrade} onOpenChange={() => setSelectedPlanForUpgrade(null)}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-500" />
                Upgrade to {selectedPlanForUpgrade.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Unlock higher search visibility, lead notifications, and verified enterprise badges.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Plan Duration:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedPlanForUpgrade.badge}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount:</span>
                <span className="text-lg text-emerald-600 dark:text-emerald-400">{selectedPlanForUpgrade.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Razorpay Online Checkout */}
              {selectedPlanForUpgrade.id ? (
                <CheckoutButton
                  planId={selectedPlanForUpgrade.id}
                  amount={selectedPlanForUpgrade.numericPrice}
                  label={selectedPlanForUpgrade.name}
                />
              ) : (
                <div className="text-center text-xs text-red-500 font-semibold py-2">
                  Plan configuration sync in progress...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
