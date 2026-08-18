import Image from "next/image";
import {
  Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone,
  ShoppingBag, Home as HomeIcon, Wrench, Truck, Bug, PartyPopper, Scale,
  Users, Building, Award, ArrowRight, FileText, Megaphone, Trophy,
  Presentation, Briefcase, Star, Globe
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/shared/HeroSearch";

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] dark:bg-slate-950 text-navy dark:text-white transition-colors duration-300">
      <Navbar />
      <HeroSearch />

      <main className="w-full pb-0">

        {/* ══════════════════════════════════════════
            2. POPULAR CATEGORIES
        ══════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="flex justify-between items-center mb-10">
            <div className="flex-1" />
            <h2 className="text-3xl md:text-[32px] font-black text-[#0F172A] dark:text-white text-center flex-[2] tracking-tight">
              Popular Categories
            </h2>
            <div className="flex-1 flex justify-end">
              <Link
                href="/categories"
                className="text-sm font-bold text-[#1E40AF] dark:text-blue-400 hover:text-blue-700 transition flex items-center gap-1 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-x-2 gap-y-8 justify-items-center">
            {[
              { name: "Restaurant\n& Food",         icon: Utensils,       gradient: "from-orange-400 to-orange-600", shadow: "shadow-orange-500/30" },
              { name: "Hotel\n& Resort",             icon: Hotel,          gradient: "from-purple-500 to-purple-700", shadow: "shadow-purple-500/30" },
              { name: "Hospital\n& Healthcare",      icon: PlusSquare,     gradient: "from-red-400 to-red-600", shadow: "shadow-red-500/30" },
              { name: "Education\n& Coaching",       icon: GraduationCap,  gradient: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/30" },
              { name: "Interior\n& Construction",    icon: HardHat,        gradient: "from-amber-400 to-amber-600", shadow: "shadow-amber-500/30" },
              { name: "Automobile",                  icon: Car,            gradient: "from-sky-400 to-sky-600", shadow: "shadow-sky-500/30" },
              { name: "Electronics\n& Mobile",       icon: Smartphone,     gradient: "from-emerald-400 to-emerald-600", shadow: "shadow-emerald-500/30" },
              { name: "Fashion\n& Lifestyle",        icon: ShoppingBag,    gradient: "from-pink-400 to-pink-600", shadow: "shadow-pink-500/30" },
              { name: "Real Estate",                 icon: HomeIcon,       gradient: "from-violet-500 to-violet-700", shadow: "shadow-violet-500/30" },
              { name: "Home\nServices",              icon: Wrench,         gradient: "from-teal-400 to-teal-600", shadow: "shadow-teal-500/30" },
              { name: "Movers\n& Packers",         icon: Truck,          gradient: "from-yellow-400 to-yellow-600", shadow: "shadow-yellow-500/30" },
              { name: "Pest\nControl",             icon: Bug,            gradient: "from-lime-400 to-lime-600", shadow: "shadow-lime-500/30" },
              { name: "Wedding\n& Events",         icon: PartyPopper,    gradient: "from-fuchsia-400 to-fuchsia-600", shadow: "shadow-fuchsia-500/30" },
              { name: "CA & Legal\nServices",      icon: Scale,          gradient: "from-slate-500 to-slate-700", shadow: "shadow-slate-500/30" },
            ].map((cat, i) => (
              <Link
                key={i}
                href={`/search?category=${encodeURIComponent(cat.name.replace("\n", " "))}`}
                className="flex flex-col items-center group cursor-pointer w-full"
              >
                <div
                  className={`w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full flex justify-center items-center mb-3 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 shadow-lg ${cat.shadow} bg-gradient-to-br ${cat.gradient}`}
                >
                  <cat.icon className="w-8 h-8 sm:w-9 sm:h-9 text-white" strokeWidth={1.8} />
                </div>
                <span className="text-[12px] sm:text-[13px] font-black text-slate-800 dark:text-slate-200 text-center leading-tight whitespace-pre-line group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            NEW: TRENDING SERVICES (JUSTDIAL STYLE)
        ══════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-[28px] font-black text-[#0F172A] dark:text-white tracking-tight">
              Trending Services
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { title: "Pest Control", img: "/images/card-doctor.jpg", badge: "20% OFF" }, 
              { title: "Packers & Movers", img: "/images/card-repair.jpg", badge: "Fast" },
              { title: "Wedding Planners", img: "/images/card-b2b.jpg", badge: "Premium" },
              { title: "Modular Kitchen", img: "/images/card-realestate.jpg", badge: "Trending" },
              { title: "AC Repair", img: "/images/promo-banner.jpg", badge: "Summer" },
            ].map((service, i) => (
              <Link href="/search" key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] block shadow-md hover:shadow-lg transition-shadow">
                <Image src={service.img} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 20vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[9px] font-black uppercase text-[#1E3A8A] tracking-wider shadow-sm">
                  {service.badge}
                </div>
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-[15px] leading-tight drop-shadow-md pr-2">
                  {service.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            NEW: TOP RATED BUSINESSES
        ══════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-[28px] font-black text-[#0F172A] dark:text-white tracking-tight">
              Top Rated Businesses
            </h2>
            <Link href="/search" className="text-sm font-bold text-[#1E40AF] dark:text-blue-400 hover:text-blue-700 transition flex items-center gap-1 whitespace-nowrap">
              See All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Sharma Packers & Movers", rating: "4.9", reviews: 128, location: "Andheri West, Mumbai", category: "Logistics" },
              { name: "Apollo Diagnostics", rating: "4.8", reviews: 342, location: "Koramangala, Bangalore", category: "Healthcare" },
              { name: "GreenLeaf Pest Control", rating: "4.7", reviews: 89, location: "Connaught Place, Delhi", category: "Home Services" },
              { name: "Vivid Interior Designers", rating: "5.0", reviews: 56, location: "Banjara Hills, Hyderabad", category: "Interiors" },
            ].map((biz, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black text-xl rounded-xl flex items-center justify-center">
                    {biz.name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">
                    {biz.rating} <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <h3 className="font-bold text-[#0F172A] dark:text-white text-[16px] leading-tight mb-1 truncate">{biz.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{biz.category} • {biz.location}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-xs transition">Call Now</button>
                  <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600 font-bold py-2 rounded-lg text-xs transition">Get Quote</button>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* ══════════════════════════════════════════
            3. HOW TRUEDIAL HELPS YOU GROW
        ══════════════════════════════════════════ */}
        <section className="bg-slate-50 dark:bg-slate-900/50 w-full py-20 border-t border-slate-200 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl md:text-[36px] font-black text-[#0F172A] dark:text-white tracking-tight leading-tight mb-4">
                How{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-[#F59E0B]">
                  TrueDial
                </span>{" "}
                Helps You Grow
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">
                We provide the perfect ecosystem to digitalize, market, and expand your business reach across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Digital Business Profile",
                  desc: "Build your trusted online presence with a fully customized mini-website.",
                  icon: FileText,
                  iconColor: "#2563EB",
                  iconBg: "#EFF6FF",
                  darkIconBg: "rgba(37, 99, 235, 0.15)",
                },
                {
                  title: "Reach More Customers",
                  desc: "Get genuine business opportunities and leads delivered straight to your inbox.",
                  icon: Users,
                  iconColor: "#1E3A8A",
                  iconBg: "#EEF2FF",
                  darkIconBg: "rgba(30, 58, 138, 0.15)",
                },
                {
                  title: "Promote Offers & Deals",
                  desc: "Increase sales with smart marketing by pushing offers directly to local users.",
                  icon: Megaphone,
                  iconColor: "#2563EB",
                  iconBg: "#EFF6FF",
                  darkIconBg: "rgba(37, 99, 235, 0.15)",
                },
                {
                  title: "Exclusive Privilege Card",
                  desc: "Attract more loyal customers by offering exclusive discounts via our TrueDial card.",
                  icon: Trophy,
                  iconColor: "#EA580C",
                  iconBg: "#FFF7ED",
                  darkIconBg: "rgba(234, 88, 12, 0.15)",
                },
                {
                  title: "Complete Digital Marketing",
                  desc: "Grow faster with expert SEO, social media, and paid advertising solutions.",
                  icon: Presentation,
                  iconColor: "#059669",
                  iconBg: "#ECFDF5",
                  darkIconBg: "rgba(5, 150, 105, 0.15)",
                },
                {
                  title: "Expert Business Consulting",
                  desc: "Get professional guidance to scale operations and optimize your revenue streams.",
                  icon: Briefcase,
                  iconColor: "#7C3AED",
                  iconBg: "#F5F3FF",
                  darkIconBg: "rgba(124, 58, 237, 0.15)",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800/80 rounded-[24px] p-7 flex items-start gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 dark:from-slate-700/20 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
                  
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                    style={{ backgroundColor: feature.iconBg }}
                  >
                    <feature.icon
                      className="w-7 h-7"
                      style={{ color: feature.iconColor }}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="flex flex-col text-left relative z-10 pt-1">
                    <h3 className="font-black text-[#0F172A] dark:text-white text-[17px] mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            4. OUR ECOSYSTEM
        ══════════════════════════════════════════ */}
        <section className="w-full py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Decorated heading */}
            <div className="flex items-center gap-4 justify-center mb-10">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 max-w-[120px] sm:max-w-[200px]" />
              <h2 className="text-2xl md:text-[26px] font-black text-[#0F172A] dark:text-white text-center shrink-0">
                Our Ecosystem
              </h2>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 max-w-[120px] sm:max-w-[200px]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {/* TrueDial */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300">
                <div className="mb-3 h-14 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EA580C] flex items-center justify-center shadow-sm">
                      <span className="text-white font-black text-xs">TD</span>
                    </div>
                    <span className="font-black text-[15px] text-[#EA580C]">truedial</span>
                    <span className="font-black text-[15px] text-[#1E40AF]">.com</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 mt-0.5 tracking-wider">100% VERIFIED ✓</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-5 leading-tight">
                  Business Listing &amp; Growth Platform
                </p>
                <Link href="#" className="w-full">
                  <button className="w-full bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* PYND.in */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300">
                <div className="mb-3 h-14 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#EA580C] flex items-center justify-center shadow-sm text-white">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <span className="font-black text-[18px] text-[#EA580C]">PYND.in</span>
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-5 leading-tight">
                  Tender &amp; Project Marketplace
                </p>
                <Link href="#" className="w-full">
                  <button className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* Best in Bharat */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300">
                <div className="mb-3 h-14 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm border border-slate-200 flex items-center justify-center bg-orange-50">
                      <span className="text-[10px]">🇮🇳</span>
                    </div>
                    <div className="text-left">
                      <div className="font-black text-[13px] text-[#1E40AF] leading-none">Best in</div>
                      <div className="font-black text-[15px] text-[#1E40AF] leading-none">Bharat</div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-5 leading-tight">
                  India&apos;s Best Businesses &amp; Brands
                </p>
                <Link href="#" className="w-full">
                  <button className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* Best in Bihar */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300">
                <div className="mb-3 h-14 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-sm">
                      <Globe className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-[13px] text-[#059669] leading-none">Best in</div>
                      <div className="font-black text-[15px] text-[#059669] leading-none">Bihar.in</div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-5 leading-tight">
                  Bihar&apos;s Trusted Business Directory
                </p>
                <Link href="#" className="w-full">
                  <button className="w-full bg-[#059669] hover:bg-emerald-700 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* EasyGet.in */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300 sm:col-span-1 col-span-2 sm:col-start-auto col-start-1">
                <div className="mb-3 h-14 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#DB2777] flex items-center justify-center shadow-sm">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-black text-[16px] text-[#DB2777]">EasyGet.in</span>
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-5 leading-tight">
                  Local Deals &amp; Quick Services
                </p>
                <Link href="#" className="w-full">
                  <button className="w-full bg-[#DB2777] hover:bg-pink-700 text-white font-bold text-[12px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            NEW: BUSINESS INSIGHTS & BLOGS
        ══════════════════════════════════════════ */}
        <section className="w-full py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl md:text-[32px] font-black text-[#0F172A] dark:text-white tracking-tight leading-tight mb-2">
                  Business Insights & Guides
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Expert advice and strategies to grow your business online.
                </p>
              </div>
              <Link href="/blog" className="text-sm font-bold text-[#1E40AF] dark:text-blue-400 hover:text-blue-700 transition flex items-center gap-1 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full hidden sm:flex">
                Read All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "How to Optimize Your TrueDial Business Listing for Maximum Reach", category: "Marketing", date: "Aug 15, 2026", img: "https://images.unsplash.com/photo-1432828684865-eb73b228b3f1?q=80&w=1200", slug: "optimize-business-listing-maximum-reach" },
                { title: "5 Proven Strategies to Convert Local Leads into Paying Customers", category: "Sales", date: "Aug 12, 2026", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1200", slug: "strategies-convert-local-leads" },
                { title: "Why Online Reviews Are the Most Important Metric for Local SEO", category: "SEO & Growth", date: "Aug 08, 2026", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200", slug: "importance-online-reviews-local-seo" }
              ].map((blog, i) => (
                <Link href={`/blog/${blog.slug}`} key={i} className="group flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-[20px] overflow-hidden border border-slate-200/60 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image src={blog.img} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#1E3A8A] tracking-wider shadow-sm">
                      {blog.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">{blog.date}</p>
                    <h3 className="font-bold text-[#0F172A] dark:text-white text-[16px] leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center text-[#1E40AF] dark:text-blue-400 text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <Link href="/blog" className="mt-6 text-sm font-bold text-[#1E40AF] dark:text-blue-400 justify-center flex items-center gap-1 sm:hidden bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl w-full">
              Read All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            5. PROMOTIONAL BANNERS (Academy / Podcast / News)
        ══════════════════════════════════════════ */}
        <section className="bg-[#F4F8FF] dark:bg-slate-900/50 w-full py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* ── Academy ── */}
              <div className="bg-[#FEF9ED] rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-amber-100">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
                {/* Icon */}
                <div className="w-16 h-16 bg-[#FBBF24] rounded-full flex items-center justify-center mb-4 shadow-md relative z-10">
                  <GraduationCap className="w-9 h-9 text-[#1E3A8A]" strokeWidth={1.8} />
                </div>
                {/* Title */}
                <div className="relative z-10 mb-1">
                  <h3 className="font-black text-[#1E3A8A] text-[22px] leading-none tracking-tight">TRUEDIAL</h3>
                  <h3 className="font-black text-[#EA580C] text-[28px] leading-none tracking-tight mt-0.5">ACADEMY</h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-2 tracking-widest uppercase">Learn · Grow · Succeed</p>
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 text-[13px] my-5 relative z-10">
                  Industry Oriented Professional Courses
                </p>
                <Link href="/academy" className="w-full relative z-10">
                  <button className="w-full bg-[#FBBF24] hover:bg-amber-400 text-[#1E3A8A] font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 shadow-md text-[13px]">
                    Know More <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* ── Podcast ── */}
              <div className="bg-[#1A003A] rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-purple-900">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                {/* Mic icon */}
                <div className="w-16 h-16 bg-[#7C3AED] rounded-full flex items-center justify-center mb-4 shadow-lg relative z-10">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
                <div className="relative z-10 mb-1">
                  <h3 className="font-black text-white text-[22px] leading-none tracking-tight">TRUEDIAL</h3>
                  <h3 className="font-black text-[#A78BFA] text-[28px] leading-none tracking-tight mt-0.5">PODCAST</h3>
                  <p className="text-[11px] font-bold text-purple-300 mt-2 tracking-widest uppercase">Every Business Has a Story</p>
                </div>
                <p className="font-semibold text-purple-200 text-[13px] my-5 relative z-10">
                  Founder Talks | Business Talks | Success Stories
                </p>
                <Link href="/podcast" className="w-full relative z-10">
                  <button className="w-full bg-[#7C3AED] hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 shadow-md text-[13px]">
                    Watch Now <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* ── TD News ── */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-blue-100 dark:border-slate-700">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
                {/* TD NEWS badge */}
                <div className="relative z-10 mb-3">
                  <div className="inline-flex flex-col items-center">
                    <div className="bg-[#1D4ED8] text-white font-black text-[20px] px-8 py-1.5 rounded-t-xl italic tracking-tight flex items-center gap-2">
                      TD
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="bg-[#DC2626] text-white font-black text-[18px] px-8 py-1.5 rounded-b-xl w-full tracking-[0.15em]">
                      NEWS
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 mt-3 tracking-widest uppercase">Business That Matters</p>
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 text-[13px] my-5 relative z-10">
                  Startup | Business | Market Updates
                </p>
                <Link href="/news" className="w-full relative z-10">
                  <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 shadow-md text-[13px]">
                    Watch Now <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            6. DOWNLOAD APP BANNER
        ══════════════════════════════════════════ */}
        <section className="w-full bg-[#FFF8E8] dark:bg-[#1a1200] border-t border-b border-amber-100 dark:border-amber-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Phone mockup */}
              <div className="w-full md:w-auto flex justify-center md:justify-start shrink-0">
                <div className="relative w-[110px] h-[200px]">
                  {/* Phone frame */}
                  <div className="absolute inset-0 bg-[#1a1a2e] rounded-[28px] border-[6px] border-slate-700 shadow-2xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-b from-[#1E3A8A] to-[#0F172A] flex flex-col items-center pt-5">
                      <div className="w-12 h-1.5 bg-slate-600 rounded-full mb-4" />
                      <div className="w-14 h-14 bg-[#FBBF24] rounded-2xl flex items-center justify-center shadow-lg mb-3">
                        <span className="text-[#1E3A8A] font-black text-lg">TD</span>
                      </div>
                      <span className="text-white text-[9px] font-bold tracking-widest opacity-80">TRUEDIAL</span>
                      <div className="mt-4 w-full px-3 flex flex-col gap-2">
                        <div className="h-2 bg-white/10 rounded-full w-full" />
                        <div className="h-2 bg-white/10 rounded-full w-3/4 mx-auto" />
                        <div className="h-7 bg-white/10 rounded-xl w-full mt-1" />
                        <div className="h-7 bg-white/10 rounded-xl w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-2xl md:text-[32px] font-black text-[#0F172A] dark:text-white leading-tight mb-2">
                  Download{" "}
                  <span className="text-[#1E40AF]">TRUE</span>
                  <span className="text-[#EA580C]">DIAL</span>{" "}
                  App
                </h2>
                <p className="text-[#64748B] dark:text-slate-400 font-medium text-[14px] mb-6">
                  Find Businesses | Get Best Offers | Grow Your Business
                </p>
                <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                  <Link href="#" className="hover:opacity-90 transition hover:scale-105">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="h-10 md:h-12"
                    />
                  </Link>
                  <Link href="#" className="hover:opacity-90 transition hover:scale-105">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="Download on the App Store"
                      className="h-10 md:h-12"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            7. STATS BAR
        ══════════════════════════════════════════ */}
        <section className="bg-[#0B1D3A] w-full py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Verified Businesses", value: "50,000+", icon: Users },
                { label: "Happy Customers",     value: "5 Lakh+", icon: Users },
                { label: "Cities Coverage",     value: "100+",    icon: Building },
                { label: "User Rating",          value: "4.8/5",   icon: Star },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 flex justify-center items-center text-white shrink-0 bg-white/5">
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xl sm:text-2xl font-black text-white leading-tight">{stat.value}</p>
                    <p className="text-[11px] sm:text-[12px] font-medium text-slate-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
