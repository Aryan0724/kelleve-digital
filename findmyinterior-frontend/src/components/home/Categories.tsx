import Link from "next/link";
import React from "react";
import { Sofa, Ruler, Building2, HardHat, ChefHat, PaintRoller, Package, Hammer, LayoutGrid } from "lucide-react";

// Premium recognizable SVG icons per profession
const customIcons: Record<string, React.ReactNode> = {
  "interior-designers": <Sofa className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />,
  "architects": <Ruler className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />,
  "builders": <Building2 className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />,
  "civil-contractors": <HardHat className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />,
  "modular-kitchen-experts": <ChefHat className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />,
  "painters": <PaintRoller className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />,
  "suppliers-and-vendors": <Package className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />,
  "skilled-workers": <Hammer className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />,
  "default": <LayoutGrid className="w-8 h-8 lg:w-12 lg:h-12" strokeWidth={1.5} />
};

export function Categories({ categories }: { categories?: Array<Record<string, unknown>> }) {
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
    <div className="w-full flex flex-col h-full bg-transparent">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-white tracking-tight mb-2">
            Explore Services
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Find the right professional for your specific needs</p>
        </div>
        <Link 
          href="/professionals" 
          prefetch={true}
          className="text-sm font-bold text-[#FF6B00] hover:text-[#e66000] hover:underline flex items-center gap-1 transition-colors"
        >
          View All <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>

      <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 lg:gap-6 hide-scrollbar pb-4">
        {items.map((category, idx) => (
          <Link 
            href={`/professionals?category=${category.slug}`}
            prefetch={true}
            key={idx}
            className="flex flex-col items-center justify-center gap-4 p-6 lg:py-10 bg-white dark:bg-slate-800 rounded-2xl lg:rounded-3xl border-2 border-transparent hover:border-[#FF6B00] min-w-[120px] lg:min-w-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 mb-1 text-[#111827] dark:text-white group-hover:text-[#FF6B00] bg-slate-50 dark:bg-slate-900 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30 rounded-2xl transition-all duration-300">
              {customIcons[category.slug] || customIcons.default}
            </div>
            <span className="text-xs lg:text-base font-bold text-center text-[#111827] dark:text-white leading-tight">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
