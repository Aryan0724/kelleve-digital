import { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Labour Requirement | Find My Interior",
  description: "Post labour requirements and find skilled workers for your construction or interior project.",
};

export default function LabourPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Labour Requirement</h1>
        <p className="text-slate-500 mb-8">
          Need workers for your project? Post a Labour requirement through our standard Post Requirement flow and get connected with skilled workers in your city.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/post-requirement"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Post Labour Requirement <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/professionals?search=Skilled+Worker"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#0a1c3a] text-[#0a1c3a] hover:bg-[#0a1c3a] hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Browse Skilled Workers
          </Link>
        </div>
      </div>
    </div>
  );
}
