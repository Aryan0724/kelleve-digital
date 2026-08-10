import { Briefcase, Building, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RealEstateWidget() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="premium-card p-6 rounded-xl flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-navy dark:text-white">Site Visits & Leads</h3>
            <p className="text-xs text-muted-foreground">High-value prospects</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-foreground">Pending Consultations</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold text-xs">3</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-foreground">New B2B Inquiries</span>
            <span className="font-bold text-foreground">7</span>
          </div>
        </div>
        <Link href="/dashboard/vendor/crm" className="mt-4">
          <button className="w-full text-sm font-medium border border-border text-foreground py-2 rounded-md hover:bg-muted transition">Manage Leads</button>
        </Link>
      </div>

      <div className="premium-card p-6 rounded-xl flex flex-col justify-between border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-navy dark:text-white">Requirements Marketplace</h3>
            <p className="text-xs text-muted-foreground">Shared from FindMyInterior</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
            <span className="block text-foreground mb-1 line-clamp-1">3BHK Full Interior Renovation</span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Mumbai</span>
              <span className="text-emerald-600 font-bold">15 Lakhs</span>
            </div>
          </div>
        </div>
        <Link href="/dashboard/vendor/requirements" className="mt-4">
          <button className="w-full text-sm font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-2 rounded-md hover:bg-slate-800 dark:hover:bg-white transition flex items-center justify-center gap-2">
            View Marketplace <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
