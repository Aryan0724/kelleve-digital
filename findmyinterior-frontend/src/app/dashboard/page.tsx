"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";

import { HomeownerDashboard } from "@/components/dashboard/roles/HomeownerDashboard";
import { ContractorDashboard } from "@/components/dashboard/roles/ContractorDashboard";
import { SupplierDashboard } from "@/components/dashboard/roles/SupplierDashboard";
import { WorkerDashboard } from "@/components/dashboard/roles/WorkerDashboard";
import { DesignerDashboard } from "@/components/dashboard/roles/DesignerDashboard";
import { BuilderDashboard } from "@/components/dashboard/roles/BuilderDashboard";

// ─── Role → Dashboard mapping ─────────────────────────────────────────────────
// Supports all 80+ professional types by mapping to 5 broad dashboard types.
// The specific type is stored in user.professional_type for display purposes.

const WORKER_ROLES = new Set([
  'worker', 'skilled_worker', 'carpenter', 'electrician', 'plumber', 'painter',
  'pop_false_ceiling_worker', 'tile_marble_fitter', 'granite_installer',
  'fabricator', 'aluminium_fabricator', 'glass_installer',
  'welder', 'polish_worker', 'wallpaper_installer',
]);

const SUPPLIER_ROLES = new Set([
  'supplier', 'material_supplier', 'plywood_dealer', 'laminate_dealer', 'tile_dealer',
  'marble_granite_dealer', 'paint_dealer', 'hardware_supplier', 'lighting_supplier',
  'electrical_supplier', 'sanitary_bathroom_supplier', 'modular_kitchen_material_supplier',
  'glass_supplier', 'acp_aluminium_supplier', 'furniture_supplier', 'door_window_supplier',
]);

const BUILDER_ROLES = new Set([
  'builder', 'real_estate_developer', 'apartment_project', 'commercial_project', 'villa_project',
]);

const CUSTOMER_ROLES = new Set(['homeowner', 'customer']);

// Everything else maps to DesignerDashboard (listing-based profile)
function getDashboardType(role: string): 'customer' | 'worker' | 'supplier' | 'builder' | 'designer' {
  if (CUSTOMER_ROLES.has(role)) return 'customer';
  if (WORKER_ROLES.has(role)) return 'worker';
  if (SUPPLIER_ROLES.has(role)) return 'supplier';
  if (BUILDER_ROLES.has(role)) return 'builder';
  return 'designer'; // interior_designer, architect, contractor, home improvement, etc.
}

const DashboardSkeleton = () => (
  <div className="bg-slate-50 dark:bg-background min-h-screen">
    {/* Header Skeleton */}
    <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 h-16 flex items-center px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
    
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 overflow-hidden">
            <div className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="px-4 pb-4 -mt-10 relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 animate-pulse" />
              <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded mt-3 animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded mt-2 animate-pulse" />
            </div>
            <div className="flex flex-col border-t dark:border-slate-800 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center p-4 border-b dark:border-slate-800 gap-3">
                  <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="h-8 w-16 bg-slate-300 dark:bg-slate-700 rounded mb-2 animate-pulse" />
                <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-6">
            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-6 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center p-4 rounded-lg border dark:border-slate-800">
                  <div className="w-12 h-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-24 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function UserDashboard() {
  const { user, token, _hasHydrated, updateUser } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/user/dashboard");
      setData(res.data.data);
      
      if (user && res.data.data.user) {
        updateUser({
          ...user,
          wallet_balance: res.data.data.user.wallet_balance,
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth guard — only redirect when auth state is clear
  useEffect(() => {
    if (!mounted || !_hasHydrated) return;
    if (!token) {
      router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mounted, _hasHydrated]);

  // Data fetch — runs once after auth confirmed
  useEffect(() => {
    if (!mounted || !_hasHydrated || !token) return;
    fetchDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mounted, _hasHydrated]);

  if (!mounted || !_hasHydrated || loading) return <DashboardSkeleton />;
  if (!user) return null;

  const dashType = getDashboardType(user.role);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {(() => {
        switch (dashType) {
          case 'customer':
            return <HomeownerDashboard data={data} fetchDashboard={fetchDashboard} />;
          case 'worker':
            return <WorkerDashboard data={data} fetchDashboard={fetchDashboard} />;
          case 'supplier':
            return <SupplierDashboard data={data} fetchDashboard={fetchDashboard} />;
          case 'builder':
            return <BuilderDashboard data={data} fetchDashboard={fetchDashboard} />;
          case 'designer':
            return <DesignerDashboard data={data} fetchDashboard={fetchDashboard} />;
          default:
            return <div className="p-10 text-center">Unknown Role Dashboard</div>;
        }
      })()}
    </Suspense>
  );
}
