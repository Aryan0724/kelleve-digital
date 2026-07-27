"use client";

import React from "react";
import { useUserLocation } from "@/context/LocationContext";
import { MapPin, Navigation, ShieldCheck } from "lucide-react";

export default function HomeLocationBanner() {
  const { city, openLocationModal, detectLocation, isDetecting } = useUserLocation();

  return (
    <div className="w-full max-w-3xl mx-auto mt-5">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-orange-200/80 dark:border-slate-800 rounded-full px-4 py-2 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-bold text-navy dark:text-white">
            📍 Showing verified businesses &amp; studios in:
          </span>
          <button
            type="button"
            onClick={openLocationModal}
            className="font-extrabold text-primary underline hover:text-orange-600 transition flex items-center gap-1 bg-orange-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-full"
          >
            <span>{city || "Mumbai"}</span>
            <span className="text-[10px]">▼</span>
          </button>
        </div>

        <button
          type="button"
          onClick={detectLocation}
          disabled={isDetecting}
          className="text-xs font-extrabold text-primary hover:text-orange-600 transition flex items-center gap-1 ml-auto"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{isDetecting ? "Detecting GPS..." : "Detect My GPS Location"}</span>
        </button>
      </div>
    </div>
  );
}
