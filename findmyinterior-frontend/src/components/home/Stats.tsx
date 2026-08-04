"use client";

export function Stats({ stats }: { stats?: any }) {
  // Using exact text from prompt: 
  // 4.9/5 Average Rating | 10,000+ Happy Customers | 5,000+ Verified Professionals | 25,000+ Projects Completed | 50+ Cities Covered
  
  const statItems = [
    { value: "4.9/5", label: "Average Rating" },
    { value: "10,000+", label: "Happy Customers" },
    { value: "5,000+", label: "Verified Professionals" },
    { value: "25,000+", label: "Projects Completed" },
    { value: "50+", label: "Cities Covered" },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 relative z-10 py-12 my-20">
      <div className="container max-w-[1320px] mx-auto px-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6 w-full divide-x divide-slate-100 dark:divide-slate-800">
          {statItems.map((item, i) => (
            <div key={i} className={`flex flex-col items-center justify-center flex-1 ${i === 0 ? 'pl-0' : 'pl-6'}`}>
              <span className="text-2xl lg:text-[32px] font-black text-[#111827] dark:text-white leading-tight mb-2 tracking-tight">
                {item.value}
              </span>
              <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
