import Link from "next/link";
import React from "react";
import { Sofa, Ruler, Building2, HardHat, ChefHat, PaintRoller, Package, Hammer, LayoutGrid } from "lucide-react";

// Mobile 6 specific categories matching reference mockup
const mobileCategories = [
  {
    name: "Interior Designers",
    slug: "interior-designers",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lamp */}
        <path d="M12 28V12" stroke="#0a1c3a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 12L12 8L16 12H8Z" fill="#F97316" stroke="#0a1c3a" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="9" y1="28" x2="15" y2="28" stroke="#0a1c3a" strokeWidth="1.8" strokeLinecap="round" />
        {/* Armchair */}
        <rect x="18" y="16" width="16" height="10" rx="3" fill="#FFE8D6" stroke="#0a1c3a" strokeWidth="1.8" />
        <path d="M16 20H18V24H16C15.4 24 15 23.6 15 23V21C15 20.4 15.4 20 16 20Z" fill="#F97316" stroke="#0a1c3a" strokeWidth="1.6" />
        <path d="M34 20H36C36.6 20 37 20.4 37 21V23C37 23.6 36.6 24 36 24H34V20Z" fill="#F97316" stroke="#0a1c3a" strokeWidth="1.6" />
        <line x1="20" y1="26" x2="19" y2="29" stroke="#0a1c3a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="32" y1="26" x2="33" y2="29" stroke="#0a1c3a" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Architects",
    slug: "architects",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="11" r="3" fill="#F97316" stroke="#0a1c3a" strokeWidth="1.8" />
        <line x1="20" y1="8" x2="20" y2="5" stroke="#0a1c3a" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 13L10 32" stroke="#0a1c3a" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 13L30 32" stroke="#0a1c3a" strokeWidth="2" strokeLinecap="round" />
        <path d="M13 24C16.5 22 23.5 22 27 24" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Builders",
    slug: "builders",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 18C12 13.5 15.5 10 20 10C24.5 10 28 13.5 28 18H12Z" fill="#F97316" stroke="#0a1c3a" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="9" y1="18" x2="31" y2="18" stroke="#0a1c3a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="22" r="4" fill="#FFE8D6" stroke="#0a1c3a" strokeWidth="1.8" />
        <path d="M11 31C11 27 15 26 20 26C25 26 29 27 29 31" fill="#FFE8D6" stroke="#0a1c3a" strokeWidth="1.8" />
      </svg>
    )
  },
  {
    name: "Contractors",
    slug: "civil-contractors",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="22" width="16" height="10" rx="1.5" fill="#FFE8D6" stroke="#0a1c3a" strokeWidth="1.8" />
        <line x1="16" y1="27" x2="32" y2="27" stroke="#0a1c3a" strokeWidth="1.5" />
        <line x1="24" y1="22" x2="24" y2="27" stroke="#0a1c3a" strokeWidth="1.5" />
        <line x1="20" y1="27" x2="20" y2="32" stroke="#0a1c3a" strokeWidth="1.5" />
        <line x1="28" y1="27" x2="28" y2="32" stroke="#0a1c3a" strokeWidth="1.5" />
        <path d="M12 18L21 9L23 15L14 24L12 18Z" fill="#F97316" stroke="#0a1c3a" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 20L7 23" stroke="#0a1c3a" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Modular Kitchen",
    slug: "modular-kitchen-experts",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="10" width="24" height="22" rx="2" fill="#FFE8D6" stroke="#0a1c3a" strokeWidth="1.8" />
        <line x1="8" y1="18" x2="32" y2="18" stroke="#0a1c3a" strokeWidth="1.8" />
        <line x1="20" y1="10" x2="20" y2="18" stroke="#0a1c3a" strokeWidth="1.8" />
        <line x1="20" y1="18" x2="20" y2="32" stroke="#0a1c3a" strokeWidth="1.8" />
        <line x1="18" y1="13" x2="18" y2="15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="13" x2="22" y2="15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="22" x2="18" y2="25" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="22" x2="22" y2="25" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "More",
    slug: "more",
    isMore: true,
    icon: (
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
        <span className="text-slate-600 dark:text-slate-300 font-black text-base tracking-widest leading-none pb-1">...</span>
      </div>
    )
  }
];

// Desktop 8 categories
const desktopCategories = [
  { name: "Interior Designers", slug: "interior-designers", icon: <Sofa className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> },
  { name: "Architects", slug: "architects", icon: <Ruler className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> },
  { name: "Civil Contractors", slug: "civil-contractors", icon: <HardHat className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> },
  { name: "Builders", slug: "builders", icon: <Building2 className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> },
  { name: "Modular Kitchen", slug: "modular-kitchen-experts", icon: <ChefHat className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> },
  { name: "Painters", slug: "painters", icon: <PaintRoller className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> },
  { name: "Suppliers & Vendors", slug: "suppliers-vendors", icon: <Package className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> },
  { name: "Skilled Workers", slug: "skilled-workers", icon: <Hammer className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} /> },
];

export function Categories({ categories }: { categories?: Array<Record<string, unknown>> }) {
  return (
    <>
      {/* MOBILE VIEW: Exact 6-Item Row from reference mockup */}
      <section className="w-full bg-[#f8f9fa] dark:bg-background py-4 lg:hidden transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[1.15rem] font-black text-[#0a1c3a] dark:text-white tracking-tight">
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

          {/* Inline style guarantees 6-column grid regardless of Tailwind purge */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '6px' }}>
            {mobileCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.isMore ? "/professionals" : `/professionals?category=${cat.slug}`}
                className="flex flex-col items-center justify-between p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 active:scale-95 transition-transform"
                style={{ height: '88px' }}
              >
                <div className="flex-1 flex items-center justify-center">
                  {cat.icon}
                </div>
                <span className="text-[9px] font-bold text-center text-[#0a1c3a] dark:text-white leading-[1.15] px-0.5" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESKTOP VIEW: 100% Exact Original Desktop Categories Grid from d3e258f */}
      <section className="hidden lg:block w-full bg-[#f8f9fa] dark:bg-background py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-[1.5rem] font-black text-[#0a1c3a] dark:text-white tracking-wide">
              Find the Right Professional
            </h2>
            <Link 
              href="/professionals" 
              prefetch={true}
              className="text-sm font-bold text-[#E8701A] dark:text-orange-400 hover:underline active:scale-95 transition-all"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {desktopCategories.map((category, idx) => (
              <Link 
                href={`/professionals?category=${category.slug}`}
                prefetch={true}
                key={idx}
                className="flex flex-col items-center justify-center gap-1.5 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-700 hover:shadow-lg active:scale-95 cursor-pointer transition-all duration-150"
              >
                <div className="relative flex items-center justify-center w-14 h-14 mb-1">
                  <div className="absolute w-10 h-10 bg-orange-50 dark:bg-orange-900/40 rounded-full bottom-0 left-0"></div>
                  <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                    {category.icon}
                  </div>
                </div>
                <span className="text-xs font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                  {category.name}
                </span>
              </Link>
            ))}

            <Link 
              href="/professionals"
              prefetch={true}
              className="flex flex-col items-center justify-center gap-1.5 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-700 hover:shadow-lg active:scale-95 cursor-pointer transition-all duration-150"
            >
              <div className="relative flex items-center justify-center w-14 h-14 mb-1">
                <div className="absolute w-10 h-10 bg-orange-50 dark:bg-orange-900/40 rounded-full bottom-0 left-0"></div>
                <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                  <LayoutGrid className="w-7 h-7" strokeWidth={1.5} />
                </div>
              </div>
              <span className="text-xs font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                View All
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}


