"use client";

import React from "react";
import Link from "next/link";
import { TrueDialAPI } from "@/lib/api";
import { Star, MapPin, Phone, MessageCircle, ShieldCheck, Heart, Share2, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveImageUrl } from "@/utils/imageResolver";

export interface BusinessCardProps {
  id: string | number;
  slug: string;
  title: string;
  category?: string;
  locality?: string;
  rating?: number;
  is_verified?: boolean;
  is_premium?: boolean;
  cover_image?: string;
  phone?: string;
  whatsapp?: string;
}

export default function BusinessCard({
  id,
  slug,
  title,
  category,
  locality,
  rating,
  is_verified,
  is_premium,
  cover_image,
  phone,
  whatsapp,
}: BusinessCardProps) {
  const imageUrl = resolveImageUrl(cover_image);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left: Thumbnail image */}
        <Link href={`/businesses/${slug}`} className="block relative w-full sm:w-48 h-48 sm:h-36 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-business.svg"; }}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {is_premium && (
              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm text-[9px] px-1.5 py-0 border-none">
                PREMIUM
              </Badge>
            )}
            {is_verified && (
              <Badge className="bg-green-600/90 text-white backdrop-blur-sm text-[9px] px-1.5 py-0 border-none flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-[10px] font-bold">{rating || "4.5"}</span>
          </div>
        </Link>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/businesses/${slug}`}>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white hover:text-primary transition line-clamp-1">
                    {title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="bg-blue-50 dark:bg-slate-800 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {category || "Business"}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{locality || "Location unavailable"}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick actions (save, share) */}
              <div className="hidden sm:flex gap-2">
                <button className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-green-600" /> 84% Recommend</span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-700 rounded border border-green-200">Open Now</span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
              "Excellent service, very professional and on time..."
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {phone && (
              <a 
                href={`tel:${phone}`} 
                className="flex-1"
                onClick={() => TrueDialAPI.trackEvent("PHONE_CLICK", "listing", Number(id), { source: "business_card" })}
              >
                <Button className="w-full h-9 font-bold bg-green-600 hover:bg-green-700 text-white text-xs">
                  <Phone className="w-3.5 h-3.5 mr-1.5" /> Call Now
                </Button>
              </a>
            )}
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1"
                onClick={() => TrueDialAPI.trackEvent("WHATSAPP_CLICK", "listing", Number(id), { source: "business_card" })}
              >
                <Button className="w-full h-9 font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs">
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> WhatsApp
                </Button>
              </a>
            )}
            <Link href={`/businesses/${slug}`} className="flex-1">
              <Button variant="outline" className="w-full h-9 font-bold text-xs border-primary text-primary hover:bg-primary/5">
                Get Quotes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
