import { useState } from "react";
import { 
  Wrench, CheckCircle, Clock, ClipboardList, 
  TrendingUp, PhoneCall, ArrowRight, Activity, Calendar
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";

export default function ServiceDashboard({ user }: { user: AuthUser | null }) {
  const [stats, setStats] = useState({
    activeRequests: 12,
    completedJobs: 84,
    averageRating: 4.9,
    upcomingBookings: 3
  });

  const [serviceRequests, setServiceRequests] = useState([
    { id: 1, name: "Priya Sharma", service: "AC Repair & Servicing", time: "Tomorrow, 10:00 AM", status: "Scheduled", address: "Andheri West" },
    { id: 2, name: "Rahul Verma", service: "Plumbing Issue", time: "Today, 4:00 PM", status: "Pending", address: "Bandra East" },
    { id: 3, name: "Anita Desai", service: "Electrical Wiring", time: "Yesterday", status: "Completed", address: "Juhu" }
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white">
            Welcome, {user?.name || "Service Professional"}!
          </h1>
          <p className="text-muted-foreground mt-1">Manage your service requests and availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-sm font-bold flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Accepting New Jobs
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Active Requests</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.activeRequests}</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Upcoming Bookings</h3>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.upcomingBookings}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              Next in 2 hrs
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Completed Jobs</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.completedJobs}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> This Month
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Job Rating</h3>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.averageRating}</span>
            <span className="text-xs font-medium text-muted-foreground mb-1">
              / 5.0
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Requests */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Service Requests
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
              View Schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {serviceRequests.map((req) => (
              <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition">
                <div>
                  <h3 className="font-semibold text-foreground">{req.name}</h3>
                  <p className="text-sm font-medium text-primary">{req.service}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.time}</span>
                    <span>•</span>
                    <span>{req.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    req.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {req.status}
                  </span>
                  {req.status !== 'Completed' && (
                    <button className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition" title="Call Customer">
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Service Management</h2>
          <div className="space-y-3">
            <Link href="/dashboard/vendor/catalog" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Update Service Rates</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/profile" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Manage Service Area (Radius)</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/offers" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Create Discount Coupon</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
