"use client";

import Link from "next/link";
import { ArrowRight, MapPin, IndianRupee, Clock, Briefcase, FileText, CheckCircle2 } from "lucide-react";
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

        <div className="flex overflow-x-auto xl:grid xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-4 xl:pb-0 snap-x xl:snap-none no-scrollbar">
          {projects.map((project: any, index: number) => (
            <div 
              key={project.id || index}
              className="min-w-[280px] md:min-w-[300px] xl:min-w-0 max-w-[320px] xl:max-w-none w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden snap-center xl:snap-align-none group hover:shadow-lg transition-all"
            >
              {/* Image Section */}
              <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <Image 
                  src={`https://images.unsplash.com/photo-${type === 'job' ? '1504307651254-35680f35eadf' : type === 'rfq' ? '1589939705384-5185137a7f0f' : '1600585154340-be6161a56a0c'}?q=80&w=600&auto=format&fit=crop`}
                  alt={project.title || "Project"}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white dark:bg-slate-800 px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                  <span className="text-amber-500 text-xs">★</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{(4.5 + Math.random() * 0.5).toFixed(1)}</span>
                </div>
                
                {/* Fake Avatar */}
                <div className="absolute -bottom-5 left-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 overflow-hidden relative">
                    <Image 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.category?.name || 'User')}&background=random`}
                      alt="Avatar"
                      fill
                      unoptimized
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-8 pb-4 px-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 group-hover:text-[#E8701A] transition-colors">
                    {project.title || project.description?.substring(0, 50)}
                  </h3>
                  <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 block">
                  {project.category?.name || (type === 'lead' ? 'Project' : type === 'rfq' ? 'Material' : 'Job')}
                </span>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{project.city?.name || project.city || "Remote"}</span>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Budget</span>
                    <span className="font-bold text-slate-800 dark:text-white text-sm">
                      {project.budget_max 
                        ? `₹${project.budget_min?.toLocaleString() || 0} - ₹${project.budget_max.toLocaleString()}`
                        : project.budget_min ? `₹${project.budget_min?.toLocaleString()}+` : 'Quote Based'}
                    </span>
                  </div>
                  
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
                    <button className="bg-slate-100 hover:bg-[#E8701A] dark:bg-slate-700 dark:hover:bg-[#E8701A] hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                      Bid Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
