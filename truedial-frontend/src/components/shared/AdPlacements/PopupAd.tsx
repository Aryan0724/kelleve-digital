'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { TrueDialAPI } from '@/lib/api';

interface Advertisement {
  id: number;
  title: string;
  media_type: 'image' | 'video' | 'html';
  banner_url?: string;
  custom_code?: string;
  link?: string;
}

interface PopupAdProps {
  targetCity?: string;
  targetCategoryId?: number;
}

export function PopupAd({ targetCity, targetCategoryId }: PopupAdProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    // Check local storage frequency cap (reducing to 5 minutes to ensure it shows up for testing)
    const lastSeenStr = localStorage.getItem('last_popup_ad_seen');
    if (lastSeenStr) {
      const lastSeen = new Date(lastSeenStr).getTime();
      const now = new Date().getTime();
      const minutesSinceLastSeen = (now - lastSeen) / (1000 * 60);
      
      // If seen in the last 5 minutes, don't show
      if (minutesSinceLastSeen < 5) {
        return; 
      }
    }

    const fetchAd = async () => {
      try {
        let url = `/advertisements?location=popup`;
        if (targetCity) url += `&target_city=${encodeURIComponent(targetCity)}`;
        if (targetCategoryId) url += `&target_category_id=${targetCategoryId}`;
        
        const response = await TrueDialAPI.get(url);
        if (isMounted && response?.data && response.data.length > 0) {
          setAd(response.data[0]);
          setIsOpen(true);
        }
      } catch (error) {
        console.error(`Failed to fetch popup ad`, error);
      }
    };

    // Small delay for better UX
    const timer = setTimeout(() => {
      fetchAd();
    }, 2000);

    return () => { 
      isMounted = false; 
      clearTimeout(timer);
    };
  }, [targetCity, targetCategoryId]);

  useEffect(() => {
    if (isOpen && ad && !hasTrackedImpression.current) {
      TrueDialAPI.post(`/advertisements/${ad.id}/impression`, {}).catch(console.error);
      hasTrackedImpression.current = true;
      localStorage.setItem('last_popup_ad_seen', new Date().toISOString());
    }
  }, [isOpen, ad]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    if (ad) {
      TrueDialAPI.post(`/advertisements/${ad.id}/click`, {}).catch(console.error);
      if (ad.link) {
        window.open(ad.link, '_blank');
      }
      setIsOpen(false);
    }
  };

  if (!isOpen || !ad) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur transition-colors"
          aria-label="Close Ad"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div 
          className="w-full cursor-pointer relative group"
          onClick={handleClick}
        >
          <div className="absolute top-2 left-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10 pointer-events-none">
            Advertisement
          </div>

          {ad.media_type === 'image' && ad.banner_url && (
            <img 
              src={ad.banner_url} 
              alt={ad.title || "Advertisement"} 
              className="w-full h-auto max-h-[70vh] object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
            />
          )}

          {ad.media_type === 'video' && ad.banner_url && (
            <video 
              src={ad.banner_url} 
              className="w-full h-auto max-h-[70vh] object-contain" 
              autoPlay 
              muted 
              loop 
              playsInline
            />
          )}

          {ad.media_type === 'html' && ad.custom_code && (
            <div 
              className="w-full p-4" 
              dangerouslySetInnerHTML={{ __html: ad.custom_code }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
