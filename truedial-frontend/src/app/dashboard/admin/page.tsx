"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Store, Megaphone, IndianRupee, CheckCircle2, ShieldCheck, Activity } from "lucide-react";

export default function SuperAdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token") || "mock-admin-token";
      
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      
      const vendorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/admin/vendors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const vendorsData = await vendorsRes.json();
      
      if (statsData.success) setStats(statsData.data);
      if (vendorsData.success) setVendors(vendorsData.data);
      
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token") || "mock-admin-token";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/truedial/admin/vendors/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (data.success) {
        setVendors(vendors.map(v => v.id === id ? { ...v, status: 'active' } : v));
      }
    } catch (error) {
      console.error("Failed to approve vendor:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <ShieldCheck className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Super Admin Console</h1>
            <p className="text-blue-200/60 text-sm">Global overview and vendor management.</p>
          </div>
        </div>
        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">System Online</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Vendors</CardTitle>
            <Store className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.total_vendors.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.total_users.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-[#E8701A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.active_campaigns.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">MTD Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.revenue_mtd}</div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Management */}
      <Card className="bg-white dark:bg-[#0a1c3a]/30 border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center">
            <Activity className="mr-2 h-5 w-5 text-blue-500" />
            Vendor Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Business Name</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{vendor.business_name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{vendor.owner}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{new Date(vendor.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={vendor.status === 'active' ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'}>
                        {vendor.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {vendor.status === 'pending_approval' ? (
                        <Button size="sm" onClick={() => handleApprove(vendor.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
                          Approve
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled className="text-slate-400">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approved
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
