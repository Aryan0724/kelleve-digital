"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, UserCircle, CheckCircle, Clock, MessageSquare, ArrowLeft } from "lucide-react";

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    api.get(`/projects/${params.id}`)
      .then(res => {
        setProject(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id, user]);

  if (loading) return <div className="p-8 text-center">Loading project...</div>;
  if (!project) return <div className="p-8 text-center text-red-500">Project not found or unauthorized.</div>;

  const isClient = user?.id === project.user_id;
  const isProfessional = user?.id === project.professional_id;

  const handleCompleteProject = async () => {
    if (!confirm("Are you sure you want to mark this project as completed?")) return;
    
    try {
      await api.post(`/projects/${project.id}/complete`);
      alert("Project marked as completed!");
      window.location.reload();
    } catch (e) {
      alert("Failed to complete project.");
    }
  };

  const handleAcceptProject = async () => {
    if (!confirm("Are you sure you want to accept this awarded project?")) return;
    try {
      await api.patch(`/requirements/${project.id}/accept-award?requirement_type=project`);
      alert("Project accepted and moved to In Progress!");
      window.location.reload();
    } catch (e: any) {
      alert("Failed to accept project: " + (e.response?.data?.message || e.message));
    }
  };

  const handleMarkProgress = async (status: string) => {
    try {
      await api.post(`/projects/${project.id}/progress`, { status });
      alert(`Project status updated to ${status}`);
      window.location.reload();
    } catch (e) {
      alert("Failed to update progress.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <button onClick={() => router.back()} className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-widest text-[10px]">
                {project.status.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-slate-500 font-medium">Project #{project.id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">{project.requirement?.title || "Untitled Project"}</h1>
          </div>
          
          <div className="flex gap-2">
            {isClient && project.status !== 'completed' && project.status !== 'cancelled' && (
              <Button onClick={handleCompleteProject} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
              </Button>
            )}
            
            {isProfessional && project.status === 'awarded' && (
              <Button onClick={handleAcceptProject} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" /> Accept Project
              </Button>
            )}

            {isProfessional && (project.status === 'in_progress' || project.status === 'on_hold') && (
              <select 
                onChange={(e) => handleMarkProgress(e.target.value)}
                value={project.status}
                className="h-10 px-3 rounded-md border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Details Column */}
          <div className="col-span-2 p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Project Details</h2>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3">
                <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Requirement</div>
                  <div className="text-sm text-slate-600">{project.description}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 font-medium mb-1">Created On</div>
                  <div className="text-sm font-bold text-slate-900">
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="border border-slate-100 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 font-medium mb-1">Winning Bid Amount</div>
                  <div className="text-sm font-bold text-slate-900">
                    {project.winning_bid_id ? "Awarded" : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* People Column */}
          <div className="col-span-1 p-6 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Participants</h2>
            
            <div className="space-y-6">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-2">Client (Creator)</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {isClient ? "You" : project.user?.name || "Client"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 font-medium mb-2">Professional</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {isProfessional ? "You" : (project.professional_id ? "Assigned Professional" : "None yet")}
                    </div>
                  </div>
                </div>
              </div>
              
              <hr className="border-slate-200" />
              
              <Button 
                onClick={() => router.push(`/messages?conversation=${project.conversation?.id}`)}
                className="w-full bg-[#0b1b36] hover:bg-slate-800"
              >
                <MessageSquare className="w-4 h-4 mr-2" /> Open Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
