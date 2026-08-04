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
      <section className="w-full hidden lg:flex justify-center pt-6 pb-8">
        <div className="container px-4 xl:px-8">
          <div className="relative w-full rounded-[2rem] overflow-hidden bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-row min-h-[650px]">
            
            {/* Right Background Image */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] z-0">
               <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-900 via-[#F8FAFC]/40 dark:via-slate-900/40 to-transparent z-10" />
               <img 
                 src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" 
                 alt="Beautiful interior design" 
                 className="w-full h-full object-cover object-center" 
               />
            </div>

            {/* Left Content (Text & Search) */}
            <div className="w-[60%] xl:w-[50%] p-10 xl:p-14 flex flex-col justify-center relative z-10 h-full">
              
              <h1 className="text-[52px] xl:text-[64px] font-black text-[#111827] dark:text-white leading-[1.1] mb-5 tracking-tight">
                Where Projects <br/> Meet <span className="text-[#FF6B00]">Professionals</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-medium mb-8 max-w-[90%]">
                Post your requirement and receive quotes from verified professionals.
              </p>

              <div className="flex flex-row items-center gap-4 mb-12">
                <Link href="/post-requirement">
                  <button className="bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.23)] hover:-translate-y-0.5">
                    <span>Post Project</span>
                  </button>
                </Link>
                <Link href="/professionals">
                  <button className="bg-white dark:bg-slate-800 text-[#111827] dark:text-white font-bold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                    <span>Browse Professionals</span>
                  </button>
                </Link>
              </div>
              
              {/* AI-Powered Discovery Prompt */}
              <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center w-full px-2">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-2 mb-1 block">Describe your dream home...</label>
                    <input 
                      type="text" 
                      placeholder="e.g. I need a modern modular kitchen under ₹3 lakh." 
                      className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium text-base px-2 py-2"
                    />
                  </div>
                  <button className="bg-[#111827] hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-6 py-3.5 rounded-xl font-bold transition-colors whitespace-nowrap h-full flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Find Professionals
                  </button>
                </div>
              </div>

              {/* Quick Chips */}
              <div className="flex flex-row flex-wrap items-center gap-2 mt-4">
                <span className="text-sm font-semibold text-slate-500 mr-2">Popular:</span>
                {['Modern Kitchen', 'False Ceiling', 'Wardrobe', 'Luxury Bedroom', 'Office Interior', 'Villa'].map((chip) => (
                  <button key={chip} className="bg-white/80 backdrop-blur-sm dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] hover:border-[#FF6B00] text-xs font-bold px-3 py-1.5 rounded-full transition-colors cursor-pointer">
                    {chip}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
          </div>
        </div>
      </section>
    </>
  );
}
