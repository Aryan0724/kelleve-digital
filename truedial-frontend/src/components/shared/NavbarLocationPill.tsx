"use client";

import React from "react";
import { useUserLocation } from "@/context/LocationContext";
import { MapPin, ChevronDown } from "lucide-react";

export default function NavbarLocationPill() {
  const { city, openLocationModal } = useUserLocation();

  return (
    <button
      type="button"
      onClick={openLocationModal}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-slate-800 border border-orange-200 dark:border-slate-700 hover:bg-orange-100 dark:hover:bg-slate-700 text-primary font-extrabold text-xs transition shadow-sm"
      title="Select or Detect your Location"
    >
      <MapPin className="w-3.5 h-3.5 text-primary fill-primary/20 shrink-0" />
      <span className="truncate max-w-[120px]">{city || "Mumbai"}</span>
      <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
    </button>
  );
}
