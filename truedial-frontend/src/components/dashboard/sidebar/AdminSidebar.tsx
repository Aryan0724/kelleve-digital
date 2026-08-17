'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldAlert, FileText, Settings } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Vendors", href: "/dashboard/admin/vendors", icon: ShieldAlert },
    { label: "Approvals", href: "/dashboard/admin/approvals", icon: FileText },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  return (
    <>
      {links.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition ${
              isActive 
                ? 'bg-white/10 text-white font-medium shadow-inner' 
                : 'text-navy-foreground/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} /> {item.label}
          </Link>
        );
      })}
    </>
  );
}
