import Image from "next/image";
import { 
  Search, MapPin, CheckCircle, Users, Building, Grid, Search as SearchIcon, 
  Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone, 
  Sparkles, MoreHorizontal, Store, Megaphone, MessageCircle, CreditCard, 
  Presentation, BookOpen, Truck, Scissors, Home as HomeIcon, Wrench, 
  Briefcase, Landmark, Calendar, ShoppingBag, ShieldCheck, PhoneCall, 
  ArrowRight, Star, Award, Download, Globe, ShieldAlert, ChevronRight,
  HeartHandshake, Gem, Flame, Zap
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PostRequirementButton from "@/components/PostRequirementButton";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import HomeLocationBanner from "@/components/home/HomeLocationBanner";
import LiveBusinessesGrid from "@/components/home/LiveBusinessesGrid";
import PlatformPulseCounter from "@/components/home/PlatformPulseCounter";

import { TrueDialAPI } from "@/lib/api";

export default async function Home() {
  const [offersResponse, listingsResponse] = await Promise.all([
    TrueDialAPI.getPublicOffers(),
    TrueDialAPI.getListings()
  ]);

  const topOffers = offersResponse.success ? offersResponse.data.data.slice(0, 4) : [];
  const topBusinesses = listingsResponse.success ? (Array.isArray(listingsResponse.data) ? listingsResponse.data.slice(0, 8) : (listingsResponse.data?.data || []).slice(0, 8)) : [];
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc] dark:bg-slate-950 text-navy dark:text-white transition-colors duration-300">
      <Navbar />

      {/* 1. HERO SECTION WITH LOCATION BANNER & TRENDING PILLS */}
      <section className="bg-gradient-to-br from-blue-50/80 via-orange-50/60 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-16 px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden border-b border-gray-200/60 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="z-10 max-w-4xl w-full text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy dark:text-white leading-tight mb-4 tracking-tight">
            Search Across <span className="text-primary bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 bg-clip-text text-transparent">50,000+</span> Verified Businesses &amp; Studios
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Find verified Interior Designers, Architects, Restaurants, Hotels, Doctors, and B2B Wholesalers in your city with guaranteed reviews &amp; VIP Privilege discounts.
          </p>

          {/* Interactive Search Bar Component */}
          <HomeSearchBar />

          {/* LOCATION & CITY DISPLAY BANNER */}
          <HomeLocationBanner />

          {/* Lead Generation Button */}
          <div className="mt-6 flex justify-center">
            <PostRequirementButton />
          </div>
          
          {/* Trending Searches */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <span>Trending Now:</span>
            </span>
            {[
              { label: "Interior Designers", cat: "Interior Designers", tag: "🔥 Hot" },
              { label: "Restaurants", cat: "Restaurants", tag: "⭐ Top" },
              { label: "Hotels & Resorts", cat: "Hotels" },
              { label: "Architects", cat: "Architects" },
              { label: "Hospitals", cat: "Hospitals" },
              { label: "Packers & Movers", cat: "Packers & Movers" },
              { label: "B2B Wholesalers", cat: "B2B", tag: "⚡ Direct" },
            ].map((trend, idx) => (
              <Link key={idx} href={`/search?category=${encodeURIComponent(trend.cat)}`}>
                <span className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm rounded-full cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-primary dark:hover:text-primary hover:border-primary/40 font-semibold transition inline-flex items-center gap-1.5">
                  <span>{trend.label}</span>
                  {trend.tag && (
                    <span className="text-[10px] font-extrabold text-primary bg-orange-100 dark:bg-orange-950 px-1.5 py-0.5 rounded-full">
                      {trend.tag}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM PULSE COUNTER STATS BAR */}
      <PlatformPulseCounter />

      {/* 2. PROMOTIONAL FEATURE CARDS / HERO HIGHLIGHTS (SWIPER PARITY) */}
      <section className="py-10 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Find My Interior Integration */}
          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-navy via-slate-900 to-slate-950 text-white shadow-xl flex flex-col justify-between border border-slate-700/60 group hover:shadow-2xl hover:shadow-orange-500/10 transition duration-500">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-500/25 rounded-full blur-2xl group-hover:bg-orange-500/40 transition duration-500"></div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-400 mb-4 border border-white/10 shadow-inner">
                <HardHat className="w-3.5 h-3.5" />
                <span>Find My Interior Showcase</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2.5 leading-tight">Verified Interior &amp; Architectural Studios</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Explore 3D models, Vastu-compliant designs, and get 3 Free Consultations from certified interior designers.
              </p>
            </div>
            <Link href="/search?category=Interior+Designers">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition duration-300 text-sm">
                <span>Explore Studios</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Card 2: TrueDial VIP Privilege Card */}
          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-amber-600 via-orange-600 to-primary text-white shadow-xl flex flex-col justify-between border border-orange-400/30 group hover:shadow-2xl hover:shadow-amber-500/20 transition duration-500">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-yellow-400/25 rounded-full blur-2xl group-hover:bg-yellow-400/40 transition duration-500"></div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-yellow-200 mb-4 border border-white/20 shadow-inner">
                <Gem className="w-3.5 h-3.5" />
                <span>TrueDial VIP Club</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2.5 leading-tight">Multi-City VIP Privilege Card</h3>
              <p className="text-orange-100 text-sm leading-relaxed mb-6">
                One VIP Card. Unlimited benefits. Enjoy up to 50% discounts across 500+ restaurants, hotels &amp; healthcare clinics.
              </p>
            </div>
            <Link href="/offers">
              <button className="inline-flex items-center gap-2 bg-white text-navy hover:bg-orange-50 font-bold px-6 py-3.5 rounded-xl shadow-lg transition duration-300 text-sm">
                <span>Claim VIP Card</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Card 3: TrueDial B2B & Wholesale */}
          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col justify-between border border-emerald-700/60 group hover:shadow-2xl hover:shadow-emerald-500/10 transition duration-500">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-400/25 rounded-full blur-2xl group-hover:bg-emerald-400/40 transition duration-500"></div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-emerald-300 mb-4 border border-white/10 shadow-inner">
                <Briefcase className="w-3.5 h-3.5" />
                <span>TrueDial B2B Supply</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2.5 leading-tight">Direct Wholesale &amp; Manufacturing</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                Source commercial building materials, machinery, office decor &amp; hotel supplies directly from verified manufacturers.
              </p>
            </div>
            <Link href="/search?category=B2B">
              <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition duration-300 text-sm">
                <span>Browse B2B Sourcing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. PRIMARY 16-CATEGORY GRID (LIVELY BADGES & HOVER BORDERS) */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-primary uppercase tracking-wider">Top Categories</span>
                <span className="text-[10px] bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-400 font-bold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                  ● 500+ Live Categories
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white mt-1">Explore All Services &amp; Categories</h3>
            </div>
            <Link href="/categories" className="text-primary font-bold hover:underline text-sm flex items-center gap-1 group">
              <span>View All 500+ Categories</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-4 sm:gap-5">
            {[
              { name: "Restaurants", icon: Utensils, color: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400", q: "Restaurants", badge: "🔥 Hot" },
              { name: "Hotels & Stays", icon: Hotel, color: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400", q: "Hotels", badge: "⭐ Top" },
              { name: "Hospitals", icon: PlusSquare, color: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400", q: "Hospitals", badge: "⚡ 24x7" },
              { name: "Education", icon: GraduationCap, color: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400", q: "Education" },
              { name: "Interior Design", icon: HardHat, color: "bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400", q: "Interior Designers", badge: "🔥 Hot" },
              { name: "Real Estate", icon: HomeIcon, color: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400", q: "Real Estate" },
              { name: "Packers & Movers", icon: Truck, color: "bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400", q: "Packers & Movers", badge: "⚡ Instant" },
              { name: "Salon & Spa", icon: Scissors, color: "bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400", q: "Salon & Spa" },
              { name: "Architects", icon: Building, color: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400", q: "Architects", badge: "⭐ Verified" },
              { name: "Modular Kitchen", icon: Grid, color: "bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400", q: "Modular Kitchen" },
              { name: "Repair Services", icon: Wrench, color: "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400", q: "Repair & Services" },
              { name: "B2B Wholesalers", icon: Briefcase, color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400", q: "B2B", badge: "💎 Direct" },
              { name: "Wedding Planning", icon: Calendar, color: "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400", q: "Wedding Planning" },
              { name: "Loans & Finance", icon: Landmark, color: "bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400", q: "Loans & Finance" },
              { name: "Daily Needs", icon: ShoppingBag, color: "bg-lime-100 dark:bg-lime-950 text-lime-600 dark:text-lime-400", q: "Daily Needs" },
              { name: "More", icon: MoreHorizontal, color: "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400", link: "/categories" },
            ].map((cat, i) => (
              cat.link ? (
                <Link href={cat.link} key={i}>
                  <div className="relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl hover:bg-orange-50/60 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer group text-center gap-2.5 border border-transparent hover:border-orange-200 dark:hover:border-slate-700 hover:-translate-y-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-1">{cat.name}</span>
                  </div>
                </Link>
              ) : (
                <Link href={`/search?category=${encodeURIComponent(cat.q || '')}`} key={i}>
                  <div className="relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl hover:bg-orange-50/60 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer group text-center gap-2.5 border border-transparent hover:border-orange-200 dark:hover:border-slate-700 hover:-translate-y-1">
                    {cat.badge && (
                      <span className="absolute top-1.5 right-1 text-[9px] font-extrabold text-primary bg-orange-100 dark:bg-orange-950/80 px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800 shadow-sm">
                        {cat.badge}
                      </span>
                    )}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-1">{cat.name}</span>
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUEDIAL B2B & WHOLESALE MARKETPLACE (JD-MART PARITY) */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Direct Sourcing</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white mt-1">TrueDial B2B &amp; Wholesale Marketplace</h3>
          </div>
          <Link href="/search?category=B2B" className="text-primary font-bold hover:underline text-sm flex items-center gap-1 mt-2 sm:mt-0 group">
            <span>Explore All Wholesale Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Building & Construction",
              subtitle: "Cement, Steel, Bricks, Tiles & Sanitaryware",
              tag: "Bulk Wholesale",
              icon: Building,
              color: "bg-amber-500",
              link: "/search?category=Building+Materials"
            },
            {
              title: "Modular Furniture & Office Decor",
              subtitle: "Workstations, Acoustics & Ergonomic Chairs",
              tag: "Factory Direct",
              icon: Grid,
              color: "bg-blue-600",
              link: "/search?category=Office+Furniture"
            },
            {
              title: "Commercial Kitchen Equipment",
              subtitle: "Industrial Ovens, Refrigeration & Cutlery",
              tag: "Top Brands",
              icon: Utensils,
              color: "bg-emerald-600",
              link: "/search?category=Kitchen+Equipment"
            },
            {
              title: "Electricals, Lighting & Hardware",
              subtitle: "Industrial Cables, LED Fixtures & Generators",
              tag: "Verified Suppliers",
              icon: Wrench,
              color: "bg-purple-600",
              link: "/search?category=Electricals"
            }
          ].map((item, idx) => (
            <Link key={idx} href={item.link}>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group flex flex-col justify-between h-full hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 text-primary border border-orange-200 dark:border-orange-800">
                      {item.tag}
                    </span>
                    <div className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-navy dark:text-white mb-2 group-hover:text-primary transition">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{item.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 text-primary text-xs font-bold mt-2">
                  <span>Get Best Quotes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. EXPLORE TOP VERIFIED BUSINESSES & STUDIOS (LIVE INTERACTIVE GRID WITH TABS) */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Top Rated &amp; Live Near You</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white mt-1">Explore Top Verified Businesses &amp; Studios</h3>
          </div>
          <Link href="/search" className="text-primary font-bold hover:underline text-sm flex items-center gap-1 mt-2 sm:mt-0 group">
            <span>View All Verified Listings</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Interactive Filter Tabs + Lively Cards with Online Now status */}
        <LiveBusinessesGrid businesses={topBusinesses} />
      </section>

      {/* 6. POPULAR LOCAL SERVICES BY SECTOR (CURATED SECTORS) */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white mb-2">Most Trusted Local Services by Sector</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Quick links to verified experts across home, health, transport, and professional consulting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Home Renovation & Interiors",
              items: ["Interior Designers", "Modular Kitchens", "Vastu Consultants", "Architectural Studios", "Renovation Contractors"],
              icon: HardHat,
              color: "text-orange-500 bg-orange-50 dark:bg-orange-950/40"
            },
            {
              title: "Health & Wellness Specialists",
              items: ["Certified Dentists", "Multi-Specialty Hospitals", "Diagnostic Centers", "Physiotherapy Clinics", "Fitness Centers & Gyms"],
              icon: PlusSquare,
              color: "text-red-500 bg-red-50 dark:bg-red-950/40"
            },
            {
              title: "Daily Essentials & Transport",
              items: ["Packers & Movers", "Reliable Car Servicing", "Legal & Tax Advisors", "Event Organizers", "Chartered Accountants"],
              icon: Truck,
              color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
            },
            {
              title: "Hospitality & Stays",
              items: ["Luxury Hotels & Resorts", "Fine Dining Restaurants", "Banquet Halls", "Corporate Guest Houses", "Catering Services"],
              icon: Hotel,
              color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
            }
          ].map((sector, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sector.color} shrink-0`}>
                  <sector.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-navy dark:text-white leading-tight">{sector.title}</h4>
              </div>
              <ul className="space-y-2.5">
                {sector.items.map((item, j) => (
                  <li key={j}>
                    <Link href={`/search?category=${encodeURIComponent(item)}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary flex items-center justify-between group">
                      <span>{item}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SIGNATURE FEATURE: MULTI-CITY PRIVILEGE CARD VIP BANNER */}
      <section className="py-8 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-navy via-slate-900 to-navy dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
                <Award className="w-4 h-4" />
                <span>TrueDial Signature Membership</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                Get Your <span className="text-amber-400">Multi-City VIP Privilege Card</span>
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
                Enjoy guaranteed savings across dining, luxury stays, interior consultations, and health clinics in over 50 cities across India. One card for you and your family.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Up to 50% Off Dining &amp; Spa</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Free Interior 3D Design Consult</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Priority Healthcare Diagnostics</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/offers">
                  <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition text-base flex items-center justify-center gap-2">
                    <span>Claim Your Privilege Card</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/dashboard/user">
                  <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-4 rounded-xl transition text-base">
                    <span>View Member Guide</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* VIP Card Graphic */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-80 h-48 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-500 p-6 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden transform md:rotate-3 hover:rotate-0 transition duration-500 border border-white/30">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-100">TrueDial VIP Club</span>
                    <h4 className="font-extrabold text-xl mt-0.5">PRIVILEGE CARD</h4>
                  </div>
                  <Award className="w-8 h-8 text-amber-200 opacity-80" />
                </div>
                <div className="my-3">
                  <div className="text-xs text-amber-100">MEMBER ID</div>
                  <div className="font-mono text-lg font-bold tracking-widest">TD-VIP-88219-MUM</div>
                </div>
                <div className="flex justify-between items-end text-xs">
                  <div>
                    <div className="text-amber-100">VALID ACROSS</div>
                    <div className="font-bold">50+ CITIES IN INDIA</div>
                  </div>
                  <span className="font-extrabold text-sm bg-white/20 px-2 py-1 rounded">VIP GOLD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TODAY'S BEST OFFERS & DEALS */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Verified Discounts</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white mt-1">Today&apos;s Best Offers &amp; Discounts</h3>
          </div>
          <Link href="/offers" className="text-primary font-bold hover:underline text-sm flex items-center gap-1 group">
            <span>View All Offers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {topOffers.length > 0 ? (
            topOffers.map((offer: any) => (
              <div key={offer.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                <div className={`h-40 w-full relative bg-gray-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center`}>
                  {offer.media && offer.media.length > 0 ? (
                    <img src={offer.media[0].url} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-gray-400 dark:text-gray-600 text-sm font-medium">No Image</span>
                  )}
                  {offer.discount_type && offer.discount_value && (
                    <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-bold text-navy dark:text-white text-base leading-tight mb-1 line-clamp-1 group-hover:text-primary transition" title={offer.title}>{offer.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{offer.listing?.category || 'General'}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto mb-4">Valid Till: {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : 'Ongoing'}</p>
                  <Link href={`/businesses/${offer.listing?.slug || '#'}`}>
                    <button className="w-full bg-orange-50 dark:bg-orange-950/50 text-primary font-bold py-2.5 rounded-xl hover:bg-primary hover:text-white transition text-xs">
                      View Offer &amp; Profile
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-10 text-gray-500 dark:text-gray-400">
              No active offers found. Check back later!
            </div>
          )}
        </div>
      </section>

      {/* 9. POWERFUL SOLUTIONS FOR BUSINESS GROWTH (VENDOR ECOSYSTEM) */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full bg-white dark:bg-slate-900 rounded-3xl mb-12 shadow-sm border border-gray-100 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Grow With Us</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white mt-1">Powerful Solutions for Your Business Growth</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Get discovered by thousands of customers, manage leads, and scale your brand with TrueDial</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {[
            { title: "Business Listing", icon: Store, desc: "Get discovered by thousands of potential customers in your city.", link: "/free-listing" },
            { title: "Digital Marketing", icon: Megaphone, desc: "Grow your business with our targeted digital marketing campaigns.", link: "/dashboard/business/marketing" },
            { title: "SMS & WhatsApp", icon: MessageCircle, desc: "Reach your customers directly with powerful automated alerts.", link: "/dashboard/business/marketing" },
            { title: "Privilege Card Partner", icon: CreditCard, desc: "Increase customer loyalty by joining our VIP discount program.", link: "/dashboard/vendor/privilege-cards" },
            { title: "Business Consulting", icon: Presentation, desc: "Expert guidance for company startup, trademark & registration.", link: "/consulting" },
            { title: "TD Academy", icon: BookOpen, desc: "Learn, grow and build your team with certified industry courses.", link: "/academy" },
          ].map((sol, i) => (
            <Link key={i} href={sol.link}>
              <div className="flex flex-col items-center p-5 border border-gray-100 dark:border-slate-800 rounded-2xl hover:shadow-lg transition group bg-gray-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 h-full hover:-translate-y-1">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition duration-300">
                  <sol.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-navy dark:text-white mb-2 group-hover:text-primary transition">{sol.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{sol.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 10. DOWNLOAD THE TRUEDIAL MOBILE APP BANNER (JD-APP PARITY) */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-900 via-navy to-slate-900 dark:from-slate-900 dark:to-slate-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
              <Download className="w-4 h-4" />
              <span>Available on iOS &amp; Android</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Download the <span className="text-primary">TrueDial App</span> for Smart Local Search &amp; VIP Perks
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              Get instant quotes, call verified businesses offline, and unlock exclusive app-only Privilege Card discounts anywhere you go.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-navy font-bold px-6 py-3.5 rounded-xl hover:bg-gray-100 transition shadow-lg text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>Download on iOS</span>
              </button>
              <button className="bg-primary hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-lg text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Get Android APK</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center flex flex-col items-center">
            <div className="w-32 h-32 bg-white rounded-xl p-2 mb-3 flex items-center justify-center shadow-inner">
              {/* QR Code graphic */}
              <div className="w-full h-full bg-gradient-to-tr from-navy to-primary rounded-lg flex items-center justify-center text-white font-bold text-xs text-center p-2">
                SCAN TO DOWNLOAD
              </div>
            </div>
            <span className="text-xs font-bold text-gray-200">Scan QR Code with Phone</span>
            <span className="text-[11px] text-gray-400 mt-1">Supports iOS &amp; Android devices</span>
          </div>
        </div>
      </section>

      {/* 11. MULTI-CITY DIRECTORY SEO LINKS SECTION (JUSTDIAL FOOTER DIRECTORY PARITY) */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full border-t border-gray-200 dark:border-slate-800">
        <h4 className="text-base font-bold text-navy dark:text-white mb-6">Popular Local Categories Across Major Cities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <h5 className="font-bold text-navy dark:text-white mb-3">Top Services in Mumbai</h5>
            <ul className="space-y-2">
              <li><Link href="/search?city=Mumbai&category=Restaurants" className="hover:text-primary transition">Restaurants in Mumbai</Link></li>
              <li><Link href="/search?city=Mumbai&category=Interior+Designers" className="hover:text-primary transition">Interior Designers in Mumbai</Link></li>
              <li><Link href="/search?city=Mumbai&category=Hotels" className="hover:text-primary transition">Hotels in Mumbai</Link></li>
              <li><Link href="/search?city=Mumbai&category=Architects" className="hover:text-primary transition">Architects in Mumbai</Link></li>
              <li><Link href="/search?city=Mumbai&category=Hospitals" className="hover:text-primary transition">Hospitals in Mumbai</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-navy dark:text-white mb-3">Top Services in Delhi NCR</h5>
            <ul className="space-y-2">
              <li><Link href="/search?city=Delhi&category=Restaurants" className="hover:text-primary transition">Restaurants in Delhi</Link></li>
              <li><Link href="/search?city=Delhi&category=Interior+Designers" className="hover:text-primary transition">Interior Designers in Delhi</Link></li>
              <li><Link href="/search?city=Delhi&category=Hotels" className="hover:text-primary transition">Hotels in Delhi</Link></li>
              <li><Link href="/search?city=Delhi&category=Packers+%26+Movers" className="hover:text-primary transition">Packers &amp; Movers in Delhi</Link></li>
              <li><Link href="/search?city=Delhi&category=B2B" className="hover:text-primary transition">B2B Wholesalers in Delhi</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-navy dark:text-white mb-3">Top Services in Bangalore</h5>
            <ul className="space-y-2">
              <li><Link href="/search?city=Bangalore&category=Restaurants" className="hover:text-primary transition">Restaurants in Bangalore</Link></li>
              <li><Link href="/search?city=Bangalore&category=Interior+Designers" className="hover:text-primary transition">Interior Designers in Bangalore</Link></li>
              <li><Link href="/search?city=Bangalore&category=Hotels" className="hover:text-primary transition">Hotels in Bangalore</Link></li>
              <li><Link href="/search?city=Bangalore&category=Architects" className="hover:text-primary transition">Architects in Bangalore</Link></li>
              <li><Link href="/search?city=Bangalore&category=Hospitals" className="hover:text-primary transition">Hospitals in Bangalore</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-navy dark:text-white mb-3">Top Services in Pune &amp; Hyderabad</h5>
            <ul className="space-y-2">
              <li><Link href="/search?city=Pune&category=Interior+Designers" className="hover:text-primary transition">Interior Designers in Pune</Link></li>
              <li><Link href="/search?city=Hyderabad&category=Interior+Designers" className="hover:text-primary transition">Interior Designers in Hyderabad</Link></li>
              <li><Link href="/search?city=Pune&category=Restaurants" className="hover:text-primary transition">Restaurants in Pune</Link></li>
              <li><Link href="/search?city=Hyderabad&category=Hotels" className="hover:text-primary transition">Hotels in Hyderabad</Link></li>
              <li><Link href="/search?city=Pune&category=B2B" className="hover:text-primary transition">B2B Wholesalers in Pune</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
