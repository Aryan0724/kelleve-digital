import { useState } from "react";
import { 
  Utensils, Users, Star, Eye,
  TrendingUp, ArrowRight, UtensilsCrossed, CalendarDays
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";

export default function RestaurantDashboard({ user }: { user: AuthUser | null }) {
  const [stats, setStats] = useState({
    menuViews: 3420,
    tableReservations: 18,
    averageRating: 4.6,
    deliveryOrders: 45
  });

  const [reservations, setReservations] = useState([
    { id: 1, name: "Amit Singh", guests: 4, time: "Today, 8:00 PM", status: "Confirmed", type: "Dine-in" },
    { id: 2, name: "Sneha Patil", guests: 2, time: "Today, 9:30 PM", status: "Pending", type: "Dine-in" },
    { id: 3, name: "Karan Johar", guests: 10, time: "Tomorrow, 7:30 PM", status: "Confirmed", type: "Banquet" }
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white">
            Welcome, {user?.name || "Restaurateur"}!
          </h1>
          <p className="text-muted-foreground mt-1">Here is how your restaurant is performing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/vendor/catalog" 
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" /> Edit Menu
          </Link>
          <Link 
            href="/dashboard/vendor/offers" 
            className="px-4 py-2 bg-[#E8701A] text-white rounded-lg text-sm font-medium hover:bg-[#E8701A]/90 transition shadow-lg shadow-[#E8701A]/20"
          >
            Create Happy Hour Offer
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Menu Views</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.menuViews}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +22%
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Table Reservations</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.tableReservations}</span>
            <span className="text-xs font-medium text-muted-foreground mb-1">
              For Today
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Delivery Orders</h3>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.deliveryOrders}</span>
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
              / 5.0
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservations */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Upcoming Reservations
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {reservations.map((res) => (
              <div key={res.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {res.name} 
                    <span className="px-2 py-0.5 bg-muted text-foreground text-[10px] rounded-full font-bold">{res.guests} Guests</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{res.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    res.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {res.status}
                  </span>
                  {res.status === 'Pending' && (
                    <button className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition">
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Restaurant Manager</h2>
          <div className="space-y-3">
            <Link href="/dashboard/vendor/catalog" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Update Digital Menu</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/marketing" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Send SMS to Past Guests</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/profile" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Update Restaurant Photos</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
