"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, MessageSquare, Star, Gavel, LogOut, User, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { VerificationTab } from "@/components/dashboard/VerificationTab";
import { LeaveReviewModal } from "@/components/dashboard/LeaveReviewModal";
import { CompleteProfileTab } from "@/components/dashboard/CompleteProfileTab";
import Link from "next/link";

export function HomeownerDashboard({ data, fetchDashboard }: { data: any, fetchDashboard: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reviewModal, setReviewModal] = useState<{isOpen: boolean; professionalId: number; requirementId: number}>({ isOpen: false, professionalId: 0, requirementId: 0 });

  const handleLogout = () => {
    logout();
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
            <LayoutDashboard className="h-5 w-5 text-orange-600" /> {user?.name}'s Workspace
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden md:block">HOMEOWNER</span>
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
                <Badge className="mt-2 capitalize mb-4" variant="secondary">Homeowner</Badge>
              </CardContent>
            </Card>

            <div className="bg-white border rounded-xl overflow-hidden flex md:flex-col overflow-x-auto md:overflow-visible no-scrollbar">
              <div className="flex md:flex-col min-w-max md:min-w-0">
                {renderSidebarButton("dashboard", <LayoutDashboard className="h-5 w-5" />, "Dashboard")}
                {renderSidebarButton("bids", <Gavel className="h-5 w-5" />, "Received Bids")}
                {renderSidebarButton("shortlisted", <Star className="h-5 w-5" />, "Shortlisted Professionals")}
                {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                {renderSidebarButton("reviews", <Star className="h-5 w-5" />, "Reviews")}
                {renderSidebarButton("profile", <User className="h-5 w-5" />, "Profile")}
                {renderSidebarButton("settings", <User className="h-5 w-5" />, "Settings")}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-medium text-slate-500 mb-1">Active Projects</div>
                    <div className="text-2xl font-bold text-slate-900">{data?.projects?.filter((p:any) => p.status === 'in_progress').length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-medium text-slate-500 mb-1">Open Requirements</div>
                    <div className="text-2xl font-bold text-slate-900">{data?.projects?.filter((p:any) => p.status === 'open').length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-medium text-slate-500 mb-1">Received Bids</div>
                    <div className="text-2xl font-bold text-slate-900">{data?.received_bids?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-medium text-slate-500 mb-1">Unread Messages</div>
                    <div className="text-2xl font-bold text-slate-900">{data?.unread_messages || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-medium text-slate-500 mb-1">Completed Projects</div>
                    <div className="text-2xl font-bold text-slate-900">{data?.projects?.filter((p:any) => p.status === 'completed').length || 0}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>My Projects</CardTitle>
                  <Button onClick={() => router.push("/post-requirement")} size="sm" className="bg-orange-600 hover:bg-orange-700">Post New</Button>
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
                              <Button onClick={() => router.push(`/requirements/${req.id}?type=${req._type || 'project'}`)} variant="outline" size="sm">View Detail</Button>
                              
                              {(req.status === 'awarded' || req.status === 'in_progress') && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={async () => {
                                    try {
                                      const reqType = req._type || 'project';
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
                                    if(req.professional_id) {
                                      setReviewModal({ isOpen: true, professionalId: req.professional_id, requirementId: req.id });
                                    } else {
                                        alert("Cannot find awarded professional details. Please contact support.");
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
                    <div className="text-center py-12 bg-slate-50 border rounded-lg text-slate-500">
                      You haven't posted any projects yet.
                      <div className="mt-4">
                        <Link href="/post-requirement">
                          <Button className="bg-orange-600 hover:bg-orange-700">Post a Project</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'bids' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Received Bids</h2>
                  <span className="text-sm text-slate-500">{data?.received_bids?.length || 0} total</span>
                </div>
                {data?.received_bids && data.received_bids.length > 0 ? (
                  <div className="space-y-4">
                    {data.received_bids.map((bid: any) => (
                      <div key={bid.id} className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {/* Top bar — which requirement */}
                        <div className="px-5 py-3 bg-slate-50 border-b flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              bid.requirement_type === 'Skilled Labour Job'
                                ? 'bg-orange-100 text-orange-700'
                                : bid.requirement_type === 'RFQ'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-indigo-100 text-indigo-700'
                            }`}>
                              {bid.requirement_type}
                            </span>
                            <span className="font-semibold text-slate-800 text-sm truncate max-w-xs">
                              {bid.requirement_title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                              bid.is_awarded
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : bid.status === 'pending'
                                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                  : 'bg-slate-100 border-slate-200 text-slate-600'
                            }`}>
                              {bid.is_awarded ? '✓ Awarded' : bid.status}
                            </span>
                            <span className="text-xs text-slate-400">{bid.created_at}</span>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg shrink-0 overflow-hidden">
                              {bid.professional?.avatar
                                ? <img src={bid.professional.avatar} alt={bid.professional?.name} className="w-full h-full object-cover" />
                                : bid.professional?.name?.charAt(0) || '?'
                              }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-900">
                                <a href={`/professionals/${bid.professional?.id}`} target="_blank" rel="noreferrer" className="hover:text-orange-600 hover:underline">
                                  {bid.professional?.name || 'Professional'}
                                </a>
                              </div>
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-slate-500 mt-0.5">
                                {bid.professional?.skill && <span>🔧 {bid.professional.skill}</span>}
                                {bid.professional?.city && <span>📍 {bid.professional.city}</span>}
                                {bid.professional?.experience_years && <span>⏱ {bid.professional.experience_years} yrs exp</span>}
                                {bid.professional?.avg_rating > 0 && <span>⭐ {bid.professional.avg_rating}/5</span>}
                              </div>

                              {bid.proposal_message && (
                                <p className="mt-3 text-sm text-slate-600 bg-slate-50 border rounded-lg p-3 leading-relaxed">
                                  {bid.proposal_message}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Stats row */}
                          <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t">
                            <div className="text-center">
                              <div className="text-xs text-slate-500 mb-0.5">Bid Amount</div>
                              <div className="text-lg font-bold text-orange-600">₹{Number(bid.amount || 0).toLocaleString('en-IN')}</div>
                            </div>
                            {bid.timeline_days && (
                              <div className="text-center">
                                <div className="text-xs text-slate-500 mb-0.5">Timeline</div>
                                <div className="font-semibold text-slate-800">{bid.timeline_days} days</div>
                              </div>
                            )}
                            {bid.smart_bid_score > 0 && (
                              <div className="text-center">
                                <div className="text-xs text-slate-500 mb-0.5">Smart Score</div>
                                <div className="font-semibold text-indigo-600">{bid.smart_bid_score} / 100</div>
                              </div>
                            )}
                            <div className="ml-auto flex gap-2 items-end flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/professionals/${bid.professional?.id}`, '_blank')}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <User className="w-4 h-4 mr-1" /> View Profile
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await import('@/lib/api').then(m => m.default.post('/shortlists', { professional_id: bid.professional?.id }));
                                    alert("Shortlisted successfully!");
                                    fetchDashboard();
                                  } catch (err: any) {
                                    alert(err.response?.data?.message || "Failed to shortlist");
                                  }
                                }}
                              >
                                ★ Shortlist
                              </Button>
                              {!bid.is_awarded && (
                                <Button
                                  size="sm"
                                  className="bg-orange-600 hover:bg-orange-700"
                                  onClick={async () => {
                                    try {
                                      await import('@/lib/api').then(m => m.default.patch(`/bids/${bid.id}/award`));
                                      alert("Awarded successfully!");
                                      fetchDashboard();
                                    } catch (err: any) {
                                      alert(err.response?.data?.message || "Failed to award");
                                    }
                                  }}
                                >
                                  Award Job
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-4 border rounded-xl border-dashed bg-slate-50">
                    <Gavel className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Bids Yet</h3>
                    <p className="text-slate-500 text-sm">When professionals apply for your jobs, their bids will appear here.</p>
                  </div>
                )}
              </div>
            )}


            {activeTab === 'shortlisted' && (
              <Card>
                <CardHeader>
                  <CardTitle>Shortlisted Professionals</CardTitle>
                </CardHeader>
                <CardContent>
                  {data?.shortlisted_professionals && data.shortlisted_professionals.length > 0 ? (
                    <div className="space-y-4">
                      {data.shortlisted_professionals.map((shortlist: any) => (
                        <div key={shortlist.id} className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center">
                          <div className="font-semibold">{shortlist.professional?.name || 'Unknown'}</div>
                          <div className="flex gap-2">
                            <Button onClick={() => router.push(`/professionals/${shortlist.professional?.id}`)} variant="outline" size="sm">View Profile</Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={async () => {
                                try {
                                  await import('@/lib/api').then(m => m.default.delete(`/shortlists/${shortlist.professional?.id}`));
                                  alert("Removed from shortlist!");
                                  fetchDashboard();
                                } catch (err: any) {
                                  alert(err.response?.data?.message || "Failed to remove from shortlist");
                                }
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 border rounded-xl border-dashed bg-slate-50">
                      <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No Shortlisted Professionals Yet</h3>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'messages' && (
              <Card>
                <CardContent className="py-16 text-center">
                  <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Go to your Messages Hub</h3>
                  <Button onClick={() => router.push('/messages')} className="bg-[#0a1c3a]">Open Messenger</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent className="py-16 text-center">
                  <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Reviews Yet</h3>
                </CardContent>
              </Card>
            )}

            {activeTab === 'profile' && <CompleteProfileTab />}
            {activeTab === 'settings' && <SettingsTab />}
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
