import Link from "next/link";
import React from "react";

// Beautiful custom multi-layered SVG icons matching professional home improvement design systems
const customIcons: Record<string, React.ReactNode> = {
  "interior-designers": (
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="16" width="32" height="14" rx="4" fill="#FFE5D0" />
      <path d="M8 16V12C8 9.79 9.79 8 12 8H28C30.21 8 32 9.79 32 12V16" stroke="#0A1C3A" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="6" y="16" width="28" height="12" rx="3" fill="#FFF" stroke="#0A1C3A" strokeWidth="2.2" />
      <rect x="14" y="11" width="12" height="7" rx="2" fill="#E8701A" />
      <path d="M7 28V32M33 28V32" stroke="#0A1C3A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  "architects": (
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="28" height="24" rx="4" fill="#EBF3FF" stroke="#0A1C3A" strokeWidth="2.2" />
      <path d="M20 13L13 27H27L20 13Z" fill="#FFE5D0" stroke="#E8701A" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="20" cy="17" r="2.5" fill="#0A1C3A" />
      <path d="M16 23H24" stroke="#0A1C3A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  "builders": (
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="20" height="26" rx="3" fill="#FFF" stroke="#0A1C3A" strokeWidth="2.2" />
      <rect x="14" y="12" width="4" height="4" rx="1" fill="#E8701A" />
      <rect x="22" y="12" width="4" height="4" rx="1" fill="#FFE5D0" />
      <rect x="14" y="19" width="4" height="4" rx="1" fill="#FFE5D0" />
      <rect x="22" y="19" width="4" height="4" rx="1" fill="#E8701A" />
      <path d="M17 34V27H23V34" fill="#0A1C3A" />
    </svg>
  ),
  "civil-contractors": (
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 23C10 16.9249 14.4772 12 20 12C25.5228 12 30 16.9249 30 23V25H10V23Z" fill="#E8701A" stroke="#0A1C3A" strokeWidth="2.2" />
      <path d="M7 25H33V28C33 29.1 32.1 30 31 30H9C7.9 30 7 29.1 7 28V25Z" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="2.2" />
      <rect x="18" y="9" width="4" height="3" rx="1" fill="#0A1C3A" />
      <circle cx="20" cy="20" r="3" fill="#FFF" />
    </svg>
  ),
  "modular-kitchen-experts": (
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="28" height="14" rx="3" fill="#FFF" stroke="#0A1C3A" strokeWidth="2.2" />
      <path d="M6 26H34" stroke="#0A1C3A" strokeWidth="2" />
      <rect x="10" y="22" width="6" height="2" rx="1" fill="#E8701A" />
      <rect x="24" y="22" width="6" height="2" rx="1" fill="#E8701A" />
      <path d="M14 7H26V13H14V7Z" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="2" />
      <path d="M10 13H30" stroke="#E8701A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  "default": (
    <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="24" height="24" rx="6" fill="#FFE5D0" stroke="#0A1C3A" strokeWidth="2.2" />
      <circle cx="20" cy="20" r="4" fill="#E8701A" />
    </svg>
  )
};

const exactCategories = [
  { name: "Restaurants", slug: "restaurants" },
  { name: "Salons & Beauty", slug: "salons-and-beauty" },
  { name: "Event Management", slug: "event-management" },
  { name: "Fitness & Gyms", slug: "fitness-and-gyms" },
  { name: "Digital Marketing & IT", slug: "digital-marketing" },
  { name: "Repair & Maintenance", slug: "repair-and-maintenance" },
  { name: "Interior & Architecture", slug: "interior-and-architecture" },
  { name: "Education & Coaching", slug: "education-and-coaching" },
  { name: "Hospitals & Healthcare", slug: "hospitals-and-healthcare" },
  { name: "Hotels & Lodging", slug: "hotels-and-lodging" },
  { name: "Interior Designers", slug: "interior-designers" },
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
            <Link href="/professionals" className="text-xs font-bold text-[#E8701A] hover:underline">
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
                key={idx}
                className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 min-w-[90px] w-[90px] shrink-0 hover:border-orange-200 transition-all"
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
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 min-w-[90px] w-[90px] shrink-0"
            >
              <div className="relative flex items-center justify-center w-12 h-12 mb-1">
                <div className="absolute w-8 h-8 bg-slate-50 dark:bg-slate-700 rounded-full bottom-0 left-0"></div>
                <div className="relative z-10 text-slate-700 dark:text-slate-300">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </div>
              </div>
              <span className="text-[10px] font-bold text-center text-slate-700 dark:text-slate-300 leading-tight">
                More
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
          <Link href="/professionals" className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:flex xl:flex-wrap justify-start gap-3 md:gap-4">
          {exactCategories.map((category, idx) => (
            <Link 
              href={`/professionals?category=${category.slug}`}
              key={idx}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer xl:w-[calc(10%-15px)] min-w-[100px]"
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
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer xl:w-[calc(10%-15px)] min-w-[100px]"
          >
            <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
              {customIcons.default}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
              More Services
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

