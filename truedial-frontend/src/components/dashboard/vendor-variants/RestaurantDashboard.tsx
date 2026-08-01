import { useState } from "react";
import { 
  Utensils, Users, ChevronRight, Percent, CalendarCheck
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";
import GenericVendorDashboard from "./GenericVendorDashboard";

export default function RestaurantDashboard({ user }: { user: AuthUser | null }) {
  const [bookings] = useState([
    { id: 1, time: "7:00 PM", party: "4 people", customer: "Priya S.", status: "Confirmed" },
    { id: 2, time: "8:30 PM", party: "2 people", customer: "Rahul M.", status: "Pending" },
  ]);

  return (
    <GenericVendorDashboard user={user}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Bookings */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between bg-amber-500/5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-amber-500" />
              Today's Bookings
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-xs text-amber-500 hover:underline font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Party Size</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/50 transition">
                    <td className="px-4 py-3 font-semibold text-foreground">{b.time}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.party}</td>
                    <td className="px-4 py-3 font-medium">{b.customer}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Menu Performance & Offers */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Utensils className="w-4 h-4 text-red-500" />
                Menu Performance
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Paneer Butter Masala</span>
                <span className="text-xs text-muted-foreground">120 views</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Chicken Biryani</span>
                <span className="text-xs text-muted-foreground">95 views</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Dal Makhani</span>
                <span className="text-xs text-muted-foreground">80 views</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Percent className="w-4 h-4 text-pink-500" />
                Active Happy Hours
              </h2>
            </div>
            <div className="p-3 bg-pink-500/5 border border-pink-500/20 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">20% Off on Dine-in</span>
              </div>
              <p className="text-xs text-muted-foreground">14 redemptions today</p>
            </div>
          </div>
        </div>

      </div>
    </GenericVendorDashboard>
  );
}
