"use client";

import { Phone, Mail, Globe, MessageCircle, MapPin } from "lucide-react";
import api from "@/lib/api";

export function ContactButtons({ listing }: { listing: any }) {
  const handleTrackClick = async (type: string) => {
    try {
      await api.post(`/listings/${listing.id}/click`, { type });
    } catch (e) {
      console.error("Failed to track click", e);
    }
  };

  const hasPhone = !!listing.phone;
  const hasEmail = !!listing.email;
  const hasWebsite = !!listing.website;

  const phoneDisplay = hasPhone ? listing.phone : "Not Available";
  const emailDisplay = hasEmail ? listing.email : "Not Available";

  return (
    <div className="space-y-3 mb-6">
      {/* Phone */}
      <div
        className={`flex items-center p-3 rounded-lg transition-colors ${
          hasPhone
            ? "bg-green-50 hover:bg-green-100 cursor-pointer border border-green-200"
            : "bg-slate-50 opacity-60 cursor-not-allowed border border-slate-100"
        }`}
        onClick={() => {
          if (!hasPhone) return;
          handleTrackClick("phone");
          window.location.href = `tel:${listing.phone}`;
        }}
      >
        <Phone className={`h-5 w-5 mr-3 flex-shrink-0 ${hasPhone ? "text-green-600" : "text-slate-400"}`} />
        <div className="min-w-0">
          <div className="text-xs text-slate-500 font-medium">Phone Number</div>
          <div className={`font-semibold truncate ${hasPhone ? "text-green-700" : "text-slate-400 text-sm"}`}>
            {phoneDisplay}
          </div>
        </div>
      </div>

      {/* WhatsApp — shown only if phone available */}
      {hasPhone && (
        <div
          className="flex items-center p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-lg cursor-pointer transition-colors"
          onClick={() => {
            handleTrackClick("whatsapp");
            const number = listing.phone.replace(/\D/g, "");
            window.open(`https://wa.me/91${number}?text=Hi, I found your profile on FindMyInterior and would like to enquire about your services.`, "_blank");
          }}
        >
          <MessageCircle className="h-5 w-5 mr-3 text-[#25D366] flex-shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">WhatsApp</div>
            <div className="text-[#128C7E] font-semibold">Chat on WhatsApp</div>
          </div>
        </div>
      )}

      {/* Email */}
      <div
        className={`flex items-center p-3 rounded-lg transition-colors ${
          hasEmail
            ? "bg-blue-50 hover:bg-blue-100 cursor-pointer border border-blue-200"
            : "bg-slate-50 opacity-60 cursor-not-allowed border border-slate-100"
        }`}
        onClick={() => {
          if (!hasEmail) return;
          window.location.href = `mailto:${listing.email}`;
        }}
      >
        <Mail className={`h-5 w-5 mr-3 flex-shrink-0 ${hasEmail ? "text-blue-600" : "text-slate-400"}`} />
        <div className="min-w-0">
          <div className="text-xs text-slate-500 font-medium">Email Address</div>
          <div className={`font-semibold truncate ${hasEmail ? "text-blue-700" : "text-slate-400 text-sm"}`}>
            {emailDisplay}
          </div>
        </div>
      </div>

      {/* Google Maps — always show location */}
      {(listing.city || listing.address) && (
        <div
          className="flex items-center p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg cursor-pointer transition-colors"
          onClick={() => {
            const query = encodeURIComponent(`${listing.title} ${listing.city || ""} ${listing.address || ""}`);
            window.open(`https://www.google.com/maps/search/${query}`, "_blank");
          }}
        >
          <MapPin className="h-5 w-5 mr-3 text-orange-600 flex-shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Location</div>
            <div className="text-orange-700 font-semibold">
              {listing.city}{listing.district ? `, ${listing.district}` : ""} — Open in Maps
            </div>
          </div>
        </div>
      )}

      {/* Website */}
      {hasWebsite && (
        <div
          className="flex items-center p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors"
          onClick={() => {
            handleTrackClick("website");
            window.open(listing.website, "_blank");
          }}
        >
          <Globe className="h-5 w-5 mr-3 text-slate-600 flex-shrink-0" />
          <div className="text-blue-600 font-semibold">Visit Website</div>
        </div>
      )}

      {/* Fallback if no contact info at all */}
      {!hasPhone && !hasEmail && !hasWebsite && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <p className="text-sm text-amber-700 font-medium">Contact info not publicly listed.</p>
          <p className="text-xs text-amber-600 mt-1">Send an enquiry using the form below.</p>
        </div>
      )}
    </div>
  );
}
