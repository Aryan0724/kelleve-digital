"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  ChevronDown, 
  ShieldCheck, 
  FileText, 
  IndianRupee, 
  Lock, 
  CheckCircle2,
  Settings,
  Wallet
} from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [city, setCity] = useState("Patna");
  const [service, setService] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const availableServices = [
    "Interior Designer", "Contractor", "Architect", "Builder",
    "Painter", "False Ceiling", "Carpenter", "Plumber",
    "Electrician", "Tiles Supplier", "Hardware Supplier"
  ];

  const filteredServices = availableServices.filter(s => 
    s.toLowerCase().includes(service.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city !== "All Cities") params.append("city", city);
    if (service !== "All Services") params.append("search", service);
    router.push(`/professionals?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[500px] flex items-center bg-white overflow-hidden">
      {/* Background Image with Gradient Fade */}
      <div 
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/90 to-transparent w-full md:w-[70%]" />
      
      <div className="container relative z-20 mx-auto px-4 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Content */}
        <div className="w-full lg:w-[60%] flex flex-col">


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

          {/* 4 Value Props */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 bg-white/50 p-3 rounded-lg border border-gray-100 inline-flex w-fit backdrop-blur-sm shadow-sm">
            <div className="flex items-center text-sm font-bold text-gray-800">
              <ShieldCheck className="w-5 h-5 text-[#E8701A] mr-2" /> Verified Pros
            </div>
            <div className="flex items-center text-sm font-bold text-gray-800">
              <FileText className="w-5 h-5 text-[#E8701A] mr-2" /> Get Multiple Quotes
            </div>
            <div className="flex items-center text-sm font-bold text-gray-800">
              <IndianRupee className="w-5 h-5 text-[#E8701A] mr-2" /> Best Prices
            </div>
          </div>
          
          {/* Main Search Box */}
          <div className="w-full max-w-3xl bg-white p-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col md:flex-row gap-2">
            {/* City */}
            <div className="flex-1 flex flex-col justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition">
              <span className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Select City</span>
              <div className="flex items-center justify-between">
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent font-semibold text-[#0a1c3a] outline-none w-full"
                  placeholder="e.g. Patna"
                />
              </div>
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
              </div>
              
              {/* Autocomplete Dropdown */}
              {showServiceDropdown && filteredServices.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-50">
                  {filteredServices.map(s => (
                    <div 
                      key={s} 
                      className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm font-medium text-slate-700"
                      onClick={() => {
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
            <div className="flex-1 flex flex-col justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition">
              <span className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Select Budget</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center font-semibold text-[#0a1c3a]">
                  <Wallet className="w-4 h-4 mr-1.5 text-gray-400" /> All Budget
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            {/* Button */}
            <button 
              onClick={handleSearch}
              className="bg-[#0a1c3a] hover:bg-[#0a1c3a]/90 text-white font-semibold text-sm px-6 py-4 rounded-lg shadow-md transition flex items-center justify-center whitespace-nowrap h-full"
            >
              SEARCH PROS <span className="ml-2">›</span>
            </button>
          </div>
          
          {/* Popular Searches */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-gray-700 mr-2">Popular Searches:</span>
            {["Interior Designer", "Modular Kitchen", "Painter", "False Ceiling", "Carpenter", "Tiles Supplier", "Architect"].map((term) => (
              <Link 
                key={term} 
                href={`/professionals?search=${encodeURIComponent(term)}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md cursor-pointer transition"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Content - Lead Card */}
        <div className="w-full lg:w-[35%] max-w-sm mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-[#0a1c3a] text-white p-6">
              <h3 className="text-xl font-bold mb-1">Post Your Requirement</h3>
              <p className="text-sm text-white/80">Get Free Quotes from Experts</p>
            </div>
            {/* Body */}
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
          </div>
        </div>

      </div>
    </section>
  );
}
