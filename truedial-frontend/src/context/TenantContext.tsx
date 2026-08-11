'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type TenantContextType = {
  tenant: string;
  isFindMyInterior: boolean;
  isTrueDial: boolean;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<string>('truedial'); // Default to truedial in this app

  useEffect(() => {
    // In a real scenario, this might come from environment variables or hostname
    // Example: window.location.hostname.includes('findmyinterior') ? 'findmyinterior' : 'truedial'
    const currentTenant = process.env.NEXT_PUBLIC_TENANT_ID || 'truedial';
    setTenant(currentTenant);
  }, []);

  const value = {
    tenant,
    isFindMyInterior: tenant === 'findmyinterior',
    isTrueDial: tenant === 'truedial',
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
