"use client";

import { useAuth } from "@/context/AuthContext";
import GenericVendorDashboard from "@/components/dashboard/vendor-variants/GenericVendorDashboard";
import ServiceDashboard from "@/components/dashboard/vendor-variants/ServiceDashboard";
import MedicalDashboard from "@/components/dashboard/vendor-variants/MedicalDashboard";
import RestaurantDashboard from "@/components/dashboard/vendor-variants/RestaurantDashboard";
import RealEstateDashboard from "@/components/dashboard/vendor-variants/RealEstateDashboard";

export default function VendorDashboardOverview() {
  const { user } = useAuth();
  
  // Logic to determine macro category based on roles
  const roles = user?.roles || (user?.role ? [user.role] : []);
  
  const isRealEstate = roles.some(r => ['builder', 'architect', 'interior_designer', 'contractor', 'supplier', 'material_supplier'].includes(r));
  const isService = roles.some(r => ['worker', 'skilled_worker', 'plumber', 'electrician', 'mechanic', 'cleaner'].includes(r));
  const isMedical = roles.some(r => ['doctor', 'hospital', 'clinic', 'dentist'].includes(r));
  const isRestaurant = roles.some(r => ['restaurant', 'cafe', 'bakery', 'food'].includes(r));

  if (isMedical) return <MedicalDashboard user={user} />;
  if (isRestaurant) return <RestaurantDashboard user={user} />;
  if (isRealEstate) return <RealEstateDashboard user={user} />;
  if (isService) return <ServiceDashboard user={user} />;
  
  // Fallback generic business
  return <GenericVendorDashboard user={user} />;
}
