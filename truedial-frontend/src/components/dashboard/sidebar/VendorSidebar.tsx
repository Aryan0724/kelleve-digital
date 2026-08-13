'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Store, Ticket, Star, LineChart, CreditCard, UserCircle, Bell, Settings, Megaphone
} from 'lucide-react';
import { useVendorType } from '@/hooks/useVendorType';

export default function VendorSidebar() {
  const pathname = usePathname();
  const config = useVendorType();

  const links = [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "My Business", href: "/dashboard/vendor/profile", icon: Store },
    { label: config.catalogLabel, href: "/dashboard/vendor/catalog", icon: config.catalogIcon },
    { label: "Offers & Coupons", href: "/dashboard/vendor/offers", icon: Ticket },
    { label: config.crmLabel, href: "/dashboard/vendor/crm", icon: config.crmIcon },
    // Inject the unique tabs dynamically right after CRM
    ...config.uniqueTabs,
    { label: "B2B Requirements", href: "/dashboard/vendor/requirements", icon: Store },
    { label: "Marketing Center", href: "/dashboard/vendor/marketing", icon: Megaphone },
    { label: "Reviews", href: "/dashboard/vendor/reputation", icon: Star },
    { label: "Analytics", href: "/dashboard/vendor/analytics", icon: LineChart },
    { label: "Subscription & Billing", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { label: "Staff", href: "/dashboard/vendor/staff", icon: UserCircle },
    { label: "Notifications", href: "/dashboard/vendor/notifications", icon: Bell },
    { label: "Settings", href: "/dashboard/vendor/settings", icon: Settings },
  ];

  return (
    <>
      {links.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link 
            key={item.label + item.href}
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
