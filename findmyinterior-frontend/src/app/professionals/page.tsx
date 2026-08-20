import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { Search, MapPin, Star, ShieldCheck, Phone, Heart, LayoutGrid, List as ListIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfessionalsFilters } from "@/components/professionals/ProfessionalsFilters";
import { ProfessionalsPagination } from "@/components/professionals/ProfessionalsPagination";
import { ProfessionalTypeSwitcher } from "@/components/professionals/ProfessionalTypeSwitcher";
import { AdSlot } from "@/components/ads/AdSlot";
import { BookmarkButton } from "@/components/common/BookmarkButton";
import { ContactProfessionalButton } from "@/components/professionals/ContactProfessionalButton";
import React from "react";

export const metadata: Metadata = {
  title: "Find Professionals | Find My Interior",
  description: "Browse verified interior designers, architects, contractors, and more in Bihar. Get multiple quotes.",
};

import { getServerApiUrl } from "@/lib/serverApi";

async function getProfessionals(searchParams: any) {
  try {
    const cleanParams: Record<string, string> = {};
    for (const key in searchParams) {
      if (typeof searchParams[key] === 'string') {
        cleanParams[key] = searchParams[key];
      }
    }
    const params = new URLSearchParams(cleanParams).toString();
    const apiUrl = `${getServerApiUrl()}/listings?${params}`;
    console.log("[DEBUG] Fetching professionals from:", apiUrl);
    const res = await fetch(apiUrl, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Failed to fetch from ${apiUrl} - Status: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error: any) {
    console.error("Fetch Error in ProfessionalsPage:", error);
    return { data: [], meta: { current_page: 1, last_page: 1, total: 0, per_page: 12 }, error: error.message || String(error) };
  }
}

function formatLocation(city?: string, district?: string): string {
  const parts = [city, district, "Bihar", "India"].filter(Boolean);
  const unique = parts.filter((v, i) => v !== parts[i - 1]);
  return unique.join(", ");
}

export default async function ProfessionalsPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const { data: listings, meta, error } = await getProfessionals(resolvedSearchParams);
  
  const layout = resolvedSearchParams.layout === 'grid' ? 'grid' : 'list';
  
  let pageTitle = "Professionals";
  let pageSubtitle = "Find trusted professionals for your projects";
  if (resolvedSearchParams.category === 'material-suppliers') {
    pageTitle = "Material Suppliers";
    pageSubtitle = "Find trusted material suppliers for your projects";
  } else if (resolvedSearchParams.category) {
    pageTitle = resolvedSearchParams.category.replace(/-/g, ' ').replace(/\b\w/g, (l:string) => l.toUpperCase());
    pageSubtitle = `Find trusted ${pageTitle.toLowerCase()} for your projects`;
  }

  const showingStart = meta ? (meta.current_page - 1) * meta.per_page + 1 : 1;
  const showingEnd = meta ? Math.min(meta.current_page * meta.per_page, meta.total) : listings.length;

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-50 min-h-screen">

      {/* Mobile Actions Bar */}
      <div className="flex lg:hidden gap-3 mb-6">
        <div className="flex-1">
          <ProfessionalTypeSwitcher isMobile currentSearch={resolvedSearchParams.search || ''} />
        </div>
        <div className="flex-1">
          <ProfessionalsFilters isMobile />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-full lg:w-1/4 space-y-6">
          <ProfessionalsFilters />
          <div className="sticky top-24">
            <AdSlot location="right_sidebar" className="w-full h-[600px] rounded-xl bg-slate-100" />
          </div>
        </div>

        {/* Results Area */}
        <div className="w-full lg:w-3/4">
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{pageTitle}</h1>
            <p className="text-slate-600 mb-6">{pageSubtitle}</p>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-sm font-medium text-slate-600">
                Showing {showingStart} to {showingEnd} of {meta?.total || 0} {pageTitle}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600">Sort by :</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm transition-all hover:border-slate-300">
                      <option value="rating">Highest Rated</option>
                      <option value="featured">Featured First</option>
                      <option value="newest">Newest</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <Link href={`?${new URLSearchParams({...resolvedSearchParams, layout: 'grid'}).toString()}`} className={`p-1.5 rounded-md ${layout === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </Link>
                  <Link href={`?${new URLSearchParams({...resolvedSearchParams, layout: 'list'}).toString()}`} className={`p-1.5 rounded-md ${layout === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <ListIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {layout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {listings.length > 0 ? listings.map((listing: any, index: number) => (
                <React.Fragment key={listing.id}>
                  {/* Grid layout omitted for brevity as the focus is List view. Render a simpler grid card here or re-use existing. */}
                  <Link href={`/professionals/${listing.slug}`}>
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 dark:bg-slate-900 group">
                      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        {(listing.user?.avatar || listing.cover_image) ? (
                          <div className="w-full h-full bg-white dark:bg-slate-900 flex items-center justify-center p-2">
                            <img src={listing.user?.avatar || listing.cover_image} alt={listing.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500">No Image</div>
                        )}
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-1">{listing.title}</h3>
                        </div>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" /> <span className="line-clamp-1">{formatLocation(listing.city, listing.district)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </React.Fragment>
              )) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-slate-500 dark:text-slate-400">
                  No professionals found matching your search criteria.
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {listings.length > 0 ? listings.map((listing: any, index: number) => {
                const tags = [...(listing.products || []), ...(listing.services || [])].slice(0, 4);
                return (
                  <React.Fragment key={listing.id}>
                    <Card className="flex flex-col md:flex-row overflow-hidden hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                      {/* Left Image Section */}
                      <div className="relative w-full md:w-72 h-64 md:h-auto bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        {(listing.user?.avatar || listing.cover_image) ? (
                          <div className="w-full h-full bg-white dark:bg-slate-900 flex items-center justify-center p-4">
                            <img src={listing.user?.avatar || listing.cover_image} alt={listing.title} className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500">No Image</div>
                        )}
                        {(listing.is_verified || listing.verification_level === 'verified_business') && (
                          <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700 text-white border-0">Verified</Badge>
                        )}
                        {listing.is_premium && (
                          <Badge className="absolute top-10 left-3 bg-orange-500 hover:bg-orange-600 text-white border-0">Premium</Badge>
                        )}
                        {(listing.gallery_count > 0 || listing.gallery?.length > 0) && (
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            {listing.gallery_count || listing.gallery?.length}
                          </div>
                        )}
                      </div>
                      
                      {/* Middle & Right Content */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors">
                                {listing.title}
                              </h3>
                            </div>
                            <div className="z-10">
                              <BookmarkButton id={listing.id} type="Listing" />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{listing.avg_rating.toFixed(1)}</span>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(listing.avg_rating) ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">({listing.review_count})</span>
                          </div>

                          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{formatLocation(listing.city, listing.district)}</span>
                          </div>

                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                              {tags.map((tag, i) => (
                                <React.Fragment key={i}>
                                  <span>{tag}</span>
                                  {i < tags.length - 1 && <span className="text-slate-300 dark:text-slate-600">•</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mb-4">
                            {listing.years_experience > 0 && (
                              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 font-medium border-slate-200 dark:border-slate-700">
                                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> {listing.years_experience}+ Years
                              </Badge>
                            )}
                            {(listing.achievements && listing.achievements.length > 0) && (
                              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 font-medium border-slate-200 dark:border-slate-700">
                                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> {listing.achievements[0]}
                              </Badge>
                            )}
                            {(listing.availability || listing.services?.includes('Delivery')) && (
                              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-1 font-medium border-green-200 dark:border-green-800">
                                <ShieldCheck className="w-3.5 h-3.5 text-green-500 dark:text-green-400" /> {listing.availability?.includes('Delivery') ? listing.availability : 'Timely Delivery'}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-6 mt-4 xl:items-end justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                          <div className="flex-1">
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                              {listing.description || 'Verified professional ready to help with your next project.'}
                            </p>
                            {listing.business_hours ? (
                              <div className="flex items-center text-sm text-green-600 dark:text-green-500 font-medium">
                                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 mr-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                </span>
                                Open now <span className="text-slate-400 dark:text-slate-600 mx-2">•</span> <span className="text-slate-500 dark:text-slate-400 font-normal">{listing.business_hours}</span>
                              </div>
                            ) : null}
                          </div>
                          
                            <div className="flex flex-col sm:flex-row gap-3 min-w-[200px] flex-shrink-0">
                              <div className="flex flex-col gap-2 w-full">
                                <Link href={`/professionals/${listing.slug}`} className="w-full">
                                  <Button className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg">View Profile</Button>
                                </Link>
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <ContactProfessionalButton slug={listing.slug} />
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                      </div>
                    </Card>
                    {(index + 1) % 6 === 0 && (
                      <div className="w-full my-4">
                        <AdSlot location="search_feed" targetCity={resolvedSearchParams.city} className="w-full h-32 rounded-xl" />
                      </div>
                    )}
                  </React.Fragment>
                );
              }) : (
                <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">
                  {error ? (
                    <div className="text-red-500 font-bold mb-2">Error fetching data: {error}</div>
                  ) : null}
                  No professionals found matching your search criteria.
                </div>
              )}
            </div>
          )}
          
          {meta && <ProfessionalsPagination currentPage={meta.current_page} lastPage={meta.last_page} />}
        </div>
      </div>
    </div>
  );
}
