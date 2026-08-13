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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        
        {/* 1. SMART SEARCH & HERO BANNER COMBINED */}
        <div className="w-full">
          <div className="bg-[#0A1C3A] rounded-[32px] p-6 sm:p-10 overflow-hidden shadow-2xl border border-[#1E40AF]/40 relative">
            
            {/* Background elements to match design slightly */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full -ml-10 -mb-10 blur-3xl" />
            
            <div className="max-w-4xl mx-auto z-10 relative">
              {/* Location Bar & Voice */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
                <div className="flex-row inline-flex items-center bg-white px-5 py-3 rounded-full shadow-md w-full sm:w-auto">
                  <MapPin className="w-5 h-5 text-[#1E40AF]" />
                  <span className="text-sm font-bold text-slate-900 mx-3 truncate max-w-[200px]">Patna, Bihar</span>
                  <ChevronRight className="w-5 h-5 text-slate-400 ml-auto sm:ml-2 rotate-90 sm:rotate-0" />
                </div>

                <button className="hidden sm:flex w-12 h-12 rounded-full bg-white items-center justify-center shadow-md hover:bg-gray-50 transition">
                  <Mic className="w-5 h-5 text-[#1E40AF]" />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="flex flex-row items-center bg-white rounded-full pl-5 pr-2 h-16 shadow-xl mb-10 z-10 w-full hover:shadow-2xl transition-shadow duration-300">
                <Search className="w-6 h-6 text-slate-400 mr-3 hidden sm:block" />
                <input
                  type="text"
                  className="flex-1 text-slate-900 text-base font-medium outline-none bg-transparent h-full"
                  placeholder="Search Business, Service, Product..."
                />
                <button className="bg-[#1E40AF] hover:bg-blue-800 transition-colors h-12 px-6 rounded-full items-center justify-center flex shadow-md">
                  <span className="text-white font-bold hidden sm:inline mr-2">Search</span>
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Hero Text */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-semibold text-blue-200 mb-2 uppercase tracking-wide">India's Emerging</h2>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#F59E0B] leading-tight md:leading-[1.1]">Business Growth</h1>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight md:leading-[1.1] mb-4">Platform</h1>
                  <p className="text-lg md:text-xl text-blue-100 font-medium mb-1">Beyond Listing.</p>
                  <p className="text-lg md:text-xl text-blue-100 font-medium mb-8">We Help Businesses Grow.</p>

                  <Link href="/search">
                    <button className="bg-[#F59E0B] hover:bg-amber-400 transition-colors py-4 px-8 rounded-full inline-flex items-center shadow-xl group">
                      <span className="text-base font-black text-slate-900 mr-3 uppercase tracking-wide">Explore Now</span>
                      <ArrowRight className="w-5 h-5 text-slate-900 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>

                {/* Right side floating badge */}
                <div className="md:w-48 bg-[#1E40AF]/40 backdrop-blur-md border border-blue-400/30 p-4 md:p-6 rounded-3xl items-center text-center shadow-2xl">
                  <Trophy className="w-12 h-12 text-[#F59E0B] mb-3 mx-auto" />
                  <p className="text-sm font-bold text-white leading-snug">Trusted by Thousands of Businesses Across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. QUICK ACTIONS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.route} className="flex flex-col items-center group cursor-pointer">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-3 ${action.bg} shadow-md border border-slate-100 dark:border-slate-800 group-hover:-translate-y-2 group-hover:shadow-xl transition-all duration-300`}>
                <action.icon className="w-10 h-10 md:w-12 md:h-12" color={action.color} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center leading-tight group-hover:text-primary transition-colors">{action.name}</span>
            </Link>
          ))}
        </div>

        {/* 3. TOP CATEGORIES */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-10 shadow-lg border border-slate-200/60 dark:border-slate-800">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Top Categories</h3>
            <Link href="/categories" className="text-sm font-bold text-[#1E40AF] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
            {topCategories.map((cat, i) => (
              <Link 
                key={i} 
                href={cat.name === 'More Categories' ? '/categories' : `/search?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className={`w-20 h-20 rounded-[28px] flex justify-center items-center mb-3 ${cat.bg} shadow-sm group-hover:-translate-y-2 group-hover:shadow-lg transition-all duration-300`}>
                  <cat.icon className="w-10 h-10" color={cat.color} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center leading-snug group-hover:text-[#1E40AF] transition-colors px-2">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. OUR ECOSYSTEM PLATFORM */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-10 shadow-lg border border-slate-200/60 dark:border-slate-800">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Our Ecosystem Platform</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {ecosystemPlatforms.map((platform, i) => (
              <div key={i} className="flex flex-col p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group">
                <div className={`w-14 h-14 ${platform.logoBg} rounded-2xl flex items-center justify-center mb-4 text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <span className="font-black text-xl">{platform.name.charAt(0)}</span>
                </div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1" style={{ color: platform.color }}>{platform.name}</h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug">{platform.tag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. PREMIUM SERVICES */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-10 shadow-lg border border-slate-200/60 dark:border-slate-800">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Premium Services</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {premiumServices.map((service, i) => (
              <div key={i} className={`flex flex-col items-center p-6 rounded-3xl ${service.bg} border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group text-center`}>
                <service.icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" color={service.color} strokeWidth={1.5} />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-snug">{service.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* 6. LEARNING & INSIGHTS */}
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 px-2">Learning & Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Academy */}
            <div className="bg-[#E0E7FF] dark:bg-slate-800 rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer border border-blue-100 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <GraduationCap className="w-10 h-10 text-[#1E40AF]" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#1E40AF] dark:text-blue-400">TRUEDIAL ACADEMY</h4>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Learn • Grow • Succeed</p>
                </div>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-white mt-2 mb-8 leading-snug">Industry Oriented Professional Courses</p>
              <div className="inline-flex items-center self-start border-b-2 border-[#1E40AF] pb-1 group">
                <span className="text-sm font-bold text-[#1E40AF] mr-2">Know More</span>
                <ArrowRight className="w-4 h-4 text-[#1E40AF] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Podcast */}
            <div className="bg-[#F3E8FF] dark:bg-slate-800 rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer border border-purple-100 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <Mic className="w-10 h-10 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#7C3AED] dark:text-purple-400">TRUEDIAL PODCAST</h4>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Every Business Has a Story</p>
                </div>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-white mt-2 mb-8 leading-snug">Founder Insights & Entrepreneurship</p>
              <div className="inline-flex items-center self-start border-b-2 border-[#7C3AED] pb-1 group">
                <span className="text-sm font-bold text-[#7C3AED] mr-2">Listen Now</span>
                <ArrowRight className="w-4 h-4 text-[#7C3AED] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: News */}
            <div className="bg-[#DBEAFE] dark:bg-slate-800 rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer border border-blue-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <Globe className="w-10 h-10 text-[#2563EB]" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#2563EB] dark:text-blue-400">TD NEWS</h4>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Business News That Matters</p>
                </div>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-white mt-2 mb-8 leading-snug">Market Trends & Trade Reports</p>
              <div className="inline-flex items-center self-start border-b-2 border-[#2563EB] pb-1 group">
                <span className="text-sm font-bold text-[#2563EB] mr-2">Read More</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* 7. STATS BANNER & APP PROMO */}
        <div className="pt-4">
          <div className="bg-[#0A1C3A] rounded-t-[32px] p-10 shadow-2xl border border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-4xl font-black text-white mb-2">50,000+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified Businesses</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0">
                <p className="text-4xl font-black text-white mb-2">5 Lakh+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Happy Customers</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0">
                <p className="text-4xl font-black text-white mb-2">100+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cities Coverage</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0">
                <div className="flex items-center justify-center mb-2 gap-2">
                  <Star className="w-8 h-8 text-[#F59E0B] fill-[#F59E0B]" />
                  <p className="text-4xl font-black text-white">4.8/5</p>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">User Rating</p>
              </div>
            </div>
          </div>
          
          {/* Download App Banner */}
          <div className="bg-blue-600 rounded-b-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Download TRUEDIAL App</h3>
              <p className="text-base text-blue-100 font-medium">Find Businesses | Best Deals | Grow Your Business</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black hover:bg-slate-900 transition-colors py-3 px-6 rounded-xl flex items-center justify-center gap-3">
                <div className="text-left">
                  <p className="text-white text-[10px] font-bold uppercase">GET IT ON</p>
                  <p className="text-white text-base font-black">Google Play</p>
                </div>
              </button>
              <button className="bg-black hover:bg-slate-900 transition-colors py-3 px-6 rounded-xl flex items-center justify-center gap-3">
                <div className="text-left">
                  <p className="text-white text-[10px] font-bold uppercase">Download on the</p>
                  <p className="text-white text-base font-black">App Store</p>
                </div>
              </button>
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
