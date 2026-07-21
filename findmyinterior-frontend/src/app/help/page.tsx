import { Metadata } from "next";
import { ShieldAlert, PhoneCall, Mail, CheckCircle, MessageCircle, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help & Support | Find My Interior",
  description: "Get help with FindMyInterior — call us, WhatsApp us, email us, or browse our FAQ. We're here Mon-Sat, 9am-6pm.",
};

const FAQS = [
  {
    q: "How do I post a requirement?",
    a: "Click the 'Post Requirement' button in the navigation bar, select what you need (Interior Design, Construction, etc.), fill in the details, and start receiving bids from verified professionals.",
  },
  {
    q: "How do I list my business?",
    a: "Register as a professional. Once logged in, go to your dashboard and look for the 'Business Listing' section to create and publish your public profile.",
  },
  {
    q: "Are the professionals verified?",
    a: "Yes, we conduct background checks and verify the identity and credentials of professionals before awarding them a 'Verified' badge.",
  },
  {
    q: "How do I contact a professional?",
    a: "Open a professional's profile page. You'll find their phone number, WhatsApp, email, and location listed there. You can also send them an enquiry directly through the form on their profile.",
  },
  {
    q: "Is FindMyInterior free to use for homeowners?",
    a: "Yes! Posting requirements, browsing professionals, and receiving quotes is completely free for homeowners and customers.",
  },
  {
    q: "How do I report an issue with a professional?",
    a: "Go to the professional's profile and use the 'Report' option, or visit our Contact page and select 'Report an Issue'. Our Trust & Safety team will review it within 24 hours.",
  },
];

export default function HelpAndSupportPage() {
  const phone = "+919304355011";
  const phoneDisplay = "+91 93043 55011";

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0a1c3a] to-[#1a3060] text-white py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help you?</h1>
          <p className="text-lg text-white/80">
            Find answers to common questions or reach out to our support team directly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-8 pb-20">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {/* Call */}
          <a
            href={`tel:${phone}`}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md hover:border-orange-300 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <PhoneCall className="w-7 h-7 text-orange-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Call Us</h2>
            <p className="text-slate-500 text-sm mb-4">Mon–Sat, 9am–6pm</p>
            <span className="text-orange-600 font-bold text-lg">{phoneDisplay}</span>
            <span className="mt-3 text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-medium">Tap to Call</span>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${phone}?text=Hi, I need help with FindMyInterior.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md hover:border-green-300 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <MessageCircle className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">WhatsApp</h2>
            <p className="text-slate-500 text-sm mb-4">Get a reply within minutes</p>
            <span className="text-green-700 font-bold text-lg">{phoneDisplay}</span>
            <span className="mt-3 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">Chat Now</span>
          </a>

          {/* Email / Contact Form */}
          <Link
            href="/contact"
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Email / Contact Form</h2>
            <p className="text-slate-500 text-sm mb-4">We reply within 24 hours</p>
            <span className="text-blue-600 font-bold">support@findmyinterior.com</span>
            <span className="mt-3 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              Open Contact Form <ExternalLink className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* Report Issue */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 mb-12 flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-900">Trust &amp; Safety</h3>
            <p className="text-slate-500 text-sm">Report a problem with a professional, a listing, or a transaction.</p>
          </div>
          <Link
            href="/contact"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex-shrink-0"
          >
            Report an Issue
          </Link>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                <h3 className="text-base font-semibold text-slate-900 flex items-start gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-slate-600 pl-7 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
