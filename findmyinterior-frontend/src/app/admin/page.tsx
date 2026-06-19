"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  ClipboardList,
  IndianRupee,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Star,
  Users,
  XCircle,
} from "lucide-react";

type AdminTab = "overview" | "verifications" | "users" | "requirements" | "reviews" | "payments";

const tabs: { id: AdminTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "verifications", label: "Verifications" },
  { id: "users", label: "Users" },
  { id: "requirements", label: "Requirements" },
  { id: "reviews", label: "Reviews" },
  { id: "payments", label: "Payments" },
];

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [dashboard, setDashboard] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isAdmin = user?.role === "admin";

  const fetchDashboard = useCallback(async () => {
    const res = await api.get("/admin/dashboard");
    setDashboard(res.data.data);
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await api.get("/admin/users", { params: { search: search || undefined } });
    setUsers(res.data.data || []);
  }, [search]);

  const fetchRequirements = useCallback(async () => {
    const res = await api.get("/admin/requirements");
    setRequirements(res.data.data || []);
  }, []);

  const fetchReviews = useCallback(async () => {
    const res = await api.get("/admin/reviews/pending");
    setReviews(res.data.data || []);
  }, []);

  const fetchPayments = useCallback(async () => {
    const res = await api.get("/admin/payments");
    setPayments(res.data.data || []);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchDashboard(), fetchUsers(), fetchRequirements(), fetchReviews(), fetchPayments()]);
    } finally {
      setLoading(false);
    }
  }, [fetchDashboard, fetchPayments, fetchRequirements, fetchReviews, fetchUsers]);

  useEffect(() => {
    if (!token || !isAdmin) {
      router.push("/login");
      return;
    }
    refreshAll();
  }, [token, isAdmin, router, refreshAll]);

  useEffect(() => {
    if (token && isAdmin) fetchUsers();
  }, [fetchUsers, token, isAdmin]);

  const runAction = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await action();
      await refreshAll();
    } finally {
      setBusyId(null);
    }
  };

  const stats = dashboard?.stats || {};
  const pendingVerifications = dashboard?.pending_verifications || [];

  const statCards = [
    { label: "Total Revenue", value: formatter.format(stats.total_revenue || 0), icon: IndianRupee },
    { label: "Users", value: stats.total_users || 0, icon: Users },
    { label: "Requirements", value: stats.total_requirements || 0, icon: ClipboardList },
    { label: "Pending Reviews", value: stats.pending_reviews || 0, icon: Star },
  ];

  if (loading) return <div className="p-20 text-center">Loading Admin Panel...</div>;

  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <ShieldAlert className="h-8 w-8 text-indigo-600 mr-2" /> Admin Control Center
            </h1>
            <p className="text-slate-500 mt-1">Verification, moderation, users, and revenue operations</p>
          </div>
          <Button variant="outline" onClick={refreshAll} disabled={busyId !== null}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg border bg-white p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-9 shrink-0 rounded-md px-4 text-sm font-medium ${
                activeTab === tab.id ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {statCards.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label}>
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">{item.label}</div>
                        <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Professionals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(dashboard?.top_professionals || []).map((pro: any) => (
                    <div key={pro.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-semibold">{pro.name}</div>
                        <Badge variant="outline" className="capitalize">{pro.role}</Badge>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <div>{pro.submitted_bids_count} bids</div>
                        <div>{pro.contact_unlocks_count} unlocks</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(dashboard?.recent_payments || []).map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-semibold">{payment.user?.name || "User"}</div>
                        <div className="text-sm text-slate-500 capitalize">{payment.purpose?.replaceAll("_", " ")}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatter.format(Number(payment.amount || 0))}</div>
                        <Badge variant={payment.status === "success" ? "default" : "secondary"}>{payment.status}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "verifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Verification Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingVerifications.length === 0 ? (
                <EmptyState text="No pending listings need review." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Business</th>
                        <th className="px-4 py-3">City</th>
                        <th className="px-4 py-3">Owner</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingVerifications.map((item: any) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-4 py-4 font-medium">{item.title}</td>
                          <td className="px-4 py-4">{item.city}</td>
                          <td className="px-4 py-4">{item.user?.email || "Unknown"}</td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => runAction(`approve-listing-${item.id}`, () => api.patch(`/admin/listings/${item.id}/verify`))}
                                disabled={busyId !== null}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => runAction(`reject-listing-${item.id}`, () => api.patch(`/admin/listings/${item.id}/reject`))}
                                disabled={busyId !== null}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle>User Management</CardTitle>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, or phone"
                  className="md:max-w-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <AdminTable
                headers={["User", "Role", "Verified", "Active", "Action"]}
                rows={users.map((item) => [
                  <div key="user">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-slate-500">{item.email}</div>
                  </div>,
                  <Badge key="role" variant="outline" className="capitalize">{item.role || "customer"}</Badge>,
                  <Badge key="verified" variant={item.is_verified ? "default" : "secondary"}>{item.verification_level || "unverified"}</Badge>,
                  <Badge key="active" variant={item.is_active ? "default" : "secondary"}>{item.is_active ? "Active" : "Disabled"}</Badge>,
                  <div key="actions" className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => runAction(`verify-user-${item.id}`, () => api.patch(`/admin/users/${item.id}/verify`))}>
                      <ShieldCheck className="h-4 w-4 mr-1" /> {item.is_verified ? "Unverify" : "Verify"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => runAction(`active-user-${item.id}`, () => api.patch(`/admin/users/${item.id}/toggle-active`))}>
                      {item.is_active ? "Disable" : "Enable"}
                    </Button>
                  </div>,
                ])}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "requirements" && (
          <Card>
            <CardHeader>
              <CardTitle>Requirement Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminTable
                headers={["Requirement", "Customer", "Status", "Bids", "Action"]}
                rows={requirements.map((item) => [
                  <div key="req">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-slate-500">{item.city}, {item.district}</div>
                  </div>,
                  <div key="customer">{item.user?.name || item.name || "Guest"}</div>,
                  <Badge key="status" variant={item.status === "open" ? "default" : "secondary"}>{item.status}</Badge>,
                  <div key="bids">{item.bids_count || 0}</div>,
                  <div key="actions" className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => runAction(`open-req-${item.id}`, () => api.patch(`/admin/requirements/${item.id}/status`, { status: "open" }))}>
                      Reopen
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => runAction(`close-req-${item.id}`, () => api.patch(`/admin/requirements/${item.id}/close`))}>
                      Expire
                    </Button>
                  </div>,
                ])}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "reviews" && (
          <Card>
            <CardHeader>
              <CardTitle>Review Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <EmptyState text="No pending reviews need moderation." />
              ) : (
                <AdminTable
                  headers={["Review", "Reviewer", "Rating", "Action"]}
                  rows={reviews.map((item) => [
                    <div key="review">
                      <div className="font-semibold">{item.title || "Untitled review"}</div>
                      <div className="text-slate-500 line-clamp-2">{item.body}</div>
                    </div>,
                    <div key="reviewer">{item.user?.name || "User"}</div>,
                    <div key="rating" className="font-semibold">{item.rating}/5</div>,
                    <div key="actions" className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => runAction(`approve-review-${item.id}`, () => api.patch(`/admin/reviews/${item.id}/approve`))} className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => runAction(`delete-review-${item.id}`, () => api.delete(`/admin/reviews/${item.id}`))} className="text-red-600">
                        Delete
                      </Button>
                    </div>,
                  ])}
                />
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "payments" && (
          <Card>
            <CardHeader>
              <CardTitle>Payments And Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminTable
                headers={["User", "Purpose", "Amount", "Status", "Date"]}
                rows={payments.map((item) => [
                  <div key="user">
                    <div className="font-semibold">{item.user?.name || "User"}</div>
                    <div className="text-slate-500">{item.user?.email}</div>
                  </div>,
                  <div key="purpose" className="capitalize">{item.purpose?.replaceAll("_", " ")}</div>,
                  <div key="amount" className="font-semibold">{formatter.format(Number(item.amount || 0))}</div>,
                  <Badge key="status" variant={item.status === "success" ? "default" : "secondary"}>{item.status}</Badge>,
                  <div key="date">{new Date(item.created_at).toLocaleDateString()}</div>,
                ])}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-12 text-center text-slate-500">
      <CheckCircle className="h-12 w-12 text-green-200 mx-auto mb-3" />
      {text}
    </div>
  );
}

function AdminTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) return <EmptyState text="No records found." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {headers.map((header, index) => (
              <th key={header} className={`px-4 py-3 ${index === headers.length - 1 ? "text-right" : ""}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b align-top">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`px-4 py-4 ${cellIndex === row.length - 1 ? "text-right" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
