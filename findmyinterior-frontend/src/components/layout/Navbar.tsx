"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { 
  MapPin, 
  Search, 
  ChevronDown, 
  ClipboardList, 
  Sofa, 
  Building2, 
  HardHat, 
  Hammer, 
  Truck, 
  Home, 
  Building, 
  Tag, 
  PhoneCall,
  Smartphone,
  UserPlus,
  HelpCircle,
  Menu,
  Briefcase,
  Bell,
  MessageCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShieldAlert,
  Moon,
  Sun,
  X,
  User,
  LocateFixed,
  Loader2,
  LogIn,
  UserPlus
} from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { SmartSearch } from "./SmartSearch";

export function Navbar() {
  const { user, logout, _hasHydrated } = useAuthStore();
  const isAuthenticated = !!user;
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileLocationDropdown, setShowMobileLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Patna");
  const [isLocating, setIsLocating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const desktopLocationRef = useRef<HTMLDivElement>(null);
  const mobileLocationRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      const clickedDesktop = desktopLocationRef.current && desktopLocationRef.current.contains(target);
      const clickedMobile = mobileLocationRef.current && mobileLocationRef.current.contains(target);
      
      if (!clickedDesktop && !clickedMobile) {
        setShowMobileLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, { capture: true });
    document.addEventListener("touchstart", handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, { capture: true });
      document.removeEventListener("touchstart", handleClickOutside, { capture: true });
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [router]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    }
    logout();
    closeMobileMenu();
    router.push("/login");
  };

  const handleLocateMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          const data = await response.json();
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.county || data.address.state_district;
            if (city) {
              setSelectedLocation(city);
              setShowMobileLocationDropdown(false);
            }
          }
        } catch (error) {
          console.error("Error fetching city from coordinates", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedLocation && selectedLocation !== "All Bihar") {
      params.set("city", selectedLocation);
    }
    const queryString = params.toString();
    router.push(`/professionals${queryString ? `?${queryString}` : ""}`);
    setShowMobileLocationDropdown(false);
  };

  return (
    <div className="w-full flex flex-col font-sans">
      {/* 1. TOP DARK BAR */}
      <div className="w-full bg-[#0a1c3a] text-white/90 text-xs py-1.5 px-4 hidden md:flex justify-between items-center">
        <div>
          Bihar&apos;s No.1 Home Improvement &amp; Interior Marketplace
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span>Download App</span>
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          {(_hasHydrated || mounted) ? (
            isAuthenticated ? (
              <>
                <Link href="/messages" className="hover:text-white flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Messages</span>
                </Link>
                <Link href="/dashboard" className="hover:text-white flex items-center space-x-1">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="hover:text-white flex items-center space-x-1">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
                {(user?.isAdmin || user?.role === 'admin') && (
                  <Link href="/admin" className="hover:text-white flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400">Admin Panel</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/register" className="hover:text-white flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Become a Pro</span>
                </Link>
              </>
            )
          ) : (
            <div className="w-20 h-4 bg-white/10 animate-pulse rounded"></div>
          )}
          <Link href="/help" className="hover:text-white flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help &amp; Support</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="w-full premium-glass sticky top-0 z-50 py-3 px-4 transition-all duration-300">
        <div className="container mx-auto flex flex-col gap-3">
          {/* Desktop Layout (Hidden on Mobile) */}
          <div className="hidden xl:flex items-center justify-between gap-4 w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 group py-2">
              <img src="/logo.jpg" alt="Find My Interior" className="h-16 md:h-24 w-auto transform transition-transform group-hover:scale-105 duration-300 dark:invert dark:hue-rotate-180 dark:mix-blend-screen" />
            </Link>

            {/* Desktop Center Search Container */}
            <div className="flex-1 max-w-2xl relative z-50 flex justify-center" ref={desktopLocationRef}>
              <SmartSearch />
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-3">
              <Link href="/messages" className="relative p-2 text-gray-500 hover:text-[#0a1c3a] transition-colors rounded-full hover:bg-gray-50">
                <MessageCircle className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E8701A] rounded-full ring-2 ring-white"></span>
              </Link>
              
              <NotificationDropdown />
              
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 text-gray-500 hover:text-[#0a1c3a] dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
              
              {(!_hasHydrated && !mounted) ? null : (user && ["homeowner", "customer"].includes(user?.role || "")) ? (
                <Link href={isAuthenticated ? "/dashboard?tab=bids_received" : "/post-requirement"}>
                  <button className="bg-white dark:bg-slate-800 border-2 border-[#0a1c3a] dark:border-slate-600 text-[#0a1c3a] dark:text-white hover:bg-[#0a1c3a] hover:text-white dark:hover:bg-slate-700 text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all h-full flex items-center justify-center whitespace-nowrap">
                    COMPARE BIDS
                  </button>
                </Link>
              ) : ["skilled_worker", "worker"].includes(user?.role || "") ? (
                <Link href="/dashboard">
                  <button className="bg-white dark:bg-slate-800 border-2 border-[#0a1c3a] dark:border-slate-600 text-[#0a1c3a] dark:text-white hover:bg-[#0a1c3a] hover:text-white dark:hover:bg-slate-700 text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all h-full flex items-center justify-center whitespace-nowrap">
                    SEARCH JOBS
                  </button>
                </Link>
              ) : ["admin"].includes(user?.role || "") ? (
                <Link href="/admin">
                  <button className="bg-white dark:bg-slate-800 border-2 border-[#0a1c3a] dark:border-slate-600 text-[#0a1c3a] dark:text-white hover:bg-[#0a1c3a] hover:text-white dark:hover:bg-slate-700 text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all h-full flex items-center justify-center whitespace-nowrap">
                    ADMIN PANEL
                  </button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <button className="bg-white dark:bg-slate-800 border-2 border-[#0a1c3a] dark:border-slate-600 text-[#0a1c3a] dark:text-white hover:bg-[#0a1c3a] hover:text-white dark:hover:bg-slate-700 text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all h-full flex items-center justify-center whitespace-nowrap">
                    APPLY FOR PROJECTS
                  </button>
                </Link>
              )}
              
              {(!user || !['interior_designer', 'interior_company', 'contractor', 'architect', 'supplier', 'material_supplier', 'builder', 'business', 'worker', 'skilled_worker'].includes(user?.role || '')) && (
              <Link href="/post-requirement">
                <button className="bg-gradient-to-r from-[#E8701A] to-[#f08535] hover:from-[#c25a12] hover:to-[#E8701A] text-white flex items-center px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 h-full">
                  <ClipboardList className="w-5 h-5 mr-2.5" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold leading-tight tracking-wide">Post Requirement</span>
                    <span className="text-[0.65rem] leading-tight text-white/90 font-medium">Get Multiple Quotes</span>
                  </div>
                </button>
              </Link>
              )}
              
              {(!_hasHydrated && !mounted) ? null : !isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <button className="text-[#0a1c3a] dark:text-white hover:text-[#E8701A] font-semibold text-sm px-4 py-2 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="bg-[#0a1c3a] dark:bg-white dark:text-[#0a1c3a] hover:bg-[#0a1c3a]/90 text-white text-sm font-semibold px-5 py-2 rounded shadow-sm transition-all h-full flex items-center justify-center">
                      Register
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center px-4 py-2 rounded shadow-sm transition-all h-full ml-2">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold leading-tight">List Your Business</span>
                        <span className="text-[0.65rem] leading-tight text-gray-500 dark:text-gray-400">Grow Your Business</span>
                      </div>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Layout (Visible only on mobile) */}
          <div className="flex xl:hidden flex-col gap-3 w-full pb-1">
            {/* Mobile Top Row: Menu, Logo, Bell */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <button 
                  className="p-1 text-slate-700 dark:text-slate-200"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <Link href="/" className="flex items-center">
                  <img src="/logo.jpg" alt="Find My Interior" className="h-9 w-auto dark:invert dark:hue-rotate-180 dark:mix-blend-screen" />
                </Link>
              </div>
              
              <div className="flex items-center gap-2">
                {(_hasHydrated || mounted) ? (
                  isAuthenticated ? (
                    <>
                      <NotificationDropdown />
                      <Link href="/dashboard" className="p-1.5 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </Link>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Link href="/login">
                        <button className="px-4 py-1.5 bg-[#0a1c3a] dark:bg-white text-white dark:text-[#0a1c3a] font-bold text-xs rounded-full shadow-sm hover:opacity-90 transition-all">
                          Login
                        </button>
                      </Link>
                      <Link href="/register">
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                          Register
                        </button>
                      </Link>
                    </div>
                  )
                ) : null}
              </div>
            </div>
            
            {/* Mobile Search Row */}
            <div className="mt-2" ref={mobileLocationRef}>
              <SmartSearch compact={true} />
            </div>

          </div>
        </div>
      </header>

      {/* 3. SUB NAVBAR */}
      <div className="w-full bg-white/95 dark:bg-[#0a1c3a]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 hidden md:block shadow-sm z-30">
        <div className="container mx-auto">
          <ul className="flex items-center justify-center space-x-8 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
            <li>
              <Link href="/professionals?search=Interior+Designer" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <Sofa className="w-4 h-4 mr-1.5" /> Interior Designers
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Architect" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <Building2 className="w-4 h-4 mr-1.5" /> Architects
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Contractor" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <HardHat className="w-4 h-4 mr-1.5" /> Contractors
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Skilled+Worker" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <Hammer className="w-4 h-4 mr-1.5" /> Skilled Workers
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Supplier" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <Truck className="w-4 h-4 mr-1.5" /> Suppliers
              </Link>
            </li>
            <li>
              <Link href="/projects" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <Home className="w-4 h-4 mr-1.5" /> Projects
              </Link>
            </li>
            <li>
              <Link href="/projects?type=builder" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <Building className="w-4 h-4 mr-1.5" /> Builder Projects <span className="ml-1 text-[10px] bg-red-500 text-white px-1 py-0.5 rounded-sm font-bold leading-none">NEW</span>
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Brand" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <Tag className="w-4 h-4 mr-1.5" /> Brands
              </Link>
            </li>
            <li>
              <Link href="/contact" className="flex items-center hover:text-[#E8701A] hover:-translate-y-0.5 transition-all">
                <PhoneCall className="w-4 h-4 mr-1.5" /> Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        >
          {/* Slide-in drawer */}
          <div
            className="absolute top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-[#0a1c3a] shadow-2xl flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-white/10">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center">
                <img src="/logo.jpg" alt="Find My Interior" className="h-12 w-auto dark:invert dark:hue-rotate-180 dark:mix-blend-screen" />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-4 flex flex-col gap-3">
              {/* Theme Toggle */}
              <div className="flex justify-between items-center mb-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Theme</span>
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 border rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Auth Links */}
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={closeMobileMenu} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-3 font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <LayoutDashboard className="w-5 h-5 text-[#0a1c3a] dark:text-white" /> Dashboard
                  </Link>
                  {(user?.isAdmin || user?.role === 'admin') && (
                    <Link href="/admin" onClick={closeMobileMenu} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg flex items-center gap-3 font-medium hover:bg-red-100 transition-colors">
                      <ShieldAlert className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="p-3 text-red-600 bg-red-50/50 dark:bg-red-900/10 rounded-lg flex items-center gap-3 font-medium text-left hover:bg-red-100 transition-colors w-full">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMobileMenu} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu} className="p-3 bg-[#0a1c3a] text-white rounded-lg font-medium hover:bg-[#1a2c4a] transition-colors flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> Register
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu} className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg font-medium text-center text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                    <Briefcase className="w-4 h-4" /> List Your Business
                  </Link>
                </>
              )}
              
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider px-1">Browse Categories</h3>
              
              <Link href="/professionals?search=Interior+Designer" onClick={closeMobileMenu} className="p-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Sofa className="w-4 h-4 text-[#E8701A]" /> Interior Designers
              </Link>
              <Link href="/professionals?search=Architect" onClick={closeMobileMenu} className="p-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Building2 className="w-4 h-4 text-[#E8701A]" /> Architects
              </Link>
              <Link href="/professionals?search=Contractor" onClick={closeMobileMenu} className="p-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <HardHat className="w-4 h-4 text-[#E8701A]" /> Contractors
              </Link>
              <Link href="/professionals?search=Skilled+Worker" onClick={closeMobileMenu} className="p-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Hammer className="w-4 h-4 text-[#E8701A]" /> Skilled Workers
              </Link>
              <Link href="/professionals?search=Supplier" onClick={closeMobileMenu} className="p-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Truck className="w-4 h-4 text-[#E8701A]" /> Suppliers
              </Link>
              <Link href="/help" onClick={closeMobileMenu} className="p-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <HelpCircle className="w-4 h-4 text-[#E8701A]" /> Help &amp; Support
              </Link>
              <Link href="/contact" onClick={closeMobileMenu} className="p-3 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <PhoneCall className="w-4 h-4 text-[#E8701A]" /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
