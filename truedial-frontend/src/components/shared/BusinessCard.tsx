"use client";

import React from "react";
import Link from "next/link";
import { TrueDialAPI } from "@/lib/api";
import { Star, MapPin, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const defaultImage = "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070";

  return (
    <div className="premium-card flex flex-col md:flex-row border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link href={`/businesses/${slug}`} className="block relative w-full md:w-64 h-48 md:h-full flex-shrink-0">
        <img
          src={cover_image || defaultImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {is_premium && (
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-none shadow-sm">
              Premium
            </Badge>
          )}
          {is_verified && (
            <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-none shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <Link href={`/businesses/${slug}`}>
                <h3 className="text-xl font-bold text-navy dark:text-white hover:text-primary transition">
                  {title}
                </h3>
              </Link>
              {category && <span className="text-sm text-primary font-medium">{category}</span>}
            </div>

            {(rating ?? 0) > 0 && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded font-bold text-sm">
                <span>{rating}</span>
                <Star className="w-3 h-3 fill-green-700" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <MapPin className="w-4 h-4" />
            <span>{locality || "Location unavailable"}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          {phone && (
            <a 
              href={`tel:${phone}`} 
              className="flex-1"
              onClick={() => {
                TrueDialAPI.trackEvent("PHONE_CLICK", "listing", Number(id), { 
                  source: "business_card" 
                });
              }}
            >
              <Button variant="outline" className="w-full font-semibold border-primary/20 hover:bg-primary/5 text-primary">
                <Phone className="w-4 h-4 mr-2" /> Call
              </Button>
            </a>
          )}
          {whatsapp && (
            <a 
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1"
              onClick={() => {
                TrueDialAPI.trackEvent("WHATSAPP_CLICK", "listing", Number(id), { 
                  source: "business_card" 
                });
              }}
            >
              <Button className="w-full font-semibold bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </a>
          )}
          {!phone && !whatsapp && (
            <Link href={`/businesses/${slug}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
