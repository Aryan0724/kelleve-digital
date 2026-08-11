'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useTenant } from './TenantContext';

export type Role = 'customer' | 'vendor' | 'admin' | 'guest';

type RoleContextType = {
  activeRole: Role;
  availableRoles: Role[];
  switchRole: (role: Role) => void;
  isVendor: boolean;
  isCustomer: boolean;
  isAdmin: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tenant } = useTenant();
  
  const [activeRole, setActiveRole] = useState<Role>('guest');
  const [availableRoles, setAvailableRoles] = useState<Role[]>(['guest']);

  useEffect(() => {
    if (!user) {
      setActiveRole('guest');
      setAvailableRoles(['guest']);
      return;
    }

    // This would typically come from the user's roles mapped to the current tenant.
    // In our simplified mock or if real auth token contains tenant_roles:
    // For now, if the user exists, default to 'customer'. If they have a 'vendor' role flag, allow both.
    
    const userRoles = (user as any).roles || [];
    const userCategories = (user as any).categories || [];
    const derivedRoles: Role[] = ['customer'];
    
    const roleSlugs = userRoles.map((r: any) => typeof r === 'string' ? r.toLowerCase() : (r.slug || r.name || '').toLowerCase());
    const categorySlugs = userCategories.map((c: any) => typeof c === 'string' ? c.toLowerCase() : (c.slug || c.name || '').toLowerCase());

    // If the user's general role includes vendor or admin
    if (user.role === 'admin' || roleSlugs.includes('admin')) {
      derivedRoles.push('admin');
    }
    
    const isVendorRole = roleSlugs.some((r: string) => ['vendor', 'business', 'professional', 'seller', 'partner', 'restaurant', 'medical', 'service', 'real_estate'].includes(r));
    const hasBusinessCategories = categorySlugs.length > 0;

    if (user.role === 'vendor' || isVendorRole || hasBusinessCategories) {
      derivedRoles.push('vendor');
    }

    setAvailableRoles(derivedRoles);

    // Try to load last active role for this tenant from localStorage
    const savedRole = localStorage.getItem(`activeRole_${tenant}`);
    if (savedRole && derivedRoles.includes(savedRole as Role)) {
      setActiveRole(savedRole as Role);
    } else {
      // Default to vendor if they have it (often preferred for professionals logging in), else customer
      setActiveRole(derivedRoles.includes('vendor') ? 'vendor' : 'customer');
    }
  }, [user, tenant]);

  const switchRole = (role: Role) => {
    if (availableRoles.includes(role)) {
      setActiveRole(role);
      localStorage.setItem(`activeRole_${tenant}`, role);
    }
  };

  const value = {
    activeRole,
    availableRoles,
    switchRole,
    isVendor: activeRole === 'vendor',
    isCustomer: activeRole === 'customer',
    isAdmin: activeRole === 'admin',
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
