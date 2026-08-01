"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Plus, MessageSquare, User } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function MobileStickyCTA() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 px-6 py-2 pb-safe">
      <div className="flex items-center justify-between">
        
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link href="/projects" className={`flex flex-col items-center gap-1 ${pathname === '/projects' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-medium">Projects</span>
        </Link>

        {/* Floating Action Button for Post Project */}
        <Link href="/post-requirement" className="relative -top-5 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 text-white border-4 border-white dark:border-slate-900">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium text-slate-900 dark:text-slate-300 mt-1">Post Project</span>
        </Link>

        <Link href={user ? "/dashboard/messages" : "/login"} className={`flex flex-col items-center gap-1 ${pathname.includes('/messages') ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium">Messages</span>
        </Link>

        <Link href={user ? "/dashboard/profile" : "/login"} className={`flex flex-col items-center gap-1 ${pathname.includes('/profile') ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>

      </div>
    </div>
  );
}
