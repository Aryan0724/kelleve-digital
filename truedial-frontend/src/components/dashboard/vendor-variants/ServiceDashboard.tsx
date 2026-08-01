import { useState } from "react";
import { 
  Wrench, ClipboardList, MapPin
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";
import GenericVendorDashboard from "./GenericVendorDashboard";

export default function ServiceDashboard({ user }: { user: AuthUser | null }) {
  const [requests] = useState([
    { id: 1, service: "AC Repair", area: "Andheri West", time: "Today, 2:00 PM", status: "Assigned" },
    { id: 2, name: "Deep Cleaning", area: "Bandra East", time: "Tomorrow, 10:00 AM", status: "Pending" },
  ]);

  return (
    <GenericVendorDashboard user={user}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Service Requests */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between bg-emerald-500/5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-500" />
              Recent Service Requests
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-xs text-emerald-500 hover:underline font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/50 transition">
                    <td className="px-4 py-3 font-semibold text-foreground">{req.service}</td>
                    <td className="px-4 py-3 text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.area}</td>
                    <td className="px-4 py-3 font-medium">{req.time}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        req.status === 'Assigned' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Catalog Performance */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-500" />
              Most Booked Services
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">AC Regular Servicing</span>
              <span className="text-xs text-muted-foreground">34 bookings</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">RO Repair</span>
              <span className="text-xs text-muted-foreground">18 bookings</span>
            </div>
          </div>
        </div>

      </div>
    </GenericVendorDashboard>
  );
}
