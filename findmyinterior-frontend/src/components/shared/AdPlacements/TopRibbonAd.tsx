"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { X } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function TopRibbonAd() {
  const [ad, setAd] = useState<any>(null);
  const [visible, setVisible] = useState(true);
  const { user } = useAuthStore();
  const role = user?.role;

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const currentRole = role || "guest";
        const res = await api.get(`/advertisements?location=top_ribbon&target_role=${currentRole}`);
        if (res.data?.data && res.data.data.length > 0) {
          const topAd = res.data.data[0];
          setAd(topAd);
          api.post(`/advertisements/${topAd.id}/impression`).catch(() => {});
        }
      } catch (err) {
        console.error("Failed to load top ribbon ad", err);
      }
    };
    fetchAd();
  }, [role]);

  if (!ad || !visible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 to-indigo-600 text-white relative flex items-center justify-center min-h-[40px] px-4 py-2 z-50">
      <a 
        href={ad.link || "#"} 
        target="_blank" 
        rel="noreferrer"
        className="flex items-center justify-center w-full text-center hover:opacity-90 transition-opacity"
        onClick={() => api.post(`/advertisements/${ad.id}/click`).catch(() => {})}
      >
        {ad.media_type === "html" ? (
          <div dangerouslySetInnerHTML={{ __html: ad.custom_code }} className="text-sm font-medium" />
        ) : ad.media_type === "image" && ad.banner_url ? (
          <img src={ad.banner_url} alt={ad.title} className="h-10 object-contain" />
        ) : (
          <span className="text-sm font-medium">{ad.title}</span>
        )}
      </a>
      <button 
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
