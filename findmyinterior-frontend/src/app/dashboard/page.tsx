"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut, LayoutDashboard, MessageSquare, Star, Gavel, CheckCircle2, Search, Trophy, Wallet } from "lucide-react";
import { WalletTab } from "@/components/dashboard/WalletTab";
import { AvailableLeadsTab } from "@/components/dashboard/AvailableLeadsTab";
import { UnlockedLeadsTab } from "@/components/dashboard/UnlockedLeadsTab";
import { MyBidsTab } from "@/components/dashboard/MyBidsTab";

export default function UserDashboard() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab state: "overview", "bids_received", "available_leads", "recommended_leads", "bids_submitted", "won_projects", "unlocked_leads", "wallet", "performance"
  const [activeTab, setActiveTab] = useState("overview");

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
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDashboard();
  }, [token, router]);

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

  if (!user || loading) return <div className="p-20 text-center">Loading dashboard...</div>;

  const isCustomer = user.role === 'customer';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Dashboard Nav */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <LayoutDashboard className="h-5 w-5 text-orange-600" /> My Dashboard
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Welcome, {user.name}</span>
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
                <Badge className="mt-2 capitalize mb-4" variant={isCustomer ? 'secondary' : 'default'}>
                  {user.role}
                </Badge>
                
                {/* Subscription Widget */}
                {!isCustomer && (
                  <div className="w-full bg-orange-50 border border-orange-100 rounded-lg p-3 text-left flex justify-between items-center">
                    <div>
                      <div className="text-xs text-orange-600 font-medium">Current Plan</div>
                      <div className="font-bold text-slate-900">{data?.user?.subscription || "Free Plan"}</div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs bg-white text-orange-600 border-orange-200">Upgrade</Button>
                  </div>
                )}
                
                {/* Wallet Widget */}
                {!isCustomer && (
                  <div className="w-full bg-green-50 border border-green-100 rounded-lg p-3 text-left flex justify-between items-center mt-2">
                    <div>
                      <div className="text-xs text-green-700 font-medium flex items-center"><Wallet className="w-3 h-3 mr-1"/> Wallet Balance</div>
                      <div className="font-bold text-slate-900">₹{data?.user?.wallet_balance || 0}</div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs bg-white text-green-700 border-green-200" onClick={() => setActiveTab("wallet")}>Add</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-white border rounded-xl overflow-hidden flex flex-col">
              {isCustomer ? (
                <>
                  <button 
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'overview' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <LayoutDashboard className={`h-5 w-5 mr-3 ${activeTab === 'overview' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    My Posted Requirements
                  </button>
                  <button 
                    onClick={() => setActiveTab("bids_received")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'bids_received' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Gavel className={`h-5 w-5 mr-3 ${activeTab === 'bids_received' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Bids Received
                  </button>
                  <button 
                    onClick={() => router.push("/messages")}
                    className="flex items-center justify-between p-4 border-b text-left font-medium hover:bg-slate-50 text-slate-700"
                  >
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-3 text-slate-400" /> 
                      Messages
                    </div>
                    {data?.user?.unread_messages_count > 0 && (
                      <Badge className="bg-orange-600 hover:bg-orange-700">{data.user.unread_messages_count}</Badge>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'overview' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <LayoutDashboard className={`h-5 w-5 mr-3 ${activeTab === 'overview' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Dashboard Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab("available_leads")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'available_leads' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Search className={`h-5 w-5 mr-3 ${activeTab === 'available_leads' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Available Leads
                  </button>
                  <button 
                    onClick={() => setActiveTab("recommended_leads")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'recommended_leads' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Star className={`h-5 w-5 mr-3 ${activeTab === 'recommended_leads' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Recommended Leads
                  </button>
                  <button 
                    onClick={() => setActiveTab("unlocked_leads")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'unlocked_leads' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <MessageSquare className={`h-5 w-5 mr-3 ${activeTab === 'unlocked_leads' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Unlocked Leads
                  </button>
                  <button 
                    onClick={() => setActiveTab("bids_submitted")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'bids_submitted' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Gavel className={`h-5 w-5 mr-3 ${activeTab === 'bids_submitted' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    My Bids
                  </button>
                  <button 
                    onClick={() => setActiveTab("won_projects")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'won_projects' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Trophy className={`h-5 w-5 mr-3 ${activeTab === 'won_projects' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Won Projects
                  </button>
                  <button 
                    onClick={() => setActiveTab("wallet")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'wallet' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Wallet className={`h-5 w-5 mr-3 ${activeTab === 'wallet' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    My Wallet
                  </button>
                  <button 
                    onClick={() => router.push("/messages")}
                    className="flex items-center justify-between p-4 border-b text-left font-medium hover:bg-slate-50 text-slate-700"
                  >
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-3 text-slate-400" /> 
                      Messages
                    </div>
                    {data?.user?.unread_messages_count > 0 && (
                      <Badge className="bg-orange-600 hover:bg-orange-700">{data.user.unread_messages_count}</Badge>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* ---------------- CUSTOMER VIEWS ---------------- */}
            {isCustomer && activeTab === 'overview' && data && (
              <Card>
                <CardHeader>
                  <CardTitle>My Posted Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.requirements && data.requirements.length > 0 ? (
                    <div className="space-y-4">
                      {data.requirements.map((req: any) => (
                        <div key={req.id} className="p-4 border rounded-lg bg-slate-50 flex justify-between">
                            <div>
                              <div className="flex items-start gap-3 mb-2">
                                <span className="font-semibold text-slate-900">{req.title}</span>
                                <Badge variant={req.status === 'open' ? 'default' : 'secondary'}>{req.status}</Badge>
                              </div>
                              <p className="text-slate-600 text-sm">{req.description}</p>
                              
                              {data.received_bids && data.received_bids.filter((b: any) => b.requirement_id === req.id).length > 0 && (
                                <div className="mt-3 text-sm text-orange-600 font-medium">
                                  {data.received_bids.filter((b: any) => b.requirement_id === req.id).length} bid(s) received
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button onClick={() => router.push(`/requirements/${req.id}`)} variant="outline">View Detail</Button>
                              {data.received_bids && data.received_bids.filter((b: any) => b.requirement_id === req.id).length > 0 && (
                                <Button onClick={() => router.push(`/requirements/${req.id}/compare`)} className="bg-orange-600 hover:bg-orange-700">Compare Bids</Button>
                              )}
                            </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      You haven't posted any requirements yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {isCustomer && activeTab === 'bids_received' && data && (
              <Card>
                <CardHeader>
                  <CardTitle>Bids on My Requirements</CardTitle>
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
                            <div className="text-xs text-slate-500">For Requirement: {bid.requirement?.title}</div>
                          </div>
                          <div className="flex gap-6 my-3">
                            <div>
                              <div className="text-xs text-slate-500">Bid Amount</div>
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
                              <Button onClick={() => acceptBid(bid.id)} className="bg-green-600 hover:bg-green-700 text-white">Accept Bid</Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      No bids received yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ---------------- PROFESSIONAL VIEWS ---------------- */}
            
            {!isCustomer && activeTab === 'overview' && data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-slate-500 text-sm mb-1">Total Profile Views</div>
                      <div className="text-3xl font-bold">{data.total_views || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-slate-500 text-sm mb-1">Leads Received</div>
                      <div className="text-3xl font-bold text-orange-600">{data.total_inquiries || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-slate-500 text-sm mb-1">Projects Won</div>
                      <div className="text-3xl font-bold text-green-600">
                        {data.submitted_bids?.filter((b:any) => b.status === 'awarded').length || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {!isCustomer && activeTab === 'available_leads' && <AvailableLeadsTab />}

            {!isCustomer && activeTab === 'recommended_leads' && data && (
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

            {!isCustomer && activeTab === 'unlocked_leads' && data && (
              <UnlockedLeadsTab unlockedContacts={data.unlocked_contacts} onRefresh={fetchDashboard} />
            )}

            {!isCustomer && activeTab === 'bids_submitted' && data && (
              <MyBidsTab bids={data.submitted_bids} title="My Submitted Bids" showAwardedOnly={false} />
            )}

            {!isCustomer && activeTab === 'won_projects' && data && (
              <MyBidsTab bids={data.submitted_bids} title="My Won Projects" showAwardedOnly={true} />
            )}

            {!isCustomer && activeTab === 'wallet' && <WalletTab />}

          </div>
        </div>
      </div>
    </div>
  );
}
