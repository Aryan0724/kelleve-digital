"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Briefcase, Plus, MessageCircle, User, LogIn } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !token) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get("/conversations");
        const convs = res.data.data || res.data;
        const isCustomer = user.role === 'customer' || user.role === 'homeowner';
        let count = 0;
        convs.forEach((c: any) => {
          count += isCustomer ? (c.customer_unread_count || 0) : (c.vendor_unread_count || 0);
        });
        setUnreadCount(count);
      } catch (e) {
        // fail silently
      }
    };
    fetchUnread();
  }, [user, token]);

  // Highlight active path
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  // Hide bottom nav on specific chat pages to prevent keyboard/viewport issues
  if (pathname?.startsWith('/messages/') && pathname !== '/messages') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] lg:hidden pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive('/') && pathname === '/' ? 'text-[#E8701A]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
        >
          <Home className={`w-5 h-5 mb-1 ${isActive('/') && pathname === '/' ? 'fill-[#E8701A]/20' : ''}`} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        
        <Link 
          href="/projects" 
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive('/projects') ? 'text-[#E8701A]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
        >
          <Briefcase className={`w-5 h-5 mb-1 ${isActive('/projects') ? 'fill-[#E8701A]/20' : ''}`} />
          <span className="text-[10px] font-medium">Projects</span>
        </Link>
        
        {/* Floating Action Button for Post Project */}
        <div className="relative -top-4 flex flex-col items-center justify-center w-16">
          <Link 
            href="/post-requirement" 
            className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-gradient-to-r from-[#E8701A] to-[#f08535] rounded-full shadow-lg shadow-orange-500/30 text-white active:scale-95 transition-transform border-3 border-white dark:border-slate-900"
            aria-label="Post Project"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </Link>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap mt-1">Post Project</span>
        </div>
        
        <Link 
          href="/messages" 
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive('/messages') ? 'text-[#E8701A]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
        >
          <div className="relative">
            <MessageCircle className={`w-5 h-5 mb-1 ${isActive('/messages') ? 'fill-[#E8701A]/20' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-white flex items-center justify-center bg-[#E8701A] rounded-full border-2 border-white dark:border-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Messages</span>
        </Link>
        
        <button 
          onClick={() => router.push(user ? "/dashboard/profile" : "/login")}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive('/dashboard/profile') || isActive('/profile') ? 'text-[#E8701A]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}`}
        >
          <User className={`w-5 h-5 mb-1 ${isActive('/dashboard/profile') || isActive('/profile') ? 'fill-[#E8701A]/20' : ''}`} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
