"use client";

import Link from "next/link";
import { ArrowRight, MapPin, IndianRupee, Clock, Briefcase, FileText, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";

const CATEGORY_FALLBACK_IMAGES: Record<string, string[]> = {
  interior: [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop", // Modern living room
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop", // Elegant interior
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop", // Warm luxury living
    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800&auto=format&fit=crop", // Nordic minimalist
    "https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=800&auto=format&fit=crop", // Cozy modern lounge
  ],
  kitchen: [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop", // Luxury modular kitchen
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop", // Clean kitchen island
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop", // Contemporary kitchen
  ],
  architecture: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop", // Modern villa
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", // Glass luxury home
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop", // Contemporary architecture
  ],
  construction: [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop", // Blueprint & site
    "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=800&auto=format&fit=crop", // Modern building construction
    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop", // Structural work
  ],
  furniture: [
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop", // Designer sofa & woodwork
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop", // Wooden handcrafted chair
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop", // Modern living furniture
  ],
  materials: [
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", // Building materials
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop", // Marble & tiles
    "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=800&auto=format&fit=crop", // Wood & laminates
  ],
  workers: [
    "https://images.unsplash.com/photo-1504307651254-35680f35eadf?q=80&w=800&auto=format&fit=crop", // Construction craftsman
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop", // Electrician & wiring
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop", // Skilled technician
  ]
};

function getProjectImage(project: any, type: string, index: number): string {
  const explicit = project.image || project.cover_image || project.images?.[0]?.image_url || project.images?.[0]?.url || project.attachments?.[0]?.url;
  if (explicit && typeof explicit === 'string' && (explicit.startsWith('http') || explicit.startsWith('/'))) {
    return explicit;
  }

  const text = `${project.title || ''} ${project.category?.name || ''} ${project.description || ''}`.toLowerCase();
  
  let pool = CATEGORY_FALLBACK_IMAGES.interior;
  if (type === 'job') {
    pool = CATEGORY_FALLBACK_IMAGES.workers;
  } else if (type === 'rfq' || text.includes('material') || text.includes('hardware') || text.includes('plywood')) {
    pool = CATEGORY_FALLBACK_IMAGES.materials;
  } else if (text.includes('kitchen')) {
    pool = CATEGORY_FALLBACK_IMAGES.kitchen;
  } else if (text.includes('furniture') || text.includes('sofa') || text.includes('table') || text.includes('wood')) {
    pool = CATEGORY_FALLBACK_IMAGES.furniture;
  } else if (text.includes('architect') || text.includes('elevation') || text.includes('plan')) {
    pool = CATEGORY_FALLBACK_IMAGES.architecture;
  } else if (text.includes('builder') || text.includes('construction') || text.includes('civil')) {
    pool = CATEGORY_FALLBACK_IMAGES.construction;
  }

  const idNum = Number(project.id) || (index + 1);
  return pool[idNum % pool.length];
}

function getAvatarName(project: any): string {
  if (project.user?.name) return project.user.name;
  if (project.name && project.name !== '***') return project.name;
  if (project.client_name) return project.client_name;
  if (project.city?.name) return `${project.city.name} Client`;
  if (typeof project.city === 'string') return `${project.city} Client`;
  return project.title || 'Client';
}

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
          {projects.map((project: any, index: number) => {
            const projectImg = getProjectImage(project, type, index);
            const avatarName = getAvatarName(project);
            const rating = (4.6 + ((Number(project.id) || index) % 4) * 0.1).toFixed(1);

            return (
              <div 
                key={project.id || index}
                className="min-w-[280px] md:min-w-[300px] xl:min-w-0 max-w-[320px] xl:max-w-none w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden snap-center xl:snap-align-none group hover:shadow-lg transition-all"
              >
                {/* Image Section */}
                <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <Image 
                    src={projectImg}
                    alt={project.title || "Project"}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white dark:bg-slate-800 px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <span className="text-amber-500 text-xs">★</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{rating}</span>
                  </div>
                  
                  {/* Avatar */}
                  <div className="absolute -bottom-5 left-4">
                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 overflow-hidden relative">
                      <Image 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=random&color=fff&size=128&bold=true`}
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
