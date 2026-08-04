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
  // Mobile layout uses scroll, Desktop uses grid
  const items = [
    { name: "Interior Designers", slug: "interior-designers" },
    { name: "Architects", slug: "architects" },
    { name: "Builders", slug: "builders" },
    { name: "Contractors", slug: "civil-contractors" },
    { name: "Modular Kitchen", slug: "modular-kitchen-experts" },
    { name: "Civil Engineers", slug: "civil-contractors" },
    { name: "Home Renovation", slug: "builders" },
    { name: "False Ceiling", slug: "painters" },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm p-4 lg:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg lg:text-xl font-black text-[#1A1A1A] dark:text-white">
          Find the Right Professional
        </h2>
        <Link 
          href="/professionals" 
          prefetch={true}
          className="text-sm font-bold text-[#E8701A] hover:underline flex items-center gap-1"
        >
          View All Categories <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>

      <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 hide-scrollbar pb-2">
        {items.map((category, idx) => (
          <Link 
            href={`/professionals?category=${category.slug}`}
            prefetch={true}
            key={idx}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[100px] lg:min-w-0 hover:border-[#E8701A] dark:hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-12 h-12 mb-1 text-[#1A1A1A] dark:text-white group-hover:text-[#E8701A] transition-colors">
              {customIcons[category.slug] || customIcons.default}
            </div>
            <span className="text-[11px] lg:text-xs font-bold text-center text-[#1A1A1A] dark:text-white leading-tight">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
