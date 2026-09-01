'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, ShieldAlert, FileText, Settings, 
  Banknote, FileImage, Headphones, LineChart, LogOut, ChevronLeft, Globe, Menu, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

const ADMIN_TABS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Vendors', path: '/admin/vendors', icon: ShieldAlert },
  { name: 'Inquiries', path: '/admin/inquiries', icon: FileText },
  { name: 'Finances', path: '/admin/finances', icon: Banknote },
  { name: 'Content', path: '/admin/content', icon: FileImage },
  { name: 'Support', path: '/admin/support', icon: Headphones },
  { name: 'Analytics', path: '/admin/analytics', icon: LineChart },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, clearUser } = useAuth();
  const { isAdmin } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You do not have administrative privileges.</p>
          <Link href="/" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row overflow-hidden">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-navy text-white p-4 flex items-center justify-between z-50 relative shadow-md">
          <div className="flex items-center gap-2">
            <img src="/truedial-logo.png" alt="TrueDial" className="h-6 brightness-0 invert" />
            <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded">ADMIN</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative z-40 w-64 h-screen bg-navy text-white transition-transform duration-300 flex flex-col shrink-0`}>
          <div className="p-6 hidden md:block">
            <div className="flex items-center gap-2 mb-8">
              <img src="/truedial-logo.png" alt="TrueDial" className="h-8 brightness-0 invert" />
              <span className="text-[10px] font-bold tracking-wider bg-red-500 text-white px-1.5 py-0.5 rounded uppercase">Admin</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4 md:pt-0 pb-20 md:pb-0">
            {ADMIN_TABS.map((tab) => {
              const isActive = pathname === tab.path || pathname.startsWith(`${tab.path}/`);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{tab.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 mt-auto bg-navy">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-white/50 truncate">{user?.email || 'admin@truedial.com'}</p>
              </div>
            </div>
            
            <Link 
              href="/" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full mb-1"
            >
              <Globe className="w-4 h-4" /> <span className="text-sm">Main Website</span>
            </Link>
            
            <button
              onClick={async () => {
                clearUser();
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/login");
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" /> <span className="text-sm">Secure Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-screen overflow-y-auto bg-background p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto animate-fade-in-up pb-20">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
