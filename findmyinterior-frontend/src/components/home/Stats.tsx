import { Users, Building, Smile, MapPin, Grid, HeadphonesIcon } from "lucide-react";

export function Stats({ stats }: { stats?: Record<string, number | string> }) {
  // Use provided stats
  const displayStats = [
    {
      icon: <Users className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.verified_professionals ? `${stats.verified_professionals}+` : "1,500+",
      label: "Verified Professionals",
    },
    {
      icon: <Building className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.total_projects ? `${stats.total_projects}+` : "5,000+",
      label: "Projects Completed",
    },
    {
      icon: <Smile className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.happy_customers ? `${stats.happy_customers}+` : "4,800+",
      label: "Happy Customers",
    },
    {
      icon: <MapPin className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.cities_covered ? `${stats.cities_covered}+` : "38+",
      label: "Cities in Bihar",
    },
    {
      icon: <Grid className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.categories ? `${stats.categories}+` : "30+",
      label: "Categories",
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: "24/7",
      label: "Customer Support",
    },
  ];

  return (
    <div className="w-full h-full bg-[#f8f9fa] dark:bg-slate-900/50 rounded-[24px] lg:bg-transparent lg:dark:bg-transparent lg:border-0 border-slate-100 dark:border-slate-800 lg:p-0 pt-4 pb-8 lg:py-0">
      <div className="lg:h-full bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-center">
        <div className="w-full grid grid-cols-2 gap-y-10 gap-x-6 justify-items-center">
          {displayStats.slice(0, 4).map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2 w-full group">
              <div className="shrink-0 bg-orange-50/50 dark:bg-orange-950/30 p-3 rounded-full group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#1A1A1A] dark:text-white leading-tight">{stat.value}</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
