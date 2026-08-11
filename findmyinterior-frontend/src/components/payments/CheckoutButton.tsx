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

export function CheckoutButton({ planId, amount, label }: { planId: number, amount: number, label: string }) {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const displayRazorpay = async () => {
    if (!user) {
      alert("Please login first.");
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
        alert("Razorpay SDK failed to load. Are you offline?");
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use test key
        amount: amountInPaise.toString(),
        currency: "INR",
        name: "FindMyInterior",
        description: `Upgrade to ${label}`,
        order_id: orderId,
        handler: async function (response: any) {
          // 4. Verify payment on backend
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Payment Successful! Your subscription is now active.");
            window.location.reload(); // Quick refresh to update state
          } catch (err) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#ea580c", // Orange-600
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!user) return;
    if (!confirm(`Pay ₹${amount} using your wallet balance?`)) return;
    
    setLoading(true);
    try {
      await api.post("/payments/pay-with-wallet", {
        purpose: "subscription",
        subscription_plan_id: planId,
        billing_cycle: "yearly"
      });
      alert("Payment Successful! Your subscription is now active.");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || "Wallet payment failed!");
    } finally {
      setLoading(false);
    }
  };

  const hasEnoughWalletBalance = (user?.wallet_balance || 0) >= amount;

  return (
    <div className="w-full flex flex-col gap-2">
      {hasEnoughWalletBalance && (
        <Button 
          onClick={handleWalletPayment} 
          disabled={loading} 
          variant="default"
          className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg text-white font-bold"
        >
          {loading ? "Processing..." : `Pay with Wallet (Bal: ₹${user.wallet_balance})`}
        </Button>
      )}
      <Button 
        onClick={displayRazorpay} 
        disabled={loading} 
        variant={hasEnoughWalletBalance ? "outline" : "default"}
        className={`w-full h-12 text-lg font-bold ${!hasEnoughWalletBalance ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'border-orange-600 text-orange-600 hover:bg-orange-50'}`}
      >
        {loading ? "Processing..." : (hasEnoughWalletBalance ? "Pay with Razorpay" : label)}
      </Button>
    </div>
  );
}
