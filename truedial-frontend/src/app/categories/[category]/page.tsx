import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TrueDialAPI } from "@/lib/api";
import BusinessCard from "@/components/shared/BusinessCard";
import { ArrowRight, Star, TrendingUp, ShieldCheck, MapPin } from "lucide-react";

export default async function CategoryHubPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.category);

  // Fetch businesses for this category
  const response = await TrueDialAPI.searchBusinesses({ category_name: categoryName, limit: 10 });
  let businesses = [];
  if (Array.isArray(response.data)) {
    businesses = response.data;
  } else if (response.data && Array.isArray(response.data.data)) {
    businesses = response.data.data;
  } else if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
    businesses = response.data.data.data;
  }

  // Map to BusinessCard format
  const mappedBusinesses = businesses.map((listing: any) => ({
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    category: listing.category?.name || categoryName,
    locality: listing.address || listing.city,
    rating: listing.avg_rating || listing.reviews_avg_rating || 0,
    is_verified: listing.is_verified,
    is_premium: listing.is_premium,
    cover_image: listing.gallery?.[0]?.url || listing.cover_image,
    phone: listing.phone,
    whatsapp: listing.whatsapp
  }));

  // Mock collections for the hub
  const collections = [
    { title: "Top Rated", desc: "Highest reviewed by users", icon: Star, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950" },
    { title: "Trending Now", desc: "Most booked this week", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950" },
    { title: "Verified Partners", desc: "Trusted & Background checked", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      {/* Dynamic Hero based on Category */}
      <div className="bg-navy pt-20 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-md border border-white/20 shadow-xl">
            Category Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Best in <span className="text-primary">{categoryName}</span>
          </h1>
          <p className="text-white/80 max-w-2xl text-lg font-medium">
            Explore curated collections, top-rated professionals, and exclusive offers tailored just for you.
          </p>
          
          <div className="mt-10 bg-white dark:bg-slate-900 rounded-full p-2 flex items-center max-w-xl w-full shadow-2xl">
            <div className="flex-1 flex items-center px-4 border-r border-slate-200 dark:border-slate-800">
              <MapPin className="w-5 h-5 text-slate-400 mr-2" />
              <input type="text" placeholder="Your City..." className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-slate-900 dark:text-white" defaultValue="Mumbai" />
            </div>
            <Link href={`/search?category=${resolvedParams.category}`}>
              <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                Explore All
              </button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-16 -mt-10 relative z-20">
        
        {/* Collections Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {collections.map((coll, idx) => (
            <Link key={idx} href={`/search?category=${resolvedParams.category}`} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 hover:-translate-y-1 hover:shadow-2xl transition-all cursor-pointer group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${coll.bg} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <coll.icon className={`w-7 h-7 ${coll.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{coll.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{coll.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Businesses */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">Featured {categoryName}</h2>
            <p className="text-slate-500 font-medium">Handpicked businesses providing exceptional service.</p>
          </div>
          <Link href={`/search?category=${resolvedParams.category}`} className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {mappedBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {mappedBusinesses.slice(0, 4).map((biz: any) => (
              <BusinessCard key={biz.id} {...biz} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">No featured businesses yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">We are still onboarding top professionals in this category.</p>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
