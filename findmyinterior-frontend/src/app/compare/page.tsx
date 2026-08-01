import { Metadata } from "next";
import Link from "next/link";
import { GitCompare, ArrowRight, Star, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Experts | Find My Interior",
  description: "Compare verified interior designers, architects, and contractors side by side. Find the best professional for your project.",
};

export default function CompareExpertsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <GitCompare className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Compare Experts</h1>
        <p className="text-slate-500 mb-2">
          This feature is <span className="font-semibold text-orange-600">coming soon</span>!
        </p>
        <p className="text-slate-500 mb-8">
          Soon you'll be able to compare professionals side-by-side on ratings, pricing, experience, and reviews to make the best hiring decision.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 text-left space-y-3">
          <h2 className="font-bold text-slate-800 mb-2">What's coming:</h2>
          {["Side-by-side comparison of up to 4 professionals", "Compare ratings, experience & pricing", "View portfolio highlights", "Request quotes from multiple pros at once"].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
              <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-500 mb-6">In the meantime, browse professionals and compare their profiles manually.</p>
        <Link
          href="/professionals"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Browse Professionals <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
