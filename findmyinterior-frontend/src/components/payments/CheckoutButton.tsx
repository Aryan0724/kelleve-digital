"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

// Load Razorpay Script dynamically
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

import { toast } from "react-toastify";

export function CheckoutButton({ 
  planId, 
  amount, 
  label,
  buttonText,
  className
}: { 
  planId: number; 
  amount: number; 
  label?: string;
  buttonText?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const displayRazorpay = async () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const { data } = await api.post("/payments/create-order", {
        purpose: "subscription",
        subscription_plan_id: planId,
        billing_cycle: "yearly"
      });

      const orderId = data.order_id;
      const amountInPaise = data.amount;

      // 2. Load Razorpay Script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you offline?");
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TRfrjzfAExcLjs",
        amount: amountInPaise.toString(),
        currency: "INR",
        name: "FindMyInterior",
        description: `Upgrade to ${label || 'Subscription'}`,
        order_id: orderId,
        handler: async function (response: any) {
          // 4. Verify payment on backend
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment Successful! Your subscription is now active.");
            window.location.reload();
          } catch (err) {
            toast.error("Payment verification failed! Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#ff6b00",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || error?.message || "Payment Gateway Error";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const numAmount = Number(amount) || 0;

  if (numAmount <= 0) {
    return (
      <Button 
        disabled 
        variant="outline"
        className="w-full h-11 text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
      >
        Free Plan Included
      </Button>
    );
  }

  return (
    <Button 
      onClick={displayRazorpay} 
      disabled={loading} 
      className={className || "w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black h-12 text-sm rounded-xl shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"}
    >
      {loading ? "Connecting Gateway..." : (buttonText || `Pay with Razorpay / UPI (₹${numAmount.toLocaleString('en-IN')})`)}
    </Button>
  );
}
