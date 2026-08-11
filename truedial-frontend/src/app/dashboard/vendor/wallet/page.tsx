'use client';

import React, { useState } from 'react';
import { Wallet, CreditCard, ShieldCheck, Zap, ArrowRight, CheckCircle2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VendorWalletPage() {
  const [balance, setBalance] = useState(150);
  const [recharging, setRecharging] = useState(false);

  const handleRecharge = (amount: number, credits: number) => {
    setRecharging(true);
    // Simulate Razorpay popup
    setTimeout(() => {
      alert(`Razorpay Test Mode: Successfully paid ₹${amount}`);
      setBalance(b => b + credits);
      setRecharging(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-2">
          <Wallet className="w-8 h-8 text-primary" /> Wallet & Subscriptions
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Recharge your TrueDial wallet to unlock B2B leads and bid on Homeowner requirements. Upgrade to a Premium Subscription for unlimited bidding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Balance & History */}
        <div className="lg:col-span-1 space-y-6">
          <div className="premium-card p-6 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-xs mb-2">Available Credits</h3>
            <div className="text-5xl font-black text-foreground mb-4">{balance}</div>
            <p className="text-xs text-muted-foreground mb-6">
              1 Credit = ₹1. Credits never expire.
            </p>
            <div className="bg-background rounded-xl p-3 border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium">
                Auto-recharge is <span className="text-emerald-500 font-bold">disabled</span>
              </div>
            </div>
          </div>

          <div className="premium-card p-6 rounded-2xl border border-border">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-primary" /> Recent Transactions
            </h3>
            <div className="space-y-4">
              {[
                { type: 'deduction', title: 'Bid on 3BHK Renovation', amt: -10, date: 'Today' },
                { type: 'recharge', title: 'Wallet Recharge (Razorpay)', amt: 200, date: 'Aug 10' },
                { type: 'deduction', title: 'Bid on Modular Kitchen', amt: -10, date: 'Aug 09' },
              ].map((tx, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-semibold text-foreground">{tx.title}</div>
                    <div className="text-xs text-muted-foreground">{tx.date}</div>
                  </div>
                  <div className={`font-bold ${tx.amt > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {tx.amt > 0 ? '+' : ''}{tx.amt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recharge & Plans */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recharge Packages */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Instant Recharge Packages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { credits: 100, price: 100, bonus: 0 },
                { credits: 550, price: 500, bonus: 50, popular: true },
                { credits: 1200, price: 1000, bonus: 200 },
                { credits: 2500, price: 2000, bonus: 500 },
              ].map((pkg, i) => (
                <div key={i} className={`p-5 rounded-2xl border transition relative ${pkg.popular ? 'border-primary shadow-md bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      Most Popular
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-black text-foreground">{pkg.credits} <span className="text-sm text-muted-foreground font-semibold">Credits</span></div>
                      {pkg.bonus > 0 && <div className="text-xs font-bold text-emerald-500 mt-1">Includes {pkg.bonus} Bonus Credits!</div>}
                    </div>
                    <div className="text-lg font-bold">₹{pkg.price}</div>
                  </div>
                  <Button 
                    onClick={() => handleRecharge(pkg.price, pkg.credits)} 
                    disabled={recharging}
                    variant={pkg.popular ? 'default' : 'outline'}
                    className="w-full font-bold"
                  >
                    Pay with Razorpay
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Plans */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Premium Subscriptions
            </h2>
            <div className="premium-card p-6 rounded-2xl border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-transparent flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="inline-block bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2">TrueDial Pro</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Unlimited Lead Bidding</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Never pay per-lead again</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> "Pro" Badge on your profile</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority ranking in Search Results</li>
                </ul>
              </div>
              <div className="w-full md:w-auto shrink-0 text-center bg-background p-5 rounded-xl border border-border shadow-sm">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Billed Annually</div>
                <div className="text-3xl font-black text-foreground mb-4">₹9,999<span className="text-sm text-muted-foreground font-medium">/yr</span></div>
                <Button onClick={() => handleRecharge(9999, 10000)} className="w-full font-bold">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
