import { ShieldCheck, Search, Clock, Lock, Phone } from "lucide-react";

export function TrustFooter() {
  const brands = [
    "Kleve Kitchens", "Kleve HomeFit", "Kleve Alumina", "Kleve Living", 
    "FloorWale", "WallWale", "CeilingWale", "PainterBhai", 
    "Bathroom Makers", "GharNirman", "Ceeniesta", "Exterior Expert", 
    "Zero Degree", "Red Leaf"
  ];

  return (
    <section className="w-full flex flex-col font-sans">
      {/* Ecosystem Banner */}
      <div className="w-full bg-[#f8f9fa] dark:bg-background py-6 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h4 className="text-[10px] font-extrabold text-gray-500 tracking-widest uppercase mb-4">
            POWERED BY KLEVE ECOSYSTEM
          </h4>
          <div className="flex flex-wrap items-center gap-4 md:gap-8 justify-center lg:justify-start">
            {brands.map((brand, idx) => (
              <div key={idx} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400 grayscale hover:grayscale-0 transition-all cursor-pointer">
                {brand}
              </div>
            ))}
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
                <span className="text-sm font-bold">Verified & Trusted</span>
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
                <span className="text-sm font-bold">Save Time & Money</span>
                <span className="text-[10px] text-gray-300">Compare & hire the best<br/>experts</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-3">
              <Lock className="w-6 h-6 text-[#E8701A] shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-bold">Secure & Safe</span>
                <span className="text-[10px] text-gray-300">100% secure transactions<br/>and data protection</span>
              </div>
            </div>
          </div>

          {/* Contact Box */}
          <div className="bg-[#E8701A] px-6 py-4 rounded-xl flex items-center justify-center gap-4 shrink-0 md:-mr-4 shadow-lg w-full md:w-auto">
            <Phone className="w-8 h-8 text-white" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white/90">Need Help? Call Us Now!</span>
              <span className="text-xl font-bold tracking-wide">+91 93043 55011</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
