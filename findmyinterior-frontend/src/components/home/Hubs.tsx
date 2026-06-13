import Link from "next/link";
import Image from "next/image";

export function Hubs() {
  const hubs = [
    {
      title: "LIVE PROJECTS MARKETPLACE",
      titleColor: "text-green-700",
      buttonColor: "bg-green-700 hover:bg-green-800",
      buttonText: "VIEW PROJECTS",
      link: "/projects",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop",
      content: (
        <>
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1">3BHK Flat Interior</h4>
          <p className="text-xs text-gray-500 mb-0.5">Patna, Bihar</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Budget: ₹8 - 10 Lakh</p>
          <p className="text-xs text-gray-500">Interested: 12 Experts</p>
        </>
      ),
    },
    {
      title: "BUILDER PROJECTS HUB",
      titleColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      buttonText: "VIEW PROJECT",
      link: "/projects?type=builder",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop",
      content: (
        <>
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1">Skyline Residency</h4>
          <p className="text-xs text-gray-500 mb-0.5">100 Flats Project</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Location: Patna</p>
          <p className="text-xs text-gray-500">Requirements Available</p>
        </>
      ),
    },
    {
      title: "UPCOMING POSSESSION PROJECTS",
      titleColor: "text-orange-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      buttonText: "VIEW PROJECTS",
      link: "/projects",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop",
      content: (
        <>
          <h4 className="font-bold text-[#0a1c3a] text-sm mb-1">ABC Heights</h4>
          <p className="text-xs text-gray-500 mb-0.5">200 Flats</p>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">Possession: Jan 2027</p>
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
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
      content: (
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
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=600&auto=format&fit=crop",
      content: (
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
