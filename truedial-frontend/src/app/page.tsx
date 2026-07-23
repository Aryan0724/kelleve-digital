import Image from "next/image";
import { Search, MapPin, CheckCircle, Users, Building, Grid, Search as SearchIcon, Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone, Sparkles, MoreHorizontal, Store, Megaphone, MessageCircle, CreditCard, Presentation, BookOpen } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { TrueDialAPI } from "@/lib/api";

export default async function Home() {
  const offersResponse = await TrueDialAPI.getPublicOffers();
  const topOffers = offersResponse.success ? offersResponse.data.data.slice(0, 4) : [];
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f9fafb]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 py-16 px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="z-10 max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-4">
            Search Across <span className="text-primary">50K+</span> Verified Businesses
          </h1>
          <p className="text-gray-600 mb-10 text-lg">
            Find the best Restaurants, Hotels, Doctors, and Services near you.
          </p>

          {/* Huge Centralized Search Bar Component */}
          <form action="/search" className="bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-3 border border-gray-100 w-full mx-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100 flex-1 w-full md:w-auto">
              <MapPin className="text-primary w-6 h-6 shrink-0" />
              <input type="text" name="city" placeholder="City or Pincode" className="bg-transparent outline-none w-full text-base font-medium" />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100 flex-1 w-full md:w-auto">
              <Grid className="text-primary w-6 h-6 shrink-0" />
              <input type="text" name="category" placeholder="Category (e.g. Restaurants)" className="bg-transparent outline-none w-full text-base font-medium" />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 flex-[2] w-full md:w-auto">
              <SearchIcon className="text-primary w-6 h-6 shrink-0" />
              <input type="text" name="q" placeholder="Search business name..." className="bg-transparent outline-none w-full text-base font-medium" />
            </div>
            <button type="submit" className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-600 w-full md:w-auto transition shadow-lg shadow-primary/30 text-lg">
              Search
            </button>
          </form>
          
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Trending:</span>
            <Link href="/search?category=Restaurants"><span className="px-4 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full cursor-pointer hover:bg-gray-50 hover:text-primary transition inline-block">Restaurants</span></Link>
            <Link href="/search?category=Hotels"><span className="px-4 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full cursor-pointer hover:bg-gray-50 hover:text-primary transition inline-block">Hotels</span></Link>
            <Link href="/search?category=Hospitals"><span className="px-4 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full cursor-pointer hover:bg-gray-50 hover:text-primary transition inline-block">Hospitals</span></Link>
            <Link href="/search?category=Interior%20Designers"><span className="px-4 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full cursor-pointer hover:bg-gray-50 hover:text-primary transition inline-block">Interior Designers</span></Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-2xl font-bold text-navy"><CheckCircle className="text-primary" /> 50K+</div>
            <p className="text-gray-500 text-sm mt-1">Verified Businesses</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-2xl font-bold text-navy"><Users className="text-primary" /> 1M+</div>
            <p className="text-gray-500 text-sm mt-1">Happy Customers</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-2xl font-bold text-navy"><Building className="text-primary" /> 500+</div>
            <p className="text-gray-500 text-sm mt-1">Cities Covered</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-2xl font-bold text-navy"><Sparkles className="text-primary" /> 20+</div>
            <p className="text-gray-500 text-sm mt-1">Business Services</p>
          </div>
        </div>
      </section>

      {/* Categories Section - JD Style */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-2xl font-bold text-navy">Popular Categories</h3>
             <Link href="/categories" className="text-primary font-medium hover:underline text-sm flex items-center gap-1">View All Categories &gt;</Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {[
              { name: "Restaurants", icon: Utensils, color: "bg-orange-100 text-orange-600", q: "Restaurants" },
              { name: "Hotels", icon: Hotel, color: "bg-blue-100 text-blue-600", q: "Hotels" },
              { name: "Hospitals", icon: PlusSquare, color: "bg-red-100 text-red-600", q: "Hospitals" },
              { name: "Education", icon: GraduationCap, color: "bg-green-100 text-green-600", q: "Education" },
              { name: "Interior Design", icon: HardHat, color: "bg-yellow-100 text-yellow-600", q: "Interior Designers" },
              { name: "Automobile", icon: Car, color: "bg-purple-100 text-purple-600", q: "Automobile" },
              { name: "Electronics", icon: Smartphone, color: "bg-cyan-100 text-cyan-600", q: "Electronics" },
              { name: "More", icon: MoreHorizontal, color: "bg-gray-100 text-gray-600", link: "/categories" },
            ].map((cat, i) => (
              cat.link ? (
                <Link href={cat.link} key={i}>
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-gray-50 transition cursor-pointer group text-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{cat.name}</span>
                  </div>
                </Link>
              ) : (
                <Link href={`/search?category=${encodeURIComponent(cat.q)}`} key={i}>
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-gray-50 transition cursor-pointer group text-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{cat.name}</span>
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full bg-white rounded-3xl mb-16 shadow-sm border border-gray-50">
        <h3 className="text-2xl font-bold text-navy text-center mb-12">Powerful Solutions for Your Business Growth</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          {[
            { title: "Business Listing", icon: Store, desc: "Get discovered by thousands of potential customers." },
            { title: "Digital Marketing", icon: Megaphone, desc: "Grow your business with our digital marketing solutions." },
            { title: "SMS & WhatsApp", icon: MessageCircle, desc: "Reach your customers directly with powerful campaigns." },
            { title: "Privilege Card", icon: CreditCard, desc: "Increase customer loyalty with our multi-city privilege card." },
            { title: "Business Consulting", icon: Presentation, desc: "Expert guidance for startup, registration, trademark & more." },
            { title: "TD Academy", icon: BookOpen, desc: "Learn, grow and build your career with industry courses." },
          ].map((sol, i) => (
            <div key={i} className="flex flex-col items-center p-4 border border-gray-100 rounded-xl hover:shadow-lg transition group bg-gray-50 hover:bg-white">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition">
                <sol.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-navy mb-2">{sol.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{sol.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Best Offers */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-2xl font-bold text-navy">Today's Best Offers</h3>
          <Link href="/offers" className="text-primary font-medium hover:underline text-sm flex items-center gap-1">View All Offers &gt;</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {topOffers.length > 0 ? (
            topOffers.map((offer: any) => (
              <div key={offer.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col group">
                <div className={`h-40 w-full relative bg-gray-100 overflow-hidden flex items-center justify-center`}>
                  {offer.media && offer.media.length > 0 ? (
                      <img src={offer.media[0].url} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                      <span className="text-gray-400">No Image</span>
                  )}
                  {offer.discount_type && offer.discount_value && (
                      <div className="absolute bottom-2 left-2 bg-navy text-white text-xs font-bold px-2 py-1 rounded">
                          {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                      </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-navy text-lg leading-tight mb-1 line-clamp-1" title={offer.title}>{offer.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{offer.listing?.category || 'General'}</p>
                  <p className="text-xs text-gray-400 mt-auto mb-4">Valid Till: {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : 'Ongoing'}</p>
                  <Link href={`/businesses/${offer.listing?.slug || '#'}`}>
                    <button className="w-full bg-orange-100 text-primary font-medium py-2 rounded hover:bg-primary hover:text-white transition">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
                No active offers found. Check back later!
            </div>
          )}

          {/* Privilege Card Banner */}
          <div className="bg-navy rounded-xl overflow-hidden text-white flex flex-col justify-center items-start p-6 col-span-1 md:col-span-1 border border-navy shadow-lg relative">
             <h3 className="text-xl font-bold mb-2">Get Multi City Privilege Card</h3>
             <p className="text-sm text-gray-300 mb-6">One Card. Multiple Cities. Unlimited Benefits.</p>
             <Link href="/offers">
               <button className="bg-primary text-white font-medium py-2 px-6 rounded hover:bg-orange-600 transition z-10">
                 Know More
               </button>
             </Link>
             {/* small card graphic */}
             <div className="absolute -bottom-10 -right-10 w-40 h-24 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl transform -rotate-12 opacity-50"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ChevronDown(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}
function Lock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}
function Headphones(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
    </svg>
  )
}
function Facebook(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function Instagram(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>; }
function Twitter(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>; }
function Linkedin(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>; }
