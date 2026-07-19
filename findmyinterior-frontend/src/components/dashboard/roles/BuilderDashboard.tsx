"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, MessageSquare, Search, Gavel, Trophy, HardHat, Building, Wallet, User, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { handleLogoutAction } from "@/lib/auth";
import { CompleteProfileTab } from "@/components/dashboard/CompleteProfileTab";
import { AvailableLeadsTab } from "@/components/dashboard/AvailableLeadsTab";
import { UnlockedLeadsTab } from "@/components/dashboard/UnlockedLeadsTab";
import { MyBidsTab } from "@/components/dashboard/MyBidsTab";

import Link from "next/link";
import { UnverifiedBanner } from "@/components/dashboard/UnverifiedBanner";
import { VerificationTab } from "@/components/dashboard/VerificationTab";
import { SubscriptionTab } from "@/components/dashboard/SubscriptionTab";

export function BuilderDashboard({ data, fetchDashboard }: { data: any, fetchDashboard: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isUnverified = user && !["verified_business", "trusted_professional", "elite_professional", "site_verified"].includes(user.verification_level || "");
  const [activeTab, setActiveTab] = useState("projects");

  const handleLogout = async () => {
    await handleLogoutAction();
    router.push("/login");
  };

  const renderSidebarButton = (id: string, icon: React.ReactNode, label: string) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center p-3 md:p-4 border-b md:border-r-0 border-r text-left font-medium text-xs sm:text-sm md:text-base transition-colors w-full h-full ${activeTab === id ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
    >
      <div className={`mr-3 shrink-0 ${activeTab === id ? 'text-orange-600' : 'text-slate-400'}`}>
        {icon}
      </div>
      {label}
    </button>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Building className="h-5 w-5 text-orange-600" /> {user?.name}'s Builder Portal
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden md:block">BUILDER</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-20 w-20 relative rounded-full overflow-hidden ring-4 ring-orange-100 bg-slate-100 flex items-center justify-center mb-4 text-2xl font-bold text-slate-400 shadow">
                  <span className="absolute inset-0 z-0 flex items-center justify-center">{user?.name?.charAt(0)}</span>
                  {user?.avatar && (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover absolute inset-0 z-10 text-transparent" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                </div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <Badge className="mt-2 capitalize mb-4" variant="default">Builder & Developer</Badge>
                
                <div className="w-full space-y-2 mt-2">
                  <div className="w-full bg-orange-50 border border-orange-100 rounded-lg p-3 text-left flex justify-between items-center">
                    <div>
                      <div className="text-xs text-orange-600 font-medium">Subscription</div>
                      <div className="font-bold text-slate-900">{data?.user?.subscription || "Free Plan"}</div>
                    </div>
                    <Link href="/pricing">
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-white text-orange-600 border-orange-200">Upgrade</Button>
                    </Link>
                  </div>
                  
                  <div className="w-full bg-green-50 border border-green-100 rounded-lg p-3 text-left flex justify-between items-center">
                    <div>
                      <div className="text-xs text-green-700 font-medium flex items-center"><Wallet className="w-3 h-3 mr-1"/> Wallet Balance</div>
                      <div className="font-bold text-slate-900">₹{data?.user?.wallet_balance || 0}</div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs bg-white text-green-700 border-green-200" onClick={() => setActiveTab("wallet")}>Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white border rounded-xl overflow-hidden w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col w-full">
                {renderSidebarButton("projects", <Building className="h-5 w-5" />, "Projects")}
                {renderSidebarButton("possession_projects", <Building className="h-5 w-5" />, "Possession Projects")}
                {renderSidebarButton("contractor_requests", <HardHat className="h-5 w-5" />, "Contractor Requests")}
                {renderSidebarButton("interior_requests", <Search className="h-5 w-5" />, "Interior Requests")}
                {renderSidebarButton("supplier_requests", <Search className="h-5 w-5" />, "Supplier Requests")}
                {renderSidebarButton("worker_requests", <User className="h-5 w-5" />, "Worker Requests")}
                {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                {renderSidebarButton("subscription", <Wallet className="h-5 w-5" />, "Subscription")}
                {renderSidebarButton("business_profile", <User className="h-5 w-5" />, "Business Profile")}
                {renderSidebarButton("verification", <ShieldCheck className="h-5 w-5" />, "Verification")}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'projects' && (
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>My Building Projects</CardTitle>
                  <Button onClick={() => router.push("/post-requirement")} size="sm" className="bg-orange-600 hover:bg-orange-700">New Project</Button>
                </CardHeader>
                <CardContent>
                  {((data?.projects || []).concat(data?.rfqs || []).concat(data?.jobs || [])).length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {((data?.projects || []).concat(data?.rfqs || []).concat(data?.jobs || [])).map((req: any) => (
                        <div key={req.id + (req.material_type ? '-rfq' : req.skill_required ? '-job' : '-proj')} className="flex flex-col md:flex-row justify-between p-4 border rounded-xl hover:shadow-md transition-shadow bg-white">
                            <div className="flex-1 mb-4 md:mb-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-lg text-slate-900">{req.title || req.material_type || req.skill_required}</h4>
                                <Badge variant="outline" className="bg-slate-100">{req.status}</Badge>
                                {req.material_type && <Badge variant="secondary">Material RFQ</Badge>}
                                {req.skill_required && <Badge variant="secondary">Worker Job</Badge>}
                              </div>
                              <div className="text-sm text-slate-500 mb-2 flex items-center gap-4">
                                <span>{req.city}</span>
                                <span>•</span>
                                <span>{req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Recent'}</span>
                              </div>
                              <p className="text-slate-600 text-sm line-clamp-2">{req.description || `Required: ${req.quantity || req.number_of_workers}`}</p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Button onClick={() => router.push(`/requirements/${req.id}?type=${req.material_type ? 'rfq' : req.skill_required ? 'job' : 'project'}`)} variant="outline" size="sm">View Detail</Button>
                              
                              {(req.status === 'awarded' || req.status === 'in_progress') && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={async () => {
                                    try {
                                      const reqType = req.material_type ? 'rfq' : req.skill_required ? 'job' : 'project';
                                      await import('@/lib/api').then(m => m.default.patch(`/requirements/${req.id}/complete?requirement_type=${reqType}`));
                                      alert("Project marked as completed!");
                                      fetchDashboard();
                                    } catch (err: any) {
                                      alert(err.response?.data?.message || "Failed to complete project");
                                    }
                                  }}
                                >
                                  Mark Completed
                                </Button>
                              )}
                              
                              {req.status === 'completed' && (
                                <Button 
                                  size="sm" 
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => {
                                    // Usually reviews are done on the vendor profile.
                                    alert("Review feature is available in the Professional's profile.");
                                    if(req.professional_id) {
                                       router.push(`/professionals/${req.professional_id}`);
                                    }
                                  }}
                                >
                                  Leave Review
                                </Button>
                              )}
                            </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 border rounded-xl border-dashed bg-slate-50">
                      <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No active projects</h3>
                      <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        Create your first building or development project.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'possession_projects' && (
              <Card>
                <CardHeader><CardTitle>Possession Projects</CardTitle></CardHeader>
                <CardContent className="py-16 text-center text-slate-500">
                  <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  No possession projects currently.
                </CardContent>
              </Card>
            )}

            {['contractor_requests', 'interior_requests', 'supplier_requests', 'worker_requests'].includes(activeTab) && (
              <Card>
                <CardContent className="py-16 text-center">
                  <HardHat className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Manage Requests</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">Post requirements to find the best professionals.</p>
                  <Button onClick={() => router.push('/post-requirement')} className="bg-orange-600">Post New Request</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'subscription' && (
              <SubscriptionTab currentPlan={data?.user?.subscription || "Free Plan"} />
            )}

            {activeTab === 'verification' && <VerificationTab onSwitchTab={setActiveTab} profileData={data} />}
            {activeTab === 'business_profile' && <CompleteProfileTab />}

            {activeTab === 'messages' && (
              <Card>
                <CardContent className="py-16 text-center">
                  <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Go to your Messages Hub</h3>
                  <Button onClick={() => router.push('/messages')} className="bg-[#0a1c3a]">Open Messenger</Button>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
