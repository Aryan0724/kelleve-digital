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
    <section className="relative w-full bg-white dark:bg-background">
      {/* Background Image with Gradient Fade - DESKTOP ONLY */}
      <div 
        className="hidden lg:block absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-right opacity-100 dark:opacity-40"
      />
      <div className="hidden lg:block absolute inset-0 z-10 bg-gradient-to-r from-white via-white/90 to-transparent dark:bg-gradient-to-r dark:from-background dark:via-background/70 dark:via-70% dark:to-background/10 w-full" />
      
      <div className="container relative z-40 mx-auto px-4 py-1 lg:py-20 flex flex-col">
        
        {/* MOBILE LAYOUT - EXACT 100% VISUAL PARITY WITH IMAGE 1 */}
        {isCustomer && (
          <div className="flex lg:hidden flex-col w-full pt-1 pb-3">
            
            {/* Main Hero Banner Card */}
            <div className="w-full bg-gradient-to-r from-[#FFFDF9] via-[#FEFCF7] to-[#FBF7EE] rounded-[24px] p-5 relative overflow-hidden border border-orange-100/80 shadow-sm mb-3">
              {/* Smooth golden-orange radial glow behind the family */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 85% 65%, rgba(232, 112, 26, 0.18) 0%, rgba(232, 112, 26, 0.04) 50%, transparent 75%)`
                }}
              />
              {/* Subtle architectural grid accent */}
              <div 
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#0a1c3a 1px, transparent 1px)`,
                  backgroundSize: '18px 18px'
                }}
              />

              {/* Family Image on right side - Exactly positioned flush bottom-right like Figma IMAGE 1 */}
              <div className="absolute right-0 bottom-0 w-[42%] sm:w-[40%] h-[82%] flex items-end justify-end pointer-events-none z-10 overflow-hidden rounded-br-[24px]">
                <img
                  src="/hero-family.png"
                  alt="Family planning interior"
                  className="object-contain object-bottom w-full h-full drop-shadow-sm"
                />
              </div>

              {/* Left Content */}
              <div className="relative z-20 w-[62%] sm:w-[60%]">
                <h1 className="text-[25px] sm:text-3xl font-black text-[#0a1c3a] leading-[1.12] mb-2 tracking-tight">
                  Where Projects<br/>
                  <span className="text-[#E8701A]">Meet Professionals</span>
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-[1.35] mb-4 pr-2">
                  Post your requirement, get multiple quotes & hire the best for your dream space.
                </p>

                <div className="flex flex-row items-center gap-2">
                  <Link href="/post-requirement">
                    <button className="bg-[#E8701A] hover:bg-[#d66314] text-white font-bold text-[11px] sm:text-xs px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25 transition-transform hover:-translate-y-0.5 whitespace-nowrap">
                      <div className="bg-white/20 rounded-full p-0.5"><Plus className="w-3.5 h-3.5" strokeWidth={2.5} /></div> 
                      <span>Post a Project</span>
                    </button>
                  </Link>
                  <button className="bg-white text-[#0a1c3a] font-bold text-[11px] sm:text-xs px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm border border-slate-200 transition-transform hover:-translate-y-0.5 whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a1c3a]"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    <span>How It Works</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Feature Strip (Mobile) - EXACTLY as in IMAGE 1 (White Pill with 4 horizontal items, icon on left) */}
            <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 py-3 px-3">
              <div className="grid grid-cols-4 gap-1 sm:gap-2 items-center justify-between">
                <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#E8701A]" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">Verified<br/>Professionals</span>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                  <FileText className="w-4 h-4 shrink-0 text-[#E8701A]" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">Multiple<br/>Quotes</span>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                  <Award className="w-4 h-4 shrink-0 text-[#E8701A]" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">Best Price<br/>Guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                  <Clock className="w-4 h-4 shrink-0 text-[#E8701A]" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">On-Time<br/>Delivery</span>
                </div>
              </div>
            </div>

            {/* Pagination Dots (Mobile) */}
            <div className="flex items-center justify-center gap-1.5 mt-3 mb-1">
              <div className="w-4 h-1.5 bg-[#E8701A] rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>

          </div>
        )}

        {/* DESKTOP LAYOUT (Hidden on mobile) */}
        <div className="hidden lg:flex w-full items-center justify-between gap-8">
        
        {/* Left Content */}
        <div className="w-full lg:w-[60%] flex flex-col">


          {user && user.role === 'customer' && (
            <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-extrabold tracking-tight text-[#0a1c3a] dark:text-white leading-[1.15] mb-2">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
          )}

          {isWorker ? (
            <>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#0a1c3a] dark:text-white leading-[1.15] mb-5">
                Find Regular Work in <span className="text-[#E8701A] relative inline-block">
                  Bihar
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 15 Q50 0 100 15" fill="none" stroke="#E8701A" strokeWidth="4" strokeLinecap="round" /></svg>
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl font-medium leading-relaxed">
                Connect with top contractors, builders, and homeowners. Get daily wage and contract work directly on your dashboard.
              </p>
            </>
          ) : isPro ? (
            <>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#0a1c3a] dark:text-white leading-[1.15] mb-5">
                Grow Your Business in <span className="text-[#E8701A] relative inline-block">
                  Bihar
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 15 Q50 0 100 15" fill="none" stroke="#E8701A" strokeWidth="4" strokeLinecap="round" /></svg>
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl font-medium leading-relaxed">
                Find new projects, submit quotes, and manage your incoming leads directly from your dashboard.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#0a1c3a] dark:text-white leading-[1.15] mb-5">
                Find & Hire The Best<br/>
                Interior Experts in <span className="text-[#E8701A] relative inline-block">
                  Bihar
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 15 Q50 0 100 15" fill="none" stroke="#E8701A" strokeWidth="4" strokeLinecap="round" /></svg>
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl font-medium leading-relaxed">
                From top-rated Interior Designers to skilled Contractors & Material Suppliers. Compare quotes and save up to 30% on your next home project.
              </p>
            </>
          )}

          {/* Value Props */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-x-6 gap-y-4 mb-10 p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md opacity-0 animate-fade-in-up delay-100">
            {isWorker ? (
              <>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <ShieldCheck className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Verified Jobs
                </div>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <FileText className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Direct Contacts
                </div>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <IndianRupee className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Best Daily Rates
                </div>
              </>
            ) : isPro ? (
              <>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <ShieldCheck className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Verified Leads
                </div>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <FileText className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Direct Clients
                </div>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <IndianRupee className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Zero Commission
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <ShieldCheck className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Verified Pros
                </div>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <FileText className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Multiple Quotes
                </div>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <IndianRupee className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> Best Prices
                </div>
                <div className="flex flex-col md:flex-row items-center md:justify-start justify-center text-center md:text-left text-xs md:text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-[#E8701A] transition-colors cursor-default">
                  <CheckCircle2 className="w-6 h-6 md:w-5 md:h-5 text-[#E8701A] md:mr-2 mb-1 md:mb-0" /> On-Time
                </div>
              </>
            )}
          </div>
          
          {/* Main Search Box */}
          {!isWorker ? (
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
              className="w-full max-w-3xl premium-glass p-3 md:p-2.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col relative z-50 opacity-0 animate-fade-in-up delay-200"
            >
              <div className="w-full text-center md:hidden mb-2 pt-1 pb-2 border-b border-gray-100 dark:border-white/10">
                <span className="text-[10px] sm:text-xs font-bold text-[#0a1c3a] dark:text-gray-300 tracking-wider uppercase">FIND THE RIGHT PROFESSIONAL FOR YOUR PROJECT</span>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full">
              {/* City */}
              <div className="flex-1 flex flex-col justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition relative">
                <span className="text-[0.65rem] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">Select City</span>
                <div className="flex items-center justify-between">
                  <input 
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setShowCityDropdown(true);
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                    className="bg-transparent font-semibold text-[#0a1c3a] dark:text-white outline-none w-full"
                    placeholder="e.g. Patna"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                {/* City Autocomplete Dropdown */}
                {showCityDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0a1c3a] border border-gray-200 dark:border-white/10 shadow-xl rounded-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      disabled={isLocating}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-[#E8701A] hover:bg-orange-50 dark:hover:bg-white/10 transition-colors flex items-center border-b border-gray-100 dark:border-white/10 pb-3 mb-1"
                    >
                      {isLocating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <LocateFixed className="w-4 h-4 mr-2" />
                      )}
                      Use current location
                    </button>
                    {filteredCities.map(c => (
                      <div 
                        key={c} 
                        className="px-4 py-2 hover:bg-orange-50 dark:hover:bg-white/10 cursor-pointer text-sm font-medium text-slate-700 dark:text-gray-300"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent focus loss on input
                          setCity(c);
                          setShowCityDropdown(false);
                        }}
                      >
                        {c}
                      </div>
                    ))}
                    {filteredCities.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No matches found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Service */}
              <div className="flex-1 flex flex-col justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition relative">
                <span className="text-[0.65rem] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">Select Service</span>
                <div className="flex items-center justify-between">
                  <input 
                    type="text"
                    value={service}
                    onChange={(e) => {
                      setService(e.target.value);
                      setShowServiceDropdown(true);
                    }}
                    onFocus={() => setShowServiceDropdown(true)}
                    onBlur={() => setTimeout(() => setShowServiceDropdown(false), 200)}
                    className="bg-transparent font-semibold text-[#0a1c3a] dark:text-white outline-none w-full"
                    placeholder="e.g. Contractor or Company Name"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Service Autocomplete Dropdown */}
                {showServiceDropdown && filteredServices.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0a1c3a] border border-gray-200 dark:border-white/10 shadow-xl rounded-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {filteredServices.map(s => (
                      <div 
                        key={s} 
                        className="px-4 py-2 hover:bg-orange-50 dark:hover:bg-white/10 cursor-pointer text-sm font-medium text-slate-700 dark:text-gray-300"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setService(s);
                          setShowServiceDropdown(false);
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="flex-1 flex flex-col justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition relative">
                <span className="text-[0.65rem] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">Select Budget</span>
                <div 
                  className="flex items-center justify-between w-full"
                  onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                  onBlur={() => setTimeout(() => setShowBudgetDropdown(false), 200)}
                  tabIndex={0}
                >
                  <div className="flex items-center font-semibold text-[#0a1c3a] dark:text-white truncate">
                    <Wallet className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" /> {budget || "All Budget"}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </div>
                
                {/* Budget Dropdown */}
                {showBudgetDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0a1c3a] border border-gray-200 dark:border-white/10 shadow-xl rounded-lg overflow-hidden z-50">
                    {availableBudgets.map(b => (
                      <div 
                        key={b} 
                        className="px-4 py-2 hover:bg-orange-50 dark:hover:bg-white/10 cursor-pointer text-sm font-medium text-slate-700 dark:text-gray-300"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setBudget(b === "All Budget" ? "" : b);
                          setShowBudgetDropdown(false);
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Button */}
              <button 
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] hover:from-[#E8701A] hover:to-[#c25a12] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center whitespace-nowrap md:h-full mt-2 md:mt-0"
              >
                SEARCH PROS <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              </div>
            </form>
          ) : (
            <div className="opacity-0 animate-fade-in-up delay-200">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] hover:from-[#E8701A] hover:to-[#c25a12] text-white font-bold text-base px-10 py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center whitespace-nowrap"
              >
                VIEW AVAILABLE JOBS <span className="ml-3 transition-transform duration-300 group-hover:translate-x-2">→</span>
              </button>
            </div>
          )}
          
          {/* Popular Searches */}
          {isCustomer && (
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs opacity-0 animate-fade-in-up delay-300">
              <span className="font-semibold text-gray-700 dark:text-gray-300 mr-1 uppercase tracking-wider">Popular Searches:</span>
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

        {/* Right Content - Lead Card */}
        <div className="w-full lg:w-[38%] max-w-sm mt-12 lg:mt-0 opacity-0 animate-fade-in-right delay-200">
          <div className="premium-glass rounded-3xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]">
            {user ? (
              <>
                <div className="bg-gradient-to-br from-[#0a1c3a] to-[#1a2c4a] text-white p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <h3 className="text-2xl font-extrabold mb-2 relative z-10">
                    {isCustomer ? "Manage Your Projects" : `Welcome back, ${user.name.split(' ')[0]}!`}
                  </h3>
                  <p className="text-sm text-white/80">
                    {isCustomer ? "View progress or post new requirements." : "Ready to find your next project?"}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <Link href="/dashboard" className="block w-full">
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-[#0a1c3a] font-semibold py-3.5 rounded-lg transition flex items-center justify-center">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Go to Dashboard
                    </button>
                  </Link>
                  <Link href={isCustomer ? "/post-requirement" : "/dashboard"} className="block w-full">
                    <button className="w-full bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold py-3.5 rounded-lg shadow-md transition flex items-center justify-center">
                      {isCustomer ? (
                        <><FileText className="w-4 h-4 mr-2" /> Post New Project</>
                      ) : (
                        <><SearchIcon className="w-4 h-4 mr-2" /> View Available Leads</>
                      )}
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#0a1c3a] text-white p-6">
                  <h3 className="text-xl font-bold mb-1">Post Your Requirement</h3>
                  <p className="text-sm text-white/80">Get Free Quotes from Experts</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-4 shrink-0">
                      <FileText className="w-4 h-4 text-[#E8701A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Share Your Requirement</h4>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-4 shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#E8701A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Receive Multiple Quotes</h4>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-4 shrink-0">
                      <IndianRupee className="w-4 h-4 text-[#E8701A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Compare & Save Money</h4>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full mr-4 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#E8701A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Hire the Best Expert</h4>
                    </div>
                  </div>
                  
                  <Link href="/post-requirement" className="block w-full">
                    <button className="w-full bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold py-3.5 rounded-lg shadow-md transition mt-4">
                      POST NOW (It&apos;s Free)
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        </div>
      </div>
    </section>
  );
}
