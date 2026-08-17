import Link from "next/link";
import Image from "next/image";

export function Hubs({ homeData }: { homeData?: any }) {
  const firstProject = homeData?.upcoming_projects?.[0];
  const firstPossession = homeData?.possession_projects?.[0];
  const firstWorker = homeData?.featured_workers?.[0];
  const firstSupplier = homeData?.featured_suppliers?.[0];

  const hubs = [
    {
      title: "LIVE PROJECTS MARKETPLACE",
      titleColor: "text-green-700",
      buttonColor: "bg-green-700 hover:bg-green-800",
      buttonText: "VIEW PROJECTS",
      link: "/projects",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop",
      content: firstProject ? (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1 line-clamp-1">{firstProject.title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 line-clamp-1">{firstProject.city}</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Budget: ₹{firstProject.budget}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Live Requirement</p>
        </>
      ) : (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1">Live Requirements</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Across Bihar</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Multiple Budgets</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Submit Quotes</p>
        </>
      ),
    },
    {
      title: "BUILDER PROJECTS HUB",
      titleColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      buttonText: "VIEW PROJECT",
      link: "/projects?type=builder",
      image: firstProject?.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop",
      content: firstProject ? (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1 line-clamp-1">{firstProject.title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{firstProject.builder?.business_name || "Top Builder"}</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Location: {firstProject.city}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Requirements Available</p>
        </>
      ) : (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1">Builder Projects</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Verified Builders</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Major Cities</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Requirements Available</p>
        </>
      ),
    },
    {
      title: "UPCOMING POSSESSION",
      titleColor: "text-orange-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      buttonText: "VIEW PROJECTS",
      link: "/projects",
      image: firstPossession?.images?.[0] || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop",
      content: firstPossession ? (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1 line-clamp-1">{firstPossession.title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{firstPossession.builder?.business_name || "Top Builder"}</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Possession: {firstPossession.possession_date}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Interior Leads Expected</p>
        </>
      ) : (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1">Upcoming Flats</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">New Societies</p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Ready to Move</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Interior Leads Expected</p>
        </>
      ),
    },
    {
      title: "SKILLED WORKERS",
      titleColor: "text-purple-700",
      buttonColor: "bg-purple-700 hover:bg-purple-800",
      buttonText: "FIND WORKERS",
      link: "/workers",
      image: firstWorker?.image_url || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
      content: firstWorker ? (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1 line-clamp-1">{firstWorker.name}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-snug">Available {firstWorker.skills || "Worker"}</p>
        </>
      ) : (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1">Find Verified<br/>Skilled Workers</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-snug">Carpenter, Electrician, Plumber, Painter & more</p>
        </>
      ),
    },
    {
      title: "SUPPLIERS & VENDORS",
      titleColor: "text-teal-600",
      buttonColor: "bg-teal-600 hover:bg-teal-700",
      buttonText: "FIND SUPPLIERS",
      link: "/materials",
      image: firstSupplier?.image_url || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&auto=format&fit=crop",
      content: firstSupplier ? (
        <>
          <h4 className="font-bold text-[#0a1c3a] dark:text-gray-100 text-sm mb-1 line-clamp-1">{firstSupplier.business_name}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-snug">{firstSupplier.city}</p>
        </>
      ) : (
        <>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">Tiles, Plywood, Hardware, Lighting, Sanitary, Kitchen Hardware & More</p>
        </>
      ),
    },
  ];

  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-background pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {hubs.map((hub, idx) => (
            <div key={idx} className="premium-card group relative rounded-2xl overflow-hidden flex flex-col p-5 h-full hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-300">
              {/* Decorative gradient top border */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 opacity-80 ${hub.buttonColor.split(' ')[0]}`} />
              
              {/* Header */}
              <div className="flex justify-between items-center mb-4 mt-1">
                <h3 className={`text-[11px] font-extrabold uppercase tracking-widest ${hub.titleColor}`}>
                  {hub.title}
                </h3>
                <Link href={hub.link} className="text-[11px] font-bold text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors shrink-0 ml-2">
                  View All
                </Link>
              </div>
              
              {/* Content Grid */}
              <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3 flex-1 flex flex-row lg:flex-col xl:flex-row gap-4 border border-slate-100/50 dark:border-slate-700/50 group-hover:bg-slate-100/80 dark:group-hover:bg-slate-800/80 transition-colors duration-300">
                <div className="w-28 h-28 lg:w-full lg:h-36 xl:w-28 xl:h-28 shrink-0 relative rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                  <Image 
                    src={hub.image} 
                    alt={hub.title} 
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col flex-1 justify-center lg:justify-start xl:justify-center">
                  {hub.content}
                  <div className="mt-auto pt-3 lg:pt-4">
                    <Link href={hub.link} className="block">
                      <button className={`w-full ${hub.buttonColor} text-white text-[11px] font-extrabold py-2.5 rounded-lg uppercase tracking-wider shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-300`}>
                        {hub.buttonText}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
