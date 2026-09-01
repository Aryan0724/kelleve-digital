'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import api from '@/lib/api';
import { Advertisement } from './AdSlot';

interface TopRibbonAdProps {
  targetCity?: string;
  targetCategoryId?: number;
}

export function TopRibbonAd({ targetCity, targetCategoryId }: TopRibbonAdProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    // Check if user dismissed ribbon in this session
    if (sessionStorage.getItem('ribbon_ad_dismissed')) {
      return;
    }

    const fetchAd = async () => {
      try {
        let url = `/advertisements?location=top_ribbon`;
        if (targetCity) url += `&target_city=${encodeURIComponent(targetCity)}`;
        if (targetCategoryId) url += `&target_category_id=${targetCategoryId}`;
        
        const response = await api.get(url);
        if (isMounted && response.data?.data?.length > 0) {
          setAd(response.data.data[0]);
          setIsVisible(true);
        }
      } catch (error) {
        console.error(`Failed to fetch top ribbon ad`, error);
      }
    };

    fetchAd();
    return () => { isMounted = false; };
  }, [targetCity, targetCategoryId]);

  useEffect(() => {
    if (isVisible && ad && !hasTrackedImpression.current) {
      api.post(`/advertisements/${ad.id}/impression`).catch(console.error);
      hasTrackedImpression.current = true;
    }
  }, [isVisible, ad]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('ribbon_ad_dismissed', 'true');
  };

  const handleClick = () => {
    if (ad) {
      api.post(`/advertisements/${ad.id}/click`).catch(console.error);
      if (ad.link) {
        window.open(ad.link, '_blank');
      }
    }
  };

  if (!isVisible || !ad) return null;

  return (
    <div 
      className="w-full bg-primary/10 border-b border-primary/20 relative cursor-pointer group hover:bg-primary/15 transition-colors"
      onClick={handleClick}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-center text-center relative">
        
        <div className="flex-1 flex items-center justify-center max-h-12 overflow-hidden">
          {ad.media_type === 'image' && ad.banner_url && (
            <img 
              src={ad.banner_url} 
              alt={ad.title || "Advertisement"} 
              className="h-full object-contain" 
            />
          )}

          {ad.media_type === 'html' && ad.custom_code && (
            <div 
              className="w-full text-slate-800 dark:text-slate-100 font-semibold [&_a]:text-slate-800 dark:[&_a]:text-slate-100 [&_a:hover]:text-orange-600 dark:[&_a:hover]:text-orange-400 [&_.group-hover\:text-white]:text-orange-600 dark:[&_.group-hover\:text-white]:text-orange-400 [&_.hover\:text-white]:text-orange-600 dark:[&_.hover\:text-white]:text-orange-400" 
              dangerouslySetInnerHTML={{ __html: ad.custom_code }} 
            />
          )}
          
          {/* For text-only or title-only ribbons when no media fits properly */}
          {(!ad.banner_url && !ad.custom_code) && (
            <span className="text-sm font-medium text-primary">
              <span className="font-bold mr-2 text-[10px] bg-primary/20 px-1 py-0.5 rounded uppercase">AD</span>
              {ad.title}
            </span>
          )}
        </div>

        <button 
          onClick={handleClose}
          className="ml-4 p-1 text-muted-foreground hover:text-foreground hover:bg-black/5 rounded-full transition-colors absolute right-2 md:right-4"
          aria-label="Close Ribbon"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
