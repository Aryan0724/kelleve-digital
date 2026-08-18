"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TrueDialAPI } from "@/lib/api";
import BusinessCard, { BusinessCardProps } from "@/components/shared/BusinessCard";
import { SlidersHorizontal, MapPin, Star, ShieldCheck, Loader2, Utensils, Stethoscope, Briefcase, Sparkles, Store, Search as SearchIcon, Map as MapIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserLocation } from "@/context/LocationContext";
import { useLocation } from "@/hooks/useLocation";
import { InlineListAd } from "@/components/shared/AdPlacements/InlineListAd";

// Helper for dynamic filters based on category
const getDynamicFilters = (categoryStr: string) => {
  const cat = categoryStr.toLowerCase();
  if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe')) {
    return {
      type: 'food',
      icon: Utensils,
      color: 'text-orange-500',
      title: 'Restaurant Filters',
      options: [
        { label: 'Cuisine', type: 'select', choices: ['Any', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'Continental'] },
        { label: 'Dietary', type: 'checkbox', choices: ['Pure Veg', 'Vegan Options', 'Halal'] },
        { label: 'Dining', type: 'checkbox', choices: ['Dine-In', 'Takeaway', 'Delivery', 'Outdoor Seating'] }
      ]
    };
  }
  if (cat.includes('health') || cat.includes('clinic') || cat.includes('doctor')) {
    return {
      type: 'healthcare',
      icon: Stethoscope,
      color: 'text-blue-500',
      title: 'Healthcare Filters',
      options: [
        { label: 'Specialty', type: 'select', choices: ['Any', 'Dentist', 'Cardiologist', 'Dermatologist', 'Pediatrician'] },
        { label: 'Availability', type: 'checkbox', choices: ['Open Now', '24/7 Emergency', 'Home Visit'] }
      ]
    };
  }
  if (cat.includes('beauty') || cat.includes('salon')) {
    return {
      type: 'beauty',
      icon: Sparkles,
      color: 'text-pink-500',
      title: 'Salon Filters',
      options: [
        { label: 'Services', type: 'checkbox', choices: ['Haircut', 'Facial', 'Bridal Makeup', 'Nail Art'] },
        { label: 'Gender', type: 'select', choices: ['Any', 'Unisex', 'Women Only', 'Men Only'] }
      ]
    };
  }
  if (cat.includes('retail') || cat.includes('shop')) {
    return {
      type: 'retail',
      icon: Store,
      color: 'text-emerald-500',
      title: 'Retail Filters',
      options: [
        { label: 'Price Range', type: 'select', choices: ['Any', 'Budget', 'Mid-Range', 'Premium'] },
        { label: 'Features', type: 'checkbox', choices: ['Home Delivery', 'EMI Available', 'In-store Shopping'] }
      ]
    };
  }
  return null;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { city: globalCity } = useUserLocation();
  
  const { location, locationsList, setLocation, loading: locLoading, error: locError, detectLocation } = useLocation(searchParams.get("city") || globalCity || "Mumbai");

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [results, setResults] = useState<BusinessCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  // Dynamic filter selections (mocked state for UI demonstration)
  const [dynamicSelections, setDynamicSelections] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!searchParams.get("city") && globalCity && location !== globalCity) {
      setLocation(globalCity);
    }
  }, [globalCity]);
  
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [premiumOnly, setPremiumOnly] = useState(searchParams.get("premium") === "true");
  const [offersOnly, setOffersOnly] = useState(searchParams.get("offers") === "1");
  const [cardType, setCardType] = useState(searchParams.get("card_type") || "");
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") || "");

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const q = searchParams.get("q") || "";
      const cat = searchParams.get("category") || "";
      const currentCity = searchParams.get("city") || location || "";
      const verified = searchParams.get("verified") || "";
      const premium = searchParams.get("premium") || "";
      const min_rating = searchParams.get("min_rating") || "";
      const offers = searchParams.get("offers") || "";
      const card_type = searchParams.get("card_type") || "";
      
      const response = await TrueDialAPI.searchBusinesses({ q, category_name: cat, city: currentCity, verified, premium, min_rating, offers, card_type });
      
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
    
    if (offersOnly) params.set("offers", "1");
    else params.delete("offers");
    
    if (cardType) params.set("card_type", cardType);
    else params.delete("card_type");

    router.push(`/search?${params.toString()}`);
  };

  const activeDynamicFilters = getDynamicFilters(category);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Dense Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
              {category ? `${category} in ${location}` : `Search Results in ${location}`}
            </h1>
            <span className="hidden md:inline-flex bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">
              {results.length} results
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-9 font-bold text-xs ${showMap ? 'bg-primary text-white border-primary' : ''}`}
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? <><List className="w-4 h-4 mr-1.5" /> Show List</> : <><MapIcon className="w-4 h-4 mr-1.5" /> Show Map</>}
            </Button>
          </div>
        </div>
      </div>

      <main className={`max-w-[1400px] mx-auto w-full px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-6 ${showMap ? 'h-[calc(100vh-64px)] overflow-hidden' : ''}`}>
        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-64 flex-shrink-0 ${showMap ? 'overflow-y-auto h-full pr-2 custom-scrollbar' : 'sticky top-24'}`}>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-sm text-slate-900 dark:text-white">Filters</h2>
              </div>
              <button 
                onClick={() => { setQuery(""); setCategory(""); setVerifiedOnly(false); setPremiumOnly(false); setMinRating(""); setDynamicSelections({}); }}
                className="text-[10px] font-bold text-slate-500 hover:text-primary transition uppercase"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Search Term</label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <Input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Plumbers, Doctors..."
                    className="pl-8 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                <div className="relative">
                  <Briefcase className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <Input 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Restaurants"
                    className="pl-8 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Location</label>
                <div className="relative">
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-8 pl-8 pr-6 border border-slate-200 dark:border-slate-700 rounded-md dark:bg-slate-800 appearance-none bg-slate-50 text-xs font-medium"
                  >
                    <option value="">Any City</option>
                    {locationsList.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                    {!locationsList.includes(location) && location && (
                      <option value={location}>{location}</option>
                    )}
                  </select>
                  <MapPin className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Dynamic Filters Section */}
              {activeDynamicFilters && (
                <div className={`p-3 rounded-lg border ${activeDynamicFilters.color.replace('text-', 'border-').replace('500', '200')} bg-slate-50 dark:bg-slate-800/50`}>
                  <div className={`flex items-center gap-1.5 mb-3 ${activeDynamicFilters.color}`}>
                    <activeDynamicFilters.icon className="w-3.5 h-3.5" />
                    <span className="font-bold text-xs">{activeDynamicFilters.title}</span>
                  </div>
                  <div className="space-y-3">
                    {activeDynamicFilters.options.map((opt, i) => (
                      <div key={i}>
                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">{opt.label}</label>
                        {opt.type === 'select' ? (
                          <select className="w-full h-7 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 px-2 text-[11px]">
                            {opt.choices.map(c => <option key={c}>{c}</option>)}
                          </select>
                        ) : (
                          <div className="space-y-1.5">
                            {opt.choices.map(c => (
                              <label key={c} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary h-3 w-3" />
                                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{c}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Quality & Trust</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded border-slate-300 text-green-600 focus:ring-green-600 h-3.5 w-3.5 transition-colors"
                    />
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 transition">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Verified Only
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={premiumOnly}
                      onChange={(e) => setPremiumOnly(e.target.checked)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 transition-colors"
                    />
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 transition">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Premium Partners
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Minimum Rating</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Any', '3+', '4+', '4.5+'].map((r) => {
                    const val = r === 'Any' ? '' : r.replace('+', '');
                    const isSelected = minRating === val;
                    return (
                      <button
                        key={r}
                        onClick={() => setMinRating(val)}
                        className={`py-1 text-[10px] font-bold rounded border transition ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
                      >
                        {r}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button onClick={applyFilters} className="w-full h-9 text-xs font-bold shadow-sm">
                Apply Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className={`flex-1 ${showMap ? 'flex gap-4 h-full' : ''}`}>
          <div className={`flex-1 flex flex-col gap-4 ${showMap ? 'overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
            {/* Sort Bar */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-700 dark:text-slate-300">Relevance</button>
                <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-600">Top Rated</button>
                <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-600">Distance</button>
              </div>
              <span className="text-xs text-slate-500">Page 1 of 10</span>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-3 font-bold text-sm text-slate-500">Finding the best options...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col gap-4">
                {results.map((biz, index) => (
                  <div key={biz.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <BusinessCard {...biz} />
                    {/* Show an inline ad after every 4th item */}
                    {(index + 1) % 4 === 0 && (
                      <div className="mt-4">
                        <InlineListAd targetCity={location} targetCategoryId={undefined} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">No businesses found</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
                  We couldn't find any listings matching your exact filters. Try broadening your search or exploring a different city.
                </p>
                <Button 
                  onClick={() => {
                    setQuery(""); setVerifiedOnly(false); setPremiumOnly(false); setMinRating("");
                    router.push('/search');
                  }}
                  className="h-9 px-6 text-xs font-bold"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Map Column (If Toggled) */}
          {showMap && (
            <div className="hidden lg:block w-[40%] bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
              {/* Dummy Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="w-12 h-12 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-500">Interactive Map View</p>
                  <p className="text-xs text-slate-400">Loading map markers...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
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
