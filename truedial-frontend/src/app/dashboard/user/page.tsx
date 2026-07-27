"use client";

import { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, MapPin, Download, Copy, Check, Sparkles, IndianRupee, HelpCircle, ArrowRight, Tag, Gift, Percent, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function UserDashboard() {
  const [card, setCard] = useState<any>({
    card_number: "TD-VIP-88219-MUM",
    city: "Mumbai / All Cities",
    status: "ACTIVE",
    tier: "PLATINUM VIP",
    expires: "DEC 2028",
    name: "TrueDial Privilege Member"
  });

  const [copied, setCopied] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState(500000);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || "";
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/privilege-cards`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setCard(data.data);
        }
      } catch (e) {
        // use default mock card
      }
    };
    fetchCard();
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(card.card_number || "TD-VIP-88219-MUM");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const calculatedSavings = Math.round(estimatedBudget * 0.20); // 20% avg discount

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">My Privilege Card</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your all-access pass to exclusive discounts across verified TrueDial partner businesses.
          </p>
        </div>
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 py-1.5 px-3 text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" /> PLATINUM VIP MEMBER
        </Badge>
      </div>

      {/* LUXURY VIP CARD */}
      <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.01] duration-500 border border-white/20">
        {/* Card Background Gradient & Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0A192F] to-primary z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 z-0"></div>

        {/* Card Content */}
        <div className="relative z-10 p-8 text-white h-72 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white text-navy rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-white/20">
                T
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-wider">truedial</span>
                <div className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  PRIVILEGE CARD
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold tracking-widest text-white/80 uppercase">
                {card.city || "Multi-City VIP"}
              </div>
              <Badge className="bg-amber-400 text-navy font-bold text-[10px] uppercase border-none mt-1">
                {card.status || "ACTIVE"}
              </Badge>
            </div>
          </div>

          <div className="my-auto">
            <div className="text-xs text-white/70 uppercase tracking-widest mb-1">Card Membership Number</div>
            <div className="flex items-center gap-4">
              <div className="text-2xl sm:text-3xl font-mono tracking-[0.2em] font-extrabold text-amber-300 drop-shadow">
                {card.card_number || "TD-VIP-88219-MUM"}
              </div>
              <button
                onClick={handleCopyId}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition backdrop-blur-sm"
                title="Copy Card ID"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && <span className="text-xs text-green-400 font-semibold animate-pulse">Copied to clipboard!</span>}
          </div>

          <div className="flex justify-between items-end border-t border-white/10 pt-4">
            <div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider">Cardholder Name</div>
              <div className="font-semibold tracking-wide text-sm">{card.name || "TrueDial VIP Member"}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/60 uppercase tracking-wider">Valid Thru</div>
              <div className="font-mono text-sm font-bold text-amber-300">{card.expires || "DEC 2028"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS VISUAL 3-STEP WALKTHROUGH */}
      <div className="premium-card p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">How Your Privilege Card Works</h2>
          </div>
          <span className="text-xs text-muted-foreground font-semibold">Instant VIP Discounts in 3 Steps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setActiveStep(1)}
            className={`p-5 rounded-xl border cursor-pointer transition ${
              activeStep === 1 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/40 bg-card"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-3">
              1
            </div>
            <h3 className="font-bold text-base text-foreground mb-1">Explore & Visit Partners</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find verified interior studios, architectural firms, and home service providers with the "VIP Offer" badge on TrueDial or Find My Interior.
            </p>
          </div>

          <div 
            onClick={() => setActiveStep(2)}
            className={`p-5 rounded-xl border cursor-pointer transition ${
              activeStep === 2 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/40 bg-card"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold mb-3">
              2
            </div>
            <h3 className="font-bold text-base text-foreground mb-1">Show Card ID / Code</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Present your Membership Number (<strong className="text-foreground">{card.card_number}</strong>) or apply exclusive promo codes (like <strong className="text-foreground">VIP25</strong>) before quotation or billing.
            </p>
          </div>

          <div 
            onClick={() => setActiveStep(3)}
            className={`p-5 rounded-xl border cursor-pointer transition ${
              activeStep === 3 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/40 bg-card"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center font-bold mb-3">
              3
            </div>
            <h3 className="font-bold text-base text-foreground mb-1">Instant 15%–50% Savings</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Partner businesses apply an immediate VIP member discount directly to your bill. No points to redeem, no wait times!
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE VIP SAVINGS CALCULATOR */}
      <div className="premium-card p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-border">
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" /> VIP Savings Calculator
            </h3>
            <p className="text-xs text-muted-foreground">
              See how much you save on average across home renovations, modular kitchens, and woodwork.
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-600 border-green-200 text-xs">
            Avg. 20% Partner Discount
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Estimated Project Budget
                </label>
                <span className="font-bold text-lg text-primary">₹{estimatedBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={50000}
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1 font-mono">
                <span>₹50,000</span>
                <span>₹10,00,000</span>
                <span>₹20,00,000</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {[100000, 300000, 500000, 1000000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setEstimatedBudget(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    estimatedBudget === amt
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  ₹{(amt / 100000).toFixed(amt >= 100000 ? 0 : 1)} Lakh{amt >= 200000 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 p-6 rounded-2xl text-center space-y-2">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary">
              Your Estimated Privilege Card Savings
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground">
              ₹{calculatedSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Based on flat 20% Privilege Member discount applied by participating TrueDial partner studios.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS FOOTER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
        <Link href="/offers">
          <Button variant="outline" className="flex items-center gap-2 font-semibold shadow-sm">
            <Tag className="w-4 h-4 text-primary" /> Browse All Partner Offers
          </Button>
        </Link>
        <Link href="/search">
          <Button className="flex items-center gap-2 font-semibold shadow-sm px-6">
            Explore Partner Studios <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
