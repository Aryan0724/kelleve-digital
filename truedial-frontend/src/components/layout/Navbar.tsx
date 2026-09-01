import Link from "next/link";
import {
  LayoutDashboard, LogOut, Menu, X, User, Sparkles
} from "lucide-react";
import { cookies } from "next/headers";
import MoreMenu from "./MoreMenu";
import { logout } from "@/app/actions/auth";
import LocationDisplay from "./LocationDisplay";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const isLoggedIn = !!token;

  return (
    <header className="w-full z-50 sticky top-0 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-2.5 flex items-center justify-between gap-4">

        {/* ── Logo & Location ── */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 group py-1">
            <img
              src="/truedial-logo.png"
              alt="TrueDial 100% Verified"
              className="h-10 md:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <LocationDisplay />
        </div>

        {/* ── Center Nav Links (Desktop only) ── */}
        <nav className="hidden lg:flex items-center justify-center flex-1 gap-1 text-[13.5px] font-semibold text-slate-600">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[#1E40AF] border-b-2 border-[#1E40AF] font-bold"
          >
            {/* Home icon */}
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3l8 6v12h-5v-7H9v7H4V9l8-6z" />
            </svg>
            Home
          </Link>
          <Link href="/search"         className="px-3 py-1.5 hover:text-[#1E40AF] transition-colors border-b-2 border-transparent hover:border-[#1E40AF]/30 rounded-sm">Find Business</Link>
          <Link href="/pricing"        className="px-3 py-1.5 hover:text-[#1E40AF] transition-colors border-b-2 border-transparent hover:border-[#1E40AF]/30 rounded-sm text-[#E8701A] font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Pricing</Link>
          <Link href="/privilege-card" className="px-3 py-1.5 hover:text-[#1E40AF] transition-colors border-b-2 border-transparent hover:border-[#1E40AF]/30 rounded-sm">Privilege Card</Link>
          <Link href="/academy"        className="px-3 py-1.5 hover:text-[#1E40AF] transition-colors border-b-2 border-transparent hover:border-[#1E40AF]/30 rounded-sm">Academy</Link>
          <Link href="/news"           className="px-3 py-1.5 hover:text-[#1E40AF] transition-colors border-b-2 border-transparent hover:border-[#1E40AF]/30 rounded-sm">News</Link>
          <Link href="/podcast"        className="px-3 py-1.5 hover:text-[#1E40AF] transition-colors border-b-2 border-transparent hover:border-[#1E40AF]/30 rounded-sm">Podcast</Link>
          <MoreMenu />
        </nav>

        {/* ── Right: Login + Hamburger ── */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Login / Dashboard button */}
          {!isLoggedIn ? (
            <Link href="/login">
              <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 text-[#1E40AF] px-4 py-2 rounded-full font-bold text-[13px] hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm">
                <User className="w-4 h-4" />
                Login / Sign Up
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/dashboard/user">
                <button className="hidden sm:flex items-center gap-1.5 bg-slate-50 text-[#1E40AF] border border-slate-200 px-4 py-2 rounded-full font-bold text-[13px] hover:bg-blue-50 transition shadow-sm">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-slate-400 hover:text-red-500 transition p-2 bg-slate-50 rounded-full hover:bg-red-50 border border-transparent hover:border-red-100 hidden sm:flex"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* Hamburger */}
          <details className="group relative">
            <summary className="list-none cursor-pointer p-2 text-slate-600 hover:text-[#1E40AF] hover:bg-blue-50 rounded-lg transition marker:hidden [&::-webkit-details-marker]:hidden">
              <Menu className="w-5 h-5 group-open:hidden" />
              <X    className="w-5 h-5 hidden group-open:block" />
            </summary>

            <div className="absolute right-0 top-12 w-64 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 origin-top-right">
              <div className="flex flex-col py-1">
                {/* Mobile-only nav links */}
                <div className="lg:hidden">
                  <Link href="/"              className="px-4 py-3 text-sm font-bold text-[#1E40AF] hover:bg-blue-50 border-b border-slate-50 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3l8 6v12h-5v-7H9v7H4V9l8-6z" /></svg>
                    Home
                  </Link>
                  <Link href="/search"         className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50 block">Find Business</Link>
                  <Link href="/pricing"        className="px-4 py-3 text-sm font-bold text-[#E8701A] hover:bg-slate-50 border-b border-slate-50 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Pricing Plans</Link>
                  <Link href="/privilege-card" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50 block">Privilege Card</Link>
                  <Link href="/academy"        className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50 block">Academy</Link>
                  <Link href="/news"           className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50 block">News</Link>
                  <Link href="/podcast"        className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50 block">Podcast</Link>
                </div>

                <Link href="/free-listing" className="px-4 py-3 text-sm font-bold text-[#EA580C] hover:bg-orange-50 border-b border-slate-50 bg-orange-50/40">
                  Add Free Listing
                </Link>

                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard/user" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50 sm:hidden block">Dashboard</Link>
                    <form action={logout} className="px-2 py-2 mt-1 bg-slate-50 sm:hidden">
                      <button type="submit" className="w-full text-left px-3 py-2 text-red-600 font-bold hover:bg-red-100 rounded-lg flex items-center gap-2 transition">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link href="/login" className="px-4 py-3 text-sm font-bold text-[#1E40AF] hover:bg-blue-50 border-b border-slate-50 sm:hidden block">Sign In</Link>
                )}
              </div>
            </div>
          </details>

        </div>
      </div>
    </header>
  );
}
