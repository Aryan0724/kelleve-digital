import Link from "next/link";
import React from "react";
import { Sofa, Ruler, Building2, HardHat, ChefHat, PaintRoller, Package, Hammer, LayoutGrid } from "lucide-react";

// Premium recognizable SVG icons per profession using Lucide React for clean consistency
const customIcons: Record<string, React.ReactNode> = {
  "interior-designers": <Sofa className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />,
  "architects": <Ruler className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />,
  "builders": <Building2 className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />,
  "civil-contractors": <HardHat className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />,
  "modular-kitchen-experts": <ChefHat className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />,
  "painters": <PaintRoller className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />,
  "suppliers-and-vendors": <Package className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />,
  "skilled-workers": <Hammer className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />,
  "default": <LayoutGrid className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
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


