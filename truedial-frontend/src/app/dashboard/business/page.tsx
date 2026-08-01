import { TrendingUp, Users, Eye, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function BusinessDashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">Overview</h1>
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
          <h3 className="text-3xl font-bold text-navy dark:text-white">12,482</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +14.5% from last month
          </p>
        </div>
        
        <div className="premium-card p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16"/></div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Leads Generated</p>
          <h3 className="text-3xl font-bold text-navy dark:text-white">342</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +5.2% from last month
          </p>
        </div>
        
        <div className="premium-card p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Star className="w-16 h-16"/></div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Average Rating</p>
          <h3 className="text-3xl font-bold text-navy dark:text-white">4.8</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
            Based on 156 reviews
          </p>
        </div>
        
        <div className="premium-card p-6 rounded-xl bg-gradient-to-br from-primary to-orange-500 text-white relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp className="w-16 h-16 text-white"/></div>
          <p className="text-sm font-medium text-white/80 mb-1">Smart Bid Score</p>
          <h3 className="text-3xl font-bold text-white">92/100</h3>
          <p className="text-xs text-white/90 flex items-center gap-1 mt-2 font-medium">
            Excellent! You are ranking #1.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 premium-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-navy dark:text-white">Recent Leads</h3>
            <Link href="/dashboard/business/leads" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3, 4].map((lead) => (
              <div key={lead} className="p-4 px-6 flex justify-between items-center hover:bg-muted/50 transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">R</div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Rahul Sharma</h4>
                    <p className="text-xs text-muted-foreground">Looking for dinner reservation for 10 people</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block mb-1">Just now</span>
                  <Link href="/dashboard/business/leads">
                    <button className="text-xs bg-primary text-white px-3 py-1 rounded-full font-medium">Respond</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription / Privilege Info */}
        <div className="premium-card p-6 rounded-xl flex flex-col">
          <h3 className="font-bold text-navy dark:text-white mb-6 border-b border-border pb-2">Subscription</h3>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 text-center">
            <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-3 shadow-md">PREMIUM SELLER</div>
            <h4 className="font-bold text-foreground">Annual Growth Plan</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Valid till: 24th Oct 2027</p>
            <Link href="/dashboard/business/subscription">
              <button className="w-full text-sm font-medium border border-primary text-primary py-2 rounded-md hover:bg-primary/5 transition">Upgrade Plan</button>
            </Link>
          </div>

          <h3 className="font-bold text-navy dark:text-white mb-4 mt-auto">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/dashboard/business/campaigns">
              <button className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-md bg-muted hover:bg-primary hover:text-white transition">Send SMS Campaign</button>
            </Link>
            <Link href="/dashboard/business/gallery">
              <button className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-md bg-muted hover:bg-primary hover:text-white transition">Update Gallery</button>
            </Link>
            <Link href="/dashboard/business/offers">
              <button className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-md bg-muted hover:bg-primary hover:text-white transition">Post an Offer</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
