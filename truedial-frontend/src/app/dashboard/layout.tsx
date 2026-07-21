import Link from "next/link";
import { LayoutDashboard, Users, Megaphone, Settings, LogOut, MessageSquare, CreditCard, Star, FileText } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-navy-foreground flex flex-col transition-all duration-300">
        <div className="p-6 border-b border-white/10 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">T</div>
          <span className="text-xl font-bold">truedial</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard/business" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-white/10 text-white font-medium">
            <LayoutDashboard className="w-5 h-5 text-primary" /> Overview
          </Link>
          <Link href="/dashboard/business/leads" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <Users className="w-5 h-5" /> Leads & Inquiries
          </Link>
          <Link href="/dashboard/business/marketing" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <Megaphone className="w-5 h-5" /> Marketing (SMS)
          </Link>
          <Link href="/dashboard/business/offers" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <Star className="w-5 h-5" /> Manage Offers
          </Link>
          <Link href="/dashboard/business/reviews" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <Star className="w-5 h-5" /> Reviews & Ratings
          </Link>
          <Link href="/dashboard/business/subscription" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <CreditCard className="w-5 h-5" /> Subscription
          </Link>
          
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-navy-foreground/50 uppercase tracking-wider">Account</p>
          </div>
          <Link href="/dashboard/user" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <FileText className="w-5 h-5" /> Privilege Card
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-red-400 hover:text-red-300 hover:bg-white/5 transition w-full">
            <LogOut className="w-5 h-5" /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <h2 className="font-semibold text-foreground">Business Dashboard</h2>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/messages" className="relative text-muted-foreground hover:text-foreground transition">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">3</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              JP
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
