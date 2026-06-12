import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 py-12 text-slate-300">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            FindMyInterior<span className="text-orange-500">.</span>
          </h2>
          <p className="text-sm mb-4 text-slate-400">
            Bihar&apos;s largest marketplace connecting homeowners with verified
            interior designers, builders, suppliers, and skilled workers.
          </p>
          <div className="flex items-center gap-3">
            <Link href="#" className="hover:text-white transition-colors" aria-label="Website">
              <Globe className="h-5 w-5" />
            </Link>
            <Link href="mailto:info@findmyinterior.com" className="hover:text-white transition-colors" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/professionals" className="hover:text-white transition-colors">Interior Designers</Link></li>
            <li><Link href="/projects" className="hover:text-white transition-colors">Builder Projects</Link></li>
            <li><Link href="/materials" className="hover:text-white transition-colors">Materials &amp; Suppliers</Link></li>
            <li><Link href="/workers" className="hover:text-white transition-colors">Skilled Workers</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blog &amp; Guides</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">For Businesses</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/register" className="hover:text-white transition-colors">List Your Business</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Vendor Login</Link></li>
            <li><Link href="/post-requirement" className="hover:text-white transition-colors">Post a Requirement</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-orange-400" />
              info@findmyinterior.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-orange-400" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-orange-400" />
              Patna, Bihar 800001
            </li>
          </ul>
        </div>

      </div>

      <div className="container mx-auto px-4 mt-10 pt-6 border-t border-slate-800 text-sm text-center text-slate-500">
        &copy; {new Date().getFullYear()} FindMyInterior.com. All rights reserved.
      </div>
    </footer>
  );
}
