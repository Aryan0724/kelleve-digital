"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TrueDialAPI } from "@/lib/api";
import BusinessCard, { BusinessCardProps } from "@/components/shared/BusinessCard";
import { SlidersHorizontal, MapPin, Star, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserLocation } from "@/context/LocationContext";
import { useLocation } from "@/hooks/useLocation";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { city: globalCity } = useUserLocation();
  
  // Use the new useLocation hook
  const { location, locationsList, setLocation, loading: locLoading, error: locError, detectLocation } = useLocation(searchParams.get("city") || globalCity || "Mumbai");

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [results, setResults] = useState<BusinessCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchParams.get("city") && globalCity && location !== globalCity) {
      setLocation(globalCity);
    }
  }, [globalCity]);
  
  // Filters
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [premiumOnly, setPremiumOnly] = useState(searchParams.get("premium") === "true");
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") || "");

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const q = searchParams.get("q") || "";
      const category = searchParams.get("category") || "";
      const currentCity = searchParams.get("city") || location || "";
      const verified = searchParams.get("verified") || "";
      const premium = searchParams.get("premium") || "";
      const min_rating = searchParams.get("min_rating") || "";
      
      const response = await TrueDialAPI.searchBusinesses({ q, category_name: category, city: currentCity, verified, premium, min_rating });
      
      let listings = [];
      if (Array.isArray(response.data)) {
        listings = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        listings = response.data.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        listings = response.data.data.data;
      }

      const mapped = listings.map((listing: any) => ({
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        category: listing.category?.name || "Business",
        locality: listing.address || listing.city,
        rating: listing.avg_rating || listing.reviews_avg_rating || 0,
        is_verified: listing.is_verified,
        is_premium: listing.is_premium,
        cover_image: listing.gallery?.[0]?.url || listing.cover_image,
        phone: listing.phone,
        whatsapp: listing.whatsapp
      }));
      
      setResults(mapped);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) params.set("q", query);
    else params.delete("q");
    
    if (category) params.set("category", category);
    else params.delete("category");

    if (location) params.set("city", location);
    else params.delete("city");
    
    if (verifiedOnly) params.set("verified", "true");
    else params.delete("verified");
    
    if (premiumOnly) params.set("premium", "true");
    else params.delete("premium");

    if (minRating) params.set("min_rating", minRating);
    else params.delete("min_rating");

    router.push(`/search?${params.toString()}`);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-border sticky top-24">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Filters</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">Search Term</label>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Plumbers, Doctors..."
                className="w-full p-2 border rounded-md dark:bg-slate-900 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Category</label>
              <input 
                type="text" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Restaurants"
                className="w-full p-2 border rounded-md dark:bg-slate-900 dark:border-slate-700"
              />
            </div>

            <div className="relative">
              <label className="text-sm font-semibold mb-2 block">City</label>
              
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 appearance-none pr-8 bg-white"
                  >
                    <option value="">Any City</option>
                    {locationsList.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                    {!locationsList.includes(location) && location && (
                      <option value={location}>{location}</option>
                    )}
                  </select>
                  <div className="absolute right-2 top-2 pointer-events-none">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={detectLocation}
                  disabled={locLoading}
                  className="w-full text-xs flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/5"
                >
                  {locLoading ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Detecting GPS...</>
                  ) : (
                    <><MapPin className="w-3 h-3" /> Detect My Location</>
                  )}
                </Button>
                {locError && <p className="text-[10px] text-red-500 mt-1">{locError}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-3 block">Quality</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="flex items-center gap-1 text-sm"><ShieldCheck className="w-4 h-4 text-green-500" /> Verified Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={premiumOnly}
                    onChange={(e) => setPremiumOnly(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-sm">Premium Businesses</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-3 block">Minimum Rating</label>
              <select 
                value={minRating} 
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 text-sm"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {searchParams.get("q") ? `Results for "${searchParams.get("q")}"` : "All Businesses"}
          </h1>
          <span className="text-muted-foreground text-sm">
            {loading ? "Searching..." : `${results.length} found`}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-6">
            {results.map((biz) => (
              <BusinessCard key={biz.id} {...biz} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-border shadow-sm">
            <MapPin className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or searching for something else.</p>
            <Button variant="outline" onClick={() => {
              setQuery(""); setVerifiedOnly(false); setPremiumOnly(false); setMinRating("");
              router.push('/search');
            }}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ClientSearch() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
