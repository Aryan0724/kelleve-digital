"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, MessageSquare, Search, Gavel, Trophy, HardHat, Building, Wallet, User, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { WalletTab } from "@/components/dashboard/WalletTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { AvailableLeadsTab } from "@/components/dashboard/AvailableLeadsTab";
import { MyBidsTab } from "@/components/dashboard/MyBidsTab";
import { MessagesTab } from "@/components/dashboard/MessagesTab";
import { VerificationTab } from "@/components/dashboard/VerificationTab";
import Link from "next/link";

export function BuilderDashboard({ data, fetchDashboard }: { data: any, fetchDashboard: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

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
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-2xl font-bold text-slate-400">
                  {user?.name?.charAt(0)}
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

            <div className="bg-white border rounded-xl overflow-hidden flex md:flex-col overflow-x-auto md:overflow-visible no-scrollbar">
              <div className="flex md:flex-col min-w-max md:min-w-0">
                {renderSidebarButton("overview", <Building className="h-5 w-5" />, "My Projects")}
                {renderSidebarButton("contractor_reqs", <HardHat className="h-5 w-5" />, "Post RFQs")}
                {renderSidebarButton("bids_received", <Gavel className="h-5 w-5" />, "Received Bids & Quotes")}
                {renderSidebarButton("messages", <MessageSquare className="h-5 w-5" />, "Messages")}
                {renderSidebarButton("wallet", <Wallet className="h-5 w-5" />, "Wallet")}
                {renderSidebarButton("verification", <ShieldCheck className="h-5 w-5" />, "Verification & Trust")}
                {renderSidebarButton("profile", <User className="h-5 w-5" />, "Company Profile")}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'overview' && (
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>My Building Projects</CardTitle>
                  <Button onClick={() => router.push("/post-requirement")} size="sm" className="bg-orange-600 hover:bg-orange-700">New Project</Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16 px-4 border rounded-xl border-dashed bg-slate-50">
                    <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No active projects</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                      Create your first building or development project.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'contractor_reqs' && (
              <Card>
                <CardContent className="py-16 text-center">
                  <HardHat className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Need Contractors or Materials?</h3>
                  <Button onClick={() => router.push('/post-requirement')} className="bg-orange-600">Post RFQ or Job</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'bids_received' && (
              <Card>
                <CardHeader>
                  <CardTitle>Received Quotes & Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16 px-4 border rounded-xl border-dashed bg-slate-50">
                    <Gavel className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Bids Yet</h3>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'wallet' && <WalletTab />}

            {activeTab === 'verification' && <VerificationTab />}

            {activeTab === 'available_leads' && <AvailableLeadsTab leads={data?.recommended_leads} />}

            {activeTab === 'profile' && <ProfileTab />}

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
