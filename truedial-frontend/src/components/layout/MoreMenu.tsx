"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, BookOpen, Mic, Star, Building2, Newspaper, MapPin, Briefcase, CreditCard, Gift, Users, TrendingUp, GraduationCap, Megaphone } from "lucide-react";

const MORE_SECTIONS = [
  {
    title: "🔍 Discover",
    items: [
      { label: "All Categories", href: "/categories", icon: Search },
      { label: "Top Rated Near You", href: "/search?sort=rating", icon: Star },
      { label: "New Listings", href: "/search?sort=newest", icon: TrendingUp },
      { label: "Deals & Offers", href: "/offers", icon: Gift },
    ],
  },
  {
    title: "📚 Learn & Grow",
    items: [
      { label: "TrueDial Academy", href: "/academy", icon: GraduationCap },
      { label: "Growth Podcast", href: "/podcast", icon: Mic },
      { label: "Business News", href: "/news", icon: Newspaper },
      { label: "Success Stories", href: "/news?category=success", icon: Users },
    ],
  },
  {
    title: "💼 For Businesses",
    items: [
      { label: "List Your Business", href: "/free-listing", icon: Building2 },
      { label: "Advertising Plans", href: "/consulting", icon: Megaphone },
      { label: "B2B Requirements", href: "/jobs", icon: Briefcase },
      { label: "Premium Listings", href: "/consulting#premium", icon: Star },
    ],
  },
  {
    title: "💳 Membership",
    items: [
      { label: "Privilege Card Plans", href: "/privilege-card", icon: CreditCard },
      { label: "Partner Businesses", href: "/privilege-card#partners", icon: Building2 },
      { label: "Refer & Earn", href: "/privilege-card#refer", icon: Gift },
    ],
  },
];

const TOP_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune",
  "Chennai", "Kolkata", "Jaipur", "Lucknow", "Surat",
];

export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 px-3 py-1.5 text-[13.5px] font-semibold transition-colors border-b-2 rounded-sm ${
          open
            ? "text-[#1E40AF] border-[#1E40AF] bg-blue-50"
            : "text-slate-600 border-transparent hover:text-[#1E40AF] hover:border-[#1E40AF]/30"
        }`}
      >
        More{" "}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Mega Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-[720px] max-w-[96vw] bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right"
            style={{ minWidth: 480 }}
          >
            {/* 3-col grid for sections */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-slate-100 dark:divide-slate-800">
              {MORE_SECTIONS.map((section) => (
                <div key={section.title} className="p-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {section.title}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-[#1E40AF] dark:hover:text-blue-400 transition-all group"
                          >
                            <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E40AF] transition-colors shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Cities footer strip */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 px-5 py-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Popular Cities
              </p>
              <div className="flex flex-wrap gap-2">
                {TOP_CITIES.map((city) => (
                  <Link
                    key={city}
                    href={`/search?city=${city}`}
                    onClick={() => setOpen(false)}
                    className="text-[12px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full px-3 py-1 hover:bg-[#1E40AF] hover:text-white hover:border-[#1E40AF] transition-all"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
