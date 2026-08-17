"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles, MapPin, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrueDialAPI } from "@/lib/api";

export default function PrivilegeCardPage() {
  const [loading, setLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCard();
  }, []);

  const fetchMyCard = async () => {
    setLoading(true);
    // In a real scenario, this would fetch from TrueDialAPI.getMyPrivilegeCard()
    // For now, we mock the First Year Free card as it is auto-assigned on registration.
    setTimeout(() => {
      setCurrentCard({
        id: 1,
        card_number: "TD-FREE-849201",
        card_type: "free",
        status: "active",
        valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        created_at: new Date().toISOString()
      });
      setLoading(false);
    }, 800);
  };

  const handleUpgrade = async (plan: string, price: number) => {
    setProcessingId(plan);
    try {
      // Simulate Razorpay/Payment Gateway Initiation
      const res = await fetch('/api/proxy/truedial/user/checkout/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_type: plan, amount: price })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Here you would normally open the Razorpay modal.
        // For MVP, we will just simulate a successful payment.
        alert(`Payment of ₹${price} successful! Your card is upgraded.`);
        setCurrentCard({
          ...currentCard,
          card_type: plan,
          card_number: `TD-${plan.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
        });
      } else {
        alert(data.message || "Failed to initiate checkout");
      }
    } catch (error) {
      console.error(error);
      alert("Payment gateway error");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const isFree = currentCard?.card_type === 'free';
  const isCity = currentCard?.card_type === 'city';
  const isMulti = currentCard?.card_type === 'multi-city';

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-primary" /> TrueDial Privilege
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your membership and access exclusive discounts across all partner businesses.
        </p>
      </div>

      {/* Current Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Virtual Card UI */}
        <div className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl transition-all duration-500 ${
          isMulti ? 'bg-gradient-to-br from-slate-900 to-black border border-slate-700/50 shadow-slate-900/50' :
          isCity ? 'bg-gradient-to-br from-blue-600 to-indigo-900 shadow-blue-500/30' :
          'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/30'
        }`}>
          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          
          <div className="relative z-10 flex flex-col h-48 justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-xl tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  TRUEDIAL
                </h3>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mt-1">
                  {isMulti ? 'Multi-City Pass' : isCity ? 'City Pass' : 'First Year Free'}
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-white/50" />
            </div>

            <div>
              <p className="font-mono text-xl tracking-[0.2em] mb-2 drop-shadow-md">
                {currentCard?.card_number || 'TD-XXXX-XXXXXX'}
              </p>
              <div className="flex justify-between items-end text-xs font-medium uppercase tracking-wider text-white/70">
                <span>Member Since<br/><strong className="text-white text-sm">2026</strong></span>
                <span className="text-right">Valid Thru<br/><strong className="text-white text-sm">{new Date(currentCard?.valid_until).toLocaleDateString('en-US', {month: 'short', year:'2-digit'})}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Membership Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Status</span>
              <span className="font-bold text-green-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Current Plan</span>
              <span className="font-bold text-slate-900 dark:text-white capitalize">{currentCard?.card_type} Pass</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Coverage</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {isMulti ? 'All Cities' : isCity ? 'Current City Only' : 'Current City Only (Limited)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {!isMulti && (
        <div className="pt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Upgrade Your Experience</h2>
            <p className="text-slate-500 mt-2">Unlock unlimited discounts and broader coverage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* City Card */}
            <div className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border ${isCity ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 dark:border-slate-800'} shadow-xl flex flex-col transition-transform hover:-translate-y-1 duration-300`}>
              {isCity && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                  Current Plan
                </div>
              )}
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">City Pass</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">₹199</span>
                  <span className="text-slate-500 font-medium">/year</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Access to all Premium Offers in your City
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Priority Support
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Verified Member Badge
                </li>
              </ul>

              <Button 
                disabled={isCity || processingId === 'city'} 
                onClick={() => handleUpgrade('city', 199)}
                className={`w-full h-12 font-bold ${isCity ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'}`}
              >
                {processingId === 'city' ? 'Processing...' : isCity ? 'Current Plan' : 'Upgrade to City Pass'}
              </Button>
            </div>

            {/* Multi-City Card */}
            <div className="relative bg-gradient-to-b from-slate-900 to-black rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col transition-transform hover:-translate-y-1 duration-300 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full"></div>
              
              <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-6 rounded-bl-2xl shadow-lg">
                Best Value
              </div>

              <div className="mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/10 text-yellow-400 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/5">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Multi-City Pass</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">₹999</span>
                  <span className="text-white/60 font-medium">/year</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-1 relative z-10">
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <Zap className="w-5 h-5 text-yellow-400 shrink-0" /> Access Premium Offers Pan-India
                </li>
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <Zap className="w-5 h-5 text-yellow-400 shrink-0" /> Zero Roaming Limits
                </li>
                <li className="flex items-start gap-2 text-sm text-white/80">
                  <Zap className="w-5 h-5 text-yellow-400 shrink-0" /> Concierge Booking Assistance
                </li>
              </ul>

              <Button 
                disabled={processingId === 'multi-city'}
                onClick={() => handleUpgrade('multi-city', 999)}
                className="w-full h-12 font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg shadow-orange-500/25 relative z-10"
              >
                {processingId === 'multi-city' ? 'Processing...' : 'Upgrade to Multi-City'}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
