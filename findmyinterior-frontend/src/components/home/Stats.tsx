import { Users, Building, Smile, MapPin, Grid, HeadphonesIcon, Star } from "lucide-react";

export function Stats({ stats }: { stats?: Record<string, number | string> }) {
  // Use provided stats
  const displayStats = [
    {
      icon: <Users className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />,
      value: stats?.happy_customers ? `${stats.happy_customers}+` : "10,000+",
      label: "Happy Customers",
    },
    {
      icon: <Building className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />,
      value: stats?.total_projects ? `${stats.total_projects}+` : "25,000+",
      label: "Projects Completed",
    },
    {
      icon: <Smile className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />,
      value: stats?.verified_professionals ? `${stats.verified_professionals}+` : "5,000+",
      label: "Verified Professionals",
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#FF6B00]" strokeWidth={2} />,
      value: stats?.cities_covered ? `${stats.cities_covered}+` : "50+",
      label: "Cities",
    },
  ];

  return (
    <div className="w-full py-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          
          <div className="flex items-center gap-3 pr-8 md:border-r border-slate-200 dark:border-slate-700">
            <div className="flex items-center text-[#FF6B00]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-[#111827] dark:text-white leading-tight">4.9/5 Rating</span>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center md:justify-items-start">
            {displayStats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 w-full justify-center md:justify-start">
                <div className="shrink-0 bg-orange-50 dark:bg-orange-950/30 p-2.5 rounded-xl">
                  {stat.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl font-black text-[#111827] dark:text-white leading-tight">{stat.value}</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight uppercase tracking-wider">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
