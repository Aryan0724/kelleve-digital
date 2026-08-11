import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Presentation, Megaphone, MonitorPlay, Building2, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Advertise With Us | Find My Interior",
  description: "Reach thousands of homeowners and interior professionals. View our advertisement and corporate brand packages.",
};

export default function AdvertisePage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Brand Advertisement & Corporate Partnerships</h1>
            <p className="text-xl text-slate-600">
              Put your brand directly in front of homeowners, builders, and interior designers right when they are making purchasing decisions.
            </p>
          </div>

          {/* Website Banner Advertising */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <MonitorPlay className="w-8 h-8 text-orange-600" />
              <h2 className="text-3xl font-bold text-slate-900">Website Banner Advertising</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Basic */}
              <div className="bg-white rounded-2xl border shadow-sm p-6 text-left flex flex-col">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Basic Category</h3>
                <p className="text-slate-500 text-sm mb-4">Category Page Banner</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">₹5,000</span>
                  <span className="text-slate-500 font-medium"> /month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> 1 Banner Placement</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Click Tracking</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Basic Report</li>
                </ul>
                <Link href="/contact"><Button className="w-full" variant="outline">Contact Sales</Button></Link>
              </div>

              {/* Premium */}
              <div className="bg-white rounded-2xl border shadow-sm p-6 text-left flex flex-col">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Premium Category</h3>
                <p className="text-slate-500 text-sm mb-4">Category Top Banner</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">₹10,000</span>
                  <span className="text-slate-500 font-medium"> /month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Featured Position</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Click Tracking</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Enquiry Tracking</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> Monthly Report</li>
                </ul>
                <Link href="/contact"><Button className="w-full" variant="outline">Contact Sales</Button></Link>
              </div>

              {/* Homepage */}
              <div className="bg-white rounded-2xl border shadow-sm p-6 text-left flex flex-col">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Homepage Banner</h3>
                <p className="text-slate-500 text-sm mb-4">Premium Placement</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">₹15,000</span>
                  <span className="text-slate-500 font-medium"> /month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> Homepage Visibility</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> Premium Placement</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> Click Tracking</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> Enquiry Tracking</li>
                </ul>
                <Link href="/contact"><Button className="w-full" variant="outline">Contact Sales</Button></Link>
              </div>

              {/* Homepage Premium */}
              <div className="bg-[#0b1b36] text-white rounded-2xl border shadow-xl p-6 text-left flex flex-col md:-translate-y-2">
                <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center mb-4 border border-red-500/30">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                </div>
                <h3 className="text-xl font-bold mb-1">Homepage Premium</h3>
                <p className="text-slate-300 text-sm mb-4">High-Visibility Placement</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold">₹25,000</span>
                  <span className="text-slate-400 font-medium"> /month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> Ultimate Homepage Visibility</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> Category Promotion</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> Dedicated Brand Profile</li>
                  <li className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> Click/Enquiry Analytics</li>
                </ul>
                <Link href="/contact"><Button className="w-full bg-[#ff6b00] hover:bg-[#ea580c] border-none text-white">Contact Sales</Button></Link>
              </div>
            </div>
          </div>

          {/* Corporate Brand Packages */}
          <div className="mb-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <Building2 className="w-96 h-96" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-orange-400" />
                <h2 className="text-3xl font-bold">Corporate Brand Packages</h2>
              </div>
              <p className="text-slate-300 max-w-2xl mb-10 text-lg">
                Exclusive packages designed for National and Regional Brands like CenturyPly, Häfele, Asian Paints, and Kajaria to dominate the market.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 flex justify-between items-center">
                  <span className="font-bold text-lg">Brand Starter</span>
                  <span className="text-orange-400 font-bold text-xl">₹30,000<span className="text-sm font-normal text-slate-300">/mo</span></span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 flex justify-between items-center">
                  <span className="font-bold text-lg">Brand Growth</span>
                  <span className="text-orange-400 font-bold text-xl">₹50,000<span className="text-sm font-normal text-slate-300">/mo</span></span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 flex justify-between items-center">
                  <span className="font-bold text-lg">Brand Pro</span>
                  <span className="text-orange-400 font-bold text-xl">₹75,000<span className="text-sm font-normal text-slate-300">/mo</span></span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 flex justify-between items-center">
                  <span className="font-bold text-lg">Brand Dominance</span>
                  <span className="text-orange-400 font-bold text-xl">₹1,25,000<span className="text-sm font-normal text-slate-300">/mo</span></span>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl p-5 shadow-lg flex justify-between items-center md:col-span-2 lg:col-span-2">
                  <div>
                    <span className="font-bold text-lg block">Strategic Brand Partner</span>
                    <span className="text-orange-100 text-sm">Ultimate Platform Integration</span>
                  </div>
                  <span className="text-white font-bold text-2xl">₹2,00,000+<span className="text-sm font-normal text-orange-200">/mo</span></span>
                </div>
              </div>
              
              <Link href="/contact"><Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8">Talk to our Enterprise Team</Button></Link>
            </div>
          </div>

          {/* Hyper-Local & Sponsored Placements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">City-Based Advertising</h3>
              <p className="text-slate-600 mb-6">Target your local audience effectively by sponsoring specific categories in your city.</p>
              
              <div className="bg-slate-50 rounded-xl p-4 border mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-800">City Category Sponsor</span>
                  <span className="font-bold text-indigo-600 text-lg">₹7,500/mo</span>
                </div>
                <p className="text-sm text-slate-500 italic">Example: "Patna's Premium Hardware Partner"</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Sponsored Listings & Projects</h3>
              <p className="text-slate-600 mb-6">Boost your profile or sponsor relevant projects to capture immediate high-intent leads.</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-2">Sponsored Listing</h4>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 px-3 py-1 rounded-md text-sm font-medium">7 Days: <span className="text-slate-900 font-bold">₹499</span></span>
                    <span className="bg-slate-100 px-3 py-1 rounded-md text-sm font-medium">30 Days: <span className="text-slate-900 font-bold">₹1,499</span></span>
                    <span className="bg-slate-100 px-3 py-1 rounded-md text-sm font-medium">90 Days: <span className="text-slate-900 font-bold">₹3,999</span></span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-2">Sponsored Project Banner</h4>
                  <div className="flex gap-2 mb-2">
                    <span className="bg-slate-100 px-3 py-1 rounded-md text-sm font-medium">15 Days: <span className="text-slate-900 font-bold">₹2,500</span></span>
                    <span className="bg-slate-100 px-3 py-1 rounded-md text-sm font-medium">30 Days: <span className="text-slate-900 font-bold">₹5,000</span></span>
                  </div>
                  <p className="text-xs text-slate-500 italic">Example: "Recommended Hardware Partner — ABC Hardware" on a 3BHK project.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
