"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut, LayoutDashboard, MessageSquare, Star, Gavel, CheckCircle2 } from "lucide-react";
import { WalletTab } from "@/components/dashboard/WalletTab";

export default function UserDashboard() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab state: "overview", "bids_received", "bids_submitted", "unlocked_leads"
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

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
      // reload
      const res = await api.get("/dashboard");
      setData(res.data.data);
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
                <Badge className="mt-2 capitalize" variant={isCustomer ? 'secondary' : 'default'}>
                  {user.role}
                </Badge>
                {!isCustomer && (
                  <Badge variant="outline" className="mt-2 border-orange-200 text-orange-700 bg-orange-50">
                    {data?.user?.subscription || "Free Plan"}
                  </Badge>
                )}
              </CardContent>
            </Card>

            <div className="bg-white border rounded-xl overflow-hidden flex flex-col">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'overview' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                <LayoutDashboard className={`h-5 w-5 mr-3 ${activeTab === 'overview' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                Overview
              </button>
              
              {isCustomer ? (
                <>
                  <button 
                    onClick={() => setActiveTab("bids_received")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'bids_received' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Gavel className={`h-5 w-5 mr-3 ${activeTab === 'bids_received' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Bids Received
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveTab("bids_submitted")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'bids_submitted' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Gavel className={`h-5 w-5 mr-3 ${activeTab === 'bids_submitted' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    My Submitted Bids
                  </button>
                  <button 
                    onClick={() => setActiveTab("unlocked_leads")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'unlocked_leads' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <MessageSquare className={`h-5 w-5 mr-3 ${activeTab === 'unlocked_leads' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Unlocked Leads
                  </button>
                  <button 
                    onClick={() => setActiveTab("performance")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'performance' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Star className={`h-5 w-5 mr-3 ${activeTab === 'performance' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    Performance Metrics
                  </button>
                  <button 
                    onClick={() => setActiveTab("wallet")}
                    className={`flex items-center p-4 border-b text-left font-medium ${activeTab === 'wallet' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Star className={`h-5 w-5 mr-3 ${activeTab === 'wallet' ? 'text-orange-600' : 'text-slate-400'}`} /> 
                    My Wallet
                  </button>
                </>
              )}
              
              <button className="flex items-center p-4 hover:bg-slate-50 text-left text-slate-700">
                <Settings className="h-5 w-5 mr-3 text-slate-400" /> Account Settings
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* ---------------- CUSTOMER OVERVIEW ---------------- */}
            {isCustomer && activeTab === 'overview' && data && (
              <Card>
                <CardHeader>
                  <CardTitle>My Posted Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.requirements && data.requirements.length > 0 ? (
                    <div className="space-y-4">
                      {data.requirements.map((req: any) => (
                        <div key={req.id} className="p-4 border rounded-lg bg-slate-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-slate-900">{req.title}</span>
                            <Badge variant={req.status === 'open' ? 'default' : 'secondary'}>{req.status}</Badge>
                          </div>
                          <p className="text-slate-600 text-sm">{req.description}</p>
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

            {/* ---------------- CUSTOMER BIDS RECEIVED ---------------- */}
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


            {/* ---------------- PROFESSIONAL OVERVIEW ---------------- */}
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
                      <div className="text-slate-500 text-sm mb-1">Average Rating</div>
                      <div className="text-3xl font-bold flex items-center">
                        {data.avg_rating || 0} <Star className="h-5 w-5 fill-amber-400 text-amber-400 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
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
              </>
            )}

            {/* ---------------- PROFESSIONAL BIDS SUBMITTED ---------------- */}
            {!isCustomer && activeTab === 'bids_submitted' && data && (
              <Card>
                <CardHeader>
                  <CardTitle>My Submitted Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.submitted_bids && data.submitted_bids.length > 0 ? (
                    <div className="space-y-4">
                      {data.submitted_bids.map((bid: any) => (
                        <div key={bid.id} className="p-4 border rounded-lg bg-slate-50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-semibold text-slate-900">For: {bid.requirement?.title}</span>
                              <div className="text-xs text-slate-500">{bid.requirement?.city?.name}</div>
                            </div>
                            <Badge variant={bid.status === 'accepted' ? 'default' : (bid.status === 'rejected' ? 'destructive' : 'secondary')}>
                              {bid.status}
                            </Badge>
                          </div>
                          <div className="flex gap-6 my-3">
                            <div>
                              <div className="text-xs text-slate-500">My Bid</div>
                              <div className="font-bold text-orange-600">₹{bid.amount}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">Timeline</div>
                              <div className="font-bold text-slate-700">{bid.timeline_days} Days</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      You haven't submitted any bids.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ---------------- PROFESSIONAL UNLOCKED LEADS ---------------- */}
            {!isCustomer && activeTab === 'unlocked_leads' && data && (
              <Card>
                <CardHeader>
                  <CardTitle>Unlocked Customer Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.unlocked_contacts && data.unlocked_contacts.length > 0 ? (
                    <div className="space-y-4">
                      {data.unlocked_contacts.map((unlock: any) => (
                        <div key={unlock.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                          <div className="mb-2">
                            <span className="font-semibold text-slate-900">{unlock.requirement?.title}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-800">Customer: {unlock.requirement?.name}</span>
                            <span className="text-sm font-bold text-slate-800">Phone: {unlock.requirement?.phone}</span>
                            <span className="text-sm font-bold text-slate-800">Email: {unlock.requirement?.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500">
                      You haven't unlocked any contacts yet. View requirements and pay to unlock!
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ---------------- PROFESSIONAL PERFORMANCE METRICS ---------------- */}
            {!isCustomer && activeTab === 'performance' && data && data.vendor_metrics && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Performance KPIs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 border rounded-lg flex flex-col justify-center items-center">
                        <div className="text-sm text-slate-500 mb-2">Response Rate</div>
                        <div className="text-3xl font-bold mb-2 text-slate-900">{data.vendor_metrics.response_rate}%</div>
                        {data.vendor_metrics.response_rate >= 90 ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">🟢 Excellent</Badge> : (data.vendor_metrics.response_rate >= 50 ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">🟡 Average</Badge> : <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🔴 Poor</Badge>)}
                      </div>
                      <div className="p-4 border rounded-lg flex flex-col justify-center items-center">
                        <div className="text-sm text-slate-500 mb-2">Completion Rate</div>
                        <div className="text-3xl font-bold mb-2 text-slate-900">{data.vendor_metrics.completion_rate}%</div>
                        {data.vendor_metrics.completion_rate >= 90 ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">🟢 Excellent</Badge> : (data.vendor_metrics.completion_rate >= 50 ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">🟡 Average</Badge> : <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🔴 Poor</Badge>)}
                      </div>
                      <div className="p-4 border rounded-lg flex flex-col justify-center items-center">
                        <div className="text-sm text-slate-500 mb-2">Win Rate</div>
                        <div className="text-3xl font-bold mb-2 text-slate-900">{data.vendor_metrics.win_rate}%</div>
                        {data.vendor_metrics.win_rate >= 20 ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">🟢 Excellent</Badge> : (data.vendor_metrics.win_rate >= 10 ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">🟡 Average</Badge> : <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🔴 Poor</Badge>)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lead Conversion Funnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="font-medium text-slate-700">Recommendations Received</span>
                        <span className="font-bold text-lg">{data.vendor_metrics.recommendations_received}</span>
                      </div>
                      <div className="flex justify-center text-slate-300 font-bold text-xl">↓</div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="font-medium text-slate-700">Profile Views</span>
                        <span className="font-bold text-lg">{data.vendor_metrics.profile_views}</span>
                      </div>
                      <div className="flex justify-center text-slate-300 font-bold text-xl">↓</div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="font-medium text-slate-700">Invites Received</span>
                        <span className="font-bold text-lg">{data.vendor_metrics.invites_received}</span>
                      </div>
                      <div className="flex justify-center text-slate-300 font-bold text-xl">↓</div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="font-medium text-slate-700">Bids Submitted</span>
                        <span className="font-bold text-lg">{data.vendor_metrics.total_bids}</span>
                      </div>
                      <div className="flex justify-center text-slate-300 font-bold text-xl">↓</div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                        <span className="font-medium text-slate-700">Projects Awarded</span>
                        <span className="font-bold text-lg">{data.vendor_metrics.award_count}</span>
                      </div>
                      <div className="flex justify-center text-slate-300 font-bold text-xl">↓</div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded border-l-4 border-green-500">
                        <span className="font-medium text-green-800">Projects Completed</span>
                        <span className="font-bold text-lg text-green-700">{data.vendor_metrics.projects_completed}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ---------------- PROFESSIONAL WALLET ---------------- */}
            {!isCustomer && activeTab === 'wallet' && (
              <WalletTab />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
