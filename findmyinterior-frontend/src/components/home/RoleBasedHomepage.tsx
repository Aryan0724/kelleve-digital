"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Briefcase, ShieldCheck, Wallet, ChevronRight,
  FileText, Search, HardHat, Truck, Building, Paintbrush,
  ArrowRight, Star, IndianRupee, Clock, Users, TrendingUp
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";

// ─── Role Config ────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, {
  greeting: string;
  tagline: string;
  icon: any;
  color: string;
  ctas: { label: string; href: string; primary?: boolean }[];
  feedTitle: string;
  feedEmptyText: string;
}> = {
  interior_designer: {
    greeting: "Your Next Project Is Waiting",
    tagline: "Browse open interior design projects in your city and submit your best bid.",
    icon: Paintbrush,
    color: "from-violet-900 to-indigo-900",
    ctas: [
      { label: "Browse All Projects", href: "/dashboard", primary: true },
      { label: "Go to Dashboard", href: "/dashboard" },
    ],
    feedTitle: "Open Interior Design Projects",
    feedEmptyText: "No open projects right now. Check back soon!",
  },
  interior_company: {
    greeting: "Your Next Project Is Waiting",
    tagline: "Browse open interior design projects in your city and submit your best bid.",
    icon: Paintbrush,
    color: "from-violet-900 to-indigo-900",
    ctas: [
      { label: "Browse All Projects", href: "/dashboard", primary: true },
      { label: "Go to Dashboard", href: "/dashboard" },
    ],
    feedTitle: "Open Interior Projects",
    feedEmptyText: "No open projects right now.",
  },
  contractor: {
    greeting: "Find Construction Projects Near You",
    tagline: "New renovation and construction requirements are posted daily. Be the first to bid.",
    icon: HardHat,
    color: "from-orange-900 to-amber-800",
    ctas: [
      { label: "View Open Projects", href: "/dashboard", primary: true },
      { label: "My Workspace", href: "/dashboard" },
    ],
    feedTitle: "Open Construction & Renovation Projects",
    feedEmptyText: "No open projects in your area right now.",
  },
  architect: {
    greeting: "Discover Architecture Projects",
    tagline: "Find residential and commercial projects seeking architectural expertise.",
    icon: Building,
    color: "from-slate-800 to-slate-700",
    ctas: [
      { label: "View Projects", href: "/dashboard", primary: true },
      { label: "My Workspace", href: "/dashboard" },
    ],
    feedTitle: "Open Architecture Projects",
    feedEmptyText: "No open projects right now.",
  },
  builder: {
    greeting: "Scale Your Development Business",
    tagline: "Find building and development opportunities across Bihar.",
    icon: Building,
    color: "from-blue-900 to-blue-800",
    ctas: [
      { label: "View Requirements", href: "/dashboard", primary: true },
      { label: "My Portal", href: "/dashboard" },
    ],
    feedTitle: "Open Building Requirements",
    feedEmptyText: "No open building requirements right now.",
  },
  supplier: {
    greeting: "Connect with Buyers Directly",
    tagline: "Respond to material RFQs and grow your supply business across Bihar.",
    icon: Truck,
    color: "from-green-900 to-emerald-800",
    ctas: [
      { label: "Browse Open RFQs", href: "/dashboard", primary: true },
      { label: "My Dashboard", href: "/dashboard" },
    ],
    feedTitle: "Open Material RFQs",
    feedEmptyText: "No open RFQs right now.",
  },
  material_supplier: {
    greeting: "Connect with Buyers Directly",
    tagline: "Respond to material RFQs and grow your supply business across Bihar.",
    icon: Truck,
    color: "from-green-900 to-emerald-800",
    ctas: [
      { label: "Browse Open RFQs", href: "/dashboard", primary: true },
      { label: "My Dashboard", href: "/dashboard" },
    ],
    feedTitle: "Open Material RFQs",
    feedEmptyText: "No open RFQs right now.",
  },
  worker: {
    greeting: "Find Daily Work Near You",
    tagline: "Browse open job listings for skilled workers in your city. Apply instantly.",
    icon: Briefcase,
    color: "from-rose-900 to-red-800",
    ctas: [
      { label: "Browse Job Listings", href: "/workers", primary: true },
      { label: "My Dashboard", href: "/dashboard" },
    ],
    feedTitle: "Available Job Listings in Your Area",
    feedEmptyText: "No open jobs right now. Check back soon!",
  },
  skilled_worker: {
    greeting: "Find Daily Work Near You",
    tagline: "Browse open job listings for skilled workers in your city. Apply instantly.",
    icon: Briefcase,
    color: "from-rose-900 to-red-800",
    ctas: [
      { label: "Browse Job Listings", href: "/workers", primary: true },
      { label: "My Dashboard", href: "/dashboard" },
    ],
    feedTitle: "Available Job Listings in Your Area",
    feedEmptyText: "No open jobs right now.",
  },
  homeowner: {
    greeting: "Welcome back",
    tagline: "Post a requirement and receive multiple quotes from verified professionals.",
    icon: FileText,
    color: "from-[#0a1c3a] to-[#1a2c5a]",
    ctas: [
      { label: "Post New Project", href: "/post-requirement", primary: true },
      { label: "View My Projects", href: "/dashboard" },
    ],
    feedTitle: "Featured Professionals Near You",
    feedEmptyText: "",
  },
  customer: {
    greeting: "Welcome back",
    tagline: "Post a requirement and receive multiple quotes from verified professionals.",
    icon: FileText,
    color: "from-[#0a1c3a] to-[#1a2c5a]",
    ctas: [
      { label: "Post New Project", href: "/post-requirement", primary: true },
      { label: "View My Projects", href: "/dashboard" },
    ],
    feedTitle: "Featured Professionals Near You",
    feedEmptyText: "",
  },
};

// ─── Feed Card ────────────────────────────────────────────────────────────────

function FeedCard({ item, role }: { item: any; role: string }) {
  const isWorkerJob = role === "worker" || role === "skilled_worker";
  const isRFQ = role === "supplier" || role === "material_supplier";

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5 group">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-orange-600 transition-colors">
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
        <Link href={`/requirements/${item.id}`}>
          <button className="text-xs text-orange-600 font-semibold flex items-center hover:text-orange-700 transition-colors">
            View <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function QuickStats({ data, role }: { data: any; role: string }) {
  const stats = [];

  if (data?.user?.wallet_balance !== undefined) {
    stats.push({ label: "Wallet", value: `₹${data.user.wallet_balance}`, icon: Wallet, href: "/dashboard" });
  }
  if (data?.total_views !== undefined) {
    stats.push({ label: "Profile Views", value: data.total_views, icon: TrendingUp, href: "/dashboard" });
  }
  if (data?.submitted_bids?.length !== undefined) {
    stats.push({ label: "Active Bids", value: data.submitted_bids.length, icon: FileText, href: "/dashboard" });
  }
  if (data?.recommended_leads?.length !== undefined) {
    stats.push({ label: "Available Leads", value: data.recommended_leads.length, icon: Search, href: "/dashboard" });
  }

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.slice(0, 4).map((s, i) => (
        <Link key={i} href={s.href}>
          <div className="bg-white border border-slate-100 rounded-xl p-3 hover:shadow-sm hover:border-orange-200 transition-all cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{s.value}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RoleBasedHomepage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [dashData, setDashData] = useState<any>(null);
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
      "homeowner", "customer"
    ];
    return priority.find((r) => roles.includes(r)) ?? user.role ?? "customer";
  })();

  const config = effectiveRole ? ROLE_CONFIG[effectiveRole] : null;

  useEffect(() => {
    if (!user || !config) return;
    setLoading(true);
    api
      .get("/user/dashboard")
      .then((r) => setDashData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || !config) return null;

  const Icon = config.icon;
  const firstName = user.name?.split(" ")[0] ?? "there";
  const leads: any[] = dashData?.recommended_leads ?? [];
  const isCustomerRole = effectiveRole === "homeowner" || effectiveRole === "customer";

  return (
    <div className="w-full bg-slate-50 border-b">
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
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {config.ctas.map((cta) => (
                <Link key={cta.label} href={cta.href}>
                  <button
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
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

      {/* ─── Feed ───────────────────────────────────────────────── */}
      {!isCustomerRole && (
        <div className="container mx-auto px-4 py-6">
          {dashData && <QuickStats data={dashData} role={effectiveRole!} />}

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">{config.feedTitle}</h3>
            <Link href="/dashboard" className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-full mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : leads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {leads.slice(0, 6).map((item) => (
                <FeedCard key={item.id} item={item} role={effectiveRole!} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-100">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{config.feedEmptyText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
