import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PricingClient } from "@/components/pricing/PricingClient";

export const metadata = {
  title: "Pricing Plans | Find My Interior",
  description: "Upgrade your professional profile on Find My Interior to rank higher, unlock more leads, and grow your business with transparent, backend-enforced subscription tiers.",
};

export default function PricingPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 transition-colors">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-950/60 rounded-full mb-3">
            Transparent Pricing & Live Backend Enforcement
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Grow Your Interior Business with Premium Reach
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose a subscription plan tailored to your scale. Gain higher search ranking, direct verified client leads, and discounted contact unlocks.
          </p>
        </div>

        {/* Dynamic 4-Plan Interactive Pricing Component */}
        <PricingClient />

        {/* Enterprise & Custom Plan Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-900 border border-orange-100 dark:border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-sm">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Need a Custom Enterprise Plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              For large architectural firms, developers, and suppliers requiring bulk unlock discounts, multi-city listings, and API integration.
            </p>
          </div>
          <Link href="/contact">
            <Button className="bg-[#0b1b36] text-white hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 h-12 px-8 whitespace-nowrap font-semibold shadow-md">
              Contact Enterprise Sales
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
