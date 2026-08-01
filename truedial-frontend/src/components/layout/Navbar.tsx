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
    <>
      {/* Top Header */}
      <div className="bg-navy text-navy-foreground py-2 px-6 flex justify-between items-center text-sm">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">✉ support@truedial.com</span>
          <span className="flex items-center gap-2">📞 95349 00999</span>
        </div>
        <div className="flex gap-6 items-center">
          <span>Download App ▶ 🍎</span>
          {isLoggedIn ? (
            <div className="flex gap-4">
              <Link href="/dashboard/user" className="hover:text-primary transition flex items-center gap-1"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
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

      {/* Main Navbar */}
      <header className="bg-background py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-border gap-6">
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center flex-shrink-0 group py-1">
            <img 
              src="/logo.png" 
              alt="TrueDial - 100% Verified Business Discovery Platform" 
              className="h-14 sm:h-16 md:h-16 w-auto transform transition-transform group-hover:scale-105 duration-300 dark:invert dark:hue-rotate-180 dark:mix-blend-screen" 
            />
          </Link>
          <NavbarLocationPill />
        </div>
        
        <div className="flex-1 max-w-xl mx-auto hidden md:block">
          <AutocompleteSearch />
        </div>

        <nav className="hidden xl:flex items-center gap-5 text-foreground/80 font-medium whitespace-nowrap">
          <Link href="/" className="text-foreground hover:text-primary transition font-medium">Home</Link>
          <Link href="/categories" className="text-foreground hover:text-primary transition font-medium flex items-center gap-1">
            Categories
          </Link>
          <Link href="/offers" className="text-foreground hover:text-primary transition font-medium flex items-center gap-1">
            Offers
            <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">HOT</span>
          </Link>
          <Link href="/dashboard/user" className="text-foreground hover:text-primary transition font-medium flex items-center gap-1">
            Privilege Card
            <span className="px-1.5 py-0.2 bg-amber-500 text-navy font-bold text-[10px] rounded-full">VIP</span>
          </Link>
          <Link href="/consulting" className="text-foreground hover:text-primary transition font-medium">Consulting</Link>
          <Link href="/academy" className="text-foreground hover:text-primary transition font-medium">Academy</Link>
          <Link href="/jobs" className="text-foreground hover:text-primary transition font-medium">Jobs</Link>
          <Link href="/news" className="text-foreground hover:text-primary transition font-medium">News</Link>
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-foreground font-medium hover:text-primary transition">Login</Link>
              <Link href="/register">
                <button className="bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium hover:bg-primary/90 transition shadow-sm">
                  Add Your Business
                </button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/dashboard/user">
                <button className="bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium hover:bg-primary/90 transition flex items-center gap-2 shadow-sm">
                  <LayoutDashboard className="w-4 h-4"/> Go to Dashboard
                </button>
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
