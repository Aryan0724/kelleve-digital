import { Users, Building, Smile, MapPin, Grid, HeadphonesIcon } from "lucide-react";

export function Stats({ stats }: { stats?: any }) {
  // Use provided stats
  const displayStats = [
    {
      icon: <Users className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.verified_professionals ? `${stats.verified_professionals}+` : "...",
      label: "Verified Professionals",
    },
    {
      icon: <Building className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.total_projects ? `${stats.total_projects}+` : "...",
      label: "Projects Completed",
    },
    {
      icon: <Smile className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.happy_customers ? `${stats.happy_customers}+` : "...",
      label: "Happy Customers",
    },
    {
      icon: <MapPin className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.cities_covered ? `${stats.cities_covered}+` : "...",
      label: "Cities in Bihar",
    },
    {
      icon: <Grid className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: stats?.categories ? `${stats.categories}+` : "...",
      label: "Categories",
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 text-gray-400" strokeWidth={1.5} />,
      value: "24/7",
      label: "Customer Support",
    },
  ];

  return (
    <div className="w-full bg-[#f8f9fa] pt-4 pb-8">
      <div className="container mx-auto px-4 relative z-30 -mt-10">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-wrap lg:flex-nowrap justify-between items-center gap-6">
          {displayStats.map((stat, idx) => (
            <div key={idx} className="flex items-center space-x-3 w-full sm:w-[45%] md:w-[30%] lg:w-auto">
              <div className="shrink-0">
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#0a1c3a] leading-none mb-1">{stat.value}</span>
                <span className="text-xs font-medium text-gray-500 leading-none">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
