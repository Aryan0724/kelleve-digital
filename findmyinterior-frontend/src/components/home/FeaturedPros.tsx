import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, ShieldCheck } from "lucide-react";

export function FeaturedPros({ listings }: { listings: any[] }) {
  if (!listings || listings.length === 0) return null;

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Top Rated Professionals
            </h2>
            <p className="text-slate-500 text-lg">
              Trusted interior designers and contractors for your next project.
            </p>
          </div>
          <Link href="/professionals" className="hidden md:inline-flex text-orange-600 font-semibold hover:text-orange-700">
            Browse All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/professionals/${listing.slug}`}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all border-slate-200 group">
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  {listing.cover_image ? (
                    <img 
                      src={listing.cover_image} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                      No Image
                    </div>
                  )}
                  {listing.is_premium && (
                    <Badge className="absolute top-3 right-3 bg-orange-600 hover:bg-orange-700 text-white border-0">
                      Premium
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {listing.title}
                    </h3>
                    {listing.is_verified && (
                      <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{[listing.city, listing.district, 'Bihar', 'India'].filter(Boolean).join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(listing.avg_rating) ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 ml-1">
                      {listing.avg_rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400 ml-1">
                      ({listing.review_count} reviews)
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 border-t border-slate-50 mt-auto">
                  <div className="flex items-center gap-3 pt-4 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={listing.user?.avatar} />
                      <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold text-xs">
                        {listing.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs text-slate-500 line-clamp-1 flex-1">
                      {listing.category?.name}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
