"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, CalendarCheck, Utensils, Wrench, Briefcase, ClipboardList,
  Stethoscope, BarChart2, Megaphone, Star, Tag, CreditCard, Settings,
  FileText, Users, Image, Receipt, BadgeCheck, BookOpen
} from "lucide-react";

interface TabItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string; // e.g. "New", "3"
}

// Tab configuration per macro category
const TAB_SETS: Record<string, TabItem[]> = {
  medical: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "Appointments", href: "/dashboard/vendor/crm", icon: CalendarCheck, badge: "5" },
    { label: "Clinic Services", href: "/dashboard/vendor/catalog", icon: Stethoscope },
    { label: "Analytics", href: "/dashboard/vendor/analytics", icon: BarChart2 },
    { label: "Marketing", href: "/dashboard/vendor/marketing", icon: Megaphone },
    { label: "Offers", href: "/dashboard/vendor/offers", icon: Tag },
    { label: "Patient Reviews", href: "/dashboard/vendor/reputation", icon: Star },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { label: "Verification", href: "/dashboard/vendor/profile", icon: BadgeCheck },
  ],
  restaurant: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "Reservations", href: "/dashboard/vendor/crm", icon: CalendarCheck, badge: "3" },
    { label: "Menu", href: "/dashboard/vendor/catalog", icon: Utensils },
    { label: "Analytics", href: "/dashboard/vendor/analytics", icon: BarChart2 },
    { label: "Happy Hour Offers", href: "/dashboard/vendor/offers", icon: Tag },
    { label: "SMS Marketing", href: "/dashboard/vendor/marketing", icon: Megaphone },
    { label: "Reviews", href: "/dashboard/vendor/reputation", icon: Star },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { label: "Business Profile", href: "/dashboard/vendor/profile", icon: Settings },
  ],
  realestate: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "Project Portfolio", href: "/dashboard/vendor/catalog", icon: Image },
    { label: "Leads Pipeline", href: "/dashboard/vendor/crm", icon: Users, badge: "12" },
    { label: "Analytics", href: "/dashboard/vendor/analytics", icon: BarChart2 },
    { label: "Promotions", href: "/dashboard/vendor/offers", icon: Tag },
    { label: "Marketing", href: "/dashboard/vendor/marketing", icon: Megaphone },
    { label: "Client Reviews", href: "/dashboard/vendor/reputation", icon: Star },
    { label: "Invoices", href: "/dashboard/vendor/invoices", icon: Receipt },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { label: "Verification", href: "/dashboard/vendor/profile", icon: BadgeCheck },
  ],
  service: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "Service Requests", href: "/dashboard/vendor/crm", icon: ClipboardList, badge: "7" },
    { label: "Service Catalog", href: "/dashboard/vendor/catalog", icon: Wrench },
    { label: "Analytics", href: "/dashboard/vendor/analytics", icon: BarChart2 },
    { label: "Offers & Discounts", href: "/dashboard/vendor/offers", icon: Tag },
    { label: "SMS Marketing", href: "/dashboard/vendor/marketing", icon: Megaphone },
    { label: "Reviews", href: "/dashboard/vendor/reputation", icon: Star },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { label: "Profile & Area", href: "/dashboard/vendor/profile", icon: Settings },
  ],
  generic: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "Leads & Inquiries", href: "/dashboard/vendor/crm", icon: Users },
    { label: "Products & Services", href: "/dashboard/vendor/catalog", icon: FileText },
    { label: "Analytics", href: "/dashboard/vendor/analytics", icon: BarChart2 },
    { label: "Manage Offers", href: "/dashboard/vendor/offers", icon: Tag },
    { label: "Marketing (SMS)", href: "/dashboard/vendor/marketing", icon: Megaphone },
    { label: "Reviews & Ratings", href: "/dashboard/vendor/reputation", icon: Star },
    { label: "Invoices", href: "/dashboard/vendor/invoices", icon: Receipt },
    { label: "Academy", href: "/dashboard/vendor/academy", icon: BookOpen },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { label: "Business Profile", href: "/dashboard/vendor/profile", icon: BadgeCheck },
  ],
};

function getMacroCategory(roles: string[]): keyof typeof TAB_SETS {
  if (roles.some(r => ['doctor', 'hospital', 'clinic', 'dentist'].includes(r))) return 'medical';
  if (roles.some(r => ['restaurant', 'cafe', 'bakery', 'food'].includes(r))) return 'restaurant';
  if (roles.some(r => ['builder', 'architect', 'interior_designer', 'contractor', 'supplier', 'material_supplier'].includes(r))) return 'realestate';
  if (roles.some(r => ['worker', 'skilled_worker', 'plumber', 'electrician', 'mechanic', 'cleaner'].includes(r))) return 'service';
  return 'generic';
}

export default function VendorTabBar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const rawRoles = user?.roles || (user?.role ? [user.role] : []);
  // Normalize: roles can be an array of strings or objects with .slug
  const roleStrings: string[] = rawRoles.map((r: any) =>
    typeof r === 'string' ? r : r?.slug || r?.name || ''
  );

  const category = getMacroCategory(roleStrings);
  const tabs = TAB_SETS[category];

  return (
    <div className="bg-card border-b border-border shrink-0">
      <div
        className="flex items-end gap-0 overflow-x-auto scrollbar-none px-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          // Active if exact match or if on a sub-route (except overview which only exact matches)
          const isActive =
            tab.href === "/dashboard/vendor"
              ? pathname === "/dashboard/vendor"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-all duration-150 group shrink-0
                ${isActive
                  ? 'border-[#E8701A] text-[#E8701A]'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }
              `}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#E8701A]' : 'text-muted-foreground group-hover:text-foreground'}`} />
              {tab.label}
              {tab.badge && (
                <span className={`
                  px-1.5 py-0.5 text-[10px] font-bold rounded-full leading-none
                  ${isActive ? 'bg-[#E8701A]/15 text-[#E8701A]' : 'bg-muted text-muted-foreground'}
                `}>
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8701A] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
