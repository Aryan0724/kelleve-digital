"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Briefcase, Wallet, ChevronRight,
  FileText, Search, HardHat, Truck, Building, Paintbrush,
  ArrowRight, Star, IndianRupee, Clock, Users, TrendingUp,
  MessageSquare, PenTool, Home, LayoutDashboard, ClipboardList
} from "lucide-react";
import { EducationalBlogsFeed } from "@/components/shared/EducationalBlogsFeed";
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
      { label: "Update Portfolio", href: "/dashboard?tab=portfolio" },
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
      { label: "Update Portfolio", href: "/dashboard?tab=portfolio" },
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
      { label: "Upload Product", href: "/dashboard?tab=portfolio" },
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
      { label: "Upload Product", href: "/dashboard?tab=portfolio" },
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
      { label: "Update Availability", href: "/dashboard?tab=profile" },
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
      { label: "Update Availability", href: "/dashboard?tab=profile" },
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
      { label: "Update Profile", href: "/dashboard?tab=business_profile" },
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

// ─── Ads Banner ───────────────────────────────────────────────────────────────

function AdsBanner({ role, location }: { role: string; location: string }) {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.get(`/advertisements?location=${location}&target_role=${role}`);
        if (res.data?.data) {
          setAds(res.data.data);
          // Track impressions
          res.data.data.forEach((ad: any) => {
            api.post(`/advertisements/${ad.id}/impression`).catch(() => {});
          });
        }
      } catch (err) {
        console.error("Failed to load ads", err);
      }
    };
    fetchAds();
  }, [role, location]);

  if (ads.length === 0) return null;

  return (
    <div className="w-full mb-10 space-y-4">
      {ads.map((ad) => (
        <a 
          key={ad.id} 
          href={ad.link || "#"} 
          target="_blank" 
          rel="noreferrer"
          className="block w-full rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-xl transition-all"
          onClick={() => {
            api.post(`/advertisements/${ad.id}/click`).catch(() => {});
          }}
        >
          {ad.media_type === 'image' && ad.banner_url ? (
            <div className="w-full h-32 md:h-48 relative">
              <img src={ad.banner_url} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow mb-2 inline-block">Sponsored</span>
                <h4 className="text-white font-bold text-lg md:text-xl drop-shadow-md">{ad.title}</h4>
              </div>
            </div>
          ) : (
            <div className="w-full p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-900 border border-orange-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider mb-1 block">Sponsored</span>
                <h4 className="text-slate-900 dark:text-white font-bold text-lg md:text-xl">{ad.title}</h4>
              </div>
              <ChevronRight className="w-6 h-6 text-orange-500" />
            </div>
          )}
        </a>
      ))}
    </div>
  );
}

// ─── Feed Card ────────────────────────────────────────────────────────────────

function LeadCard({ item, role }: { item: any; role: string }) {
  const isWorkerJob = role === "worker" || role === "skilled_worker";
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
      
      <div>
        <div className="flex justify-between items-start gap-4 mb-3 relative z-10">
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded">
                {isWorkerJob ? "Job" : item.material_type ? "RFQ" : "Project"}
              </span>
              {item.category?.name && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded line-clamp-1">
                  {item.category.name}
                </span>
              )}
            </div>
          </div>
          
          {(item.budget_min || item.budget_max || item.daily_rate || item.budget) && (
            <div className="shrink-0 text-right bg-orange-50 dark:bg-slate-800 rounded-lg p-2 border border-orange-100 dark:border-slate-700">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Budget</div>
              <div className="text-sm font-black text-orange-600 dark:text-orange-500">
                {isWorkerJob
                  ? `₹${item.daily_rate ?? "?"}/day`
                  : item.budget_min
                  ? `₹${(item.budget_min / 1000).toFixed(0)}k–₹${(item.budget_max / 1000).toFixed(0)}k`
                  : `₹${item.budget}`}
              </div>
            </div>
          )}
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed relative z-10">{item.description}</p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {item.city && (
            <span className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {typeof item.city === "string" ? item.city : item.city?.name}
            </span>
          )}
          {item.created_at && (
            <span className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
        <Link href={`/requirements/${item.id}?type=${item.material_type ? 'rfq' : item.skill_required ? 'job' : 'project'}`}>
          <button className="text-xs text-white bg-slate-900 dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-lg font-bold flex items-center hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-colors">
            View Details <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}

function ListingCard({ item }: { item: any }) {
  const pfp = item.user?.avatar || item.cover_image || item.image_url;
  const name = item.title || item.business_name || item.user?.name || "Professional";

  return (
    <div className="premium-card rounded-xl p-4 group flex gap-4 items-center">
      <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-white/10 flex-shrink-0 overflow-hidden">
        {pfp ? (
           <img src={pfp} alt={name} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">{name.charAt(0)}</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">
          {name}
        </h4>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
          <span className="text-xs font-bold">{(item.avg_rating ? item.avg_rating.toFixed(1) : item.rating) || '0.0'}</span>
          <span className="text-xs text-slate-400">({item.review_count || 0} reviews)</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
           <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.category?.name || "Professional"}</span>
        </div>
      </div>
      <Link href={`/professionals/${item.slug || ''}`}>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-12 -mt-8 relative z-20 px-0 sm:px-4">
      {config.quickCards.map((s: any, i: number) => {
        const Icon = s.icon;
        const val = stats[s.key] ?? 0;
        return (
          <Link key={i} href={s.href} className="group">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none h-full flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-orange-200 dark:group-hover:border-orange-900/50">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-md flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{val}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
              </div>
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
      <div className={`w-full bg-gradient-to-r ${config.color} text-white relative overflow-hidden`}>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="container mx-auto px-4 pt-12 pb-24 md:pt-16 md:pb-28 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex-1 w-full max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-inner">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/80 text-sm font-semibold tracking-wide uppercase">
                {effectiveRole?.replace(/_/g, " ")} Workspace
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
              {config.greeting === "Welcome back"
                ? `Welcome back, ${firstName}! 👋`
                : config.greeting}
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mb-8">{config.tagline}</p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 w-full">
              {config.ctas.map((cta: any, idx: number) => (
                <Link key={cta.label} href={cta.href} className="w-full sm:w-auto">
                  <button
                    className={`w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      cta.primary
                        ? "bg-gradient-to-r from-orange-500 to-[#E8701A] hover:from-orange-400 hover:to-orange-500 text-white shadow-xl hover:shadow-orange-500/25 hover:-translate-y-0.5"
                        : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 hover:border-white/40"
                    }`}
                  >
                    {cta.label} {cta.primary && <ArrowRight className="w-4 h-4" />}
                  </button>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Rich Right-Side Widget to fill empty space */}
          <div className="hidden lg:block w-full max-w-sm">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-20 blur-2xl rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-white font-bold text-lg">Market Pulse</h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-4 hover:bg-black/30 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white/60 text-xs font-medium mb-1">Active Professionals</div>
                    <div className="text-white font-bold text-lg">2,450+</div>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-4 hover:bg-black/30 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-300">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white/60 text-xs font-medium mb-1">Open Projects Today</div>
                    <div className="text-white font-bold text-lg">142</div>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-4 hover:bg-black/30 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white/60 text-xs font-medium mb-1">Avg. Project Value</div>
                    <div className="text-white font-bold text-lg">₹4.5L</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdsBanner role={effectiveRole!} location="mid_page" />

        <QuickStats stats={stats} config={config} />

        <EducationalBlogsFeed role={effectiveRole!} />

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
                <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => router.push(feed.type === 'listing' ? '/professionals' : '/projects')}>
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Nothing here yet</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">{feed.empty || "There are no matches right now, but things change fast. Explore our main directories in the meantime."}</p>
                  <button className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg text-sm hover:bg-slate-800 dark:hover:bg-white transition-colors shadow-md shadow-slate-900/10">
                    Explore Directory
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
