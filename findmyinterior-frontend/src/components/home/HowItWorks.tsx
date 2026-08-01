import { Search, FileText, CheckCircle, MessageSquare } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Search or Post",
      description: "Browse verified professionals or post your exact requirement to let them contact you.",
      icon: Search,
    },
    {
      title: "Compare Profiles",
      description: "Review past projects, check verified ratings, and compare quotes from multiple experts.",
      icon: FileText,
    },
    {
      title: "Connect Instantly",
      description: "Chat or call directly with professionals. No middleman, no hidden commission fees.",
      icon: MessageSquare,
    },
    {
      title: "Hire & Build",
      description: "Finalize the deal and start building your dream space with trusted local experts.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="w-full py-24 bg-slate-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          How FindMyInterior Works
        </h2>
        <p className="text-slate-500 text-lg mb-16 max-w-2xl mx-auto">
          Your journey to a beautiful home starts here. Simple, transparent, and hassle-free.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-200 z-0" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative z-10 flex flex-col items-center group">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center mb-6 group-hover:border-orange-100 group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
