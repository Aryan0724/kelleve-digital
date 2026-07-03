"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, MessageSquare, Search, Gavel, CheckCircle2, User, LogOut, ShieldCheck, Briefcase, Star } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { handleLogoutAction } from "@/lib/auth";
import { CompleteProfileTab } from "@/components/dashboard/CompleteProfileTab";
import { AvailableLeadsTab } from "@/components/dashboard/AvailableLeadsTab";
import { MyBidsTab } from "@/components/dashboard/MyBidsTab";
import { UnverifiedBanner } from "@/components/dashboard/UnverifiedBanner";
import { VerificationTab } from "@/components/dashboard/VerificationTab";
import { UnlockedLeadsTab } from "@/components/dashboard/UnlockedLeadsTab";
import { PostedRequirementsTab } from "@/components/dashboard/PostedRequirementsTab";
import { LeaveReviewModal } from "@/components/dashboard/LeaveReviewModal";
export function WorkerDashboard({ data, fetchDashboard }: { data: any, fetchDashboard: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("available_leads");
  const [reviewModal, setReviewModal] = useState<{isOpen: boolean; professionalId: number; requirementId: number}>({ isOpen: false, professionalId: 0, requirementId: 0 });

  const handleLogout = async () => {
    await handleLogoutAction();
    router.push("/login");
  };

  const renderSidebarButton = (id: string, icon: React.ReactNode, label: string) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center p-4 border-b md:border-r-0 border-r text-left font-medium whitespace-nowrap md:whitespace-normal transition-colors ${activeTab === id ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
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
            <Briefcase className="h-5 w-5 text-orange-600" /> {user?.name}'s Jobs
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
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-20 w-20 relative rounded-full overflow-hidden ring-4 ring-orange-100 bg-slate-100 flex items-center justify-center mb-4 text-2xl font-bold text-slate-400 shadow">
                  <span className="absolute inset-0 z-0 flex items-center justify-center">{user?.name?.charAt(0)}</span>
                  {user?.avatar && (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover absolute inset-0 z-10 text-transparent" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  )}
                </div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <Badge className="mt-2 capitalize mb-4" variant="default">Skilled Worker</Badge>
              </CardContent>
            </Card>

            <div className="bg-white border rounded-xl overflow-hidden flex md:flex-col overflow-x-auto md:overflow-visible no-scrollbar">
              <div className="flex md:flex-col min-w-max md:min-w-0">
                {renderSidebarButton("available_leads", <Search className="h-5 w-5" />, "Available Jobs")}
                {renderSidebarButton("unlocked_leads", <User className="h-5 w-5" />, "Unlocked Leads")}
                {renderSidebarButton("bids_submitted", <Gavel className="h-5 w-5" />, "Applied Jobs")}
                {renderSidebarButton("active_jobs", <CheckCircle2 className="h-5 w-5" />, "Active Jobs")}
                {renderSidebarButton("completed_jobs", <CheckCircle2 className="h-5 w-5" />, "Completed Jobs")}
                {renderSidebarButton("my_requirements", <LayoutDashboard className="h-5 w-5" />, "My Requirements")}
                {renderSidebarButton("ratings", <Star className="h-5 w-5" />, "Ratings")}
                {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                {renderSidebarButton("verification", <ShieldCheck className="h-5 w-5" />, "Verification")}
                {renderSidebarButton("profile", <User className="h-5 w-5" />, "Profile")}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">

            {activeTab === 'available_leads' && <AvailableLeadsTab leads={data?.recommended_leads} />}
            
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
