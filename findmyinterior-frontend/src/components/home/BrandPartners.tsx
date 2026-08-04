import React from "react";

export function BrandPartners() {
  const brands = [
    { name: "Asian Paints", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Asian_Paints_logo.svg/1200px-Asian_Paints_logo.svg.png" },
    { name: "Kajaria", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Kajaria_Ceramics_logo.svg/1200px-Kajaria_Ceramics_logo.svg.png" },
    { name: "Jaquar", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ee/Jaquar_logo.svg/1200px-Jaquar_logo.svg.png" },
    { name: "Greenply", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Greenply_Industries_Limited_logo.svg/1200px-Greenply_Industries_Limited_logo.svg.png" },
    { name: "Havells", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Havells_Logo.svg/1200px-Havells_Logo.svg.png" },
    { name: "Godrej", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Godrej_Logo.svg/1200px-Godrej_Logo.svg.png" },
  ];

  return (
    <div className="w-full py-10 lg:py-16 border-t border-slate-100 dark:border-slate-800 my-8">
      <div className="text-center mb-8">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Trusted by Top Brands
        </h3>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        {brands.map((brand, idx) => (
          <div key={idx} className="w-24 lg:w-32 h-12 flex items-center justify-center">
            {/* Fallback to text if image fails or for simplicity */}
            <span className="font-black text-xl lg:text-2xl text-slate-800 dark:text-slate-200">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
