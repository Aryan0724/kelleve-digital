import React from "react";
import { ShieldCheck, Clock, Coins, UserCheck } from "lucide-react";

export function WhyChooseUs() {
  const reasons = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      title: "Verified Professionals",
      description: "Every professional goes through a strict 5-step background and portfolio verification process.",
    },
    {
      icon: <Coins className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      title: "Best Price Guarantee",
      description: "Get multiple quotes and compare easily. Ensure you always pay the right market price.",
    },
    {
      icon: <Clock className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      title: "On-Time Delivery",
      description: "Projects are tracked with milestones. Delayed projects are penalized by our platform.",
    },
    {
      icon: <UserCheck className="w-8 h-8 text-[#FF6B00]" strokeWidth={1.5} />,
      title: "Dedicated Support",
      description: "A relationship manager is assigned to every project over ₹1 Lakh to ensure smooth execution.",
    }
  ];

  return (
    <div className="w-full py-16 bg-[#F8FAFC] dark:bg-slate-900 rounded-[32px] my-12 border border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 xl:px-12 text-center max-w-5xl">
        <h2 className="text-3xl lg:text-4xl font-black text-[#111827] dark:text-white mb-4 tracking-tight">
          Why Choose <span className="text-[#FF6B00]">FindMyInterior</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-lg mb-12 max-w-2xl mx-auto">
          We bring transparency, trust, and predictability to home interiors and construction.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex flex-col items-start group">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-300">
                {React.cloneElement(reason.icon as React.ReactElement<any>, { className: "w-8 h-8 text-[#FF6B00] group-hover:text-white transition-colors" })}
              </div>
              <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-3 leading-tight">{reason.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
