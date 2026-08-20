/**
 * useMobileVendorNav
 * 
 * Returns the full ordered navigation list for a vendor on mobile,
 * including the dynamic unique tab injected by useVendorType.
 */
import { useVendorType } from './useVendorType';
import {
  LayoutDashboard, Store, FileText, Ticket, Users, Megaphone,
  Star, BarChart3, CreditCard, Bell, Settings, ShoppingBag,
  LucideIcon
} from 'lucide-react-native';

export interface MobileNavItem {
  label: string;
  route: string;
  icon: LucideIcon;
  color: string;
  isUnique?: boolean; // marks the personalized tab
}

export function useMobileVendorNav(): MobileNavItem[] {
  const config = useVendorType();

  const base: MobileNavItem[] = [
    { label: 'Overview',     route: '/dashboard/business/overview',     icon: LayoutDashboard, color: '#3B82F6' },
    { label: 'My Business',  route: '/dashboard/business/profile-edit', icon: Store,           color: '#E8701A' },
    { label: config.catalogLabel, route: '/dashboard/business/catalog', icon: config.catalogIcon as LucideIcon, color: '#8B5CF6' },
    { label: 'Offers',       route: '/dashboard/business/offers',       icon: Ticket,          color: '#F59E0B' },
    { label: config.crmLabel, route: '/dashboard/business/leads',       icon: config.crmIcon as LucideIcon, color: '#10B981' },
  ];

  // Inject the personalized unique tab(s) right after CRM
  const uniqueItems: MobileNavItem[] = config.uniqueTabs.map(t => ({
    label: t.label,
    route: mobileRouteFor(t.href),
    icon: t.icon as LucideIcon,
    color: '#E8701A',
    isUnique: true,
  }));

  const rest: MobileNavItem[] = [
    { label: 'Marketing',    route: '/dashboard/business/marketing',        icon: Megaphone,   color: '#06B6D4' },
    { label: 'Reviews',      route: '/dashboard/business/reviews',          icon: Star,        color: '#EAB308' },
    { label: 'Analytics',    route: '/dashboard/business/analytics',        icon: BarChart3,   color: '#6366F1' },
    { label: 'VIP Cards',    route: '/dashboard/business/privilege-cards',  icon: CreditCard,  color: '#EC4899' },
    { label: 'Subscription', route: '/dashboard/business/subscription',     icon: ShoppingBag, color: '#0F172A' },
    { label: 'Settings',     route: '/dashboard/user/settings',             icon: Settings,    color: '#64748B' },
  ];

  return [...base, ...uniqueItems, ...rest];
}

/**
 * Map web routes to mobile routes
 */
function mobileRouteFor(webHref: string): string {
  const map: Record<string, string> = {
    '/dashboard/vendor/kitchen':      '/dashboard/business/kitchen',
    '/dashboard/vendor/patients':     '/dashboard/business/patients',
    '/dashboard/vendor/staff':        '/dashboard/business/staff',
    '/dashboard/vendor/classes':      '/dashboard/business/classes',
    '/dashboard/vendor/batches':      '/dashboard/business/batches',
    '/dashboard/vendor/housekeeping': '/dashboard/business/housekeeping',
    '/dashboard/vendor/deadlines':    '/dashboard/business/deadlines',
    '/dashboard/vendor/event-calendar': '/dashboard/business/event-calendar',
    '/dashboard/vendor/garage':       '/dashboard/business/garage',
    '/dashboard/vendor/jobs':         '/dashboard/business/jobs',
    '/dashboard/vendor/rfq':          '/dashboard/business/rfq',
    '/dashboard/vendor/site-visits':  '/dashboard/business/site-visits',
    '/dashboard/vendor/tours':        '/dashboard/business/analytics', // fallback
    '/dashboard/vendor/projects':     '/dashboard/business/analytics', // fallback
    '/dashboard/vendor/stock':        '/dashboard/business/catalog',   // fallback
  };
  return map[webHref] ?? '/dashboard/business/overview';
}
