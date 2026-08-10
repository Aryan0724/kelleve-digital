"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, PackageSearch, Plus, MapPin, CalendarDays, FileText, Send, CheckCircle2 } from "lucide-react";

export default function B2BRequirementsPage() {
  const [activeTab, setActiveTab] = useState<"post" | "my-requirements">("post");
  const [reqType, setReqType] = useState<"contractor" | "supplier">("contractor");
  
  const [toast, setToast] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    setToast("Requirement posted successfully! Suppliers/Contractors will be notified.");
    setTimeout(() => {
      setToast("");
      setActiveTab("my-requirements");
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">B2B Requirements</h1>
          <p className="text-muted-foreground mt-1">
            Post RFQs, hire specialized contractors, or request bulk material supplies from TrueDial verified vendors.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("post")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'post' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#E8701A]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Post Requirement
          </button>
          <button 
            onClick={() => setActiveTab("my-requirements")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'my-requirements' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#E8701A]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            My Postings
          </button>
        </div>
      </div>

      {activeTab === "post" ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-bold text-lg">Select Requirement Type</h3>
            
            <div 
              onClick={() => setReqType("contractor")}
              className={`p-5 rounded-xl border-2 cursor-pointer transition ${reqType === 'contractor' ? 'border-[#E8701A] bg-[#E8701A]/5 shadow-md' : 'border-slate-200 dark:border-slate-800 hover:border-[#E8701A]/40'}`}
            >
              <div className="w-12 h-12 rounded-full bg-[#E8701A]/10 text-[#E8701A] flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Hire a Sub-Contractor</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Need specialized labor? Post requirements for civil work, false ceiling, plumbing, or electrical contractors.
              </p>
            </div>

            <div 
              onClick={() => setReqType("supplier")}
              className={`p-5 rounded-xl border-2 cursor-pointer transition ${reqType === 'supplier' ? 'border-[#10b981] bg-[#10b981]/5 shadow-md' : 'border-slate-200 dark:border-slate-800 hover:border-[#10b981]/40'}`}
            >
              <div className="w-12 h-12 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center mb-4">
                <PackageSearch className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Request Materials (RFQ)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Need bulk materials? Request quotes for plywood, tiles, sanitaryware, or hardware directly from wholesalers.
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${reqType === 'contractor' ? 'bg-[#E8701A]' : 'bg-[#10b981]'}`}></div>
              
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className={`w-5 h-5 ${reqType === 'contractor' ? 'text-[#E8701A]' : 'text-[#10b981]'}`} />
                {reqType === 'contractor' ? 'Sub-Contractor Requirement Details' : 'Material RFQ Details'}
              </h2>

              <form onSubmit={handlePost} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Title / Project Name *</label>
                  <Input required placeholder={reqType === 'contractor' ? "e.g. Need False Ceiling Contractor for 3BHK" : "e.g. 50 Sheets of 18mm Marine Plywood"} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Category *</label>
                    <select className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8701A]/50" required>
                      {reqType === 'contractor' ? (
                        <>
                          <option value="">Select Trade</option>
                          <option>Civil Work</option>
                          <option>Electrical</option>
                          <option>Plumbing</option>
                          <option>False Ceiling</option>
                          <option>Carpentry</option>
                        </>
                      ) : (
                        <>
                          <option value="">Select Material Type</option>
                          <option>Plywood & Laminates</option>
                          <option>Tiles & Marble</option>
                          <option>Electrical Fittings</option>
                          <option>Sanitary & Bath</option>
                          <option>Hardware & Fittings</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Timeline / Required By *</label>
                    <Input type="date" required className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Site Location / City *</label>
                    <Input required placeholder="e.g. Andheri West, Mumbai" className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Estimated Budget (₹)</label>
                    <Input type="number" placeholder="Optional" className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Detailed Specifications *</label>
                  <Textarea required rows={4} placeholder={reqType === 'contractor' ? "Describe the scope of work, area size, and any specific requirements..." : "List quantities, brands preferred, and delivery requirements..."} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button type="submit" className={`px-8 ${reqType === 'contractor' ? 'bg-[#E8701A] hover:bg-[#c95d13]' : 'bg-[#10b981] hover:bg-[#059669]'} text-white`}>
                    <Send className="w-4 h-4 mr-2" /> Post to Network
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
          <PackageSearch className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Active Postings</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            You haven't posted any requirements yet. Need contractors or materials? Post a requirement to receive competitive quotes.
          </p>
          <Button onClick={() => setActiveTab("post")} className="mt-6 bg-[#E8701A] hover:bg-[#c95d13] text-white">
            <Plus className="w-4 h-4 mr-2" /> Post New Requirement
          </Button>
        </div>
      )}
    </div>
  );
}
