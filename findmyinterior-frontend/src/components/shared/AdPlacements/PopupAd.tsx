"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { X } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function PopupAd() {
  const [ad, setAd] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const role = user?.role;

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const currentRole = role || "guest";
        const res = await api.get(`/advertisements?location=popup&target_role=${currentRole}`);
        if (res.data?.data && res.data.data.length > 0) {
          const popupAd = res.data.data[0];
          
          // Frequency capping: show once per 24 hours per ad ID
          const lastSeen = localStorage.getItem(`popup_ad_${popupAd.id}`);
          const now = new Date().getTime();
          
          if (!lastSeen || now - parseInt(lastSeen) > 24 * 60 * 60 * 1000) {
            setAd(popupAd);
            setOpen(true);
            api.post(`/advertisements/${popupAd.id}/impression`).catch(() => {});
            localStorage.setItem(`popup_ad_${popupAd.id}`, now.toString());
          }
        }
      } catch (err) {
        console.error("Failed to load popup ad", err);
      }
    };
    
    // Slight delay so it doesn't block initial render feeling
    const timer = setTimeout(() => {
      fetchAd();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [role]);

  if (!ad) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <div className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
          <button 
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <a 
            href={ad.link || "#"} 
            target="_blank" 
            rel="noreferrer"
            className="block w-full group"
            onClick={() => {
              api.post(`/advertisements/${ad.id}/click`).catch(() => {});
              setOpen(false);
            }}
          >
            {ad.media_type === "html" ? (
              <div className="p-8" dangerouslySetInnerHTML={{ __html: ad.custom_code }} />
            ) : ad.media_type === "video" && ad.banner_url ? (
              <video autoPlay loop muted playsInline className="w-full h-auto">
                <source src={ad.banner_url} type="video/mp4" />
              </video>
            ) : ad.media_type === "image" && ad.banner_url ? (
              <img src={ad.banner_url} alt={ad.title} className="w-full h-auto object-contain group-hover:opacity-95 transition-opacity" />
            ) : (
              <div className="p-8 text-center text-xl font-bold">{ad.title}</div>
            )}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
