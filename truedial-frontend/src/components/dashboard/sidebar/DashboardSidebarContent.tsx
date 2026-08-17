'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import AdminSidebar from './AdminSidebar';
import UserSidebar from './UserSidebar';
import VendorSidebar from './VendorSidebar';

export default function DashboardSidebarContent() {
  const { activeRole } = useRole();

  if (activeRole === 'admin') {
    return <AdminSidebar />;
  }

  if (activeRole === 'customer') {
    return <UserSidebar />;
  }

  return <VendorSidebar />;
}
