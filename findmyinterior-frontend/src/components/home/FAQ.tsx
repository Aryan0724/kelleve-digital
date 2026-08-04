"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do you verify your professionals?",
      answer: "Every professional on FindMyInterior goes through a strict 5-step verification process, including identity checks, business registration verification, past project reviews, and reference checks. We only list the top 10% of applicants."
    },
    {
      question: "Is it free to get quotes from professionals?",
      answer: "Yes, posting a project and receiving initial quotes from professionals is completely free. You only pay the professional when you decide to hire them."
    },
    {
      question: "What if I am not satisfied with the work?",
      answer: "We offer a dedicated relationship manager for projects over ₹1 Lakh. If there are any disputes, our arbitration team steps in to ensure fair resolution. Payments are often tied to milestones to protect both parties."
    },
    {
      question: "How do I ensure the materials used are genuine?",
      answer: "Professionals outline the exact brands and materials in their quotes. For premium projects, our relationship managers can do random site audits to ensure compliance with the agreed specifications."
    },
    {
      question: "Can I see a professional's past work before hiring?",
      answer: "Absolutely. Every professional profile features a detailed portfolio of their past projects, including high-resolution images, project costs, and client reviews."
    }
  ];

  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#111827] dark:text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Everything you need to know about how FindMyInterior works.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${openIdx === idx ? "bg-white dark:bg-slate-900 shadow-md border-[#FF6B00]/30" : "bg-transparent hover:border-[#FF6B00]/50"}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className={`font-bold text-lg ${openIdx === idx ? "text-[#FF6B00]" : "text-[#111827] dark:text-white"}`}>
                  {faq.question}
                </span>
                {openIdx === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#FF6B00] flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                )}
              </button>
              
              <div 
                className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${openIdx === idx ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
