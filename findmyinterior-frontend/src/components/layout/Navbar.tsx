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
  Search,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Smartphone,
  Phone,
  Flame
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
    <div className="w-full flex flex-col font-sans bg-white dark:bg-slate-900 relative z-50">
      
      {/* ── TOP ANNOUNCEMENT BANNER ── */}
      <div className="w-full bg-[#1A1A2E] text-white text-[13px] flex items-center justify-between px-6 py-2 shrink-0">
        {/* Left: Offer */}
        <div className="flex items-center gap-3">
          <span className="bg-[#FF6B00] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            Limited Time Offer
          </span>
          <span className="text-slate-200 font-medium hidden sm:block">
            Get 20% OFF on Premium Plans! Use code{" "}
            <span className="text-white font-black">LAUNCH20</span>
          </span>
        </div>
        {/* Right: Contact + App */}
        <div className="hidden lg:flex items-center gap-6 text-slate-300">
          <span className="flex items-center gap-1.5 font-medium hover:text-white cursor-pointer">
            <Phone className="w-3.5 h-3.5" />
            Call Us Now &nbsp;
            <span className="text-white font-black">9534900999</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium hover:text-white cursor-pointer">
            <Smartphone className="w-3.5 h-3.5" />
            Download App
            <div className="flex gap-1.5 ml-0.5">
              <svg viewBox="0 0 384 512" className="w-3.5 h-3.5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              <svg viewBox="0 0 512 512" className="w-3.5 h-3.5 fill-current"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
            </div>
          </span>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <header className="w-full h-[72px] flex items-center justify-center border-b border-slate-200 dark:border-slate-800 relative">
        <div className="container max-w-[1320px] mx-auto flex items-center justify-between px-4 h-full w-full gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <img
              src="/logo.jpg"
              alt="Find My Interior"
              className="h-12 w-auto transition-transform group-hover:scale-105 duration-300 dark:invert"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-7 text-[14px] font-semibold text-[#374151] dark:text-white">
            <Link
              href="/"
              className="text-[#FF6B00] relative after:content-[''] after:absolute after:-bottom-[26px] after:left-0 after:w-full after:h-[3px] after:bg-[#FF6B00]"
            >
              Home
            </Link>
            <div className="flex items-center gap-1 hover:text-[#FF6B00] cursor-pointer transition-colors">
              <Link href="/professionals">Professionals</Link>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <Link href="/projects" className="hover:text-[#FF6B00] transition-colors">Projects</Link>
            <div className="flex items-center gap-1 hover:text-[#FF6B00] cursor-pointer transition-colors">
              <Link href="/categories">Services</Link>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <Link href="/ideas" className="hover:text-[#FF6B00] transition-colors whitespace-nowrap">Ideas &amp; Inspiration</Link>
            <Link href="/cost-calculator" className="hover:text-[#FF6B00] transition-colors whitespace-nowrap">Cost Calculator</Link>
            <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">Blog</Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden xl:flex items-center gap-4 shrink-0">

            {/* Location Selector */}
            <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#374151] dark:text-white cursor-pointer hover:text-[#FF6B00] transition-colors">
              <MapPin className="w-4 h-4 text-[#FF6B00]" />
              <span>Patna</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Search Icon */}
            <button className="text-slate-500 hover:text-[#FF6B00] transition-colors" title="Search">
              <Search className="w-[20px] h-[20px]" />
            </button>

            {/* Bell */}
            <button className="text-slate-500 hover:text-[#FF6B00] transition-colors relative" title="Notifications">
              <Bell className="w-[20px] h-[20px]" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF6B00] text-white text-[8px] font-black flex items-center justify-center rounded-full">3</span>
            </button>

            {/* Message */}
            <Link href="/messages" className="text-slate-500 hover:text-[#FF6B00] transition-colors" title="Messages">
              <MessageSquare className="w-[20px] h-[20px]" />
            </Link>

            {/* Login / Profile */}
            {(!_hasHydrated && !mounted) ? null : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard/profile" className="text-[14px] font-semibold text-[#374151] dark:text-white hover:text-[#FF6B00] transition-colors">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-[14px] font-semibold text-[#374151] dark:text-white hover:text-[#FF6B00] transition-colors whitespace-nowrap">
                Login / Sign Up
              </Link>
            )}

            {/* CTA Button */}
            <Link 
              href="/post-requirement"
              className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-[14px] px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap"
            >
              <Flame className="w-4 h-4" />
              Post a Project
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="xl:hidden p-2 text-slate-700 dark:text-slate-300 ml-auto"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 xl:hidden" onClick={closeMobileMenu}>
          <div
            className="absolute top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
              <img src="/logo.jpg" alt="Find My Interior" className="h-10 w-auto dark:invert" />
              <button onClick={closeMobileMenu} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <Link href="/" onClick={closeMobileMenu} className="font-bold text-[#FF6B00]">Home</Link>
              <Link href="/professionals" onClick={closeMobileMenu} className="font-bold text-slate-800 dark:text-slate-200">Professionals</Link>
              <Link href="/projects" onClick={closeMobileMenu} className="font-bold text-slate-800 dark:text-slate-200">Projects</Link>
              <Link href="/categories" onClick={closeMobileMenu} className="font-bold text-slate-800 dark:text-slate-200">Services</Link>
              <Link href="/ideas" onClick={closeMobileMenu} className="font-bold text-slate-800 dark:text-slate-200">Ideas & Inspiration</Link>
              <Link href="/cost-calculator" onClick={closeMobileMenu} className="font-bold text-slate-800 dark:text-slate-200">Cost Calculator</Link>
              <Link href="/blog" onClick={closeMobileMenu} className="font-bold text-slate-800 dark:text-slate-200">Blog</Link>
              <hr className="border-slate-200 dark:border-slate-800" />
              {isAuthenticated ? (
                <button onClick={handleLogout} className="font-bold text-red-500 text-left">Logout</button>
              ) : (
                <Link href="/login" onClick={closeMobileMenu} className="font-bold text-slate-800 dark:text-slate-200">Login / Sign Up</Link>
              )}
              <Link 
                href="/post-requirement" 
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold py-3 rounded-lg"
              >
                <Flame className="w-4 h-4" /> Post a Project
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
