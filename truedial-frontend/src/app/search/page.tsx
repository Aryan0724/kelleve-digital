import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Star, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrueDialAPI } from "@/lib/api";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';
  const city = typeof searchParams.city === 'string' ? searchParams.city : '';

  const response = await TrueDialAPI.getListings({ query, category, city });
  const listings = response.success ? response.data : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-navy py-12 px-6 md:px-12 text-center text-white">
        <h1 className="text-3xl font-bold mb-6">Find Verified Businesses</h1>
        <form action="/search" className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center bg-white rounded-md px-4 py-3 text-navy">
            <MapPin className="text-gray-400 mr-2 w-5 h-5" />
            <input type="text" name="city" defaultValue={city} placeholder="City or Pincode" className="w-full outline-none bg-transparent" />
          </div>
          <div className="flex-1 flex items-center bg-white rounded-md px-4 py-3 text-navy">
            <Search className="text-gray-400 mr-2 w-5 h-5" />
            <input type="text" name="category" defaultValue={category} placeholder="Category (e.g. Restaurants)" className="w-full outline-none bg-transparent" />
          </div>
          <div className="flex-[2] flex items-center bg-white rounded-md px-4 py-3 text-navy">
            <Search className="text-gray-400 mr-2 w-5 h-5" />
            <input type="text" name="q" defaultValue={query} placeholder="Search business name..." className="w-full outline-none bg-transparent" />
          </div>
          <Button type="submit" size="lg" className="h-auto py-3">Search</Button>
        </form>
      </div>

      <main className="flex-1 bg-background py-8 px-6 md:px-12 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="premium-card p-6 rounded-xl sticky top-24">
            <h3 className="font-bold text-navy dark:text-white mb-4 border-b border-border pb-2">Filters</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3">Verification</h4>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2 cursor-pointer hover:text-primary transition">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" /> Verified Businesses Only
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" /> TRUEDIAL Premium
              </label>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3">Rating</h4>
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-2 text-sm text-muted-foreground mb-2 cursor-pointer hover:text-primary transition">
                  <input type="radio" name="rating" className="border-border text-primary focus:ring-primary" /> {rating}.0+ Stars
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-navy dark:text-white">
              {listings.length} Results Found
            </h2>
            <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-muted-foreground outline-none">
              <option>Sort by: Relevance</option>
              <option>Highest Rated</option>
              <option>Nearest</option>
            </select>
          </div>

          {listings.map((listing: any, idx: number) => (
            <Link href={`/businesses/${listing.slug}`} key={idx}>
              <div className="premium-card rounded-xl overflow-hidden flex flex-col sm:flex-row group cursor-pointer animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                <div 
                  className="w-full sm:w-64 h-48 sm:h-auto bg-cover bg-center"
                  style={{ backgroundImage: `url('${listing.gallery && listing.gallery[0] ? listing.gallery[0] : 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070'}')` }}
                ></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-navy dark:text-white group-hover:text-primary transition">{listing.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" /> {listing.address || listing.city}
                      </div>
                    </div>
                    {listing.rating >= 4.5 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        <ShieldCheck className="w-3 h-3 mr-1"/> Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(Math.floor(listing.rating || 5))].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                    <span className="text-sm font-semibold ml-1">{listing.rating || "5.0"}</span>
                    <span className="text-xs text-muted-foreground ml-1">({listing.reviews_count || 0} Reviews)</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {listing.description}
                  </p>

                  <div className="flex gap-3 mt-auto pt-4 border-t border-border">
                    <Button className="flex-1">Contact Now</Button>
                    <Button variant="outline" className="flex-1">View Details</Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {listings.length === 0 && (
             <div className="text-center py-20 bg-muted/20 rounded-xl">
               <h3 className="text-xl font-bold text-navy dark:text-white mb-2">No businesses found</h3>
               <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
             </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}
