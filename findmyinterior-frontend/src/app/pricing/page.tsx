import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pricing Plans | Find My Interior",
  description: "Upgrade your professional profile on Find My Interior to rank higher, unlock more leads, and grow your business.",
};

export default function PricingPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Grow Your Business with Premium</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-16">
          Choose a subscription plan that fits your goals. Get more visibility, direct client calls, and higher trust.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-left relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
            <p className="text-slate-500 mb-6 min-h-[40px] text-sm">Perfect for new professionals getting started.</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold">Free</span>
            </div>
            <Link href="/dashboard" className="mt-auto">
              <Button variant="outline" className="w-full h-10 text-sm font-semibold mb-6">Current Plan</Button>
            </Link>
            <ul className="space-y-3 mt-auto">
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" /><span className="text-slate-600">1 Active Listing</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" /><span className="text-slate-600">Up to 5 Gallery Images</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" /><span className="text-slate-600">Contact Inquiry Form</span></li>
            </ul>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-left relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
            <p className="text-slate-500 mb-6 min-h-[40px] text-sm">Great for establishing your presence.</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-slate-900">₹999</span><span className="text-slate-500">/mo</span>
            </div>
            <Link href="/dashboard" className="mt-auto">
              <Button variant="outline" className="w-full h-10 text-sm font-semibold mb-6">Upgrade</Button>
            </Link>
            <ul className="space-y-3 mt-auto">
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /><span className="text-slate-600">3 Active Listings</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /><span className="text-slate-600">Priority in Search</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /><span className="text-slate-600">Verified Badge</span></li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-[#0b1b36] rounded-2xl border shadow-xl p-6 text-left relative overflow-hidden flex flex-col transform md:-translate-y-2">
            <div className="absolute top-0 right-0 bg-[#ff6b00] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-[#ff6b00] fill-[#ff6b00]" /> Premium</h3>
            <p className="text-slate-300 mb-6 min-h-[40px] text-sm">For growing businesses that want more leads.</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-white">₹4,999</span><span className="text-slate-400">/mo</span>
            </div>
            <Link href="/dashboard" className="mt-auto">
              <Button className="w-full h-10 text-sm font-semibold mb-6 bg-[#ff6b00] hover:bg-[#ea580c] border-none text-white shadow-lg">Upgrade to Premium</Button>
            </Link>
            <ul className="space-y-3 mt-auto text-slate-200">
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" /><span>10 Active Listings</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" /><span>Featured Placement</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" /><span>Unlimited Gallery Images</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" /><span>WhatsApp + Email Alerts</span></li>
            </ul>
          </div>

          {/* Elite Plan */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 text-left relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Elite</h3>
            <p className="text-slate-500 mb-6 min-h-[40px] text-sm">Maximum visibility and unlimited access.</p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold">₹14,999</span><span className="text-slate-500">/mo</span>
            </div>
            <Link href="/dashboard" className="mt-auto">
              <Button variant="outline" className="w-full h-10 text-sm font-semibold mb-6 border-[#0b1b36] text-[#0b1b36] hover:bg-[#0b1b36] hover:text-white">Contact Sales</Button>
            </Link>
            <ul className="space-y-3 mt-auto">
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span className="text-slate-600">Unlimited Active Listings</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span className="text-slate-600">Dedicated Account Manager</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span className="text-slate-600">50% Discount on Lead Unlocks</span></li>
              <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span className="text-slate-600">Featured in Weekly Newsletter</span></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 bg-orange-50 border border-orange-100 rounded-xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Need a Custom Plan?</h3>
            <p className="text-slate-600">For large agencies and enterprise teams needing bulk unlocks and API integrations.</p>
          </div>
          <Link href="/contact">
            <Button className="bg-[#0b1b36] text-white hover:bg-slate-800 h-12 px-8 whitespace-nowrap">Contact Enterprise Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
