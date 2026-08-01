import { useState } from "react";
import { 
  Stethoscope, CalendarCheck, FileText
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";
import GenericVendorDashboard from "./GenericVendorDashboard";

export default function MedicalDashboard({ user }: { user: AuthUser | null }) {
  const [appointments] = useState([
    { id: 1, time: "10:00 AM", patient: "Rajesh K.", type: "Checkup", status: "Waiting" },
    { id: 2, time: "11:30 AM", patient: "Sneha P.", type: "Consultation", status: "Upcoming" },
  ]);

  return (
    <GenericVendorDashboard user={user}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between bg-blue-500/5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-500" />
              Today's Appointments
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-xs text-blue-500 hover:underline font-medium">View Schedule</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-muted/50 transition">
                    <td className="px-4 py-3 font-semibold text-foreground">{apt.time}</td>
                    <td className="px-4 py-3 text-muted-foreground">{apt.patient}</td>
                    <td className="px-4 py-3 font-medium">{apt.type}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        apt.status === 'Waiting' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinic Services Performance */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-500" />
              Top Services
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-muted-foreground" /> General Checkup</span>
              <span className="text-xs text-muted-foreground">42 this week</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-muted-foreground" /> Dental Cleaning</span>
              <span className="text-xs text-muted-foreground">28 this week</span>
            </div>
          </div>
        </div>

      </div>
    </GenericVendorDashboard>
  );
}
