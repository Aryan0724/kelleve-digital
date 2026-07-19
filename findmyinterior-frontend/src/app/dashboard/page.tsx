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

  switch (user.role) {
    case 'homeowner':
    case 'customer':
      return <HomeownerDashboard data={data} fetchDashboard={fetchDashboard} />;
    
    case 'contractor':
      return <ContractorDashboard data={data} fetchDashboard={fetchDashboard} />;
      
    case 'material_supplier':
    case 'supplier':
      return <SupplierDashboard data={data} fetchDashboard={fetchDashboard} />;
      
    case 'skilled_worker':
    case 'worker':
      return <WorkerDashboard data={data} fetchDashboard={fetchDashboard} />;
      
    case 'interior_designer':
    case 'interior_company':
    case 'architect':
    case 'business':
      return <DesignerDashboard data={data} fetchDashboard={fetchDashboard} />;
      
    case 'builder':
      return <BuilderDashboard data={data} fetchDashboard={fetchDashboard} />;
      
    default:
      // Fallback
      return <HomeownerDashboard data={data} fetchDashboard={fetchDashboard} />;
  }
}
