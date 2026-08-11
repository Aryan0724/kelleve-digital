'use client';

import { Home, Search, Heart, MessageSquare, User, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/context/RoleContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { isVendor } = useRole();

  // Hide mobile nav on specific routes (e.g. login, messages chat window)
  if (pathname.includes('/login') || pathname.includes('/register') || pathname.match(/\/messages\/\d+/)) {
    return null;
  }

  const navItems = isVendor ? [
    { icon: Home, label: 'Dashboard', href: '/dashboard/vendor' },
    { icon: Search, label: 'Leads', href: '/dashboard/vendor/crm' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
    { icon: Bell, label: 'Alerts', href: '/dashboard/notifications' },
    { icon: User, label: 'Profile', href: '/dashboard/vendor/profile' },
  ] : [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Heart, label: 'Saved', href: '/dashboard/user' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
    { icon: User, label: 'Account', href: isLoggedIn ? '/dashboard/user/profile' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border z-50 px-6 py-3 safe-area-bottom">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
