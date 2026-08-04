"use client";

import Link from "next/link";
import { 
  ArrowRight,
  Sofa, 
  Ruler, 
  HardHat, 
  Hammer,
  PaintBucket,
  HammerIcon,
  HardDrive,
  MoreHorizontal
} from "lucide-react";

export function Categories({ categories }: { categories?: any[] }) {
  const defaultCategories = [
    { name: "Interior Designers", icon: <Sofa className="w-8 h-8 text-[#111827] dark:text-white group-hover:text-[#FF6B00] transition-colors" strokeWidth={1.2} />, sub: "1200+ Professionals", href: "/professionals?search=Interior+Designer" },
    { name: "Architects", icon: <Ruler className="w-8 h-8 text-[#111827] dark:text-white group-hover:text-[#FF6B00] transition-colors" strokeWidth={1.2} />, sub: "950+ Professionals", href: "/professionals?search=Architect" },
    { name: "Builders", icon: <HardHat className="w-8 h-8 text-[#111827] dark:text-white group-hover:text-[#FF6B00] transition-colors" strokeWidth={1.2} />, sub: "1800+ Professionals", href: "/professionals?search=Builder" },
    { name: "Contractors", icon: <Hammer className="w-8 h-8 text-[#111827] dark:text-white group-hover:text-[#FF6B00] transition-colors" strokeWidth={1.2} />, sub: "2200+ Professionals", href: "/professionals?search=Contractor" },
    { name: "Modular Kitchen", icon: <HardDrive className="w-8 h-8 text-[#111827] dark:text-white group-hover:text-[#FF6B00] transition-colors" strokeWidth={1.2} />, sub: "850+ Professionals", href: "/professionals?search=Kitchen" },
    { name: "Home Renovation", icon: <PaintBucket className="w-8 h-8 text-[#111827] dark:text-white group-hover:text-[#FF6B00] transition-colors" strokeWidth={1.2} />, sub: "1500+ Professionals", href: "/professionals?search=Renovation" },
    { name: "Civil Engineers", icon: <HammerIcon className="w-8 h-8 text-[#111827] dark:text-white group-hover:text-[#FF6B00] transition-colors" strokeWidth={1.2} />, sub: "600+ Professionals", href: "/professionals?search=Civil" },
    { name: "Categories", icon: <MoreHorizontal className="w-8 h-8 text-[#111827] dark:text-white group-hover:text-[#FF6B00] transition-colors" strokeWidth={1.2} />, sub: "View All", href: "/categories" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
          Explore by Category
        </h2>
        <Link href="/categories" className="group flex items-center text-[#FF6B00] font-bold text-sm hover:text-[#e66000] transition-colors">
          View All Categories
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
        {defaultCategories.map((cat, i) => (
          <Link key={i} href={cat.href} className="group block w-full">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg hover:border-[#FF6B00]">
              <div className="mb-3">
                {cat.icon}
              </div>
              <h3 className="font-bold text-[#111827] dark:text-white text-[13px] leading-tight mb-1 truncate w-full">
                {cat.name}
              </h3>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {cat.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
