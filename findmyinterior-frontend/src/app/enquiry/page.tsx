import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Manual Enquiry | Find My Interior",
  description: "Send a manual enquiry to our team and we'll help match you with the right professionals.",
};

export default function EnquiryPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Manual Enquiry</h1>
        <p className="text-slate-500 mb-8">
          Our team will personally match you with the right professionals for your project.
          The easiest way to get started is to post a requirement or contact us directly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/post-requirement"
            className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            <ClipboardList className="w-4 h-4" /> Post Requirement
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#0a1c3a] text-[#0a1c3a] hover:bg-[#0a1c3a] hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Contact Our Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
