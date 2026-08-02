"use client";

import Link from "next/link";
import { ArrowRight, MapPin, IndianRupee, Clock, Briefcase, FileText } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function PublicProjects({ title, projects, type = "lead" }: { title: string, projects: any[], type?: "lead" | "rfq" | "job" }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <Link href="/projects" className="text-primary font-semibold text-sm hover:underline">
            View All
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
          {projects.map((project: any, index: number) => (
            <div 
              key={project.id || index}
              className="min-w-[280px] md:min-w-[320px] max-w-[320px] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden snap-center group hover:shadow-md transition-shadow"
            >
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                    {project.category?.name || (type === 'lead' ? 'Project' : type === 'rfq' ? 'Material' : 'Job')}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Just now
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {project.title || project.description?.substring(0, 50)}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{project.city?.name || project.city || "Remote"}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm">
                  {project.budget_min || project.budget_max ? (
                    <div className="bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <IndianRupee className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">
                        {project.budget_max 
                          ? `₹${project.budget_min?.toLocaleString() || 0} - ₹${project.budget_max.toLocaleString()}`
                          : `₹${project.budget_min?.toLocaleString()}+`}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <IndianRupee className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">Quote Based</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <Link 
                  href={`/${type === 'lead' ? 'requirements' : type === 'rfq' ? 'rfqs' : 'jobs'}/${project.id}`}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      alert("Please login or register to proceed and bid on this project.");
                      router.push(`/login?redirect=${encodeURIComponent(`/${type === 'lead' ? 'requirements' : type === 'rfq' ? 'rfqs' : 'jobs'}/${project.id}`)}`);
                    }
                  }}
                >
                  <button className="w-full bg-slate-900 hover:bg-primary dark:bg-slate-700 dark:hover:bg-primary text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    Submit Quote <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
