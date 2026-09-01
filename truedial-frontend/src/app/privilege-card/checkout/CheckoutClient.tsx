'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, CheckCircle2, AlertTriangle, Lock, Loader2, ArrowRight } from 'lucide-react';
import { TrueDialAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

const PLANS = {
  Classic: { price: 0, title: 'Classic Digital', features: ['First Year Free', 'Basic Perks'] },
  Gold: { price: 999, title: 'Gold Privilege', features: ['Priority Booking', '1+1 Dining', '15% Off Health'] },
  Platinum: { price: 2499, title: 'Platinum Elite', features: ['VIP Access', '24/7 Concierge', '30% Off Luxury'] }
};

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') as keyof typeof PLANS || 'Gold';
  const planDetails = PLANS[plan];

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Mock Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate mock payment delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Mock the payment success and call our real backend to generate the card
      const res = await TrueDialAPI.post('/user/privilege-card', {
        plan: plan,
        price: planDetails.price
      });

      if (res.success) {
        setSuccess(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard/user/privilege');
        }, 2000);
      } else {
        setError('Failed to issue Privilege Card. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Payment Successful!</h2>
        <p className="text-slate-300 text-lg mb-8 max-w-md">
          Your TrueDial {plan} Privilege Card has been activated. Redirecting to your dashboard...
        </p>
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Summary */}
      <div className="order-2 lg:order-1">
        <h1 className="text-3xl font-black mb-2">Checkout</h1>
        <p className="text-slate-400 mb-8">Complete your secure payment to activate your membership.</p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard className="w-32 h-32" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-amber-400 mb-1">{planDetails?.title || 'Unknown Plan'}</h3>
            <p className="text-sm text-slate-400 mb-6">1-Year Membership</p>

            <div className="space-y-4 mb-8">
              {planDetails?.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {f}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-6 mt-6">
              <div className="flex justify-between items-center text-lg font-bold text-white mb-2">
                <span>Total Amount</span>
                <span>₹{planDetails?.price || 0}</span>
              </div>
              <p className="text-xs text-slate-500">Includes all applicable taxes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Payment Form */}
      <div className="order-1 lg:order-2">
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Form Header */}
          <div className="flex items-center gap-2 mb-6 text-slate-400 font-medium text-sm">
            <Lock className="w-4 h-4" /> 256-bit Secure Mock Checkout
          </div>
          <h3 className="text-2xl font-bold mb-8">Payment Details</h3>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 mb-6 text-sm font-medium">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Name on Card</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aryan Sharma"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-shadow"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4111 2222 3333 4444"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-shadow"
                />
                <CreditCard className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Expiry (MM/YY)</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="12/25"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-shadow"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">CVV</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium transition-shadow"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 mt-4 bg-slate-900 hover:bg-black text-white text-base font-bold rounded-xl shadow-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
              ) : (
                <span className="flex items-center justify-between w-full">
                  Pay ₹{planDetails?.price || 0}
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
            
            <p className="text-center text-xs text-slate-400 font-medium pt-2">
              By clicking "Pay", you agree to TrueDial's Terms of Service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
