"use client";

import React, { useState } from "react";
import { useUserLocation } from "@/context/LocationContext";
import { MapPin, Navigation, X, Search, Check, Sparkles } from "lucide-react";

const MAJOR_CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Chandigarh",
  "Cochin",
  "Indore",
  "Bhopal",
  "Noida",
  "Gurgaon",
  "Thane",
  "Navi Mumbai",
  "Vadodara",
];

export default function LocationSelectorModal() {
  const { city, setCity, detectLocation, isDetecting, isModalOpen, closeLocationModal } = useUserLocation();
  const [filterQuery, setFilterQuery] = useState("");
  const [customCity, setCustomCity] = useState("");

  if (!isModalOpen) return null;

  const filteredCities = MAJOR_CITIES.filter((c) =>
    c.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      setCity(customCity.trim());
      setCustomCity("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
              TrueDial Location Engine
            </span>
            <h3 className="text-xl font-extrabold text-navy dark:text-white mt-1">
              Select Your City &amp; Location
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              We use your location to show verified nearby businesses, studios &amp; offers
            </p>
          </div>
          <button
            onClick={closeLocationModal}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-orange-100 text-gray-500 hover:text-primary flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detect GPS Button */}
        <div className="p-6 bg-orange-50/60 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-75"
          >
            {isDetecting ? (
              <span className="animate-spin text-lg">↻</span>
            ) : (
              <Navigation className="w-4 h-4 animate-bounce" />
            )}
            <span>
              {isDetecting ? "Detecting Your GPS City..." : "📍 Detect My Current Location (GPS)"}
            </span>
          </button>
        </div>

        {/* Search City / Custom Input */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search or enter any city / pincode in India..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setCustomCity(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-medium text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {filterQuery && !filteredCities.includes(filterQuery) && (
            <form onSubmit={handleCustomSubmit} className="mt-3">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-navy dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-primary transition flex items-center justify-between"
              >
                <span>Use &quot;{filterQuery}&quot; as my location</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Top Major Cities Grid */}
        <div className="p-6 pt-3 overflow-y-auto flex-1">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Top Cities
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredCities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`py-2.5 px-3 rounded-xl text-left text-xs font-bold transition flex items-center justify-between border ${
                  city === c
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700 hover:border-orange-300 hover:text-primary"
                }`}
              >
                <span className="truncate">{c}</span>
                {city === c && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
