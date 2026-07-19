import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { Search, MapPin, Star, ShieldCheck, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfessionalsFilters } from "@/components/professionals/ProfessionalsFilters";
import { ProfessionalsPagination } from "@/components/professionals/ProfessionalsPagination";

export const metadata: Metadata = {
  title: "Find Professionals",
  description: "Browse verified interior designers, architects, and contractors in your area.",
};

async function getProfessionals(searchParams: any) {
  try {
    const cleanParams: Record<string, string> = {};
    for (const key in searchParams) {
      if (typeof searchParams[key] === 'string') {
        cleanParams[key] = searchParams[key];
      }
    }
    const params = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://find-my-interior-1.onrender.com/api/v1'}/listings?${params}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error: any) {
    console.error("Fetch Error in ProfessionalsPage:", error);
    return { data: [], meta: { current_page: 1, last_page: 1 }, error: error.message };
  }
}

export default async function ProfessionalsPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const { data: listings, meta, error } = await getProfessionals(resolvedSearchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Search */}
      <div className="mb-8 bg-slate-50 p-6 rounded-xl border">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Find Interior Designers & Contractors</h1>
        <p className="text-slate-500 mb-6">Browse verified professionals for your home project {resolvedSearchParams.city ? `in ${resolvedSearchParams.city}` : 'in your area'}.</p>
        
        <form className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input key={`search-${resolvedSearchParams.search || ''}`} name="search" defaultValue={resolvedSearchParams.search || ''} placeholder="E.g. Modular Kitchen Designer" className="pl-10 h-12 text-base" />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input key={`city-${resolvedSearchParams.city || ''}`} name="city" defaultValue={resolvedSearchParams.city || ''} placeholder="City (e.g. Patna)" className="pl-10 h-12 text-base" />
          </div>
          <Button type="submit" size="lg" className="h-12 px-8 bg-orange-600 hover:bg-orange-700">Search</Button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4 space-y-6">
          <ProfessionalsFilters />
        </div>

        {/* Results Grid */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.length > 0 ? listings.map((listing: any) => (
              <Link key={listing.id} href={`/professionals/${listing.slug}`}>
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border-slate-200 group">
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {listing.cover_image ? (
                      <img 
                        src={listing.cover_image} 
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">No Image</div>
                    )}
                    {listing.is_premium && !listing.is_sponsored && (
                      <Badge className="absolute top-3 right-3 bg-orange-600 hover:bg-orange-700 text-white border-0">Premium</Badge>
                    )}
                    {listing.is_sponsored && (
                      <Badge className="absolute top-3 right-3 bg-amber-400 hover:bg-amber-500 text-slate-900 border-0 shadow-sm font-semibold">Sponsored</Badge>
                    )}
                    {listing.is_top_rated && (
                      <Badge className="absolute top-3 left-3 bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm">Top Rated</Badge>
                    )}
                  </div>
                  <CardContent className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {listing.title}
                        </h3>
                        {listing.verification_level === 'elite_professional' && <Badge className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0" title="Elite Professional">Elite</Badge>}
                        {listing.verification_level === 'trusted_professional' && <Badge className="bg-blue-600 hover:bg-blue-700 flex-shrink-0" title="Trusted Professional">Trusted</Badge>}
                        {(listing.verification_level === 'verified_business' || listing.is_verified) && <span title="Verified Business" className="flex-shrink-0"><ShieldCheck className="h-5 w-5 text-green-500" /></span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-500 mb-4">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{listing.city}, {listing.district}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-4 w-full">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(listing.avg_rating) ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 ml-1">{listing.avg_rating.toFixed(1)}</span>
                      <span className="text-sm text-slate-400 ml-1">({listing.review_count})</span>
                      
                      {listing.trust_score > 0 && (
                        <div className="ml-auto text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Trust: {listing.trust_score}/100
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 border-t border-slate-50 mt-auto">
                    <div className="flex items-center gap-3 pt-4 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={listing.user?.avatar} />
                        <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold text-xs">{listing.title.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-xs text-slate-500 line-clamp-1 flex-1">{listing.category?.name}</div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            )) : (
              <div className="col-span-full py-12 text-center text-slate-500">
                {error ? (
                  <div className="text-red-500 font-bold mb-2">Error fetching data: {error}</div>
                ) : null}
                No professionals found matching your search criteria.
              </div>
            )}
          </div>
          
          {meta && <ProfessionalsPagination currentPage={meta.current_page} lastPage={meta.last_page} />}
        </div>
      </div>
    </div>
  );
}
