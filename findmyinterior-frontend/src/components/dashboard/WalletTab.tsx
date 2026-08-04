"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet } from "lucide-react";

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

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) < 100) {
      alert("Minimum recharge amount is ₹100");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post("/payments/create-order", {
        purpose: "wallet_recharge",
        amount: Number(amount)
      });

      const { order_id, amount: orderAmount, currency, payment_id } = res.data;
      
      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", 
        amount: orderAmount,
        currency: currency,
        name: "Find My Interior",
        description: "Wallet Recharge",
        order_id: order_id,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Wallet recharged successfully!");
            setAmount("");
            fetchWallet();
          } catch (e: any) {
            alert(e.response?.data?.message || "Payment verification failed.");
          }
        },
        theme: {
          color: "#ea580c"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      rzp.open();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to initialize payment.");
    } finally {
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
            <h3 className="font-semibold text-lg mb-4">Recharge Wallet</h3>
            <form onSubmit={handleRecharge} className="flex gap-4 max-w-md">
              <Input 
                type="number" 
                min="100" 
                placeholder="Amount (₹)" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                {loading ? "Processing..." : "Add Funds"}
              </Button>
            </form>
            <p className="text-xs text-slate-500 mt-2">Minimum recharge amount is ₹100.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
