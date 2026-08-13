"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Loader2 } from "lucide-react";

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function TestRazorpayPage() {
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to test payment.");
      return;
    }

    const amt = Number(amount);
    if (amt < 100) {
      alert("Minimum amount is ₹100");
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const { data } = await api.post("/payments/create-order", {
        purpose: "wallet_recharge",
        amount: amt,
      });

      const orderId = data.order_id;
      const amountInPaise = data.amount;

      // 2. Load Razorpay Script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        alert("Razorpay SDK failed to load. Are you offline?");
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountInPaise.toString(),
        currency: "INR",
        name: "FindMyInterior Test",
        description: `Test Payment: ₹${amt}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert(`✅ Payment of ₹${amt} was successfully verified!`);
          } catch (err: any) {
            alert(err.response?.data?.message || "Payment verification failed!");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#ea580c",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment Failed. " + response.error.description);
      });
      paymentObject.open();
    } catch (e: any) {
      alert(e.response?.data?.message || "Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
      <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Test Razorpay Integration</h1>
      
      {!user && (
        <div className="p-4 mb-4 text-sm text-amber-800 rounded-lg bg-amber-50 dark:bg-slate-800 dark:text-amber-400">
          You are currently not logged in. Please log in first to test the checkout flow, as it requires an authenticated user.
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Amount (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₹</span>
            <Input
              type="number"
              min="100"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7"
              required
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Minimum amount is ₹100</p>
        </div>
        
        <Button 
          type="submit" 
          disabled={loading || !user} 
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
          ) : (
            `Pay ₹${amount}`
          )}
        </Button>
      </form>
    </div>
  );
}
