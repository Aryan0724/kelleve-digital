import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import { Ticket, MapPin, Search, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function GlobalOffersPage() {
  const response = await TrueDialAPI.getPublicOffers();
  const offers = response.success ? response.data.data : [];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <div className="bg-blue-600 dark:bg-blue-900 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 text-white">
            <Ticket className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Discover Local Deals</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Find the best discounts, coupons, and exclusive offers from trusted businesses in your city.
          </p>
          
          <div className="max-w-2xl mx-auto relative flex items-center bg-white dark:bg-zinc-800 rounded-full p-2 shadow-xl">
            <Search className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
            <input 
                type="text" 
                placeholder="Search for offers (e.g. 50% off, free consultation)"
                className="w-full bg-transparent border-none outline-none px-4 py-2 text-zinc-900 dark:text-white placeholder:text-zinc-400"
            />
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shrink-0">
                Search
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Latest Offers</h2>
          <select className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium outline-none">
            <option>All Categories</option>
            <option>Restaurants</option>
            <option>Salons & Spa</option>
            <option>Home Services</option>
            <option>Health & Medical</option>
          </select>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <Ticket className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No active offers found</h3>
            <p className="text-zinc-500">Check back later for new deals and promotions from local businesses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer: any) => (
              <div key={offer.id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all group flex flex-col">
                <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                    {offer.media && offer.media.length > 0 ? (
                        <img src={offer.media[0].url} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20">
                            <Tag className="w-12 h-12" />
                        </div>
                    )}
                    
                    {offer.discount_type && offer.discount_value && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                            {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                        </div>
                    )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-2">
                        {offer.listing?.category && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                                {offer.listing.category}
                            </Badge>
                        )}
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {offer.listing?.address?.split(',')[0] || "Location"}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1" title={offer.title}>{offer.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2 flex-1">{offer.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {offer.valid_until ? `Valid till ${new Date(offer.valid_until).toLocaleDateString()}` : "Ongoing"}
                        </div>
                        <Link href={`/businesses/${offer.listing?.slug || '#'}`} className="text-blue-600 font-bold text-sm hover:underline">
                            View Business →
                        </Link>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
