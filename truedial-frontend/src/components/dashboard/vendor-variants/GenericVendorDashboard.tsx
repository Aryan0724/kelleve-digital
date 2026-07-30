import { useState } from "react";
import { 
  Users, Star, Eye, MousePointerClick, 
  TrendingUp, PhoneCall, ArrowRight, Activity 
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";

export default function GenericVendorDashboard({ user }: { user: AuthUser | null }) {
  const [stats, setStats] = useState({
    profileViews: 1240,
    leadsGenerated: 48,
    averageRating: 4.8,
    totalReviews: 32,
    clickThroughs: 156
  });

  const [recentLeads, setRecentLeads] = useState([
    { id: 1, name: "Rohit Kumar", inquiry: "General Inquiry", time: "2 hours ago", status: "New" },
    { id: 2, name: "Ananya Iyer", inquiry: "Product Pricing", time: "5 hours ago", status: "Contacted" },
    { id: 3, name: "Vikram Mehta", inquiry: "Store Timings", time: "1 day ago", status: "Closed" }
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white">
            Welcome back, {user?.name || "Business Owner"}!
          </h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/vendor/profile" 
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition"
          >
            Edit Profile
          </Link>
          <Link 
            href="/dashboard/vendor/marketing" 
            className="px-4 py-2 bg-[#E8701A] text-white rounded-lg text-sm font-medium hover:bg-[#E8701A]/90 transition shadow-lg shadow-[#E8701A]/20"
          >
            Boost Visibility
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Profile Views</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.profileViews}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">New Leads</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.leadsGenerated}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +5%
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Avg. Rating</h3>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.averageRating}</span>
            <span className="text-xs font-medium text-muted-foreground mb-1">
              ({stats.totalReviews} reviews)
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Interactions</h3>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.clickThroughs}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Inquiries
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition">
                <div>
                  <h3 className="font-semibold text-foreground">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.inquiry}</p>
                  <span className="text-xs text-muted-foreground mt-1 inline-block">{lead.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                    lead.status === 'Contacted' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {lead.status}
                  </span>
                  <button className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition" title="Contact Lead">
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/vendor/catalog" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Add New Product/Service</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/offers" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Create Special Offer</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/profile" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Update Business Hours</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/marketing" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Run SMS Campaign</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-amber-500/10 to-[#E8701A]/10 border border-[#E8701A]/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E8701A] text-white flex items-center justify-center shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Upgrade to Premium</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">Get 3x more visibility and exclusive badge on your profile.</p>
                <Link href="/dashboard/vendor/subscription" className="text-xs font-bold text-[#E8701A] hover:underline">
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
