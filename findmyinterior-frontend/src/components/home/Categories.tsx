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
      <div className="lg:hidden w-full bg-white dark:bg-slate-900 py-6 mt-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[1.15rem] font-black text-[#0a1c3a] dark:text-white">
              Find the Right Professional
            </h2>
            <Link href="/professionals" className="text-xs font-bold text-[#E8701A] hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 pb-1">
            {[
              { name: "Interior Designers", slug: "interior-designers", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M8 12h8"/><path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M10 12v3"/><path d="M14 12v3"/><path d="M6 19v2"/><path d="M18 19v2"/></svg> },
              { name: "Architects", slug: "architects", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg> },
              { name: "Builders", slug: "builders", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 12 0v3"/></svg> },
              { name: "Contractors", slug: "civil-contractors", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16 4.6V3.86c0-.85-.33-1.65-.93-2.25l-1.25-1.25"/><path d="m3.93 12 1.4-1.4"/><path d="m5.33 13.4 1.4-1.4"/><path d="m6.73 14.8 1.4-1.4"/><path d="m8.13 16.2 1.4-1.4"/></svg> },
              { name: "Modular Kitchen", slug: "modular-kitchen-experts", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M2 11h20"/><path d="M12 11v10"/></svg> },
            ].map((category, idx) => (
              <Link 
                href={`/professionals?category=${category.slug}`}
                key={idx}
                className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700"
              >
                <div className="relative flex items-center justify-center w-12 h-12 mb-1">
                  <div className="absolute w-8 h-8 bg-orange-50 dark:bg-orange-900/40 rounded-full bottom-0 left-0"></div>
                  <div className="relative z-10 text-[#0a1c3a] dark:text-white">
                    {category.icon}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-center text-[#0a1c3a] dark:text-white leading-tight">
                  {category.name}
                </span>
              </Link>
            ))}

            <Link 
              href="/professionals"
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700"
            >
              <div className="relative flex items-center justify-center w-12 h-12 mb-1">
                <div className="absolute w-8 h-8 bg-slate-50 dark:bg-slate-700 rounded-full bottom-0 left-0"></div>
                <div className="relative z-10 text-slate-700 dark:text-slate-300">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </div>
              </div>
              <span className="text-[10px] font-bold text-center text-slate-700 dark:text-slate-300 leading-tight">
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
