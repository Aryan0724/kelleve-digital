"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Filter, Search, X, Bookmark, BookmarkCheck, RotateCcw, MapPin, Shield, Clock, Award, DollarSign } from "lucide-react";

export function ProfessionalsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nameInput, setNameInput] = useState(searchParams.get("name") || "");
  const [savedFilters, setSavedFilters] = useState<string | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fmi_saved_filters");
    if (saved) {
      setSavedFilters(saved);
    }
  }, []);

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of Object.entries(updates)) {
        if (value && value !== "all" && value !== "") {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleNameSearch = (value: string) => {
    setNameInput(value);
    router.push("?" + createQueryString({ name: value }));
  };

  const handleSaveFilters = () => {
    const currentQuery = searchParams.toString();
    if (currentQuery) {
      localStorage.setItem("fmi_saved_filters", currentQuery);
      setSavedFilters(currentQuery);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }
  };

  const handleApplySavedFilters = () => {
    if (savedFilters) {
      router.push("/professionals?" + savedFilters);
    }
  };

  const hasActiveFilters = Boolean(
    searchParams.get("name") ||
    searchParams.get("city") ||
    searchParams.get("location") ||
    searchParams.get("budget") ||
    searchParams.get("min_rating") ||
    searchParams.get("experience") ||
    searchParams.get("verification_level") ||
    searchParams.get("availability") ||
    searchParams.get("verified") ||
    (searchParams.get("sort") && searchParams.get("sort") !== "featured")
  );

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm sticky top-24 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
          <Filter className="h-5 w-5 text-orange-500" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setNameInput("");
              router.push("/professionals");
            }}
            className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Save / Load Preset Bar */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={handleSaveFilters}
          disabled={!hasActiveFilters}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Save your current filter combination"
        >
          {showSavedToast ? (
            <>
              <BookmarkCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400">Saved!</span>
            </>
          ) : (
            <>
              <Bookmark className="h-3.5 w-3.5 text-orange-500" />
              <span>Save Filters</span>
            </>
          )}
        </button>
        {savedFilters && (
          <button
            type="button"
            onClick={handleApplySavedFilters}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm transition"
            title="Apply previously saved filters"
          >
            <span>⚡ Apply Saved</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* ── Search by Name ── */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Search by Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Company or person name..."
              value={nameInput}
              onChange={(e) => handleNameSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
            {nameInput && (
              <button
                type="button"
                onClick={() => handleNameSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Location & Distance (Bihar Cities) ── */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <MapPin className="h-3.5 w-3.5 text-orange-500" />
            <span>Location & City</span>
          </label>
          <select
            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl text-sm py-2.5 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            value={searchParams.get("city") || ""}
            onChange={(e) => {
              router.push("?" + createQueryString({ city: e.target.value }));
            }}
          >
            <option value="">All Bihar (Any Distance)</option>
            <option value="patna">Patna</option>
            <option value="gaya">Gaya</option>
            <option value="muzaffarpur">Muzaffarpur</option>
            <option value="bhagalpur">Bhagalpur</option>
            <option value="darbhanga">Darbhanga</option>
            <option value="purnia">Purnia</option>
            <option value="bihar sharif">Bihar Sharif</option>
            <option value="arrah">Arrah</option>
            <option value="begusarai">Begusarai</option>
            <option value="katihar">Katihar</option>
          </select>
        </div>

        {/* ── Budget Tier ── */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <DollarSign className="h-3.5 w-3.5 text-orange-500" />
            <span>Budget Range</span>
          </label>
          <select
            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl text-sm py-2.5 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            value={searchParams.get("budget") || ""}
            onChange={(e) => {
              router.push("?" + createQueryString({ budget: e.target.value }));
            }}
          >
            <option value="">All Budgets</option>
            <option value="Economy">Economy (&lt; ₹1 Lakh)</option>
            <option value="Standard">Standard (₹1 Lakh – ₹5 Lakhs)</option>
            <option value="Premium">Premium (₹5 Lakhs – ₹15 Lakhs)</option>
            <option value="Luxury">Luxury (₹15 Lakhs+)</option>
          </select>
        </div>

        {/* ── Experience Years ── */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <Award className="h-3.5 w-3.5 text-orange-500" />
            <span>Experience</span>
          </label>
          <select
            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl text-sm py-2.5 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            value={searchParams.get("experience") || ""}
            onChange={(e) => {
              router.push("?" + createQueryString({ experience: e.target.value }));
            }}
          >
            <option value="">Any Experience</option>
            <option value="1">1+ Years Experience</option>
            <option value="3">3+ Years Experience</option>
            <option value="5">5+ Years Experience</option>
            <option value="10">10+ Years Experience</option>
          </select>
        </div>

        {/* ── Verification & Trust ── */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <Shield className="h-3.5 w-3.5 text-orange-500" />
            <span>Verification Status</span>
          </label>
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 dark:border-slate-600 text-orange-600 focus:ring-orange-500"
                checked={searchParams.get("verified") === "true"}
                onChange={(e) => {
                  router.push("?" + createQueryString({ verified: e.target.checked ? "true" : "" }));
                }}
              />
              <span>Verified Only</span>
            </label>
            <select
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl text-sm py-2 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              value={searchParams.get("verification_level") || ""}
              onChange={(e) => {
                router.push("?" + createQueryString({ verification_level: e.target.value }));
              }}
            >
              <option value="">All Verification Levels</option>
              <option value="verified_business">Verified Business</option>
              <option value="trusted_professional">Trusted Professional</option>
              <option value="elite_professional">Elite Professional</option>
            </select>
          </div>
        </div>

        {/* ── Availability ── */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            <span>Availability</span>
          </label>
          <select
            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl text-sm py-2.5 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            value={searchParams.get("availability") || ""}
            onChange={(e) => {
              router.push("?" + createQueryString({ availability: e.target.value }));
            }}
          >
            <option value="">Any Time</option>
            <option value="immediate">Available Immediately</option>
            <option value="2_weeks">Available within 2 Weeks</option>
          </select>
        </div>

        {/* ── Sort By ── */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Sort By
          </label>
          <select
            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl text-sm py-2.5 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            value={searchParams.get("sort") || "featured"}
            onChange={(e) => {
              router.push("?" + createQueryString({ sort: e.target.value }));
            }}
          >
            <option value="featured">Featured First</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>

        {/* ── Minimum Rating ── */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Minimum Rating
          </label>
          <div className="space-y-2">
            {[4, 3, 2].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <input
                  type="radio"
                  name="min_rating"
                  className="border-slate-300 dark:border-slate-600 text-orange-600 focus:ring-orange-500"
                  checked={searchParams.get("min_rating") === rating.toString()}
                  onChange={() => {
                    router.push("?" + createQueryString({ min_rating: rating.toString() }));
                  }}
                />
                <span>{rating}★ &amp; Above</span>
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="min_rating"
                className="border-slate-300 dark:border-slate-600 text-orange-600 focus:ring-orange-500"
                checked={!searchParams.get("min_rating")}
                onChange={() => {
                  router.push("?" + createQueryString({ min_rating: "" }));
                }}
              />
              <span>Any Rating</span>
            </label>
          </div>
        </div>

        {/* ── Clear All Bottom Button ── */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setNameInput("");
              router.push("/professionals");
            }}
            className="w-full text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 font-bold py-2.5 border border-orange-200 dark:border-orange-800/60 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 transition shadow-sm"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
