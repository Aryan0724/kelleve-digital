import Link from "next/link";
import { ChevronDown, SearchIcon } from "lucide-react";

export default function Navbar() {
  return (
    <>
      {/* Top Header */}
      <div className="bg-navy text-navy-foreground py-2 px-6 flex justify-between items-center text-sm">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">✉ support@truedial.com</span>
          <span className="flex items-center gap-2">📞 95349 00999</span>
        </div>
        <div className="flex gap-6">
          <span>Download App ▶ 🍎</span>
          <Link href="/login" className="hover:text-primary transition">Login / Sign Up</Link>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-background py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">T</div>
          <span className="text-2xl font-bold text-navy dark:text-white">truedial</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-foreground/80 font-medium">
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
          <Link href="/login" className="text-foreground font-medium hover:text-primary transition">Login</Link>
          <Link href="/register">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition">
              Add Your Business
            </button>
          </Link>
        </div>
      </header>
    </>
  );
}
