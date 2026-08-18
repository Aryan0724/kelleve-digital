"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Megaphone, Settings, LogOut, MessageSquare, 
  CreditCard, Star, FileText, Bell, ChevronRight, Globe, ArrowLeft, Heart, ShieldAlert,
  Store, Ticket, LineChart
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DashboardSidebarContent from "@/components/dashboard/sidebar/DashboardSidebarContent";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, clearUser } = useAuth();
  const { activeRole, isAdmin, isVendor, isCustomer, availableRoles, switchRole } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [messages, setMessages] = useState([
    { id: 1, name: "Rohit Kumar", subject: "Business Enquiry", preview: "Hi, I need an estimate for a 3BHK flat in Mumbai...", time: "2m ago", unread: true },
    { id: 2, name: "Ananya Iyer", subject: "Service Booking Request", preview: "Can we schedule a visit to your showroom this Saturday?", time: "1h ago", unread: true },
    { id: 3, name: "Vikram Mehta", subject: "Privilege Card Offer", preview: "Is the 20% Diwali discount valid on weekends?", time: "1d ago", unread: false },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Lead Received", desc: "Rohit Kumar requested a callback for Interior Consulting", time: "Just now", unread: true, type: "lead" },
    { id: 2, title: "5-Star Review!", desc: "Priya Sharma left a 5-star review on your listing", time: "2h ago", unread: true, type: "review" },
    { id: 3, title: "Privilege Card Claim", desc: "Member TD-8492 claimed your 20% discount voucher", time: "5h ago", unread: true, type: "offer" },
    { id: 4, title: "Profile Verified", desc: "Your GSTIN and business address have been verified", time: "1d ago", unread: false, type: "system" },
  ]);

  const unreadMessagesCount = messages.filter(m => m.unread).length;
  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAllMessagesRead = () => {
    setMessages(messages.map(m => ({ ...m, unread: false })));
  };


  const hasAdminRole = isAdmin;
  const hasVendorRole = isVendor;

  let links: any[] = [];

  if (hasAdminRole) {
    links = [
      { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
      { label: "Vendors", href: "/dashboard/admin/vendors", icon: ShieldAlert },
      { label: "Approvals", href: "/dashboard/admin/approvals", icon: FileText },
      { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
    ];
  } else if (hasVendorRole) {
    links = [
      { label: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
      { label: 'My Business', href: '/dashboard/vendor/profile', icon: Store },
      { label: 'Products & Services', href: '/dashboard/vendor/catalog', icon: FileText },
      { label: 'Offers & Coupons', href: '/dashboard/vendor/offers', icon: Ticket },
      { label: 'CRM & Leads', href: '/dashboard/vendor/crm', icon: Users },
      { label: 'Marketing Center', href: '/dashboard/vendor/marketing', icon: Megaphone },
      { label: 'Reviews & Reputation', href: '/dashboard/vendor/reputation', icon: Star },
      { label: 'Analytics', href: '/dashboard/vendor/analytics', icon: LineChart },
      { label: 'Subscription & Billing', href: '/dashboard/vendor/subscription', icon: CreditCard },
      { label: 'Notifications', href: '/dashboard/vendor/notifications', icon: Bell },
      { label: 'Settings', href: '/dashboard/vendor/settings', icon: Settings },
    ];
  } else {
    links = [
      { label: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
      { label: "Saved & Favorites", href: "/dashboard/user/favorites", icon: Heart },
      { label: "My Reviews", href: "/dashboard/user/reviews", icon: Star },
      { label: "Privilege Card", href: "/dashboard/user/privilege", icon: CreditCard },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ];
  }

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link 
        href={item.href} 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition ${
          isActive 
            ? 'bg-white/10 text-white font-medium shadow-inner' 
            : 'text-navy-foreground/70 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} /> {item.label}
      </Link>
    );
  };

  return (
    <ProtectedRoute>
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-navy-foreground flex flex-col transition-all duration-300 shrink-0">
        <Link href="/" className="p-6 border-b border-white/10 flex items-center gap-2 hover:opacity-90 transition">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">T</div>
          <span className="text-xl font-bold">truedial</span>
          <span className="text-[10px] ml-auto bg-white/10 px-2 py-0.5 rounded text-amber-300 font-semibold uppercase">Home</span>
        </Link>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-amber-500 text-navy font-bold hover:bg-amber-400 transition shadow-sm mb-3">
            <ArrowLeft className="w-5 h-5 shrink-0" /> Back to Homepage
          </Link>

          <DashboardSidebarContent />

          {/* Role Switcher */}
          {availableRoles.length > 1 && (
            <div className="mt-6 px-3">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Switch View</p>
              <div className="flex bg-white/5 rounded-lg p-1">
                {availableRoles.includes('customer') && (
                  <button
                    onClick={() => switchRole('customer')}
                    className={`flex-1 text-xs py-1.5 rounded-md transition ${activeRole === 'customer' ? 'bg-primary text-white font-medium shadow' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                  >
                    User
                  </button>
                )}
                {availableRoles.includes('vendor') && (
                  <button
                    onClick={() => switchRole('vendor')}
                    className={`flex-1 text-xs py-1.5 rounded-md transition ${activeRole === 'vendor' ? 'bg-primary text-white font-medium shadow' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                  >
                    Business
                  </button>
                )}
                {availableRoles.includes('admin') && (
                  <button
                    onClick={() => switchRole('admin')}
                    className={`flex-1 text-xs py-1.5 rounded-md transition ${activeRole === 'admin' ? 'bg-primary text-white font-medium shadow' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                  >
                    Admin
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button
            onClick={async () => {
              clearUser();
              // Call server action to delete httpOnly cookie
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/login");
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-red-400 hover:text-red-300 hover:bg-white/5 transition w-full"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-30 relative">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-foreground">{user?.name ? `${user.name} Dashboard` : isAdmin ? 'Admin Console' : isVendor ? 'Business Dashboard' : 'User Dashboard'}</h2>
            <Link 
              href="/" 
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-full border border-primary/20"
            >
              <Globe className="w-3.5 h-3.5" /> Go to Website / Homepage
            </Link>
          </div>
          <div className="flex items-center gap-5">
            {/* Messages Dropdown Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowNotifications(false);
                }}
                className="relative text-muted-foreground hover:text-foreground transition p-1.5 rounded-lg hover:bg-muted"
                aria-label="Messages"
              >
                <MessageSquare className="w-6 h-6" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Messages Popover */}
              {showMessages && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-sm">Customer Inquiries</h3>
                      {unreadMessagesCount > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary font-bold rounded-full">
                          {unreadMessagesCount} New
                        </span>
                      )}
                    </div>
                    {unreadMessagesCount > 0 && (
                      <button 
                        onClick={markAllMessagesRead}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-border">
                    {messages.map((msg) => (
                      <Link 
                        key={msg.id} 
                        href="/dashboard/business/leads"
                        onClick={() => setShowMessages(false)}
                        className={`block p-3.5 hover:bg-muted/50 transition ${msg.unread ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-sm text-foreground">{msg.name}</span>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">{msg.time}</span>
                        </div>
                        <div className="text-xs font-medium text-foreground/90 mb-0.5">{msg.subject}</div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{msg.preview}</p>
                      </Link>
                    ))}
                  </div>

                  <div className="p-3 border-t border-border text-center bg-muted/30">
                    <Link 
                      href="/dashboard/business/leads" 
                      onClick={() => setShowMessages(false)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1"
                    >
                      View All Messages & Leads <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                }}
                className="relative text-muted-foreground hover:text-foreground transition p-1.5 rounded-lg hover:bg-muted"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-red-500" />
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      {unreadNotificationsCount > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-500 font-bold rounded-full">
                          {unreadNotificationsCount} Unread
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-border">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-3.5 hover:bg-muted/50 transition flex items-start gap-3 ${notif.unread ? 'bg-primary/5' : ''}`}
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" style={{ opacity: notif.unread ? 1 : 0 }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="font-semibold text-xs text-foreground">{notif.title}</span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notif.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{notif.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-border text-center bg-muted/30">
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground transition"
                    >
                      Clear all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm" title={user?.name || 'User'}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
              )}
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 bg-background"
          onClick={() => {
            if (showMessages || showNotifications) {
              setShowMessages(false);
              setShowNotifications(false);
            }
          }}
        >
          {children}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
