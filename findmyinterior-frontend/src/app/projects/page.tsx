"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Filter, Search, Grid, List, Heart, Clock, CheckCircle2, 
  Lock, User, Briefcase, Phone, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthStore();
  const [unlockingId, setUnlockingId] = useState<number | null>(null);

  const handleUnlock = async (id: number, reqType: string = '') => {
    setUnlockingId(id);
    try {
      const typeStr = reqType ? `?requirement_type=${reqType}` : '';
      await api.post(`/requirements/${id}/unlock${typeStr}`);
      alert("Contact unlocked successfully!");
      router.push(`/requirements/${id}${typeStr}`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 402 || err.response?.data?.message?.toLowerCase().includes('balance')) {
        alert("Insufficient wallet balance. Redirecting to wallet recharge...");
        router.push("/dashboard?tab=wallet");
      } else {
        alert(err.response?.data?.message || "Failed to unlock contact.");
      }
    } finally {
      setUnlockingId(null);
    }
  };

  const getDisplayImages = (req: any) => {
    const imgs = [];
    if (req.images && req.images.length > 0) {
      imgs.push(...req.images.map((img: any) => img.image_url || img));
    }
    if (req.image) {
      imgs.push(req.image);
    }
    if (imgs.length === 0) {
      imgs.push("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80");
    }
    return imgs;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (req: any) => {
    if (req.budget_min && req.budget_max) {
      return `₹${(req.budget_min / 100000).toFixed(1)} - ${(req.budget_max / 100000).toFixed(1)} Lakh`;
    }
    if (req.budget) {
      return `₹${req.budget}`;
    }
    return "Negotiable";
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16 font-sans">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT SIDEBAR - FILTERS */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
          <Card className="p-5 border border-slate-200 shadow-sm rounded-xl bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-slate-800 text-lg">Filter Projects</h3>
              <Filter className="w-4 h-4 text-slate-500" />
            </div>

            <div className="space-y-5">
              {/* Project Category */}
              <div>
                <label className="text-xs font-bold mb-2 block text-slate-700">Project Category</label>
                <div className="relative border border-slate-200 rounded-lg bg-white overflow-hidden">
                  <select className="w-full appearance-none bg-transparent py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none">
                    <option>All Categories</option>
                    <option>Interior Design</option>
                    <option>Construction</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold mb-2 block text-slate-700">Location</label>
                <div className="relative border border-slate-200 rounded-lg bg-white overflow-hidden flex items-center">
                  <Input placeholder="Enter Location" className="border-0 focus-visible:ring-0 shadow-none text-sm font-medium" />
                  <MapPin className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="text-xs font-bold mb-2 block text-slate-700">Budget Range</label>
                <div className="flex gap-2">
                  <div className="relative border border-slate-200 rounded-lg bg-white flex-1 overflow-hidden">
                    <select className="w-full appearance-none bg-transparent py-2 pl-3 pr-6 text-sm font-medium text-slate-700 focus:outline-none">
                      <option>Min</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative border border-slate-200 rounded-lg bg-white flex-1 overflow-hidden">
                    <select className="w-full appearance-none bg-transparent py-2 pl-3 pr-6 text-sm font-medium text-slate-700 focus:outline-none">
                      <option>Max</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="text-xs font-bold mb-2 block text-slate-700">Property Type</label>
                <div className="relative border border-slate-200 rounded-lg bg-white overflow-hidden">
                  <select className="w-full appearance-none bg-transparent py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none">
                    <option>All Types</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Area (Sq. Ft.) */}
              <div>
                <label className="text-xs font-bold mb-2 block text-slate-700">Area (Sq. Ft.)</label>
                <div className="flex gap-2">
                  <div className="relative border border-slate-200 rounded-lg bg-white flex-1 overflow-hidden">
                    <select className="w-full appearance-none bg-transparent py-2 pl-3 pr-6 text-sm font-medium text-slate-700 focus:outline-none">
                      <option>Min</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative border border-slate-200 rounded-lg bg-white flex-1 overflow-hidden">
                    <select className="w-full appearance-none bg-transparent py-2 pl-3 pr-6 text-sm font-medium text-slate-700 focus:outline-none">
                      <option>Max</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Project Status */}
              <div>
                <label className="text-xs font-bold mb-2 block text-slate-700">Project Status</label>
                <div className="relative border border-slate-200 rounded-lg bg-white overflow-hidden">
                  <select className="w-full appearance-none bg-transparent py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none">
                    <option>All Status</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Verified Projects Only */}
              <div className="flex items-center gap-2 pt-2 pb-2">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#E8701A] focus:ring-[#E8701A]" />
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                  Verified Projects Only <CheckCircle2 className="w-4 h-4 text-[#E8701A]" />
                </label>
              </div>

              <Button className="w-full bg-[#E8701A] hover:bg-[#c25a12] text-white font-bold h-11 rounded-lg transition-all shadow-md flex items-center justify-center gap-2">
                <Filter className="w-4 h-4" /> Apply Filters
              </Button>
            </div>
          </Card>

          {/* How It Works Block */}
          <div className="bg-white p-5 border border-slate-200 shadow-sm rounded-xl">
            <h4 className="font-extrabold text-slate-800 text-sm text-center mb-4">How it Works?</h4>
            <div className="flex items-start justify-between text-center relative">
              <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-200 -z-0"></div>
              
              <div className="flex flex-col items-center flex-1 z-10 bg-white">
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white mb-2">
                  <Briefcase className="w-4 h-4 text-slate-700" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 leading-tight">Choose<br/>Project</span>
              </div>
              
              <div className="flex flex-col items-center flex-1 z-10 bg-white">
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white mb-2">
                  <Lock className="w-4 h-4 text-slate-700" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 leading-tight">Apply<br/>or Unlock</span>
              </div>

              <div className="flex flex-col items-center flex-1 z-10 bg-white">
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white mb-2">
                  <User className="w-4 h-4 text-slate-700" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 leading-tight">Connect &<br/>Start Work</span>
              </div>
            </div>
          </div>

          {/* Need Help Block */}
          <div className="bg-white p-5 border border-slate-200 shadow-sm rounded-xl">
            <h4 className="font-extrabold text-slate-800 text-sm mb-1">Need Help?</h4>
            <p className="text-xs text-slate-500 mb-4 font-medium">Our team is ready to help you</p>
            <Button variant="outline" className="w-full border-[#E8701A] text-[#E8701A] hover:bg-orange-50 font-bold h-10 rounded-lg flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> +91 9534900999
            </Button>
          </div>
        </div>

        {/* RIGHT MAIN AREA */}
        <div className="flex-1 space-y-5">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Latest Projects</h2>
              <p className="text-sm text-slate-500 font-medium">Find and bid on interior projects posted by homeowners</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <span>Sort by :</span>
                <div className="relative border border-slate-200 rounded-md bg-white overflow-hidden w-28">
                  <select className="w-full appearance-none bg-transparent py-1.5 pl-3 pr-8 focus:outline-none">
                    <option>Latest</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-1 border border-slate-200 rounded-md bg-white p-1">
                <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-50"><Grid className="w-4 h-4" /></button>
                <button className="p-1.5 text-[#E8701A] bg-orange-50 rounded"><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Project List */}
          {loading ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E8701A] mb-4"></div>
              <p className="text-slate-500 font-medium">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            projects.map((req: any) => {
              const imgs = getDisplayImages(req);
              const isRFQ = req.opportunity_type === "RFQ";
              const isJob = req.opportunity_type === "JOB";
              const reqType = isRFQ ? "rfq" : isJob ? "job" : "project";

              return (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Left Image Gallery Area */}
                {!isJob && (
                <div className="w-full xl:w-[280px] shrink-0 p-3 flex gap-1 h-[200px] xl:h-[190px]">
                  {/* Main large image */}
                  <div className={`flex-[3] ${imgs.length > 1 ? 'rounded-l-lg' : 'rounded-lg'} overflow-hidden relative bg-slate-100`}>
                    <img 
                      src={imgs[0]} 
                      alt={req.title}
                      className="w-full h-full object-cover" 
                    />
                    <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 border-none px-2 py-0.5 text-[10px] font-bold">
                      {req.opportunity_type === 'tender' ? 'Featured' : 'New'}
                    </Badge>
                  </div>
                  {/* Side thumbnails column */}
                  {imgs.length > 1 && (
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex-1 rounded-tr-lg overflow-hidden bg-slate-100">
                      <img src={imgs[1] || imgs[0]} className="w-full h-full object-cover" alt="thumb1" />
                    </div>
                    <div className="flex-1 overflow-hidden bg-slate-100">
                      <img src={imgs[2] || imgs[0]} className="w-full h-full object-cover" alt="thumb2" />
                    </div>
                    <div className="flex-1 rounded-br-lg overflow-hidden relative bg-slate-100">
                      <img src={imgs[3] || imgs[0]} className="w-full h-full object-cover" alt="thumb3" />
                      {imgs.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                        +{imgs.length - 4}
                      </div>
                      )}
                    </div>
                  </div>
                  )}
                </div>
                )}

                {/* Center Content Area */}
                <div className="flex-1 p-5 border-b xl:border-b-0 xl:border-r border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-extrabold text-slate-900 text-lg leading-tight">{req.title}</h4>
                      <button className="text-slate-400 hover:text-red-500 transition-colors ml-2 shrink-0">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center text-xs font-semibold text-slate-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 mr-1" /> 
                      {typeof req.city === 'string' ? req.city : (req.city?.name || "Patna, Bihar")}
                    </div>
                    
                    {/* Info Grid (Budget, Area, Posted) */}
                    <div className="flex items-center gap-6 mb-4 text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center"><Briefcase className="w-3.5 h-3.5" /></div>
                        <div>
                          <div className="text-[10px] text-slate-500 font-medium leading-tight">Budget</div>
                          <span>{formatBudget(req)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center"><Filter className="w-3.5 h-3.5 rotate-90" /></div>
                        <div>
                          <div className="text-[10px] text-slate-500 font-medium leading-tight">Area</div>
                          <span>{req.area_sqft ? req.area_sqft : "1500 Sq. Ft."}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center"><Clock className="w-3.5 h-3.5" /></div>
                        <div>
                          <div className="text-[10px] text-slate-500 font-medium leading-tight">Posted</div>
                          <span>2 Hours Ago</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4 pr-4">
                      {req.description}
                    </p>
                  </div>

                  {/* Tags & Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-bold">3 BHK</span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-bold">Apartment</span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-bold">New Property</span>
                    <span className="text-green-600 flex items-center gap-1 text-[10px] font-bold ml-2">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
                
                {/* Right Action Area */}
                <div className="w-full xl:w-[200px] shrink-0 p-5 flex flex-col justify-center gap-3 bg-white">
                  <div className="text-center mb-1">
                     <div className="text-[10px] text-slate-500 font-bold mb-0.5">Expected Start</div>
                     <div className="font-extrabold text-slate-800 text-sm line-clamp-1 overflow-hidden" title={req.possession_timeline || req.expected_delivery_date || req.duration || "Within 30 Days"}>
                       {req.possession_timeline || req.expected_delivery_date || req.duration || "Within 30 Days"}
                     </div>
                  </div>
                  
                  {req.user_id !== user?.id && (
                    <>
                      <Link href={`/requirements/${req.id}?type=${reqType}`} className="w-full">
                        <Button className="w-full bg-[#E8701A] hover:bg-[#c25a12] text-white h-9 rounded-md shadow-sm font-bold text-xs flex items-center justify-center gap-2">
                          <Briefcase className="w-3.5 h-3.5" /> {isJob ? "Apply for Job" : "Apply Now"}
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => handleUnlock(req.id, reqType)}
                        disabled={unlockingId === req.id}
                        variant="outline" 
                        className="w-full border-green-500 text-green-600 hover:bg-green-50 h-9 rounded-md font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <Phone className="w-3.5 h-3.5" /> {unlockingId === req.id ? "Unlocking..." : `Unlock Contact`}
                      </Button>
                    </>
                  )}
                  <Link href={`/requirements/${req.id}?type=${reqType}`} className="w-full">
                    <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 h-9 rounded-md font-bold text-xs flex items-center justify-center gap-2">
                      <Search className="w-3.5 h-3.5" /> View Details
                    </Button>
                  </Link>
                </div>

              </div>
            );
          })
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">No projects found</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium">
                There are currently no open projects matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          {projects.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-sm font-semibold text-slate-600">
                Showing 1 to {projects.length} of {projects.length} Projects
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" className="w-8 h-8 p-0 border-slate-200 text-slate-500 rounded"><span className="sr-only">Previous</span> &lsaquo;</Button>
                <Button className="w-8 h-8 p-0 bg-[#E8701A] hover:bg-[#c25a12] text-white font-bold rounded">1</Button>
                <Button variant="outline" className="w-8 h-8 p-0 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded">2</Button>
                <Button variant="outline" className="w-8 h-8 p-0 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded">3</Button>
                <span className="w-8 h-8 flex items-center justify-center text-slate-500">...</span>
                <Button variant="outline" className="w-8 h-8 p-0 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded">13</Button>
                <Button variant="outline" className="w-8 h-8 p-0 border-slate-200 text-slate-500 rounded"><span className="sr-only">Next</span> &rsaquo;</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
