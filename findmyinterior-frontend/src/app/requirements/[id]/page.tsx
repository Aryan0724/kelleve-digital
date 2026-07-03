"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { 
  Lock, Phone, Mail, CheckCircle, CheckCircle2, IndianRupee, Clock, Building2, Eye, Users, User,
  MapPin, Home, Maximize, Calendar, ShieldCheck, Flame, Star, ChevronLeft, 
  ChevronRight, Gavel, Upload, Image as ImageIcon, Briefcase, FileText, MessageCircle
} from "lucide-react";
import { AdvancedBidForm } from "@/components/bids/AdvancedBidForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BidComparisonMatrix } from "@/components/bids/BidComparisonMatrix";

export default function RequirementDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuthStore();
  
  const [requirement, setRequirement] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Modals
  const [showBidForm, setShowBidForm] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const reqType = searchParams?.get('type') || 'project';
  const getEndpoint = (id: string, suffix: string = '') => {
    let base = `/requirements/${id}`;
    if (reqType === 'rfq') base = `/rfqs/${id}`;
    if (reqType === 'job') base = `/worker-jobs/${id}`; // assuming this route returns bids too
    return base + suffix;
  };

  useEffect(() => {
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
        // Fallback for different API responses
        setBids(res.data.data || res.data || []);
      }).catch(console.error);
    }
  }, [requirement?.id, user?.id, reqType]);

  const handleAwardBid = async (bidId: number) => {
    try {
      await api.patch(`/bids/${bidId}/award`);
      alert("Project awarded successfully!");
      // Refresh the page
      window.location.reload();
    } catch (e) {
      alert("Failed to award project.");
    }
  };

  const inviteToBid = async (vendorId: number) => {
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      await api.post(`/requirements/${params.id}/invite-vendor${typeStr}`, { vendor_id: vendorId });
      alert("Vendor invited successfully!");
      setRecommendations(prev => prev.map(r => r.vendor_id === vendorId ? { ...r, invited_at: new Date().toISOString() } : r));
    } catch (e) {
      alert("Failed to invite vendor.");
    }
  };

  const handleUnlockContact = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    setUnlockLoading(true);
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      await api.post(`/requirements/${params.id}/unlock${typeStr}`);
      setIsUnlocked(true);
      alert("Contact unlocked successfully!");
      setShowUnlockModal(false);
      // Refresh to get the actual contact details
      const res = await api.get(getEndpoint(params.id as string));
      setRequirement(res.data.data);
    } catch (err: any) {
      if (err.response?.status === 402 || err.response?.data?.message?.includes('balance')) {
        alert("Insufficient wallet balance. Please recharge your wallet.");
        router.push("/dashboard/wallet/recharge");
      } else {
        alert(err.response?.data?.message || "Failed to unlock contact.");
      }
    } finally {
      setUnlockLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-500">Loading Requirement...</div>;
  if (!requirement) return <div className="p-20 text-center">Requirement not found.</div>;

  const isProfessional = user && user.role !== 'customer';
  const isOwner = user?.id === requirement?.user_id;
  const isWorker = user?.roles?.some((r: any) => r.slug === 'worker' || r.slug === 'skilled_worker') || user?.role === 'worker' || user?.role === 'skilled_worker';
  const displayUnlockPrice = (isWorker && reqType === 'job') ? "Free" : (requirement?.unlock_price ? `₹${requirement.unlock_price}` : "₹49");

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-10">
      
      {/* Top Banner */}
      <div className="bg-[#0b1b36] text-white flex justify-between items-center px-4 md:px-8 py-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">|</span>
          <span className="text-slate-200">12 Interior Companies already interested</span>
        </div>
        <div className="bg-[#ff6b00] -my-2 py-2 px-6 rounded-l-full flex items-center gap-2 font-semibold">
          <Clock className="w-4 h-4" />
          Posted {requirement.created_at || "2 Hours Ago"}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* Main Content Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          
          {/* Header Row */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#4CAF50] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                {requirement.status === 'open' ? 'NEW PROJECT' : requirement.status.toUpperCase()}
              </span>
              {requirement.payment_status && requirement.payment_status !== 'Unpaid' && (
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                  {requirement.payment_status.toUpperCase()}
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                {requirement.title}
                <ShieldCheck className="w-6 h-6 text-[#ff6b00]" fill="#ff6b00" stroke="white" />
                {isOwner && requirement.status === 'open' && (
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="ml-auto" 
                    onClick={async () => {
                      if (confirm("Are you sure you want to close this requirement? Professionals will no longer be able to bid on it.")) {
                        try {
                          const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                          await api.patch(`/requirements/${requirement.id}/status${typeStr}`, { status: 'closed' });
                          setRequirement({ ...requirement, status: 'closed' });
                        } catch(e) {
                          alert("Failed to close requirement.");
                        }
                      }
                    }}
                  >
                    Close Requirement
                  </Button>
                )}
                {isOwner && requirement.status === 'closed' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-auto text-green-600 border-green-600 hover:bg-green-50" 
                    onClick={async () => {
                      try {
                        const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                        await api.patch(`/requirements/${requirement.id}/status${typeStr}`, { status: 'open' });
                        setRequirement({ ...requirement, status: 'open' });
                      } catch(e) {
                        alert("Failed to reopen requirement.");
                      }
                    }}
                  >
                    Reopen Requirement
                  </Button>
                )}
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700 font-medium">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {requirement.city}, {requirement.district}</span>
              
              {reqType === 'project' && (
                <>
                  <span className="flex items-center gap-1.5"><Home className="w-4 h-4" /> {requirement.project_type || "Residential"}</span>
                  <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4" /> Area: {requirement.area || "Not specified"}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Budget: {requirement.formatted_budget}</span>
                </>
              )}
              
              {reqType === 'job' && (
                <>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Role: {requirement.skills_required || "Worker"}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Duration: {requirement.duration || "Not specified"}</span>
                  <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4" /> Rate: {requirement.daily_rate ? `₹${requirement.daily_rate}/day` : "Not specified"}</span>
                </>
              )}
              
              {reqType === 'rfq' && (
                <>
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Material: {requirement.category || "General"}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Budget: {requirement.formatted_budget}</span>
                </>
              )}
            </div>
            
            {/* Completion Status Section */}
            {requirement.status === 'completed' && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Project Completed</h4>
                  <div className="text-sm text-green-800 mt-1 flex flex-col sm:flex-row gap-2 sm:gap-6">
                    {requirement.completed_at && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> 
                        Completed on {new Date(requirement.completed_at).toLocaleDateString()}
                      </span>
                    )}
                    {(() => {
                      const awardedBid = bids?.find((b: any) => b.is_awarded || b.status === 'accepted' || b.status === 'completed');
                      if (awardedBid?.professional) {
                        return (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" /> 
                            Completed by <span className="font-semibold">{awardedBid.professional.name}</span>
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Images & Details) */}
            <div className="lg:col-span-2 space-y-6">
              
              {(() => {
                const displayImages = [];
                if (requirement.images && requirement.images.length > 0) {
                  displayImages.push(...requirement.images.map((img: any) => img.image_url || img));
                }
                if (requirement.image) {
                  displayImages.push(requirement.image);
                }

                return (
                  <div className={`grid grid-cols-1 ${displayImages.length > 0 ? 'md:grid-cols-2' : ''} gap-6`}>
                    {displayImages.length > 0 && (
                      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 group">
                        {(() => {
                          const showNav = displayImages.length > 1;
                          const safeIndex = currentImageIndex >= displayImages.length ? 0 : currentImageIndex;
                          
                          return (
                            <>
                              <img 
                                src={displayImages[safeIndex]}
                                alt="Project" 
                                className="w-full h-full object-cover transition-opacity duration-300"
                              />
                              <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                              
                              {showNav && (
                                <>
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentImageIndex(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                                  >
                                    <ChevronLeft className="w-5 h-5 text-slate-800" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentImageIndex(prev => prev === displayImages.length - 1 ? 0 : prev + 1);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                                  >
                                    <ChevronRight className="w-5 h-5 text-slate-800" />
                                  </button>
                                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-2 backdrop-blur-sm z-10">
                                    <ImageIcon className="w-4 h-4" />
                                    View Photos ({displayImages.length})
                                  </div>
                                  <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
                                    {displayImages.map((_: any, idx: number) => (
                                      <button
                                        key={idx}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setCurrentImageIndex(idx);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                          idx === safeIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}

                {/* Details List */}
                <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 border-l-4 border-[#ff6b00] pl-2">
                    {reqType === 'job' ? 'Job Requirements' : reqType === 'rfq' ? 'Material Details' : 'Project Details'}
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    {reqType === 'project' && (
                      <>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Site Condition:</span> {requirement.site_condition || "Not specified"}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Property Type:</span> {requirement.project_type || "Not specified"}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Possession:</span> {requirement.possession_timeline || "Not specified"}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Design Style:</span> {requirement.design_style || "Not specified"}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Work Type:</span> {requirement.work_type || "Not specified"}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Rooms:</span> {requirement.rooms || "Not specified"}</span></li>
                        {requirement.additional_requirements && (
                          <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Additional:</span> {requirement.additional_requirements}</span></li>
                        )}
                      </>
                    )}
                    
                    {reqType === 'job' && (
                      <>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Skill Required:</span> {requirement.skills_required || "General Worker"}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Expected Duration:</span> {requirement.duration || "Not specified"}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Budget / Rate:</span> {requirement.formatted_budget}</span></li>
                      </>
                    )}
                    
                    {reqType === 'rfq' && (
                      <>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Material Category:</span> {requirement.category || "Not specified"}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Quantity Required:</span> {requirement.quantity || "Not specified"} {requirement.unit || ""}</span></li>
                        <li className="flex gap-2"><span className="text-[#ff6b00] mt-1">•</span><span><span className="font-medium">Delivery Required By:</span> {requirement.expected_delivery_date || "Not specified"}</span></li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            );
          })()}

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 border border-slate-100 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center text-center border-r border-slate-100">
                  <Users className="w-6 h-6 text-[#ff6b00] mb-1" />
                  <span className="font-extrabold text-xl text-slate-900">{requirement.bids_count || 0}</span>
                  <span className="text-xs text-slate-500 font-medium leading-tight">Companies<br/>Interested</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-r border-slate-100">
                  <Eye className="w-6 h-6 text-[#0b1b36] mb-1" />
                  <span className="font-extrabold text-xl text-slate-900">{requirement.views_count || 0}</span>
                  <span className="text-xs text-slate-500 font-medium leading-tight">Times<br/>Viewed</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <Calendar className="w-6 h-6 text-[#ff6b00] mb-1" />
                  <span className="font-extrabold text-xl text-slate-900 line-clamp-1 overflow-hidden" title={requirement.possession_timeline || requirement.expected_delivery_date || requirement.duration || "Not specified"}>
                    {requirement.possession_timeline || requirement.expected_delivery_date || requirement.duration || "N/A"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium leading-tight">Expected<br/>Timeline</span>
                </div>
              </div>

              {/* About Client & Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* About Client */}
                <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 border-l-4 border-slate-300 pl-2">About Client</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{requirement.name}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {requirement.city}, {requirement.district}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] text-slate-500 ml-1">{requirement.user?.vendorMetric?.rating_average || 5.0} ({requirement.user?.vendorMetric?.reviews_count || 0} Reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Requirements */}
                <div className="md:col-span-2 border border-slate-100 rounded-xl p-5 bg-white shadow-sm relative">
                  <FileText className="absolute top-5 left-5 w-5 h-5 text-slate-300" />
                  <h3 className="font-bold text-lg text-slate-900 mb-2 pl-8">Client Requirements</h3>
                  <p className="text-sm text-slate-600 leading-relaxed pl-8">
                    {requirement.description}
                  </p>
                </div>

                {/* Recommended Vendors */}
                {(isOwner || user?.role === 'admin') && recommendations.length > 0 && (
                  <div className="md:col-span-3 border border-orange-100 rounded-xl p-5 bg-orange-50 shadow-sm mt-2">
                    <h3 className="font-bold text-lg text-orange-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-600" fill="currentColor" /> Top Recommended Professionals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendations.slice(0, 6).map((rec: any) => (
                        <div key={rec.id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-slate-900">{rec.vendor?.name || 'Professional'}</span>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Score: {rec.match_score}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                              <span className="flex items-center"><Star className="w-3 h-3 text-yellow-500 mr-1" /> {rec.vendor?.vendorMetric?.rating_average || 0}</span>
                              <span>|</span>
                              <span>{rec.vendor?.vendorMetric?.response_rate || 0}% Response</span>
                              <span>|</span>
                              <span>{rec.vendor?.vendorMetric?.win_rate || 0}% Win</span>
                            </div>
                          </div>
                          <Button 
                            disabled={!!rec.invited_at} 
                            onClick={() => inviteToBid(rec.vendor_id)} 
                            variant="outline" 
                            className="w-full border-orange-200 text-orange-600 hover:bg-orange-100"
                          >
                            {rec.invited_at ? "Invited" : "Invite To Bid"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Column (Actions) */}
            <div className="space-y-4">
              
              {/* Unlock Contact Block */}
              {!isOwner && (
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-[#15803d] font-black text-xl">UNLOCK CONTACT</h2>
                      <p className="text-slate-700 text-sm font-medium">
                        Get Client Contact Number
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-[#16a34a] rounded-full flex items-center justify-center relative shadow-sm">
                      <Phone className="w-5 h-5 text-white" />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <Lock className="w-3 h-3 text-[#16a34a]" />
                      </div>
                    </div>
                  </div>

                  {isUnlocked || user?.role === 'admin' || requirement?.has_bid ? (
                    <div className="mt-4 bg-white rounded-lg p-4 border border-green-200 shadow-sm text-center">
                      {(isUnlocked || user?.role === 'admin') ? (
                        <>
                          <div className="text-2xl font-black text-slate-900 tracking-wider mb-1">{requirement.phone}</div>
                          <div className="text-sm text-slate-600 font-medium">{requirement.email || "No email provided"}</div>
                        </>
                      ) : (
                        <div className="text-sm text-slate-600 font-medium mb-2">Phone number hidden. Message to discuss further.</div>
                      )}
                      <div className="mt-3 text-xs font-bold text-green-700 bg-green-100 py-1.5 rounded flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" /> {isUnlocked || user?.role === 'admin' ? "Contact Unlocked" : "Messaging Unlocked"}
                      </div>
                      <p className="text-sm text-slate-700 mb-5 leading-relaxed mt-4">
                        Connect directly with the client to discuss the project.
                      </p>
                      <Button 
                        onClick={async () => {
                          try {
                            const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                            const res = await api.post(`/requirements/${requirement.id}/conversations${typeStr}`);
                            router.push(`/messages/${res.data.id}`);
                          } catch (err: any) {
                            alert(err.response?.data?.message || "Failed to start conversation.");
                          }
                        }}
                        className="w-full bg-[#0b1b36] hover:bg-slate-800 text-white font-bold h-12 text-base rounded-md flex gap-2 shadow-md"
                      >
                        <MessageCircle className="w-5 h-5" /> Message Client
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 mb-2 flex items-baseline">
                        <span className="text-4xl font-black text-[#16a34a]">{displayUnlockPrice}</span>
                        {!isWorker && <span className="text-slate-600 font-bold ml-1">/unlock</span>}
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-5 leading-relaxed">
                        Unlock & connect directly with the client to discuss the project.
                      </p>

                      <Button 
                        onClick={() => setShowUnlockModal(true)}
                        className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold h-12 text-base rounded-md flex gap-2 shadow-md"
                      >
                        <Lock className="w-4 h-4" /> UNLOCK NOW
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Context Aware Action Block */}
              {isOwner ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  {['awarded', 'in_progress', 'completed'].includes(requirement.status) ? (
                    <>
                      <h2 className="font-bold text-xl text-slate-900 mb-4 border-l-4 border-green-600 pl-2">
                        {requirement.status === 'completed' ? 'Completed By' : 'Awarded Professional'}
                      </h2>
                      <p className="text-sm text-slate-600 mb-4">
                        {requirement.status === 'completed' ? 'This project was successfully completed by:' : 'This project has been awarded to the following professional.'}
                      </p>
                      
                      {(() => {
                        const awardedBid = bids.find((b: any) => b.is_awarded || b.status === 'accepted' || b.status === 'completed');
                        if (awardedBid?.professional) {
                          return (
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col md:flex-row gap-4 border border-slate-100 rounded-xl p-4 bg-slate-50 items-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                  {awardedBid.professional.avatar ? (
                                    <img src={awardedBid.professional.avatar} alt={awardedBid.professional.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="font-bold text-slate-400 text-xl">{awardedBid.professional.name?.charAt(0) || 'V'}</span>
                                  )}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                  <h3 className="font-bold text-lg text-slate-800">{awardedBid.professional.name}</h3>
                                  <div className="text-sm text-slate-500 font-medium">
                                    Winning Bid Amount: ₹{Number(awardedBid.amount).toLocaleString('en-IN')}
                                  </div>
                                  <div className="text-xs text-slate-400 mt-1">Awarded on {new Date(awardedBid.updated_at || awardedBid.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className="shrink-0 flex flex-col gap-2">
                                  <Button 
                                    onClick={async () => {
                                      try {
                                        const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                                        const res = await api.post(`/requirements/${requirement.id}/conversations${typeStr}`, { vendor_id: awardedBid.professional_id });
                                        router.push(`/messages/${res.data.id}`);
                                      } catch (err: any) {
                                        alert("Failed to start conversation.");
                                      }
                                    }}
                                    className="bg-[#0b1b36] hover:bg-slate-800 text-white"
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" /> Message
                                  </Button>
                                  <Button 
                                    onClick={() => router.push(`/professionals/${awardedBid.professional_id}`)}
                                    variant="outline"
                                  >
                                    <User className="w-4 h-4 mr-2" /> View Profile
                                  </Button>
                                </div>
                              </div>

                              {/* Customer Completion Button */}
                              {requirement.status === 'in_progress' && (
                                <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-xl text-center">
                                  <h3 className="font-bold text-blue-900 mb-2">Project In Progress</h3>
                                  <p className="text-sm text-blue-700 mb-4">The professional is working on this project. Once they finish, you can mark it as completed.</p>
                                  <Button 
                                    onClick={async () => {
                                      if (confirm("Are you sure you want to mark this project as completed?")) {
                                        try {
                                          const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                                          await api.patch(`/requirements/${requirement.id}/complete${typeStr}`);
                                          alert("Project completed successfully!");
                                          window.location.reload();
                                        } catch (e) {
                                          alert("Failed to complete project.");
                                        }
                                      }
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Mark as Completed
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        }
                        return <div className="p-4 text-center text-slate-500 border border-dashed rounded-lg">Professional details not available.</div>;
                      })()}
                    </>
                  ) : (
                    <>
                      <h2 className="font-bold text-xl text-slate-900 mb-4 border-l-4 border-[#0b1b36] pl-2">Received Bids</h2>
                      <p className="text-sm text-slate-600 mb-4">Compare bids from professionals and award the project.</p>
                      {bids.length > 0 ? (
                        <BidComparisonMatrix bids={bids} onAward={handleAwardBid} reqType={reqType} />
                      ) : (
                        <div className="text-center p-6 bg-slate-50 rounded border border-dashed border-slate-300">
                          <p className="text-slate-500 font-medium">No bids received yet.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* Professional Award Action Block */}
                  {requirement.status === 'awarded' && requirement.professional_id === user?.id && (
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-6 relative overflow-hidden mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-[#15803d] font-black text-xl">PROJECT AWARDED!</h2>
                          <p className="text-slate-700 text-sm font-medium">Congratulations! You won this bid.</p>
                        </div>
                        <div className="w-12 h-12 bg-[#16a34a] rounded-full flex items-center justify-center shadow-sm">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-5 mt-2">
                        Please review the project details. By accepting, you agree to start the project.
                      </p>
                      <Button 
                        onClick={async () => {
                          try {
                            const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                            await api.patch(`/requirements/${requirement.id}/accept-award${typeStr}`);
                            alert("Project accepted! Status updated to In Progress.");
                            window.location.reload();
                          } catch (e: any) {
                            alert(e.response?.data?.message || "Failed to accept project.");
                          }
                        }}
                        className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold h-12 text-base rounded-md flex gap-2 shadow-md"
                      >
                        <CheckCircle className="w-5 h-5" /> ACCEPT PROJECT & START WORK
                      </Button>
                    </div>
                  )}

                  {['in_progress', 'completed'].includes(requirement.status) && (requirement.professional_id === user?.id || requirement.worker_id === user?.id || requirement.supplier_id === user?.id) && (
                    <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-6 relative overflow-hidden mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-[#0369a1] font-black text-xl uppercase">{requirement.status === 'completed' ? 'PROJECT COMPLETED' : 'PROJECT IN PROGRESS'}</h2>
                          <p className="text-slate-700 text-sm font-medium">You are the official professional for this project.</p>
                        </div>
                        <div className="w-12 h-12 bg-[#0284c7] rounded-full flex items-center justify-center shadow-sm">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <Button 
                        onClick={async () => {
                          try {
                            if (!user) return;
                            const typeStr = reqType ? `?requirement_type=${reqType}` : '';
                            const res = await api.post(`/requirements/${requirement.id}/conversations${typeStr}`, { vendor_id: user.id });
                            router.push(`/messages/${res.data.id}`);
                          } catch (err: any) {
                            alert("Failed to start conversation.");
                          }
                        }}
                        className="w-full bg-[#0b1b36] hover:bg-slate-800 text-white font-bold h-12 text-base rounded-md flex gap-2 shadow-md mb-2"
                      >
                        <MessageCircle className="w-5 h-5" /> Message Client
                      </Button>
                      
                      {requirement.status === 'in_progress' && (
                        <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
                          Complete the work and request the customer to mark the project as completed from their dashboard.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Standard Bid Block if not awarded to me */}
                  {(!['awarded', 'in_progress', 'completed'].includes(requirement.status) || requirement.has_bid) && requirement.professional_id !== user?.id && requirement.worker_id !== user?.id && requirement.supplier_id !== user?.id && (
                    <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-6 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h2 className="text-[#c2410c] font-black text-xl">BID FOR THIS PROJECT</h2>
                          <p className="text-slate-700 text-sm font-medium">Send Quote & Get the Project</p>
                        </div>
                        <div className="w-12 h-12 bg-[#ff6b00] rounded-full flex items-center justify-center shadow-sm">
                          <Gavel className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {requirement?.has_bid ? (
                        <div className="mt-6 text-center">
                          <div className="text-green-600 font-bold mb-4 flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Bid Submitted Successfully!
                          </div>
                          <p className="text-sm text-slate-600 mb-5">
                            You can now message the client to discuss the project using the messaging box above.
                          </p>
                          <Button disabled className="w-full bg-slate-100 text-slate-500 font-bold h-12 text-base rounded-md flex gap-2">
                            <CheckCircle className="w-4 h-4" /> BID SENT
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline justify-center mb-4">
                            <span className="text-3xl font-bold text-orange-600">{displayUnlockPrice}</span>
                            {!isWorker && <span className="text-slate-500 font-bold mb-1">/unlock</span>}
                          </div>
                          
                          <p className="text-sm text-slate-700 mb-5 leading-relaxed text-center">
                            Place your quote, showcase your profile & win this project.
                          </p>

                          <Button 
                            onClick={() => setShowBidForm(true)}
                            className="w-full bg-[#ff6b00] hover:bg-[#ea580c] text-white font-bold h-12 text-base rounded-md flex gap-2 shadow-md"
                          >
                            <Upload className="w-4 h-4" /> PLACE BID NOW
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
        
        {/* Bottom Banner */}
        <div className="mt-4 bg-[#fff7ed] border border-[#ffedd5] rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#16a34a]" />
            <div>
              <div className="font-bold text-sm text-slate-900">100% Safe & Secure</div>
              <div className="text-xs text-slate-600">Verified Projects Only</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-[#0b1b36]" />
            <div>
              <div className="font-bold text-sm text-slate-900">Direct Client Connect</div>
              <div className="text-xs text-slate-600">No Middleman</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="font-bold text-sm text-slate-900">Quality Projects</div>
              <div className="text-xs text-slate-600">Verified Budgets</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ChartBar className="w-8 h-8 text-[#16a34a]" />
            <div>
              <div className="font-bold text-sm text-slate-900">Grow Your Business</div>
              <div className="text-xs text-slate-600">Win More Projects</div>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#16a34a] p-4 text-white text-center">
              <h2 className="text-xl font-bold">Unlock Contact Details</h2>
            </div>
            <div className="p-6 space-y-4">
                {displayUnlockPrice === 'Free' ? (
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    This contact can be unlocked for <span className="font-bold text-slate-900">Free</span>.
                  </p>
                ) : (
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    A fee of <span className="font-bold text-slate-900">{displayUnlockPrice}</span> will be deducted from your wallet to instantly unlock the client&apos;s phone number and email.
                  </p>
                )}
              
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 font-semibold h-11" onClick={() => setShowUnlockModal(false)}>Cancel</Button>
                <Button 
                  className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold h-11" 
                  onClick={handleUnlockContact}
                  disabled={unlockLoading}
                >
                  {unlockLoading ? "Processing..." : "Confirm Unlock"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBidForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto backdrop-blur-sm py-10">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden relative">
            <div className="bg-[#ff6b00] p-5 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Gavel className="w-5 h-5"/> Submit Your Bid</h2>
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
                }} 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Quick stub for missing icons to avoid import errors
function Award(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>; }
function ChartBar(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>; }
function XCircle(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>; }
