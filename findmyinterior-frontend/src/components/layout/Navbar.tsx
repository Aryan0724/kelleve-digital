"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next/themes";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { 
  MapPin, 
  Search, 
  ChevronDown, 
  Bell,
  MessageSquare,
  LogOut,
  User,
  Phone,
  Apple,
  Smartphone,
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
      
      {/* 1. TOP DARK BAR */}
      <div className="w-full bg-[#111827] text-white text-[13px] py-2 px-4 hidden md:flex justify-center">
        <div className="container max-w-[1320px] mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-3 font-medium">
            <span className="bg-[#FF6B00] text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
              🔥 LIMITED TIME OFFER
            </span>
            <span>Get 20% OFF on Premium Plans! Use code <strong>LAUNCH20</strong></span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <div className="flex items-center gap-1.5">
              <span>Call Us Now</span>
              <Phone className="w-3.5 h-3.5 ml-1" />
              <strong>9534900999</strong>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-3">
              <span>Download App</span>
              <div className="flex items-center gap-1.5 opacity-80">
                <Apple className="w-4 h-4 hover:opacity-100 transition-opacity cursor-pointer fill-current" />
                <Smartphone className="w-4 h-4 hover:opacity-100 transition-opacity cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="w-full h-[88px] flex items-center justify-center relative">
        <div className="container max-w-[1320px] mx-auto flex items-center justify-between px-4 h-full w-full">
          
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            {/* Replacing image with text styled to match "Find My Interior .com" with icon for exact layout feel since exact image might not be matching perfectly */}
            <img src="/logo.jpg" alt="Find My Interior" className="h-14 w-auto transform transition-transform group-hover:scale-105 duration-300 dark:invert dark:hue-rotate-180 dark:mix-blend-screen" />
          </Link>

          {/* Desktop Center Links */}
          <nav className="hidden lg:flex flex-1 items-center justify-center space-x-8 text-sm font-bold text-[#111827] dark:text-white">
            <Link href="/" className="text-[#FF6B00] relative after:content-[''] after:absolute after:-bottom-[33px] after:left-0 after:w-full after:h-[3px] after:bg-[#FF6B00]">Home</Link>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#FF6B00] transition-colors">
              Professionals <ChevronDown className="w-4 h-4" />
            </div>
            <Link href="/projects" className="hover:text-[#FF6B00] transition-colors">Projects</Link>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#FF6B00] transition-colors">
              Services <ChevronDown className="w-4 h-4" />
            </div>
            <Link href="/ideas" className="hover:text-[#FF6B00] transition-colors">Ideas & Inspiration</Link>
            <Link href="/cost-calculator" className="hover:text-[#FF6B00] transition-colors">Cost Calculator</Link>
            <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">Blog</Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-5">
            
            <div className="flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 hover:border-[#FF6B00] transition-colors">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-[#111827] dark:text-white">Patna</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>

            <button className="text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <button className="text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF6B00] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-[1.5px] border-white dark:border-slate-900">
                3
              </span>
            </button>

            <Link href="/messages" className="text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] transition-colors">
              <MessageSquare className="w-5 h-5" />
            </Link>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

            {(!_hasHydrated && !mounted) ? null : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm font-bold hover:text-[#FF6B00]">
                  <User className="w-4 h-4" /> Account
                </Link>
                <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-bold text-[#111827] dark:text-white hover:text-[#FF6B00] transition-colors">
                Login / Sign Up
              </Link>
            )}

            <Link href="/post-requirement">
              <button className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-sm px-6 py-2.5 rounded shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 whitespace-nowrap">
                Post a Project
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
