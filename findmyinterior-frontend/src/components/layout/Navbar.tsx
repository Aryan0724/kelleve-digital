"use client";

import Link from "next/link";
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
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;

  return (
    <div className="w-full flex flex-col font-sans">
      {/* 1. TOP DARK BAR */}
      <div className="w-full bg-[#0a1c3a] text-white/90 text-xs py-1.5 px-4 hidden md:flex justify-between items-center">
        <div>
          Bihar's No.1 Home Improvement & Interior Marketplace
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span>Download App</span>
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          {isAuthenticated ? (
            <>
              <Link href="/messages" className="hover:text-white flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Messages</span>
              </Link>
              <Link href="/dashboard" className="hover:text-white flex items-center space-x-1">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button onClick={logout} className="hover:text-white flex items-center space-x-1">
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white flex items-center space-x-1">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
              <Link href="/register" className="hover:text-white flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Become a Pro</span>
              </Link>
            </>
          )}
          <Link href="/help" className="hover:text-white flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & Support</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="w-full bg-white border-b border-gray-100 py-3 px-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex flex-col flex-shrink-0">
            <div className="flex items-center text-[#0a1c3a] font-bold text-2xl tracking-tight">
              <span className="text-[#E8701A] mr-1 text-3xl">⌂</span>
              FIND MY INTERIOR
            </div>
            <div className="text-[0.65rem] tracking-[0.2em] text-gray-500 font-medium mt-0.5">
              DREAM • DESIGN • DELIVER
            </div>
          </Link>

          {/* Center Search Container */}
          <div className="hidden lg:flex flex-1 max-w-2xl items-center bg-gray-50 border border-gray-200 rounded-md p-1">
            <div className="flex items-center px-3 border-r border-gray-300 min-w-[120px] cursor-pointer">
              <MapPin className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Patna</span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
            <div className="flex-1 px-3">
              <input 
                type="text" 
                placeholder="Search services, professionals, projects, suppliers..." 
                className="w-full bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center px-3 border-l border-gray-300 min-w-[140px] cursor-pointer bg-[#0a1c3a] text-white rounded-r-md">
              <Link href="/professionals" className="flex items-center w-full py-1.5 px-2">
                <Search className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">Search</span>
              </Link>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden xl:flex items-center space-x-3">
            <Link href="/messages" className="relative p-2 text-gray-500 hover:text-[#0a1c3a] transition-colors rounded-full hover:bg-gray-50">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E8701A] rounded-full ring-2 ring-white"></span>
            </Link>
            
            <button className="relative p-2 text-gray-500 hover:text-[#0a1c3a] transition-colors rounded-full hover:bg-gray-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[0.6rem] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">3</span>
            </button>
            
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            
            <Link href="/professionals">
              <button className="bg-[#0a1c3a] hover:bg-[#0a1c3a]/90 text-white text-sm font-semibold px-5 py-2 rounded shadow-sm transition-all h-full flex items-center justify-center">
                COMPARE NOW
              </button>
            </Link>
            
            <Link href="/post-requirement">
              <button className="bg-[#E8701A] hover:bg-[#E8701A]/90 text-white flex items-center px-4 py-2 rounded shadow-sm transition-all h-full">
                <ClipboardList className="w-4 h-4 mr-2" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold leading-tight">Post Your Requirement</span>
                  <span className="text-[0.65rem] leading-tight text-white/90">Get Multiple Quotes</span>
                </div>
              </button>
            </Link>
            
            {!isAuthenticated && (
              <Link href="/register">
                <button className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 flex items-center px-4 py-2 rounded shadow-sm transition-all h-full">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold leading-tight">List Your Business</span>
                    <span className="text-[0.65rem] leading-tight text-gray-500">Grow Your Business</span>
                  </div>
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="xl:hidden">
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>

        </div>
      </header>

      {/* 3. SUB NAVBAR */}
      <div className="w-full bg-white border-b border-gray-100 hidden md:block shadow-sm">
        <div className="container mx-auto">
          <ul className="flex items-center justify-center space-x-8 py-3 text-sm font-medium text-gray-600">
            <li>
              <Link href="/professionals?search=Interior+Designer" className="flex items-center hover:text-[#E8701A] transition-colors">
                <Sofa className="w-4 h-4 mr-1.5" /> Interior Designers
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Architect" className="flex items-center hover:text-[#E8701A] transition-colors">
                <Building2 className="w-4 h-4 mr-1.5" /> Architects
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Contractor" className="flex items-center hover:text-[#E8701A] transition-colors">
                <HardHat className="w-4 h-4 mr-1.5" /> Contractors
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Skilled+Worker" className="flex items-center hover:text-[#E8701A] transition-colors">
                <Hammer className="w-4 h-4 mr-1.5" /> Skilled Workers
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Supplier" className="flex items-center hover:text-[#E8701A] transition-colors">
                <Truck className="w-4 h-4 mr-1.5" /> Suppliers
              </Link>
            </li>
            <li>
              <Link href="/projects" className="flex items-center hover:text-[#E8701A] transition-colors">
                <Home className="w-4 h-4 mr-1.5" /> Projects
              </Link>
            </li>
            <li>
              <Link href="/projects?type=builder" className="flex items-center hover:text-[#E8701A] transition-colors">
                <Building className="w-4 h-4 mr-1.5" /> Builder Projects <span className="ml-1 text-[10px] bg-red-500 text-white px-1 py-0.5 rounded-sm font-bold leading-none">NEW</span>
              </Link>
            </li>
            <li>
              <Link href="/professionals?search=Brand" className="flex items-center hover:text-[#E8701A] transition-colors">
                <Tag className="w-4 h-4 mr-1.5" /> Brands
              </Link>
            </li>
            <li>
              <Link href="/contact" className="flex items-center hover:text-[#E8701A] transition-colors">
                <PhoneCall className="w-4 h-4 mr-1.5" /> Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
