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
import HeroSearch from "@/components/shared/HeroSearch";
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
            {topCategories.map((cat, i) => (
              <Link 
                key={i} 
                href={`/search?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center group cursor-pointer w-full"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex justify-center items-center mb-3 bg-white shadow-sm border border-gray-100 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300`}>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex justify-center items-center`} style={{ backgroundColor: cat.color + '15' }}>
                    <cat.icon className="w-6 h-6 sm:w-7 sm:h-7" color={cat.color} strokeWidth={1.5} />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800 text-center leading-tight max-w-[80px]">{cat.name.split(' & ').join(' &\n')}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. HOW TRUEDIAL HELPS YOU GROW */}
        <div className="pt-10">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-8">
            How <span className="text-[#EA580C] italic">TRUEDIAL</span> Helps You Grow
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Digital Business\nProfile", desc: "Build your trusted online presence", icon: FileText, color: "#2563EB" },
              { title: "Reach More\nCustomers", desc: "Get genuine business opportunities", icon: Users, color: "#1E40AF" },
              { title: "Promote Offers", desc: "Increase sales with smart marketing", icon: Megaphone, color: "#4F46E5" },
              { title: "Privilege Card", desc: "Attract more loyal customers", icon: Trophy, color: "#D97706" },
              { title: "Digital Marketing", desc: "Grow faster with expert solutions", icon: Presentation, color: "#3B82F6" },
              { title: "Business Consulting", desc: "Get professional guidance", icon: Briefcase, color: "#1e3a8a" },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: feature.color + '15' }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
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
              <div key={i} className={`bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-sm border-2`} style={{ borderColor: platform.color + '30' }}>
                <div className="h-12 mb-4 flex items-center justify-center w-full">
                  <div className="font-black text-xl flex items-center gap-1" style={{ color: platform.color }}>
                    <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: platform.color }}>{platform.name.charAt(0)}</div>
                    {platform.name}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-slate-800 mb-4 h-10 flex items-center justify-center">{platform.tag}</h4>
                <Link href="#" className="mt-auto">
                  <button className="text-white font-bold text-sm px-6 py-2 rounded-full hover:opacity-90 transition-opacity flex items-center gap-1" style={{ backgroundColor: platform.color }}>
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
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center border border-orange-200">
            <div className="mb-4">
              <h3 className="text-2xl font-black text-blue-900 flex flex-col items-center leading-none">
                TRUEDIAL <span className="text-[#EA580C]">ACADEMY</span>
              </h3>
              <p className="text-sm font-bold text-slate-700 mt-1">Learn • Grow • Succeed</p>
            </div>
            <p className="font-medium text-slate-800 text-sm mb-6">Industry Oriented Professional Courses</p>
            <Link href="/academy" className="mt-auto">
              <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-6 py-2.5 rounded-full transition flex items-center gap-2">
                Know More <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Podcast */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center border border-purple-200">
            <div className="mb-4 flex flex-col items-center">
              <Radio className="w-10 h-10 text-purple-700 mb-2" />
              <h3 className="text-xl font-black text-slate-900 leading-none">TRUEDIAL <br/><span className="text-purple-700 text-2xl">PODCAST</span></h3>
              <p className="text-xs font-bold text-slate-500 mt-1">Every Business Has a Story</p>
            </div>
            <p className="font-medium text-slate-800 text-sm mb-6">Founder Talks | Business Talks | Success Stories</p>
            <Link href="/podcast" className="mt-auto">
              <button className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-full transition flex items-center gap-2">
                Watch Now <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* News */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center border border-blue-200">
            <div className="mb-4 flex flex-col items-center">
              <div className="bg-blue-700 text-white font-black text-2xl px-4 py-1 rounded-t-xl italic">TD</div>
              <div className="bg-red-600 text-white font-black text-xl px-4 py-1 rounded-b-xl w-full">NEWS</div>
              <p className="text-xs font-bold text-slate-600 mt-2">Business That Matters</p>
            </div>
            <p className="font-medium text-slate-800 text-sm mb-6">Startup | Business | Market Updates</p>
            <Link href="/news" className="mt-auto">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full transition flex items-center gap-2">
                Watch Now <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* 6. DOWNLOAD APP BANNER */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white mt-12 py-10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 md:pl-20">
            <h2 className="text-3xl sm:text-4xl font-black mb-2">Download <span className="text-[#EA580C]">TRUEDIAL</span> App</h2>
            <p className="text-lg font-medium text-blue-100 mb-8">Find Businesses | Get Best Offers | Grow Your Business</p>
            <div className="flex gap-4">
              <button className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition">
                <svg className="w-8 h-8" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider">GET IT ON</div>
                  <div className="text-lg font-bold leading-none">Google Play</div>
                </div>
              </button>
              <button className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition">
                <svg className="w-8 h-8" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider">Download on the</div>
                  <div className="text-lg font-bold leading-none">App Store</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. STATISTICS FOOTER */}
      <div className="bg-[#0A1C3A] w-full py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-blue-800/50">
          <div className="flex items-center gap-4 justify-center py-2 px-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-none">50,000+</div>
              <div className="text-blue-200 text-xs mt-1">Verified Businesses</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center py-2 px-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-none">5 Lakh+</div>
              <div className="text-blue-200 text-xs mt-1">Happy Customers</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center py-2 px-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-none">100+</div>
              <div className="text-blue-200 text-xs mt-1">Cities Coverage</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center py-2 px-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-none">4.8/5</div>
              <div className="text-blue-200 text-xs mt-1">User Rating</div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
