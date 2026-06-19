"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut, LayoutDashboard, MessageSquare, Star, Gavel, CheckCircle2, Search, Trophy, Wallet, HardHat, Home, Building, Truck, Wrench } from "lucide-react";
import { WalletTab } from "@/components/dashboard/WalletTab";
import { AvailableLeadsTab } from "@/components/dashboard/AvailableLeadsTab";
import { UnlockedLeadsTab } from "@/components/dashboard/UnlockedLeadsTab";
import { MyBidsTab } from "@/components/dashboard/MyBidsTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { LeaveReviewModal } from "@/components/dashboard/LeaveReviewModal";
import Link from "next/link";

export default function UserDashboard() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  
  const [reviewModalData, setReviewModalData] = useState<{isOpen: boolean, profId: number, reqId: number}>({
    isOpen: false, profId: 0, reqId: 0
  });

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/user/dashboard");
      setData(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDashboard();
  }, [token, mounted, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const acceptBid = async (bidId: number) => {
    try {
      await api.patch(`/bids/${bidId}/accept`);
      alert("Bid accepted successfully!");
      fetchDashboard();
    } catch (e) {
      alert("Failed to accept bid.");
    }
  };

  if (!mounted || !user || loading) return <div className="p-20 text-center">Loading dashboard...</div>;

  const role = user.role; // customer, business, builder, supplier, worker
  // If business, try to infer if contractor vs designer based on listing if needed, but for now we'll bundle.
  
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
            <LayoutDashboard className="h-5 w-5 text-orange-600" /> {user.name}'s Workspace
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden md:block">{role.toUpperCase()}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-2xl font-bold text-slate-400">
                  {user.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <Badge className="mt-2 capitalize mb-4" variant={role === 'customer' ? 'secondary' : 'default'}>
                  {role}
                </Badge>
                
                {role !== 'customer' && (
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
                )}
              </CardContent>
            </Card>

            <div className="bg-white border rounded-xl overflow-hidden flex md:flex-col overflow-x-auto md:overflow-visible no-scrollbar">
              
              {role === 'customer' && (
                <div className="flex md:flex-col min-w-max md:min-w-0">
                  {renderSidebarButton("overview", <LayoutDashboard className="h-5 w-5" />, "My Requirements")}
                  {renderSidebarButton("bids_received", <Gavel className="h-5 w-5" />, "Received Bids")}
                  {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                  {renderSidebarButton("saved", <Star className="h-5 w-5" />, "Saved Professionals")}
                </div>
              )}

              {role === 'business' && (
                <div className="flex md:flex-col min-w-max md:min-w-0">
                  {renderSidebarButton("overview", <LayoutDashboard className="h-5 w-5" />, "My Posted RFQs")}
                  {renderSidebarButton("available_leads", <Search className="h-5 w-5" />, "Available Leads")}
                  {renderSidebarButton("recommended_leads", <Star className="h-5 w-5" />, "Recommended Leads")}
                  {renderSidebarButton("unlocked_leads", <MessageSquare className="h-5 w-5" />, "Unlocked Leads")}
                  {renderSidebarButton("bids_submitted", <Gavel className="h-5 w-5" />, "Submitted Bids")}
                  {renderSidebarButton("won_projects", <Trophy className="h-5 w-5" />, "Won Projects")}
                  {renderSidebarButton("wallet", <Wallet className="h-5 w-5" />, "Wallet")}
                  {renderSidebarButton("profile", <User className="h-5 w-5" />, "Business Profile")}
                  {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                </div>
              )}

              {role === 'builder' && (
                <div className="flex md:flex-col min-w-max md:min-w-0">
                  {renderSidebarButton("overview", <Building className="h-5 w-5" />, "Builder Projects")}
                  {renderSidebarButton("contractor_reqs", <HardHat className="h-5 w-5" />, "Contractor Requests")}
                  {renderSidebarButton("supplier_reqs", <Truck className="h-5 w-5" />, "Supplier Requests")}
                  {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                  {renderSidebarButton("wallet", <Wallet className="h-5 w-5" />, "Wallet")}
                  {renderSidebarButton("profile", <User className="h-5 w-5" />, "Builder Profile")}
                </div>
              )}

              {role === 'supplier' && (
                <div className="flex md:flex-col min-w-max md:min-w-0">
                  {renderSidebarButton("overview", <LayoutDashboard className="h-5 w-5" />, "Dashboard Overview")}
                  {renderSidebarButton("available_leads", <Search className="h-5 w-5" />, "Quote Requests")}
                  {renderSidebarButton("bids_submitted", <Gavel className="h-5 w-5" />, "Submitted Quotes")}
                  {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                  {renderSidebarButton("wallet", <Wallet className="h-5 w-5" />, "Wallet")}
                  {renderSidebarButton("profile", <User className="h-5 w-5" />, "Product Catalogue")}
                </div>
              )}

              {role === 'worker' && (
                <div className="flex md:flex-col min-w-max md:min-w-0">
                  {renderSidebarButton("overview", <LayoutDashboard className="h-5 w-5" />, "Dashboard")}
                  {renderSidebarButton("available_leads", <Search className="h-5 w-5" />, "Available Jobs")}
                  {renderSidebarButton("bids_submitted", <Gavel className="h-5 w-5" />, "Applied Jobs")}
                  {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                  {renderSidebarButton("profile", <User className="h-5 w-5" />, "Worker Profile")}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* SHARED POSTED REQUIREMENTS VIEW (Everyone can post) */}
            {activeTab === 'overview' && data && (
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>{role === 'customer' ? 'My Requirements' : 'My Posted RFQs / Requirements'}</CardTitle>
                  <Button onClick={() => router.push("/post-requirement")} size="sm" className="bg-orange-600 hover:bg-orange-700">Post New</Button>
                </CardHeader>
                <CardContent>
                  {data.requirements && data.requirements.length > 0 ? (
                    <div className="space-y-4">
                      {data.requirements.map((req: any) => (
                        <div key={req.id} className="p-4 border rounded-lg bg-slate-50 flex justify-between flex-col md:flex-row gap-4">
                            <div>
                              <div className="flex items-start gap-3 mb-2">
                                <span className="font-semibold text-slate-900">{req.title}</span>
                                <Badge variant={req.status === 'open' ? 'default' : 'secondary'}>{req.status}</Badge>
                              </div>
                              <p className="text-slate-600 text-sm line-clamp-2">{req.description}</p>
                              
                              {data.received_bids && data.received_bids.filter((b: any) => b.requirement_id === req.id).length > 0 && (
                                <div className="mt-3 text-sm text-orange-600 font-medium">
                                  {data.received_bids.filter((b: any) => b.requirement_id === req.id).length} response(s) received
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Button onClick={() => router.push(`/requirements/${req.id}`)} variant="outline">View Detail</Button>
                              {data.received_bids && data.received_bids.filter((b: any) => b.requirement_id === req.id).length > 0 && (
                                <Button onClick={() => router.push(`/requirements/${req.id}/compare`)} className="bg-orange-600 hover:bg-orange-700">Compare</Button>
                              )}
                            </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 border rounded-xl border-dashed bg-slate-50">
                      <LayoutDashboard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No active posts</h3>
                      <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        You haven't posted any requirements or requests yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* SHARED RECEIVED BIDS VIEW */}
            {activeTab === 'bids_received' && data && (
              <Card>
                <CardHeader>
                  <CardTitle>Received Bids & Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.received_bids && data.received_bids.length > 0 ? (
                    <div className="space-y-4">
                      {data.received_bids.map((bid: any) => (
                        <div key={bid.id} className="p-4 border rounded-lg bg-slate-50 relative">
                          {bid.status === 'accepted' && (
                            <div className="absolute top-4 right-4 text-green-600 font-bold flex items-center">
                              <CheckCircle2 className="w-5 h-5 mr-1" /> Accepted
                            </div>
                          )}
                          <div className="mb-2">
                            <span className="font-semibold text-slate-900">Bid by Professional ID: {bid.professional_id}</span>
                            <div className="text-xs text-slate-500">For: {bid.requirement?.title}</div>
                          </div>
                          <div className="flex gap-6 my-3">
                            <div>
                              <div className="text-xs text-slate-500">Amount</div>
                              <div className="font-bold text-orange-600">₹{bid.amount}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">Timeline</div>
                              <div className="font-bold text-slate-700">{bid.timeline_days} Days</div>
                            </div>
                          </div>
                          <p className="text-slate-600 text-sm bg-white p-3 rounded border">{bid.proposal}</p>
                          
                          {bid.status === 'pending' && (
                            <div className="mt-4 flex gap-2">
                              <Button onClick={() => acceptBid(bid.id)} className="bg-green-600 hover:bg-green-700 text-white">Accept Quote</Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 border rounded-xl border-dashed bg-slate-50">
                      <Gavel className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No Bids Yet</h3>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* MESSAGES TAB FALLBACK */}
            {activeTab === 'messages' && (
              <Card>
                <CardContent className="py-16 text-center">
                  <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Go to your Messages Hub</h3>
                  <Button onClick={() => router.push('/messages')} className="bg-[#0a1c3a]">Open Messenger</Button>
                </CardContent>
              </Card>
            )}

            {/* SAVED FALLBACK */}
            {activeTab === 'saved' && (
              <Card>
                <CardContent className="py-16 text-center">
                  <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-4">No Saved Professionals Yet</h3>
                </CardContent>
              </Card>
            )}

            {/* ---------------- PROFESSIONAL ONLY VIEWS ---------------- */}
            
            {role !== 'customer' && activeTab === 'available_leads' && <AvailableLeadsTab />}

            {role !== 'customer' && activeTab === 'recommended_leads' && data && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recommended_leads && data.recommended_leads.length > 0 ? (
                    <div className="space-y-4">
                      {data.recommended_leads.map((req: any) => (
                        <div key={req.id} className="p-4 border rounded-lg bg-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div>
                            <h4 className="font-bold text-slate-900">{req.title}</h4>
                            <div className="text-sm text-slate-500 mb-1">{req.city?.name} • Match Score: {req.match_score || 0}%</div>
                            <p className="text-slate-600 text-sm line-clamp-2">{req.description}</p>
                          </div>
                          <Button onClick={() => router.push(`/requirements/${req.id}`)} className="bg-orange-600 hover:bg-orange-700 whitespace-nowrap">
                            View Lead
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                      You have no new recommended leads at this time.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {role !== 'customer' && activeTab === 'unlocked_leads' && data && (
              <UnlockedLeadsTab unlockedContacts={data.unlocked_contacts} onRefresh={fetchDashboard} />
            )}

            {role !== 'customer' && activeTab === 'bids_submitted' && data && (
              <MyBidsTab bids={data.submitted_bids} title="My Submitted Quotes" showAwardedOnly={false} />
            )}

            {role !== 'customer' && activeTab === 'won_projects' && data && (
              <MyBidsTab bids={data.submitted_bids} title="My Won Projects" showAwardedOnly={true} />
            )}

            {role !== 'customer' && activeTab === 'wallet' && <WalletTab />}

            {role !== 'customer' && activeTab === 'profile' && <ProfileTab />}

            {/* Builder/Supplier Specific Tabs Fallbacks */}
            {activeTab === 'contractor_reqs' || activeTab === 'supplier_reqs' ? (
              <Card>
                <CardContent className="py-16 text-center text-slate-500">
                  <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  No requests found in this category.
                </CardContent>
              </Card>
            ) : null}

          </div>
        </div>
      </div>
      
      {/* Modals */}
      <LeaveReviewModal 
        isOpen={reviewModalData.isOpen}
        onClose={() => setReviewModalData({...reviewModalData, isOpen: false})}
        professionalId={reviewModalData.profId}
        requirementId={reviewModalData.reqId}
        onSuccess={() => fetchDashboard()}
      />
    </div>
  );
}
