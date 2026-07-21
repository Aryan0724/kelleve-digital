import { Metadata } from "next";
import Link from "next/link";
import { Gavel, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Tender & Bidding | Find My Interior",
  description: "Post tenders and receive competitive bids from verified contractors and professionals.",
};

export default function TenderPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gavel className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Tender &amp; Bidding</h1>
        <p className="text-slate-500 mb-2">
          This feature is <span className="font-semibold text-indigo-600">coming soon</span>!
        </p>
        <p className="text-slate-500 mb-8">
          Soon contractors and professionals will be able to discover and bid on public tenders for large-scale construction and interior projects.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 text-left space-y-3">
          <h2 className="font-bold text-slate-800 mb-2">What's planned:</h2>
          {["Post tenders for large projects", "Receive sealed competitive bids", "Government & private sector tenders", "Automated bid comparison tools"].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
              <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <Link
          href="/post-requirement"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Post a Requirement Instead <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
