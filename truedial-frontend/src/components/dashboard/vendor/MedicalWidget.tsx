import { CalendarCheck, Users, Activity, FilePlus } from "lucide-react";
import Link from "next/link";

export default function MedicalWidget() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-navy dark:text-white">Appointments</h3>
            <p className="text-xs text-muted-foreground">Today's Schedule</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-foreground">Pending Requests</span>
            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold text-xs">4</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-foreground">Confirmed Today</span>
            <span className="font-bold text-foreground">12</span>
          </div>
        </div>
        <Link href="/dashboard/vendor/crm" className="mt-4">
          <button className="w-full text-sm font-medium border border-border text-foreground py-2 rounded-md hover:bg-muted transition">Manage Calendar</button>
        </Link>
      </div>

      <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-navy dark:text-white">Health Campaigns</h3>
            <p className="text-xs text-muted-foreground">Active promotions</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium border-l-2 border-primary pl-3 py-1">
            <span className="block text-foreground">Free Dental Checkup</span>
            <span className="text-xs text-muted-foreground">14 sign-ups this week</span>
          </div>
        </div>
        <Link href="/dashboard/vendor/offers" className="mt-4">
          <button className="w-full text-sm font-medium bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition flex items-center justify-center gap-2">
            <FilePlus className="w-4 h-4" /> Add Health Package
          </button>
        </Link>
      </div>
    </div>
  );
}
