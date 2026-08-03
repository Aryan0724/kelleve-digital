import Link from "next/link";
import { 
  Sofa, 
  Building2, 
  HardHat, 
  ChefHat, 
  Paintbrush, 
  Hammer, 
  Zap, 
  Wrench, 
  Box, 
  Layers, 
  Grid3X3,
  Compass,
  MoreHorizontal
} from "lucide-react";

export function Categories({ categories }: { categories?: any[] }) {
  // Map category slugs or names to icons
  const getIcon = (name: string) => {
    const slug = name.toLowerCase();
    if (slug.includes("interior")) return <Sofa className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("architect")) return <Building2 className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("contractor")) return <HardHat className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("kitchen")) return <ChefHat className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("paint")) return <Paintbrush className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("carpent")) return <Hammer className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("electric")) return <Zap className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("plumb")) return <Wrench className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("ceiling")) return <Box className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    if (slug.includes("floor")) return <Layers className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
    return <Grid3X3 className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />;
  };

  const displayCategories = categories && categories.length > 0 
    ? categories.slice(0, 11) 
    : [];

  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-background lg:py-8 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="lg:hidden w-full bg-white dark:bg-background py-6 mt-2 border-b border-gray-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[1.1rem] font-bold text-[#0a1c3a] dark:text-white">
              Find the Right Professional
            </h2>
            <Link href="/professionals" className="text-sm font-semibold text-[#E8701A] hover:underline">
              View All
            </Link>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4">
            {[
              { name: "Interior Designers", slug: "interior-designers", icon: <Sofa className="w-7 h-7" strokeWidth={1.5} /> },
              { name: "Architects", slug: "architects", icon: <Compass className="w-7 h-7" strokeWidth={1.5} /> },
              { name: "Builders", slug: "builders", icon: <HardHat className="w-7 h-7" strokeWidth={1.5} /> },
              { name: "Contractors", slug: "civil-contractors", icon: <Hammer className="w-7 h-7" strokeWidth={1.5} /> },
              { name: "Modular Kitchen", slug: "modular-kitchen-experts", icon: <Grid3X3 className="w-7 h-7" strokeWidth={1.5} /> }
            ].map((category, idx) => (
              <Link 
                href={`/professionals?category=${category.slug}`}
                key={idx}
                className="flex flex-col items-center justify-center gap-2 flex-shrink-0 group w-[85px] h-[105px] bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 hover:border-[#E8701A]/50 transition-all"
              >
                <div className="relative flex items-center justify-center h-10 w-10 mt-1">
                  {/* Subtle orange accent circle behind the icon */}
                  <div className="absolute w-5 h-5 bg-orange-100 dark:bg-orange-900/40 rounded-full bottom-0 right-0 z-0"></div>
                  <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                    {category.icon}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-center text-[#0a1c3a] dark:text-white leading-tight px-1">
                  {category.name}
                </span>
              </Link>
            ))}
            
            {/* View All / More Button */}
            <Link 
              href="/professionals"
              className="flex flex-col items-center justify-center gap-2 flex-shrink-0 group w-[85px] h-[105px] bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 hover:border-[#E8701A]/50 transition-all"
            >
              <div className="relative flex items-center justify-center h-10 w-10 mt-1">
                <div className="absolute w-5 h-5 bg-slate-100 dark:bg-slate-700 rounded-full bottom-0 right-0 z-0 group-hover:bg-orange-100 transition-colors"></div>
                <div className="relative z-10 text-slate-600 dark:text-slate-300 group-hover:text-[#E8701A] transition-colors">
                  <MoreHorizontal className="w-7 h-7" strokeWidth={1.5} />
                </div>
              </div>
              <span className="text-[10px] font-semibold text-center text-slate-600 dark:text-slate-300 group-hover:text-[#0a1c3a] dark:group-hover:text-white leading-tight">
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
            Find the Right Professional
          </h2>
          <Link href="/professionals" className="text-sm font-semibold text-[#E8701A] hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:flex xl:flex-wrap justify-start gap-3 md:gap-4">
          {[
            { name: "Interior Designers", slug: "interior-designers", icon: <Sofa className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
            { name: "Architects", slug: "architects", icon: <Compass className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
            { name: "Builders", slug: "builders", icon: <HardHat className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
            { name: "Contractors", slug: "civil-contractors", icon: <Hammer className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
            { name: "Modular Kitchen", slug: "modular-kitchen-experts", icon: <Grid3X3 className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> }
          ].map((category, idx) => (
            <Link 
              href={`/professionals?category=${category.slug}`}
              key={idx}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer xl:w-[calc(16.66%-14px)] min-w-[100px]"
            >
              <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
                {category.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
          <Link 
            href="/professionals"
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer xl:w-[calc(16.66%-14px)] min-w-[100px]"
          >
            <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
              <MoreHorizontal className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
              More Services
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
