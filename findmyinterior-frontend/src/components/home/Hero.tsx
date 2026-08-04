"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  ChevronDown, 
  ShieldCheck, 
  FileText, 
  Award,
  Clock,
  CheckCircle2,
  Wallet,
  LayoutDashboard,
  Search as SearchIcon,
  LocateFixed,
  Loader2,
  Plus,
  IndianRupee
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function Hero() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [budget, setBudget] = useState("");
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const isCustomer = !user || user?.role === 'customer';
  const isPro = user && ['interior_designer', 'architect', 'contractor', 'builder', 'supplier'].includes(user.role);
  const isWorker = user?.role === 'worker';

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    api.get("/locations?active_only=1").then(res => {
      if (res.data?.data) {
        setAvailableCities(res.data.data.map((loc: { name: string }) => loc.name));
        if (res.data.data.length > 0 && city === "Patna") {
          // keep patna or update if needed, but fetching allows dropdown to work
        }
      }
    }).catch(console.error);
  }, []);
  const availableServices = [
    "Interior Designer", "Interior Company", "Architect",
    "Modular Kitchen Designer", "Wardrobe Designer",
    "Civil Contractor", "Interior Contractor", "Turnkey Contractor",
    "Builder", "Real Estate Developer",
    "Plywood Dealer", "Tile Dealer", "Marble & Granite Dealer", "Material Supplier",
    "Carpenter", "Painter", "Electrician", "Plumber", "Glass Installer",
    "POP / False Ceiling Worker", "Tile Fitter", "Fabricator",
    "Home Renovation", "Waterproofing", "Pest Control", "Deep Cleaning",
    "CCTV & Security", "Home Automation", "Solar Installation", "AC Service",
    "Packers & Movers"
  ];

  const availableBudgets = [
    "All Budget",
    "₹2 Lakhs - ₹5 Lakhs",
    "₹5 Lakhs - ₹10 Lakhs",
    "₹10 Lakhs - ₹15 Lakhs",
    "₹15 Lakhs - ₹20 Lakhs",
    "₹20 Lakhs+"
  ];

  const filteredCities = city.trim()
    ? availableCities.filter(c => c.toLowerCase().includes(city.toLowerCase()))
    : availableCities; // show all when focused with empty input

  const filteredServices = service.trim()
    ? availableServices.filter(s => s.toLowerCase().includes(service.toLowerCase()))
    : availableServices;

  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.address) {
            const cityName = data.address.city || data.address.town || data.address.county || data.address.state_district;
            if (cityName) {
              // Check if city exists in our locations, otherwise use raw
              const exactMatch = availableCities.find(l => l.toLowerCase() === cityName.toLowerCase());
              setCity(exactMatch || cityName);
              setShowCityDropdown(false);
            }
          }
        } catch (error) {
          console.error("Error fetching city from coordinates", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = () => {
    if (!city.trim() && !service.trim()) {
      alert("Please fill in the search option to find professionals.");
      return;
    }
    const params = new URLSearchParams();
    if (city && city !== "All Cities") params.append("city", city);
    if (service && service !== "All Services") params.append("search", service);
    if (budget && budget !== "All Budget") params.append("budget", budget);
    router.push(`/professionals?${params.toString()}`);
  };

  return (
    <>
      {/* =========================================
          1. MOBILE HERO (visible only on small screens)
          ========================================= */}
      <section className="relative w-full bg-white dark:bg-background lg:hidden">
        <div className="container relative z-40 mx-auto px-4 py-4 flex flex-col items-center">
          <div className="flex flex-col w-full pt-1 pb-3">
              {/* Main Hero Banner Card - Full Background Image with Frosted Glass Left Overlay */}
              <div className="w-full rounded-[24px] p-5 sm:p-6 relative overflow-hidden border border-orange-100/80 shadow-sm mb-3 min-h-[220px] md:min-h-[350px] flex flex-col justify-center">
                {/* 1. FULL CARD BACKGROUND IMAGE */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=800&auto=format&fit=crop"
                    alt="Beautiful interior space"
                    className="w-full h-full object-cover object-right"
                  />
                  {/* 2. CREAM GRADIENT OVERLAY ON LEFT SIDE */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/90 to-transparent" />
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 85% 60%, rgba(232, 112, 26, 0.15) 0%, transparent 70%)` }}
                  />
                </div>

                {/* 3. LEFT CONTENT */}
                <div className="relative z-10 w-[70%] sm:w-[65%] md:w-[55%]">
                  {isWorker ? (
                    <>
                      <h1 className="text-[25px] sm:text-3xl md:text-4xl font-black text-[#0a1c3a] leading-[1.12] mb-2 tracking-tight">
                        Find Regular Work<br/><span className="text-[#E8701A]">in Bihar</span>
                      </h1>
                      <p className="text-[11px] sm:text-xs md:text-sm text-slate-700 font-semibold leading-[1.35] mb-4 pr-2">Connect with top contractors, builders, and homeowners.</p>
                    </>
                  ) : isPro ? (
                    <>
                      <h1 className="text-[25px] sm:text-3xl md:text-4xl font-black text-[#0a1c3a] leading-[1.12] mb-2 tracking-tight">
                        Grow Your Business<br/><span className="text-[#E8701A]">in Bihar</span>
                      </h1>
                      <p className="text-[11px] sm:text-xs md:text-sm text-slate-700 font-semibold leading-[1.35] mb-4 pr-2">Find new projects, submit quotes, and manage leads.</p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-[25px] sm:text-3xl md:text-4xl font-black text-[#0a1c3a] leading-[1.12] mb-2 tracking-tight">
                        Where Projects<br/><span className="text-[#E8701A]">Meet Professionals</span>
                      </h1>
                      <p className="text-[11px] sm:text-xs md:text-sm text-slate-700 font-semibold leading-[1.35] mb-4 pr-2">Post your requirement, get multiple quotes & hire the best for your dream space.</p>
                    </>
                  )}
                  <div className="flex flex-row items-center gap-2">
                    {isCustomer ? (
                      <Link href="/post-requirement">
                        <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-[11px] sm:text-xs md:text-sm px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5 whitespace-nowrap">
                          <div className="bg-white/20 rounded-full p-0.5"><Plus className="w-3.5 h-3.5" strokeWidth={2.5} /></div> 
                          <span>Post a Project</span>
                        </button>
                      </Link>
                    ) : (
                      <Link href="/dashboard">
                        <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-[11px] sm:text-xs md:text-sm px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5 whitespace-nowrap">
                          <div className="bg-white/20 rounded-full p-0.5"><LayoutDashboard className="w-3.5 h-3.5" strokeWidth={2.5} /></div> 
                          <span>Go to Dashboard</span>
                        </button>
                      </Link>
                    )}
                    <button className="bg-white text-[#0a1c3a] font-bold text-[11px] sm:text-xs md:text-sm px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm border border-slate-200 transition-transform hover:-translate-y-0.5 whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a1c3a] w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                      <span>How It Works</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Feature Strip (Mobile) */}
              <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 py-3 px-3">
                <div className="grid grid-cols-4 gap-1 sm:gap-2 items-center justify-between">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#E8701A]" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700 dark:text-white leading-tight">Verified<br/>Professionals</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#E8701A]" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700 dark:text-white leading-tight">Multiple<br/>Quotes</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <Award className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#E8701A]" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700 dark:text-white leading-tight">Best Price<br/>Guarantee</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#E8701A]" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700 dark:text-white leading-tight">On-Time<br/>Delivery</span>
                  </div>
                </div>
              </div>

            {/* Quick Links (Mobile) */}
            {isCustomer && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs opacity-0 animate-fade-in-up delay-300">
                <span className="font-semibold text-gray-700 dark:text-gray-300 mr-1 uppercase tracking-wider">Quick Links:</span>
                {["Interior Designer", "Modular Kitchen", "Painter", "False Ceiling", "Carpenter", "Architect"].map((term) => (
                  <Link 
                    key={term} 
                    href={`/professionals?search=${encodeURIComponent(term)}`}
                    className="bg-white/60 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400 px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================
          2. DESKTOP PREMIUM HERO (visible only on lg+)
          ========================================= */}
      <section className="relative w-full min-h-[85vh] hidden lg:flex items-center justify-center bg-slate-900 overflow-hidden pt-12 pb-16">
        {/* Full Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop"
            alt="Premium Interior Desktop"
            className="w-full h-full object-cover"
          />
          {/* Asymmetric Glass Overlay: Solid white/cream on the left, fading to transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent" />
          
          {/* Accent glow on the left */}
          <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-tr from-orange-500/10 to-transparent pointer-events-none" />
        </div>

        <div className="container relative z-10 mx-auto px-6 xl:px-12 h-full flex flex-row items-center w-full mt-8">
          {/* Left Column: Command Center */}
          <div className="w-[55%] xl:w-[50%] pr-8">
            
            {/* Quick Links as floating pills above headline */}
            {isCustomer && (
              <div className="flex flex-wrap items-center gap-3 mb-8 opacity-0 animate-fade-in-up">
                <span className="font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mr-2">Trending</span>
                {["Interior Designer", "Modular Kitchen", "Architect"].map((term) => (
                  <Link 
                    key={term} 
                    href={`/professionals?search=${encodeURIComponent(term)}`}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            )}

            {isWorker ? (
              <>
                <h1 className="text-5xl xl:text-7xl font-black text-[#0a1c3a] dark:text-white leading-[1.1] mb-6 tracking-tight opacity-0 animate-fade-in-up delay-100">
                  Find Regular Work<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8701A] to-orange-400">in Bihar</span>
                </h1>
                <p className="text-lg xl:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-10 pr-12 opacity-0 animate-fade-in-up delay-200">
                  Connect with top contractors, builders, and homeowners instantly. Turn your skills into steady income.
                </p>
              </>
            ) : isPro ? (
              <>
                <h1 className="text-5xl xl:text-7xl font-black text-[#0a1c3a] dark:text-white leading-[1.1] mb-6 tracking-tight opacity-0 animate-fade-in-up delay-100">
                  Grow Your Business<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8701A] to-orange-400">in Bihar</span>
                </h1>
                <p className="text-lg xl:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-10 pr-12 opacity-0 animate-fade-in-up delay-200">
                  Find high-value projects, submit winning quotes, and manage your leads effectively in one place.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-5xl xl:text-7xl font-black text-[#0a1c3a] dark:text-white leading-[1.1] mb-6 tracking-tight opacity-0 animate-fade-in-up delay-100">
                  Where Projects<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8701A] to-orange-400">Meet Professionals</span>
                </h1>
                <p className="text-lg xl:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-10 pr-12 opacity-0 animate-fade-in-up delay-200">
                  Transform your space with confidence. Post your requirement, get multiple quotes, and hire the best experts in Bihar.
                </p>
              </>
            )}

            <div className="flex flex-row items-center gap-5 opacity-0 animate-fade-in-up delay-300">
              {isCustomer ? (
                <Link href="/post-requirement">
                  <button className="group relative bg-gradient-to-r from-[#E8701A] to-orange-500 text-white font-bold text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(232,112,26,0.3)] hover:shadow-[0_8px_30px_rgb(232,112,26,0.5)] transition-all hover:-translate-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <div className="relative z-10 bg-white/20 rounded-xl p-1.5"><Plus className="w-6 h-6" strokeWidth={2.5} /></div> 
                    <span className="relative z-10">Post a Project</span>
                  </button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <button className="group relative bg-gradient-to-r from-[#E8701A] to-orange-500 text-white font-bold text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(232,112,26,0.3)] hover:shadow-[0_8px_30px_rgb(232,112,26,0.5)] transition-all hover:-translate-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <div className="relative z-10 bg-white/20 rounded-xl p-1.5"><LayoutDashboard className="w-6 h-6" strokeWidth={2.5} /></div> 
                    <span className="relative z-10">Go to Dashboard</span>
                  </button>
                </Link>
              )}
              <button className="bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 backdrop-blur-md text-[#0a1c3a] dark:text-white font-bold text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all hover:-translate-y-1 group">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-1.5 group-hover:bg-[#0a1c3a] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 ml-0.5"><polygon points="10 8 16 12 10 16 10 8"/></svg>
                </div>
                <span>How It Works</span>
              </button>
            </div>
            
            {/* Desktop Feature Strip - Integrated organically */}
            <div className="mt-14 pt-8 border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-2 gap-y-6 gap-x-4 opacity-0 animate-fade-in-up delay-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-[#E8701A]" /></div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"><FileText className="w-5 h-5 text-[#E8701A]" /></div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Multiple Quotes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"><Award className="w-5 h-5 text-[#E8701A]" /></div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"><Clock className="w-5 h-5 text-[#E8701A]" /></div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">On-Time Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Visual Elements */}
          <div className="w-[45%] xl:w-[50%] h-full relative flex items-center justify-center pointer-events-none">
            {/* Floating Trust Badge */}
            <div className="absolute right-[5%] top-[20%] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl rounded-2xl p-4 flex items-center gap-4 animate-float opacity-0 animate-fade-in-up delay-700" style={{ animationDuration: '4s' }}>
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=3" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-[#E8701A] flex items-center justify-center text-white text-xs font-bold">+5k</div>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">Trusted Community</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Homeowners & Pros in Bihar</p>
              </div>
            </div>

            {/* Floating Image Card */}
            <div className="absolute left-[5%] bottom-[15%] bg-white/20 dark:bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/30 shadow-2xl animate-float opacity-0 animate-fade-in-up delay-1000" style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop" className="w-[320px] h-[200px] object-cover rounded-xl shadow-inner" alt="Modern kitchen" />
              <div className="absolute -bottom-4 -left-4 bg-[#0a1c3a] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" /> Premium Quality
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
