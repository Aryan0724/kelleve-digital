"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Loader2, X, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckoutButton } from "@/components/payments/CheckoutButton";



export function SubscriptionTab({ currentPlan }: { currentPlan: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradePlan, setUpgradePlan] = useState<any>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/subscriptions/plans");
      setPlans(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeRequest = (plan: any) => {
    // Left empty or can be removed if not needed.
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading plans...</div>;

  const currentPlanObject = plans.find(p => p.name.toLowerCase() === (currentPlan || 'basic').toLowerCase()) || plans.find(p => p.slug === 'basic') || null;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-[#0b1b36] to-slate-800 text-white border-0">
        <CardContent className="p-8 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="h-20 w-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <Crown className="h-10 w-10 text-orange-500 drop-shadow-md" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-1">Current Plan</h3>
              <div className="text-3xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                {currentPlan || "Basic"}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="bg-white/10 px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm border border-white/5 flex items-center gap-2">
                  <span className="text-slate-400">Billing:</span>
                  <span className="font-semibold text-white">{currentPlan?.toLowerCase() !== "basic" && currentPlan ? "Yearly" : "Free"}</span>
                </div>
                {currentPlanObject?.is_featured_listing && (
                  <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm flex items-center font-medium">
                    Featured Listing Enabled
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {currentPlanObject && currentPlanObject.features && currentPlanObject.features.length > 0 && (
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 w-full lg:w-1/2">
              <h4 className="text-sm font-semibold text-slate-300 mb-4 border-b border-white/10 pb-2">Your Active Benefits</h4>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map(plan => {
          const isCurrent = currentPlan.toLowerCase() === plan.name.toLowerCase() || (currentPlan === '' && plan.slug === 'basic');
          const isMostPopular = plan.slug === 'professional';
          const price = plan.price_yearly;
          const monthlyPrice = plan.price_monthly;

          let strikePrice = null;
          if (plan.slug === 'professional') strikePrice = "₹14,999";
          if (plan.slug === 'premium') strikePrice = "₹34,999";

          return (
            <Card key={plan.id} className={`flex flex-col relative overflow-hidden transition-all ${isCurrent ? 'ring-2 ring-orange-500 scale-105 shadow-lg z-10' : 'hover:shadow-md border'} ${isMostPopular && !isCurrent ? 'border-orange-500 shadow-md md:-translate-y-2' : ''}`}>
              {isMostPopular && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">
                  MOST POPULAR
                </div>
              )}
              {isCurrent && <div className="absolute top-0 inset-x-0 h-1 bg-orange-500"></div>}

              <CardHeader className="text-center pb-4 mt-2">
                <Badge variant="outline" className={`mx-auto mb-2 capitalize ${isMostPopular ? 'border-orange-500 text-orange-600' : ''}`}>
                  {plan.name}
                </Badge>

                {strikePrice && (
                  <div className="text-sm font-bold text-slate-400 line-through">{strikePrice} /yr</div>
                )}

                <div className={`text-4xl font-extrabold ${isMostPopular ? 'text-orange-500' : 'text-slate-900 dark:text-white'}`}>
                  ₹{price}
                </div>
                <p className="text-sm text-slate-500 mt-1 font-medium">/ year</p>
                {monthlyPrice > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">₹{monthlyPrice} / month</p>
                )}
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {(plan.features || []).map((f: string, i: number) => (
                    <li key={i} className="flex text-sm text-slate-600 dark:text-slate-300 items-start">
                      <CheckCircle className={`h-4 w-4 mr-2 shrink-0 mt-0.5 ${isMostPopular ? 'text-orange-500' : 'text-slate-400'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                ) : plan.slug === 'basic' ? (
                  <Button className="w-full" variant="outline" disabled>Free</Button>
                ) : (
                  <div className="w-full">
                    <CheckoutButton planId={plan.id} amount={price} label={`Upgrade to ${plan.name}`} />
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
