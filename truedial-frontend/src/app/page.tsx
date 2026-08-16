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

      </main>
      
      <Footer />
    </div>
  );
}
