"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, Building2, PackageSearch, Plus, MapPin, CalendarDays, 
  FileText, Send, CheckCircle2, IndianRupee, Clock, ArrowRight, Loader2, 
  Trash2, Eye, X, MessageSquare 
} from "lucide-react";
import { useVendorType } from "@/hooks/useVendorType";

const MOCK_MARKETPLACE_REQS = [
  {
    id: 1,
    title: "Need False Ceiling & POP Contractor for 3BHK Apartment",
    type: "contractor",
    category: "False Ceiling",
    city: "Andheri West, Mumbai",
    budget: "₹1,20,000",
    timeline: "2026-09-15",
    description: "Looking for experienced false ceiling contractor for gyproc ceiling with cove lighting across 1,450 sq.ft residential area.",
    created_at: new Date().toISOString(),
    proposals_count: 4
  },
  {
    id: 2,
    title: "Bulk Supply: 80 Sheets of 18mm BWP Marine Plywood",
    type: "supplier",
    category: "Plywood & Laminates",
    city: "Cyber City, Gurugram",
    budget: "₹2,50,000",
    timeline: "2026-09-05",
    description: "Immediate delivery required for high grade calibrated marine plywood (IS 710 certified) for modular kitchen setup.",
    created_at: new Date().toISOString(),
    proposals_count: 7
  },
  {
    id: 3,
    title: "Complete Electrical Wiring & DB Installation for Commercial Clinic",
    type: "contractor",
    category: "Electrical",
    city: "Indiranagar, Bengaluru",
    budget: "₹85,000",
    timeline: "2026-09-20",
    description: "Full conduit wiring, circuit distribution, panel board setup, and DG synchronization for 2,200 sq.ft dental clinic.",
    created_at: new Date().toISOString(),
    proposals_count: 3
  }
];

export default function B2BRequirementsPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "post" | "my-requirements">("marketplace");
  const [reqType, setReqType] = useState<"contractor" | "supplier">("contractor");
  
  const [toast, setToast] = useState("");
  const [marketplaceReqs, setMarketplaceReqs] = useState<any[]>(MOCK_MARKETPLACE_REQS);
  const [myRequirements, setMyRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Proposal modal state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [proposalForm, setProposalForm] = useState({
    quoteAmount: "",
    duration: "7 Days",
    notes: ""
  });

  // Post form state
  const [postForm, setPostForm] = useState({
    title: "",
    category: "",
    timeline: "2026-10-15",
    city: "Delhi NCR",
    budget: "",
    specs: ""
  });

  const config = useVendorType();
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("truedial_my_b2b_requirements");
      if (saved) {
        setMyRequirements(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.specs.trim()) {
      alert("Please fill in required fields.");
      return;
    }

    const newReq = {
      id: Date.now(),
      title: postForm.title.trim(),
      type: reqType,
      category: postForm.category || (reqType === "contractor" ? "Civil Work" : "Plywood & Laminates"),
      city: postForm.city.trim(),
      budget: postForm.budget ? `₹${postForm.budget}` : "Negotiable",
      timeline: postForm.timeline,
      description: postForm.specs.trim(),
      created_at: new Date().toISOString(),
      proposals_count: 0
    };

    const updated = [newReq, ...myRequirements];
    setMyRequirements(updated);
    localStorage.setItem("truedial_my_b2b_requirements", JSON.stringify(updated));

    // Also add to marketplace
    setMarketplaceReqs([newReq, ...marketplaceReqs]);

    showToast("Requirement posted successfully! Verified suppliers & contractors notified.");
    setPostForm({ title: "", category: "", timeline: "2026-10-15", city: "Delhi NCR", budget: "", specs: "" });
    setActiveTab("my-requirements");
  };

  const handleDeletePosting = (id: number) => {
    if (window.confirm("Are you sure you want to withdraw this requirement?")) {
      const updated = myRequirements.filter(r => r.id !== id);
      setMyRequirements(updated);
      localStorage.setItem("truedial_my_b2b_requirements", JSON.stringify(updated));
      showToast("Requirement removed.");
    }
  };

  const handleOpenProposal = (req: any) => {
    setSelectedReq(req);
    setProposalForm({ quoteAmount: "", duration: "7 Days", notes: "" });
    setProposalModalOpen(true);
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.quoteAmount) {
      alert("Please enter a quote amount.");
      return;
    }
    showToast(`Proposal of ₹${proposalForm.quoteAmount} submitted to client!`);
    setProposalModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-orange-500" />
            B2B Requirements & RFQ Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Post RFQs, hire specialized contractors, or bid on live material supply tenders across India.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("marketplace")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'marketplace' ? 'bg-white dark:bg-slate-700 shadow-sm text-orange-600 dark:text-orange-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Marketplace ({marketplaceReqs.length})
          </button>
          <button 
            onClick={() => setActiveTab("post")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'post' ? 'bg-white dark:bg-slate-700 shadow-sm text-orange-600 dark:text-orange-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            + Post Requirement
          </button>
          <button 
            onClick={() => setActiveTab("my-requirements")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'my-requirements' ? 'bg-white dark:bg-slate-700 shadow-sm text-orange-600 dark:text-orange-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            My Postings ({myRequirements.length})
          </button>
        </div>
      </div>

      {/* 1. MARKETPLACE TAB */}
      {activeTab === "marketplace" && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {marketplaceReqs.map((req) => (
              <div 
                key={req.id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
                        {req.type === "contractor" ? "Contractor RFQ" : "Material Tender"}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">
                      {req.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      {req.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        {req.city}
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {req.budget}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Required by: <strong>{req.timeline}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="shrink-0 pt-2 md:pt-0">
                    <Button 
                      onClick={() => handleOpenProposal(req)}
                      className="w-full md:w-auto bg-[#E05A1B] hover:bg-[#c94d13] text-white rounded-xl px-5 h-10 flex items-center justify-center gap-2 font-bold text-xs shadow-md shadow-orange-500/20"
                    >
                      Submit Proposal / Bid
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. POST REQUIREMENT TAB */}
      {activeTab === "post" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Requirement Type</h3>
            
            <div 
              onClick={() => setReqType("contractor")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition ${reqType === 'contractor' ? 'border-[#E05A1B] bg-orange-50/50 dark:bg-orange-950/20 shadow-sm' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Hire a Sub-Contractor</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Need specialized labor? Post requirements for civil work, false ceiling, plumbing, or electrical contractors.
              </p>
            </div>

            <div 
              onClick={() => setReqType("supplier")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition ${reqType === 'supplier' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <PackageSearch className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Request Materials (RFQ)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Need bulk materials? Request competitive quotes for plywood, tiles, sanitaryware, or hardware directly from wholesalers.
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <FileText className={`w-5 h-5 ${reqType === 'contractor' ? 'text-orange-500' : 'text-emerald-500'}`} />
                {reqType === 'contractor' ? 'Sub-Contractor Requirement Details' : 'Material RFQ Tender Details'}
              </h2>

              <form onSubmit={handlePost} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Title / Project Name *</label>
                  <Input 
                    required 
                    placeholder={reqType === 'contractor' ? "e.g. Need False Ceiling Contractor for 3BHK" : "e.g. 50 Sheets of 18mm Marine Plywood"} 
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="text-xs" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Category *</label>
                    <select 
                      value={postForm.category}
                      onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs" 
                      required
                    >
                      {reqType === 'contractor' ? (
                        <>
                          <option value="Civil Work">Civil Work</option>
                          <option value="Electrical">Electrical & Wiring</option>
                          <option value="Plumbing">Plumbing & Sanitary</option>
                          <option value="False Ceiling">False Ceiling & POP</option>
                          <option value="Carpentry">Carpentry & Millwork</option>
                          <option value="Painting">Painting & Polish</option>
                        </>
                      ) : (
                        <>
                          <option value="Plywood & Laminates">Plywood & Laminates</option>
                          <option value="Tiles & Marble">Tiles & Marble</option>
                          <option value="Electrical Fittings">Electrical Fittings</option>
                          <option value="Sanitary & Bath">Sanitary & Bathware</option>
                          <option value="Hardware & Fittings">Hardware & Architectural Fittings</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Required By Date *</label>
                    <Input 
                      type="date" 
                      required 
                      value={postForm.timeline}
                      onChange={(e) => setPostForm({ ...postForm, timeline: e.target.value })}
                      className="text-xs" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Site Location / City *</label>
                    <Input 
                      required 
                      placeholder="e.g. Andheri West, Mumbai" 
                      value={postForm.city}
                      onChange={(e) => setPostForm({ ...postForm, city: e.target.value })}
                      className="text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Estimated Budget (₹)</label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 150000" 
                      value={postForm.budget}
                      onChange={(e) => setPostForm({ ...postForm, budget: e.target.value })}
                      className="text-xs" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Detailed Specifications *</label>
                  <Textarea 
                    required 
                    rows={4} 
                    placeholder={reqType === 'contractor' ? "Describe the scope of work, area in sq.ft, materials to be provided, and key deadlines..." : "List exact quantities, dimensions, brands preferred, and delivery address..."} 
                    value={postForm.specs}
                    onChange={(e) => setPostForm({ ...postForm, specs: e.target.value })}
                    className="text-xs" 
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-[#E05A1B] hover:bg-[#c94d13] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-md"
                  >
                    <Send className="w-4 h-4 mr-1.5" /> Post Requirement to Network
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. MY POSTINGS TAB */}
      {activeTab === "my-requirements" && (
        <div className="space-y-4">
          {myRequirements.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center min-h-[350px] flex flex-col items-center justify-center">
              <PackageSearch className="w-14 h-14 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">No Active Postings Yet</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                Need contractors or materials? Post your requirement to receive competitive price quotes from verified partners.
              </p>
              <Button 
                onClick={() => setActiveTab("post")} 
                className="mt-5 bg-[#E05A1B] hover:bg-[#c94d13] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Post New Requirement
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {myRequirements.map((req) => (
                <div 
                  key={req.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                        Active RFQ
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Posted: {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{req.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{req.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span>Location: <strong>{req.city}</strong></span>
                      <span>•</span>
                      <span>Budget: <strong>{req.budget}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleDeletePosting(req.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Withdraw Posting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROPOSAL / BID MODAL */}
      {proposalModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-orange-600 bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                  Submit Proposal
                </span>
                <h3 className="font-black text-base text-slate-900 dark:text-white mt-1">
                  {selectedReq.title}
                </h3>
              </div>
              <button 
                onClick={() => setProposalModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Your Total Price Quote (₹) *
                </label>
                <Input 
                  type="number"
                  placeholder="e.g. 95000"
                  value={proposalForm.quoteAmount}
                  onChange={(e) => setProposalForm({ ...proposalForm, quoteAmount: e.target.value })}
                  className="text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Estimated Delivery / Execution Duration
                </label>
                <select
                  value={proposalForm.duration}
                  onChange={(e) => setProposalForm({ ...proposalForm, duration: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                >
                  <option value="Immediate (1-2 Days)">Immediate (1-2 Days)</option>
                  <option value="3-5 Days">3-5 Days</option>
                  <option value="1-2 Weeks">1-2 Weeks</option>
                  <option value="1 Month">1 Month</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Proposal Notes / Terms of Supply
                </label>
                <Textarea 
                  rows={3}
                  placeholder="Include material specs, warranty details, payment terms, or certifications..."
                  value={proposalForm.notes}
                  onChange={(e) => setProposalForm({ ...proposalForm, notes: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setProposalModalOpen(false)}
                  className="text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-[#E05A1B] hover:bg-[#c94d13] text-white text-xs font-bold"
                >
                  Submit Quote
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
