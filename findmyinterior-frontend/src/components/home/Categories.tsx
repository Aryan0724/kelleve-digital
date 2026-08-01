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
  Grid3X3 
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
    <section className="w-full bg-[#f8f9fa] dark:bg-background py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-[1.1rem] font-bold text-[#0a1c3a] dark:text-white uppercase tracking-wide">
            Browse By Services
          </h2>
          <Link href="/professionals" className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
            View All
          </Link>
        </div>

        {/* Grid */}
        {displayCategories.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:flex xl:flex-wrap justify-between gap-3 md:gap-4">
            {displayCategories.map((category, idx) => (
              <Link 
                href={`/professionals?category=${category.slug || category.name.replace(/ /g, '-')}`}
                key={category.id || idx}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer xl:w-[calc(9.09%-12px)] min-w-[100px]"
              >
                <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
                  {getIcon(category.name)}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                  {category.name}
                </span>
              </Link>
            ))}
            <Link 
              href="/professionals"
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer xl:w-[calc(9.09%-12px)] min-w-[100px]"
            >
              <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
                <Grid3X3 className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                More Services
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
