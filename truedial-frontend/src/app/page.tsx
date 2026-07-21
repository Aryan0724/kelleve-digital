import Image from "next/image";
import { Search, MapPin, CheckCircle, Users, Building, Grid, Search as SearchIcon, Utensils, Hotel, PlusSquare, GraduationCap, HardHat, Car, Smartphone, Sparkles, MoreHorizontal, Store, Megaphone, MessageCircle, CreditCard, Presentation, BookOpen } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f9fafb]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-navy leading-tight mb-4">
            India’s Emerging <br />
            <span className="text-primary">Business Growth</span> <br />
            Platform
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 uppercase tracking-wide">
            Beyond Listing. <br />
            We Help Businesses <span className="text-primary">Grow.</span>
          </h2>
          <p className="text-gray-600 mb-10 max-w-md text-lg">
            List your business, get discovered, attract more customers and grow with our powerful tools, marketing solutions and business services.
          </p>

          {/* Search Bar Component */}
          <form action="/search" className="bg-white p-3 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-3 border border-gray-100 max-w-3xl">
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md flex-1 bg-gray-50">
              <Grid className="text-gray-400 w-5 h-5" />
              <input type="text" name="category" placeholder="Select Category" className="bg-transparent outline-none w-full text-sm" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md flex-1 bg-gray-50">
              <MapPin className="text-gray-400 w-5 h-5" />
              <input type="text" name="city" placeholder="Select City" className="bg-transparent outline-none w-full text-sm" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md flex-1 bg-gray-50">
              <SearchIcon className="text-gray-400 w-5 h-5" />
              <input type="text" name="q" placeholder="What are you looking for?" className="bg-transparent outline-none w-full text-sm" />
            </div>
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-orange-600 w-full md:w-auto transition">
              Search
            </button>
          </form>
          
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Popular Searches:</span>
            <Link href="/search?q=Restaurants"><span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition inline-block">Restaurants</span></Link>
            <Link href="/search?q=Hotels"><span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition inline-block">Hotels</span></Link>
            <Link href="/search?q=Hospitals"><span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition inline-block">Hospitals</span></Link>
            <Link href="/search?q=Interior%20Designers"><span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition inline-block">Interior Designers</span></Link>
          </div>
        </div>

        {/* Right Images (Mockup) */}
        <div className="flex-1 relative z-10 flex justify-center items-center">
          <div className="bg-gray-200 w-72 h-[500px] rounded-[2.5rem] shadow-2xl border-[8px] border-gray-800 relative overflow-hidden flex flex-col">
            <div className="bg-navy p-4 flex flex-col items-center">
               <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm mb-2">T</div>
               <div className="bg-white/20 rounded w-full py-1 px-2 text-xs text-white flex items-center gap-2">
                 <SearchIcon className="w-3 h-3" /> Search business...
               </div>
            </div>
            <div className="bg-white flex-1 p-4">
               {/* Phone mock content */}
               <div className="h-24 bg-gray-100 rounded-lg mb-4"></div>
               <div className="grid grid-cols-3 gap-2">
                 <div className="h-16 bg-gray-100 rounded-md"></div>
                 <div className="h-16 bg-gray-100 rounded-md"></div>
                 <div className="h-16 bg-gray-100 rounded-md"></div>
                 <div className="h-16 bg-gray-100 rounded-md"></div>
                 <div className="h-16 bg-gray-100 rounded-md"></div>
                 <div className="h-16 bg-gray-100 rounded-md"></div>
               </div>
            </div>
          </div>
          
          {/* Privilege Card Float */}
          <div className="absolute -right-4 bottom-10 bg-gradient-to-r from-gray-900 to-black p-5 rounded-xl shadow-2xl border border-gray-700 text-yellow-500 w-64 transform rotate-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-white flex items-center gap-1"><div className="w-4 h-4 bg-primary text-white rounded-full flex justify-center items-center text-[8px]">T</div> truedial</span>
              <span className="text-[10px] uppercase">Privilege Card</span>
            </div>
            <div className="font-mono text-sm tracking-widest text-white mb-2">1234 5678 9123 4567</div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-gray-300">RAHUL KUMAR</span>
              <span className="text-[10px] text-gray-400">Valid: 12/28</span>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-orange-50 to-transparent -z-10 rounded-bl-[100px]"></div>
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

      {/* Categories Section */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-2xl font-bold text-navy">Explore Top Categories</h3>
          <Link href="/categories" className="text-primary font-medium hover:underline text-sm flex items-center gap-1">View All Categories &gt;</Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {[
            { name: "Restaurants", icon: Utensils },
            { name: "Hotels", icon: Hotel },
            { name: "Hospitals", icon: PlusSquare },
            { name: "Education", icon: GraduationCap },
            { name: "Interior & Constr.", icon: HardHat },
            { name: "Automobile", icon: Car },
            { name: "Electronics", icon: Smartphone },
            { name: "More", icon: MoreHorizontal },
          ].map((cat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-md transition cursor-pointer hover:border-primary group">
              <cat.icon className="w-10 h-10 text-navy mb-3 group-hover:text-primary transition" />
              <span className="text-xs font-semibold text-center text-gray-700">{cat.name}</span>
            </div>
          ))}
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
          {[
            {
              title: "The Urban Bites Restaurant",
              category: "Restaurant",
              discount: "20% OFF",
              validity: "31 May 2025",
              img: "bg-orange-100"
            },
            {
              title: "Hotel Blue Moon Grand",
              category: "Hotel",
              discount: "15% OFF",
              validity: "25 May 2025",
              img: "bg-blue-100"
            },
            {
              title: "Dr. Smita Verma Dental Clinic",
              category: "Healthcare",
              discount: "Flat 10% OFF",
              validity: "30 May 2025",
              img: "bg-teal-100"
            },
            {
              title: "Kleve Interior Studio",
              category: "Interior",
              discount: "25% OFF",
              validity: "28 May 2025",
              img: "bg-amber-100"
            }
          ].map((offer, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col">
              <div className={`h-40 w-full ${offer.img} relative`}>
                <div className="absolute bottom-2 left-2 bg-navy text-white text-xs font-bold px-2 py-1 rounded">{offer.discount}</div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-bold text-navy text-lg leading-tight mb-1">{offer.title}</h4>
                <p className="text-xs text-gray-500 mb-2">{offer.category}</p>
                <p className="text-xs text-gray-400 mt-auto mb-4">Valid Till: {offer.validity}</p>
                <Link href={`/businesses/sample-slug-${i}`}>
                  <button className="w-full bg-orange-100 text-primary font-medium py-2 rounded hover:bg-primary hover:text-white transition">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          ))}

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
