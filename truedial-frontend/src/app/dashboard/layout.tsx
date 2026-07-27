"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Megaphone, Settings, LogOut, MessageSquare, CreditCard, Star, FileText, Bell, CheckCircle2, X, Clock, ChevronRight, Globe, ArrowLeft, Home } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [messages, setMessages] = useState([
    { id: 1, name: "Rohit Kumar", subject: "Interior Consultation Quote", preview: "Hi, I need an estimate for a 3BHK flat in Mumbai...", time: "2m ago", unread: true },
    { id: 2, name: "Ananya Iyer", subject: "Modular Kitchen Inquiry", preview: "Can we schedule a visit to your showroom this Saturday?", time: "1h ago", unread: true },
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

  return (
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

          <Link href="/dashboard/business" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-white/10 text-white font-medium">
            <LayoutDashboard className="w-5 h-5 text-primary" /> Overview
          </Link>
          <Link href="/dashboard/business/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <Settings className="w-5 h-5" /> Business Profile
          </Link>
          <Link href="/dashboard/business/catalog" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <FileText className="w-5 h-5" /> Products & Services
          </Link>
          <Link href="/dashboard/business/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-navy-foreground/70 hover:text-white hover:bg-white/5 transition">
            <LayoutDashboard className="w-5 h-5" /> Analytics
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
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-30 relative">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-foreground">Business Dashboard</h2>
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
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
              JP
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
  );
}
