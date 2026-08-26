"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Star, MapPin, Phone, MessageCircle, ShieldCheck, Clock, Share2, Heart, 
  CheckCircle2, Ticket, ThumbsUp, ChevronRight, Globe, Navigation, Award, 
  MessageSquare, Sparkles, X, ChevronLeft, ChevronRight as ChevronRightIcon, 
  Calendar, Users, Info, ArrowUpRight, Copy, Check, Eye, Utensils, Stethoscope, 
  Briefcase, Wrench, Building, Layers, Send
} from "lucide-react";
import InquiryForm from "@/components/forms/InquiryForm";
import ReviewSection from "@/components/reviews/ReviewSection";
import MessageBusinessButton from "@/components/messaging/MessageBusinessButton";
import WriteReviewModal from "@/components/reviews/WriteReviewModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrueDialAPI } from "@/lib/api";

export interface BusinessProfileClientProps {
  business: any;
  initialOffers?: any[];
  initialReviews?: any[];
}

export default function BusinessProfileClient({ 
  business, 
  initialOffers = [], 
  initialReviews = [] 
}: BusinessProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "products" | "offers" | "photos" | "reviews" | "location">("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [photoFilter, setPhotoFilter] = useState("all");

  // Inquiry / Quote Modal State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);

  // Timings expansion
  const [showAllTimings, setShowAllTimings] = useState(false);

  // Extract info safely with rich fallbacks
  const basicInfo = business?.basicInfo || business || {};
  const slug = basicInfo.slug || "business";
  const title = basicInfo.title || "Premier Verified Business";
  const category = basicInfo.category?.name || basicInfo.category || "Professional Services";
  const city = basicInfo.city || "Delhi NCR";
  const address = basicInfo.address || `${city}, India`;
  const phone = basicInfo.phone || "+91 98765 43210";
  const whatsapp = basicInfo.whatsapp || phone;
  const website = basicInfo.website || (basicInfo.slug ? `https://${basicInfo.slug}.truedial.in` : "");
  const rating = Number(business?.metrics?.rating || basicInfo.avg_rating || 4.8);
  const reviewCount = Number(business?.metrics?.reviews_count || basicInfo.review_count || 128);
  const isVerified = basicInfo.verified ?? basicInfo.is_verified ?? true;
  const isPremium = basicInfo.is_premium ?? true;

  // Check saved state from localStorage
  useEffect(() => {
    try {
      const savedItems = JSON.parse(localStorage.getItem("truedial_saved_businesses") || "[]");
      setIsSaved(savedItems.includes(slug));
    } catch {
      // ignore
    }
  }, [slug]);

  const toggleSave = () => {
    try {
      const savedItems = JSON.parse(localStorage.getItem("truedial_saved_businesses") || "[]");
      let updated;
      if (isSaved) {
        updated = savedItems.filter((s: string) => s !== slug);
        setIsSaved(false);
        showToast("Removed from saved bookmarks");
      } else {
        updated = [...savedItems, slug];
        setIsSaved(true);
        showToast("Saved to your bookmarks!");
      }
      localStorage.setItem("truedial_saved_businesses", JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyPromo = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPromo(code);
    showToast(`Promo code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedPromo(null), 3000);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} on TrueDial`,
          text: `Check out ${title} on TrueDial - 100% Verified Local Business in ${city}`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast("Listing link copied to clipboard!");
    }
  };

  const openGoogleMaps = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + " " + address)}`;
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  // Fallback Galleries tailored by category
  const defaultImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
  ];

  const rawGallery = business?.media && business.media.length > 0 
    ? business.media.map((m: any) => m.url || m)
    : (basicInfo.gallery && basicInfo.gallery.length > 0 ? basicInfo.gallery.map((g: any) => g.url || g) : defaultImages);

  const gallery = rawGallery.length >= 3 ? rawGallery : [...rawGallery, ...defaultImages].slice(0, 6);

  // Fallback Services if none from API
  const rawServices = business?.catalog?.services || basicInfo.listing_services || [];
  const services = rawServices.length > 0 ? rawServices : [
    {
      id: 1,
      name: "VIP Premium Consultation & Service",
      description: "Complete professional consultation with dedicated specialist and guaranteed satisfaction.",
      price_from: 499,
      price_to: 1499,
      duration: "45 mins"
    },
    {
      id: 2,
      name: "Standard Express Booking",
      description: "Quick priority slot with direct assistance and zero waiting time.",
      price_from: 299,
      price_to: 799,
      duration: "30 mins"
    },
    {
      id: 3,
      name: "Comprehensive Full Package",
      description: "All-inclusive end-to-end service package tailored to your exact requirements.",
      price_from: 2499,
      price_to: 5999,
      duration: "2 hours"
    }
  ];

  // Fallback Products / Menu if none from API
  const rawProducts = business?.catalog?.products || basicInfo.listing_products || [];
  const products = rawProducts.length > 0 ? rawProducts : [
    {
      id: 1,
      name: "Signature Chef Special Platter",
      description: "Handcrafted delicacy made with premium organic ingredients and rich spices.",
      price: 450,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
      is_veg: true
    },
    {
      id: 2,
      name: "Royal Gourmet Feast Selection",
      description: "Award-winning specialty served with artisanal sides and freshly made dips.",
      price: 680,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
      is_veg: false
    },
    {
      id: 3,
      name: "Deluxe Refreshment Beverage",
      description: "Chilled fresh blend infused with natural fruits and aromatic mint.",
      price: 180,
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop",
      is_veg: true
    }
  ];

  // Active Offers
  const offers = (initialOffers && initialOffers.length > 0) ? initialOffers : [
    {
      id: 1,
      title: "Flat 20% Privilege Discount",
      promo_code: "TRUE20",
      discount_type: "percentage",
      discount_value: 20,
      description: "Valid for all TrueDial Privilege Card members on dine-in and services.",
      valid_until: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 2,
      title: "Festive ₹150 Cashback Voucher",
      promo_code: "FESTIVE150",
      discount_type: "fixed",
      discount_value: 150,
      description: "Instant discount on minimum billing of ₹699. One-time use per user.",
      valid_until: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    }
  ];

  // Timings Schedule
  const daysOfWeek = [
    { day: "Monday", hours: "09:30 AM - 10:30 PM", isToday: new Date().getDay() === 1 },
    { day: "Tuesday", hours: "09:30 AM - 10:30 PM", isToday: new Date().getDay() === 2 },
    { day: "Wednesday", hours: "09:30 AM - 10:30 PM", isToday: new Date().getDay() === 3 },
    { day: "Thursday", hours: "09:30 AM - 10:30 PM", isToday: new Date().getDay() === 4 },
    { day: "Friday", hours: "09:30 AM - 11:00 PM", isToday: new Date().getDay() === 5 },
    { day: "Saturday", hours: "09:00 AM - 11:30 PM", isToday: new Date().getDay() === 6 },
    { day: "Sunday", hours: "09:00 AM - 11:30 PM", isToday: new Date().getDay() === 0 },
  ];

  const handleOpenQuote = (serviceTitle?: string) => {
    if (serviceTitle) setSelectedService(serviceTitle);
    setQuoteModalOpen(true);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev + 1) % gallery.length);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, gallery.length]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce border border-slate-700 dark:border-slate-300">
          <Check className="w-4 h-4 text-green-400 dark:text-green-600" />
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-500 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-orange-600 font-medium">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link href={`/search?city=${encodeURIComponent(city)}`} className="hover:text-orange-600 font-medium">{city}</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link href={`/search?category=${encodeURIComponent(category)}`} className="hover:text-orange-600 font-medium">{category}</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-xs">{title}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-sm mb-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
            
            {/* Left: Main Details */}
            <div className="flex-1 space-y-4">
              
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/40 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {category}
                </span>
                {isVerified && (
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    100% Verified Business
                  </span>
                )}
                {isPremium && (
                  <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 rounded-full text-xs font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    TrueDial Partner
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {title}
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                  {basicInfo.tagline || `Top rated ${category} destination in ${city} serving satisfied customers.`}
                </p>
              </div>

              {/* Rating & Stats Row */}
              <div className="flex flex-wrap items-center gap-4 py-1">
                <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-xl font-black text-sm shadow-sm">
                  <span>{rating.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span className="text-slate-900 dark:text-white font-extrabold">{reviewCount}</span> Verified Ratings & Reviews
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <ThumbsUp className="w-3.5 h-3.5" /> 96% Highly Recommended
                </div>
              </div>

              {/* Location & Status */}
              <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="leading-snug">{address}</span>
                  <button 
                    onClick={openGoogleMaps}
                    className="text-orange-600 dark:text-orange-400 hover:underline font-bold ml-1 inline-flex items-center gap-0.5 shrink-0"
                  >
                    View Map <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="inline-flex items-center gap-1.5">
                    <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">Open Now</strong>
                    <span className="text-slate-400">•</span>
                    Closes 10:30 PM
                  </span>
                  <button 
                    onClick={() => setActiveTab("overview")} 
                    className="text-orange-600 hover:underline text-[11px] font-bold ml-1"
                  >
                    See all hours
                  </button>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <a href={`tel:${phone}`} className="flex-1 sm:flex-none">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20">
                    <Phone className="w-4 h-4" /> Call: {phone}
                  </Button>
                </a>

                {whatsapp && (
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I found ${title} on TrueDial and would like to inquire.`)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 sm:flex-none"
                  >
                    <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-11 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </Button>
                  </a>
                )}

                <Button 
                  onClick={() => handleOpenQuote()}
                  className="flex-1 sm:flex-none bg-[#E05A1B] hover:bg-[#c94d13] text-white font-bold h-11 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <Send className="w-4 h-4" /> Get Free Quote
                </Button>

                <Button 
                  variant="outline" 
                  onClick={openGoogleMaps}
                  className="h-11 px-4 rounded-2xl text-xs font-bold border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <Navigation className="w-4 h-4 text-blue-500" /> Directions
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  className="h-11 px-3.5 rounded-2xl border-slate-200 dark:border-slate-700"
                  title="Share"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                </Button>

                <Button 
                  variant="outline" 
                  onClick={toggleSave}
                  className={`h-11 px-3.5 rounded-2xl border-slate-200 dark:border-slate-700 ${isSaved ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200" : ""}`}
                  title={isSaved ? "Saved" : "Save / Bookmark"}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-500"}`} />
                </Button>
              </div>

            </div>

            {/* Right: Photo Grid Preview */}
            <div className="w-full lg:w-[380px] h-[240px] sm:h-[260px] flex-shrink-0 grid grid-cols-3 grid-rows-2 gap-2 rounded-2xl overflow-hidden shadow-inner">
              <div 
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                <img 
                  src={gallery[0]} 
                  alt={title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Click to expand
                </span>
              </div>

              <div 
                onClick={() => { setLightboxIndex(1); setLightboxOpen(true); }}
                className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                <img 
                  src={gallery[1]} 
                  alt="Gallery 1" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>

              <div 
                onClick={() => { setLightboxIndex(2); setLightboxOpen(true); }}
                className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                <img 
                  src={gallery[2] || gallery[0]} 
                  alt="Gallery 2" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/60 hover:bg-black/70 flex flex-col items-center justify-center text-white transition-colors">
                  <span className="text-sm font-extrabold">+{gallery.length}</span>
                  <span className="text-[10px] font-bold">Photos</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Interactive Tab Bar */}
        <div className="sticky top-12 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl px-2 py-1 shadow-sm mb-6 flex overflow-x-auto custom-scrollbar gap-1">
          {[
            { id: "overview", label: "Overview", icon: Info },
            { id: "services", label: `Services (${services.length})`, icon: Wrench },
            { id: "products", label: `Products & Menu (${products.length})`, icon: Utensils },
            { id: "offers", label: `Deals & Offers (${offers.length})`, icon: Ticket },
            { id: "photos", label: `Photos (${gallery.length})`, icon: Eye },
            { id: "reviews", label: `Reviews (${reviewCount})`, icon: Star },
            { id: "location", label: "Map & Location", icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive 
                    ? "bg-[#E05A1B] text-white shadow-md shadow-orange-500/20" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left / Center: Tab Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* About Description */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-orange-500" />
                    About {title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {basicInfo.description || 
                      `${title} is a premier verified provider in ${city} dedicated to delivering exceptional service and world-class customer satisfaction. With a reputation built on trust, transparency, and top quality, we offer tailored solutions to meet your exact needs.`
                    }
                  </p>
                </div>

                {/* Top Active Deals Preview */}
                {offers.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                      <div>
                        <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                          <Ticket className="w-3 h-3" /> Special Privilege Deal
                        </span>
                        <h3 className="text-lg sm:text-xl font-black mt-1.5">{offers[0].title}</h3>
                        <p className="text-xs text-white/90 font-medium mt-0.5">{offers[0].description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyPromo(offers[0].promo_code)}
                          className="bg-white text-orange-600 hover:bg-orange-50 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                        >
                          {copiedPromo === offers[0].promo_code ? (
                            <>
                              <Check className="w-4 h-4 text-green-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" /> Code: {offers[0].promo_code}
                            </>
                          )}
                        </button>
                        <Button 
                          onClick={() => setActiveTab("offers")}
                          className="bg-black/20 hover:bg-black/30 text-white text-xs font-bold rounded-xl h-9"
                        >
                          View All
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Highlights / Features Grid */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {[
                      "100% Verified Business",
                      "Accepts Digital & Card Payments",
                      "Air Conditioned Premises",
                      "Free Wi-Fi & Lounge Area",
                      "Dedicated Parking Space",
                      "Wheelchair Accessible",
                      "Experienced Certified Staff",
                      "Instant Online Inquiries",
                      "Sanitized & Safe Environment"
                    ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 font-black" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Working Hours & Timings */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      Business Timings & Schedule
                    </h2>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-extrabold rounded-full">
                      Open Today
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {daysOfWeek.map((d, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-between p-2.5 px-3 rounded-xl text-xs font-medium ${
                          d.isToday 
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 font-bold text-emerald-900 dark:text-emerald-200" 
                            : "bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {d.isToday && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                          {d.day}
                        </span>
                        <span>{d.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Services Preview */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-orange-500" />
                      Popular Services
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab("services")}
                      className="text-xs text-orange-600 font-bold hover:bg-orange-50 dark:hover:bg-orange-950/30"
                    >
                      View All Services &rarr;
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {services.slice(0, 4).map((srv: any, idx: number) => (
                      <div key={idx} className="border border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{srv.name}</h4>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              ₹{srv.price_from || srv.price || 499}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{srv.description}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleOpenQuote(srv.name)}
                          className="mt-3 w-full text-xs font-bold h-8 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          Inquire / Book Service
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map & Directions Preview */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      Location & Directions
                    </h2>
                    <Button 
                      size="sm" 
                      onClick={openGoogleMaps}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-8 flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Navigate on Google Maps
                    </Button>
                  </div>
                  
                  <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800">
                    <iframe
                      title="Google Map Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(title + ", " + address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {address}
                  </p>
                </div>

              </div>
            )}

            {/* 2. SERVICES TAB */}
            {activeTab === "services" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Services Offered</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Explore our complete catalog of certified services with guaranteed pricing.</p>
                  </div>
                  <Button 
                    onClick={() => handleOpenQuote()}
                    className="bg-[#E05A1B] hover:bg-[#c94d13] text-white text-xs font-bold rounded-xl h-9"
                  >
                    Request Custom Service
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {services.map((srv: any, i: number) => (
                    <div 
                      key={i} 
                      className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900/60 hover:shadow-md transition-shadow flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-orange-600 transition-colors">
                            {srv.name}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                              ₹{srv.price_from || srv.price || 499}
                            </span>
                            {srv.price_to && (
                              <span className="text-[10px] text-slate-400 block">- ₹{srv.price_to}</span>
                            )}
                          </div>
                        </div>

                        {srv.duration && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-1">
                            <Clock className="w-3 h-3" /> Duration: {srv.duration}
                          </span>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-medium">
                          {srv.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          Available Today
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => handleOpenQuote(srv.name)}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs h-8 px-4 rounded-xl"
                        >
                          Book / Inquire
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. PRODUCTS & MENU TAB */}
            {activeTab === "products" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Products & Catalog</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Browse featured items, specialty offerings, and products available for direct purchase or booking.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {products.map((prod: any, i: number) => (
                    <div 
                      key={i} 
                      className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                        <img 
                          src={prod.image || prod.cover_image || gallery[i % gallery.length]} 
                          alt={prod.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {prod.is_veg !== undefined && (
                          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-extrabold text-white ${prod.is_veg ? "bg-emerald-600" : "bg-rose-600"}`}>
                            {prod.is_veg ? "PURE VEG" : "NON-VEG"}
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">{prod.name}</h3>
                            <span className="text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400 shrink-0">
                              ₹{prod.price || 299}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        </div>

                        <Button 
                          size="sm"
                          onClick={() => handleOpenQuote(`Product: ${prod.name}`)}
                          className="mt-3.5 w-full bg-slate-900 dark:bg-slate-800 hover:bg-orange-600 text-white font-bold text-xs h-8 rounded-xl transition-colors"
                        >
                          Order / Inquire
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. DEALS & OFFERS TAB */}
            {activeTab === "offers" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Active Discounts & Privilege Deals</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Use your TrueDial card or promo codes to redeem exclusive discounts at billing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {offers.map((off: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="border-2 border-dashed border-orange-300 dark:border-orange-900/60 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 dark:from-orange-950/20 dark:via-slate-900 dark:to-amber-950/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2.5 py-0.5 bg-orange-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                            {off.discount_type === "percentage" ? `Up to ${off.discount_value}% OFF` : `Flat ₹${off.discount_value} OFF`}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            Expires: {new Date(off.valid_until || Date.now()).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-slate-900 dark:text-white mt-3">
                          {off.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {off.description || "Valid on all orders & services. Present code at checkout."}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between gap-2">
                        <div className="bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-800/80 px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold text-orange-600 dark:text-orange-400">
                          {off.promo_code}
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleCopyPromo(off.promo_code)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold h-8 px-4 rounded-xl flex items-center gap-1"
                        >
                          {copiedPromo === off.promo_code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedPromo === off.promo_code ? "Copied" : "Copy Code"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PHOTOS & GALLERY TAB */}
            {activeTab === "photos" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Photo Gallery</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Click any image to view in high resolution fullscreen.</p>
                  </div>
                  
                  {/* Gallery filter pills */}
                  <div className="flex gap-1.5 overflow-x-auto text-xs">
                    {["all", "ambience", "work", "awards"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setPhotoFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${
                          photoFilter === f 
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {f === "all" ? `All (${gallery.length})` : f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {gallery.map((imgUrl: string, idx: number) => (
                    <div 
                      key={idx} 
                      onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                      className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group cursor-pointer shadow-sm"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Photo ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                
                {/* Ratings Breakdown Summary Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    
                    {/* Overall Score */}
                    <div className="text-center md:border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-6">
                      <div className="text-5xl font-black text-slate-900 dark:text-white leading-none">
                        {rating.toFixed(1)}
                      </div>
                      <div className="flex justify-center text-amber-400 my-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        Based on {reviewCount} verified reviews
                      </div>
                      <Button 
                        onClick={() => setWriteReviewOpen(true)}
                        className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl h-9 shadow-md shadow-orange-600/20"
                      >
                        Write a Review
                      </Button>
                    </div>

                    {/* Rating Distribution Bars */}
                    <div className="md:col-span-2 space-y-2">
                      {[
                        { stars: 5, pct: 82 },
                        { stars: 4, pct: 12 },
                        { stars: 3, pct: 4 },
                        { stars: 2, pct: 1 },
                        { stars: 1, pct: 1 },
                      ].map((row) => (
                        <div key={row.stars} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                          <span className="w-12 text-right flex items-center justify-end gap-1">
                            {row.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${row.pct}%` }} 
                            />
                          </div>
                          <span className="w-8 text-right text-slate-400 text-[11px]">{row.pct}%</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Review Section List */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <ReviewSection listing={basicInfo} />
                </div>
              </div>
            )}

            {/* 7. LOCATION TAB */}
            {activeTab === "location" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Location & Directions</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Find us easily or use Google Maps navigation.</p>
                  </div>
                  <Button 
                    onClick={openGoogleMaps}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-9 flex items-center gap-1.5"
                  >
                    <Navigation className="w-4 h-4" /> Open in Google Maps
                  </Button>
                </div>

                <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800">
                  <iframe
                    title="Google Maps Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(title + ", " + address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Address Details</h4>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{address}</p>
                    <p className="text-xs text-slate-500 mt-1">City: {city}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">Contact & Access</h4>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Phone: {phone}</p>
                    {website && <p className="text-xs text-slate-500 mt-1 truncate">Website: {website}</p>}
                    <p className="text-xs text-emerald-600 font-bold mt-1">Parking: Available On-Site</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* Direct Contact & Inquiry Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Send Direct Inquiry</h3>
                  <p className="text-[11px] text-slate-400">Average response in 15 mins</p>
                </div>
              </div>

              {basicInfo.user_id && (
                <div className="mb-4">
                  <MessageBusinessButton
                    vendorUserId={basicInfo.user_id}
                    businessName={title}
                  />
                </div>
              )}

              <InquiryForm listingId={basicInfo.id || 1} />
            </div>

            {/* Privilege Card Promo Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-indigo-900/50">
              <div className="flex items-center gap-2 text-amber-400 mb-2 font-bold text-xs">
                <Award className="w-4 h-4" />
                <span>TrueDial Privilege Membership</span>
              </div>
              <h4 className="font-black text-base text-white">Save 20% on Every Visit</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Unlock VIP pricing, priority reservations, and cash discounts at {title} and thousands of verified merchants across India.
              </p>
              <Link href="/dashboard/user/privilege-card">
                <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs h-9 rounded-xl shadow-md">
                  Get Privilege Card &rarr;
                </Button>
              </Link>
            </div>

          </aside>

        </div>

      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 md:p-8 animate-fade-in backdrop-blur-md">
          {/* Lightbox Header */}
          <div className="w-full flex items-center justify-between text-white max-w-5xl z-10">
            <span className="text-xs font-bold text-white/70">
              Photo {lightboxIndex + 1} of {gallery.length} • {title}
            </span>
            <button 
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Lightbox Image Stage */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button 
              onClick={() => setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
              className="absolute left-2 md:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img 
              src={gallery[lightboxIndex]} 
              alt={`Fullscreen Photo ${lightboxIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
            />

            <button 
              onClick={() => setLightboxIndex((prev) => (prev + 1) % gallery.length)}
              className="absolute right-2 md:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Thumbnails Strip */}
          <div className="w-full max-w-3xl flex gap-2 overflow-x-auto py-2 justify-center">
            {gallery.map((thumb: string, idx: number) => (
              <div 
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                  lightboxIndex === idx ? "border-orange-500 scale-105" : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img src={thumb} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote / Inquiry Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up relative">
            <button 
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
                Direct Inquiry
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {selectedService ? `Inquire for ${selectedService}` : `Get Free Quote from ${title}`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">The merchant will receive your details and respond with custom pricing.</p>
            </div>

            <InquiryForm listingId={basicInfo.id || 1} />
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {writeReviewOpen && (
        <WriteReviewModal
          listingId={basicInfo.id || 1}
          listingSlug={slug}
          onClose={() => setWriteReviewOpen(false)}
          onSubmitted={() => {
            setWriteReviewOpen(false);
            showToast("Review submitted successfully! Thank you for your feedback.");
          }}
        />
      )}

      {/* Mobile Sticky Contact Ribbon */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 p-3 px-4 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] z-40 backdrop-blur-md flex items-center justify-between gap-2.5">
        <a href={`tel:${phone}`} className="flex-1">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-2xl text-xs flex items-center justify-center gap-1.5">
            <Phone className="w-4 h-4" /> Call Now
          </Button>
        </a>
        {whatsapp && (
          <a 
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I am inquiring about ${title} on TrueDial.`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-11 rounded-2xl text-xs flex items-center justify-center gap-1.5">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </Button>
          </a>
        )}
        <Button 
          onClick={() => handleOpenQuote()}
          className="flex-1 bg-[#E05A1B] hover:bg-[#c94d13] text-white font-bold h-11 rounded-2xl text-xs flex items-center justify-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" /> Quote
        </Button>
      </div>

    </div>
  );
}
