"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  Crown, Loader2, CreditCard, Zap, Rocket, BarChart3, 
  Gem, ShieldCheck, Lock, RotateCcw, Headphones, Sparkles, Check,
  Layers, Image as ImageIcon, TrendingUp, AlertCircle
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

export interface SubscriptionUsage {
  plan_name: string;
  plan_slug: string;
  is_active: boolean;
  expires_at: string | null;
  listings_used: number;
  listings_limit: number;
  images_used: number;
  images_limit: number;
  analytics_tier: "none" | "summary" | "full";
  features: string[];
}

interface PlanTier {
  id?: number;
  name: string;
  slug: string;
  badge: string;
  badgeColor: string;
  price: string;
  numericPrice: number;
  isPopular?: boolean;
  themeColor: "gray" | "purple" | "orange" | "green";
  icon: any;
  features: string[];
  subtitle?: string;
}

function normalizeFeatures(raw: any): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
      if (typeof parsed === "string") {
        const p2 = JSON.parse(parsed);
        if (Array.isArray(p2)) return p2.map(String);
      }
    } catch {
      return raw.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

const CANONICAL_STATIC_PLANS: PlanTier[] = [
  {
    name: "Starter",
    slug: "starter",
    badge: "FREE",
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    price: "Free",
    numericPrice: 0,
    subtitle: "Get started with basic listing features",
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

export function SubscriptionTab({ 
  currentPlan, 
  subscriptionUsage: initialUsage 
}: { 
  currentPlan?: any;
  subscriptionUsage?: SubscriptionUsage;
}) {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<PlanTier[]>(CANONICAL_STATIC_PLANS);
  const [usage, setUsage] = useState<SubscriptionUsage | null>(initialUsage || null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<PlanTier | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // 1. Fetch Plans
      const res = await api.get("/subscriptions/plans");
      const apiPlans: any[] = res.data.data || [];

      if (apiPlans.length > 0) {
        const activeOnly = apiPlans.filter((p: any) => p.is_active && !p.is_archived);
        const mapped: PlanTier[] = (activeOnly.length > 0 ? activeOnly : apiPlans).map((apiPlan: any) => {
          const slug = (apiPlan.slug || "").toLowerCase();
          const fallback = CANONICAL_STATIC_PLANS.find(c => c.slug === slug);
          const numPrice = Number(apiPlan.price_yearly || apiPlan.price_monthly || 0);
          const parsedFeatures = normalizeFeatures(apiPlan.features);

          return {
            id: apiPlan.id,
            name: apiPlan.name || fallback?.name || "Plan",
            slug: apiPlan.slug,
            badge: numPrice > 0 ? "1 YEAR" : "FREE",
            badgeColor: fallback?.badgeColor || "bg-blue-600 text-white",
            price: numPrice > 0 ? (apiPlan.formatted_price || `₹${numPrice.toLocaleString('en-IN')}.00`) : "Free",
            numericPrice: numPrice,
            isPopular: fallback?.isPopular || false,
            themeColor: fallback?.themeColor || "purple",
            icon: fallback?.icon || Gem,
            features: parsedFeatures.length > 0 ? parsedFeatures : (fallback?.features || []),
            subtitle: fallback?.subtitle,
          };
        });

        mapped.sort((a, b) => a.numericPrice - b.numericPrice);
        if (mapped.length >= 4) {
          setPlans(mapped);
        }
      }

      // 2. Fetch live dashboard usage if not passed via props
      if (!initialUsage) {
        const dashRes = await api.get("/user/dashboard");
        if (dashRes.data?.subscription_usage) {
          setUsage(dashRes.data.subscription_usage);
        }
      }
    } catch (e) {
      console.error("Failed to load subscription data:", e);
    } finally {
      setLoading(false);
    }
  };

  const activeSlug = usage?.plan_slug || (typeof currentPlan === "object" ? currentPlan?.plan?.slug : "starter");
  const activePlanName = usage?.plan_name || (typeof currentPlan === "object" ? currentPlan?.plan?.name : (currentPlan || "Starter (Free)"));

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="font-semibold text-sm">Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* ─── LIVE ENTITLEMENTS & USAGE DASHBOARD ────────────────────────── */}
      <div className="bg-[#0b1b36] text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
              <Crown className="w-9 h-9 text-[#ff6b00]" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                CURRENT SUBSCRIPTION
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase flex items-center gap-3">
                {activePlanName}
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeSlug === 'starter' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                  {activeSlug === 'starter' ? 'FREE TIER' : 'ACTIVE'}
                </span>
              </h2>
              {usage?.expires_at && (
                <div className="mt-1 text-xs text-slate-400">
                  Renews / Expires: <span className="text-slate-200 font-semibold">{new Date(usage.expires_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-right">
              <div className="text-[11px] text-slate-400 uppercase font-bold">Analytics Tier</div>
              <div className="text-sm font-black text-[#ff6b00] capitalize">
                {usage?.analytics_tier === 'full' ? 'Deep-Dive (Full)' : usage?.analytics_tier === 'summary' ? 'Summary Stats' : 'None (Gated)'}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time limits & usage progress */}
        {usage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Listings Limit */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="flex items-center gap-2 text-slate-300">
                  <Layers className="w-4 h-4 text-orange-400" />
                  Business Listings Usage
                </span>
                <span className="font-bold text-white">
                  {usage.listings_used} / {usage.listings_limit} used
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${usage.listings_used >= usage.listings_limit ? 'bg-amber-500' : 'bg-orange-500'}`}
                  style={{ width: `${Math.min(100, (usage.listings_used / Math.max(1, usage.listings_limit)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Portfolio Images Limit */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="flex items-center gap-2 text-slate-300">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  Portfolio Images Limit
                </span>
                <span className="font-bold text-white">
                  {usage.images_used} / {usage.images_limit} used
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${usage.images_used >= usage.images_limit ? 'bg-amber-500' : 'bg-purple-500'}`}
                  style={{ width: `${Math.min(100, (usage.images_used / Math.max(1, usage.images_limit)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 4 CANONICAL PLAN CARDS ─────────────────────────────────── */}
      <div>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose Your Growth Plan</h3>
          <p className="text-xs text-slate-500">Transparent pricing with instant activation and guaranteed entitlements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = (plan.slug === activeSlug);
            const isPopular = plan.isPopular;

            const getThemeStyles = () => {
              if (isPopular) {
                return {
                  cardBorder: "border-2 border-[#ff6b00] shadow-lg",
                  iconBg: "bg-orange-500 text-white",
                  accentColor: "text-[#ff6b00]",
                  btnClass: "bg-[#ff6b00] hover:bg-orange-600 text-white shadow-md shadow-orange-500/20",
                };
              }
              if (plan.themeColor === "purple") {
                return {
                  cardBorder: "border border-slate-200 dark:border-slate-800",
                  iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
                  accentColor: "text-purple-600 dark:text-purple-400",
                  btnClass: "bg-[#7c3aed] hover:bg-purple-700 text-white shadow-md shadow-purple-600/20",
                };
              }
              if (plan.themeColor === "green") {
                return {
                  cardBorder: "border border-slate-200 dark:border-slate-800",
                  iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
                  accentColor: "text-emerald-600 dark:text-emerald-400",
                  btnClass: "bg-[#16a34a] hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
                };
              }
              return {
                cardBorder: "border border-slate-200 dark:border-slate-800",
                iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                accentColor: "text-slate-700 dark:text-slate-300",
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

                  {/* Sparkle Divider */}
                  <div className="flex items-center justify-center gap-2 my-2 text-slate-300 dark:text-slate-700">
                    <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1"></div>
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 my-4 flex-1 text-xs text-slate-700 dark:text-slate-300">
                    {normalizeFeatures(plan.features).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
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
                  ) : plan.numericPrice === 0 ? (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full h-11 rounded-xl font-bold text-xs text-slate-500"
                    >
                      Default Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSelectedPlanForUpgrade(plan)}
                      className={`w-full h-11 rounded-xl font-black text-xs transition-all active:scale-95 uppercase tracking-wide ${theme.btnClass}`}
                    >
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── TRUST BADGES ───────────────────────────────────────────── */}
      <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <span>Secure Razorpay Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Instant Entitlement Activation</span>
        </div>
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-slate-500" />
          <span>Priority Verification Support</span>
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
                Unlock immediate verified lead access, category spotlight, and higher search placement.
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
              {selectedPlanForUpgrade.id ? (
                <CheckoutButton
                  planId={selectedPlanForUpgrade.id}
                  amount={selectedPlanForUpgrade.numericPrice}
                  label={selectedPlanForUpgrade.name}
                />
              ) : (
                <div className="text-center text-xs text-red-500 font-semibold py-2">
                  Plan sync in progress...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
