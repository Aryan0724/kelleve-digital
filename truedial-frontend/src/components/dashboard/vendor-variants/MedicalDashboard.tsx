import { useState } from "react";
import { 
  Stethoscope, CalendarCheck, Users, Activity,
  Clock, PhoneCall, ArrowRight, Star
} from "lucide-react";
import Link from "next/link";
import { AuthUser } from "@/context/AuthContext";

export default function MedicalDashboard({ user }: { user: AuthUser | null }) {
  const [stats, setStats] = useState({
    todaysAppointments: 24,
    pendingConsultations: 5,
    patientReviews: 128,
    profileViews: 850
  });

  const [appointments, setAppointments] = useState([
    { id: 1, patient: "Suresh Menon", type: "First Visit", time: "Today, 11:30 AM", status: "Waiting", urgent: false },
    { id: 2, patient: "Meera Reddy", type: "Follow up", time: "Today, 12:15 PM", status: "Scheduled", urgent: false },
    { id: 3, patient: "Kiran Rao", type: "Emergency Walk-in", time: "Today, 1:00 PM", status: "Priority", urgent: true }
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-white">
            Hello, {user?.name || "Doctor"}!
          </h1>
          <p className="text-muted-foreground mt-1">Here is your clinical schedule for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/vendor/profile" 
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition flex items-center gap-2"
          >
            <Clock className="w-4 h-4" /> Update Clinic Hours
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Today's Appointments</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.todaysAppointments}</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Pending Inquiries</h3>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.pendingConsultations}</span>
            <span className="text-xs font-medium text-red-500 flex items-center mb-1">
              Requires attention
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Patient Reviews</h3>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.patientReviews}</span>
            <span className="text-xs font-medium text-emerald-500 flex items-center mb-1">
              4.8 Avg Rating
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Profile Views</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.profileViews}</span>
            <span className="text-xs font-medium text-muted-foreground mb-1">
              This Month
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments list */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Today's Schedule
            </h2>
            <Link href="/dashboard/vendor/crm" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
              View Full Calendar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {appointments.map((appt) => (
              <div key={appt.id} className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition ${appt.urgent ? 'bg-red-500/5' : ''}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{appt.patient}</h3>
                    {appt.urgent && <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full uppercase">Urgent</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{appt.type}</p>
                  <span className="text-xs font-medium text-primary mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {appt.time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    appt.status === 'Waiting' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    appt.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Clinic Management</h2>
          <div className="space-y-3">
            <Link href="/dashboard/vendor/catalog" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Manage Treatments/Services</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/reputation" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Respond to Reviews</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/vendor/profile" className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-primary/5 hover:text-primary transition group border border-transparent hover:border-primary/20">
              <span className="font-medium text-sm">Update Qualifications</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
