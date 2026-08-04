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
    <section className="hidden lg:block w-full bg-[#f8f9fa] dark:bg-background pt-4 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="premium-glass bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white dark:border-slate-800 p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/50 dark:divide-slate-700/50">
            {actions.map((action, idx) => (
              <div key={idx} className={`flex items-start gap-4 ${idx !== 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''} flex-1 group hover:-translate-y-1 transition-transform duration-300 cursor-default`}>
                <div className="shrink-0 mt-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 shadow-sm group-hover:bg-[#E8701A]/10 dark:group-hover:bg-[#E8701A]/20 transition-colors">
                  {action.icon}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[13px] font-extrabold text-[#0a1c3a] dark:text-white uppercase tracking-wider mb-1.5 group-hover:text-[#E8701A] transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {action.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
