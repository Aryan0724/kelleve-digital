"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Filter, Briefcase, Hammer, HardHat, Pickaxe, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/worker-jobs");
      setJobs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Premium Hero Section */}
      <div className="bg-gradient-to-r from-[#0a1c3a] to-[#1a2c5a] text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8701A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 max-w-3xl">
            <Badge className="bg-[#E8701A]/20 text-[#ff9d5c] hover:bg-[#E8701A]/30 border-none mb-4 px-3 py-1 text-xs font-bold tracking-wider">
              DAILY WAGE WORK
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight text-white">
              Construction Jobs
            </h1>
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed mb-8">
              Find daily wage work and short-term construction contracts posted by builders and contractors. Apply instantly and start working.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
                <Hammer className="w-4 h-4 text-[#ff9d5c]" /> <span>Skilled Trades</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
                <HardHat className="w-4 h-4 text-[#ff9d5c]" /> <span>Daily Wages & Contracts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 relative z-20 -mt-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="p-6 border border-slate-200 shadow-xl shadow-slate-200/40 rounded-2xl bg-white sticky top-24">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-800 text-lg border-b border-slate-100 pb-4">
              <Filter className="w-5 h-5 text-[#E8701A]" /> Refine Jobs
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold mb-2 block text-slate-700">Trade / Skill</label>
                <div className="relative">
                  <Pickaxe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="e.g., Carpenter, Plumber..." className="pl-9 bg-slate-50 border-slate-200 focus:border-[#E8701A] focus:ring-[#E8701A]" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-slate-700">Site Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="City or Pincode" className="pl-9 bg-slate-50 border-slate-200 focus:border-[#E8701A] focus:ring-[#E8701A]" />
                </div>
              </div>
              <Button className="w-full bg-[#0a1c3a] hover:bg-[#1a2c5a] text-white font-bold h-12 rounded-xl transition-all shadow-md">
                Find Work
              </Button>
            </div>
          </Card>
        </div>

        {/* List */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-800">
              {loading ? "Loading..." : `${jobs.length} Available Jobs`}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20 flex flex-col items-center bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E8701A] mb-4"></div>
              <p className="text-slate-500 font-medium">Fetching job listings...</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((req: any) => (
              <div key={req.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-200 flex flex-col md:flex-row gap-6 overflow-hidden">
                
                <div className="hidden md:flex flex-col justify-center items-center bg-slate-50 border-r border-slate-100 p-6 min-w-[140px] group-hover:bg-[#E8701A]/5 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                    <Briefcase className="w-6 h-6 text-[#E8701A]" />
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 text-center">
                    {req.opportunity_type || "Job"}
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-6 md:pl-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 text-xl group-hover:text-[#E8701A] transition-colors">{req.title}</h4>
                    <Badge variant="outline" className={`whitespace-nowrap px-3 py-1 font-semibold ${req.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {req.status === 'open' ? 'Actively Hiring' : req.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center text-xs font-semibold text-slate-500 mb-4 gap-3">
                    {req.city && (
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> 
                        Site: {typeof req.city === 'string' ? req.city : req.city.name}
                      </span>
                    )}
                    {req.skill_required && (
                      <span className="flex items-center">
                        <HardHat className="w-3.5 h-3.5 mr-1 text-slate-400" /> 
                        Skill: {req.skill_required}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> 
                      Posted {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-6">{req.description}</p>
                  
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-slate-100 text-slate-600">
                        Employer: <span className="capitalize">{req.creator_role?.replace('_', ' ') || 'Contractor'}</span>
                     </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 bg-slate-50 md:bg-transparent p-6 md:w-[220px] md:border-l border-slate-100 justify-center">
                  <div className="text-center md:text-right">
                     <div className="text-xs text-slate-500 font-medium mb-1">Pay Rate</div>
                     <div className="font-extrabold text-slate-900 text-lg">
                     {req.daily_rate ? `₹${req.daily_rate}/day` : (req.budget ? `₹${req.budget}` : "Negotiable")}
                     </div>
                  </div>
                  <Link href={`/requirements/${req.id}?type=job`} className="w-full">
                    <Button className="w-full bg-[#E8701A] hover:bg-[#c25a12] text-white h-11 rounded-xl shadow-md font-bold transition-all flex items-center justify-center gap-2 group-hover:-translate-y-0.5">
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No jobs available right now</h3>
              <p className="text-slate-500 max-w-md mx-auto text-lg">
                Check back later or adjust your filters to find new work opportunities in your area.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
