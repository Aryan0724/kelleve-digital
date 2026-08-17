"use client";

import React from "react";
import Link from "next/link";
import { 
  X, 
  FileText, 
  MessageSquare, 
  Scale, 
  Handshake, 
  Home, 
  Star,
  ArrowLeft
} from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      number: 1,
      title: "Post Your Requirement",
      desc: "Tell us what you need, add details, photos & budget.",
      icon: <FileText className="w-5 h-5 text-[#E8701A]" />
    },
    {
      number: 2,
      title: "Get Multiple Quotes",
      desc: "Verified professionals send their quotes for your requirement.",
      icon: <MessageSquare className="w-5 h-5 text-[#E8701A]" />
    },
    {
      number: 3,
      title: "Compare & Choose",
      desc: "Compare profiles, reviews, ratings & prices. Choose the best fit.",
      icon: <Scale className="w-5 h-5 text-[#E8701A]" />
    },
    {
      number: 4,
      title: "Hire & Start Project",
      desc: "Hire the professional, discuss details & start your project.",
      icon: <Handshake className="w-5 h-5 text-[#E8701A]" />
    },
    {
      number: 5,
      title: "Project Delivered",
      desc: "Work gets completed on time with quality.",
      icon: <Home className="w-5 h-5 text-[#E8701A]" />
    },
    {
      number: 6,
      title: "Review & Rating",
      desc: "Rate your experience & help others make the right choice.",
      icon: <Star className="w-5 h-5 text-[#E8701A]" />
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 text-center shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="absolute left-4 top-1/2 -translate-y-1/2 md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg md:text-2xl font-black text-[#0a1c3a] dark:text-white">
            How It Works
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Simple steps to get your work done
          </p>

          <button 
            type="button"
            onClick={onClose} 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="relative pl-2 md:pl-4">
            {/* Vertical dashed timeline line */}
            <div className="absolute left-[19px] md:left-[27px] top-6 bottom-6 w-[2px] border-l-2 border-dashed border-[#E8701A]/30" />

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
                      <h3 className="text-xs md:text-base font-bold text-[#0a1c3a] dark:text-white leading-tight">
                        {step.title}
                      </h3>
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

          {/* Bottom Banner */}
          <div className="bg-[#FFF8F3] dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-2xl p-4 md:p-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-[#0a1c3a] dark:text-white text-sm md:text-base">
                Ready to Get Started?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Post your requirement now and get free quotes from trusted professionals.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-center">
              <Link href="/about" onClick={onClose}>
                <button 
                  type="button"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Learn More
                </button>
              </Link>
              <Link href="/post-requirement" onClick={onClose}>
                <button 
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                >
                  Post Your Project
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
