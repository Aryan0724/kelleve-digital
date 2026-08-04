import { FileText, MessageSquare, Handshake, Scale, Home, Star } from "lucide-react";

export function HowItWorksTimeline() {
  const steps = [
    {
      number: 1,
      title: "Post Your Requirement",
      icon: <FileText className="w-4 h-4 text-[#E8701A]" />,
      desc: "Tell us what you need, add details, photos & budget."
    },
    {
      number: 2,
      title: "Get Multiple Quotes",
      icon: <MessageSquare className="w-4 h-4 text-[#E8701A]" />,
      desc: "Verified professionals send their quotes for your requirement."
    },
    {
      number: 3,
      title: "Compare & Choose",
      icon: <Scale className="w-4 h-4 text-[#E8701A]" />,
      desc: "Compare profiles, reviews, ratings & prices. Choose the best fit."
    },
    {
      number: 4,
      title: "Hire & Start Project",
      icon: <Handshake className="w-4 h-4 text-[#E8701A]" />,
      desc: "Hire the professional, discuss details & start your project."
    },
    {
      number: 5,
      title: "Project Delivered",
      icon: <Home className="w-4 h-4 text-[#E8701A]" />,
      desc: "Work gets completed on time with quality."
    },
    {
      number: 6,
      title: "Review & Rating",
      icon: <Star className="w-4 h-4 text-[#E8701A]" />,
      desc: "Rate your experience & help others make the right choice."
    }
  ];

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-8 lg:hidden">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-xl md:text-2xl font-black text-[#0a1c3a] dark:text-white mb-1 text-center">
          How It Works
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
          Simple steps to get your work done
        </p>
        
        <div className="relative pl-2 md:pl-4">
          {/* Vertical dashed line */}
          <div className="absolute left-[19px] md:left-[27px] top-6 bottom-6 w-[2px] border-l-2 border-dashed border-[#E8701A]/30"></div>
          
          <div className="flex flex-col gap-3 md:gap-4 relative z-10">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center gap-3 md:gap-4">
                {/* Circle number */}
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#E8701A] text-white font-extrabold text-xs md:text-sm flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/30">
                  {step.number}
                </div>

                {/* Card */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700/60 p-3 md:p-4 shadow-sm flex items-center justify-between gap-3 hover:border-orange-200 dark:hover:border-orange-800/60 transition-colors">
                  <div className="flex flex-col">
                    <h4 className="text-xs md:text-base font-bold text-[#0a1c3a] dark:text-white leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                      {step.desc}
                    </p>
                  </div>

                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/50">
                    {step.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
