import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import CheckoutClient from './CheckoutClient';

export default function PrivilegeCheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-amber-500 selection:text-black font-sans">
        <Navbar />
        <Suspense fallback={<div className="h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>}>
          <CheckoutClient />
        </Suspense>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
