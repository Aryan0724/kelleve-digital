"use client";

import { useAuth } from "@/context/AuthContext";
import { Sparkles, MapPin, Search, ArrowRight, Building2, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PersonalizedHomeFeed() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !isLoggedIn || !user) return null;

  const rawRoles = user?.roles || (user?.role ? [user.role] : []);
  const roleSlugs = rawRoles.map((r: any) => typeof r === 'string' ? r : (r.slug || r.name || '')).map((s: string) => s.toLowerCase());
  const categorySlugs = user?.categories?.map(c => c.toLowerCase()) || [];

  const isRealEstate = categorySlugs.some(c => ['builder', 'architect', 'interior_designer', 'contractor', 'supplier', 'material_supplier'].includes(c)) || roleSlugs.some((r: string) => ['builder', 'architect', 'interior_designer', 'contractor', 'supplier', 'material_supplier'].includes(r));
  const isService = categorySlugs.some(c => ['worker', 'skilled_worker', 'plumber', 'electrician', 'mechanic', 'cleaner'].includes(c)) || roleSlugs.some((r: string) => ['worker', 'skilled_worker', 'plumber', 'electrician', 'mechanic', 'cleaner'].includes(r));
  const isMedical = categorySlugs.some(c => ['doctor', 'hospital', 'clinic', 'dentist'].includes(c)) || roleSlugs.some((r: string) => ['doctor', 'hospital', 'clinic', 'dentist'].includes(r));
  const isRestaurant = categorySlugs.some(c => ['restaurant', 'cafe', 'bakery', 'food'].includes(c)) || roleSlugs.some((r: string) => ['restaurant', 'cafe', 'bakery', 'food'].includes(r));
  
  const hasVendorRole = roleSlugs.includes('business') || isRealEstate || isService || isMedical || isRestaurant || categorySlugs.length > 0;
  const hasAdminRole = roleSlugs.some((r: string) => ['admin', 'super_admin'].includes(r));

  if (hasVendorRole) {
    return (
      <div className="w-full bg-gradient-to-r from-navy via-slate-900 to-navy text-white py-4 px-6 md:px-12 border-b border-primary/20 animate-fade-in">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Welcome back to your Business Dashboard, {user.name}!</h2>
              <p className="text-sm text-gray-400">You have 3 new leads waiting for a response.</p>
            </div>
          </div>
          <Link href="/dashboard/vendor/crm">
            <button className="bg-primary hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md transition flex items-center gap-2">
              View Leads <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (hasAdminRole) {
    return null; // Admin uses standard dashboard, no need for homepage banner
  }

  // Standard Customer Experience
  return (
    <div className="w-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-900 dark:to-orange-950/20 py-6 px-6 md:px-12 border-b border-orange-200 dark:border-orange-900/30 animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Platinum VIP
          </div>
          <h2 className="text-2xl font-bold text-navy dark:text-white">Welcome back, {user.name}!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ready to find the best local services?</p>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <Link href="/search?category=Interior+Designers">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-border flex items-center gap-3 hover:border-primary transition cursor-pointer">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-sm">
                <div className="font-bold text-navy dark:text-white">Interiors</div>
                <div className="text-[10px] text-muted-foreground">Pick up where you left off</div>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/user">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-border flex items-center gap-3 hover:border-primary transition cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-bold text-navy dark:text-white">Saved Places</div>
                <div className="text-[10px] text-muted-foreground">View your 5 favorites</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
