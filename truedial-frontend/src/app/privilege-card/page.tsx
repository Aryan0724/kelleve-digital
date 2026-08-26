import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  CreditCard, ShieldCheck, Sparkles, CheckCircle2, Crown, Zap, 
  Gift, Percent, Utensils, Dumbbell, HeartPulse, Scissors, ArrowRight,
  ChevronRight, Star, ShoppingBag, Coffee, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CARD_TIERS = [
  {
    id: "classic",
    name: "Classic Digital",
    price: "FREE",
    originalPrice: "₹999",
    tag: "First Year Free",
    gradient: "from-slate-800 via-slate-900 to-black",
    border: "border-slate-700",
    glow: "shadow-slate-500/10",
    icon: CreditCard,
    benefits: [
      "Up to 15% OFF at 5,000+ verified restaurants & cafes",
      "10% discount on salon, spa & fitness memberships",
      "Priority customer support on all bookings",
      "Instant digital card on your mobile app",
      "No hidden fees or renewal lock-ins"
    ],
    popular: false,
    ctaText: "Claim Free Digital Card",
    ctaLink: "/register"
  },
  {
    id: "gold",
    name: "Gold Privilege",
    price: "₹999",
    originalPrice: "₹2,499",
    tag: "Most Popular",
    period: "/ year",
    gradient: "from-amber-600 via-yellow-600 to-amber-900",
    border: "border-amber-400/40",
    glow: "shadow-amber-500/25",
    icon: Sparkles,
    benefits: [
      "Up to 25% OFF at top-tier dining & nightlife destinations",
      "1+1 Complimentary dessert/starter at partner restaurants",
      "15% OFF on diagnostic labs & healthcare clinics",
      "Free priority booking slots with zero waiting time",
      "Exclusive quarterly cashback points and vouchers",
      "Includes all Classic Digital perks"
    ],
    popular: true,
    ctaText: "Get Gold Privilege",
    ctaLink: "/dashboard/user/privilege-card"
  },
  {
    id: "platinum",
    name: "Platinum Elite",
    price: "₹2,499",
    originalPrice: "₹4,999",
    tag: "VIP Luxury",
    period: "/ year",
    gradient: "from-indigo-900 via-purple-900 to-slate-950",
    border: "border-purple-400/50",
    glow: "shadow-purple-500/30",
    icon: Crown,
    benefits: [
      "Flat 30% OFF across luxury dining, resorts & boutique hotels",
      "Free quarterly dental & health checkup consultation",
      "Unlimited 1+1 offers on wellness, salon & fitness passes",
      "Dedicated 24/7 personal concierge booking assistance",
      "VIP access to exclusive corporate & community events",
      "Includes all Gold & Classic perks"
    ],
    popular: false,
    ctaText: "Upgrade to Platinum VIP",
    ctaLink: "/dashboard/user/privilege-card"
  }
];

const PARTNER_CATEGORIES = [
  { icon: Utensils, name: "Fine Dining & Cafes", discount: "Up to 30% OFF", count: "1,200+ Outlets" },
  { icon: Dumbbell, name: "Gyms & Fitness Studios", discount: "Flat 20% OFF", count: "450+ Centers" },
  { icon: HeartPulse, name: "Clinics & Diagnostics", discount: "Up to 25% OFF", count: "800+ Clinics" },
  { icon: Scissors, name: "Salons & Luxury Spas", discount: "Up to 35% OFF", count: "650+ Salons" },
  { icon: ShoppingBag, name: "Boutiques & Retail", discount: "Exclusive Deals", count: "950+ Stores" },
  { icon: Coffee, name: "Bakeries & Lounges", discount: "1+1 Deals", count: "500+ Spots" },
];

export default async function PublicPrivilegeCardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-white selection:bg-amber-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              TrueDial Privilege Membership
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-6">
              Unlock Exclusive Discounts & VIP Perks Across Your City
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8">
              One digital card. Thousands of premium dining, fitness, salon, and healthcare privileges with instant bill savings.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-8 py-6 text-base rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all">
                  Claim Free 1-Year Membership
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/user/privilege-card">
                <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white font-bold px-8 py-6 text-base rounded-2xl">
                  Manage Existing Card
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Card Mockup */}
          <div className="max-w-lg mx-auto mb-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-purple-600 rounded-[28px] blur-xl opacity-50 group-hover:opacity-80 transition duration-500" />
              
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-amber-500/30 rounded-[24px] p-7 shadow-2xl text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-5 h-5 text-amber-400" />
                      <span className="font-black text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">TRUEDIAL PRIVILEGE</span>
                    </div>
                    <p className="text-[11px] text-amber-300/80 font-bold uppercase tracking-widest">VIP Member Pass</p>
                  </div>
                  <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 to-yellow-600 flex items-center justify-center shadow-md">
                    <div className="w-6 h-4 border border-slate-950/40 rounded-sm" />
                  </div>
                </div>

                <div className="my-6 relative z-10">
                  <p className="text-xs text-slate-400 font-mono tracking-wider mb-1">CARD NUMBER</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold tracking-[0.2em] text-slate-100">
                    TD • 8492 • 0019 • 5824
                  </p>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-slate-800/80 relative z-10">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">CARDHOLDER</p>
                    <p className="text-sm font-bold text-white tracking-wide">VERIFIED PRIVILEGE USER</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">VALID THRU</p>
                    <p className="text-sm font-mono font-bold text-amber-400">12/27</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Categories & Discounts Grid */}
      <section className="py-20 bg-slate-950/80 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black tracking-tight mb-3">Where Can You Use Your Privilege Card?</h2>
            <p className="text-slate-400 text-sm sm:text-base">Flash your digital card at thousands of verified local partners across major categories.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNER_CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 hover:bg-slate-900 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{cat.name}</h3>
                    <p className="text-xs text-slate-400">{cat.count}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs">
                  <Percent className="w-3.5 h-3.5" />
                  {cat.discount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Tiers */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Choose Your Privilege Tier</h2>
          <p className="text-slate-400 text-base">Select the membership tier that fits your lifestyle. Upgrade anytime from your dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {CARD_TIERS.map((tier) => (
            <div 
              key={tier.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between border transition-all duration-300 ${
                tier.popular 
                  ? "bg-slate-900/90 border-amber-500/60 shadow-2xl shadow-amber-500/10 scale-105 z-10" 
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  {tier.tag}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                    <tier.icon className="w-5 h-5" />
                  </div>
                  {!tier.popular && tier.tag && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {tier.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-black text-white">{tier.price}</span>
                  {tier.originalPrice && (
                    <span className="text-sm line-through text-slate-500">{tier.originalPrice}</span>
                  )}
                  {tier.period && (
                    <span className="text-xs text-slate-400 font-medium">{tier.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={tier.ctaLink} className="w-full">
                <Button className={`w-full py-6 font-bold rounded-xl text-sm ${
                  tier.popular
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}>
                  {tier.ctaText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
