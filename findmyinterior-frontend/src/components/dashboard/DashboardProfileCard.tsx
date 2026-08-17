"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function DashboardProfileCard({ 
  fetchDashboard,
  roleLabel,
  description,
  extraContent,
  onEditProfile
}: { 
  fetchDashboard: () => void,
  roleLabel: string,
  description?: string,
  extraContent?: React.ReactNode,
  onEditProfile?: () => void
}) {
  const { user } = useAuthStore();

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-32 w-full bg-gradient-to-r from-orange-400 to-[#E8701A] relative">
        {user?.cover_image && (
          <img src={user.cover_image} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center -mt-12 md:-mt-16 relative z-10">
        <div className="h-20 w-20 md:h-24 md:w-24 relative rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 md:mb-4 text-2xl md:text-3xl font-bold text-slate-400 dark:text-slate-500 shadow-md">
          <span className="absolute inset-0 z-0 flex items-center justify-center">{user?.name?.charAt(0)}</span>
          {user?.avatar && (
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover absolute inset-0 z-10 text-transparent" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          )}
        </div>
        <h3 className="font-bold text-xl">{user?.name}</h3>
        <div className="flex flex-col gap-2 items-center justify-center mt-2 mb-2">
          <div className="flex gap-2">
            <Badge className="capitalize bg-orange-100 text-orange-700 hover:bg-orange-200 border-0" variant="secondary">{roleLabel}</Badge>
            {(user?.is_verified_business || user?.verification_level === 'business_verified' || user?.verification_level === 'site_verified') && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">Verified</Badge>
            )}
          </div>
          {onEditProfile && (
            <button 
              onClick={onEditProfile} 
              className="mt-1 flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold transition-all shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          )}
        </div>
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
