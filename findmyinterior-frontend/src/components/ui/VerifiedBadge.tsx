"use client";

import React from "react";
import { ShieldCheck, Crown, Sparkles, Award } from "lucide-react";

interface VerifiedBadgeProps {
  type?: "elite" | "pro" | "gold" | "verified" | string | null;
  planName?: string | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({
  type = "gold",
  planName,
  size = "md",
  showLabel = true,
  className = "",
}: VerifiedBadgeProps) {
  const normalizedType = (type || "verified").toLowerCase();

  // Size styling
  const sizeStyles = {
    sm: {
      container: "text-[10px] px-1.5 py-0.5 gap-1",
      icon: "w-3 h-3",
    },
    md: {
      container: "text-xs px-2.5 py-1 gap-1.5",
      icon: "w-4 h-4",
    },
    lg: {
      container: "text-sm px-3.5 py-1.5 gap-2",
      icon: "w-5 h-5",
    },
  }[size];

  if (normalizedType === "elite" || normalizedType.includes("elite")) {
    return (
      <span
        title="Elite Business Partner • Maximum Search Boost & Verified Enterprise"
        className={`inline-flex items-center font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 border border-yellow-200 select-none animate-pulse-slow ${sizeStyles.container} ${className}`}
      >
        <Crown className={`${sizeStyles.icon} text-slate-950 shrink-0 fill-slate-950`} />
        {showLabel && <span>{planName ? `${planName.toUpperCase()}` : "ELITE PARTNER"}</span>}
      </span>
    );
  }

  if (normalizedType === "pro" || normalizedType.includes("pro")) {
    return (
      <span
        title="Pro Business Member • Top Search Placement & Verified Leads"
        className={`inline-flex items-center font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20 border border-orange-300 select-none ${sizeStyles.container} ${className}`}
      >
        <Sparkles className={`${sizeStyles.icon} text-white shrink-0`} />
        {showLabel && <span>{planName ? `${planName.toUpperCase()}` : "PRO BUSINESS"}</span>}
      </span>
    );
  }

  if (normalizedType === "gold" || normalizedType.includes("gold") || normalizedType === "quickstart" || normalizedType === "growthplus") {
    return (
      <span
        title="Gold Verified Professional • Verified Identity & License"
        className={`inline-flex items-center font-extrabold uppercase tracking-wider rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 select-none ${sizeStyles.container} ${className}`}
      >
        <Award className={`${sizeStyles.icon} text-amber-500 shrink-0 fill-amber-500/20`} />
        {showLabel && <span>GOLD VERIFIED</span>}
      </span>
    );
  }

  // Standard verified badge
  return (
    <span
      title="Verified Business"
      className={`inline-flex items-center font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 ${sizeStyles.container} ${className}`}
    >
      <ShieldCheck className={`${sizeStyles.icon} text-emerald-500 shrink-0`} />
      {showLabel && <span>VERIFIED</span>}
    </span>
  );
}
