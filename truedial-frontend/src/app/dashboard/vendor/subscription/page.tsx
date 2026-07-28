"use client";

import React, { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { CheckCircle2, Star, Shield, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic",
      price_monthly: 999,
      price_yearly: 9999,
      features: ["5 Business Listings", "Basic Profile Page", "Standard Search Visibility"],
      recommended: false
    },
    {
      id: 2,
      name: "Professional",
      price_monthly: 1999,
      price_yearly: 19990,
      features: ["15 Business Listings", "Premium Profile Design", "Priority Search Ranking", "Lead Contact Unlocks (50/mo)"],
      recommended: true
    },
    {
      id: 3,
      name: "Enterprise",
      price_monthly: 4999,
      price_yearly: 49990,
      features: ["Unlimited Listings", "Featured Business Tag", "Highest Search Visibility", "Unlimited Lead Unlocks", "Dedicated Account Manager"],
      recommended: false
    }
  ]);

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (planId: number) => {
    if (!scriptLoaded) {
      alert("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    setLoadingPlan(planId);
    
    try {
      // 1. Create order on our backend
      const res = await TrueDialAPI.createPaymentOrder(planId, billingCycle);
      
      if (!res.success) {
        alert(res.message || "Failed to initiate payment.");
        setLoadingPlan(null);
        return;
      }

      // If mock payment, just refresh or alert
      if (res.data?.key === "mock_key") {
        alert("Mock payment successful (No Razorpay Keys). Your subscription is now active!");
        setLoadingPlan(null);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "TrueDial",
        description: `Upgrade to ${plans.find(p => p.id === planId)?.name} Plan`,
        order_id: res.data.order_id,
        handler: async function (response: any) {
          // 3. Verify payment signature on backend
          const verifyRes = await TrueDialAPI.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verifyRes.success) {
            alert("Payment successful! Your subscription has been upgraded.");
            window.location.reload();
          } else {
            alert(verifyRes.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: "Vendor Name", // Would fetch from auth state ideally
          email: "vendor@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#E8701A"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong initiating the payment.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Supercharge your TrueDial presence
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Choose a plan that fits your business needs. Upgrade at any time to get more leads and visibility.
        </p>
      </div>

      <div className="flex justify-center mt-6">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center shadow-sm">
          <button 
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              billingCycle === "monthly" 
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              billingCycle === "yearly" 
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Yearly <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative rounded-3xl p-8 bg-white dark:bg-[#0a1c3a]/50 border shadow-lg flex flex-col ${
              plan.recommended 
                ? "border-primary/50 shadow-primary/10 scale-105 z-10" 
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" /> MOST POPULAR
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  ₹{billingCycle === "yearly" ? plan.price_yearly.toLocaleString() : plan.price_monthly.toLocaleString()}
                </span>
                <span className="text-slate-500 font-medium">/{billingCycle === "yearly" ? "yr" : "mo"}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.recommended ? "text-primary" : "text-slate-400"}`} />
                  <span className="text-slate-600 dark:text-slate-300 text-sm leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => handleSubscribe(plan.id)}
              disabled={loadingPlan === plan.id}
              className={`w-full py-6 font-bold text-md rounded-xl ${
                plan.recommended 
                  ? "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20" 
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
              }`}
            >
              {loadingPlan === plan.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Upgrade to {plan.name} <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" /> Secure payments powered by Razorpay. 100% SSL encrypted.
      </div>
    </div>
  );
}
