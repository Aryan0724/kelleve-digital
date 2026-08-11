"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, ShieldCheck, Zap, Rocket, Building2, Search, Briefcase, HardHat } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'worker' | 'professional' | 'business'>('professional');

  const plans = {
    worker: [
      {
        name: "Starter",
        desc: "Perfect for Getting Started",
        price: "₹0",
        features: ["Free Profile", "Basic Search Visibility"],
        popular: false
      },
      {
        name: "Growth",
        desc: "Best for Individual Workers",
        price: "₹199",
        features: ["Enhanced Profile", "WhatsApp Chat Link", "Instant Lead Notifications", "Basic Support"],
        popular: true
      },
      {
        name: "Professional",
        desc: "More Leads & Visibility",
        price: "₹399",
        features: ["Better Ranking", "More Leads", "Profile Analytics", "Verified Badge"],
        popular: false
      },
      {
        name: "Elite",
        desc: "Top of the Market",
        price: "₹799",
        features: ["Maximum Visibility", "Priority Opportunities", "Top of Search Results", "Premium Support"],
        popular: false
      }
    ],
    professional: [
      {
        name: "Starter",
        desc: "Perfect for Getting Started",
        price: "₹0",
        features: ["1 Business Listing", "Basic Business Profile", "Contact Form"],
        popular: false
      },
      {
        name: "Growth",
        desc: "Growing Professionals",
        price: "₹499",
        features: ["Verified Business Badge", "WhatsApp Chat", "Higher Search Ranking"],
        popular: false
      },
      {
        name: "Professional",
        desc: "Best for Most Designers",
        price: "₹999",
        features: ["Project Leads + Bidding", "Unlimited Portfolio", "Top Category Placement"],
        popular: true
      },
      {
        name: "Elite",
        desc: "Maximum Lead Generation",
        price: "₹1,999",
        features: ["Homepage Featured Slot", "Full Analytics Dashboard", "Competitor Insights", "Priority Admin Support"],
        popular: false
      }
    ],
    business: [
      {
        name: "Starter",
        desc: "Perfect for Getting Started",
        price: "₹0",
        features: ["Basic Company Profile", "Standard Discovery"],
        popular: false
      },
      {
        name: "Growth",
        desc: "Small Agencies",
        price: "₹999",
        features: ["Multiple Listings", "Verified Company Badge", "Team Member Profiles"],
        popular: false
      },
      {
        name: "Professional",
        desc: "Growing Companies",
        price: "₹1,999",
        features: ["Priority Visibility", "Project Promotion", "Professional Network Access"],
        popular: true
      },
      {
        name: "Elite Business",
        desc: "National Brands",
        price: "₹3,999",
        features: ["Multiple Branches", "Dominant Search Real Estate", "Dedicated Account Manager", "Custom Branding"],
        popular: false
      }
    ]
  };

  const currentPlans = plans[activeTab];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 text-center">
          
          <div className="bg-orange-100 border border-orange-200 text-orange-800 rounded-lg p-3 inline-flex items-center gap-3 mb-8 mx-auto shadow-sm">
            <Rocket className="w-5 h-5 text-orange-600" />
            <div className="text-sm text-left">
              <span className="font-bold">HOMEOWNERS ARE ALWAYS FREE.</span> Only professionals & businesses pay to get leads!
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Choose the Perfect Plan to Grow</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Select your role below to see customized pricing for your business size.
          </p>

          {/* Role Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button 
              onClick={() => setActiveTab('worker')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'worker' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'bg-white text-slate-600 border hover:bg-slate-100'}`}
            >
              <HardHat className="w-5 h-5" /> Skilled Worker
            </button>
            <button 
              onClick={() => setActiveTab('professional')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'professional' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'bg-white text-slate-600 border hover:bg-slate-100'}`}
            >
              <Briefcase className="w-5 h-5" /> Professional
            </button>
            <button 
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'business' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'bg-white text-slate-600 border hover:bg-slate-100'}`}
            >
              <Building2 className="w-5 h-5" /> Business
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {currentPlans.map((plan, idx) => (
              <div key={idx} className={`${plan.popular ? 'bg-[#0b1b36] shadow-xl md:-translate-y-2' : 'bg-white shadow-sm'} rounded-2xl border p-6 text-left relative overflow-hidden flex flex-col transform transition-transform`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#ff6b00] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">
                    RECOMMENDED
                  </div>
                )}
                
                <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.popular && <Star className="w-5 h-5 text-[#ff6b00] fill-[#ff6b00]" />} {plan.name}
                </h3>
                
                <p className={`mb-6 min-h-[40px] text-sm ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>{plan.desc}</p>
                
                <div className="mb-6 flex flex-col">
                  <div>
                    <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                    <span className={`font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}> {plan.price === '₹0' ? '' : '/mo'}</span>
                  </div>
                </div>
                
                <Link href={plan.price === '₹0' ? '/register' : '/dashboard?tab=subscription'} className="mt-auto">
                  <Button variant={plan.popular ? 'default' : 'outline'} className={`w-full h-10 text-sm font-semibold mb-6 ${plan.popular ? 'bg-[#ff6b00] hover:bg-[#ea580c] border-none text-white' : ''}`}>
                    {plan.price === '₹0' ? 'Start Free' : 'Choose Plan'}
                  </Button>
                </Link>
                
                <ul className={`space-y-3 mt-auto flex-1 ${plan.popular ? 'text-slate-200' : 'text-slate-600'}`}>
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-[#ff6b00]' : 'text-blue-500'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Advertising Link */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Looking for Brand Advertising & Corporate Packages?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">We offer premium website banners, category sponsorships, and corporate brand partnerships to give your brand maximum visibility.</p>
            <Link href="/advertise">
              <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 font-bold px-8">View Advertisement Pricing</Button>
            </Link>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
