"use client";

import { TrendingUp, Users, Eye, Star, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrueDialAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useVendorType } from "@/hooks/useVendorType";

import MedicalWidget from "@/components/dashboard/vendor/MedicalWidget";
import RestaurantWidget from "@/components/dashboard/vendor/RestaurantWidget";
import RealEstateWidget from "@/components/dashboard/vendor/RealEstateWidget";
import ServiceWidget from "@/components/dashboard/vendor/ServiceWidget";
import B2BCrossSellWidget from "@/components/dashboard/vendor/B2BCrossSellWidget";
import VIPCardScannerWidget from "@/components/dashboard/vendor/VIPCardScannerWidget";

export default function VendorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const config = useVendorType();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await TrueDialAPI.getAnalyticsOverview();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch business stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback to mock data if API fails or returns no data (for development/testing)
  const displayStats = stats?.current || {
    profileViews: 12482,
    leadsGenerated: 342,
    averageRating: 4.8,
    reviewCount: 156,
    smartBidScore: 92
  };

  // Reactionary Logic States
  const hasZeroLeads = displayStats.leadsGenerated === 0;

  // Let's keep legacy widgets for the first 4 if they match perfectly, otherwise use a dynamic one.
  const isMedical = config.archetype === 'healthcare';
  const isRestaurant = config.archetype === 'food';
  const isRealEstate = config.archetype === 'builder';
  const isService = config.archetype === 'worker';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Business Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Here is what's happening with your business today.</p>
        </div>
        <div className="bg-white/50 dark:bg-navy/50 backdrop-blur border border-border rounded-lg px-4 py-2 text-sm font-medium">
          Last 30 Days
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="premium-card p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Eye className="w-16 h-16"/></div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Profile Views</p>
          <h3 className="text-3xl font-bold text-navy dark:text-white">{displayStats.profileViews?.toLocaleString() || 0}</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2 font-medium">
            <ArrowUpRight className="w-3 h-3" /> {stats?.trends?.profileViews || "+0%"} from last month
          </p>
        </div>
        
        <div className="premium-card p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16"/></div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Leads Generated</p>
          <h3 className="text-3xl font-bold text-navy dark:text-white">{displayStats.leadsGenerated?.toLocaleString() || 0}</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2 font-medium">
            <ArrowUpRight className="w-3 h-3" /> {stats?.trends?.leadsGenerated || "+0%"} from last month
          </p>
        </div>
        
        <div className="premium-card p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Star className="w-16 h-16"/></div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Average Rating</p>
          <h3 className="text-3xl font-bold text-navy dark:text-white">{displayStats.averageRating || "0.0"}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
            Based on {displayStats.reviewCount || 0} reviews
          </p>
        </div>
        
        <div className="premium-card p-6 rounded-xl bg-gradient-to-br from-primary to-orange-500 text-white relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp className="w-16 h-16 text-white"/></div>
          <p className="text-sm font-medium text-white/80 mb-1">Smart Bid Score</p>
          <h3 className="text-3xl font-bold text-white">{displayStats.smartBidScore || 0}/100</h3>
          <p className="text-xs text-white/90 flex items-center gap-1 mt-2 font-medium">
            Keep ranking high!
          </p>
        </div>
      </div>

      {/* Industry-specific personalization */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-navy dark:text-white mb-4">Industry Insights</h2>
        {isMedical && <MedicalWidget />}
        {isRestaurant && <RestaurantWidget />}
        {isRealEstate && <RealEstateWidget />}
        {isService && <ServiceWidget />}
        
        {/* Fallback generic dynamic widget for other archetypes */}
        {!isMedical && !isRestaurant && !isRealEstate && !isService && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <config.crmIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy dark:text-white">{config.crmLabel} Activity</h3>
                  <p className="text-xs text-muted-foreground">Recent inquiries</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">New Today</span>
                  <span className="font-bold text-foreground">12</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">Pending Action</span>
                  <span className="font-bold text-foreground">3</span>
                </div>
              </div>
              <Link href="/dashboard/vendor/crm" className="mt-4">
                <button className="w-full text-sm font-medium border border-border text-foreground py-2 rounded-md hover:bg-muted transition">Manage {config.crmLabel}</button>
              </Link>
            </div>

            <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <config.catalogIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy dark:text-white">{config.catalogLabel} Stats</h3>
                  <p className="text-xs text-muted-foreground">Active items</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">Total Published</span>
                  <span className="font-bold text-foreground">48</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">Most Viewed</span>
                  <span className="text-xs text-muted-foreground truncate w-24 text-right">Premium Package</span>
                </div>
              </div>
              <Link href="/dashboard/vendor/catalog" className="mt-4">
                <button className="w-full text-sm font-medium border border-border text-foreground py-2 rounded-md hover:bg-muted transition">Update {config.catalogLabel}</button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Dynamic Main Column: Recent Leads vs Marketing Prompt */}
        <div className="lg:col-span-2 space-y-6">
          {hasZeroLeads ? (
            <div className="premium-card rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-2xl text-navy dark:text-white mb-2">You have 0 new leads</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Don't wait for customers to find you. Launch a targeted SMS blast to 500 locals in your area instantly using the "{config.marketingTemplates[0]?.replace('_', ' ')}" template.
                </p>
                <Link href="/dashboard/vendor/marketing">
                  <button className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition hover:scale-105">
                    Launch SMS Campaign (₹200)
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="premium-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="font-bold text-navy dark:text-white">Urgent Lead Activity</h3>
                <Link href="/dashboard/vendor/crm" className="text-sm text-primary font-medium hover:underline">Open Full CRM</Link>
              </div>
              <div className="divide-y divide-border">
                {[1, 2, 3].map((lead) => (
                  <div key={lead} className="p-4 px-6 flex justify-between items-center hover:bg-muted/50 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">L</div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">New Lead Inquiry</h4>
                        <p className="text-xs text-muted-foreground">Received a new message from profile.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block mb-1">Today</span>
                      <Link href="/dashboard/vendor/crm">
                        <button className="text-xs bg-primary text-white px-3 py-1 rounded-full font-medium">Respond Now</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic B2B Widget */}
          <B2BCrossSellWidget categoryType={config.archetype} />
        </div>

        {/* Quick Actions & Tools */}
        <div className="flex flex-col gap-6">
          <VIPCardScannerWidget />
          
          <div className="premium-card p-6 rounded-xl flex flex-col flex-1">
            <h3 className="font-bold text-navy dark:text-white mb-6 border-b border-border pb-2">Subscription</h3>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 text-center">
              <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-3 shadow-md">PREMIUM SELLER</div>
              <h4 className="font-bold text-foreground">Annual Growth Plan</h4>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Valid till: 24th Oct 2027</p>
              <Link href="/dashboard/vendor/subscription">
                <button className="w-full text-sm font-medium border border-primary text-primary py-2 rounded-md hover:bg-primary/5 transition">Upgrade Plan</button>
              </Link>
            </div>

            <h3 className="font-bold text-navy dark:text-white mb-4 mt-auto">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/dashboard/vendor/marketing">
                <button className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-md bg-muted hover:bg-primary hover:text-white transition">Send SMS Campaign</button>
              </Link>
              <Link href="/dashboard/vendor/profile">
                <button className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-md bg-muted hover:bg-primary hover:text-white transition">Update Profile</button>
              </Link>
              {config.uniqueTabs.map(tab => (
                <Link key={tab.href} href={tab.href}>
                  <button className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-md bg-muted hover:bg-primary hover:text-white transition mt-2">
                    Manage {tab.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
