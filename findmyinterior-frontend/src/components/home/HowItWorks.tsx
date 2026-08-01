"use client";

import { FileEdit, MessageSquareText, Scale, Handshake } from "lucide-react";
import Link from "next/link";

export function HowItWorks() {
  const steps = [
    {
      icon: FileEdit,
      title: "Post Your Project",
      num: 1,
    },
    {
      icon: MessageSquareText,
      title: "Get Multiple Quotes",
      num: 2,
    },
    {
      icon: Scale,
      title: "Compare & Choose",
      num: 3,
    },
    {
      icon: Handshake,
      title: "Hire & Get It Done",
      num: 4,
    },
  ];

  return (
    <section className="py-8 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">How It Works?</h2>
          <Link href="/how-it-works" className="text-primary font-semibold text-sm hover:underline">
            See All Steps
          </Link>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col items-center text-center group">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm group-hover:border-primary group-hover:shadow-md transition-all">
                      <Icon className="w-8 h-8 text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    {/* Number Badge */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm md:text-base max-w-[120px]">
                    {step.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
