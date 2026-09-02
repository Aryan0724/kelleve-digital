import { ShieldCheck, Search, Clock, Lock, Phone, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export function TrustFooter() {
  const brands = [
    "Kleve Kitchens", "Kleve HomeFit", "Kleve Alumina", "Kleve Living", 
    "FloorWale", "WallWale", "CeilingWale", "PainterBhai", 
    "Bathroom Makers", "GharNirman", "Ceeniesta", "Exterior Expert", 
    "Zero Degree", "Red Leaf"
  ];

  const phone1 = "+917070440365";
  const phone1Display = "+91 70704 40365";
  const phone2 = "+919534900999";
  const phone2Display = "+91 95349 00999";

  return (
    <section className="w-full flex flex-col font-sans">
      {/* Ecosystem Banner */}
      <div className="w-full bg-gradient-to-b from-white to-[#f8f9fa] dark:from-slate-900/50 dark:to-background py-8 border-b border-slate-200/50 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h4 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-6 flex items-center gap-4 w-full md:w-auto">
              <span className="hidden md:block h-px w-12 bg-slate-200 dark:bg-slate-700"></span>
              POWERED BY KLEVE ECOSYSTEM
              <span className="hidden md:block h-px w-12 bg-slate-200 dark:bg-slate-700"></span>
            </h4>
            <div className="flex flex-wrap items-center gap-4 md:gap-x-10 md:gap-y-6 justify-center max-w-5xl">
              {brands.map((brand, idx) => (
                <div key={idx} className="flex items-center text-sm md:text-[15px] font-extrabold text-slate-400 dark:text-slate-600 hover:text-[#0a1c3a] dark:hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Contact Banner */}
      <div className="w-full bg-[#0a1c3a] text-white py-4 md:py-0 md:h-20 flex items-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="grid grid-cols-2 md:flex md:flex-nowrap items-start md:items-center gap-4 md:gap-8 flex-1 w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-3">
              <ShieldCheck className="w-6 h-6 text-[#E8701A] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold">Verified &amp; Trusted</span>
                <span className="text-[10px] text-gray-300">Only verified professionals<br/>and businesses</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-3">
              <Search className="w-6 h-6 text-[#E8701A] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold">Transparent Pricing</span>
                <span className="text-[10px] text-gray-300">No hidden charges<br/>&nbsp;</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-3">
              <Clock className="w-6 h-6 text-[#E8701A] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold">Save Time &amp; Money</span>
                <span className="text-[10px] text-gray-300">Compare &amp; hire the best<br/>experts</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-3">
              <Lock className="w-6 h-6 text-[#E8701A] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold">Secure &amp; Safe</span>
                <span className="text-[10px] text-gray-300">100% secure transactions<br/>and data protection</span>
              </div>
            </div>
          </div>

          {/* Contact Box — fully clickable */}
          <div className="bg-[#E8701A] px-6 py-4 rounded-xl shrink-0 md:-mr-4 shadow-lg w-full md:w-auto">
            <p className="text-xs font-semibold text-white/90 mb-2 text-center">Need Help?</p>
            <div className="flex flex-col gap-2">
              {/* Call Only */}
              <a
                href={`tel:${phone1}`}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2"
              >
                <Phone className="w-4 h-4 text-white shrink-0" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-bold tracking-wide text-white">{phone1Display}</span>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-medium ml-2">Call</span>
                </div>
              </a>
              {/* WhatsApp Only */}
              <a
                href={`https://wa.me/${phone2}?text=Hi, I need help with FindMyInterior.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366]/90 hover:bg-[#25D366] transition-colors rounded-lg px-3 py-2"
              >
                <MessageCircle className="w-4 h-4 text-white shrink-0" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-bold tracking-wide text-white">{phone2Display}</span>
                  <span className="text-[10px] bg-black/20 text-white px-2 py-0.5 rounded font-medium ml-2">WhatsApp</span>
                </div>
              </a>
              {/* Contact Form */}
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors rounded-lg px-3 py-2"
              >
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span className="text-sm font-bold text-white">Send Message</span>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
