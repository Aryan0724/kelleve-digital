"use client";

import React, { useState } from "react";
import { 
  Laptop, Server, Code, GitMerge, CheckCircle2, 
  Clock, AlertTriangle, Plus, Filter, Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_PROJECTS = [
  {
    id: "PRJ-901",
    name: "E-Commerce Website Redesign",
    client: "RetailMax India",
    type: "Web Development",
    progress: 75,
    dueDate: "20 Aug 2026",
    status: "On Track",
    team: 3
  },
  {
    id: "PRJ-902",
    name: "Inventory Management App",
    client: "Global Logistics",
    type: "Mobile App",
    progress: 30,
    dueDate: "05 Sep 2026",
    status: "At Risk",
    team: 4
  },
  {
    id: "PRJ-903",
    name: "SEO Optimization Campaign",
    client: "Wellness Clinic",
    type: "Digital Marketing",
    progress: 100,
    dueDate: "10 Aug 2026",
    status: "Completed",
    team: 1
  }
];

export default function ActiveProjectsPage() {
  const [projects] = useState(MOCK_PROJECTS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'At Risk': return "bg-red-500/10 text-red-600 border-red-500/20";
      case 'Completed': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Web Development': return <Code className="w-4 h-4" />;
      case 'Mobile App': return <Server className="w-4 h-4" />;
      default: return <Laptop className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Laptop className="w-8 h-8 text-violet-500" />
            Active Projects Pipeline
          </h1>
          <p className="text-muted-foreground mt-2">
            Track development progress, manage deliverables, and monitor project health.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button className="bg-violet-500 hover:bg-violet-600 text-white font-bold h-10 px-6">
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{projects.length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Projects</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-emerald-500">{projects.filter(p => p.status === 'On Track').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">On Track</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-red-500">{projects.filter(p => p.status === 'At Risk').length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">At Risk / Delayed</div>
        </div>
        <div className="bg-white dark:bg-[#0a1c3a]/70 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-violet-500">{projects.reduce((sum, p) => sum + p.team, 0)}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Devs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white dark:bg-[#0a1c3a]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-violet-200 transition flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <Badge className={`px-2 py-0.5 border-0 ${getStatusColor(project.status)}`}>
                {project.status === 'At Risk' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {project.status}
              </Badge>
              <div className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{project.id}</div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{project.name}</h3>
            <div className="text-sm font-semibold text-slate-500 mb-6 flex items-center">
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs mr-2">{project.type}</span>
              {project.client}
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Progress</span>
                  <span className="font-bold text-slate-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${project.progress === 100 ? 'bg-blue-500' : project.status === 'At Risk' ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-1.5" /> Due: <strong className={`ml-1 text-slate-900 dark:text-white ${project.status === 'At Risk' ? 'text-red-500' : ''}`}>{project.dueDate}</strong>
                </div>
                <div className="flex -space-x-2">
                  {Array.from({ length: project.team }).map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-[#0a1c3a] flex items-center justify-center text-[10px] font-bold text-slate-500">
                      D{i+1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <GitMerge className="w-4 h-4 mr-2" /> Repo
              </Button>
              <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <LinkIcon className="w-4 h-4 mr-2" /> Staging
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
