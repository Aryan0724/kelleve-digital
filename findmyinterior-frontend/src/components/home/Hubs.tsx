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
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1 line-clamp-1">{firstProject.title}</h4>
          <p className="text-xs text-gray-500 mb-0.5 line-clamp-1">{firstProject.city}</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Budget: ₹{firstProject.budget}</p>
          <p className="text-xs text-gray-500">Live Requirement</p>
        </>
      ) : (
        <>
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1">Live Requirements</h4>
          <p className="text-xs text-gray-500 mb-0.5">Across Bihar</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Multiple Budgets</p>
          <p className="text-xs text-gray-500">Submit Quotes</p>
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
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1 line-clamp-1">{firstProject.title}</h4>
          <p className="text-xs text-gray-500 mb-0.5">{firstProject.builder?.business_name || "Top Builder"}</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Location: {firstProject.city}</p>
          <p className="text-xs text-gray-500">Requirements Available</p>
        </>
      ) : (
        <>
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1">Builder Projects</h4>
          <p className="text-xs text-gray-500 mb-0.5">Verified Builders</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Major Cities</p>
          <p className="text-xs text-gray-500">Requirements Available</p>
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
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1 line-clamp-1">{firstPossession.title}</h4>
          <p className="text-xs text-gray-500 mb-0.5">{firstPossession.builder?.business_name || "Top Builder"}</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Possession: {firstPossession.possession_date}</p>
          <p className="text-xs text-gray-500">Interior Leads Expected</p>
        </>
      ) : (
        <>
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1">Upcoming Flats</h4>
          <p className="text-xs text-gray-500 mb-0.5">New Societies</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Ready to Move</p>
          <p className="text-xs text-gray-500">Interior Leads Expected</p>
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
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1 line-clamp-1">{firstWorker.name}</h4>
          <p className="text-xs text-gray-600 mt-1 leading-snug">Available {firstWorker.skills || "Worker"}</p>
        </>
      ) : (
        <>
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1">Find Verified<br/>Skilled Workers</h4>
          <p className="text-xs text-gray-600 mt-2 leading-snug">Carpenter, Electrician, Plumber, Painter & more</p>
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
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1 line-clamp-1">{firstSupplier.business_name}</h4>
          <p className="text-xs text-gray-600 mt-1 leading-snug">{firstSupplier.city}</p>
        </>
      ) : (
        <>
          <p className="text-xs text-gray-600 leading-snug">Tiles, Plywood, Hardware, Lighting, Sanitary, Kitchen Hardware & More</p>
        </>
      ),
    },
  ];

  return (
    <section className="w-full bg-[#f8f9fa] pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {hubs.map((hub, idx) => (
            <div key={idx} className="bg-[#f2f4f8] rounded-xl overflow-hidden flex flex-col p-4 shadow-sm border border-gray-100 h-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-[10px] font-extrabold uppercase tracking-widest ${hub.titleColor}`}>
                  {hub.title}
                </h3>
                <Link href={hub.link} className="text-[10px] font-semibold text-blue-600 hover:underline shrink-0 ml-2">
                  View All
                </Link>
              </div>
              
              {/* Content Grid */}
              <div className="bg-white rounded-lg p-3 flex-1 flex flex-row lg:flex-col xl:flex-row gap-3 border border-gray-200">
                <div className="w-24 h-24 lg:w-full lg:h-32 xl:w-24 xl:h-24 shrink-0 relative rounded-md overflow-hidden bg-gray-100">
                  <Image 
                    src={hub.image} 
                    alt={hub.title} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 justify-center lg:justify-start xl:justify-center">
                  {hub.content}
                  <div className="mt-auto pt-2 lg:pt-3">
                    <Link href={hub.link} className="block">
                      <button className={`w-full ${hub.buttonColor} text-white text-[10px] font-bold py-2 rounded uppercase tracking-wider transition`}>
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
