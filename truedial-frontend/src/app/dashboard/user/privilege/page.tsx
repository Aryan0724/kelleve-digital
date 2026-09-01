'use client';

import React, { useEffect, useState } from 'react';
import { TrueDialAPI } from '@/lib/api';
import { Crown, Sparkles, AlertCircle, CreditCard, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface PrivilegeCard {
  card_number: string;
  card_type: string;
  status: string;
  valid_until: string;
}

export default function PrivilegeDashboardPage() {
  const { user } = useAuth();
  const [card, setCard] = useState<PrivilegeCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await TrueDialAPI.get('/user/privilege-card');
        if (res.success && res.data) {
          setCard(res.data);
        }
      } catch (err) {
        console.error("Error fetching privilege card", err);
        setError("Failed to load your Privilege Card. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-muted-foreground text-sm font-medium">Loading your TrueDial Privilege...</p>
      </div>
    );
  }

  if (error && !card) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-start gap-4">
        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold mb-1">Could not retrieve card</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Determine card styles based on type
  let gradient = "from-slate-800 via-slate-900 to-black";
  let textColor = "text-slate-100";
  let iconColor = "text-slate-400";
  let border = "border-slate-700";

  if (card?.card_type === 'Gold') {
    gradient = "from-amber-600 via-yellow-600 to-amber-900";
    textColor = "text-amber-100";
    iconColor = "text-amber-400";
    border = "border-amber-400/40";
  } else if (card?.card_type === 'Platinum') {
    gradient = "from-indigo-900 via-purple-900 to-slate-950";
    textColor = "text-purple-100";
    iconColor = "text-purple-400";
    border = "border-purple-400/50";
  }

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground">Privilege Card</h1>
          <p className="text-muted-foreground mt-2">Manage your exclusive TrueDial membership and view your perks.</p>
        </div>
        {card && card.card_type !== 'Platinum' && (
          <Link href="/privilege-card">
            <button className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105">
              Upgrade Membership <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>

      {!card ? (
        <div className="bg-card border border-border p-10 rounded-3xl text-center shadow-sm">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No Active Membership</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Unlock exclusive discounts, priority booking, and premium perks across verified local businesses.
          </p>
          <Link href="/privilege-card">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all">
              Explore Privilege Plans
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card Mockup */}
          <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-[32px] blur-2xl opacity-40 group-hover:opacity-60 transition duration-500`} />
            
            <div className={`relative bg-gradient-to-br ${gradient} border ${border} rounded-[28px] p-8 shadow-2xl overflow-hidden min-h-[250px] flex flex-col justify-between`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {card.card_type === 'Platinum' ? <Crown className={`w-6 h-6 ${iconColor}`} /> : <Sparkles className={`w-6 h-6 ${iconColor}`} />}
                    <span className="font-black text-xl tracking-wider text-white">TRUEDIAL PRIVILEGE</span>
                  </div>
                  <p className={`text-xs ${iconColor} font-bold uppercase tracking-widest`}>{card.card_type} Member</p>
                </div>
                <div className="w-12 h-9 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/10">
                  <div className="w-8 h-5 border border-white/20 rounded-[3px]" />
                </div>
              </div>

              <div className="my-8 relative z-10">
                <p className="text-xs text-white/50 font-mono tracking-wider mb-2">CARD NUMBER</p>
                <p className="text-2xl sm:text-3xl font-mono font-bold tracking-[0.2em] text-white drop-shadow-md">
                  {card.card_number.replace(/-/g, ' • ')}
                </p>
              </div>

              <div className="flex justify-between items-end pt-5 border-t border-white/10 relative z-10">
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-0.5">CARDHOLDER</p>
                  <p className="text-base font-bold text-white tracking-wide uppercase drop-shadow-sm">{user?.name || 'Valued Member'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-0.5">VALID THRU</p>
                  <p className={`text-base font-mono font-bold ${iconColor} drop-shadow-sm`}>
                    {new Date(card.valid_until).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Status */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              Membership Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground font-medium">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-bold text-xs uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {card.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground font-medium">Card Tier</span>
                <span className="font-bold text-foreground">{card.card_type}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground font-medium">Member Since</span>
                <span className="font-bold text-foreground">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-sm font-medium text-foreground mb-1">How to use your card?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Simply show this digital screen at any verified TrueDial partner establishment before billing to automatically apply your exclusive {card.card_type} discounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
