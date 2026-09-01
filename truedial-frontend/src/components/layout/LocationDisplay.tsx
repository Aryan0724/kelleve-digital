'use client';

import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useUserLocation } from '@/context/LocationContext';

export default function LocationDisplay() {
  const { city, openLocationModal, isDetecting } = useUserLocation();

  return (
    <button 
      onClick={openLocationModal}
      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-[#1E40AF] bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-full transition-colors shrink-0"
    >
      {isDetecting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1E40AF]" />
      ) : (
        <MapPin className="w-3.5 h-3.5 text-[#1E40AF]" />
      )}
      <span className="truncate max-w-[120px]">{city}</span>
    </button>
  );
}
