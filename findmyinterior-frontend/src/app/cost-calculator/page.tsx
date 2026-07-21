"use client";

import { Metadata } from "next";
import Link from "next/link";
import { Calculator, IndianRupee, ArrowRight } from "lucide-react";
import { useState } from "react";

const ROOM_TYPES = [
  { label: "1BHK Apartment", sqft: 600 },
  { label: "2BHK Apartment", sqft: 900 },
  { label: "3BHK Apartment", sqft: 1300 },
  { label: "4BHK Apartment", sqft: 1800 },
  { label: "Villa", sqft: 3000 },
  { label: "Commercial/Office", sqft: 1000 },
];

const QUALITY_TIERS = [
  { label: "Economy", ratePerSqft: 800, color: "text-green-600 bg-green-50 border-green-200" },
  { label: "Standard", ratePerSqft: 1500, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { label: "Premium", ratePerSqft: 2500, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { label: "Luxury", ratePerSqft: 4000, color: "text-orange-600 bg-orange-50 border-orange-200" },
];

export default function CostCalculatorPage() {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[1]);
  const [customSqft, setCustomSqft] = useState("");
  const [selectedTier, setSelectedTier] = useState(QUALITY_TIERS[1]);

  const sqft = customSqft ? parseInt(customSqft) || 0 : selectedRoom.sqft;
  const estimate = sqft * selectedTier.ratePerSqft;

  const formatINR = (val: number) =>
    val >= 100000
      ? `₹${(val / 100000).toFixed(1)} Lakhs`
      : `₹${val.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Interior Cost Calculator</h1>
          <p className="text-slate-500">Get a rough estimate for your interior design project in Bihar.</p>
          <p className="text-xs text-slate-400 mt-1">* Estimates are indicative. Actual costs may vary based on design complexity and materials.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          {/* Step 1: Room Type */}
          <h2 className="font-bold text-slate-800 mb-3">1. Select Property Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            {ROOM_TYPES.map((room) => (
              <button
                key={room.label}
                onClick={() => { setSelectedRoom(room); setCustomSqft(""); }}
                className={`p-3 border rounded-xl text-sm font-medium text-left transition-all ${
                  selectedRoom.label === room.label && !customSqft
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="block font-semibold">{room.label}</span>
                <span className="text-xs text-slate-400">~{room.sqft.toLocaleString()} sq ft</span>
              </button>
            ))}
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-slate-700 block mb-1">Or enter custom area (sq ft)</label>
            <input
              type="number"
              value={customSqft}
              onChange={(e) => setCustomSqft(e.target.value)}
              placeholder="e.g. 1200"
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Step 2: Quality */}
          <h2 className="font-bold text-slate-800 mb-3">2. Select Quality Tier</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            {QUALITY_TIERS.map((tier) => (
              <button
                key={tier.label}
                onClick={() => setSelectedTier(tier)}
                className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                  selectedTier.label === tier.label
                    ? tier.color + " border-current"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="block font-bold">{tier.label}</span>
                <span className="text-xs">₹{tier.ratePerSqft.toLocaleString()}/sqft</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="bg-gradient-to-br from-[#0a1c3a] to-[#1a3060] rounded-2xl p-8 text-white text-center mb-6">
          <p className="text-white/70 text-sm mb-1">Estimated Cost for {sqft.toLocaleString()} sq ft ({selectedTier.label})</p>
          <div className="flex items-center justify-center gap-2 mb-1">
            <IndianRupee className="w-8 h-8 text-[#E8701A]" />
            <span className="text-4xl font-bold">{formatINR(estimate)}</span>
          </div>
          <p className="text-white/50 text-xs">Range: {formatINR(estimate * 0.8)} – {formatINR(estimate * 1.2)}</p>
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-sm mb-4">Ready to get accurate quotes from real professionals?</p>
          <Link
            href="/post-requirement"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Post Your Requirement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
