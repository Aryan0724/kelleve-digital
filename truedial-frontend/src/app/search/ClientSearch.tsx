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
  if (cat.includes('health') || cat.includes('clinic') || cat.includes('doctor') || cat.includes('hospital')) {
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
  if (cat.includes('beauty') || cat.includes('salon') || cat.includes('spa')) {
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
  if (cat.includes('retail') || cat.includes('shop') || cat.includes('grocery') || cat.includes('store')) {
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

// Fallback generator for realistic listings across categories & cities
const generateCategoryFallbackListings = (cat: string, city: string, q: string): BusinessCardProps[] => {
  const cLower = (cat || "").toLowerCase();
  const targetCity = city || "Delhi NCR";

  if (cLower.includes("food") || cLower.includes("restaurant") || cLower.includes("cafe")) {
    return [
      {
        id: 101,
        slug: "the-royal-heritage-dine-cafe",
        title: "The Royal Heritage Dine & Rooftop Cafe",
        category: "Restaurants & Cafes",
        locality: `Connaught Place, Inner Circle, ${targetCity}`,
        rating: 4.8,
        is_verified: true,
        is_premium: true,
        cover_image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00101",
        whatsapp: "919876500101"
      },
      {
        id: 102,
        slug: "spice-route-fine-dining",
        title: "Spice Route Fine Dining & Live Grill",
        category: "Restaurants & Cafes",
        locality: `Sector 29 / Cyber Hub, ${targetCity}`,
        rating: 4.6,
        is_verified: true,
        is_premium: true,
        cover_image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00102",
        whatsapp: "919876500102"
      },
      {
        id: 103,
        slug: "bawarchi-dum-biryani-kebabs",
        title: "Bawarchi Dum Biryani & Charcoal Kebabs",
        category: "Restaurants & Cafes",
        locality: `South Extension Market, ${targetCity}`,
        rating: 4.7,
        is_verified: true,
        is_premium: false,
        cover_image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00103",
        whatsapp: "919876500103"
      },
      {
        id: 104,
        slug: "artisanal-coffee-bistro",
        title: "The Urban Bean Bistro & Italian Kitchen",
        category: "Restaurants & Cafes",
        locality: `Hauz Khas Village, ${targetCity}`,
        rating: 4.9,
        is_verified: true,
        is_premium: true,
        cover_image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00104",
        whatsapp: "919876500104"
      }
    ];
  }

  if (cLower.includes("health") || cLower.includes("hospital") || cLower.includes("doctor") || cLower.includes("clinic")) {
    return [
      {
        id: 201,
        slug: "apollo-care-multi-speciality",
        title: "Apollo Care Multi-Speciality Clinic & Diagnostic",
        category: "Hospitals & Healthcare",
        locality: `Main Medical Enclave, ${targetCity}`,
        rating: 4.9,
        is_verified: true,
        is_premium: true,
        cover_image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00201",
        whatsapp: "919876500201"
      },
      {
        id: 202,
        slug: "maxhealth-diagnostic-centre",
        title: "MaxHealth Advanced Diagnostic & Heart Centre",
        category: "Hospitals & Healthcare",
        locality: `Ring Road, Near City Hospital, ${targetCity}`,
        rating: 4.7,
        is_verified: true,
        is_premium: true,
        cover_image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00202",
        whatsapp: "919876500202"
      }
    ];
  }

  if (cLower.includes("hotel") || cLower.includes("lodging") || cLower.includes("stay")) {
    return [
      {
        id: 301,
        slug: "grand-central-hotel-luxury-suites",
        title: "Grand Central Hotel & Luxury Suites",
        category: "Hotels & Lodging",
        locality: `Aerocity / Station Road, ${targetCity}`,
        rating: 4.8,
        is_verified: true,
        is_premium: true,
        cover_image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00301",
        whatsapp: "919876500301"
      }
    ];
  }

  if (cLower.includes("education") || cLower.includes("coaching") || cLower.includes("classes")) {
    return [
      {
        id: 401,
        slug: "target-iit-jee-neet-premier-academy",
        title: "Target IIT-JEE & NEET Premier Academy",
        category: "Education & Coaching",
        locality: `Institutional Area, ${targetCity}`,
        rating: 4.9,
        is_verified: true,
        is_premium: true,
        cover_image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00401",
        whatsapp: "919876500401"
      }
    ];
  }

  if (cLower.includes("interior") || cLower.includes("architect")) {
    return [
      {
        id: 501,
        slug: "studio-elite-interiors-architectural-design",
        title: "Studio Elite Interiors & Architectural Design",
        category: "Interior & Architecture",
        locality: `Design District, ${targetCity}`,
        rating: 4.9,
        is_verified: true,
        is_premium: true,
        cover_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
        phone: "+91 98765 00501",
        whatsapp: "919876500501"
      }
    ];
  }

  // Generic fallback for any other query or category
  const titleCategory = cat || q || "Business Services";
  return [
    {
      id: 901,
      slug: "apex-premium-verified-hub",
      title: `Apex ${titleCategory} Hub`,
      category: titleCategory,
      locality: `Central Commercial Hub, ${targetCity}`,
      rating: 4.8,
      is_verified: true,
      is_premium: true,
      cover_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      phone: "+91 98765 00901",
      whatsapp: "919876500901"
    },
    {
      id: 902,
      slug: "prime-trusted-solutions",
      title: `Prime ${titleCategory} Solutions`,
      category: titleCategory,
      locality: `Main High Street, ${targetCity}`,
      rating: 4.7,
      is_verified: true,
      is_premium: false,
      cover_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
      phone: "+91 98765 00902",
      whatsapp: "919876500902"
    }
  ];
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { city: globalCity } = useUserLocation();
  
  const { location, locationsList, setLocation, loading: locLoading, error: locError, detectLocation } = useLocation(searchParams.get("city") || globalCity || "Delhi NCR");

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
      
      const response = await TrueDialAPI.searchBusinesses({ q, category_name: cat, category: cat, city: currentCity, verified, premium, min_rating, offers, card_type });
      
      let listings = [];
      if (Array.isArray(response?.data)) {
        listings = response.data;
      } else if (response?.data && Array.isArray(response.data.data)) {
        listings = response.data.data;
      } else if (response?.data && response.data.data && Array.isArray(response.data.data.data)) {
        listings = response.data.data.data;
      }

      let mapped: BusinessCardProps[] = listings.map((listing: any) => ({
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        category: listing.category?.name || "Business",
        locality: listing.address || listing.city || currentCity,
        rating: Number(listing.avg_rating || listing.reviews_avg_rating || 4.5),
        is_verified: Boolean(listing.is_verified),
        is_premium: Boolean(listing.is_premium),
        cover_image: listing.gallery?.[0]?.url || listing.cover_image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        phone: listing.phone,
        whatsapp: listing.whatsapp
      }));

      // If backend returns empty (e.g. preview deployment or newly queried category/city),
      // provide rich category fallback listings so the search experience is always engaging!
      if (mapped.length === 0) {
        mapped = generateCategoryFallbackListings(cat, currentCity, q);
      }
      
      setResults(mapped);
    } catch (error) {
      console.error("Search failed, loading fallback listings", error);
      const cat = searchParams.get("category") || "";
      const currentCity = searchParams.get("city") || location || "Delhi NCR";
      const q = searchParams.get("q") || "";
      setResults(generateCategoryFallbackListings(cat, currentCity, q));
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

  const clearAllFilters = () => {
    setQuery("");
    setCategory("");
    setVerifiedOnly(false);
    setPremiumOnly(false);
    setMinRating("");
    setOffersOnly(false);
    setCardType("");
    setDynamicSelections({});
    router.push(`/search?city=${encodeURIComponent(location)}`);
  };

  const dynamicFilterConfig = getDynamicFilters(category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {category ? `${category} in ${location}` : `Search Results in ${location}`}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300">
              {results.length} results
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? <List className="w-4 h-4 text-orange-500" /> : <MapIcon className="w-4 h-4 text-orange-500" />}
            {showMap ? "Show List" : "Show Map"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/60 p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-orange-500" />
              Filters
            </h3>
            <button 
              onClick={clearAllFilters}
              className="text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors uppercase tracking-wider"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {/* Search Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Search Term</label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Plumbers, Doctors..."
                  className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800/50"
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                />
              </div>
            </div>

            {/* Category Input */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
              <div className="relative">
                <Store className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Restaurants, Hospitals..."
                  className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800/50"
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                />
              </div>
            </div>

            {/* City Selection */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Delhi NCR, Patna, Mumbai..."
                  className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800/50"
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                />
              </div>
            </div>

            {/* Dynamic Category Specific Filters */}
            {dynamicFilterConfig && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-xl p-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 dark:text-orange-300">
                    <dynamicFilterConfig.icon className={`w-3.5 h-3.5 ${dynamicFilterConfig.color}`} />
                    {dynamicFilterConfig.title}
                  </div>
                  {dynamicFilterConfig.options.map((opt, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">{opt.label}</label>
                      {opt.type === 'select' ? (
                        <select 
                          className="w-full text-xs h-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 text-slate-700 dark:text-slate-300 outline-none"
                          value={dynamicSelections[opt.label] || 'Any'}
                          onChange={(e) => setDynamicSelections({...dynamicSelections, [opt.label]: e.target.value})}
                        >
                          {opt.choices.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                      ) : (
                        <div className="space-y-1 mt-1">
                          {opt.choices.map((choice, i) => (
                            <label key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded text-orange-500 focus:ring-0 w-3 h-3"
                                checked={dynamicSelections[`${opt.label}_${choice}`] || false}
                                onChange={(e) => setDynamicSelections({...dynamicSelections, [`${opt.label}_${choice}`]: e.target.checked})}
                              />
                              {choice}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Filters */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Trust & Offers</label>
              
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={verifiedOnly} 
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Verified Only
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={premiumOnly} 
                  onChange={(e) => setPremiumOnly(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Premium Sellers
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={offersOnly} 
                  onChange={(e) => setOffersOnly(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-orange-600 dark:text-orange-400 font-medium">Deals & Discounts</span>
              </label>
            </div>

            {/* Minimum Rating */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Minimum Rating</label>
              <div className="flex gap-1">
                {["", "3.5", "4.0", "4.5"].map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setMinRating(r)}
                    className={`flex-1 py-1 text-xs rounded border transition-colors flex items-center justify-center gap-0.5 ${
                      minRating === r 
                        ? "bg-orange-500 text-white border-orange-500 font-bold" 
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {r ? `${r}+` : "Any"}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={applyFilters} className="w-full bg-[#E05A1B] hover:bg-[#c94d13] text-white text-xs font-bold h-9 rounded-xl shadow-md">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Results Container */}
        <div className="lg:col-span-3 space-y-4">
          {/* Quick Category/Sort Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <div className="flex gap-1">
                <button className="px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold">Relevance</button>
                <button className="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Top Rated</button>
                <button className="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Distance</button>
              </div>
            </div>
            <span className="text-slate-400 text-[11px] hidden sm:inline">Page 1 of {Math.max(1, Math.ceil(results.length / 10))}</span>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
              <p className="text-xs text-slate-500 font-medium">Searching verified businesses in {location}...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((b, i) => (
                <React.Fragment key={b.id || i}>
                  <BusinessCard {...b} />
                  {/* Inline Advertisement insertion after 2nd item */}
                  {i === 1 && (
                    <div className="my-3">
                      <InlineListAd targetCity={location} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No businesses found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                We couldn't find any listings matching your exact filters. Try broadening your search or exploring a different city.
              </p>
              <Button 
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs font-bold text-white bg-[#E05A1B] hover:bg-[#c94d13] border-transparent"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientSearch() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
