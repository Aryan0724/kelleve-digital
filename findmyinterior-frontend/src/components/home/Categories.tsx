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
  { name: "Suppliers & Vendors", slug: "suppliers-vendors" },
  { name: "Skilled Workers", slug: "skilled-workers" },
];

export function Categories({ categories }: { categories?: Array<Record<string, unknown>> }) {
  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-background py-6 lg:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-4 lg:mb-8">
          <h2 className="text-[1.15rem] lg:text-[1.5rem] font-black text-[#0a1c3a] dark:text-white tracking-wide">
            Find the Right Professional
          </h2>
          <Link 
            href="/professionals" 
            prefetch={true}
            className="text-xs lg:text-sm font-bold text-[#E8701A] dark:text-orange-400 hover:underline active:scale-95 transition-all"
          >
            View All
          </Link>
        </div>

        {/* Categories Grid/Carousel */}
        {/* Mobile: Horizontal scroll (flex overflow-x-auto) */}
        {/* Desktop: Grid (grid-cols-4 or flex-wrap) */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-wrap hide-scrollbar md:justify-start gap-3 md:gap-4 pb-2 px-1 md:px-0">
          {exactCategories.map((category, idx) => (
            <Link 
              href={`/professionals?category=${category.slug}`}
              prefetch={true}
              key={idx}
              className="flex flex-col items-center justify-center gap-1.5 p-3 md:p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 min-w-[100px] w-[100px] md:min-w-0 md:w-auto xl:w-[calc(11.11%-15px)] shrink-0 hover:border-orange-200 dark:hover:border-orange-700 hover:shadow-lg active:scale-95 cursor-pointer transition-all duration-150"
            >
              <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-1">
                <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-orange-50 dark:bg-orange-900/40 rounded-full bottom-0 left-0"></div>
                <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                  {customIcons[category.slug] || customIcons.default}
                </div>
              </div>
              <span className="text-[11px] md:text-xs font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                {category.name}
              </span>
            </Link>
          ))}

          <Link 
            href="/professionals"
            prefetch={true}
            className="flex flex-col items-center justify-center gap-1.5 p-3 md:p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 min-w-[100px] w-[100px] md:min-w-0 md:w-auto xl:w-[calc(11.11%-15px)] shrink-0 hover:border-orange-200 dark:hover:border-orange-700 hover:shadow-lg active:scale-95 cursor-pointer transition-all duration-150"
          >
            <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-1">
              <div className="absolute w-8 h-8 md:w-10 md:h-10 bg-orange-50 dark:bg-orange-900/40 rounded-full bottom-0 left-0"></div>
              <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                {customIcons.default}
              </div>
            </div>
            <span className="text-[11px] md:text-xs font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
              View All
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}


