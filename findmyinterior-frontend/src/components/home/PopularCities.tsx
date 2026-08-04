import React from "react";
import Link from "next/link";

export function PopularCities() {
  const cities = [
    { name: "Patna", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop", pros: "150+" },
    { name: "Ranchi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop", pros: "120+" },
    { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop", pros: "500+" },
    { name: "Muzaffarpur", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop", pros: "80+" },
    { name: "Gaya", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop", pros: "60+" },
    { name: "Noida", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop", pros: "300+" },
  ];

  return (
    <div className="w-full flex flex-col bg-transparent lg:my-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-white tracking-tight mb-2">
            Find Professionals by City
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Browse verified experts in top locations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cities.map((city, idx) => (
          <Link key={idx} href={`/professionals?city=${city.name.toLowerCase()}`} className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <h3 className="font-bold text-white text-lg leading-tight mb-0.5">{city.name}</h3>
              <span className="text-[11px] font-semibold text-white/80">{city.pros} Professionals</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
