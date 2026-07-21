"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Sofa, Building2, HardHat, Hammer, Truck, Tag, Paintbrush, Wrench, Zap, Droplets } from "lucide-react";

const TYPES = [
  { label: "All", value: "", icon: null },
  { label: "Interior Designer", value: "Interior Designer", icon: Sofa },
  { label: "Architect", value: "Architect", icon: Building2 },
  { label: "Contractor", value: "Contractor", icon: HardHat },
  { label: "Skilled Worker", value: "Skilled Worker", icon: Hammer },
  { label: "Supplier", value: "Supplier", icon: Truck },
  { label: "Brand", value: "Brand", icon: Tag },
  { label: "Painter", value: "Painter", icon: Paintbrush },
  { label: "Carpenter", value: "Carpenter", icon: Wrench },
  { label: "Electrician", value: "Electrician", icon: Zap },
  { label: "Plumber", value: "Plumber", icon: Droplets },
];

export function ProfessionalTypeSwitcher({ currentSearch }: { currentSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/professionals?${params.toString()}`);
  };

  const isActive = (value: string) => {
    if (value === "") return !currentSearch;
    return currentSearch.toLowerCase().includes(value.toLowerCase());
  };

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Browse by Type</p>
      <div className="flex flex-wrap gap-2">
        {TYPES.map((type) => {
          const Icon = type.icon;
          const active = isActive(type.value);
          return (
            <button
              key={type.value}
              onClick={() => handleSelect(type.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                active
                  ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-orange-400 hover:text-orange-600"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
