"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, MessageSquare, Search, Gavel, CheckCircle2, User, LogOut, ShieldCheck, Briefcase, Star, Wallet } from "lucide-react";
import { SavedBookmarksTab } from "@/components/dashboard/SavedBookmarksTab";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { handleLogoutAction } from "@/lib/auth";
import { CompleteProfileTab } from "@/components/dashboard/CompleteProfileTab";
import { AvailableLeadsTab } from "@/components/dashboard/AvailableLeadsTab";
import { PortfolioTab } from "@/components/dashboard/PortfolioTab";
import { MyBidsTab } from "@/components/dashboard/MyBidsTab";
import { UnverifiedBanner } from "@/components/dashboard/UnverifiedBanner";
import { VerificationTab } from "@/components/dashboard/VerificationTab";
import { DashboardProfileCard } from "@/components/dashboard/DashboardProfileCard";
import { UnlockedLeadsTab } from "@/components/dashboard/UnlockedLeadsTab";
import { PostedRequirementsTab } from "@/components/dashboard/PostedRequirementsTab";
import { LeaveReviewModal } from "@/components/dashboard/LeaveReviewModal";
export function WorkerDashboard({ data, fetchDashboard }: { data: any, fetchDashboard: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("dashboard");
    }
  }, [tabParam]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (window.innerWidth < 1024 && activeTab !== 'dashboard') {
      setTimeout(() => {
        const contentArea = document.getElementById('dashboard-content-area');
        if (contentArea) {
          const y = contentArea.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [activeTab]);
  const [reviewModal, setReviewModal] = useState<{isOpen: boolean; professionalId: number; requirementId: number}>({ isOpen: false, professionalId: 0, requirementId: 0 });

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
            <Briefcase className="h-5 w-5 text-orange-600" /> {user?.name}'s Dashboard
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden md:block">WORKER</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-4">
            <DashboardProfileCard
              fetchDashboard={fetchDashboard}
              roleLabel="Skilled Worker" onEditProfile={() => setActiveTab("business_profile")}
            />

            <div className="bg-white border rounded-xl overflow-hidden w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col w-full">
                {renderSidebarButton("dashboard", <LayoutDashboard className="h-5 w-5" />, "Dashboard")}
                {renderSidebarButton("available_leads", <Search className="h-5 w-5" />, "Available Jobs")}
                {renderSidebarButton("unlocked_leads", <User className="h-5 w-5" />, "Unlocked Leads")}
                {renderSidebarButton("bids_submitted", <Gavel className="h-5 w-5" />, "Applied Jobs")}
                {renderSidebarButton("active_jobs", <CheckCircle2 className="h-5 w-5" />, "Active Jobs")}
                {renderSidebarButton("completed_jobs", <CheckCircle2 className="h-5 w-5" />, "Completed Jobs")}
                {renderSidebarButton("my_requirements", <LayoutDashboard className="h-5 w-5" />, "My Requirements")}
                {renderSidebarButton("portfolio", <Briefcase className="h-5 w-5" />, "Portfolio")}
                {renderSidebarButton("bookmarks", <Star className="h-5 w-5" />, "Saved Items")}
                {renderSidebarButton("ratings", <Star className="h-5 w-5" />, "Ratings")}
                {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                {renderSidebarButton("verification", <ShieldCheck className="h-5 w-5" />, "Verification")}
                {renderSidebarButton("profile", <User className="h-5 w-5" />, "Profile")}
              </div>
            </div>
          </div>

          <div id="dashboard-content-area" className="lg:col-span-3 space-y-6">

            {activeTab === 'dashboard' && (
              <div className="flex flex-wrap gap-3 mb-6">
                <div onClick={() => setActiveTab('available_leads')} className="flex-1 min-w-[110px] bg-white border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Available Jobs</div>
                  <div className="text-lg font-bold text-slate-900">{data?.recommended_leads?.length || 0}</div>
                </div>
                <div onClick={() => setActiveTab('active_jobs')} className="flex-1 min-w-[110px] bg-white border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Active Jobs</div>
                  <div className="text-lg font-bold text-slate-900">{data?.submitted_bids?.filter((b:any) => ['accepted', 'awarded', 'in_progress'].includes(b.status)).length || 0}</div>
                </div>
                <div onClick={() => setActiveTab('bids_submitted')} className="flex-1 min-w-[110px] bg-white border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Applied</div>
                  <div className="text-lg font-bold text-slate-900">{data?.submitted_bids?.length || 0}</div>
                </div>
                <div onClick={() => setActiveTab('messages')} className="flex-1 min-w-[110px] bg-white border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Messages</div>
                  <div className="text-lg font-bold text-slate-900">{data?.unread_messages || 0}</div>
                </div>
                <div onClick={() => setActiveTab('completed_jobs')} className="flex-1 min-w-[110px] bg-white border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Completed</div>
                  <div className="text-lg font-bold text-slate-900">{data?.submitted_bids?.filter((b:any) => b.status === 'completed').length || 0}</div>
                </div>
              </div>
            )}

            {(activeTab === 'available_leads' || activeTab === 'dashboard') && <AvailableLeadsTab leads={data?.recommended_leads} />}
            
            {activeTab === 'unlocked_leads' && (
              <UnlockedLeadsTab unlockedContacts={data?.unlocked_contacts || []} onRefresh={fetchDashboard} />
            )}
            
            {activeTab === 'bids_submitted' && (
              <MyBidsTab bids={data?.submitted_bids || []} title="My Job Applications" showAwardedOnly={false} />
            )}

            {activeTab === 'active_jobs' && (
              <MyBidsTab bids={data?.submitted_bids || []} title="Active Jobs" statuses={['accepted', 'awarded', 'in_progress']} />
            )}

            {activeTab === 'completed_jobs' && (
              <MyBidsTab bids={data?.submitted_bids || []} title="Completed Jobs" statuses={['completed']} />
            )}

            {activeTab === 'my_requirements' && (
              <PostedRequirementsTab 
                data={data} 
                fetchDashboard={fetchDashboard} 
                onReviewClick={(professionalId, requirementId) => setReviewModal({ isOpen: true, professionalId, requirementId })}
              />
            )}

            {activeTab === 'portfolio' && <PortfolioTab />}

            {activeTab === 'ratings' && (
              <Card>
                <CardHeader><CardTitle>Ratings</CardTitle></CardHeader>
                <CardContent>
                  {data?.recent_reviews && data.recent_reviews.length > 0 ? (
                    <div className="space-y-4">
                      {data.recent_reviews.map((review: any) => (
                        <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{review.user?.name || "Customer"}</div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                              ))}
                            </div>
                          </div>
                          {review.title && <h4 className="font-medium text-sm text-slate-800 mb-1">{review.title}</h4>}
                          <p className="text-slate-600 text-sm">{review.body}</p>
                          <div className="text-xs text-slate-400 mt-2">{review.created_at}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center text-slate-500">
                      <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      No ratings yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'profile' && <CompleteProfileTab />}
            {activeTab === 'bookmarks' && <SavedBookmarksTab />}
            {activeTab === 'verification' && <VerificationTab onSwitchTab={setActiveTab} profileData={data} />}
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
      
      {reviewModal.isOpen && (
        <LeaveReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
          professionalId={reviewModal.professionalId}
          requirementId={reviewModal.requirementId}
          onSuccess={() => {
            fetchDashboard();
          }}
        />
      )}
    </div>
  );
}






