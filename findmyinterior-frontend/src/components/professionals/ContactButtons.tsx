"use client";

import { Phone, Mail, Globe } from "lucide-react";
import api from "@/lib/api";

export function ContactButtons({ listing }: { listing: any }) {
  const handleTrackClick = async (type: string) => {
    try {
      await api.post(`/listings/${listing.id}/click`, { type });
    } catch (e) {
      console.error("Failed to track click", e);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div 
        className="flex items-center p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => {
          handleTrackClick('phone');
          if (listing.phone) window.location.href = `tel:${listing.phone}`;
        }}
      >
        <Phone className="h-5 w-5 text-slate-400 mr-3" />
        <div>
          <div className="text-xs text-slate-500 font-medium">Phone Number</div>
          <div className="text-slate-900 font-semibold">{listing.phone || '+91 ***** *****'}</div>
        </div>
      </div>
      
      <div 
        className="flex items-center p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => {
          // email is not tracked specifically in backend (we only have phone, whatsapp, website)
          if (listing.email) window.location.href = `mailto:${listing.email}`;
        }}
      >
        <Mail className="h-5 w-5 text-slate-400 mr-3" />
        <div>
          <div className="text-xs text-slate-500 font-medium">Email Address</div>
          <div className="text-slate-900 font-semibold">{listing.email || 'hidden@example.com'}</div>
        </div>
      </div>
      
      {listing.website && (
        <div 
          className="flex items-center p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={() => {
            handleTrackClick('website');
            window.open(listing.website, '_blank');
          }}
        >
          <Globe className="h-5 w-5 text-slate-400 mr-3" />
          <div className="text-blue-600 font-semibold">
            Visit Website
          </div>
        </div>
      )}
    </div>
  );
}
