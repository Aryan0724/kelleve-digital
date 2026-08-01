"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, ShieldCheck, Clock, DollarSign, Flame, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const SOCIAL_PROOF_MESSAGES = [
  "🎉 Rajesh from Patna just requested 3 Free Interior Quotes (2 mins ago)",
  "✨ Priya from Gaya connected with a Verified Interior Designer (5 mins ago)",
  "🔥 Amit from Muzaffarpur saved 25% with a Verified Contractor (8 mins ago)",
  "⚡ Sneha from Bhagalpur booked a Free Home Consultation (12 mins ago)",
  "🏆 Vikas from Darbhanga got 4 instant builder quotes (15 mins ago)",
  "💎 Anjali from Bihar Sharif found an Elite Kitchen Supplier (18 mins ago)",
];

export function ConversionModalsAndTickers() {
  const [showTimedModal, setShowTimedModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showTicker, setShowTicker] = useState(false);
  const [currentTickerIdx, setCurrentTickerIdx] = useState(0);

  // 1. Timed Enquiry Modal (After 35 seconds)
  useEffect(() => {
    const isDismissed = localStorage.getItem("fmi_enquiry_dismissed_v1");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowTimedModal(true);
      }, 35000);
      return () => clearTimeout(timer);
    }
  }, []);

  // 2. Exit Intent Modal (Desktop e.clientY <= 5)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        const exitDismissed = localStorage.getItem("fmi_exit_dismissed_v1");
        if (!exitDismissed && !showTimedModal) {
          setShowExitModal(true);
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [showTimedModal]);

  // 3. Social Proof Ticker (Cycles every 25 seconds)
  useEffect(() => {
    const tickerDismissed = sessionStorage.getItem("fmi_ticker_closed");
    if (!tickerDismissed) {
      const initialTimer = setTimeout(() => setShowTicker(true), 12000);
      const interval = setInterval(() => {
        setCurrentTickerIdx((prev) => (prev + 1) % SOCIAL_PROOF_MESSAGES.length);
      }, 25000);
      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    }
  }, []);

  const dismissTimedModal = () => {
    localStorage.setItem("fmi_enquiry_dismissed_v1", "true");
    setShowTimedModal(false);
  };

  const dismissExitModal = () => {
    localStorage.setItem("fmi_exit_dismissed_v1", "true");
    setShowExitModal(false);
  };

  const dismissTicker = () => {
    sessionStorage.setItem("fmi_ticker_closed", "true");
    setShowTicker(false);
  };

  return (
    <>
      {/* ── 1. Timed Enquiry Modal ── */}
      {showTimedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">
            {/* Top orange gradient bar */}
            <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
            <button
              onClick={dismissTimedModal}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Get Free Quotes in 24 Hours</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
                Looking for Bihar&apos;s Best Interior Professionals?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                Compare verified designers &amp; contractors near you. Submit your requirement in 30 seconds and receive instant pricing estimates.
              </p>

              {/* Conversion Trust Points */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <DollarSign className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">No Hidden Charges</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <ShieldCheck className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">100% Verified Pros</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <Clock className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Quotes in 24 Hours</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <Flame className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Limited Free Listings</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/post-requirement"
                  onClick={dismissTimedModal}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition"
                >
                  <span>Get 3 Free Quotes Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={dismissTimedModal}
                  className="px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Exit Intent Modal ── */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">
            <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
            <button
              onClick={dismissExitModal}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-7 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 mb-4">
                <Flame className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Wait! Don&apos;t Leave Without Your Free Quotes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                Only <strong className="text-orange-600 dark:text-orange-400">3 Verified Professionals</strong> are available in your area today. Get free custom pricing in 24 hours with zero hidden charges.
              </p>
              <Link
                href="/post-requirement"
                onClick={dismissExitModal}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition mb-3"
              >
                <span>Claim My Free Quotes Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={dismissExitModal}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                No thanks, I prefer paying full price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Live Social Proof Ticker (Bottom-left toast) ── */}
      {showTicker && (
        <div className="fixed bottom-5 left-5 z-40 max-w-sm animate-in slide-in-from-bottom-5 duration-500">
          <div className="relative flex items-center gap-3 p-3.5 pr-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
              {SOCIAL_PROOF_MESSAGES[currentTickerIdx]}
            </p>
            <button
              onClick={dismissTicker}
              className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
