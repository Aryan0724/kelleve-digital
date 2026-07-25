'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import api from '@/lib/api';

export interface Advertisement {
  id: number;
  title: string | null;
  location: string;
  banner_url: string;
  media_type: 'image' | 'video' | 'html';
  custom_code: string | null;
  link: string | null;
}

interface AdSlotProps {
  location: string;
  targetCity?: string;
  targetCategoryId?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export function AdSlot({ location, targetCity, targetCategoryId, className = '', fallback = null }: AdSlotProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAd = async () => {
      try {
        let url = `/advertisements?location=${location}`;
        if (targetCity) url += `&target_city=${encodeURIComponent(targetCity)}`;
        if (targetCategoryId) url += `&target_category_id=${targetCategoryId}`;
        
        const response = await api.get(url);
        if (isMounted && response.data?.data?.length > 0) {
          setAd(response.data.data[0]); // Pick the highest priority active ad
        }
      } catch (error) {
        console.error(`Failed to fetch ad for ${location}`, error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchAd();
    return () => { isMounted = false; };
  }, [location]);

  // Intersection Observer for Impression Tracking
  useEffect(() => {
    if (!ad || hasTrackedImpression) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        api.post(`/advertisements/${ad.id}/impression`).catch(console.error);
        setHasTrackedImpression(true);
        observer.disconnect();
      }
    }, { threshold: 0.5 }); // Trigger when 50% visible

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [ad, hasTrackedImpression]);

  const handleClick = () => {
    if (ad) {
      api.post(`/advertisements/${ad.id}/click`).catch(console.error);
      if (ad.link) {
        window.open(ad.link, '_blank');
      }
    }
  };

  if (isLoading) {
    return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`}></div>;
  }

  if (!ad) {
    return <>{fallback}</>;
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden group cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10 pointer-events-none">
        Ad
      </div>
      
      {ad.media_type === 'image' && ad.banner_url && (
        <img 
          src={ad.banner_url} 
          alt={ad.title || "Advertisement"} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
          loading="lazy"
        />
      )}

      {ad.media_type === 'video' && ad.banner_url && (
        <video 
          src={ad.banner_url} 
          className="w-full h-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline
        />
      )}

      {ad.media_type === 'html' && ad.custom_code && (
        <div 
          className="w-full h-full" 
          dangerouslySetInnerHTML={{ __html: ad.custom_code }} 
        />
      )}
    </div>
  );
}
