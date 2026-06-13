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
  const staticServices = [
    { name: "Interior Designers", icon: <Sofa className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "Architects", icon: <Building2 className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "Civil Contractors", icon: <HardHat className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "Modular Kitchen", icon: <ChefHat className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "Painters", icon: <Paintbrush className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "Carpenters", icon: <Hammer className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "Electricians", icon: <Zap className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "Plumbers", icon: <Wrench className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "False Ceiling", icon: <Box className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "Flooring", icon: <Layers className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
    { name: "More Services", icon: <Grid3X3 className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} /> },
  ];

  return (
    <section className="w-full bg-[#f8f9fa] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-[1.1rem] font-bold text-[#0a1c3a] uppercase tracking-wide">
            Browse By Services
          </h2>
          <Link href="/professionals" className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
            View All
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:flex xl:flex-wrap justify-between gap-4">
          {staticServices.map((service, idx) => (
            <Link 
              href={`/professionals?search=${service.name.replace(/ /g, '+')}`}
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer xl:w-[calc(9.09%-12px)] min-w-[100px]"
            >
              <div className="bg-orange-50/50 p-3 rounded-full shrink-0">
                {service.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-center text-[#0a1c3a] leading-tight">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
