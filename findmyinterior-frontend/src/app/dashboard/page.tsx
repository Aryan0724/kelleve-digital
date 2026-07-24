"use client";

import { useEffect, useState } from "react";
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

export default function UserDashboard() {
  const { user, token, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/user/dashboard");
      setData(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !_hasHydrated) return;
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDashboard();
  }, [token, mounted, _hasHydrated, router]);

  if (!mounted || !_hasHydrated || loading) return <div className="p-20 text-center">Loading dashboard...</div>;
  if (!user) return null;

  const dashType = getDashboardType(user.role);

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
    default:
      return <DesignerDashboard data={data} fetchDashboard={fetchDashboard} />;
  }
}

