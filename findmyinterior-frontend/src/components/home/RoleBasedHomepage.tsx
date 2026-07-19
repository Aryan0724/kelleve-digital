"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Briefcase, ShieldCheck, Wallet, ChevronRight,
  FileText, Search, HardHat, Truck, Building, Paintbrush,
  ArrowRight, Star, IndianRupee, Clock, Users, TrendingUp,
  MessageSquare, PenTool, Home, LayoutDashboard, ClipboardList
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";

// ─── Role Config ────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, any> = {
  homeowner: {
    greeting: "Welcome back",
    tagline: "Post a requirement and receive multiple quotes from verified professionals.",
    icon: Home,
    color: "from-[#0a1c3a] to-[#1a2c5a]",
    ctas: [
      { label: "Post New Requirement", href: "/post-requirement", primary: true },
      { label: "Compare Bids", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Active Projects", key: "total_projects", icon: Briefcase, href: "/dashboard" },
      { label: "Received Bids", key: "received_bids_count", icon: FileText, href: "/dashboard" },
      { label: "Unread Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Professionals near you", key: "featured_listings", type: "listing" },
    ]
  },
  customer: {
    greeting: "Welcome back",
    tagline: "Post a requirement and receive multiple quotes from verified professionals.",
    icon: Home,
    color: "from-[#0a1c3a] to-[#1a2c5a]",
    ctas: [
      { label: "Post New Requirement", href: "/post-requirement", primary: true },
      { label: "Compare Bids", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Active Projects", key: "total_projects", icon: Briefcase, href: "/dashboard" },
      { label: "Received Bids", key: "received_bids_count", icon: FileText, href: "/dashboard" },
      { label: "Unread Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Professionals near you", key: "featured_listings", type: "listing" },
    ]
  },
  interior_designer: {
    greeting: "Find new clients today.",
    tagline: "Browse open interior design projects in your city and submit your best bid.",
    icon: Paintbrush,
    color: "from-violet-900 to-indigo-900",
    ctas: [
      { label: "Browse Projects", href: "/projects", primary: true },
      { label: "Update Portfolio", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Available Projects", key: "recommended_leads_count", icon: Search, href: "/projects" },
      { label: "Portfolio Views", key: "total_views", icon: TrendingUp, href: "/dashboard" },
      { label: "Unread Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Available Projects", key: "recommended_leads", type: "lead", empty: "No projects available right now." },
    ]
  },
  interior_company: {
    greeting: "Find new clients today.",
    tagline: "Browse open interior design projects in your city and submit your best bid.",
    icon: Paintbrush,
    color: "from-violet-900 to-indigo-900",
    ctas: [
      { label: "Browse Projects", href: "/projects", primary: true },
      { label: "Update Portfolio", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Available Projects", key: "recommended_leads_count", icon: Search, href: "/projects" },
      { label: "Portfolio Views", key: "total_views", icon: TrendingUp, href: "/dashboard" },
      { label: "Unread Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Available Projects", key: "recommended_leads", type: "lead", empty: "No projects available right now." },
    ]
  },
  contractor: {
    greeting: "Find Construction Projects Near You",
    tagline: "New renovation and construction requirements are posted daily. Be the first to bid.",
    icon: HardHat,
    color: "from-orange-900 to-amber-800",
    ctas: [
      { label: "Browse Projects", href: "/projects", primary: true },
      { label: "Create Labour Request", href: "/post-requirement" },
    ],
    quickCards: [
      { label: "New Client Leads", key: "recommended_leads_count", icon: Search, href: "/projects" },
      { label: "Project Updates", key: "total_inquiries", icon: ClipboardList, href: "/dashboard" },
      { label: "Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Available Projects", key: "recommended_leads", type: "lead", empty: "No projects available right now." },
      { title: "Nearby Suppliers", key: "featured_suppliers", type: "supplier", empty: "No suppliers near you." }
    ]
  },
  architect: {
    greeting: "Discover Architecture Projects",
    tagline: "Find residential and commercial projects seeking architectural expertise.",
    icon: Building,
    color: "from-slate-800 to-slate-700",
    ctas: [
      { label: "View Projects", href: "/projects", primary: true },
      { label: "My Workspace", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Available Projects", key: "recommended_leads_count", icon: Search, href: "/projects" },
      { label: "Portfolio Views", key: "total_views", icon: TrendingUp, href: "/dashboard" },
      { label: "Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Open Architecture Projects", key: "recommended_leads", type: "lead", empty: "No open projects right now." },
    ]
  },
  builder: {
    greeting: "Scale Your Development Business",
    tagline: "Find building and development opportunities across Bihar.",
    icon: Building,
    color: "from-blue-900 to-blue-800",
    ctas: [
      { label: "Create Builder Project", href: "/post-requirement", primary: true },
      { label: "Request Contractors", href: "/post-requirement" },
    ],
    quickCards: [
      { label: "Active Projects", key: "total_projects", icon: Building, href: "/dashboard" },
      { label: "Contractor Requests", key: "total_inquiries", icon: HardHat, href: "/dashboard" },
      { label: "Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Top Contractors", key: "featured_contractors", type: "listing", empty: "No top contractors found." },
      { title: "Top Suppliers", key: "featured_suppliers", type: "supplier", empty: "No top suppliers found." }
    ]
  },
  supplier: {
    greeting: "Connect with Buyers Directly",
    tagline: "Respond to material RFQs and grow your supply business.",
    icon: Truck,
    color: "from-green-900 to-emerald-800",
    ctas: [
      { label: "Browse Open RFQs", href: "/rfqs", primary: true },
      { label: "Upload Product", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Open RFQs", key: "recommended_leads_count", icon: Search, href: "/rfqs" },
      { label: "Quotes Pending", key: "total_inquiries", icon: ClipboardList, href: "/dashboard" },
      { label: "Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Open Material RFQs", key: "recommended_leads", type: "lead", empty: "No open RFQs right now." },
    ]
  },
  material_supplier: {
    greeting: "Connect with Buyers Directly",
    tagline: "Respond to material RFQs and grow your supply business.",
    icon: Truck,
    color: "from-green-900 to-emerald-800",
    ctas: [
      { label: "Browse Open RFQs", href: "/rfqs", primary: true },
      { label: "Upload Product", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Open RFQs", key: "recommended_leads_count", icon: Search, href: "/rfqs" },
      { label: "Quotes Pending", key: "total_inquiries", icon: ClipboardList, href: "/dashboard" },
      { label: "Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Open Material RFQs", key: "recommended_leads", type: "lead", empty: "No open RFQs right now." },
    ]
  },
  worker: {
    greeting: "Find Daily Work Near You",
    tagline: "Browse open job listings for skilled workers in your city. Apply instantly.",
    icon: Briefcase,
    color: "from-rose-900 to-red-800",
    ctas: [
      { label: "Browse Jobs", href: "/jobs", primary: true },
      { label: "Update Availability", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Nearby Jobs", key: "recommended_leads_count", icon: Search, href: "/jobs" },
      { label: "Applied Jobs", key: "submitted_bids_count", icon: ClipboardList, href: "/dashboard" },
      { label: "Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Available Job Listings in Your Area", key: "recommended_leads", type: "lead", empty: "No open jobs right now." },
    ]
  },
  skilled_worker: {
    greeting: "Find Daily Work Near You",
    tagline: "Browse open job listings for skilled workers in your city. Apply instantly.",
    icon: Briefcase,
    color: "from-rose-900 to-red-800",
    ctas: [
      { label: "Browse Jobs", href: "/jobs", primary: true },
      { label: "Update Availability", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Nearby Jobs", key: "recommended_leads_count", icon: Search, href: "/jobs" },
      { label: "Applied Jobs", key: "submitted_bids_count", icon: ClipboardList, href: "/dashboard" },
      { label: "Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Available Job Listings in Your Area", key: "recommended_leads", type: "lead", empty: "No open jobs right now." },
    ]
  },
  business: {
    greeting: "Manage Your Business",
    tagline: "Find leads, manage your profile, and grow your revenue.",
    icon: Briefcase,
    color: "from-slate-900 to-slate-800",
    ctas: [
      { label: "Go to Dashboard", href: "/dashboard", primary: true },
      { label: "Update Profile", href: "/dashboard" },
    ],
    quickCards: [
      { label: "Available Leads", key: "recommended_leads_count", icon: Search, href: "/projects" },
      { label: "Profile Views", key: "total_views", icon: TrendingUp, href: "/dashboard" },
      { label: "Messages", key: "unread_messages", icon: MessageSquare, href: "/messages" },
    ],
    feeds: [
      { title: "Available Leads", key: "recommended_leads", type: "lead", empty: "No new leads right now." },
    ]
  }
};

// ─── Feed Card ────────────────────────────────────────────────────────────────

function LeadCard({ item, role }: { item: any; role: string }) {
  const isWorkerJob = role === "worker" || role === "skilled_worker";
  return (
    <div className="premium-card rounded-xl p-4 group">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">
            {item.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
        </div>
        {(item.budget_min || item.budget_max || item.daily_rate || item.budget) && (
          <div className="shrink-0 text-right">
            <div className="text-xs text-slate-400">Budget</div>
            <div className="text-sm font-bold text-orange-600">
              {isWorkerJob
                ? `₹${item.daily_rate ?? "?"}/day`
                : item.budget_min
                ? `₹${(item.budget_min / 1000).toFixed(0)}k–₹${(item.budget_max / 1000).toFixed(0)}k`
                : `₹${item.budget}`}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          {item.city && (
            <span className="flex items-center text-xs text-slate-400">
              <MapPin className="w-3 h-3 mr-0.5" />
              {typeof item.city === "string" ? item.city : item.city?.name}
            </span>
          )}
          {item.category?.name && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {item.category.name}
            </span>
          )}
          {item.created_at && (
            <span className="flex items-center text-xs text-slate-400">
              <Clock className="w-3 h-3 mr-0.5" />
              {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
        <Link href={`/requirements/${item.id}?type=${item.material_type ? 'rfq' : item.skill_required ? 'job' : 'project'}`}>
          <button className="text-xs text-orange-600 font-semibold flex items-center hover:text-orange-700 transition-colors">
            View <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}

function ListingCard({ item }: { item: any }) {
  return (
    <div className="premium-card rounded-xl p-4 group flex gap-4 items-center">
      <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-white/10 flex-shrink-0 overflow-hidden">
        {item.image_url ? (
           <img src={item.image_url} alt={item.business_name} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">{item.business_name?.charAt(0)}</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">
          {item.business_name}
        </h4>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
          <span className="text-xs font-bold">{item.rating || '4.5'}</span>
          <span className="text-xs text-slate-400">({item.review_count || 0} reviews)</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
           <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.category?.name || "Professional"}</span>
        </div>
      </div>
      <Link href={`/professionals/${item.slug}`}>
        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-50 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function QuickStats({ stats, config }: { stats: any; config: any }) {
  if (!config.quickCards || config.quickCards.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
      {config.quickCards.map((s: any, i: number) => {
        const Icon = s.icon;
        return (
          <Link key={i} href={s.href}>
            <div className="premium-card rounded-xl p-4 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400">{s.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats[s.key] ?? 0}</div>
            </div>
          </Link>
        )
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RoleBasedHomepage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [dashData, setDashData] = useState<any>(null);
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Determine effective role
  const effectiveRole = (() => {
    if (!user) return null;
    const roles = user.roles as string[] | undefined;
    if (!roles || roles.length === 0) return user.role ?? "customer";
    // Priority order
    const priority = [
      "interior_designer", "interior_company", "contractor", "architect",
      "builder", "supplier", "material_supplier", "worker", "skilled_worker",
      "homeowner", "customer", "business"
    ];
    return priority.find((r) => roles.includes(r)) ?? user.role ?? "customer";
  })();

  const config = effectiveRole && ROLE_CONFIG[effectiveRole] ? ROLE_CONFIG[effectiveRole] : ROLE_CONFIG["customer"];

  useEffect(() => {
    if (!user || !config) return;
    setLoading(true);
    
    Promise.all([
      api.get("/user/dashboard").catch(() => null),
      api.get("/homepage").catch(() => null)
    ]).then(([dashRes, homeRes]) => {
      if (dashRes) setDashData(dashRes.data.data);
      if (homeRes) setHomeData(homeRes.data.data);
      setLoading(false);
    });
  }, [user]);

  if (!user || !config) return null;

  const Icon = config.icon;
  const firstName = user.name?.split(" ")[0] ?? "there";
  
  // Prepare stats
  const stats = {
    total_projects: dashData?.total_projects ?? 0,
    received_bids_count: dashData?.received_bids?.length ?? 0,
    unread_messages: dashData?.user?.unread_messages_count ?? 0,
    recommended_leads_count: dashData?.recommended_leads?.length ?? 0,
    total_views: dashData?.total_views ?? 0,
    total_inquiries: dashData?.total_inquiries ?? 0,
    submitted_bids_count: dashData?.submitted_bids?.length ?? 0,
  };

  // Prepare feed data sources
  const dataSources: Record<string, any[]> = {
    recommended_leads: dashData?.recommended_leads ?? [],
    featured_listings: homeData?.featured_listings ?? [],
    featured_contractors: (homeData?.featured_listings ?? []).filter((l: any) => l.category?.slug === 'contractor'),
    featured_architects: (homeData?.featured_listings ?? []).filter((l: any) => l.category?.slug === 'architect'),
    featured_suppliers: homeData?.featured_suppliers ?? [],
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-background min-h-screen pb-12">
      {/* ─── Personalized Hero ──────────────────────────────────── */}
      <div className={`w-full bg-gradient-to-r ${config.color} text-white`}>
        <div className="container mx-auto px-4 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/70 text-sm font-medium capitalize">
                {effectiveRole?.replace(/_/g, " ")}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">
              {config.greeting === "Welcome back"
                ? `Welcome back, ${firstName}! 👋`
                : config.greeting}
            </h2>
            <p className="text-white/75 text-sm md:text-base max-w-lg">{config.tagline}</p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 mt-5 w-full">
              {config.ctas.map((cta: any) => (
                <Link key={cta.label} href={cta.href} className="w-full sm:w-auto">
                  <button
                    className={`w-full sm:w-auto justify-center flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      cta.primary
                        ? "bg-[#E8701A] hover:bg-orange-500 text-white shadow-lg"
                        : "bg-white/15 hover:bg-white/25 text-white border border-white/30"
                    }`}
                  >
                    {cta.label} {cta.primary && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: verification nudge */}
          {!["site_verified", "verified_business", "trusted_professional", "elite_professional"].includes(
            (user as any).verification_level ?? ""
          ) && (
            <div className="hidden md:flex flex-col bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 max-w-xs gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-bold text-white">Get Verified & Rank Higher</span>
              </div>
              <p className="text-xs text-white/70">
                Verified profiles appear first in search results and display a trust badge that converts more clients.
              </p>
              <Link href="/dashboard">
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-xs font-bold py-2 rounded-lg transition">
                  Apply for Verification →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <QuickStats stats={stats} config={config} />

        {config.feeds?.map((feed: any, idx: number) => {
          const items = dataSources[feed.key] || [];
          
          return (
            <div key={idx} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{feed.title}</h3>
                <Link href={feed.type === 'listing' ? '/professionals' : feed.type === 'supplier' ? '/materials' : '/dashboard'} className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="premium-card rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full mb-3" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.slice(0, 6).map((item: any, i: number) => (
                    feed.type === 'lead' ? (
                      <LeadCard key={item.id || i} item={item} role={effectiveRole!} />
                    ) : (
                      <ListingCard key={item.id || i} item={item} />
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 dark:text-gray-500 premium-card rounded-xl">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">{feed.empty || "No items to show."}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
