import { useState } from "react";
import { 
  Building2, HardHat, Eye, Briefcase, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";
import GenericVendorDashboard from "./GenericVendorDashboard";

export default function RealEstateDashboard({ user }: { user: AuthUser | null }) {
  const [projects] = useState([
    { id: 1, name: "3BHK Renovation", client: "Rajesh Kumar", stage: "3D Rendering", budget: "₹18L", due: "Aug 15", status: "On Track" },
    { id: 2, name: "Office Interior", client: "TechCorp", stage: "Execution", budget: "₹55L", due: "Sep 1", status: "Delayed" },
  ]);

  return (
    <GenericVendorDashboard user={user}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Pipeline */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between bg-purple-500/5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <HardHat className="w-4 h-4 text-purple-500" />
              Project Pipeline
            </h2>
            <Link href="/dashboard/vendor/catalog" className="text-xs text-purple-500 hover:underline font-medium">View All Projects</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Budget</th>
                  <th className="px-4 py-3 font-medium">Due Date</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-muted/50 transition">
                    <td className="px-4 py-3 font-semibold text-foreground">{proj.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{proj.client}</td>
                    <td className="px-4 py-3 text-muted-foreground">{proj.stage}</td>
                    <td className="px-4 py-3 font-medium">{proj.budget}</td>
                    <td className="px-4 py-3 text-muted-foreground">{proj.due}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        proj.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Performance */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              Portfolio Performance
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=100&q=80" alt="Living Room" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">Modern Living Room</p>
                <p className="text-xs text-muted-foreground">342 views • 12 inquiries</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=100&q=80" alt="Kitchen" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">Modular Kitchen</p>
                <p className="text-xs text-muted-foreground">215 views • 8 inquiries</p>
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-600 font-medium flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">💡</span> Projects with "before & after" photos get 3x more leads.
            </p>
          </div>
        </div>

      </div>
    </GenericVendorDashboard>
  );
}
