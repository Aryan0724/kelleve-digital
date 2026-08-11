"use client";

import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import { Sparkles, MapPin, Search, ArrowRight, Building2, Store, Users, FileText, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function PersonalizedHomeFeed() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const { activeRole, availableRoles, switchRole, isVendor, isAdmin, isCustomer } = useRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !isLoggedIn || !user) return null;

  return (
    <div className={`w-full py-4 px-6 md:px-12 border-b animate-fade-in transition-colors duration-300 ${isVendor ? 'bg-gradient-to-r from-navy via-slate-900 to-navy text-white border-primary/20' : 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-900 dark:to-orange-950/20 border-orange-200 dark:border-orange-900/30'}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Welcome and Role Context */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isVendor ? 'bg-primary/20 text-primary' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
            {isVendor ? <Store className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-xl font-bold ${isVendor ? 'text-white' : 'text-navy dark:text-white'}`}>
                Welcome back, {user.name}!
              </h2>
              {availableRoles.length > 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] uppercase tracking-wider font-bold px-2 py-0 border-primary/50 text-primary hover:bg-primary/10">
                      Viewing as: {activeRole} <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {availableRoles.map(role => (
                      <DropdownMenuItem key={role} onClick={() => switchRole(role)} className="font-semibold cursor-pointer">
                        Switch to {role.charAt(0).toUpperCase() + role.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className={`text-sm ${isVendor ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {isVendor ? 'You have new leads waiting for a response in your B2B dashboard.' : 'Ready to find the best local professionals?'}
            </p>
          </div>
        </div>
        
        {/* Right Side: Quick Actions Based on Role */}
        <div className="flex gap-4 flex-wrap">
          {isVendor ? (
            <>
              <Link href="/dashboard/requirements">
                <Button className="bg-primary hover:bg-orange-600 text-white font-bold shadow-md">
                  <FileText className="w-4 h-4 mr-2" /> B2B Marketplace
                </Button>
              </Link>
              <Link href="/dashboard/vendor/crm">
                <Button variant="outline" className="border-primary/50 hover:bg-primary/10 font-bold">
                  <Users className="w-4 h-4 mr-2" /> View Leads
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/search?category=Interior+Designers">
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm border border-border flex items-center gap-3 hover:border-primary transition cursor-pointer">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-sm pr-2">
                    <div className="font-bold text-navy dark:text-white">Interiors</div>
                    <div className="text-[10px] text-muted-foreground">Pick up where you left off</div>
                  </div>
                </div>
              </Link>
              <Link href="/dashboard/user">
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm border border-border flex items-center gap-3 hover:border-primary transition cursor-pointer">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm pr-2">
                    <div className="font-bold text-navy dark:text-white">Saved Places</div>
                    <div className="text-[10px] text-muted-foreground">View your favorites</div>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
