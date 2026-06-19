"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Filter } from "lucide-react";

export function ProfessionalsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="border rounded-xl p-5 bg-white sticky top-24">
      <div className="flex items-center gap-2 font-semibold text-lg mb-4 pb-4 border-b">
        <Filter className="h-5 w-5" /> Filters
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-slate-900 mb-2">Verification</h3>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded border-slate-300 text-orange-600 focus:ring-orange-600" 
              checked={searchParams.get('verified') === 'true'}
              onChange={(e) => {
                router.push("?" + createQueryString('verified', e.target.checked ? 'true' : ''));
              }}
            />
            Verified Only
          </label>
        </div>
        
        <div>
          <h3 className="font-medium text-sm text-slate-900 mb-2">Sort By</h3>
          <select 
            className="w-full border-slate-200 rounded-md text-sm focus:ring-orange-600 focus:border-orange-600 p-2 border"
            value={searchParams.get('sort') || 'featured'}
            onChange={(e) => {
              router.push("?" + createQueryString('sort', e.target.value));
            }}
          >
            <option value="featured">Featured First</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        <div>
          <h3 className="font-medium text-sm text-slate-900 mb-2">Minimum Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input 
                  type="radio" 
                  name="min_rating"
                  className="rounded-full border-slate-300 text-orange-600 focus:ring-orange-600" 
                  checked={searchParams.get('min_rating') === rating.toString()}
                  onChange={() => {
                    router.push("?" + createQueryString('min_rating', rating.toString()));
                  }}
                />
                {rating} Stars & Up
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input 
                  type="radio" 
                  name="min_rating"
                  className="rounded-full border-slate-300 text-orange-600 focus:ring-orange-600" 
                  checked={!searchParams.get('min_rating')}
                  onChange={() => {
                    router.push("?" + createQueryString('min_rating', ''));
                  }}
                />
                Any Rating
              </label>
          </div>
        </div>
      </div>
    </div>
  );
}
