"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { 
  Lock, Phone, Mail, CheckCircle, CheckCircle2, IndianRupee, Clock, Building2, Eye, Users, User,
  MapPin, Home, Maximize, Calendar, ShieldCheck, Flame, Star, ChevronLeft, 
  ChevronRight, Gavel, Upload, Image as ImageIcon, Briefcase, FileText, MessageCircle,
  Share2, Award, TrendingUp, XCircle, PhoneCall, Sparkles
} from "lucide-react";
import { AdvancedBidForm } from "@/components/bids/AdvancedBidForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BidComparisonMatrix } from "@/components/bids/BidComparisonMatrix";
import { BookmarkButton } from "@/components/common/BookmarkButton";

export default function RequirementDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, setShowLoginModal } = useAuthStore();
  
  const [requirement, setRequirement] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  
  // Modals
  const [showBidForm, setShowBidForm] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const reqType = searchParams?.get('type') || 'project';
  const getEndpoint = (id: string, suffix: string = '') => {
    let base = `/requirements/${id}`;
    if (reqType === 'rfq') base = `/rfqs/${id}`;
    if (reqType === 'job') base = `/worker-jobs/${id}`;
    return base + suffix;
  };

  const fetchReq = async () => {
    try {
      const res = await api.get(getEndpoint(params.id as string));
      setRequirement(res.data.data);
      setIsUnlocked(res.data.data?.is_unlocked || false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReq();
  }, [params.id, reqType]);

  useEffect(() => {
    if (!requirement || !user) return;
    if (user.id === requirement.user_id || user.role === 'admin') {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      api.get(`/requirements/${params.id}/recommendations${typeStr}`).then(res => {
        setRecommendations(res.data.data);
      }).catch(err => console.error("Recommendations fetch error:", err));   
      
      api.get(`/requirements/${params.id}/bids${typeStr}`).then(res => {
        setBids(res.data.data || res.data || []);
      }).catch(console.error);
    }
  }, [requirement?.id, user?.id, reqType]);

  const handleAwardBid = async (bidId: number) => {
    try {
      await api.patch(`/bids/${bidId}/award`);
      toast.success("Project awarded successfully!");
      fetchReq();
      if (user?.id === requirement?.user_id || user?.role === 'admin') {
        const typeStr = reqType ? `?requirement_type=${reqType}` : '';
        const bidsRes = await api.get(`/requirements/${params.id}/bids${typeStr}`);
        setBids(bidsRes.data.data || bidsRes.data || []);
      }
    } catch (e) {
      toast.error("Failed to award project.");
    }
  };

  const inviteToBid = async (vendorId: number) => {
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      await api.post(`/requirements/${params.id}/invite-vendor${typeStr}`, { vendor_id: vendorId });
      toast.success("Vendor invited successfully!");
      setRecommendations(prev => prev.map(r => r.vendor_id === vendorId ? { ...r, invited_at: new Date().toISOString() } : r));
    } catch (e) {
      toast.error("Failed to invite vendor.");
    }
  };

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve(false);
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

  const startRazorpayPayment = async (amountToRecharge: number = 49) => {
    try {
      const orderRes = await api.post("/payments/create-order", {
        purpose: "wallet_recharge",
        amount: amountToRecharge,
      });
      const orderId = orderRes.data.order_id;
      const amountInPaise = orderRes.data.amount;
      const rzpKey = orderRes.data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TRfrjzfAExcLjs";

      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      const options = {
        key: rzpKey,
        amount: amountInPaise.toString(),
        currency: "INR",
        name: "FindMyInterior",
        description: `Unlock Lead Contact: ₹${amountToRecharge}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment verified! Unlocking contact...");
            const typeStr = reqType ? `?requirement_type=${reqType}` : '';
            await api.post(`/requirements/${params.id}/unlock${typeStr}`);
            setIsUnlocked(true);
            toast.success("Contact unlocked successfully!");
            setShowUnlockModal(false);
            const res = await api.get(getEndpoint(params.id as string));
            setRequirement(res.data.data);
          } catch (verErr: any) {
            toast.error(verErr.response?.data?.message || "Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name || "User",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#ea580c",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment gateway.");
    }
  };

  const handleUnlockContact = async () => {
    if (!token) {
      setShowLoginModal(true, window.location.pathname);
      return;
    }

    const unlockPrice = requirement?.unlock_price || 49;
    const isWorker = user?.role === 'worker' || user?.role === 'skilled_worker';
    if (!isWorker && user?.wallet_balance !== undefined && Number(user.wallet_balance) < unlockPrice) {
      toast.info(`Recharging wallet ₹${unlockPrice} to unlock contact...`);
      await startRazorpayPayment(unlockPrice);
      return;
    }

    setUnlockLoading(true);
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      await api.post(`/requirements/${params.id}/unlock${typeStr}`);
      setIsUnlocked(true);
      toast.success("Contact unlocked successfully!");
      setShowUnlockModal(false);
      const res = await api.get(getEndpoint(params.id as string));
      setRequirement(res.data.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || "";
      const isBalance = err.response?.status === 402 || 
                        err.response?.data?.needs_recharge || 
                        msg.toLowerCase().includes('balance') || 
                        msg.toLowerCase().includes('recharge') || 
                        err.response?.status === 400;
      if (isBalance) {
        toast.info("Opening Razorpay to recharge wallet...");
        await startRazorpayPayment(unlockPrice);
      } else {
        toast.error(msg || "Failed to unlock contact.");
      }
    } finally {
      setUnlockLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: requirement?.title || "Project on Find My Interior",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Project link copied to clipboard!");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading Project Details...</p>
      </div>
    </div>
  );

  if (!requirement) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-8">
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm border max-w-md">
        <h3 className="font-bold text-lg text-slate-800 mb-2">Requirement Not Found</h3>
        <p className="text-slate-500 text-sm mb-4">This project or lead may have been removed or closed.</p>
        <Button onClick={() => router.push('/projects')} className="bg-[#ff6b00] hover:bg-orange-600">
          Browse Available Projects
        </Button>
      </div>
    </div>
  );

  const isProfessional = user && user.role !== 'customer';
  const isOwner = user?.id === requirement?.user_id;
  const isWorker = user?.roles?.some((r: any) => r.slug === 'worker' || r.slug === 'skilled_worker') || user?.role === 'worker' || user?.role === 'skilled_worker';
  const displayUnlockPrice = isWorker ? "Free" : (requirement?.unlock_price ? `₹${requirement.unlock_price}` : "₹1499");
  const displayBidPrice = requirement?.bid_fee ? `₹${requirement.bid_fee}` : "₹299";

  // Build images array
  const displayImages: string[] = [];
  if (requirement.images && Array.isArray(requirement.images) && requirement.images.length > 0) {
    displayImages.push(...requirement.images.map((img: any) => img.image_url || img));
  }
  if (requirement.image) {
    displayImages.push(requirement.image);
  }
  if (displayImages.length === 0) {
    displayImages.push("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200");
  }

  const safeImageIndex = currentImageIndex >= displayImages.length ? 0 : currentImageIndex;

  return (
    <div className="bg-[#f4f6f9] dark:bg-slate-950 min-h-screen pb-16 font-sans">
      
      {/* ─── 1. TOP URGENCY / LIVE HEADER BAR ─────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0b1b36] via-[#102447] to-[#0b1b36] text-white py-2 px-4 md:px-8 border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="text-orange-500 font-bold flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              ★ VERIFIED PROJECT
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-200 hidden sm:inline">
              {requirement.bids_count ? `${requirement.bids_count} Interior Companies already interested` : "12 Interior Companies already interested"}
            </span>
          </div>

          <div className="bg-[#ff6b00] text-white py-1 px-4 rounded-full flex items-center gap-1.5 font-bold shadow-sm shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>Posted {requirement.created_at_human || "2 Hours Ago"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
        
        {/* ─── 2. MAIN CARD CONTAINER ───────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 md:p-7 space-y-6">
          
          {/* Header Row: Badges, Title & Meta */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#16a34a] text-white text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {requirement.status === 'open' ? 'NEW PROJECT' : requirement.status.toUpperCase()}
                </span>
                {requirement.payment_status && requirement.payment_status !== 'Unpaid' && (
                  <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {requirement.payment_status.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Action Tools (Share, Bookmark, Owner controls) */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="h-8 px-2.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Share Project"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1" /> Share
                </Button>
                <BookmarkButton id={requirement.id} type={reqType === 'Project' ? 'Project' : 'Requirement'} className="h-8" />
                
                {isOwner && requirement.status === 'open' && (
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="h-8 text-xs font-semibold"
                    onClick={async () => {
                      if (confirm("Are you sure you want to close this requirement? Professionals will no longer be able to bid.")) {
                        try {
                          const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                          await api.patch(`/requirements/${requirement.id}/status${typeStr}`, { status: 'closed' });
                          setRequirement({ ...requirement, status: 'closed' });
                          toast.success("Requirement closed.");
                        } catch(e) {
                          toast.error("Failed to close requirement.");
                        }
                      }
                    }}
                  >
                    Close Project
                  </Button>
                )}
              </div>
            </div>

            {/* Title with Verified Check Badge */}
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3 leading-tight">
              {requirement.title}
              <ShieldCheck className="w-6 h-6 text-[#ff6b00] fill-[#ff6b00] stroke-white shrink-0" />
            </h1>

            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-4 md:gap-7 text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-[#ff6b00]" /> 
                {requirement.city || "Patna"}{requirement.district ? `, ${requirement.district}` : ", Bihar"}
              </span>
              
              <span className="flex items-center gap-1.5">
                <Home className="w-4 h-4 text-slate-400" /> 
                {requirement.project_type || "Residential"}
              </span>

              <span className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-slate-400" /> 
                Area: <strong className="text-slate-800 dark:text-slate-200">{requirement.area ? `${requirement.area} Sq.ft.` : "1450 Sq.ft."}</strong>
              </span>

              <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <IndianRupee className="w-4 h-4 text-[#16a34a]" /> 
                Budget: <span className="text-[#c2410c] dark:text-orange-400">{requirement.formatted_budget || "₹12 – 15 Lakh"}</span>
              </span>
            </div>
          </div>

          {/* ─── 3. TWO-COLUMN CONTENT GRID ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ─── LEFT COLUMN (Images & Details) ───────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* Hero Photo Box with View Photos Lightbox Trigger */}
                <div 
                  className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 group cursor-pointer shadow-sm border border-slate-200/60 dark:border-slate-800"
                  onClick={() => setShowGalleryModal(true)}
                >
                  <img 
                    src={displayImages[safeImageIndex]}
                    alt={requirement.title}
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Photo Count Pill Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowGalleryModal(true); }}
                    className="absolute bottom-3 right-3 bg-black/75 hover:bg-black text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                    View Photos ({displayImages.length})
                  </button>
                </div>

                {/* Project Details Bullet List */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-800/40 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2 border-l-4 border-[#ff6b00] pl-2.5">
                      Project Details
                    </h3>
                    <ul className="space-y-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-900 dark:text-white font-semibold">Site Condition:</strong> {requirement.site_condition || "Under Construction"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-900 dark:text-white font-semibold">Property Type:</strong> {requirement.project_type || "Apartment"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-900 dark:text-white font-semibold">Possession:</strong> {requirement.possession_timeline || "Aug 2025"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-900 dark:text-white font-semibold">Design Style:</strong> {requirement.design_style || "Modern"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-900 dark:text-white font-semibold">Work Type:</strong> {requirement.work_type || "Full Home Interior"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-900 dark:text-white font-semibold">Rooms:</strong> {requirement.rooms || "3 Bedrooms, 1 Living, 1 Kitchen"}</span>
                      </li>
                      {requirement.additional_requirements && (
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] mt-1.5 shrink-0"></span>
                          <span><strong className="text-slate-900 dark:text-white font-semibold">Additional:</strong> {requirement.additional_requirements}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* ─── 4-STATS METRICS ROW ───────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center mb-1">
                    <Users className="w-5 h-5 text-[#ff6b00]" />
                  </div>
                  <span className="font-black text-lg md:text-xl text-slate-900 dark:text-white">{requirement.bids_count || 12}</span>
                  <span className="text-[11px] text-slate-500 font-semibold leading-tight">Companies<br/>Interested</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-1">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-black text-lg md:text-xl text-slate-900 dark:text-white">{requirement.views_count || 156}</span>
                  <span className="text-[11px] text-slate-500 font-semibold leading-tight">Times<br/>Viewed</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-1">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-black text-base md:text-lg text-slate-900 dark:text-white line-clamp-1">
                    {requirement.possession_timeline || "30 May 2025"}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold leading-tight">Project<br/>Deadline</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center p-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-1">
                    <ShieldCheck className="w-5 h-5 text-[#16a34a]" />
                  </div>
                  <span className="font-black text-base md:text-lg text-emerald-600 dark:text-emerald-400">Verified</span>
                  <span className="text-[11px] text-slate-500 font-semibold leading-tight">Phone & Property<br/>Verified</span>
                </div>
              </div>

              {/* ─── ABOUT CLIENT & CLIENT REQUIREMENTS ───────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* About Client Card */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-center">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-3 border-l-4 border-slate-300 pl-2">
                    About Client
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden shrink-0 shadow-inner">
                      {requirement.user?.avatar ? (
                        <img src={requirement.user.avatar} alt="Client" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{requirement.name || requirement.user?.name || "Rahul Kumar"}</span>
                        <span className="bg-[#16a34a] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">Verified</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-500" /> {requirement.city || "Patna, Bihar"}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-400" />
                        ))}
                        <span className="text-[10px] text-slate-500 font-bold ml-1">4.8 (23 Reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Requirements Paragraph */}
                <div className="md:col-span-2 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 shadow-sm relative">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
                    <span className="text-orange-500 font-serif text-lg leading-none">❝</span> Client Requirements
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {requirement.description || "I am looking for a professional interior company for my 3BHK flat. Need modular kitchen, wardrobes in all rooms, TV unit, false ceiling and complete home interior work with modern design."}
                  </p>
                </div>
              </div>

            </div>

            {/* ─── RIGHT COLUMN (MONETIZATION & ACTION CARDS) ─────────────── */}
            <div className="space-y-4">
              
              {/* CARD 1: UNLOCK CONTACT (GREEN THEME) */}
              {!isOwner && (
                <div className="bg-[#f0fdf4] dark:bg-emerald-950/20 border-2 border-[#bbf7d0] dark:border-emerald-900/50 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-[#15803d] dark:text-emerald-400 font-black text-lg tracking-tight">UNLOCK CONTACT</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">Get Client Contact Number</p>
                    </div>
                    <div className="w-11 h-11 bg-[#16a34a] rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {isUnlocked || user?.role === 'admin' || requirement?.has_bid ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-emerald-200 dark:border-emerald-900/60 shadow-sm text-center space-y-3">
                      <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-wider font-mono">
                        {requirement.phone || "+91 98765 43210"}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {requirement.email || "client@findmyinterior.com"}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 py-1 px-3 rounded-md flex items-center justify-center gap-1 border border-emerald-200/50">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Contact Details Unlocked
                      </div>

                      {/* Direct Interactive Call & WhatsApp Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {requirement.phone && (
                          <a 
                            href={`tel:${requirement.phone}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call Client
                          </a>
                        )}
                        <Button 
                          onClick={async () => {
                            try {
                              const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                              const res = await api.post(`/requirements/${requirement.id}/conversations${typeStr}`);
                              router.push(`/messages/${res.data.id}`);
                            } catch (err: any) {
                              toast.error(err.response?.data?.message || "Failed to start conversation.");
                            }
                          }}
                          className="bg-[#0b1b36] hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Chat
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="my-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl md:text-4xl font-black text-[#16a34a] dark:text-emerald-400">
                            {displayUnlockPrice}
                          </span>
                          {!isWorker && <span className="text-slate-600 dark:text-slate-400 font-bold text-sm">/unlock</span>}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                          Unlock & connect directly with the client to discuss the project.
                        </p>
                      </div>

                      <Button 
                        onClick={() => setShowUnlockModal(true)}
                        className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black text-sm h-11 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-600/20 active:scale-95 transition-all uppercase tracking-wide"
                      >
                        <Lock className="w-4 h-4" /> UNLOCK NOW
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* CARD 2: BID FOR THIS PROJECT (ORANGE THEME) */}
              {requirement?.is_early_access_locked ? (
                <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-600/10 border-2 border-amber-400 dark:border-amber-600/60 rounded-2xl p-5 shadow-md relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider mb-1">
                        <Sparkles className="w-3 h-3" /> PREMIUM EXCLUSIVE
                      </div>
                      <h2 className="text-slate-900 dark:text-white font-black text-lg tracking-tight">EARLY LEAD ACCESS</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">Reserved for QuickStart & Pro Members</p>
                    </div>
                    <div className="w-11 h-11 bg-amber-500 rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <Lock className="w-5 h-5 text-slate-950" />
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800 text-center space-y-3">
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500 animate-spin" /> Unlocks for Free Members in ~{requirement.early_access_remaining_minutes} min
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Upgrade to a paid membership to bid immediately and get ahead of your competition.
                    </p>
                    <Link href="/dashboard?tab=subscription" className="block w-full">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs h-11 rounded-xl shadow-md uppercase tracking-wider">
                        👑 Upgrade for Instant Access
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-[#fff7ed] dark:bg-orange-950/20 border-2 border-[#fed7aa] dark:border-orange-900/50 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-[#c2410c] dark:text-orange-400 font-black text-lg tracking-tight">BID FOR THIS PROJECT</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">Send Quote & Get the Project</p>
                    </div>
                    <div className="w-11 h-11 bg-[#ff6b00] rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <Gavel className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {requirement?.has_bid ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-orange-200 dark:border-orange-900/60 shadow-sm text-center space-y-2.5">
                      <div className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Bid Submitted Successfully!
                      </div>
                      <p className="text-xs text-slate-500">
                        Your quotation has been sent to the client. You will be notified when they review it.
                      </p>
                      <Button disabled className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold h-10 text-xs rounded-xl">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> BID SENT
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="my-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl md:text-4xl font-black text-[#ff6b00] dark:text-orange-500">
                            {displayBidPrice}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 font-bold text-sm">/bid</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                          Place your quote, showcase your profile & win this project.
                        </p>
                      </div>

                      <Button 
                        onClick={() => setShowBidForm(true)}
                        className="w-full bg-[#ff6b00] hover:bg-[#ea580c] text-white font-black text-sm h-11 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all uppercase tracking-wide"
                      >
                        <Upload className="w-4 h-4" /> PLACE BID NOW
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Received Bids Matrix for Owner / Admin */}
              {isOwner && bids.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white border-l-4 border-[#0b1b36] pl-2">
                    Received Quotations ({bids.length})
                  </h3>
                  <BidComparisonMatrix bids={bids} onAward={handleAwardBid} reqType={reqType} />
                </div>
              )}

            </div>
          </div>

          {/* ─── 4. BOTTOM TRUST GUARANTEE BAR ───────────────────────────── */}
          <div className="bg-[#fff7ed] dark:bg-slate-800/60 border border-[#ffedd5] dark:border-slate-700/60 rounded-2xl p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-[#16a34a] shrink-0">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <div className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">100% Safe & Secure</div>
                <div className="text-[11px] text-slate-500">Verified Projects Only</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 rounded-xl text-[#0b1b36] dark:text-blue-400 shrink-0">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <div className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">Direct Client Connect</div>
                <div className="text-[11px] text-slate-500">No Middleman</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-600 shrink-0">
                <Award className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <div className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">Quality Projects</div>
                <div className="text-[11px] text-slate-500">Verified Budgets</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-[#16a34a] shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <div className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">Grow Your Business</div>
                <div className="text-[11px] text-slate-500">Win More Projects</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ─── 5. FULLSCREEN PHOTO GALLERY LIGHTBOX MODAL ─────────────── */}
      {showGalleryModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setShowGalleryModal(false)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex justify-between items-center text-white mb-4 px-2">
              <span className="font-bold text-sm">Photo {safeImageIndex + 1} of {displayImages.length}</span>
              <button 
                onClick={() => setShowGalleryModal(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <XCircle className="w-7 h-7" />
              </button>
            </div>

            <div className="relative w-full flex items-center justify-center max-h-[70vh]">
              <img 
                src={displayImages[safeImageIndex]} 
                alt="Project Photo" 
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl bg-black/40" 
              />
              
              {displayImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto p-2 max-w-full">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                      idx === safeImageIndex ? 'border-orange-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── 6. UNLOCK CONFIRMATION MODAL ────────────────────────────── */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowUnlockModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#16a34a] p-5 text-white text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black tracking-tight">Unlock Client Contact</h2>
              <p className="text-xs text-white/90">Instant Access to Verified Phone & Messaging</p>
            </div>
            
            <div className="p-6 space-y-4 text-center">
              {displayUnlockPrice === 'Free' ? (
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  This contact can be unlocked for <strong className="text-emerald-600 font-bold">Free</strong> on your current account tier.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl font-black text-emerald-600 font-mono">{displayUnlockPrice}</div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Will be deducted from your wallet to instantly unlock the verified phone number, email, and direct WhatsApp channel.
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 pt-3">
                <Button 
                  variant="outline" 
                  className="flex-1 font-semibold h-11 rounded-xl text-xs" 
                  onClick={() => setShowUnlockModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold h-11 rounded-xl text-xs shadow-md" 
                  onClick={handleUnlockContact}
                  disabled={unlockLoading}
                >
                  {unlockLoading ? "Processing..." : "Confirm & Unlock"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 7. BID FORM MODAL ───────────────────────────────────────── */}
      {showBidForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto backdrop-blur-sm py-10" onClick={() => setShowBidForm(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden relative border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#ff6b00] p-5 text-white flex justify-between items-center">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Gavel className="w-5 h-5"/> Submit Your Project Proposal & Bid
              </h2>
              <button onClick={() => setShowBidForm(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <AdvancedBidForm 
                requirementId={requirement.id}
                requirementType={reqType} 
                onSuccess={() => {
                  setShowBidForm(false);
                  setRequirement({ ...requirement, has_bid: true });
                  toast.success("Bid submitted successfully!");
                }} 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
