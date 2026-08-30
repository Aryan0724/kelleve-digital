"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, Target } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function ProfessionalsFilters({ isMobile }: { isMobile?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  
  const [locationInput, setLocationInput] = useState(searchParams.get("city") || searchParams.get("location") || "");
  
  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
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

  const applyFilters = (updates: Record<string, string | null>) => {
    router.push("?" + createQueryString(updates));
    if (isMobile) setOpen(false);
  };

  const handleReset = () => {
    setLocationInput("");
    router.push("/professionals");
    if (isMobile) setOpen(false);
  };

  const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

  const filterContent = (
    <div className="space-y-6">
      
      {/* ── Category ── */}
      <div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Category</h3>
        <Select 
          value={searchParams.get("category") || "all"} 
          onValueChange={(v) => applyFilters({ category: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="interior-designers">Interior Designers</SelectItem>
            <SelectItem value="architects">Architects</SelectItem>
            <SelectItem value="civil-contractors">Contractors</SelectItem>
            <SelectItem value="suppliers-vendors">Material Suppliers & Vendors</SelectItem>
            <SelectItem value="skilled-workers">Skilled Workers</SelectItem>
            <SelectItem value="builders">Builders & Developers</SelectItem>
            <SelectItem value="pest-control">Pest Control</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Material Type ── */}
      <div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Material Type</h3>
        <Select 
          value={searchParams.get("material_type") || "all"} 
          onValueChange={(v) => applyFilters({ material_type: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hardware">Hardware</SelectItem>
            <SelectItem value="plywood">Plywood & Laminates</SelectItem>
            <SelectItem value="tiles">Tiles & Sanitary</SelectItem>
            <SelectItem value="marble">Marble & Granite</SelectItem>
            <SelectItem value="paint">Paint</SelectItem>
            <SelectItem value="electrical">Electricals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Location ── */}
      <div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Location</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Location"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onBlur={() => applyFilters({ city: locationInput || null, location: locationInput || null })}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ city: locationInput || null, location: locationInput || null })}
            className="w-full pl-3 pr-10 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:border-orange-400 transition"
          />
          <Target className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* ── Business Type ── */}
      <div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Business Type</h3>
        <Select 
          value={searchParams.get("business_type") || "all"} 
          onValueChange={(v) => applyFilters({ business_type: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="wholesaler">Wholesaler</SelectItem>
            <SelectItem value="retailer">Retailer</SelectItem>
            <SelectItem value="manufacturer">Manufacturer</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Rating ── */}
      <div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Rating</h3>
        <div className="flex items-center justify-between">
          <div className="flex text-amber-400">
            <span className="text-lg">★★★★☆</span>
          </div>
          <Select 
            value={searchParams.get("min_rating") || "all"} 
            onValueChange={(v) => applyFilters({ min_rating: v === "all" ? "" : v })}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Select Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4.5">4.5 & above</SelectItem>
              <SelectItem value="4">4.0 & above</SelectItem>
              <SelectItem value="3">3.0 & above</SelectItem>
              <SelectItem value="all">Any Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Years in Business ── */}
      <div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Years in Business</h3>
        <div className="flex gap-2">
          <Select 
            value={searchParams.get("years_min") || "min"} 
            onValueChange={(v) => applyFilters({ years_min: v === "min" ? "" : v })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="min">Min</SelectItem>
              <SelectItem value="1">1 Year</SelectItem>
              <SelectItem value="3">3 Years</SelectItem>
              <SelectItem value="5">5 Years</SelectItem>
              <SelectItem value="10">10 Years</SelectItem>
              <SelectItem value="15">15 Years</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={searchParams.get("years_max") || "max"} 
            onValueChange={(v) => applyFilters({ years_max: v === "max" ? "" : v })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Max" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="max">Max</SelectItem>
              <SelectItem value="5">5 Years</SelectItem>
              <SelectItem value="10">10 Years</SelectItem>
              <SelectItem value="20">20 Years</SelectItem>
              <SelectItem value="30">30+ Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Verified Status ── */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="verified" 
            checked={searchParams.get("verified") === "true"}
            onCheckedChange={(checked) => applyFilters({ verified: checked ? "true" : "" })}
          />
          <label htmlFor="verified" className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-white">
            Verified Professionals Only
          </label>
        </div>
      </div>

      {/* ── Delivery Available ── */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="delivery" 
            checked={searchParams.get("delivery_available") === "true"}
            onCheckedChange={(checked) => applyFilters({ delivery_available: checked ? "true" : "" })}
          />
          <label htmlFor="delivery" className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-white">
            Delivery Available (Yes)
          </label>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="pt-4 flex flex-col gap-3">
        <Button 
          className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold"
          onClick={() => {
            applyFilters({ city: locationInput || null, location: locationInput || null });
          }}
        >
          Apply Filters
        </Button>
        <Button 
          variant="ghost" 
          className="w-full text-slate-500"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>

    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="w-full flex items-center justify-center gap-1.5 h-10 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Filter className="h-4 w-4 text-orange-500" /> 
          Filter Results
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl overflow-y-auto px-5 pb-10">
          <SheetHeader className="mb-5 border-b pb-4 flex flex-row items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-orange-500" /> Filters
            </SheetTitle>
            {hasActiveFilters && (
              <button onClick={handleReset} className="text-sm text-orange-600 hover:underline">
                Clear All
              </button>
            )}
          </SheetHeader>
          {filterContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 sticky top-24 overflow-hidden">
      <div className="flex items-center justify-between font-bold text-lg p-5 pb-4 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
        <span>Filters</span>
        {hasActiveFilters && (
          <button onClick={handleReset} className="text-sm font-normal text-slate-500 hover:text-slate-800 transition-colors">
            Clear All
          </button>
        )}
      </div>
      <div className="p-5 pt-4">
        {filterContent}
      </div>
    </div>
  );
}
