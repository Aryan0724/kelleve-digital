'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Store, FileText, Ticket, Users, Briefcase, 
  Megaphone, Star, LineChart, CreditCard, UserCircle, Bell, Settings,
  Stethoscope, CalendarCheck, Utensils, Wrench, ClipboardList
} from 'lucide-react';

type VendorSidebarProps = {
  vendorType: 'medical' | 'restaurant' | 'service' | 'real_estate' | 'general';
};

export default function VendorSidebar({ vendorType }: VendorSidebarProps) {
  const pathname = usePathname();

  let catalogLabel = "Products & Services";
  let catalogIcon = FileText;
  let crmLabel = "CRM & Leads";
  let crmIcon = Users;

  if (vendorType === 'medical') {
    catalogLabel = "Clinic Services";
    catalogIcon = Stethoscope;
    crmLabel = "Appointments";
    crmIcon = CalendarCheck;
  } else if (vendorType === 'restaurant') {
    catalogLabel = "Menu Management";
    catalogIcon = Utensils;
    crmLabel = "Reservations";
    crmIcon = CalendarCheck;
  } else if (vendorType === 'service') {
    catalogLabel = "Service Catalog";
    catalogIcon = Wrench;
    crmLabel = "Service Requests";
    crmIcon = ClipboardList;
  } else if (vendorType === 'real_estate') {
    catalogLabel = "Project Portfolio";
    catalogIcon = Briefcase;
    crmLabel = "High-Value Leads";
    crmIcon = Users;
  }

  const links = [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "My Business", href: "/dashboard/vendor/profile", icon: Store },
    { label: catalogLabel, href: "/dashboard/vendor/catalog", icon: catalogIcon },
    { label: "Offers & Coupons", href: "/dashboard/vendor/offers", icon: Ticket },
    { label: crmLabel, href: "/dashboard/vendor/crm", icon: crmIcon },
    { label: "B2B Requirements", href: "/dashboard/vendor/requirements", icon: Briefcase },
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
