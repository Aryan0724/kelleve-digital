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

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/wallet/add-funds", {
        amount: Number(amount),
        description: "Wallet Recharge"
      });
      alert(res.data.message || "Wallet recharged successfully!");
      setAmount("");
      fetchWallet();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to recharge wallet.");
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
