'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TrueDialAPI } from '@/lib/api';

interface Advertisement {
  id: number;
  title: string;
  media_type: 'image' | 'video' | 'html';
  banner_url?: string;
  custom_code?: string;
  link?: string;
}

interface InlineListAdProps {
  targetCity?: string;
  targetCategoryId?: number;
  className?: string;
}

export function InlineListAd({ targetCity, targetCategoryId, className = '' }: InlineListAdProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAd = async () => {
      try {
        let url = `/advertisements?location=in_list`;
        if (targetCity) url += `&target_city=${encodeURIComponent(targetCity)}`;
        if (targetCategoryId) url += `&target_category_id=${targetCategoryId}`;
        
        const response = await TrueDialAPI.get(url);
        if (isMounted && response?.data && response.data.length > 0) {
          setAd(response.data[0]);
        }
      } catch (error) {
        console.error(`Failed to fetch inline list ad`, error);
      }
    };

    fetchAd();
    return () => { isMounted = false; };
  }, [targetCity, targetCategoryId]);

  useEffect(() => {
    if (ad && !hasTrackedImpression.current) {
      // IntersectionObserver could be used here for better accuracy, but for now we track on render
      TrueDialAPI.post(`/advertisements/${ad.id}/impression`, {}).catch(console.error);
      hasTrackedImpression.current = true;
    }
  }, [ad]);

  const handleClick = () => {
    if (ad) {
      TrueDialAPI.post(`/advertisements/${ad.id}/click`, {}).catch(console.error);
      if (ad.link) {
        window.open(ad.link, '_blank');
      }
    }
  };

  if (!ad) return null;

  return (
    <div 
      className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm cursor-pointer group hover:border-[#1E40AF]/50 transition-colors my-4 ${className}`}
      onClick={handleClick}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10 pointer-events-none uppercase font-bold tracking-wider">
          Sponsored
        </div>

        {ad.media_type === 'image' && ad.banner_url && (
          <div className="aspect-[21/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img 
              src={ad.banner_url} 
              alt={ad.title || "Advertisement"} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          </div>
        )}

        {ad.media_type === 'video' && ad.banner_url && (
          <div className="aspect-[21/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <video 
              src={ad.banner_url} 
              className="w-full h-full object-cover" 
              autoPlay 
              muted 
              loop 
              playsInline
            />
          </div>
        )}

        {ad.media_type === 'html' && ad.custom_code && (
          <div className="w-full p-4 min-h-[120px] flex items-center justify-center">
            <div dangerouslySetInnerHTML={{ __html: ad.custom_code }} />
          </div>
        )}
        
        {/* Fallback for title-only ads */}
        {(!ad.banner_url && !ad.custom_code) && (
          <div className="p-6 text-center">
            <h3 className="text-lg font-bold text-[#1E40AF]">{ad.title}</h3>
            {ad.link && <span className="text-sm text-slate-500 mt-2 block group-hover:text-[#E8701A]">Click to learn more &rarr;</span>}
          </div>
        )}
      </div>
    </div>
  );
}
