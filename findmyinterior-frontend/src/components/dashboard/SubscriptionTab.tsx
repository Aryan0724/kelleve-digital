"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Loader2, CreditCard, Zap } from "lucide-react";
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

// Maps every role slug to a subscription plan category
const ROLE_TO_CATEGORY: Record<string, "worker" | "professional" | "business"> = {
  // Professional / Designer / Consultant
  interior_designer: "professional",
  interior_company: "professional",
  architect: "professional",
  builder: "professional",
  contractor: "professional",
  interior_contractor: "professional",
  civil_contractor: "professional",
  turnkey_contractor: "professional",
  renovation_contractor: "professional",
  demolition_contractor: "professional",
  modular_kitchen_designer: "professional",
  wardrobe_designer: "professional",
  "2d_3d_designer": "professional",
  space_planner: "professional",
  structural_engineer: "professional",
  civil_engineer: "professional",
  mep_consultant: "professional",
  landscape_designer: "professional",
  vastu_consultant: "professional",
  interior_project_consultant: "professional",
  real_estate_developer: "professional",
  pest_control: "professional",
  deep_cleaning: "professional",
  waterproofing: "professional",
  home_renovation: "professional",
  cctv_security: "professional",
  home_automation: "professional",
  solar_installation: "professional",
  ac_installation: "professional",
  packers_movers: "professional",
  interior_material_transport: "professional",
  equipment_rental: "professional",
  // Supplier / Dealer / Business
  material_supplier: "business",
  supplier: "business",
  business: "business",
  plywood_dealer: "business",
  laminate_dealer: "business",
  tile_dealer: "business",
  marble_granite_dealer: "business",
  paint_dealer: "business",
  hardware_supplier: "business",
  lighting_supplier: "business",
  electrical_supplier: "business",
  sanitary_bathroom_supplier: "business",
  modular_kitchen_material_supplier: "business",
  glass_supplier: "business",
  acp_aluminium_supplier: "business",
  furniture_supplier: "business",
  door_window_supplier: "business",
  // Workers / Skilled
  worker: "worker",
  skilled_worker: "worker",
  carpenter: "worker",
  electrician: "worker",
  plumber: "worker",
  painter: "worker",
  pop_false_ceiling_worker: "worker",
  tile_marble_fitter: "worker",
  granite_installer: "worker",
  fabricator: "worker",
  aluminium_fabricator: "worker",
  glass_installer: "worker",
  welder: "worker",
  polish_worker: "worker",
  wallpaper_installer: "worker",
};

function getRoleCategory(user: any): "worker" | "professional" | "business" {
  // user.roles may be an array of slugs (from dashboard) or role objects
  const rolesRaw = user?.roles;
  const roleSlugs: string[] = Array.isArray(rolesRaw)
    ? rolesRaw.map((r: any) => (typeof r === "string" ? r : r?.slug ?? ""))
    : [];

  // Also check user.role (single string from UserResource)
  const primaryRole: string = user?.role ?? "";

  // Check all available slugs
  const allSlugs = [...new Set([primaryRole, ...roleSlugs].filter(Boolean))];

  for (const slug of allSlugs) {
    const cat = ROLE_TO_CATEGORY[slug];
    if (cat) return cat;
  }

  return "worker"; // safe default
}

const PLAN_ORDER = ["Starter", "Growth", "Professional", "Elite", "Elite Business"];

export function SubscriptionTab({ currentPlan }: { currentPlan: any }) {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<any>(null);
  const [isProcessingWallet, setIsProcessingWallet] = useState(false);

  const currentPlanName =
    typeof currentPlan === "string"
      ? currentPlan
      : currentPlan?.plan?.name ?? currentPlan?.name ?? "Basic (Free)";

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/subscriptions/plans");
      const allPlans: any[] = res.data.data || [];

      const category = getRoleCategory(user);

      // Strict filter — only show plans for this user's category
      const filtered = allPlans.filter(
        (p) => p.target_role_category === category
      );

      // Sort by a logical order
      const sorted = filtered.sort((a, b) => {
        const ai = PLAN_ORDER.indexOf(a.name);
        const bi = PLAN_ORDER.indexOf(b.name);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });

      setPlans(sorted);
    } catch (e) {
      console.error("Failed to fetch subscription plans:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithWallet = async (plan: any) => {
    setIsProcessingWallet(true);
    try {
      const response = await api.post("/payments/pay-with-wallet", {
        purpose: "subscription",
        subscription_plan_id: plan.id,
        billing_cycle: "yearly",
      });

      if (response.data.success) {
        toast.success("Successfully upgraded subscription using wallet!");
        // Reload page to reflect new subscription state
        window.location.reload();
      }
    } catch (e: any) {
      console.error(e);
      const msg =
        e.response?.data?.message ?? "Failed to process wallet payment.";
      toast.error(msg);
    } finally {
      setIsProcessingWallet(false);
    }
  };

  if (loading)
    return (
      <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading plans...
      </div>
    );

  if (plans.length === 0)
    return (
      <div className="p-12 text-center text-slate-500">
        <Crown className="h-12 w-12 mx-auto mb-4 text-slate-300" />
        <p className="font-medium">No subscription plans found for your account type.</p>
        <p className="text-sm mt-1">Please contact support if you believe this is an error.</p>
      </div>
    );

  // Find the plan the user is currently subscribed to
  const currentPlanObject =
    plans.find(
      (p) => p.name.toLowerCase() === currentPlanName.toLowerCase()
    ) ?? null;

  // "Most popular" = the 3rd plan (index 2) in the sorted list, or Growth if only 2
  const mostPopularPlan = plans[Math.min(2, plans.length - 1)];

  return (
    <div className="space-y-6">
      {/* Current Plan Banner */}
      <Card className="bg-gradient-to-r from-[#0b1b36] to-slate-800 text-white border-0">
        <CardContent className="p-8 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="h-20 w-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <Crown className="h-10 w-10 text-orange-500 drop-shadow-md" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-1">
                Current Plan
              </h3>
              <div className="text-3xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                {currentPlanName}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="bg-white/10 px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm border border-white/5 flex items-center gap-2">
                  <span className="text-slate-400">Billing:</span>
                  <span className="font-semibold text-white">
                    {currentPlanName.toLowerCase().includes("basic") ||
                    currentPlanName.toLowerCase().includes("free")
                      ? "Free"
                      : "Yearly"}
                  </span>
                </div>
                {currentPlanObject?.is_featured_listing && (
                  <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm flex items-center font-medium">
                    Featured Listing Enabled
                  </div>
                )}
              </div>
            </div>
          </div>

          {currentPlanObject?.features?.length > 0 && (
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 w-full lg:w-1/2">
              <h4 className="text-sm font-semibold text-slate-300 mb-4 border-b border-white/10 pb-2">
                Your Active Benefits
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {currentPlanObject.features.map((f: string, i: number) => (
                  <li key={i} className="flex text-sm text-slate-200 items-start">
                    <CheckCircle className="h-4 w-4 mr-2 shrink-0 mt-0.5 text-green-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div className={`grid grid-cols-1 gap-6 items-stretch ${plans.length <= 2 ? 'md:grid-cols-2' : plans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
        {plans.map((plan) => {
          const isCurrent =
            currentPlanName.toLowerCase() === plan.name.toLowerCase();
          const isMostPopular = plan.id === mostPopularPlan?.id;
          const price = plan.price_yearly;
          const monthlyPrice = plan.price_monthly;
          const isFree = !price || Number(price) === 0;

          return (
            <Card
              key={plan.id}
              className={`flex flex-col relative overflow-hidden transition-all duration-200 ${
                isCurrent
                  ? "ring-2 ring-orange-500 shadow-lg z-10"
                  : "hover:shadow-md border"
              } ${
                isMostPopular && !isCurrent
                  ? "border-orange-400 shadow-md md:-translate-y-1"
                  : ""
              }`}
            >
              {isMostPopular && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider flex items-center gap-1">
                  <Zap className="h-3 w-3" /> MOST POPULAR
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 inset-x-0 h-1 bg-orange-500" />
              )}

              <CardHeader className="text-center pb-4 mt-2">
                <Badge
                  variant="outline"
                  className={`mx-auto mb-2 capitalize ${
                    isMostPopular ? "border-orange-500 text-orange-600" : ""
                  }`}
                >
                  {plan.name}
                </Badge>

                {isFree ? (
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    Free
                  </div>
                ) : (
                  <>
                    <div
                      className={`text-4xl font-extrabold ${
                        isMostPopular
                          ? "text-orange-500"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      ₹{price?.toLocaleString("en-IN")}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      / year
                    </p>
                    {monthlyPrice > 0 && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        ₹{monthlyPrice?.toLocaleString("en-IN")} / month
                      </p>
                    )}
                  </>
                )}
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2.5">
                  {(plan.features || []).map((f: string, i: number) => (
                    <li
                      key={i}
                      className="flex text-sm text-slate-600 dark:text-slate-300 items-start"
                    >
                      <CheckCircle
                        className={`h-4 w-4 mr-2 shrink-0 mt-0.5 ${
                          isMostPopular ? "text-orange-500" : "text-slate-400"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto pt-4">
                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>
                    ✓ Current Plan
                  </Button>
                ) : isFree ? (
                  <Button className="w-full" variant="outline" disabled>
                    Free Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => setSelectedPlanForUpgrade(plan)}
                  >
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Payment Method Dialog */}
      <Dialog
        open={!!selectedPlanForUpgrade}
        onOpenChange={(open) => !open && setSelectedPlanForUpgrade(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Upgrade</DialogTitle>
            <DialogDescription>
              Choose a payment method to upgrade to the{" "}
              <strong>{selectedPlanForUpgrade?.name}</strong> plan at ₹
              {selectedPlanForUpgrade?.price_yearly?.toLocaleString("en-IN")}/year.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Wallet Option */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pay via Wallet</p>
                  <p className="text-xs text-slate-500">
                    Available: ₹{(user?.wallet_balance ?? 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handlePayWithWallet(selectedPlanForUpgrade)}
                disabled={
                  isProcessingWallet ||
                  Number(user?.wallet_balance ?? 0) <
                    Number(selectedPlanForUpgrade?.price_yearly ?? 0)
                }
                className="bg-orange-600 hover:bg-orange-700 shrink-0"
              >
                {isProcessingWallet ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Pay ₹{selectedPlanForUpgrade?.price_yearly?.toLocaleString("en-IN")}
              </Button>
            </div>

            {Number(user?.wallet_balance ?? 0) <
              Number(selectedPlanForUpgrade?.price_yearly ?? 0) && (
              <p className="text-xs text-amber-600 dark:text-amber-400 -mt-2 px-1">
                Insufficient wallet balance. Add ₹
                {(
                  Number(selectedPlanForUpgrade?.price_yearly ?? 0) -
                  Number(user?.wallet_balance ?? 0)
                ).toLocaleString("en-IN")}{" "}
                more to use this option.
              </p>
            )}

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
                  Or pay online
                </span>
              </div>
            </div>

            {/* Razorpay Option */}
            {selectedPlanForUpgrade && (
              <div className="w-full">
                <CheckoutButton
                  planId={selectedPlanForUpgrade.id}
                  amount={selectedPlanForUpgrade.price_yearly}
                  label="Pay via Razorpay (Card / UPI / Net Banking)"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
