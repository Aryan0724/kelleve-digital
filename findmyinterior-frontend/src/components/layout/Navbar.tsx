"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { 
  Bell,
  MessageSquare,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";

export function Navbar() {
  const { user, logout, _hasHydrated } = useAuthStore();
  const isAuthenticated = !!user;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    }
    logout();
    closeMobileMenu();
    router.push("/login");
  };

  return (
    <div className="w-full flex flex-col font-sans bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative z-50">
      
      {/* MAIN NAVBAR */}
      <header className="w-full h-[88px] flex items-center justify-center relative">
        <div className="container max-w-[1320px] mx-auto flex items-center justify-between px-4 h-full w-full">
          
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <img src="/logo.jpg" alt="Find My Interior" className="h-14 w-auto transform transition-transform group-hover:scale-105 duration-300 dark:invert dark:hue-rotate-180 dark:mix-blend-screen" />
          </Link>

          {/* Desktop Center Links */}
          <nav className="hidden lg:flex flex-1 items-center justify-center space-x-8 text-[15px] font-bold text-[#111827] dark:text-white">
            <Link href="/" className="text-[#FF6B00] relative after:content-[''] after:absolute after:-bottom-[33px] after:left-0 after:w-full after:h-[3px] after:bg-[#FF6B00]">Home</Link>
            <Link href="/professionals" className="hover:text-[#FF6B00] transition-colors">Professionals</Link>
            <Link href="/projects" className="hover:text-[#FF6B00] transition-colors">Projects</Link>
            <Link href="/categories" className="hover:text-[#FF6B00] transition-colors">Services</Link>
            <Link href="/ideas" className="hover:text-[#FF6B00] transition-colors">Ideas</Link>
            <Link href="/cost-calculator" className="hover:text-[#FF6B00] transition-colors">Cost Calculator</Link>
            <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">Blog</Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-6">
            
            <button className="text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] transition-colors relative" title="Notifications">
              <Bell className="w-[22px] h-[22px]" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF6B00] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-[1.5px] border-white dark:border-slate-900">
                3
              </span>
            </button>

            <Link href="/messages" className="text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] transition-colors" title="Messages">
              <MessageSquare className="w-[22px] h-[22px]" />
            </Link>

            {(!_hasHydrated && !mounted) ? null : isAuthenticated ? (
              <div className="flex items-center gap-4 ml-2">
                <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#FF6B00]">
                  <User className="w-[22px] h-[22px]" /> Profile
                </Link>
                <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#FF6B00] ml-2">
                <User className="w-[22px] h-[22px]" /> Profile
              </Link>
            )}

            <Link href="/post-requirement" className="ml-2">
              <button className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-[15px] px-8 py-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                Post Project
              </button>
            </Link>

          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-700 dark:text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 lg:hidden" onClick={closeMobileMenu}>
          <div className="absolute top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
              <img src="/logo.jpg" alt="Find My Interior" className="h-10 w-auto dark:invert" />
              <button onClick={closeMobileMenu} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <Link href="/" className="font-bold text-[#FF6B00]">Home</Link>
              <Link href="/professionals" className="font-bold text-slate-800 dark:text-slate-200">Professionals</Link>
              <Link href="/projects" className="font-bold text-slate-800 dark:text-slate-200">Projects</Link>
              <Link href="/categories" className="font-bold text-slate-800 dark:text-slate-200">Services</Link>
              <hr className="border-slate-200 dark:border-slate-800" />
              {isAuthenticated ? (
                <button onClick={handleLogout} className="font-bold text-red-500 text-left">Logout</button>
              ) : (
                <Link href="/login" className="font-bold text-slate-800 dark:text-slate-200">Login / Sign Up</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
