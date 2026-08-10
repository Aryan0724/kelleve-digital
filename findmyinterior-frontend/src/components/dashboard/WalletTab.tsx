"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Loader2 } from "lucide-react";

import { useAuthStore } from "@/lib/store/useAuthStore";

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

export function WalletTab() {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const user = useAuthStore((state) => state.user);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/wallet");
      setBalance(res.data.balance || 0);
      setTransactions(res.data.transactions || []);
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
    if (!user) {
      alert("Please login first.");
      return;
    }

    const amt = Number(amount);
    if (amt < 100) {
      alert("Minimum recharge amount is ₹100");
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const orderRes = await api.post("/payments/create-order", { 
        purpose: "wallet_recharge", 
        amount: amt 
      });
      const orderId = orderRes.data.order_id;
      const amountInPaise = orderRes.data.amount;

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
        name: "FindMyInterior",
        description: `Wallet Recharge: ₹${amt}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert(`✅ ₹${amt} added to your wallet!`);
            setAmount("");
            fetchWallet();
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
          color: "#ea580c", // Orange-600
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment Failed. " + response.error.description);
      });
      paymentObject.open();

    } catch (e: any) {
      alert(e.response?.data?.message || "Recharge failed. Please try again.");
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
          <div className="text-5xl font-extrabold text-slate-900 dark:text-white mb-1">
            ₹{balance.toLocaleString('en-IN')}
          </div>
          <p className="text-sm text-slate-500 mb-6">Available balance</p>

          <div className="border-t dark:border-slate-700 pt-6">
            <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">Recharge Wallet</h3>
            <form onSubmit={handleRecharge} className="flex gap-3 max-w-sm">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₹</span>
                <Input
                  type="number"
                  min="100"
                  step="100"
                  placeholder="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 shrink-0">
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding...</> : "Add Funds"}
              </Button>
            </form>
            <div className="flex gap-2 mt-3">
              {[500, 1000, 2000, 5000].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="px-3 py-1 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:text-orange-600 transition-colors text-slate-600 dark:text-slate-400"
                >
                  ₹{q}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">Minimum recharge: ₹100</p>
          </div>
        </CardContent>
      </Card>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 10).map((tx: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-2 border-b dark:border-slate-700 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white">{tx.description || tx.type}</div>
                    <div className="text-xs text-slate-400">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : ''}</div>
                  </div>
                  <div className={`font-semibold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
