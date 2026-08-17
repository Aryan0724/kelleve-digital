"use client";

import Link from "next/link";
import { LayoutDashboard, Users, MessageSquare, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", href: "/dashboard/vendor", icon: LayoutDashboard },
    { name: "Leads", href: "/dashboard/vendor/leads", icon: Users },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Alerts", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile", href: "/dashboard/vendor/profile", icon: User },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-16 gap-1 ${
                isActive ? "text-[#1E40AF]" : "text-slate-500 hover:text-slate-700"
              } transition-colors`}
            >
              <tab.icon className={`w-6 h-6 ${isActive ? "fill-blue-50/50" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
