"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bookmark, Loader2, ArrowRight } from "lucide-react";

export function SavedBookmarksTab() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get("/user/bookmarks");
      setBookmarks(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch bookmarks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const removeBookmark = async (id: number, type: string) => {
    try {
      setBookmarks(prev => prev.filter(b => b.item_id !== id || b.type !== type));
      await api.post("/user/bookmarks/toggle", { id, type });
    } catch (err) {
      console.error("Failed to remove bookmark", err);
      fetchBookmarks(); // Revert on failure
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-4" />
        <p className="text-slate-500">Loading your saved items...</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Bookmark className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Saved Items Yet</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          You haven't saved any professionals, projects, or jobs yet. Browse our platform and click the bookmark icon to save items for later.
        </p>
        <div className="flex gap-4">
          <Link href="/professionals" className="text-orange-600 font-semibold hover:underline">
            Browse Professionals
          </Link>
          <Link href="/projects" className="text-orange-600 font-semibold hover:underline">
            Browse Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Items</h2>
        <Badge variant="secondary">{bookmarks.length} Total</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="overflow-hidden hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full">
            {bookmark.image && (
              <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                <img src={bookmark.image} alt={bookmark.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="mb-2 bg-slate-50 dark:bg-slate-800 text-slate-600">{bookmark.type}</Badge>
                <button 
                  onClick={() => removeBookmark(bookmark.item_id, bookmark.type)}
                  className="text-orange-500 hover:text-orange-700 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded-full"
                  title="Remove Bookmark"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 mb-1">{bookmark.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{bookmark.subtitle}</p>
              
              <div className="mt-auto pt-4 border-t dark:border-slate-800">
                <Link href={bookmark.link} className="text-orange-600 font-medium text-sm flex items-center hover:underline">
                  View Details <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
