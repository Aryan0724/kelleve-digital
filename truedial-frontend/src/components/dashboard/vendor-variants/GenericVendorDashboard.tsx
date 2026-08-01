import { useState } from "react";
import { 
  Eye, PhoneCall, ClipboardList, Inbox, Star, Ticket, Store,
  Activity, ArrowRight, ShieldCheck, Megaphone, CheckCircle2, AlertTriangle, MessageSquare, CreditCard
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";

export default function GenericVendorDashboard({ user, children }: { user: AuthUser | null, children?: React.ReactNode }) {
  const [stats] = useState({
    profileViews: 1240,
    activeLeads: 12,
    activeProjects: 4,
    totalInquiries: 48,
    averageRating: 4.8,
    totalReviews: 32,
    offerRedemptions: 15
  });

  const [leads] = useState([
    { id: 1, name: "Rohit Kumar", interest: "General Inquiry", time: "2 hours ago", status: "New Lead", budget: "₹15K" },
    { id: 2, name: "Ananya Iyer", interest: "Product Pricing", time: "5 hours ago", status: "Contacted", budget: "₹50K" },
  ]);

  const healthScore = 72;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
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
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            Launch Campaign
          </Link>
        </div>
      </div>

      {/* Universal KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard icon={Eye} label="Profile Views" value={stats.profileViews} trend="+12%" color="bg-blue-500" />
        <KPICard icon={PhoneCall} label="Active Leads" value={stats.activeLeads} trend="High Intent" color="bg-emerald-500" />
        <KPICard icon={ClipboardList} label="Active Projects" value={stats.activeProjects} trend="Ongoing" color="bg-purple-500" />
        <KPICard icon={Inbox} label="Total Inquiries" value={stats.totalInquiries} trend="This Month" color="bg-amber-500" />
        <KPICard icon={Star} label="Review Rating" value={stats.averageRating} trend={`${stats.totalReviews} total`} color="bg-yellow-500" />
        <KPICard icon={Ticket} label="Offer Claims" value={stats.offerRedemptions} trend="This Month" color="bg-pink-500" />
      </div>

      {/* Mid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CRM Pipeline */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-primary" />
              High-Value Leads Pipeline
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
              View CRM <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border flex-1">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition">
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{lead.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{lead.interest} • {lead.budget}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    lead.status === 'New Lead' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {lead.status}
                  </span>
                  <button className="w-8 h-8 flex items-center justify-center bg-background border border-border rounded-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition" title="Contact">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">No active leads right now.</div>
            )}
          </div>
        </div>

        {/* Business Health Score */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Business Health Score
          </h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-foreground">{healthScore}</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-emerald-500">Good Standing</h3>
              <p className="text-xs text-muted-foreground">Your business is performing well, but there is room for growth.</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <HealthItem label="Profile Completion" value={80} action="Complete Now" link="/dashboard/vendor/profile" />
            <HealthItem label="Review Rating" value={95} action="Request Reviews" link="/dashboard/vendor/reputation" />
            <HealthItem label="Response Time" value={62} action="Improve" link="/dashboard/vendor/crm" warning />
            <HealthItem label="Campaign Activity" value={40} action="Launch Campaign" link="/dashboard/vendor/marketing" warning />
          </div>
        </div>

      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Marketing Performance */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-500" />
              Marketing Performance
            </h2>
            <Link href="/dashboard/vendor/marketing" className="text-xs text-blue-500 hover:underline font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">Diwali Mega Offer (WhatsApp)</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase">Active</span>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="text-xs"><span className="text-muted-foreground">Sent:</span> 1,200</div>
                <div className="text-xs"><span className="text-muted-foreground">Clicked:</span> 340</div>
                <div className="text-xs font-semibold text-emerald-500">28% CTR</div>
              </div>
            </div>
            <Link href="/dashboard/vendor/marketing" className="block text-center text-xs font-medium text-muted-foreground hover:text-primary transition py-2 border border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5">
              + Create New Campaign
            </Link>
          </div>
        </div>

        {/* Reviews Summary */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              Recent Reviews
            </h2>
            <Link href="/dashboard/vendor/reputation" className="text-xs text-amber-500 hover:underline font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            <div className="border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex gap-1 text-amber-500">
                  <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-[10px] text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-xs text-foreground font-medium mb-1 line-clamp-2">"Great service! Really loved the experience."</p>
              <button className="text-[10px] font-bold text-primary hover:underline">Reply to Review</button>
            </div>
          </div>
        </div>

        {/* Subscription & Tools */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-2 relative z-10">
              <CreditCard className="w-4 h-4 text-primary" />
              Subscription Status
            </h2>
            <div className="mb-4 relative z-10">
              <span className="text-2xl font-black text-foreground">Pro Plan</span>
              <span className="text-xs text-muted-foreground ml-2">Active</span>
            </div>
            <div className="w-full bg-background/50 rounded-full h-1.5 mb-1.5 relative z-10 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-4 relative z-10">165 days remaining until renewal</p>
            <Link href="/dashboard/vendor/subscription" className="text-xs font-bold text-primary hover:underline relative z-10">
              Manage Billing &rarr;
            </Link>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dashboard/vendor/offers" className="flex items-center gap-2 p-2 rounded bg-muted/50 hover:bg-primary/10 hover:text-primary transition text-xs font-medium">
                <Ticket className="w-3.5 h-3.5" /> Create Offer
              </Link>
              <Link href="/dashboard/vendor/profile" className="flex items-center gap-2 p-2 rounded bg-muted/50 hover:bg-primary/10 hover:text-primary transition text-xs font-medium">
                <Store className="w-3.5 h-3.5" /> Edit Profile
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Personalized Widget Section */}
      {children && (
        <div className="mt-8 pt-6 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}

function KPICard({ icon: Icon, label, value, trend, color }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-xs text-muted-foreground truncate pr-2">{label}</h3>
        <div className={`w-8 h-8 rounded-full ${color}/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div>
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="block text-[10px] font-medium text-muted-foreground mt-0.5">{trend}</span>
      </div>
    </div>
  );
}

function HealthItem({ label, value, action, link, warning }: any) {
  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs font-bold">{value}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5 mb-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full ${warning ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${value}%` }}></div>
      </div>
      <Link href={link} className={`text-[10px] font-bold hover:underline flex items-center gap-0.5 ${warning ? 'text-amber-600' : 'text-emerald-600'}`}>
        {warning && <AlertTriangle className="w-3 h-3" />}
        {!warning && <CheckCircle2 className="w-3 h-3" />}
        {action}
      </Link>
    </div>
  );
}
