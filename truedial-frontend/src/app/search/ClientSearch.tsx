"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TrueDialAPI } from "@/lib/api";
import BusinessCard, { BusinessCardProps } from "@/components/shared/BusinessCard";
import { SlidersHorizontal, MapPin, Star, ShieldCheck, Loader2, Utensils, Stethoscope, Briefcase, Sparkles, Store, Search as SearchIcon } from "lucide-react";
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

  // Dynamic filter selections (mocked state for UI demonstration)
  const [dynamicSelections, setDynamicSelections] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!searchParams.get("city") && globalCity && location !== globalCity) {
      setLocation(globalCity);
    }
  }, [globalCity]);
  
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
      const cat = searchParams.get("category") || "";
      const currentCity = searchParams.get("city") || location || "";
      const verified = searchParams.get("verified") || "";
      const premium = searchParams.get("premium") || "";
      const min_rating = searchParams.get("min_rating") || "";
      
      const response = await TrueDialAPI.searchBusinesses({ q, category_name: cat, city: currentCity, verified, premium, min_rating });
      
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

  const activeDynamicFilters = getDynamicFilters(category);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-12">
      {/* Search Header Banner */}
      <div className="bg-navy pt-8 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            Find the Best <span className="text-primary">{category || 'Local Businesses'}</span>
          </h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base">
            Discover top-rated services, exclusive offers, and trusted professionals in your area.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 -mt-8 relative z-20 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Filters</h2>
              </div>
              <button 
                onClick={() => { setQuery(""); setCategory(""); setVerifiedOnly(false); setPremiumOnly(false); setMinRating(""); setDynamicSelections({}); }}
                className="text-xs font-semibold text-slate-500 hover:text-primary transition"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Search Term</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Plumbers, Doctors..."
                    className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Category</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Restaurants"
                    className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Location</label>
                
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-10 pl-9 pr-8 border border-slate-200 dark:border-slate-700 rounded-md dark:bg-slate-800 appearance-none bg-slate-50 text-sm font-medium"
                    >
                      <option value="">Any City</option>
                      {locationsList.map((loc, idx) => (
                        <option key={idx} value={loc}>{loc}</option>
                      ))}
                      {!locationsList.includes(location) && location && (
                        <option value={location}>{location}</option>
                      )}
                    </select>
                    <div className="absolute left-3 top-2.5 pointer-events-none">
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={detectLocation}
                    disabled={locLoading}
                    className="w-full text-xs font-bold flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/5 bg-primary/5 h-9"
                  >
                    {locLoading ? (
                      <><Loader2 className="w-3 h-3 animate-spin" /> Locating...</>
                    ) : (
                      <><MapPin className="w-3 h-3" /> Detect My Location</>
                    )}
                  </Button>
                  {locError && <p className="text-[10px] text-red-500 mt-1">{locError}</p>}
                </div>
              </div>

              {/* Dynamic Filters Section */}
              {activeDynamicFilters && (
                <div className={`p-4 rounded-xl border ${activeDynamicFilters.color.replace('text-', 'border-').replace('500', '200')} bg-slate-50 dark:bg-slate-800/50`}>
                  <div className={`flex items-center gap-2 mb-4 ${activeDynamicFilters.color}`}>
                    <activeDynamicFilters.icon className="w-4 h-4" />
                    <span className="font-bold text-sm">{activeDynamicFilters.title}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {activeDynamicFilters.options.map((opt, i) => (
                      <div key={i}>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">{opt.label}</label>
                        {opt.type === 'select' ? (
                          <select className="w-full h-9 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 px-2 text-sm">
                            {opt.choices.map(c => <option key={c}>{c}</option>)}
                          </select>
                        ) : (
                          <div className="space-y-2">
                            {opt.choices.map(c => (
                              <label key={c} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary h-3.5 w-3.5" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{c}</span>
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Quality & Trust</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded border-slate-300 text-green-500 focus:ring-green-500 h-4 w-4 transition-colors"
                    />
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> Verified Only
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={premiumOnly}
                      onChange={(e) => setPremiumOnly(e.target.checked)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-4 w-4 transition-colors"
                    />
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Premium Partners
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Minimum Rating</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Any', '3+', '4+', '4.5+'].map((r) => {
                    const val = r === 'Any' ? '' : r.replace('+', '');
                    const isSelected = minRating === val;
                    return (
                      <button
                        key={r}
                        onClick={() => setMinRating(val)}
                        className={`py-2 px-1 text-xs font-bold rounded-lg border transition ${isSelected ? 'border-primary bg-primary text-white shadow-md' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
                      >
                        {r}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button onClick={applyFilters} className="w-full h-12 font-bold shadow-lg shadow-primary/25">
                Apply Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 mt-4 lg:mt-0">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm">{results.length}</span>
              {searchParams.get("q") ? `Matches for "${searchParams.get("q")}"` : "Top Recommendations"}
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              Sort by: 
              <select className="bg-transparent font-bold text-slate-900 dark:text-white border-none focus:ring-0 cursor-pointer">
                <option>Relevance</option>
                <option>Highest Rated</option>
                <option>Nearest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0"></div>
              </div>
              <p className="mt-4 font-bold text-slate-500 animate-pulse">Finding the best options...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-6">
              {results.map((biz, index) => (
                <div key={biz.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <BusinessCard {...biz} />
                  {/* Show an inline ad after every 4th item (index 3, 7, 11...) */}
                  {(index + 1) % 4 === 0 && (
                    <div className="my-6">
                      <InlineListAd targetCity={location} targetCategoryId={undefined} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">No businesses found</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                We couldn't find any listings matching your exact filters. Try broadening your search or exploring a different city.
              </p>
              <Button 
                onClick={() => {
                  setQuery(""); setVerifiedOnly(false); setPremiumOnly(false); setMinRating("");
                  router.push('/search');
                }}
                className="h-12 px-8 font-bold"
              >
                Clear All Filters
              </Button>
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
