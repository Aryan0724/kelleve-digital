"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, MapPin, Building2, IndianRupee, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/public/jobs`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#050f24]">
        <Loader2 className="h-12 w-12 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050f24]">
      {/* Hero Section */}
      <div className="bg-[#0a1c3a] text-white py-16 px-6 relative overflow-hidden border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="bg-blue-500 text-white hover:bg-blue-600 mb-6 border-0">TrueDial Jobs & Internships</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            Find Your Next <span className="text-blue-400">Career Move</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Connect with top verified businesses looking for talent across India.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Job title, keywords, or company" 
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
              />
            </div>
            <Button className="h-12 px-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold">
              Search Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            <Briefcase className="mr-2 text-blue-500" /> Recent Openings
          </h2>
          <span className="text-sm text-slate-500">{jobs.length} jobs found</span>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="group bg-white dark:bg-[#0a1c3a]/70 rounded-xl p-6 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  <Badge variant="outline" className="border-blue-200 text-blue-600 dark:border-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                    {job.type}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1 opacity-70" /> {job.company}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 opacity-70" /> {job.location}
                  </span>
                  <span className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1 opacity-70" /> {job.salary}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end space-y-3">
                <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white">
                  Apply Now
                </Button>
                <span className="text-xs text-slate-400">
                  Posted {new Date(job.posted_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
