import Link from "next/link";
import { 
  Sofa, 
  Grid3X3,
} from "lucide-react";

const exactCategories = [
  { name: "Restaurants", slug: "restaurants", isSofa: false },
  { name: "Salons & Beauty", slug: "salons-and-beauty", isSofa: false },
  { name: "Event Management", slug: "event-management", isSofa: false },
  { name: "Fitness & Gyms", slug: "fitness-and-gyms", isSofa: false },
  { name: "Digital Marketing & IT", slug: "digital-marketing", isSofa: false },
  { name: "Repair & Maintenance", slug: "repair-and-maintenance", isSofa: false },
  { name: "Interior & Architecture", slug: "interior-and-architecture", isSofa: true },
  { name: "Education & Coaching", slug: "education-and-coaching", isSofa: false },
  { name: "Hospitals & Healthcare", slug: "hospitals-and-healthcare", isSofa: false },
  { name: "Hotels & Lodging", slug: "hotels-and-lodging", isSofa: false },
  { name: "Interior Designers", slug: "interior-designers", isSofa: true },
];

export function Categories({ categories }: { categories?: any[] }) {
  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-background lg:py-8 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="lg:hidden w-full bg-white dark:bg-background py-6 mt-2 border-b border-gray-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[1.1rem] font-bold text-[#0a1c3a] dark:text-white uppercase tracking-wide">
              BROWSE BY SERVICES
            </h2>
            <Link href="/professionals" className="text-sm font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4">
            {exactCategories.map((category, idx) => (
              <Link 
                href={`/professionals?category=${category.slug}`}
                key={idx}
                className="flex flex-col items-center justify-center gap-2 flex-shrink-0 group w-[85px] h-[105px] bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 hover:border-[#E8701A]/50 transition-all"
              >
                <div className="relative flex items-center justify-center h-10 w-10 mt-1">
                  <div className="absolute w-5 h-5 bg-orange-100 dark:bg-orange-900/40 rounded-full bottom-0 right-0 z-0"></div>
                  <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                    {category.isSofa ? (
                      <Sofa className="w-7 h-7 text-[#E8701A]" strokeWidth={1.5} />
                    ) : (
                      <Grid3X3 className="w-7 h-7 text-[#E8701A]" strokeWidth={1.5} />
                    )}
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
                <div className="absolute w-5 h-5 bg-orange-100 dark:bg-orange-900/40 rounded-full bottom-0 right-0 z-0"></div>
                <div className="relative z-10 text-[#0a1c3a] dark:text-white group-hover:text-[#E8701A] transition-colors">
                  <Grid3X3 className="w-7 h-7 text-[#E8701A]" strokeWidth={1.5} />
                </div>
              </div>
              <span className="text-[10px] font-semibold text-center text-[#0a1c3a] dark:text-white group-hover:text-orange-600 leading-tight">
                More Services
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
          <Link href="/professionals" className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:flex xl:flex-wrap justify-start gap-3 md:gap-4">
          {exactCategories.map((category, idx) => (
            <Link 
              href={`/professionals?category=${category.slug}`}
              key={idx}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer xl:w-[calc(10%-15px)] min-w-[100px]"
            >
              <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
                {category.isSofa ? (
                  <Sofa className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />
                ) : (
                  <Grid3X3 className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
          <Link 
            href="/professionals"
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50 transition-all cursor-pointer xl:w-[calc(10%-15px)] min-w-[100px]"
          >
            <div className="bg-orange-50/50 dark:bg-orange-900/20 p-3 rounded-full shrink-0">
              <Grid3X3 className="w-8 h-8 text-[#E8701A]" strokeWidth={1.2} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
              More Services
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
