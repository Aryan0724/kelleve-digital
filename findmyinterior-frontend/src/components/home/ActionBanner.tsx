import { Users, BookOpen, Hammer, HardHat, Calculator } from "lucide-react";

export function ActionBanner() {
  const actions = [
    {
      icon: <Users className="w-8 h-8 text-gray-500" strokeWidth={1.5} />,
      title: "COMPARE EXPERTS",
      desc: "Compare profiles, reviews ratings & prices",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-gray-500" strokeWidth={1.5} />,
      title: "MATERIAL INQUIRY",
      desc: "Send inquiry to multiple suppliers",
    },
    {
      icon: <Hammer className="w-8 h-8 text-gray-500" strokeWidth={1.5} />,
      title: "TENDER & BIDDING",
      desc: "Builders post requirements, get best quotes",
    },
    {
      icon: <HardHat className="w-8 h-8 text-gray-500" strokeWidth={1.5} />,
      title: "LABOUR REQUIREMENT",
      desc: "Post job & hire skilled workers",
    },
    {
      icon: <Calculator className="w-8 h-8 text-gray-500" strokeWidth={1.5} />,
      title: "COST CALCULATOR",
      desc: "Calculate your interior cost instantly",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-slate-900 border-y border-gray-200 dark:border-slate-800 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-slate-800">
          {actions.map((action, idx) => (
            <div key={idx} className={`flex items-start gap-4 ${idx !== 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''} flex-1`}>
              <div className="shrink-0 mt-1">
                {action.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="text-xs font-bold text-[#0a1c3a] dark:text-white uppercase tracking-wide mb-1">
                  {action.title}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug font-medium">
                  {action.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
