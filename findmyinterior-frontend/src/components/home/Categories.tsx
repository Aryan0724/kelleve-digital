import Link from "next/link";
import React from "react";

// Premium recognizable SVG icons per profession
const customIcons: Record<string, React.ReactNode> = {
  "interior-designers": (
    // Sofa / armchair — universally recognizable for interior design
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sofa base */}
      <rect x="6" y="22" width="28" height="9" rx="3" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="2"/>
      {/* Back cushion */}
      <rect x="8" y="15" width="24" height="9" rx="3" fill="#FFF" stroke="#0A1C3A" strokeWidth="2"/>
      {/* Left armrest */}
      <rect x="4" y="19" width="6" height="12" rx="2.5" fill="#E8701A" stroke="#0A1C3A" strokeWidth="2"/>
      {/* Right armrest */}
      <rect x="30" y="19" width="6" height="12" rx="2.5" fill="#E8701A" stroke="#0A1C3A" strokeWidth="2"/>
      {/* Legs */}
      <line x1="10" y1="31" x2="10" y2="35" stroke="#0A1C3A" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="30" y1="31" x2="30" y2="35" stroke="#0A1C3A" strokeWidth="2.2" strokeLinecap="round"/>
      {/* Cushion divider */}
      <line x1="20" y1="22" x2="20" y2="31" stroke="#0A1C3A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 1.5"/>
    </svg>
  ),
  "architects": (
    // Blueprint/ruler + compass — architect's tool
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blueprint sheet */}
      <rect x="6" y="7" width="22" height="26" rx="3" fill="#EBF3FF" stroke="#0A1C3A" strokeWidth="2"/>
      {/* Blueprint grid lines */}
      <line x1="6" y1="14" x2="28" y2="14" stroke="#0A1C3A" strokeWidth="1" strokeDasharray="2.5 2"/>
      <line x1="6" y1="20" x2="28" y2="20" stroke="#0A1C3A" strokeWidth="1" strokeDasharray="2.5 2"/>
      <line x1="14" y1="7" x2="14" y2="33" stroke="#0A1C3A" strokeWidth="1" strokeDasharray="2.5 2"/>
      <line x1="21" y1="7" x2="21" y2="33" stroke="#0A1C3A" strokeWidth="1" strokeDasharray="2.5 2"/>
      {/* House shape on blueprint */}
      <path d="M10 26 L10 19 L17 14 L24 19 L24 26Z" fill="#FFE5D0" stroke="#E8701A" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Ruler on right edge */}
      <rect x="28" y="7" width="5" height="26" rx="1.5" fill="#E8701A" stroke="#0A1C3A" strokeWidth="1.5"/>
      <line x1="28" y1="12" x2="30.5" y2="12" stroke="#0A1C3A" strokeWidth="1.2"/>
      <line x1="28" y1="17" x2="30.5" y2="17" stroke="#0A1C3A" strokeWidth="1.2"/>
      <line x1="28" y1="22" x2="30.5" y2="22" stroke="#0A1C3A" strokeWidth="1.2"/>
      <line x1="28" y1="27" x2="30.5" y2="27" stroke="#0A1C3A" strokeWidth="1.2"/>
    </svg>
  ),
  "builders": (
    // Building under construction with crane beam
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Building structure */}
      <rect x="8" y="14" width="20" height="20" rx="2" fill="#FFF" stroke="#0A1C3A" strokeWidth="2"/>
      {/* Windows */}
      <rect x="12" y="18" width="4" height="4" rx="1" fill="#E8701A"/>
      <rect x="20" y="18" width="4" height="4" rx="1" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="1"/>
      <rect x="12" y="25" width="4" height="4" rx="1" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="1"/>
      <rect x="20" y="25" width="4" height="4" rx="1" fill="#E8701A"/>
      {/* Door */}
      <rect x="16" y="29" width="4" height="5" rx="1" fill="#0A1C3A"/>
      {/* Crane vertical */}
      <line x1="30" y1="8" x2="30" y2="30" stroke="#0A1C3A" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Crane arm */}
      <line x1="16" y1="8" x2="30" y2="8" stroke="#E8701A" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Crane hook line */}
      <line x1="20" y1="8" x2="20" y2="14" stroke="#0A1C3A" strokeWidth="1.5" strokeDasharray="2 1.5"/>
    </svg>
  ),
  "civil-contractors": (
    // Hard hat — universally recognized for contractors/construction
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hard hat dome */}
      <path d="M7 25 C7 15 11 9 20 9 C29 9 33 15 33 25" fill="#E8701A" stroke="#0A1C3A" strokeWidth="2" strokeLinejoin="round"/>
      {/* Brim */}
      <rect x="5" y="24" width="30" height="4" rx="2" fill="#0A1C3A"/>
      {/* Ventilation strip */}
      <rect x="17" y="9" width="6" height="14" rx="3" fill="#FFE5D0" opacity="0.7"/>
      {/* Side vents */}
      <line x1="10" y1="18" x2="30" y2="18" stroke="#FFE5D0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      {/* Tools crossed underneath */}
      <path d="M13 31 L16 35 M21 31 L24 35" stroke="#0A1C3A" strokeWidth="2" strokeLinecap="round" opacity="0"/>
    </svg>
  ),
  "modular-kitchen-experts": (
    // Kitchen stove/oven with burners — instantly recognizable
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Oven body */}
      <rect x="5" y="16" width="30" height="18" rx="3" fill="#FFF" stroke="#0A1C3A" strokeWidth="2"/>
      {/* Oven window */}
      <rect x="11" y="21" width="18" height="10" rx="2" fill="#EBF3FF" stroke="#0A1C3A" strokeWidth="1.5"/>
      {/* Oven handle */}
      <line x1="13" y1="19" x2="27" y2="19" stroke="#E8701A" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Stovetop surface */}
      <rect x="5" y="10" width="30" height="8" rx="2" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="2"/>
      {/* Burners */}
      <circle cx="13" cy="14" r="2.5" fill="none" stroke="#0A1C3A" strokeWidth="1.8"/>
      <circle cx="13" cy="14" r="1" fill="#E8701A"/>
      <circle cx="27" cy="14" r="2.5" fill="none" stroke="#0A1C3A" strokeWidth="1.8"/>
      <circle cx="27" cy="14" r="1" fill="#E8701A"/>
      {/* Control knobs */}
      <circle cx="20" cy="14" r="1.5" fill="#0A1C3A"/>
    </svg>
  ),
  "painters": (
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="6" width="20" height="12" rx="3" fill="#EBF3FF" stroke="#0A1C3A" strokeWidth="2"/>
      <rect x="8" y="16" width="24" height="4" rx="2" fill="#E8701A" stroke="#0A1C3A" strokeWidth="1.5"/>
      <line x1="20" y1="20" x2="20" y2="34" stroke="#0A1C3A" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="20" cy="34" rx="4" ry="1.5" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="1.5"/>
    </svg>
  ),
  "default": (
    // Grid / apps icon for "More" — much cleaner than three dots
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="7" width="10" height="10" rx="2.5" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="2"/>
      <rect x="23" y="7" width="10" height="10" rx="2.5" fill="#E8701A" stroke="#0A1C3A" strokeWidth="2"/>
      <rect x="7" y="23" width="10" height="10" rx="2.5" fill="#E8701A" stroke="#0A1C3A" strokeWidth="2"/>
      <rect x="23" y="23" width="10" height="10" rx="2.5" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="2"/>
    </svg>
  )
};


const exactCategories = [
  { name: "Interior Designers", slug: "interior-designers" },
  { name: "Architects", slug: "architects" },
  { name: "Civil Contractors", slug: "civil-contractors" },
  { name: "Builders", slug: "builders" },
  { name: "Modular Kitchen", slug: "modular-kitchen-experts" },
  { name: "Painters", slug: "painters" },
  { name: "Suppliers & Vendors", slug: "suppliers-and-vendors" },
  { name: "Skilled Workers", slug: "skilled-workers" },
];

export function Categories({ categories }: { categories?: Array<Record<string, unknown>> }) {
  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-background lg:py-8 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="lg:hidden w-full bg-white dark:bg-slate-900 py-6 mt-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[1.15rem] font-black text-[#0a1c3a] dark:text-white">
              Find the Right Professional
            </h2>
            <Link 
              href="/professionals" 
              prefetch={true}
              className="text-xs font-bold text-[#E8701A] dark:text-orange-400 hover:underline active:scale-95 transition-all"
            >
              View All
            </Link>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 px-1">
            {[
              { name: "Interior Designers", slug: "interior-designers" },
              { name: "Architects", slug: "architects" },
              { name: "Builders", slug: "builders" },
              { name: "Contractors", slug: "civil-contractors" },
              { name: "Modular Kitchen", slug: "modular-kitchen-experts" },
            ].map((category, idx) => (
              <Link 
                href={`/professionals?category=${category.slug}`}
                prefetch={true}
                key={idx}
                className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 min-w-[90px] w-[90px] shrink-0 hover:border-orange-200 dark:hover:border-orange-700 active:scale-95 cursor-pointer transition-all duration-150"
              >
                <div className="relative flex items-center justify-center w-12 h-12 mb-1">
                  <div className="absolute w-8 h-8 bg-orange-50 dark:bg-orange-900/40 rounded-full bottom-0 left-0"></div>
                  <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                    {customIcons[category.slug] || customIcons.default}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                  {category.name}
                </span>
              </Link>
            ))}

            <Link 
              href="/professionals"
              prefetch={true}
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 min-w-[90px] w-[90px] shrink-0 hover:border-orange-200 dark:hover:border-orange-700 active:scale-95 cursor-pointer transition-all duration-150"
            >
              <div className="relative flex items-center justify-center w-12 h-12 mb-1">
                <div className="absolute w-8 h-8 bg-orange-50 dark:bg-orange-900/40 rounded-full bottom-0 left-0"></div>
                <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                  {customIcons.default}
                </div>
              </div>
              <span className="text-[10px] font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                View All
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:block container mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-[1.1rem] font-bold text-[#0a1c3a] dark:text-white uppercase tracking-wide">
            BROWSE BY SERVICES
          </h2>
          <Link 
            href="/professionals" 
            prefetch={true}
            className="text-sm font-semibold text-[#E8701A] dark:text-orange-400 hover:underline active:scale-95 transition-all"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:flex xl:flex-wrap justify-start gap-3 md:gap-4">
          {exactCategories.map((category, idx) => (
            <Link 
              href={`/professionals?category=${category.slug}`}
              prefetch={true}
              key={idx}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-700 active:scale-95 transition-all cursor-pointer xl:w-[calc(10%-15px)] min-w-[100px]"
            >
              <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
                {customIcons[category.slug] || customIcons.default}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
          <Link 
            href="/professionals"
            prefetch={true}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-700 active:scale-95 transition-all cursor-pointer xl:w-[calc(10%-15px)] min-w-[100px]"
          >
            <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
              {customIcons.default}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
              View All
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}


