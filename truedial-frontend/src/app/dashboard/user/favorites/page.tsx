"use client";

import { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Loader2, Heart, Star, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await TrueDialAPI.get("/truedial/user/saved-businesses");
        if (res && res.data) {
          setFavorites(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const removeFavorite = async (id: number) => {
    try {
      await TrueDialAPI.post(`/truedial/user/saved-businesses/${id}/remove`, {});
      setFavorites(favorites.filter(f => f.id !== id));
    } catch (error) {
      console.error("Failed to remove favorite", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">Saved Businesses</h1>
        <p className="text-muted-foreground text-sm mt-1">Your favorite vendors and services.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="premium-card p-12 text-center rounded-xl border border-border bg-card/50">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No saved businesses yet</h3>
          <p className="text-muted-foreground text-sm mt-2 mb-6">Discover and save businesses to access them easily.</p>
          <Link href="/search" className="btn-primary rounded-full px-6 py-2">
            Explore Directory
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((business) => (
            <div key={business.id} className="premium-card rounded-xl overflow-hidden group">
              <div className="relative h-48 w-full bg-muted">
                {business.gallery?.[0] ? (
                  <Image src={business.gallery[0]} alt={business.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                    <Building2 className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <button 
                  onClick={(e) => { e.preventDefault(); removeFavorite(business.id); }}
                  className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full hover:bg-white dark:hover:bg-black transition text-red-500"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/business/${business.slug}`} className="font-semibold text-lg hover:text-primary transition line-clamp-1">
                    {business.title}
                  </Link>
                  <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">
                    <span>{business.rating || "New"}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {business.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                  <span className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
                    {business.category?.name || 'Business'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {business.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
