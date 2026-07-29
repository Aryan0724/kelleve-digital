'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated) {
        router.replace('/login?redirect=/dashboard');
        return;
      }

      // Check role and redirect to the specific dashboard
      const hasVendorRole = user?.roles?.some((r: any) => 
        ['business', 'builder', 'supplier', 'worker', 'contractor', 'architect', 'interior_designer', 'skilled_worker', 'material_supplier'].includes(r.slug)
      );
      
      const hasAdminRole = user?.roles?.some((r: any) => 
        ['admin', 'super_admin'].includes(r.slug)
      );

      if (hasAdminRole) {
        router.replace('/dashboard/admin');
      } else if (hasVendorRole) {
        router.replace('/dashboard/vendor/profile');
      } else {
        router.replace('/dashboard/user');
      }
    }
  }, [isMounted, isAuthenticated, user, router]);

  if (!isMounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
