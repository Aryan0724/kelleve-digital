"use client";

import { useState, useEffect } from "react";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Global cache to prevent redundant API calls when rendering lists of items
let globalBookmarksCache: any[] | null = null;
let globalBookmarksPromise: Promise<any> | null = null;

interface BookmarkButtonProps {
  id: number;
  type: 'Listing' | 'Worker' | 'Requirement' | 'Project';
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  initialIsBookmarked?: boolean;
  iconType?: 'bookmark' | 'heart';
}

export function BookmarkButton({ id, type, className, variant = "outline", size = "icon", initialIsBookmarked = false, iconType = 'bookmark' }: BookmarkButtonProps) {
  const { token } = useAuthStore();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    // Check initial state from server if not provided
    const checkBookmarkStatus = async () => {
      try {
        if (globalBookmarksCache) {
           const isSaved = globalBookmarksCache.some((b: any) => b.item_id === id && b.type === type);
           setIsBookmarked(isSaved);
           setLoading(false);
           return;
        }

        if (!globalBookmarksPromise) {
           globalBookmarksPromise = api.get("/user/bookmarks");
        }

        const res = await globalBookmarksPromise;
        const bookmarks = res.data?.data || [];
        globalBookmarksCache = bookmarks;
        
        const isSaved = bookmarks.some((b: any) => b.item_id === id && b.type === type);
        setIsBookmarked(isSaved);
      } catch (err) {
        console.error("Failed to check bookmark status", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkBookmarkStatus();
  }, [id, type, token]);

  const toggleBookmark = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!token) {
      toast.info("Please login to save bookmarks");
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      // Optimistic update
      setIsBookmarked(!isBookmarked);
      
      const res = await api.post("/user/bookmarks/toggle", { id, type });
      setIsBookmarked(res.data.is_bookmarked);
      
      // Update global cache so it stays in sync across component mounts
      if (globalBookmarksCache) {
        if (res.data.is_bookmarked) {
          // Add if not exists
          if (!globalBookmarksCache.some((b: any) => b.item_id === id && b.type === type)) {
            globalBookmarksCache.push({ item_id: id, type });
          }
        } else {
          // Remove
          globalBookmarksCache = globalBookmarksCache.filter((b: any) => !(b.item_id === id && b.type === type));
        }
      }
      
      if (res.data.is_bookmarked) {
        toast.success("Saved to bookmarks");
      } else {
        toast.info("Removed from bookmarks");
      }
    } catch (err) {
      // Revert on error
      setIsBookmarked(!isBookmarked);
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className} 
      onClick={toggleBookmark}
      disabled={loading}
      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      {iconType === 'heart' ? (
        <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
      ) : (
        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-orange-600 text-orange-600' : ''}`} />
      )}
    </Button>
  );
}
