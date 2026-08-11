'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import AdminSidebar from './AdminSidebar';
import UserSidebar from './UserSidebar';
import VendorSidebar from './VendorSidebar';

export default function DashboardSidebarContent() {
  const { user } = useAuth();
  const { activeRole } = useRole();

  if (activeRole === 'admin') {
    return <AdminSidebar />;
  }

  if (activeRole === 'customer') {
    return <UserSidebar />;
  }

  // Determine vendor type
  const rawRoles = user?.roles || (user?.role ? [user.role] : []);
  const roleSlugs = rawRoles.map((r: any) => typeof r === 'string' ? r : (r.slug || r.name || '')).map((s: string) => s.toLowerCase());
  const categorySlugs = user?.categories?.map((c: string) => c.toLowerCase()) || [];

  const isRealEstate = categorySlugs.some((c: string) => ['builder', 'architect', 'interior_designer', 'contractor', 'supplier', 'material_supplier'].includes(c)) || roleSlugs.some((r: string) => ['builder', 'architect', 'interior_designer', 'contractor', 'supplier', 'material_supplier'].includes(r));
  const isService = categorySlugs.some((c: string) => ['worker', 'skilled_worker', 'plumber', 'electrician', 'mechanic', 'cleaner'].includes(c)) || roleSlugs.some((r: string) => ['worker', 'skilled_worker', 'plumber', 'electrician', 'mechanic', 'cleaner'].includes(r));
  const isMedical = categorySlugs.some((c: string) => ['doctor', 'hospital', 'clinic', 'dentist'].includes(c)) || roleSlugs.some((r: string) => ['doctor', 'hospital', 'clinic', 'dentist'].includes(r));
  const isRestaurant = categorySlugs.some((c: string) => ['restaurant', 'cafe', 'bakery', 'food'].includes(c)) || roleSlugs.some((r: string) => ['restaurant', 'cafe', 'bakery', 'food'].includes(r));

  let vendorType: 'medical' | 'restaurant' | 'service' | 'real_estate' | 'general' = 'general';
  
  if (isMedical) vendorType = 'medical';
  else if (isRestaurant) vendorType = 'restaurant';
  else if (isService) vendorType = 'service';
  else if (isRealEstate) vendorType = 'real_estate';

  return <VendorSidebar vendorType={vendorType} />;
}
