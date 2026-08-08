"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Loader2, X, CreditCard } from "lucide-react";

/** Calls create-order then verifies with mock_signature (test mode, no Razorpay SDK needed) */
async function testPay(purpose: string, meta: Record<string, any>, amount: number) {
  const orderRes = await api.post("/payments/create-order", { purpose, ...meta });
  const { order_id } = orderRes.data;

  const verifyRes = await api.post("/payments/verify", {
    razorpay_order_id: order_id,
    razorpay_payment_id: "pay_test_" + Date.now(),
    razorpay_signature: "mock_signature",
  });

  return verifyRes.data;
}

export function SubscriptionTab({ currentPlan }: { currentPlan: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState<{ plan: any; price: number } | null>(null);
  const [paying, setPaying] = useState(false);

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

  const handlePay = async () => {
    if (!payModal) return;
    setPaying(true);
    try {
      await testPay("subscription", {
        subscription_plan_id: payModal.plan.id,
        billing_cycle: "yearly",
      }, payModal.price);
      alert(`✅ Subscribed to ${payModal.plan.name} successfully!`);
      setPayModal(null);
      window.location.reload();
    } catch (e: any) {
      alert(e.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading plans...</div>;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-[#0b1b36] to-slate-800 text-white border-0">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-300">Current Plan</h3>
              <div className="text-2xl font-bold uppercase">{currentPlan || "Starter"}</div>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg text-center backdrop-blur-sm">
            <div className="text-sm text-slate-300">Billing Cycle</div>
            <div className="font-semibold">{currentPlan?.toLowerCase() !== "starter" && currentPlan ? "Yearly" : "-"}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {plans.map(plan => {
          const isCurrent = currentPlan.toLowerCase() === plan.name.toLowerCase() || (currentPlan === '' && plan.slug === 'starter');
          const isMostPopular = plan.slug === 'business';
          const price = plan.price_yearly;
          const monthlyPrice = plan.price_monthly;

          let strikePrice = null;
          if (plan.slug === 'professional') strikePrice = "₹9,999";
          if (plan.slug === 'business') strikePrice = "₹23,999";
          if (plan.slug === 'premium') strikePrice = "₹49,999";

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
                <Button
                  className={`w-full ${isMostPopular && !isCurrent ? 'bg-orange-500 hover:bg-orange-600 text-white border-none' : ''}`}
                  variant={isCurrent ? "outline" : (isMostPopular ? "default" : "outline")}
                  disabled={isCurrent || plan.slug === 'starter'}
                  onClick={() => setPayModal({ plan, price })}
                >
                  {isCurrent ? 'Current Plan' : plan.slug === 'starter' ? 'Free' : 'Choose Plan'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Payment Confirmation Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Confirm Subscription</h2>
                <p className="text-sm text-slate-500 mt-1">You're upgrading to the {payModal.plan.name} plan</p>
              </div>
              <button onClick={() => setPayModal(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Plan</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">{payModal.plan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Billing Cycle</span>
                <span className="font-semibold text-slate-900 dark:text-white">Yearly</span>
              </div>
              <div className="border-t dark:border-slate-700 pt-3 flex justify-between items-center">
                <span className="text-slate-900 dark:text-white font-bold">Total</span>
                <span className="text-2xl font-extrabold text-orange-500">₹{payModal.price}</span>
              </div>
            </div>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base font-semibold"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><CreditCard className="h-5 w-5 mr-2" /> Pay ₹{payModal.price}</>
              )}
            </Button>
            <p className="text-xs text-center text-slate-400 mt-3">Secure payment powered by FindMyInterior</p>
          </div>
        </div>
      )}
    </div>
  );
}
