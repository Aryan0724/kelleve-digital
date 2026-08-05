import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, ShieldCheck, Zap, Rocket, Building2, PhoneCall, HeadphonesIcon, Lock, Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pricing Plans | Find My Interior",
  description: "Upgrade your professional profile on Find My Interior to rank higher, unlock more leads, and grow your business.",
};

export default function PricingPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 text-center">
        
        {/* Launch Offer Banner */}
        <div className="bg-orange-100 border border-orange-200 text-orange-800 rounded-lg p-3 inline-flex items-center gap-3 mb-8 mx-auto shadow-sm">
          <Rocket className="w-5 h-5 text-orange-600" />
          <div className="text-sm text-left">
            <span className="font-bold">LAUNCH OFFER: 50% OFF</span> for the first 500 businesses
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Choose the Perfect Plan to Grow</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-16">
          More visibility, more leads, more customers, more growth.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          
          {/* STARTER */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-left relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
            <p className="text-slate-500 mb-6 min-h-[40px] text-sm">Perfect for Getting Started</p>
            
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">₹0</span>
              <span className="text-slate-500 font-medium"> /year</span>
            </div>
            
            <Link href="/register" className="mt-auto">
              <Button variant="outline" className="w-full h-10 text-sm font-semibold mb-6">Start Free</Button>
            </Link>
            
            <ul className="space-y-3 mt-auto flex-1">
              {[
                "1 Business Listing", "Business Profile", "10 Project Photos", 
                "2 Project Videos", "Portfolio Showcase", "Contact Form", 
                "Google Map Location", "Customer Reviews", "3 Service Categories", 
                "Working Hours", "Mobile-Friendly Profile", "Basic Search Visibility"
              ].map((f, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PROFESSIONAL */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-left relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
            <p className="text-slate-500 mb-6 min-h-[40px] text-sm">Best for Small Businesses</p>
            
            <div className="mb-6 flex flex-col">
              <span className="text-sm font-bold text-slate-400 line-through">₹9,999 /year</span>
              <div>
                <span className="text-4xl font-extrabold text-slate-900">₹4,999</span>
                <span className="text-slate-500 font-medium"> /year</span>
              </div>
            </div>
            
            <Link href="/dashboard" className="mt-auto">
              <Button variant="outline" className="w-full h-10 text-sm font-semibold mb-6 border-blue-600 text-blue-600 hover:bg-blue-50">Choose Plan</Button>
            </Link>
            
            <ul className="space-y-3 mt-auto flex-1">
              {[
                "1 Business Listing", "100 Project Photos", "10 Project Videos",
                {text: "Verified Business Badge", icon: true}, "WhatsApp Chat",
                "Click-to-Call", "Website & Social Links", "Higher Search Ranking",
                "Instant Lead Alerts", "Unlimited Portfolio", "Unlimited Service Areas",
                "Quote Request Button", "Performance Insights", "Before & After Gallery",
                "Fast Response Badge", "Customer Trust Score"
              ].map((f, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 flex items-center gap-1">
                    {typeof f === 'string' ? f : f.text}
                    {typeof f !== 'string' && f.icon && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" stroke="white" />}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* BUSINESS - MOST POPULAR */}
          <div className="bg-[#0b1b36] rounded-2xl border shadow-xl p-6 text-left relative overflow-hidden flex flex-col transform md:-translate-y-2">
            <div className="absolute top-0 right-0 bg-[#ff6b00] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#ff6b00] fill-[#ff6b00]" /> Business
            </h3>
            <p className="text-slate-300 mb-6 min-h-[40px] text-sm">Best Value for Growing Businesses</p>
            
            <div className="mb-6 flex flex-col">
              <span className="text-sm font-bold text-slate-400 line-through">₹23,999 /year</span>
              <div>
                <span className="text-4xl font-extrabold text-white">₹11,999</span>
                <span className="text-slate-400 font-medium"> /year</span>
              </div>
            </div>
            
            <Link href="/dashboard" className="mt-auto">
              <Button className="w-full h-10 text-sm font-semibold mb-6 bg-[#ff6b00] hover:bg-[#ea580c] border-none text-white shadow-lg">Choose Plan</Button>
            </Link>
            
            <ul className="space-y-3 mt-auto text-slate-200 flex-1">
              {[
                "1 Business Listing", "Unlimited Photos & Videos", "Homepage Spotlight (Monthly)",
                "Top Search Placement", "Unlimited Lead Access", "Lead Manager (CRM)",
                "Team Member Profiles", "AI Business Profile", "AI SEO Optimization",
                "Download Leads (Excel)", "Performance Reports", "Promotional Banner",
                "Google Review Sync", "Multiple Contact Numbers", "Instant Lead Alerts",
                "Verified Business Certificate"
              ].map((f, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PREMIUM */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-left relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500 fill-orange-500" /> Premium
            </h3>
            <p className="text-slate-500 mb-6 min-h-[40px] text-sm">For Established & Large Brands</p>
            
            <div className="mb-6 flex flex-col">
              <span className="text-sm font-bold text-slate-400 line-through">₹49,999 /year</span>
              <div>
                <span className="text-4xl font-extrabold text-slate-900">₹24,999</span>
                <span className="text-slate-500 font-medium"> /year</span>
              </div>
            </div>
            
            <Link href="/contact" className="mt-auto">
              <Button variant="outline" className="w-full h-10 text-sm font-semibold mb-6 border-[#0b1b36] text-[#0b1b36] hover:bg-[#0b1b36] hover:text-white">Choose Plan</Button>
            </Link>
            
            <ul className="space-y-3 mt-auto flex-1">
              {[
                "1 Business Listing", "Top Search Priority", {text: "Gold Verified Badge", icon: true},
                "Premium Profile Design", "AI Lead Matching", "Online Appointment Booking",
                "WhatsApp Business Integration", "Auto Lead Reply", "Monthly SEO Boost",
                "Advanced Analytics", "Business Growth Reports", "Cost Estimator",
                "3D Business Showcase", "Premium Advertisement Banner", "Priority Support",
                "Early Access to New Features"
              ].map((f, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 flex items-center gap-1">
                    {typeof f === 'string' ? f : f.text}
                    {typeof f !== 'string' && f.icon && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        {/* Value Proposition Bottom Banner - Clean UI style */}
        <div className="mt-16 bg-white border rounded-xl p-8 max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6 text-left shadow-sm">
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <Search className="w-8 h-8 text-slate-400" />
            <div>
              <div className="font-bold text-slate-900">Get More Leads</div>
              <div className="text-sm text-slate-500">Connect with genuine customers</div>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <ShieldCheck className="w-8 h-8 text-slate-400" />
            <div>
              <div className="font-bold text-slate-900">Build Trust</div>
              <div className="text-sm text-slate-500">Verified profiles & customer reviews</div>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <Building2 className="w-8 h-8 text-slate-400" />
            <div>
              <div className="font-bold text-slate-900">Grow Faster</div>
              <div className="text-sm text-slate-500">Boost visibility & generate more business</div>
            </div>
          </div>
        </div>
        
        {/* Footer Trust Section */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-slate-600 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400" /> Trusted by Thousands of Interior Professionals
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-500" />
            <Star className="w-4 h-4 fill-yellow-500" />
            <Star className="w-4 h-4 fill-yellow-500" />
            <Star className="w-4 h-4 fill-yellow-500" />
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className="text-slate-600 ml-1">4.8/5 Rating</span>
          </div>
        </div>

      </div>
    </div>
  );
}
