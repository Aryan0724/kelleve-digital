import Image from "next/image";
import { 
  Search, MapPin, CheckCircle, Users, Building, Grid, Search as SearchIcon, 
  Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone, 
  Sparkles, MoreHorizontal, Store, Megaphone, MessageCircle, CreditCard, 
  Presentation, BookOpen, Truck, Scissors, Home as HomeIcon, Wrench, 
  Briefcase, Landmark, Calendar, ShoppingBag, ShieldCheck, PhoneCall, 
  ArrowRight, Star, Award, Download, Globe, ShieldAlert, ChevronRight,
  HeartHandshake, Gem, Flame, Zap, Trophy, Mic, Plus, FileText, User, Radio, Newspaper
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BusinessEnquiryButton from "@/components/PostRequirementButton";
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
  
  const ecosystemPlatforms = [
    { name: "truedial.com", tag: "Business Listing & Growth", color: "#1E40AF", logoBg: "bg-blue-600" },
    { name: "PYND.in", tag: "Tender & Project Marketplace", color: "#D97706", logoBg: "bg-amber-600" },
    { name: "Best in Bharat", tag: "Top Businesses in India", color: "#1D4ED8", logoBg: "bg-blue-700" },
    { name: "Best in Bihar.in", tag: "Bihar's Trusted Directory", color: "#059669", logoBg: "bg-emerald-600" },
    { name: "EasyGet.in", tag: "Deals & Services Near You", color: "#DC2626", logoBg: "bg-red-600" }
  ];

  const premiumServices = [
    { name: "Digital Marketing", icon: Megaphone, color: "#9333EA", bg: "bg-purple-50 dark:bg-purple-950/40" },
    { name: "SMS / WhatsApp Campaign", icon: MessageCircle, color: "#16A34A", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { name: "Business Consulting", icon: Briefcase, color: "#2563EB", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { name: "Website Development", icon: Globe, color: "#EA580C", bg: "bg-orange-50 dark:bg-orange-950/40" },
    { name: "AI Business Solutions", icon: Sparkles, color: "#7C3AED", bg: "bg-purple-50 dark:bg-purple-950/40" }
  ];

  const quickActions = [
    { name: 'Find Business', icon: Search, color: '#1E40AF', bg: 'bg-[#E0E7FF]', route: '/search' },
    { name: 'Best Deals & Offers', icon: Gem, color: '#16A34A', bg: 'bg-[#DCFCE7]', route: '/offers' },
    { name: 'Privilege Card', icon: CreditCard, color: '#9333EA', bg: 'bg-[#F3E8FF]', route: '/offers' },
    { name: 'Post Requirement', icon: Plus, color: '#EA580C', bg: 'bg-[#FFEDD5]', route: '/post' },
    { name: 'Truedial Academy', icon: GraduationCap, color: '#2563EB', bg: 'bg-[#DBEAFE]', route: '/academy' },
  ];

  const topCategories = [
    { name: 'Restaurant & Food', icon: Utensils, color: '#EA580C', bg: 'bg-orange-50 dark:bg-orange-950/40' },
    { name: 'Hospital & Healthcare', icon: PlusSquare, color: '#DC2626', bg: 'bg-red-50 dark:bg-red-950/40' },
    { name: 'Hotel & Resort', icon: Hotel, color: '#9333EA', bg: 'bg-purple-50 dark:bg-purple-950/40' },
    { name: 'Education & Coaching', icon: GraduationCap, color: '#2563EB', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { name: 'Interior & Construction', icon: HardHat, color: '#D97706', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { name: 'Automobile', icon: Car, color: '#0284C7', bg: 'bg-sky-50 dark:bg-sky-950/40' },
    { name: 'Electronics & Mobile', icon: Smartphone, color: '#059669', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { name: 'Fashion & Lifestyle', icon: ShoppingBag, color: '#DB2777', bg: 'bg-pink-50 dark:bg-pink-950/40' },
    { name: 'Real Estate', icon: HomeIcon, color: '#7C3AED', bg: 'bg-violet-50 dark:bg-violet-950/40' },
    { name: 'More Categories', icon: Grid, color: '#64748B', bg: 'bg-slate-100 dark:bg-slate-800' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] dark:bg-slate-950 text-navy dark:text-white transition-colors duration-300">
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
            Find verified Restaurants, Hotels, Hospitals, Gyms, Salons, and thousands of local businesses in your city. Discover, compare &amp; connect — backed by genuine reviews &amp; exclusive VIP Privilege discounts.
          </p>

          {/* Interactive Search Bar Component */}
          <HomeSearchBar />

          {/* LOCATION & CITY DISPLAY BANNER */}
          <HomeLocationBanner />

          {/* Business Enquiry CTA */}
          <div className="mt-6 flex justify-center">
            <BusinessEnquiryButton />
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
          {/* Card 1: TrueDial Business Discovery */}
          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-navy via-slate-900 to-slate-950 text-white shadow-xl flex flex-col justify-between border border-slate-700/60 group hover:shadow-2xl hover:shadow-orange-500/10 transition duration-500">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-500/25 rounded-full blur-2xl group-hover:bg-orange-500/40 transition duration-500"></div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-400 mb-4 border border-white/10 shadow-inner">
                <Store className="w-3.5 h-3.5" />
                <span>35+ Business Categories</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2.5 leading-tight">Discover Verified Local Businesses</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                From restaurants and hospitals to gyms, salons, hotels, and digital services — find and connect with trusted businesses in your city.
              </p>
            </div>
            <Link href="/search">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition duration-300 text-sm">
                <span>Explore Businesses</span>
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
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy dark:text-white mt-1">Explore Top Verified Businesses Near You</h3>
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
              title: "Home & Lifestyle Services",
              items: ["Packers & Movers", "Home Cleaning & Pest Control", "Plumbing & Electrical", "Furniture & Interior", "CCTV & Security"],
              icon: Wrench,
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
        
        {/* 1. SMART SEARCH & HERO BANNER COMBINED */}
        <HeroSearch />

        {/* 2. POPULAR CATEGORIES */}
        <div className="pt-10">
          <div className="flex justify-between items-center mb-6 px-4">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mx-auto text-center w-full relative">
              Popular Categories
              <Link href="/categories" className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold text-[#1E40AF] hover:underline flex items-center gap-1 hidden sm:flex">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-x-2 gap-y-8 justify-items-center">
            {topCategories.map((cat, i) => {
              const bgColors = ["bg-orange-50", "bg-red-50", "bg-purple-50", "bg-blue-50", "bg-amber-50", "bg-sky-50", "bg-emerald-50", "bg-pink-50", "bg-violet-50", "bg-slate-100"];
              return (
                <Link 
                  key={i} 
                  href={`/search?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center group cursor-pointer w-full"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex justify-center items-center mb-3 ${bgColors[i % bgColors.length]} group-hover:-translate-y-1 transition-all duration-300`}>
                    <cat.icon className="w-7 h-7" color={cat.color} strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 text-center leading-tight max-w-[80px]">{cat.name.split(' & ').join(' &\n')}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. HOW TRUEDIAL HELPS YOU GROW */}
        <div className="pt-10">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-8">
            How <span className="text-[#EA580C] italic">TRUEDIAL</span> Helps You Grow
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { title: "Digital Business\nProfile", desc: "Build your trusted online presence", icon: FileText, color: "#2563EB" },
              { title: "Reach More\nCustomers", desc: "Get genuine business opportunities", icon: Users, color: "#1E40AF" },
              { title: "Promote Offers", desc: "Increase sales with smart marketing", icon: Megaphone, color: "#4F46E5" },
              { title: "Privilege Card", desc: "Attract more loyal customers", icon: Trophy, color: "#D97706" },
              { title: "Digital Marketing", desc: "Grow faster with expert solutions", icon: Presentation, color: "#3B82F6" },
              { title: "Business Consulting", desc: "Get professional guidance", icon: Briefcase, color: "#1e3a8a" },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-50 border border-gray-100 shadow-sm">
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 leading-tight whitespace-pre-line">{feature.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. OUR ECOSYSTEM */}
        <div className="pt-10">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-8">
            Our Ecosystem
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {ecosystemPlatforms.map((platform, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-sm border-2 ${i === 4 ? 'col-span-2 lg:col-span-1' : ''}`} style={{ borderColor: platform.color + '30' }}>
                <div className="h-12 mb-4 flex items-center justify-center w-full">
                  <div className="font-black text-xl flex items-center gap-1" style={{ color: platform.color }}>
                    <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: platform.color }}>{platform.name.charAt(0)}</div>
                    {platform.name}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-slate-800 mb-4 h-10 flex items-center justify-center">{platform.tag}</h4>
                <Link href="#" className="mt-auto">
                  <button className="text-white font-bold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2" style={{ backgroundColor: platform.color }}>
                    Explore <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 5. PROMOTIONAL BANNERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {/* Academy */}
          <div className="bg-[#FAF3E0] rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center">
            <div className="mb-4">
              <h3 className="text-3xl font-black text-[#1E3A8A] flex flex-col items-center leading-none">
                TRUEDIAL <span className="text-[#EA580C]">ACADEMY</span>
              </h3>
              <p className="text-sm font-bold text-slate-700 mt-2">Learn • Grow • Succeed</p>
            </div>
            <p className="font-medium text-slate-800 text-base mb-8">Industry Oriented Professional Courses</p>
            <Link href="/academy" className="mt-auto">
              <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-8 py-3 rounded-full transition flex items-center gap-2">
                Know More <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Podcast */}
          <div className="bg-[#F0E6F6] rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center">
            <div className="mb-4 flex flex-col items-center">
              <Radio className="w-12 h-12 text-[#9333EA] mb-3" />
              <h3 className="text-2xl font-black text-slate-900 leading-none">TRUEDIAL <br/><span className="text-[#9333EA] text-3xl">PODCAST</span></h3>
              <p className="text-sm font-bold text-slate-600 mt-2">Every Business Has a Story</p>
            </div>
            <p className="font-medium text-slate-800 text-base mb-8">Founder Talks | Business Talks | Success Stories</p>
            <Link href="/podcast" className="mt-auto">
              <button className="bg-[#9333EA] hover:bg-[#7E22CE] text-white font-bold px-8 py-3 rounded-full transition flex items-center gap-2">
                Watch Now <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* News */}
          <div className="bg-[#E8F0FE] rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center">
            <div className="mb-4 flex flex-col items-center">
              <div className="bg-[#1D4ED8] text-white font-black text-3xl px-6 py-1.5 rounded-t-2xl italic">TD</div>
              <div className="bg-[#DC2626] text-white font-black text-2xl px-6 py-1.5 rounded-b-2xl w-full">NEWS</div>
              <p className="text-sm font-bold text-slate-600 mt-3">Business That Matters</p>
            </div>
            <p className="font-medium text-slate-800 text-base mb-8">Startup | Business | Market Updates</p>
            <Link href="/news" className="mt-auto">
              <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-8 py-3 rounded-full transition flex items-center gap-2">
                Watch Now <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* 6. DOWNLOAD APP BANNER */}
      <div className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#312E81] text-white mt-12 py-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 md:pl-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Download <span className="text-[#EA580C]">TRUEDIAL</span> App</h2>
            <p className="text-lg font-medium text-blue-100 mb-8">Find Businesses | Get Best Offers | Grow Your Business</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition">
                <svg className="w-8 h-8" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-bold">GET IT ON</div>
                  <div className="text-lg font-black leading-none mt-0.5">Google Play</div>
                </div>
              </button>
              <button className="bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition">
                <svg className="w-8 h-8" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-bold">Download on the</div>
                  <div className="text-lg font-black leading-none mt-0.5">App Store</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. STATISTICS FOOTER */}
      <div className="bg-[#0B1530] w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:divide-x divide-blue-800/50">
          <div className="flex items-center gap-4 justify-center md:py-2 px-4">
            <div className="bg-white/10 p-3.5 rounded-full">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white font-black text-2xl leading-none">50,000+</div>
              <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mt-1.5">Verified Businesses</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:py-2 px-4 border-l border-blue-800/50 md:border-none">
            <div className="bg-white/10 p-3.5 rounded-full">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white font-black text-2xl leading-none">5 Lakh+</div>
              <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mt-1.5">Happy Customers</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:py-2 px-4 border-t pt-6 md:pt-0 md:border-t-0 border-blue-800/50">
            <div className="bg-white/10 p-3.5 rounded-full">
              <Building className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white font-black text-2xl leading-none">100+</div>
              <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mt-1.5">Cities Coverage</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:py-2 px-4 border-t border-l pt-6 md:pt-0 md:border-t-0 md:border-none border-blue-800/50">
            <div className="bg-white/10 p-3.5 rounded-full">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white font-black text-2xl leading-none flex items-center gap-1">4.8/5 <Star className="w-5 h-5 text-amber-400 fill-amber-400"/></div>
              <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mt-1.5">User Rating</div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
