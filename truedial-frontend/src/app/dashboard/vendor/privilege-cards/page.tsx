"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Sparkles, Loader2, Copy, Check, QrCode } from "lucide-react";

export default function PrivilegeCardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/privilege-cards/my-cards`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setCards(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCard = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/vendor/privilege-cards/generate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        fetchCards();
      }
    } catch (error) {
      console.error("Failed to generate card:", error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Privilege Cards</h1>
        <p className="text-muted-foreground mt-2">
          Generate and manage your TrueDial multi-city privilege cards to offer exclusive discounts.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={generateCard} disabled={generating} className="bg-[#E8701A] hover:bg-[#c95d13] text-white border-0 shadow-lg shadow-[#E8701A]/20 transition-all hover:-translate-y-1">
          {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate New Card
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <CreditCard className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No cards generated yet</h3>
          <p className="mt-2 text-sm text-slate-500">Create your first privilege card to start rewarding customers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="relative overflow-hidden rounded-2xl border border-white/20 p-6 shadow-xl backdrop-blur-md bg-gradient-to-br from-[#0a1c3a]/90 to-[#0a1c3a]/70 dark:from-[#0a1c3a] dark:to-[#050f24] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#0a1c3a]/20 group"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-[#E8701A]/30 blur-2xl transition-all group-hover:bg-[#E8701A]/40" />
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-blue-500/20 blur-xl" />
              
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider">TrueDial Privilege</h3>
                  <div className="mt-1 flex items-center">
                    <Sparkles className="h-4 w-4 text-[#E8701A] mr-1" />
                    <span className="text-white font-bold tracking-widest text-lg">VIP</span>
                  </div>
                </div>
                <Badge variant={card.status === 'active' ? 'default' : 'secondary'} className={card.status === 'active' ? 'bg-[#E8701A] text-white hover:bg-[#E8701A] border-0' : ''}>
                  {card.status}
                </Badge>
              </div>

              <div className="relative z-10">
                <div className="text-white/60 text-xs mb-1">Card Number</div>
                <div className="flex items-center justify-between">
                  <div className="text-white font-mono text-xl tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 inline-block backdrop-blur-sm">
                    {card.card_number}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(card.card_number)}
                      className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                      title="Copy Card Number"
                    >
                      {copiedId === card.card_number ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-1.5 rounded-md">
                    <QrCode className="h-8 w-8 text-slate-900" />
                  </div>
                  <div>
                    <div className="text-white/60 text-[10px] uppercase tracking-wider">Scan to Redeem</div>
                    <div className="text-white/90 text-xs font-medium">Valid at all branches</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white text-xs h-8">
                  View Full QR
                </Button>
              </div>

              <div className="relative z-10 mt-6 flex justify-between items-end">
                <div>
                  <div className="text-white/60 text-xs">Issued On</div>
                  <div className="text-white/90 text-sm font-medium">{new Date(card.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-white/20 transition-colors group-hover:text-white/40">
                  <CreditCard className="h-8 w-8" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      {/* Validation / Scanning Section */}
      <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="h-5 w-5 text-[#E8701A]" />
              Verify Customer Card
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Scan a customer's TrueDial Privilege Card QR or enter the Membership Number manually to apply VIP discounts.
            </p>
          </div>
          <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Membership Number
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. TD-VIP-88219" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E8701A]/50 font-mono"
                />
                <Button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white">
                  Verify
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Quick Scan
              </label>
              <Button variant="outline" className="w-full border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <QrCode className="h-4 w-4" /> Open Camera
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
