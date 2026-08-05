"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Star } from "lucide-react";

export function SubscriptionTab({ currentPlan }: { currentPlan: string }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planId: number) => {
    try {
      const res = await api.post("/payments/create-order", {
        purpose: "subscription",
        subscription_plan_id: planId,
        billing_cycle: "yearly",
      });

      const { order_id, amount, currency, payment_id } = res.data;
      
      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

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
                
                <CardTitle className={`text-4xl font-extrabold ${isMostPopular ? 'text-orange-500' : 'text-slate-900'}`}>
                  ₹{price}
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1 font-medium">/ year</p>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {(plan.features || []).map((f: string, i: number) => (
                    <li key={i} className="flex text-sm text-slate-600 items-start">
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
                  disabled={isCurrent}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isCurrent ? 'Current Plan' : 'Choose Plan'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
