"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, Search, X } from "lucide-react";

export function ProfessionalsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nameInput, setNameInput] = useState(searchParams.get("name") || "");

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of Object.entries(updates)) {
        if (value) {
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

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-900 sticky top-24">
      <div className="flex items-center gap-2 font-semibold text-lg mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
        <Filter className="h-5 w-5 text-orange-500" /> Filters
      </div>

      <div className="space-y-5">
        {/* ── Search by Name ── */}
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Search by Name</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Company or person name..."
              value={nameInput}
              onChange={(e) => handleNameSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 transition"
            />
            {nameInput && (
              <button
                type="button"
                onClick={() => handleNameSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Verification ── */}
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Verification</h3>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-orange-600 focus:ring-orange-600"
              checked={searchParams.get("verified") === "true"}
              onChange={(e) => {
                router.push("?" + createQueryString({ verified: e.target.checked ? "true" : "" }));
              }}
            />
            Verified Only
          </label>
        </div>

        {/* ── Sort By ── */}
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Sort By</h3>
          <select
            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg text-sm p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-orange-600 focus:border-orange-600"
            value={searchParams.get("sort") || "featured"}
            onChange={(e) => {
              router.push("?" + createQueryString({ sort: e.target.value }));
            }}
          >
            <option value="featured">Featured First</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* ── Minimum Rating ── */}
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Minimum Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="radio"
                  name="min_rating"
                  className="border-slate-300 text-orange-600 focus:ring-orange-600"
                  checked={searchParams.get("min_rating") === rating.toString()}
                  onChange={() => {
                    router.push("?" + createQueryString({ min_rating: rating.toString() }));
                  }}
                />
                {rating}★ & Up
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="radio"
                name="min_rating"
                className="border-slate-300 text-orange-600 focus:ring-orange-600"
                checked={!searchParams.get("min_rating")}
                onChange={() => {
                  router.push("?" + createQueryString({ min_rating: "" }));
                }}
              />
              Any Rating
            </label>
          </div>
        </div>

        {/* ── Clear All ── */}
        {(searchParams.get("name") || searchParams.get("verified") || searchParams.get("min_rating") || searchParams.get("sort")) && (
          <button
            type="button"
            onClick={() => {
              setNameInput("");
              router.push("/professionals");
            }}
            className="w-full text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 font-medium py-2 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
