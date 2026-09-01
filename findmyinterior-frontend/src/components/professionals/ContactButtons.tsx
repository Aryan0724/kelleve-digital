"use client";

import { Phone, Mail, Globe, MessageCircle, MapPin } from "lucide-react";
import api from "@/lib/api";

import { useState } from "react";
import { UnlockContactModal } from "./UnlockContactModal";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export function ContactButtons({ listing }: { listing: any }) {
  const [showUnlock, setShowUnlock] = useState(false);
  const { token, setShowLoginModal } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [unlockLoading, setUnlockLoading] = useState(false);

  const handleContactAction = (action: () => void) => {
    if (!token) {
      toast.info("Please login to view contact details");
      setShowLoginModal(true, pathname);
      return;
    }
    action();
  };

  const handleTrackClick = async (type: string) => {
    try {
      await api.post(`/listings/${listing.id}/click`, { type });
    } catch (e) {
      console.error("Failed to track click", e);
    }
  };

  const handleWhatsAppUnlockSuccess = () => {
    handleTrackClick("whatsapp");
    const number = listing.phone.replace(/\D/g, "");
    window.open(`https://wa.me/91${number}?text=Hi, I found your profile on FindMyInterior and would like to enquire about your services.`, "_blank");
  };

  const hasPhone = !!listing.phone;
  const hasWhatsApp = !!listing.whatsapp;
  const hasEmail = !!listing.email;
  const hasWebsite = !!listing.website;

  const phoneDisplay = hasPhone ? listing.phone : "Not Available";
  const whatsappDisplay = hasWhatsApp ? listing.whatsapp : "Not Available";
  const emailDisplay = hasEmail ? listing.email : "Not Available";

  return (
    <div className="space-y-3 mb-6">
      {/* Phone */}
      <div
        className={`flex items-center p-3 rounded-lg transition-colors ${
          hasPhone
            ? "bg-green-50 hover:bg-green-100 cursor-pointer border border-green-200"
            : "bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-200"
        }`}
        onClick={() => {
          if (!hasPhone) {
            handleContactAction(() => setShowUnlock(true));
            return;
          }
          handleContactAction(() => {
            handleTrackClick("phone");
            window.location.href = `tel:${listing.phone}`;
          });
        }}
      >
        <Phone className={`h-5 w-5 mr-3 flex-shrink-0 ${hasPhone ? "text-green-600" : "text-slate-600"}`} />
        <div className="min-w-0">
          <div className="text-xs text-slate-500 font-medium">Phone Number</div>
          <div className={`font-semibold truncate ${hasPhone ? "text-green-700" : "text-slate-700 text-sm"}`}>
            {hasPhone ? phoneDisplay : `Unlock Contact (₹${listing.unlock_price || 49})`}
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      {hasWhatsApp && (
        <div
          className="flex items-center p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition-colors"
          onClick={() => {
            handleContactAction(() => {
              handleTrackClick("whatsapp");
              const number = listing.whatsapp.replace(/\D/g, "");
              window.open(`https://wa.me/91${number}?text=Hi, I found your profile on FindMyInterior and would like to enquire about your services.`, "_blank");
            });
          }}
        >
          <MessageCircle className="h-5 w-5 mr-3 text-emerald-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500 font-medium">WhatsApp</div>
            <div className="font-semibold truncate text-emerald-700">
              {whatsappDisplay}
            </div>
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
          handleContactAction(() => {
            window.location.href = `mailto:${listing.email}`;
          });
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
          handleContactAction(() => {
            const query = encodeURIComponent(`${listing.title} ${listing.city || ""} ${listing.address || ""}`);
            window.open(`https://www.google.com/maps/search/${query}`, "_blank");
          });
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
          handleContactAction(() => {
            handleTrackClick("website");
            window.open(listing.website, "_blank");
          });
        }}
        >
          <Globe className="h-5 w-5 mr-3 text-slate-600 flex-shrink-0" />
          <div className="text-blue-600 font-semibold">Visit Website</div>
        </div>
      )}

      {/* Social Links */}
      {listing.social_links && Object.keys(listing.social_links).length > 0 && (
        <div className="flex gap-2 pt-2">
          {Object.entries(listing.social_links as Record<string, string>).map(([platform, url]) => (
            url && typeof url === 'string' && (
              <a 
                key={platform} 
                href={url.startsWith('http') ? url : `https://${url}`}
                target="_blank" 
                rel="noreferrer"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-center py-2 rounded-lg text-sm font-medium transition-colors capitalize border border-slate-200"
              >
                {platform}
              </a>
            )
          ))}
        </div>
      )}

      {/* Fallback if no contact info at all */}
      {!hasPhone && !hasEmail && !hasWebsite && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <p className="text-sm text-amber-700 font-medium">Contact info not publicly listed.</p>
          <p className="text-xs text-amber-600 mt-1">Unlock the contact to view details.</p>
        </div>
      )}

      {/* Unlock Modal */}
      <UnlockContactModal 
        isOpen={showUnlock} 
        onClose={() => setShowUnlock(false)} 
        listing={listing} 
        onUnlockSuccess={() => window.location.reload()} 
      />
    </div>
  );
}
