"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, User, Search, MapPin, Clock, MoreVertical, FileText, CalendarCheck, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function JobsATSPage() {
  const [activeJob, setActiveJob] = useState(1);
  const [applicants, setApplicants] = useState([
    { id: 101, jobId: 1, name: "Rahul Verma", role: "Frontend Developer", status: "new", applied_on: "2 days ago", match: 92 },
    { id: 102, jobId: 1, name: "Sneha Gupta", role: "Frontend Developer", status: "interview", applied_on: "4 days ago", match: 85 },
    { id: 103, jobId: 2, name: "Amit Singh", role: "Marketing Intern", status: "hired", applied_on: "1 week ago", match: 98 },
  ]);

  const jobs = [
    { id: 1, title: "Frontend Developer (Next.js)", type: "Full-time", location: "Remote", applicants: 12 },
    { id: 2, title: "Marketing Intern", type: "Internship", location: "Mumbai", applicants: 45 },
    { id: 3, title: "Sales Executive", type: "Full-time", location: "Delhi", applicants: 8 },
  ];

  const updateStatus = (id: number, newStatus: string) => {
    setApplicants(applicants.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">New</Badge>;
      case 'interview': return <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Interview</Badge>;
      case 'hired': return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Hired</Badge>;
      case 'rejected': return <Badge variant="outline" className="text-slate-500 border-slate-300 dark:border-slate-700">Rejected</Badge>;
      default: return null;
    }
  };

  const filteredApplicants = applicants.filter(app => app.jobId === activeJob);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Applicant Tracking</h1>
          <p className="text-muted-foreground mt-2">
            Manage your job postings and review incoming applications.
          </p>
        </div>
        <Button className="bg-[#E8701A] hover:bg-[#c95d13] text-white">
          <Briefcase className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Job Listings */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input placeholder="Search jobs..." className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
          </div>
          
          <div className="space-y-2">
            {jobs.map(job => (
              <div 
                key={job.id}
                onClick={() => setActiveJob(job.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${activeJob === job.id ? 'bg-blue-50 dark:bg-[#0a1c3a]/50 border-blue-200 dark:border-blue-500/30 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-semibold text-sm ${activeJob === job.id ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-white'}`}>
                    {job.title}
                  </h3>
                </div>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-3">
                  <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {job.location}</span>
                  <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {job.type}</span>
                </div>
                <Badge variant="outline" className={`text-xs ${activeJob === job.id ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                  {job.applicants} Applicants
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Applicants for Selected Job */}
        <div className="lg:col-span-3">
          <Card className="bg-white dark:bg-[#0a1c3a]/30 border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-sm min-h-[600px]">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {jobs.find(j => j.id === activeJob)?.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reviewing {filteredApplicants.length} applicants</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">Filter</Button>
                <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">Export</Button>
              </div>
            </div>

            <CardContent className="p-0">
              {filteredApplicants.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredApplicants.map(applicant => (
                    <div key={applicant.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-white/10">
                          <User className="h-6 w-6 text-slate-500" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{applicant.name}</h3>
                            {getStatusBadge(applicant.status)}
                          </div>
                          <div className="flex items-center text-sm text-slate-500 space-x-4">
                            <span className="flex items-center"><FileText className="h-3 w-3 mr-1" /> Resume.pdf</span>
                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Applied {applicant.applied_on}</span>
                            <span className="text-green-500 font-medium">Match: {applicant.match}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {applicant.status === 'new' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => updateStatus(applicant.id, 'interview')} className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/20">
                              <CalendarCheck className="mr-1 h-3 w-3" /> Interview
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateStatus(applicant.id, 'rejected')} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                              Reject
                            </Button>
                          </>
                        )}
                        {applicant.status === 'interview' && (
                          <Button size="sm" onClick={() => updateStatus(applicant.id, 'hired')} className="bg-green-500 hover:bg-green-600 text-white">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Hire Candidate
                          </Button>
                        )}
                        
                        <Button size="icon" variant="ghost" className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <User className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">No applicants yet</h3>
                  <p className="text-slate-500 mt-1">Check back later for new applications.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
