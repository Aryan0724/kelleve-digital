import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import AutocompleteSearch from "@/components/shared/AutocompleteSearch";
import NavbarLocationPill from "@/components/shared/NavbarLocationPill";
import { cookies } from "next/headers";
import { logout } from "@/app/actions/auth";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const isLoggedIn = !!token;
  return (
    <header className="bg-white py-3 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8701A] text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="text-2xl font-black tracking-tight text-[#1E40AF]">
            truedial
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden xl:flex items-center gap-6 text-[#1E40AF] font-bold text-sm">
        <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition border-b-2 border-[#1E40AF] pb-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
          Home
        </Link>
        <Link href="/search" className="hover:text-blue-600 transition text-slate-700">Find Business</Link>
        <Link href="/privilege-card" className="hover:text-blue-600 transition text-slate-700">Privilege Card</Link>
        <Link href="/academy" className="hover:text-blue-600 transition text-slate-700">Academy</Link>
        <Link href="/news" className="hover:text-blue-600 transition text-slate-700">News</Link>
        <Link href="/podcast" className="hover:text-blue-600 transition text-slate-700">Podcast</Link>
        <div className="flex items-center gap-1 hover:text-blue-600 transition text-slate-700 cursor-pointer">
          More <ChevronDown className="w-4 h-4" />
        </div>
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <Link href="/login">
            <button className="hidden sm:flex items-center gap-2 bg-blue-50 text-[#1E40AF] border border-[#1E40AF]/30 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Login / Sign Up
            </button>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/dashboard/user">
              <button className="hidden sm:flex items-center gap-2 bg-blue-50 text-[#1E40AF] border border-[#1E40AF]/30 px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-100 transition">
                <LayoutDashboard className="w-4 h-4"/> Dashboard
              </button>
            </Link>
            <form action={logout}>
              <button type="submit" className="text-slate-600 hover:text-red-500 transition p-2">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
        
        {/* Hamburger Menu */}
        <button className="text-[#1E40AF] p-1 xl:hidden">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <button className="text-[#1E40AF] p-1 hidden xl:block">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </header>
  );
}
