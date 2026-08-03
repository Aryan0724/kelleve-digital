import { FileText, MessageSquare, Handshake, ClipboardCheck } from "lucide-react";

export function HowItWorksTimeline() {
  const steps = [
    {
      title: "Post your requirement",
      icon: <FileText className="w-4 h-4 text-[#E8701A]" />,
      desc: "Tell us about your project"
    },
    {
      title: "Receive quotes from professionals",
      icon: <MessageSquare className="w-4 h-4 text-[#E8701A]" />,
      desc: "Get multiple estimates quickly"
    },
    {
      title: "Compare, select & hire",
      icon: <Handshake className="w-4 h-4 text-[#E8701A]" />,
      desc: "Choose the best professional"
    },
    {
      title: "Monitor & execute your project",
      icon: <ClipboardCheck className="w-4 h-4 text-[#E8701A]" />,
      desc: "Track progress until completion"
    }
  ];

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-6 lg:hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-[1.15rem] font-black text-[#0a1c3a] dark:text-white mb-6">
          How It Works
        </h2>
        
        <div className="relative pl-3">
          {/* Vertical dashed line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-[#E8701A]/30"></div>
          
          <div className="flex flex-col gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0 border border-orange-200 dark:border-orange-800/50 shadow-sm relative bg-white z-10">
                  {step.icon}
                </div>
                <div className="flex flex-col pt-1">
                  <h4 className="text-xs font-bold text-[#0a1c3a] dark:text-white leading-tight">
                    {step.title}
                  </h4>
                  {/* Optional small description if needed, hidden for exact matching to the image unless required */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
