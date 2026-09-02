import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 py-12 pb-24 lg:pb-12 text-slate-300">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-8 lg:gap-6">

        <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            <img src="/logo.jpg" alt="Find My Interior" className="h-24 w-auto mb-4 bg-white p-2 rounded-xl" />
          </h2>
          <p className="text-sm mb-4 text-slate-400 max-w-md lg:max-w-none">
            Bihar's largest marketplace connecting homeowners with verified
            interior designers, builders, suppliers, and skilled workers.
          </p>
          <div className="flex items-center gap-3">
            <Link href="#" className="hover:text-white transition-colors" aria-label="Website">
              <Globe className="h-5 w-5" />
            </Link>
            <Link href="mailto:Support@findmyinterior.com" className="hover:text-white transition-colors" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/professionals" className="hover:text-white transition-colors">Interior Designers</Link></li>
            <li><Link href="/projects" className="hover:text-white transition-colors">Builder Projects</Link></li>
            <li><Link href="/materials" className="hover:text-white transition-colors">Materials & Suppliers</Link></li>
            <li><Link href="/workers" className="hover:text-white transition-colors">Skilled Workers</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Guides</Link></li>
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
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 shrink-0 text-orange-400 mt-0.5" />
              <div className="flex flex-col gap-1">
                <a href="mailto:Support@findmyinterior.com" className="break-all hover:text-white transition-colors">Support@findmyinterior.com</a>
                <a href="mailto:Office@findmyinterior.com" className="break-all hover:text-white transition-colors">Office@findmyinterior.com</a>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 shrink-0 text-orange-400 mt-0.5" />
              <div className="flex flex-col gap-1">
                <a href="tel:+917070440365" className="hover:text-white transition-colors">+91 70704 40365</a>
                <a href="tel:+919534900999" className="hover:text-white transition-colors">+91 9534900999</a>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-orange-400 mt-0.5" />
              <a href="https://maps.app.goo.gl/ryn1o8LZRaDzRiys6?g_st=ac" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                2nd Floor, Usha Niketan, Boring Patliputra Rd, Patna, Bihar 800013
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/dispute-resolution" className="hover:text-white transition-colors">Dispute Resolution</Link></li>
          </ul>
        </div>

      </div>

      <div className="container mx-auto px-4 mt-10 pt-6 border-t border-slate-800 text-sm text-center text-slate-500">
        &copy; {new Date().getFullYear()} FindMyInterior.com. All rights reserved.
      </div>
    </footer>
  );
}
