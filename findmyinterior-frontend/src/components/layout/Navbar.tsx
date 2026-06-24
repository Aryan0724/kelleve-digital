"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { NotificationDropdown } from "./NotificationDropdown";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/professionals?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/professionals");
    }
  };

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
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <img src="/logo.jpg" alt="Find My Interior" className="h-14 w-auto transform transition-transform group-hover:scale-105 duration-300" />
          </Link>

          {/* Center Search Container */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl items-center bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1.5 shadow-inner transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:border-orange-200">
            <div className="flex items-center px-4 border-r border-gray-300 min-w-[130px] cursor-pointer hover:bg-gray-100/50 rounded-l-lg transition-colors py-1">
              <MapPin className="w-4 h-4 text-[#E8701A] mr-2" />
              <span className="text-sm font-semibold text-gray-700">Patna</span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
            <div className="flex-1 px-4">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, professionals, projects, suppliers..." 
                className="w-full bg-transparent text-sm font-medium outline-none text-gray-800 placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
            <button type="submit" className="flex items-center px-4 border-l border-transparent min-w-[120px] cursor-pointer bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] hover:from-[#E8701A] hover:to-[#c25a12] text-white rounded-lg py-2 transition-all duration-300 transform shadow-sm hover:shadow-md">
              <div className="flex items-center justify-center w-full">
                <Search className="w-4 h-4 mr-2" />
                <span className="text-sm font-bold tracking-wide">SEARCH</span>
              </div>
            </button>
          </form>

          {/* Right Action Buttons */}
          <div className="hidden xl:flex items-center space-x-3">
            <Link href="/messages" className="relative p-2 text-gray-500 hover:text-[#0a1c3a] transition-colors rounded-full hover:bg-gray-50">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E8701A] rounded-full ring-2 ring-white"></span>
            </Link>
            
            <NotificationDropdown />
            
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            
            <Link href={isAuthenticated ? "/dashboard?tab=bids_received" : "/post-requirement"}>
              <button className="bg-white border-2 border-[#0a1c3a] text-[#0a1c3a] hover:bg-[#0a1c3a] hover:text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all h-full flex items-center justify-center">
                COMPARE BIDS
              </button>
            </Link>
            
            <Link href="/post-requirement">
              <button className="bg-gradient-to-r from-[#E8701A] to-[#f08535] hover:from-[#c25a12] hover:to-[#E8701A] text-white flex items-center px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 h-full">
                <ClipboardList className="w-5 h-5 mr-2.5" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold leading-tight tracking-wide">Post Requirement</span>
                  <span className="text-[0.65rem] leading-tight text-white/90 font-medium">Get Multiple Quotes</span>
                </div>
              </button>
            </Link>
            
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="text-[#0a1c3a] hover:text-[#E8701A] font-semibold text-sm px-4 py-2 transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-[#0a1c3a] hover:bg-[#0a1c3a]/90 text-white text-sm font-semibold px-5 py-2 rounded shadow-sm transition-all h-full flex items-center justify-center">
                    Register
                  </button>
                </Link>
                <Link href="/register">
                  <button className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 flex items-center px-4 py-2 rounded shadow-sm transition-all h-full ml-2">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold leading-tight">List Your Business</span>
                      <span className="text-[0.65rem] leading-tight text-gray-500">Grow Your Business</span>
                    </div>
                  </button>
                </Link>
              </div>
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
