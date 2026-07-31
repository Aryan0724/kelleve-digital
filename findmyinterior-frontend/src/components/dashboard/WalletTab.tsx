"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet } from "lucide-react";

// Load Razorpay Script dynamically
const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function WalletTab() {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setBalance(res.data.balance || 0);
    } catch (e) {
      console.error("Failed to fetch wallet", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const amountInINR = Number(amount);
    if (isNaN(amountInINR) || amountInINR < 100) {
      alert("Minimum recharge amount is ₹100.");
      setLoading(false);
      return;
    }

    const amountInPaise = Math.round(amountInINR * 100);

    try {
      // 1. Create Razorpay order on backend
      const resOrder = await api.post("/create-order", {
        amount: amountInPaise,
        currency: "INR",
        receipt: `wallet_rcpt_${Date.now()}`,
      });

      const { order_id, amount: returnedAmount, currency } = resOrder.data;

      if (!order_id) {
        throw new Error("Failed to create Razorpay order.");
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Are you offline?");
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TKAMwh6HKLnjZV",
        amount: returnedAmount.toString(),
        currency: currency || "INR",
        name: "FindMyInterior",
        description: `Wallet Recharge - ₹${amountInINR}`,
        order_id: order_id,
        handler: async function (paymentResponse: any) {
          try {
            // 4. Verify HMAC-SHA256 signature on backend
            const verifyRes = await api.post("/verify-payment", {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              // 5. Credit wallet after signature verification succeeds
              await api.post("/wallet/add-funds", {
                amount: amountInINR,
                description: `Razorpay Recharge (${paymentResponse.razorpay_payment_id})`,
              });

              alert("Payment verified successfully! Wallet recharged via Razorpay.");
              setAmount("");
              fetchWallet();
            } else {
              alert(verifyRes.data?.message || "Payment signature verification failed.");
            }
          } catch (err: any) {
            alert(err.response?.data?.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment was cancelled.");
            setLoading(false);
          },
        },
        theme: {
          color: "#ea580c", // Orange-600
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on("payment.failed", function (response: any) {
        alert(response.error?.description || "Payment transaction failed.");
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to initiate Razorpay checkout.");
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-slate-500">Loading wallet...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-6 w-6 text-orange-600" /> My Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-slate-900 mb-6">
            ₹{balance.toLocaleString('en-IN')}
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Recharge Wallet (Razorpay Checkout)</h3>
            <form onSubmit={handleRecharge} className="flex gap-4 max-w-md">
              <Input 
                type="number" 
                min="100" 
                placeholder="Amount (₹)" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 font-semibold">
                {loading ? "Processing..." : "Add Funds via Razorpay"}
              </Button>
            </form>
            <p className="text-xs text-slate-500 mt-2">Minimum recharge amount is ₹100. Uses secure Razorpay Standard Checkout.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
