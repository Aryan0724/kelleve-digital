import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingTable from "@/components/pricing/PricingTable";
import { Sparkles, TrendingUp, ShieldCheck, Check } from "lucide-react";

export const metadata = {
  title: "Pricing & Plans | TrueDial",
  description: "Choose the right plan for your business growth on TrueDial.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] dark:bg-slate-950 text-navy dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full flex flex-col">
        {/* ── Hero Section ── */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/20 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm mb-6 border border-blue-100 dark:border-blue-800/50">
              <Sparkles className="w-4 h-4" />
              Grow Your Business With TrueDial
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              One Listing, Multiple Benefits, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-[#F59E0B]">
                Maximum Growth!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-2xl mx-auto">
              Join India's fastest-growing business network. Select a plan that fits your goals and let us help you reach more customers.
            </p>
            
            {/* Features Row */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                100% Verified Business
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Transparent Process
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Result Driven
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Table Section ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-20 -mt-10">
          <PricingTable />
        </section>

        {/* ── FAQ or Bottom CTA ── */}
        <section className="bg-slate-50 dark:bg-slate-900 py-16 px-4 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Need help choosing the right plan?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
              Our business growth experts are here to help you make the best decision for your brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:9534900999" className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Call Now: 95349 00999
              </a>
              <a href="https://wa.me/919534900999" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#25D366] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
