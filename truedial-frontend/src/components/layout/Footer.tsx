import { CheckCircle, Sparkles, Lock, Headphones } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Footer Features */}
      <div className="bg-navy py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex justify-around items-center text-white text-sm flex-wrap gap-4">
          <div className="flex items-center gap-3"><CheckCircle className="text-primary w-6 h-6"/> <span className="font-medium">100%<br/>Verified Businesses</span></div>
          <div className="flex items-center gap-3"><Sparkles className="text-primary w-6 h-6"/> <span className="font-medium">Best<br/>Discounts & Offers</span></div>
          <div className="flex items-center gap-3"><Lock className="text-primary w-6 h-6"/> <span className="font-medium">Secure<br/>& Trusted Platform</span></div>
          <div className="flex items-center gap-3"><Headphones className="text-primary w-6 h-6"/> <span className="font-medium">24x7<br/>Customer Support</span></div>
        </div>
      </div>

      {/* Newsletter & Footer */}
      <footer className="bg-background pt-12 pb-6 px-6 md:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-border pb-8">
            <div>
              <h4 className="font-bold text-navy dark:text-white text-xl mb-1">Stay Updated with TRUEDIAL</h4>
              <p className="text-sm text-muted-foreground">Get the latest offers, business news and platform updates.</p>
            </div>
            <form className="flex" action="#">
              <input type="email" placeholder="Enter your email" className="bg-background text-foreground px-4 py-2 rounded-l focus:outline-none flex-1 border border-border" />
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-r font-medium hover:bg-primary/90 transition">Subscribe</button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">T</div>
                <span className="text-xl font-bold text-navy dark:text-white">truedial</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                TRUEDIAL is India's emerging business growth platform helping businesses grow beyond listing with advanced marketing, technology and consulting solutions.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" className="text-muted-foreground hover:text-primary transition cursor-pointer">Facebook</a>
                <a href="https://instagram.com" target="_blank" className="text-muted-foreground hover:text-primary transition cursor-pointer">Instagram</a>
                <a href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-primary transition cursor-pointer">Twitter</a>
                <a href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-primary transition cursor-pointer">LinkedIn</a>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-navy dark:text-white mb-4 text-sm">Top Categories</h5>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition">Restaurants</li>
                <li className="hover:text-primary cursor-pointer transition">Hotels</li>
                <li className="hover:text-primary cursor-pointer transition">Hospitals</li>
                <li className="hover:text-primary cursor-pointer transition">Education</li>
                <li className="hover:text-primary cursor-pointer transition">Interior & Construction</li>
                <li className="hover:text-primary cursor-pointer transition">More Categories</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-navy dark:text-white mb-4 text-sm">Quick Links</h5>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition"><Link href="/about">About Us</Link></li>
                <li className="hover:text-primary cursor-pointer transition"><Link href="/services">Services</Link></li>
                <li className="hover:text-primary cursor-pointer transition"><Link href="/offers">Offers</Link></li>
                <li className="hover:text-primary cursor-pointer transition"><Link href="/academy">TD Academy</Link></li>
                <li className="hover:text-primary cursor-pointer transition"><Link href="/podcast">Podcast</Link></li>
                <li className="hover:text-primary cursor-pointer transition"><Link href="/td-news">TD News</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-navy dark:text-white mb-4 text-sm">For Businesses</h5>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition"><Link href="/register">Register Business</Link></li>
                <li className="hover:text-primary cursor-pointer transition"><Link href="/login">Business Login</Link></li>
                <li className="hover:text-primary cursor-pointer transition">Marketing Solutions</li>
                <li className="hover:text-primary cursor-pointer transition">Consulting Services</li>
                <li className="hover:text-primary cursor-pointer transition">SMS / WhatsApp Campaign</li>
                <li className="hover:text-primary cursor-pointer transition">Business Resources</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-navy dark:text-white mb-4 text-sm">Support</h5>
              <ul className="space-y-3 text-xs text-muted-foreground mb-6">
                <li className="hover:text-primary cursor-pointer transition">Help Center</li>
                <li className="hover:text-primary cursor-pointer transition">Terms & Conditions</li>
                <li className="hover:text-primary cursor-pointer transition">Privacy Policy</li>
                <li className="hover:text-primary cursor-pointer transition">Refund Policy</li>
                <li className="hover:text-primary cursor-pointer transition"><Link href="/contact">Contact Us</Link></li>
              </ul>
              <h5 className="font-bold text-navy dark:text-white mb-3 text-sm">Download App</h5>
              <div className="flex gap-2">
                <div className="bg-navy text-navy-foreground px-3 py-1.5 rounded cursor-pointer text-xs flex items-center gap-1 hover:bg-navy/80 transition">Play Store</div>
                <div className="bg-navy text-navy-foreground px-3 py-1.5 rounded cursor-pointer text-xs flex items-center gap-1 hover:bg-navy/80 transition">App Store</div>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-6 border-t border-border">
            &copy; 2026 Truedial pvt. ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
