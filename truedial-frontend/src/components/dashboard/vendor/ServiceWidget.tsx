import { Wrench, PhoneCall, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServiceWidget() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy dark:text-white">Service Requests</h3>
              <p className="text-xs text-muted-foreground">Recent callouts</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Available Now
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-foreground">Urgent Callouts</span>
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold text-xs">2</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-foreground">Scheduled Jobs</span>
            <span className="font-bold text-foreground">5</span>
          </div>
        </div>
        <Link href="/dashboard/vendor/crm" className="mt-4">
          <button className="w-full text-sm font-medium border border-border text-foreground py-2 rounded-md hover:bg-muted transition">Manage Jobs</button>
        </Link>
      </div>

      <div className="premium-card p-6 rounded-xl flex flex-col justify-between border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-navy dark:text-white">Quick Catalog</h3>
            <p className="text-xs text-muted-foreground">Most booked services</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">AC Servicing & Repair</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Electrical Wiring Fix</span>
          </div>
        </div>
        <Link href="/dashboard/vendor/catalog" className="mt-4">
          <button className="w-full text-sm font-medium bg-primary/10 text-primary py-2 rounded-md hover:bg-primary/20 transition flex items-center justify-center gap-2">
            Update Pricing
          </button>
        </Link>
      </div>
    </div>
  );
}
