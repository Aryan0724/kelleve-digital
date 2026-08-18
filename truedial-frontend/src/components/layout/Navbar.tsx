import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, MessageSquare, Menu, X, Bell, User } from "lucide-react";
import AutocompleteSearch from "@/components/shared/AutocompleteSearch";
import NavbarLocationPill from "@/components/shared/NavbarLocationPill";
import { cookies } from "next/headers";
import { logout } from "@/app/actions/auth";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const isLoggedIn = !!token;
  
  return (
    <div className="w-full flex flex-col z-50 sticky top-0 shadow-sm border-b border-slate-200">
      {/* Top Utility Bar - Dark Navigation Bar */}
      <div className="hidden md:flex bg-[#0F172A] text-slate-300 py-1.5 px-6 xl:px-12 justify-between items-center text-xs font-medium border-b border-slate-800">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 hover:text-white cursor-pointer transition">
            English <ChevronDown className="w-3 h-3" />
          </span>
          <span className="hover:text-white cursor-pointer transition">Customer Care</span>
        </div>
        <div className="flex gap-6 items-center">
          <span>Download App ▶ 🍎</span>
          {isLoggedIn ? (
            <div className="flex gap-4">
              <Link href="/dashboard/user" className="hover:text-primary transition flex items-center gap-1"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
              <Link href="/messages" className="hover:text-primary transition flex items-center gap-1"><MessageSquare className="w-4 h-4"/> Messages</Link>
              <form action={logout}>
          <button type="submit" className="hover:text-primary transition flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </form>
            </div>
          ) : (
            <Link href="/login" className="hover:text-primary transition">Login / Sign Up</Link>
          )}
        </div>
      </div>

      {/* Main Navbar - White */}
      <header className="bg-white py-2 lg:py-3 px-4 md:px-6 xl:px-12 flex justify-between items-center relative z-20 shadow-sm lg:shadow-none">
        
        {/* === MOBILE HEADER (< LG) === */}
        <div className="flex lg:hidden w-full items-center justify-between">
          <details className="group relative">
            <summary className="list-none cursor-pointer p-1 text-slate-700 hover:text-[#1E40AF] transition marker:hidden [&::-webkit-details-marker]:hidden">
              <Menu className="w-6 h-6 group-open:hidden" />
              <X className="w-6 h-6 hidden group-open:block" />
            </summary>
            
            <div className="absolute left-0 top-10 w-64 bg-white shadow-2xl rounded-xl border border-slate-200 overflow-hidden z-[100] animate-in fade-in slide-in-from-left-2 origin-top-left">
              <div className="p-4 bg-[#0F172A] text-white">
                <h3 className="font-bold text-lg mb-1">TrueDial Menu</h3>
                <p className="text-xs text-slate-400">Navigate to all features</p>
              </div>
              <div className="flex flex-col py-1">
                <Link href="/" className="px-4 py-3 text-sm font-semibold text-[#1E40AF] hover:bg-blue-50 border-b border-slate-50 flex justify-between items-center">
                  Home <ChevronDown className="w-4 h-4 opacity-50 -rotate-90" />
                </Link>
                <Link href="/offers" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50 flex justify-between items-center">
                  <span className="flex items-center gap-2">Offers <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm">HOT</span></span>
                  <ChevronDown className="w-4 h-4 opacity-50 -rotate-90" />
                </Link>
                <Link href="/privilege-card" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50 flex justify-between items-center">
                  <span className="flex items-center gap-2">Privilege Card <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm">VIP</span></span>
                  <ChevronDown className="w-4 h-4 opacity-50 -rotate-90" />
                </Link>
                <Link href="/free-listing" className="px-4 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50 border-b border-slate-50 bg-orange-50/50">Add Free Listing</Link>
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard/user" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50">Dashboard</Link>
                    <form action={logout} className="px-2 py-2 mt-1 bg-slate-50">
                      <button type="submit" className="w-full text-left px-3 py-2 text-red-600 font-bold hover:bg-red-100 rounded-lg flex items-center gap-2 transition">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link href="/login" className="px-4 py-3 text-sm font-bold text-[#1E40AF] hover:bg-blue-50 border-b border-slate-50">Sign In</Link>
                )}
              </div>
            </div>
          </details>

          <Link href="/" className="flex items-center justify-center flex-1">
            <img 
              src="/images/logo-official.png" 
              alt="TrueDial Logo" 
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3 text-slate-700">
            <MessageSquare className="w-5 h-5 cursor-pointer hover:text-[#1E40AF]" />
            <div className="relative cursor-pointer hover:text-[#1E40AF]">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex justify-center items-center text-[8px] text-white font-bold">3</span>
            </div>
          </div>
        </div>

        {/* === DESKTOP HEADER (>= LG) === */}
        <div className="hidden lg:flex items-center gap-4 lg:gap-8 flex-1">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img 
              src="/images/logo-official.png" 
              alt="TrueDial Logo" 
              className="h-10 lg:h-12 max-w-[160px] lg:max-w-[200px] w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl items-center bg-slate-50 border border-slate-300 rounded-lg p-1 shadow-inner focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-orange-400 transition-all">
            <div className="flex-shrink-0 flex items-center h-full px-2">
              <NavbarLocationPill />
            </div>
            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            <div className="flex-1">
              <AutocompleteSearch />
            </div>
          </div>
        </div>

        {/* Right Side Desktop Actions */}
        <div className="hidden xl:flex items-center gap-5 ml-8 flex-shrink-0">
          <nav className="flex items-center gap-5 text-[#1E40AF] font-bold text-[13px]">
            <Link href="/" className="hover:text-orange-600 transition border-b-2 border-transparent hover:border-orange-600 pb-1">Home</Link>
            <Link href="/offers" className="flex items-center gap-1 hover:text-orange-600 transition relative border-b-2 border-transparent hover:border-orange-600 pb-1">
              Offers
              <span className="absolute -top-3 -right-6 bg-red-500 text-white text-[9px] px-1 rounded-sm shadow-sm animate-pulse">HOT</span>
            </Link>
            <Link href="/privilege-card" className="flex items-center gap-1 hover:text-orange-600 transition relative border-b-2 border-transparent hover:border-orange-600 pb-1">
              Privilege Card
              <span className="absolute -top-3 -right-4 bg-amber-500 text-white text-[9px] px-1 rounded-sm shadow-sm">VIP</span>
            </Link>
            <Link href="/academy" className="hover:text-orange-600 transition border-b-2 border-transparent hover:border-orange-600 pb-1">Academy</Link>
            <Link href="/news" className="hover:text-orange-600 transition text-slate-600 border-b-2 border-transparent hover:border-orange-600 pb-1">News</Link>
          </nav>

          <div className="h-6 w-px bg-slate-300"></div>

          {!isLoggedIn ? (
            <Link href="/login">
              <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-[#E8701A] text-white px-5 py-2 rounded-lg font-bold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md">
                <User className="w-4 h-4" />
                Sign In
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/dashboard/user">
                <button className="flex items-center gap-2 bg-slate-50 text-[#1E40AF] border border-slate-200 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition shadow-sm hover:border-[#1E40AF]/30">
                  <LayoutDashboard className="w-4 h-4"/> Dashboard
                </button>
              </Link>
              <form action={logout}>
                <button type="submit" className="text-slate-400 hover:text-red-500 transition p-2 bg-slate-50 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100">
                  <LogOut className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
