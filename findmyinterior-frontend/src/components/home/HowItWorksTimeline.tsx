import { FileText, MessageSquare, Handshake, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export function HowItWorksTimeline() {
  const steps = [
    {
      title: "Post Your Project",
      icon: <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-[#1A1A1A] dark:text-white" strokeWidth={1.5} />,
      desc: "Share your requirements in a few minutes"
    },
    {
      title: "Get Multiple Quotes",
      icon: <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-[#1A1A1A] dark:text-white" strokeWidth={1.5} />,
      desc: "Receive quotes from verified professionals"
    },
    {
      title: "Compare & Choose",
      icon: <Handshake className="w-5 h-5 lg:w-6 lg:h-6 text-[#1A1A1A] dark:text-white" strokeWidth={1.5} />,
      desc: "Compare profiles, reviews & prices and choose best fit"
    },
    {
      title: "Hire & Get It Done",
      icon: <ClipboardCheck className="w-5 h-5 lg:w-6 lg:h-6 text-[#1A1A1A] dark:text-white" strokeWidth={1.5} />,
      desc: "Hire the best professional and relax"
    }
  ];

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-6 lg:py-8 lg:mt-6">
      <div className="container mx-auto px-4">
        
        {/* Desktop Header */}
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

        {/* Mobile Header */}
        <h2 className="text-[1.15rem] font-black text-[#1A1A1A] dark:text-white mb-6 lg:hidden">
          How It Works
        </h2>
        
        {/* Mobile Vertical View */}
        <div className="relative pl-3 lg:hidden">
          <div className="absolute left-[27px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-[#E8701A]/30"></div>
          <div className="flex flex-col gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-200 shadow-sm relative bg-white z-10">
                  <div className="text-xs font-bold text-[#E8701A]">{idx + 1}</div>
                </div>
                <div className="flex flex-col pt-1">
                  <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Horizontal View */}
        <div className="hidden lg:flex relative w-full items-start justify-between">
          {/* Horizontal dashed line connecting steps */}
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
