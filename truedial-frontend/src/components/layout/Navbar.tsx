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
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <Link href="/categories" className="hover:text-primary flex items-center gap-1 transition">Categories <ChevronDown className="w-4 h-4"/></Link>
          <Link href="/services" className="hover:text-primary flex items-center gap-1 transition">Services <ChevronDown className="w-4 h-4"/></Link>
          <Link href="/offers" className="hover:text-primary transition">Offers</Link>
          <Link href="/academy" className="hover:text-primary transition">Academy</Link>
          <Link href="/podcast" className="hover:text-primary transition">Podcast</Link>
          <Link href="/td-news" className="hover:text-primary transition">TD News</Link>
          <Link href="/contact" className="hover:text-primary transition">Contact</Link>
        </nav>
        <Link href="/register">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition">
            Register Business
          </button>
        </Link>
      </header>
    </>
  );
}
