"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  MapPin, 
  ChevronDown, 
  ShieldCheck, 
  FileText, 
  IndianRupee, 
  Lock, 
  CheckCircle2,
  Settings,
  Wallet,
  LayoutDashboard,
  Search as SearchIcon
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function Hero() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [city, setCity] = useState("Patna");
  const [service, setService] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [budget, setBudget] = useState("");
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);

  const isCustomer = !user || user?.role === 'customer';
  const isPro = user && ['interior_designer', 'architect', 'contractor', 'builder', 'supplier'].includes(user.role);
  const isWorker = user?.role === 'worker';

  const [availableCities, setAvailableCities] = useState<string[]>(["Patna"]); // Default to Patna until loaded

  useEffect(() => {
    api.get("/locations?active_only=1").then(res => {
      if (res.data?.data) {
        setAvailableCities(res.data.data.map((loc: any) => loc.name));
        if (res.data.data.length > 0 && city === "Patna") {
          // keep patna or update if needed, but fetching allows dropdown to work
        }
      }
    }).catch(console.error);
  }, []);
  const availableBudgets = [
    "All Budget",
    "Under ₹50,000",
    "₹50,000 - ₹2 Lakhs",
    "₹2 Lakhs - ₹10 Lakhs",
    "₹10 Lakhs+"
  ];

  const filteredCities = availableCities.filter(c => 
    c.toLowerCase().includes(city.toLowerCase())
  );

  const availableServices = [
    "Interior Designer", "Interior Company", "Interior Project", 
    "Contractor", "Construction", "Construction Company", 
    "Architect", "Builder", "Painter", "False Ceiling", 
    "Carpenter", "Plumber", "Electrician", "Tiles Supplier", "Hardware Supplier"
  ];

  const filteredServices = availableServices.filter(s => 
    s.toLowerCase().includes(service.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city && city !== "All Cities") params.append("city", city);
    if (service && service !== "All Services") params.append("search", service);
    if (budget && budget !== "All Budget") params.append("budget", budget);
    router.push(`/professionals?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[500px] flex items-center bg-white">
      {/* Background Image with Gradient Fade */}
      <div 
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/90 to-transparent w-full md:w-[70%]" />
      
      <div className="container relative z-40 mx-auto px-4 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Content */}
        <div className="w-full lg:w-[60%] flex flex-col">


          {user && user.role === 'customer' && (
            <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-extrabold tracking-tight text-[#0a1c3a] leading-[1.15] mb-2">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
          )}

          {isWorker ? (
            <>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#0a1c3a] leading-[1.15] mb-5">
                Find Regular Work in <span className="text-[#E8701A] relative inline-block">
                  Bihar
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 15 Q50 0 100 15" fill="none" stroke="#E8701A" strokeWidth="4" strokeLinecap="round" /></svg>
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl font-medium leading-relaxed">
                Connect with top contractors, builders, and homeowners. Get daily wage and contract work directly on your dashboard.
              </p>
            </>
          ) : isPro ? (
            <>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#0a1c3a] leading-[1.15] mb-5">
                Grow Your Business in <span className="text-[#E8701A] relative inline-block">
                  Bihar
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 15 Q50 0 100 15" fill="none" stroke="#E8701A" strokeWidth="4" strokeLinecap="round" /></svg>
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl font-medium leading-relaxed">
                Find new projects, submit quotes, and manage your incoming leads directly from your dashboard.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#0a1c3a] leading-[1.15] mb-5">
                Find & Hire The Best<br/>
                Interior Experts in <span className="text-[#E8701A] relative inline-block">
                  Bihar
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 15 Q50 0 100 15" fill="none" stroke="#E8701A" strokeWidth="4" strokeLinecap="round" /></svg>
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl font-medium leading-relaxed">
                From top-rated Interior Designers to skilled Contractors & Material Suppliers. Compare quotes and save up to 30% on your next home project.
              </p>
            </>
          )}

          {/* Value Props */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 p-4 rounded-2xl glass-panel opacity-0 animate-fade-in-up delay-100">
            {isWorker ? (
              <>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <ShieldCheck className="w-5 h-5 text-[#E8701A] mr-2" /> Verified Jobs
                </div>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <FileText className="w-5 h-5 text-[#E8701A] mr-2" /> Direct Contacts
                </div>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <IndianRupee className="w-5 h-5 text-[#E8701A] mr-2" /> Best Daily Rates
                </div>
              </>
            ) : isPro ? (
              <>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <ShieldCheck className="w-5 h-5 text-[#E8701A] mr-2" /> Verified Leads
                </div>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <FileText className="w-5 h-5 text-[#E8701A] mr-2" /> Direct Clients
                </div>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <IndianRupee className="w-5 h-5 text-[#E8701A] mr-2" /> Zero Commission
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <ShieldCheck className="w-5 h-5 text-[#E8701A] mr-2" /> Verified Pros
                </div>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <FileText className="w-5 h-5 text-[#E8701A] mr-2" /> Get Multiple Quotes
                </div>
                <div className="flex items-center text-sm font-bold text-gray-800 hover:text-[#E8701A] transition-colors cursor-default">
                  <IndianRupee className="w-5 h-5 text-[#E8701A] mr-2" /> Best Prices
                </div>
              </>
            )}
          </div>
          
          {/* Main Search Box */}
          {!isWorker ? (
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
              className="w-full max-w-3xl bg-white/95 backdrop-blur-xl p-2.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 flex flex-col md:flex-row gap-2 relative z-50 opacity-0 animate-fade-in-up delay-200"
            >
              {/* City */}
              <div className="flex-1 flex flex-col justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition relative">
                <span className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Select City</span>
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
                    className="bg-transparent font-semibold text-[#0a1c3a] outline-none w-full"
                    placeholder="e.g. Patna"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                {/* City Autocomplete Dropdown */}
                {showCityDropdown && filteredCities.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {filteredCities.map(c => (
                      <div 
                        key={c} 
                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm font-medium text-slate-700"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent focus loss on input
                          setCity(c);
                          setShowCityDropdown(false);
                        }}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service */}
              <div className="flex-1 flex flex-col justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition relative">
                <span className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Select Service</span>
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
                    className="bg-transparent font-semibold text-[#0a1c3a] outline-none w-full"
                    placeholder="e.g. Contractor"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Service Autocomplete Dropdown */}
                {showServiceDropdown && filteredServices.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {filteredServices.map(s => (
                      <div 
                        key={s} 
                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm font-medium text-slate-700"
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
              <div className="flex-1 flex flex-col justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition relative">
                <span className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Select Budget</span>
                <div 
                  className="flex items-center justify-between w-full"
                  onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                  onBlur={() => setTimeout(() => setShowBudgetDropdown(false), 200)}
                  tabIndex={0}
                >
                  <div className="flex items-center font-semibold text-[#0a1c3a] truncate">
                    <Wallet className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" /> {budget || "All Budget"}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </div>
                
                {/* Budget Dropdown */}
                {showBudgetDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-50">
                    {availableBudgets.map(b => (
                      <div 
                        key={b} 
                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm font-medium text-slate-700"
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
                className="bg-gradient-to-r from-[#0a1c3a] to-[#1a2c4a] hover:from-[#E8701A] hover:to-[#c25a12] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center whitespace-nowrap h-full"
              >
                SEARCH PROS <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
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
              <span className="font-semibold text-gray-700 mr-1 uppercase tracking-wider">Popular Searches:</span>
              {["Interior Designer", "Modular Kitchen", "Painter", "False Ceiling", "Carpenter", "Architect"].map((term) => (
                <Link 
                  key={term} 
                  href={`/professionals?search=${encodeURIComponent(term)}`}
                  className="bg-white/60 hover:bg-white backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600 px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {term}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Content - Lead Card */}
        <div className="w-full lg:w-[38%] max-w-sm mt-12 lg:mt-0 opacity-0 animate-fade-in-right delay-200">
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 transform transition-transform duration-500 hover:scale-[1.02]">
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
                    <div className="bg-orange-100 p-2 rounded-full mr-4 shrink-0">
                      <FileText className="w-4 h-4 text-[#E8701A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">Share Your Requirement</h4>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4 shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#E8701A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">Receive Multiple Quotes</h4>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4 shrink-0">
                      <IndianRupee className="w-4 h-4 text-[#E8701A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">Compare & Save Money</h4>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#E8701A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">Hire the Best Expert</h4>
                    </div>
                  </div>
                  
                  <Link href="/post-requirement" className="block w-full">
                    <button className="w-full bg-[#E8701A] hover:bg-[#E8701A]/90 text-white font-bold py-3.5 rounded-lg shadow-md transition mt-4">
                      POST NOW (It's Free)
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
