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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl border shadow-sm p-8 text-left relative overflow-hidden">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">Perfect for new professionals getting started.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">Free</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full h-12 text-base font-semibold mb-8">Current Plan</Button>
            </Link>
            <ul className="space-y-4">
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-300 shrink-0" /><span className="text-slate-600">Basic Profile Listing</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-300 shrink-0" /><span className="text-slate-600">Pay-per-lead unlocks</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-300 shrink-0" /><span className="text-slate-600">Standard Support</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-slate-300 shrink-0" /><span className="text-slate-600">Up to 3 Portfolio Images</span></li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-[#0b1b36] rounded-2xl border shadow-xl p-8 text-left relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-[#ff6b00] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Star className="w-6 h-6 text-[#ff6b00] fill-[#ff6b00]" /> Premium</h3>
            <p className="text-slate-300 mb-6 min-h-[48px]">For growing businesses that want more leads.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">₹1,999</span><span className="text-slate-400">/month</span>
            </div>
            <Link href="/dashboard">
              <Button className="w-full h-12 text-base font-semibold mb-8 bg-[#ff6b00] hover:bg-[#ea580c] border-none text-white shadow-lg">Upgrade to Premium</Button>
            </Link>
            <ul className="space-y-4 text-slate-200">
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#ff6b00] shrink-0" /><span>Verified Badge on Profile</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#ff6b00] shrink-0" /><span>Rank higher in search results</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#ff6b00] shrink-0" /><span>20% Discount on Lead Unlocks</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#ff6b00] shrink-0" /><span>Unlimited Portfolio Images</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#ff6b00] shrink-0" /><span>Priority Support</span></li>
            </ul>
          </div>

          {/* Elite Plan */}
          <div className="bg-white rounded-2xl border shadow-sm p-8 text-left relative overflow-hidden">
            <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Elite</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">Maximum visibility and unlimited access.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₹4,999</span><span className="text-slate-500">/month</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full h-12 text-base font-semibold mb-8 border-[#0b1b36] text-[#0b1b36] hover:bg-[#0b1b36] hover:text-white">Contact Sales</Button>
            </Link>
            <ul className="space-y-4">
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /><span className="text-slate-600 font-semibold">Top 3 Ranking Guarantee</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /><span className="text-slate-600">Dedicated Account Manager</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /><span className="text-slate-600">50% Discount on Lead Unlocks</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /><span className="text-slate-600">Featured in Weekly Newsletter</span></li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /><span className="text-slate-600">Custom SEO Profile Link</span></li>
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
