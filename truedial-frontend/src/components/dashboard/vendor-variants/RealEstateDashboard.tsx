import { useState } from "react";
import { 
  Building2, HardHat, PhoneCall, Image as ImageIcon,
  TrendingUp, ArrowRight, Eye, Briefcase
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";

export default function RealEstateDashboard({ user }: { user: AuthUser | null }) {
  const [stats, setStats] = useState({
    portfolioViews: 8900,
    activeLeads: 45,
    ongoingProjects: 8,
    clientInquiries: 124
  });

  const [leads, setLeads] = useState([
    { id: 1, name: "Rajesh Kumar", interest: "3BHK Interior Design", time: "2 hours ago", status: "Site Visit Scheduled", budget: "₹15L - ₹20L" },
    { id: 2, name: "Sunita Gupta", interest: "Office Renovation", time: "5 hours ago", status: "New Lead", budget: "₹50L+" },
    { id: 3, name: "Kunal Shah", interest: "Modular Kitchen", time: "1 day ago", status: "Quotation Sent", budget: "₹5L - ₹8L" }
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white">
            Welcome, {user?.name || "Professional"}!
          </h1>
          <p className="text-muted-foreground mt-1">Manage your projects, portfolio, and high-value leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/vendor/catalog" 
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" /> Add Project to Portfolio
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Portfolio Views</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.portfolioViews}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +15%
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Active Leads</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.activeLeads}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              High Intent
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Active Projects</h3>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <HardHat className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.ongoingProjects}</span>
            <span className="text-xs font-medium text-muted-foreground mb-1">
              Currently executing
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Total Inquiries</h3>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.clientInquiries}</span>
            <span className="text-xs font-medium text-muted-foreground mb-1">
              This Month
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              High-Value Leads Pipeline
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
              View All CRM <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {leads.map((lead) => (
              <div key={lead.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {lead.name}
                  </h3>
                  <p className="text-sm font-medium text-primary mt-1">{lead.interest}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Budget: {lead.budget}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    lead.status === 'New Lead' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    lead.status === 'Quotation Sent' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
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
          <h2 className="text-lg font-bold text-foreground mb-6">Business Tools</h2>
          <div className="space-y-3">
            <Link href="/dashboard/vendor/catalog" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Upload 3D Renders / Photos</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/crm" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Follow-up with Leads</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/profile" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Update Experience & Awards</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
