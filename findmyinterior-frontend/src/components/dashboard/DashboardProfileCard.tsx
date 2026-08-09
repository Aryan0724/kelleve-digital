"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";

export function DashboardProfileCard({ 
  fetchDashboard,
  roleLabel,
  description,
  extraContent
}: { 
  fetchDashboard: () => void,
  roleLabel: string,
  description?: string,
  extraContent?: React.ReactNode
}) {
  const { user, updateUser } = useAuthStore();
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const form = new FormData();
      form.append("cover_image", file);
      const res = await api.post("/user/cover", form);
      if (user && res.data.cover_image) {
        updateUser({ ...user, cover_image: res.data.cover_image });
      }
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload cover image.");
    } finally {
      setUploadingCover(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-32 w-full bg-gradient-to-r from-orange-400 to-[#E8701A] relative group">
        {user?.cover_image && (
          <img src={user.cover_image} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/10"></div>
        <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
        <button
          onClick={() => coverFileRef.current?.click()}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all shadow-md z-20 flex items-center gap-1 text-xs"
          disabled={uploadingCover}
          title="Upload Background Image"
        >
          {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          <span className="hidden sm:inline text-[11px] font-medium">{uploadingCover ? "Uploading..." : "Cover"}</span>
        </button>
      </div>
      <CardContent className="p-6 flex flex-col items-center text-center -mt-16 relative z-10">
        <div className="h-24 w-24 relative rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-3xl font-bold text-slate-400 dark:text-slate-500 shadow-md">
          <span className="absolute inset-0 z-0 flex items-center justify-center">{user?.name?.charAt(0)}</span>
          {user?.avatar && (
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover absolute inset-0 z-10 text-transparent" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          )}
        </div>
        <h3 className="font-bold text-xl">{user?.name}</h3>
        <Badge className="mt-2 capitalize mb-2 bg-orange-100 text-orange-700 hover:bg-orange-200 border-0" variant="secondary">{roleLabel}</Badge>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        {extraContent && (
          <div className="w-full mt-4">
            {extraContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
