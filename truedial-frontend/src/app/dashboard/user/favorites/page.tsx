"use client";
import { useState, useEffect } from "react";
import { Bookmark, Search, Phone, MessageCircle, ExternalLink, Trash2, Star, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MOCK_SAVED = [
  { id: 1, slug: "sharma-grand-restaurant", title: "Sharma Grand Restaurant", category: "Restaurants & Cafes", city: "Patna", rating: 4.7, reviews: 124, is_verified: true, phone: "+919876543210", whatsapp: "919876543210" },
  { id: 2, slug: "city-dental-clinic", title: "City Dental Clinic", category: "Hospitals & Healthcare", city: "Patna", rating: 4.9, reviews: 211, is_verified: true, phone: "+919876543211", whatsapp: "919876543211" },
  { id: 3, slug: "kriya-fitness-studio", title: "Kriya Fitness Studio", category: "Fitness & Gyms", city: "Patna", rating: 4.5, reviews: 88, is_verified: false, phone: "+919876543212", whatsapp: "919876543212" },
  { id: 4, slug: "royal-palace-hotel", title: "Royal Palace Hotel", category: "Hotels & Lodging", city: "Patna", rating: 4.8, reviews: 340, is_verified: true, phone: "+919876543213", whatsapp: "919876543213" },
];

export default function FavoritesPage() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // In production: fetch from /truedial/user/saved-businesses
    const timer = setTimeout(() => {
      setSaved(MOCK_SAVED);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const remove = (id: number) => setSaved(prev => prev.filter(b => b.id !== id));

  const filtered = saved.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase()) ||
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Saved Businesses</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {saved.length} business{saved.length !== 1 ? "es" : ""} saved to your favorites
          </p>
        </div>
        <Link href="/search">
          <Button variant="outline" className="flex items-center gap-2 text-sm font-semibold">
            <Search className="w-4 h-4" /> Discover More
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search your saved businesses..."
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl shadow-sm">
          <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-bold text-lg text-foreground mb-2">
            {saved.length === 0 ? "No saved businesses yet" : "No results found"}
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            {saved.length === 0
              ? "Start exploring and bookmark businesses you love."
              : "Try a different search term."}
          </p>
          <Link href="/search"><Button>Explore Businesses</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(biz => (
            <div key={biz.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Link href={`/businesses/${biz.slug}`} className="font-bold text-foreground hover:text-primary transition text-base leading-tight">
                    {biz.title}
                  </Link>
                  {biz.is_verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                  <span className="text-primary font-semibold text-xs bg-primary/10 px-2 py-0.5 rounded-full">{biz.category}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {biz.city}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {biz.rating} ({biz.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <a href={`tel:${biz.phone}`} className="p-2 border border-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition" title="Call">
                  <Phone className="w-4 h-4" />
                </a>
                <a href={`https://wa.me/${biz.whatsapp}`} target="_blank" rel="noreferrer" className="p-2 border border-border rounded-lg hover:bg-green-500 hover:text-white hover:border-green-500 transition" title="WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <Link href={`/businesses/${biz.slug}`} className="p-2 border border-border rounded-lg hover:bg-primary/10 hover:border-primary transition" title="View Profile">
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button onClick={() => remove(biz.id)} className="p-2 border border-red-200 dark:border-red-900/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition" title="Remove from saved">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
