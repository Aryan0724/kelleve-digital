"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Wallet, Crown } from "lucide-react";

export function SubscriptionTab({ currentPlan }: { currentPlan: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

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

  const handleSubscribe = async (planId: number) => {
    try {
      const res = await api.post("/payments/create-order", {
        purpose: "subscription",
        subscription_plan_id: planId,
        billing_cycle: billingCycle,
      });

      const { order_id, amount, currency, payment_id } = res.data;
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", 
        amount: amount,
        currency: currency,
        name: "Find My Interior",
        description: "Subscription Upgrade",
        order_id: order_id,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Subscription successful!");
            window.location.reload();
          } catch (e: any) {
            alert(e.response?.data?.message || "Payment verification failed.");
          }
        },
        theme: {
          color: "#ea580c"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to initialize payment");
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading plans...</div>;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white border-0">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-indigo-200">Current Plan</h3>
              <div className="text-2xl font-bold">{currentPlan || "Basic (Free)"}</div>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg text-center backdrop-blur-sm">
            <div className="text-sm text-indigo-200">Billing Cycle</div>
            <div className="font-semibold">{currentPlan !== "Basic (Free)" ? billingCycle : "-"}</div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly billing
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-orange-600 shadow-sm text-white' : 'text-slate-500'}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly billing
              <span className="bg-orange-200 text-orange-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">SAVE 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => {
            const isCurrent = currentPlan.toLowerCase() === plan.name.toLowerCase();
            const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
            
            return (
              <Card key={plan.id} className={`flex flex-col relative overflow-hidden transition-all ${isCurrent ? 'ring-2 ring-orange-500 scale-105 shadow-lg' : 'hover:shadow-md border'}`}>
                {isCurrent && <div className="absolute top-0 inset-x-0 h-1 bg-orange-500"></div>}
                <CardHeader className="text-center pb-4">
                  <Badge variant="outline" className="mx-auto mb-2 capitalize">{plan.name}</Badge>
                  <CardTitle className="text-4xl font-bold">
                    ₹{price}
                  </CardTitle>
                  <p className="text-sm text-slate-500">per {billingCycle === 'yearly' ? 'year' : 'month'}</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {(plan.features || []).map((f: string, i: number) => (
                      <li key={i} className="flex text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={isCurrent ? "outline" : "default"} 
                    disabled={isCurrent}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isCurrent ? 'Current Plan' : 'Upgrade Now'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
