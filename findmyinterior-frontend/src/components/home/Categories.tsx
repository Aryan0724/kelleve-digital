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
    <section className="w-full bg-white dark:bg-background py-6 mt-2 border-b border-gray-100 dark:border-slate-800">
      <div className="container mx-auto px-4 lg:px-6">
        <h2 className="text-lg font-bold text-[#0a1c3a] dark:text-white mb-4">
          Featured Services
        </h2>

        {/* Horizontal Scroll for Mobile, Wrap for Desktop */}
        <div className="flex overflow-x-auto no-scrollbar gap-4 lg:flex-wrap lg:gap-6 pb-2">
          {displayCategories.map((category, idx) => (
            <Link 
              href={`/professionals?category=${category.slug || category.name.replace(/ /g, '-')}`}
              key={category.id || idx}
              className="flex flex-col items-center gap-2 flex-shrink-0 group w-[72px] lg:w-[88px]"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border-2 border-transparent group-hover:border-[#E8701A]/30 transition-all shadow-sm">
                {getIcon(category.name)}
              </div>
              <span className="text-[10px] lg:text-xs font-semibold text-center text-[#0a1c3a] dark:text-white leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
          <Link 
            href="/professionals"
            className="flex flex-col items-center gap-2 flex-shrink-0 group w-[72px] lg:w-[88px]"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border-2 border-transparent group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all shadow-sm">
              <Grid3X3 className="w-8 h-8 text-slate-400 dark:text-slate-500" strokeWidth={1.2} />
            </div>
            <span className="text-[10px] lg:text-xs font-semibold text-center text-slate-500 dark:text-slate-400 leading-tight">
              View All
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
