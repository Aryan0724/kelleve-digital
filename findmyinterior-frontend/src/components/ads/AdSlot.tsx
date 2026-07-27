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
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [trackedImpressions, setTrackedImpressions] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAd = async () => {
      try {
        let url = `/advertisements?location=${location}`;
        if (targetCity) url += `&target_city=${encodeURIComponent(targetCity)}`;
        if (targetCategoryId) url += `&target_category_id=${targetCategoryId}`;
        // Note: target_role could be added here if we had user context in this component
        
        const response = await api.get(url);
        if (isMounted && response.data?.data?.length > 0) {
          // Store all valid ads instead of just the first one
          setAds(response.data.data);
        }
      } catch (error) {
        console.error(`Failed to fetch ad for ${location}`, error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchAd();
    return () => { isMounted = false; };
  }, [location, targetCity, targetCategoryId]);

  // Rotation effect
  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 7000); // Rotate every 7 seconds
    return () => clearInterval(timer);
  }, [ads.length]);

  const currentAd = ads[currentIndex];

  // Intersection Observer for Impression Tracking
  useEffect(() => {
    if (!currentAd || trackedImpressions.has(currentAd.id)) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        api.post(`/advertisements/${currentAd.id}/impression`).catch(console.error);
        setTrackedImpressions(prev => new Set(prev).add(currentAd.id));
        observer.disconnect();
      }
    }, { threshold: 0.5 }); // Trigger when 50% visible

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [currentAd, trackedImpressions]);

  const handleClick = () => {
    if (currentAd) {
      api.post(`/advertisements/${currentAd.id}/click`).catch(console.error);
      if (currentAd.link) {
        window.open(currentAd.link, '_blank');
      }
    }
  };

  if (isLoading) {
    return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`}></div>;
  }

  if (!currentAd) {
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
      
      {currentAd.media_type === 'image' && currentAd.banner_url && (
        <img 
          src={currentAd.banner_url} 
          alt={currentAd.title || "Advertisement"} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
          loading="lazy"
        />
      )}

      {currentAd.media_type === 'video' && currentAd.banner_url && (
        <video 
          src={currentAd.banner_url} 
          className="w-full h-full object-cover" 
          autoPlay 
          muted 
          loop 
          playsInline
        />
      )}

      {currentAd.media_type === 'html' && currentAd.custom_code && (
        <div 
          className="w-full h-full" 
          dangerouslySetInnerHTML={{ __html: currentAd.custom_code }} 
        />
      )}
    </div>
  );
}
