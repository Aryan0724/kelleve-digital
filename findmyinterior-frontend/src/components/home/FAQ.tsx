"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Are the professionals on FindMyInterior verified?",
      a: "Yes, every professional on our platform goes through a strict vetting process. We verify their business licenses, past projects, customer reviews, and market reputation before awarding them the 'Verified Professional' badge."
    },
    {
      q: "Is it free to post a project and get quotes?",
      a: "Absolutely! Posting your requirement is 100% free for homeowners and businesses. You will receive multiple quotes from professionals without any upfront charges."
    },
    {
      q: "How does the Best Price Guarantee work?",
      a: "Because you get multiple competitive quotes from local professionals, you can compare pricing and services side-by-side to ensure you're getting the best market rate for your project."
    },
    {
      q: "Can I see past work before hiring someone?",
      a: "Yes. Every professional profile includes a portfolio of past projects, ratings, and customer reviews so you can evaluate their work quality before making a decision."
    },
    {
      q: "What if there is a dispute with the professional?",
      a: "We have a dedicated support team to help mediate any issues that arise. However, we strongly recommend signing a clear contract with the professional regarding payment terms and timelines before work begins."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#111827] dark:text-white mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-[#FF6B00]" />
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          Everything you need to know about using FindMyInterior.
        </p>
      </div>

      <div className="space-y-4 w-full">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className={`bg-white dark:bg-slate-900 border ${openIndex === i ? 'border-[#FF6B00] shadow-md' : 'border-slate-200 dark:border-slate-800'} rounded-2xl overflow-hidden transition-all duration-300`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className={`font-bold text-lg ${openIndex === i ? 'text-[#FF6B00]' : 'text-[#111827] dark:text-white'}`}>
                {faq.q}
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-[#FF6B00]' : ''}`} />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="p-6 pt-0 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
