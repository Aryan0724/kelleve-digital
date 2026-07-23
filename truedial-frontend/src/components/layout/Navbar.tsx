import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import AutocompleteSearch from "@/components/shared/AutocompleteSearch";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
              <form action={async () => { "use server"; (await cookies()).delete("auth_token"); redirect("/"); }}>
                <button type="submit" className="hover:text-primary transition flex items-center gap-1"><LogOut className="w-4 h-4"/> Logout</button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="hover:text-primary transition">Login / Sign Up</Link>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-background py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-border gap-6">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">T</div>
          <span className="text-2xl font-bold text-navy dark:text-white">truedial</span>
        </Link>
        
        <div className="flex-1 max-w-xl mx-auto hidden md:block">
          <AutocompleteSearch />
        </div>

        <nav className="hidden lg:flex gap-6 text-foreground/80 font-medium whitespace-nowrap">
          <Link href="/" className="text-foreground hover:text-primary transition font-medium">Home</Link>
          <div className="relative group">
            <Link href="/categories" className="text-foreground hover:text-primary transition font-medium flex items-center gap-1">Categories <ChevronDown className="w-4 h-4"/></Link>
          </div>
          <div className="relative group">
            <Link href="/search" className="text-foreground hover:text-primary transition font-medium flex items-center gap-1">Services <ChevronDown className="w-4 h-4"/></Link>
          </div>
          <Link href="/offers" className="text-foreground hover:text-primary transition font-medium">Offers</Link>
          <Link href="/academy" className="text-foreground hover:text-primary transition font-medium">Academy</Link>
          <Link href="#" className="text-foreground hover:text-primary transition font-medium">Podcast</Link>
          <Link href="#" className="text-foreground hover:text-primary transition font-medium">TD News</Link>
          <Link href="#" className="text-foreground hover:text-primary transition font-medium">Contact</Link>
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-foreground font-medium hover:text-primary transition">Login</Link>
              <Link href="/register">
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition">
                  Add Your Business
                </button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard/user">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4"/> Go to Dashboard
              </button>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
