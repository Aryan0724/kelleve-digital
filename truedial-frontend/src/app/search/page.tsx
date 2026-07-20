import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Star, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-navy py-12 px-6 md:px-12 text-center text-white">
        <h1 className="text-3xl font-bold mb-6">Find Verified Businesses</h1>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center bg-white rounded-md px-4 py-3">
            <MapPin className="text-gray-400 mr-2 w-5 h-5" />
            <input type="text" placeholder="City or Pincode" className="w-full outline-none text-navy bg-transparent" />
          </div>
          <div className="flex-[2] flex items-center bg-white rounded-md px-4 py-3">
            <Search className="text-gray-400 mr-2 w-5 h-5" />
            <input type="text" placeholder="Search for Restaurants, Hospitals, Services..." className="w-full outline-none text-navy bg-transparent" />
          </div>
          <Button size="lg" className="h-auto py-3">Search</Button>
        </div>
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
            <h2 className="text-xl font-bold text-navy dark:text-white">Search Results</h2>
            <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-muted-foreground outline-none">
              <option>Sort by: Relevance</option>
              <option>Highest Rated</option>
              <option>Nearest</option>
            </select>
          </div>

          {/* Dummy Result Card 1 */}
          <Link href="/businesses/sample-business-1">
            <div className="premium-card rounded-xl overflow-hidden flex flex-col sm:flex-row group cursor-pointer animate-fade-in-up">
              <div className="w-full sm:w-64 h-48 sm:h-auto bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-navy dark:text-white group-hover:text-primary transition">The Grand Palace Restaurant</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" /> Kankarbagh, Patna
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100"><ShieldCheck className="w-3 h-3 mr-1"/> Verified</Badge>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                  <span className="text-sm font-semibold ml-1">4.9</span>
                  <span className="text-xs text-muted-foreground ml-1">(128 Reviews)</span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  Premium dining experience offering authentic North Indian, Chinese, and Continental cuisines. Perfect for family gatherings and corporate events.
                </p>

                <div className="flex gap-3 mt-auto pt-4 border-t border-border">
                  <Button className="flex-1">Contact Now</Button>
                  <Button variant="outline" className="flex-1">View Details</Button>
                </div>
              </div>
            </div>
          </Link>

          {/* Dummy Result Card 2 */}
          <Link href="/businesses/sample-business-2">
            <div className="premium-card rounded-xl overflow-hidden flex flex-col sm:flex-row group cursor-pointer animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              <div className="w-full sm:w-64 h-48 sm:h-auto bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center"></div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-navy dark:text-white group-hover:text-primary transition">City Care Super Specialty Hospital</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" /> Boring Road, Patna
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20"><Star className="w-3 h-3 mr-1"/> Premium</Badge>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                  <Star className="w-4 h-4 fill-muted text-muted" />
                  <span className="text-sm font-semibold ml-1">4.2</span>
                  <span className="text-xs text-muted-foreground ml-1">(342 Reviews)</span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  24x7 emergency services, advanced ICU, and specialized departments including cardiology, orthopedics, and neurology.
                </p>

                <div className="flex gap-3 mt-auto pt-4 border-t border-border">
                  <Button className="flex-1">Contact Now</Button>
                  <Button variant="outline" className="flex-1">View Details</Button>
                </div>
              </div>
            </div>
          </Link>

        </section>
      </main>

      <Footer />
    </div>
  );
}
