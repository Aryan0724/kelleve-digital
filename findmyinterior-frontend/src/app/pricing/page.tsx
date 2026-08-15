"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Zap, Crown, Building2, Briefcase, Award } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PricingPage() {
  const plans = [
    {
      name: "FREE STARTER",
      price: "₹0",
      period: "/ Month",
      subtitle: "Start Your Journey",
      desc: "Get Basic Access",
      features: [
        "1 Business Listing",
        "5 Portfolio Images",
        "Projects देख सकते हैं",
        "Projects पर Bid कर सकते हैं",
        "Contact Unlock (Wallet से)"
      ],
      bonus: "₹100 Welcome Wallet Bonus",
      footer: "Best For New Professionals & Small Businesses",
      color: "green",
      popular: false,
      icon: <Award className="w-8 h-8 text-green-500 mb-2" />
    },
    {
      name: "GROWTH",
      price: "₹499",
      period: "/ Month",
      yearlyPrice: "₹4,499 / Year",
      subtitle: "Get Found. Get Notified.",
      desc: "Get Business.",
      features: [
        "1 Business Listing",
        "15 Portfolio Images",
        "₹200 Monthly Wallet Credit",
        "Category-wise Lead Notifications",
        "Search Ranking Boost (+10)",
        "Recommendation Score +5",
        "WhatsApp Button",
        "Website Link",
        "Bid on Projects",
        "10% Discount on Contact Unlock"
      ],
      footer: "Best For Growing Businesses & Active Professionals",
      color: "blue",
      popular: false,
      icon: <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
    },
    {
      name: "PROFESSIONAL",
      price: "₹999",
      period: "/ Month",
      yearlyPrice: "₹8,999 / Year",
      subtitle: "Be Among the First.",
      desc: "Get More Projects.",
      features: [
        "Up to 3 Business Listings",
        "30 Portfolio Images",
        "₹500 Monthly Wallet Credit",
        "Instant Lead Notifications",
        "Early Lead Access (2 Hours)",
        "Search Ranking Boost (+30)",
        "Recommendation Score +15",
        "Trusted Professional Badge",
        "WhatsApp + Website",
        "Category Spotlight Placement",
        "20% Discount on Contact Unlock",
        "Weekly Profile Analytics"
      ],
      footer: "Best For Serious Professionals & Established Businesses",
      color: "orange",
      popular: true,
      icon: <Star className="w-8 h-8 text-orange-500 mb-2" />
    },
    {
      name: "ELITE",
      price: "₹1,999",
      period: "/ Month",
      yearlyPrice: "₹17,999 / Year",
      subtitle: "Dominate Your Category.",
      desc: "Own Your City.",
      features: [
        "Up to 5 Business Listings",
        "60 Portfolio Images",
        "₹1,500 Monthly Wallet Credit",
        "Real-Time Lead Alerts",
        "Immediate Lead Access",
        "Top 3 Category Placement",
        "Recommendation Score +25",
        "Elite Professional Badge",
        "WhatsApp + Website",
        "Homepage Featured Slot",
        "30% Discount on Contact Unlock",
        "Full Analytics Dashboard",
        "Competitor Insights",
        "Priority Admin Support",
        '"Responds Fast" Badge'
      ],
      footer: "Best For Top Brands, Companies & Large Businesses",
      color: "fuchsia",
      popular: false,
      icon: <Crown className="w-8 h-8 text-fuchsia-500 mb-2" />
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200', lightBg: 'bg-green-50', gradient: 'from-green-500 to-emerald-600' };
      case 'blue': return { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', lightBg: 'bg-blue-50', gradient: 'from-blue-500 to-indigo-600' };
      case 'orange': return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', lightBg: 'bg-orange-50', gradient: 'from-orange-500 to-red-500' };
      case 'fuchsia': return { bg: 'bg-fuchsia-500', text: 'text-fuchsia-600', border: 'border-fuchsia-200', lightBg: 'bg-fuchsia-50', gradient: 'from-fuchsia-500 to-purple-600' };
      default: return { bg: 'bg-slate-500', text: 'text-slate-600', border: 'border-slate-200', lightBg: 'bg-slate-50', gradient: 'from-slate-500 to-slate-600' };
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          
          <div className="mb-4 inline-flex items-center justify-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex-wrap">
            <span className="font-bold text-slate-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-500"/> Interior Designers</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="font-bold text-slate-800">Architects</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="font-bold text-slate-800">Contractors</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="font-bold text-slate-800">Builders</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="font-bold text-slate-800">Material Suppliers</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">
            More Visibility. More Projects. <span className="text-orange-600">More Business.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium bg-slate-800 text-white py-2 px-6 rounded-full inline-block">
            Choose the Right Membership. Grow Your Business with Find My Interior.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {plans.map((plan, idx) => {
              const colors = getColorClasses(plan.color);
              return (
                <div key={idx} className={`bg-white rounded-3xl border-2 ${colors.border} shadow-lg relative flex flex-col transform transition-transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden`}>
                  
                  {plan.popular && (
                    <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold py-1 text-center tracking-wider z-10 shadow-md">
                      RECOMMENDED
                    </div>
                  )}
                  
                  {/* Header */}
                  <div className={`p-6 pb-8 bg-gradient-to-br ${colors.lightBg} text-center relative ${plan.popular ? 'pt-8' : ''}`}>
                    <div className="flex justify-center">{plan.icon}</div>
                    <div className={`text-white font-extrabold text-xl py-2 px-6 rounded-full inline-block shadow-md bg-gradient-to-r ${colors.gradient} mb-4`}>
                      {plan.name}
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                      <span className="font-medium text-slate-500 font-semibold text-lg"> {plan.period}</span>
                    </div>
                    {plan.yearlyPrice && (
                      <div className="text-sm font-bold text-slate-500 mt-1 line-through opacity-70">
                        {plan.yearlyPrice}
                      </div>
                    )}
                  </div>
                  
                  {/* Tagline */}
                  <div className="bg-slate-100 py-3 px-4 text-center border-y border-slate-200 min-h-[72px] flex flex-col justify-center">
                    <p className="font-bold text-slate-800 text-sm leading-tight">{plan.subtitle}</p>
                    <p className="font-bold text-slate-800 text-sm leading-tight">{plan.desc}</p>
                  </div>
                  
                  {/* Features */}
                  <div className="p-6 flex-1 bg-white">
                    <ul className="space-y-3.5 mb-6 text-left">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex gap-3 text-sm font-semibold text-slate-700 items-start">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 ${colors.text} bg-${plan.color}-100 rounded-full p-0.5`} />
                          <span dangerouslySetInnerHTML={{ __html: f.replace(/\(\+(.*?)\)/g, '<span class="text-green-600 font-bold">(+$1)</span>') }} />
                        </li>
                      ))}
                    </ul>
                    
                    {plan.bonus && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm font-bold text-amber-800 flex items-center gap-2 mt-4 shadow-inner">
                        <Zap className="w-5 h-5 text-amber-500" />
                        {plan.bonus}
                      </div>
                    )}
                  </div>
                  
                  {/* Button & Footer */}
                  <div className="p-6 pt-0 mt-auto bg-white flex flex-col gap-4">
                    <Link href={plan.price === '₹0' ? '/register' : '/dashboard?tab=subscription'} className="w-full">
                      <Button className={`w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all ${plan.popular ? `bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90 border-none` : `bg-white border-2 border-${plan.color}-500 ${colors.text} hover:${colors.bg} hover:text-white`}`}>
                        {plan.price === '₹0' ? 'Start Free' : 'Choose Plan'}
                      </Button>
                    </Link>
                    
                    <div className={`text-xs font-bold text-center flex items-center justify-center gap-2 p-3 rounded-xl ${colors.lightBg} ${colors.text}`}>
                      <Star className="w-4 h-4" /> {plan.footer}
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
