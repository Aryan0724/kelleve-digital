"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";

// Load Razorpay Script dynamically
const loadScript = (src: string) => {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function CheckoutButton({ planId, amount, label }: { planId: number, amount: number, label: string }) {
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const displayRazorpay = async () => {
    if (!user) {
      alert("Please login first to continue checkout.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const { data } = await api.post("/create-order", {
        amount: Math.round(amount * 100), // convert INR to paise
        currency: "INR",
        receipt: `sub_${user.id}_${Date.now()}`,
        purpose: "subscription",
        subscription_plan_id: planId,
        billing_cycle: "monthly",
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
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TKAMwh6HKLnjZV",
        amount: amountInPaise.toString(),
        currency: data.currency || "INR",
        name: "FindMyInterior",
        description: `Upgrade to ${label}`,
        order_id: orderId,
        handler: async function (response: any) {
          // 4. Verify payment on backend
          try {
            const verifyRes = await api.post("/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              alert("Payment Successful! Your subscription is now active.");
              window.location.reload();
            } else {
              alert(verifyRes.data?.message || "Payment verification failed!");
            }
          } catch (err: any) {
            alert(err.response?.data?.message || "Payment verification failed!");
          }
        },
        modal: {
          ondismiss: function () {
            // User dismissed modal
            setLoading(false);
          },
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#ea580c", // Orange-600
        },
      };

      const paymentObject = new (window as any).Razorpay(options);

      // Handle payment failed event
      paymentObject.on("payment.failed", function (response: any) {
        const errDesc = response.error?.description || "Payment failed.";
        alert(errDesc);
        setLoading(false);
      });

      paymentObject.open();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to initiate payment.";
      alert(errMsg);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={displayRazorpay} 
      disabled={loading} 
      className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg font-semibold"
    >
      {loading ? "Processing..." : label}
    </Button>
  );
}
