import { FileText, Users, Scale, Handshake } from "lucide-react";
import Link from "next/link";

export function HowItWorksTimeline() {
  const steps = [
    {
      title: "Post Your Project",
      icon: <FileText className="w-5 h-5 text-slate-800 dark:text-slate-100" strokeWidth={1.75} />,
      desc: "Share your requirements in a few minutes"
    },
    {
      title: "Get Multiple Quotes",
      icon: <Users className="w-5 h-5 text-slate-800 dark:text-slate-100" strokeWidth={1.75} />,
      desc: "Receive quotes from verified professionals"
    },
    {
      title: "Compare & Choose",
      icon: <Scale className="w-5 h-5 text-slate-800 dark:text-slate-100" strokeWidth={1.75} />,
      desc: "Compare profiles, reviews & prices"
    },
    {
      title: "Hire & Get It Done",
      icon: <Handshake className="w-5 h-5 text-slate-800 dark:text-slate-100" strokeWidth={1.75} />,
      desc: "Hire the best professional and relax"
    }
  ];

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-6 lg:py-8 lg:mt-6 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* DESKTOP HEADER (100% exact original) */}
        <div className="hidden lg:flex justify-between items-center mb-10">
          <h2 className="text-xl font-black text-[#1A1A1A] dark:text-white">
            How It Works?
          </h2>
          <Link href="/how-it-works">
            <button className="bg-white border border-slate-200 text-[#E8701A] font-bold text-sm px-4 py-2 rounded-full hover:bg-slate-50 transition-colors">
              See All Steps &rarr;
            </button>
          </Link>
        </div>

        {/* MOBILE HEADER (mockup layout) */}
        <div className="flex justify-between items-center mb-5 lg:hidden">
          <h2 className="text-[1.15rem] font-black text-[#0a1c3a] dark:text-white tracking-tight">
            How It Works?
          </h2>
          <Link 
            href="/how-it-works"
            className="text-xs font-bold text-[#E8701A] hover:underline"
          >
            See All Steps
          </Link>
        </div>

        {/* MOBILE VIEW: Exact 4-Node Horizontal Timeline */}
        <div className="lg:hidden relative w-full pt-2 pb-2">
          <div className="absolute top-[26px] left-[12%] right-[12%] h-[1.5px] bg-slate-200 dark:bg-slate-700 z-0"></div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '4px' }} className="relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1.5 -left-1 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#E8701A] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shadow-xs">
                    {idx + 1}
                  </div>
                </div>

                <span className="text-[9.5px] sm:text-[10.5px] font-bold text-[#0a1c3a] dark:text-white leading-[1.2] px-0.5">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP VIEW: 100% Original Desktop Timeline */}
        <div className="hidden lg:flex relative w-full items-start justify-between">
          <div className="absolute left-8 right-8 top-6 h-[2px] border-t-2 border-dashed border-slate-200 dark:border-slate-700 z-0"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 relative z-10">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm z-10">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[#E8701A] text-white flex items-center justify-center text-[10px] font-bold z-20">
                  {idx + 1}
                </div>
              </div>
              <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white leading-tight mt-4 text-center px-4">
                {step.title}
              </h4>
              <p className="text-xs text-slate-500 mt-2 text-center px-6 max-w-[200px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
