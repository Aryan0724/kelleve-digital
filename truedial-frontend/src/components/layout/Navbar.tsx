import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, Menu, X, Bell, User } from "lucide-react";
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
        <div className="flex items-center gap-6">
          <Link href="/free-listing" className="hover:text-white transition flex items-center gap-1">
            Free Listing <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">New</span>
          </Link>
          <Link href="/advertise" className="hover:text-white transition">Advertise</Link>
          <Link href="/download-app" className="hover:text-white transition">Download App</Link>
        </div>
      </div>

      {/* Main Navbar - White */}
      <header className="bg-white/95 backdrop-blur-md py-3 px-4 md:px-6 xl:px-12 flex justify-between items-center relative z-20">
        
        <div className="flex items-center gap-4 lg:gap-8 flex-1">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img 
              src="/images/logo.jpg" 
              alt="TrueDial Logo" 
              className="h-10 lg:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Search Bar (Hidden on Mobile, shown on Desktop) */}
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
              <button className="text-slate-500 hover:text-[#1E40AF] transition relative p-2 rounded-full hover:bg-slate-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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

        {/* Mobile Actions (Visible < XL) */}
        <div className="flex xl:hidden items-center gap-3 flex-shrink-0 z-50">
          {!isLoggedIn ? (
            <Link href="/login" className="text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-[#E8701A] px-3 py-1.5 rounded-lg shadow-sm">
              Sign In
            </Link>
          ) : (
            <Link href="/dashboard/user" className="p-1.5 text-[#1E40AF] bg-blue-50 rounded-lg border border-blue-100">
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}
          
          <details className="group relative">
            <summary className="list-none cursor-pointer p-1.5 text-[#1E40AF] bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition marker:hidden [&::-webkit-details-marker]:hidden">
              <Menu className="w-6 h-6 group-open:hidden" />
              <X className="w-6 h-6 hidden group-open:block" />
            </summary>
            
            <div className="absolute right-0 top-10 w-64 bg-white shadow-2xl rounded-xl border border-slate-200 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 origin-top-right">
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
                <Link href="/academy" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50">Academy</Link>
                <Link href="/news" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50">News</Link>
                <Link href="/podcast" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50">Podcast</Link>
                <Link href="/free-listing" className="px-4 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50 border-b border-slate-50 bg-orange-50/50">Add Free Listing</Link>
                <Link href="/advertise" className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-50">Advertise</Link>
                
                {isLoggedIn && (
                  <form action={logout} className="px-2 py-2 mt-1 bg-slate-50">
                    <button type="submit" className="w-full text-left px-3 py-2 text-red-600 font-bold hover:bg-red-100 rounded-lg flex items-center gap-2 transition">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </form>
                )}
              </div>
            </div>
          </details>
        </div>
      </header>

      {/* Mobile Search Bar (Visible < LG) */}
      <div className="lg:hidden bg-slate-100 p-3 border-t border-slate-200 shadow-inner relative z-10">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full sm:w-1/3">
            <NavbarLocationPill />
          </div>
          <div className="w-full sm:w-2/3 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
            <AutocompleteSearch />
          </div>
        </div>
      </div>
    </div>
  );
}
