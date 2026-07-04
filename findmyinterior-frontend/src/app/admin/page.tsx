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
import { VerificationAdminPanel } from "@/components/admin/VerificationAdminPanel";
import { LocationsAdminPanel } from "@/components/admin/LocationsAdminPanel";
import { SettingsAdminPanel } from "@/components/admin/SettingsAdminPanel";
import { CMSAdminPanel } from "@/components/admin/CMSAdminPanel";
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

type AdminTab = "overview" | "verifications" | "users" | "listings" | "requirements" | "reviews" | "payments" | "database" | "subscriptions" | "categories" | "cms" | "inquiries" | "locations" | "settings";

const tabs: { id: AdminTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "database", label: "Database Explorer" },
  { id: "verifications", label: "Verifications" },
  { id: "users", label: "Users" },
  { id: "listings", label: "Business Listings" },
  { id: "requirements", label: "Requirements" },
  { id: "reviews", label: "Reviews" },
  { id: "payments", label: "Payments" },
  { id: "subscriptions", label: "Plans" },
  { id: "categories", label: "Categories" },
  { id: "locations", label: "Locations" },
  { id: "settings", label: "Settings" },
  { id: "cms", label: "CMS" },
  { id: "inquiries", label: "Support" },
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
  const [listings, setListings] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [dbTables, setDbTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [dbData, setDbData] = useState<{ columns: string[], rows: any[] }>({ columns: [], rows: [] });
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState<"all" | "mock" | "real">("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [usersMeta, setUsersMeta] = useState<any>({});

  const isAdmin = user?.isAdmin || user?.role === "admin";

  const fetchDashboard = useCallback(async () => {
    const res = await api.get("/admin/dashboard");
    setDashboard(res.data.data);
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await api.get("/admin/users", {
      params: {
        search: search || undefined,
        filter: userFilter !== "all" ? userFilter : undefined,
      },
    });
    setUsers(res.data.data || []);
    setUsersMeta(res.data.meta || {});
  }, [search, userFilter]);

  const fetchListings = useCallback(async () => {
    try {
      const res = await api.get("/admin/listings");
      setListings(res.data.data || []);
    } catch (e) {}
  }, []);

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

  const fetchDbTables = useCallback(async () => {
    try {
      const res = await api.get("/admin/database/tables");
      setDbTables(res.data.data || []);
    } catch (e) { console.error(e); }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await api.get("/admin/inquiries");
      setInquiries(res.data.data || []);
    } catch (e) {}
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await api.get("/admin/blogs");
      setBlogs(res.data.data || []);
    } catch (e) {}
  }, []);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await api.get("/subscriptions/plans"); // reusing public endpoint
      setPlans(res.data.data || []);
    } catch (e) {}
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/categories"); // reusing public endpoint
      setCategories(res.data.data || []);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (selectedTable) {
      api.get(`/admin/database/query/${selectedTable}`).then(res => {
        setDbData({ columns: res.data.columns, rows: res.data.data });
      });
    }
  }, [selectedTable]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchDashboard(), fetchUsers(), fetchListings(), fetchRequirements(), fetchReviews(), fetchPayments(), fetchDbTables(), fetchInquiries(), fetchBlogs(), fetchPlans(), fetchCategories()]);
    } finally {
      setLoading(false);
    }
  }, [fetchDashboard, fetchPayments, fetchRequirements, fetchReviews, fetchUsers, fetchListings, fetchDbTables, fetchInquiries, fetchBlogs, fetchPlans, fetchCategories]);

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
          <VerificationAdminPanel />
        )}

        {activeTab === "locations" && <LocationsAdminPanel />}
        {activeTab === "settings" && <SettingsAdminPanel />}
        {activeTab === "cms" && <CMSAdminPanel />}

        {/* Database Explorer Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{usersMeta.real_count ?? "—"} Real</span>
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-medium">{usersMeta.mock_count ?? "—"} Mock</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, email, phone"
                      className="md:max-w-48 h-8 text-sm"
                    />
                    {/* Filter pills */}
                    {(["all", "real", "mock"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setUserFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          userFilter === f
                            ? f === "mock" ? "bg-orange-500 text-white" : "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                    {/* Purge mock users */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-8"
                      disabled={busyId === "purge-mock"}
                      onClick={() => {
                        if (!confirm(`Delete ALL ${usersMeta.mock_count} mock users permanently? This cannot be undone.`)) return;
                        runAction("purge-mock", () => api.delete("/admin/users/mock/purge"));
                      }}
                    >
                      🗑 Purge All Mock
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AdminTable
                headers={["User", "Role", "Verified", "Status", "Actions"]}
                rows={users.map((item) => [
                  <div key="user" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                      {item.avatar
                        ? <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                        : item.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        {item.name}
                        {item.is_mock && (
                          <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">MOCK</span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs">{item.email}</div>
                    </div>
                  </div>,
                  <div key="role" className="flex flex-wrap gap-1">
                    {(item.roles || []).map((r: any) => (
                      <Badge key={r.id} variant="outline" className="capitalize text-xs">{r.name || r.slug}</Badge>
                    ))}
                    {(!item.roles || item.roles.length === 0) && (
                      <Badge variant="outline" className="capitalize text-xs">customer</Badge>
                    )}
                  </div>,
                  <Badge key="verified" variant={item.verification_level === "verified_business" ? "default" : "secondary"} className="text-xs">
                    {item.verification_level?.replace("_", " ") || "basic"}
                  </Badge>,
                  <Badge key="active" variant={item.is_active ? "default" : "secondary"} className="text-xs">
                    {item.is_active ? "Active" : "Disabled"}
                  </Badge>,
                  <div key="actions" className="flex justify-end gap-1.5 flex-wrap">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => runAction(`verify-user-${item.id}`, () => api.patch(`/admin/users/${item.id}/verify`))}>
                      <ShieldCheck className="h-3 w-3 mr-1" />{item.is_verified ? "Unverify" : "Verify"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => runAction(`active-user-${item.id}`, () => api.patch(`/admin/users/${item.id}/toggle-active`))}>
                      {item.is_active ? <XCircle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                      {item.is_active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                      disabled={busyId === `delete-user-${item.id}`}
                      onClick={() => {
                        if (!confirm(`Permanently delete ${item.name}? This cannot be undone.`)) return;
                        runAction(`delete-user-${item.id}`, () => api.delete(`/admin/users/${item.id}`));
                      }}
                    >
                      Delete
                    </Button>
                  </div>,
                ])}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "listings" && (
          <Card>
            <CardHeader>
              <CardTitle>Business & Professional Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminTable
                headers={["Business Name", "Category", "Verification", "Views / Leads", "Action"]}
                rows={listings.map((item) => [
                  <div key="name">
                    <div className="font-semibold flex items-center gap-2">
                      {item.company_name || item.name}
                      {item.is_featured && <Badge className="bg-amber-500 text-[10px] px-1 py-0 h-4">Featured</Badge>}
                    </div>
                    <div className="text-slate-500 text-sm">by {item.user?.name}</div>
                  </div>,
                  <div key="category" className="capitalize">
                    {item.category?.name || item.role}
                    <div className="text-xs text-slate-400">{item.city}</div>
                  </div>,
                  <Badge key="status" variant={item.is_verified ? "default" : "secondary"}>
                    {item.is_verified ? "Verified" : "Pending"}
                  </Badge>,
                  <div key="metrics" className="text-sm">
                    {item.view_count || 0} / {item.lead_count || 0}
                  </div>,
                  <div key="actions" className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => runAction(`feat-list-${item.id}`, () => api.patch(`/admin/listings/${item.id}/feature`))}>
                      <Star className="h-3 w-3 mr-1" />{item.is_featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button size="sm" onClick={() => runAction(`verify-list-${item.id}`, () => api.patch(`/admin/listings/${item.id}/verify`))} className={item.is_verified ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}>
                      {item.is_verified ? "Unverify" : "Verify"}
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
                headers={["Requirement", "Customer", "Unlock Price", "Status", "Bids", "Action"]}
                rows={requirements.map((item) => [
                  <div key="req">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-slate-500">{item.city}, {item.district}</div>
                  </div>,
                  <div key="customer">{item.user?.name || item.name || "Guest"}</div>,
                  <div key="price" className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">₹{item.unlock_price || "49 (Def)"}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-indigo-600" onClick={() => {
                      const p = prompt('Enter new Unlock Price (leave empty for default ₹49)', item.unlock_price || '');
                      if (p !== null) {
                        runAction(`price-req-${item.id}`, () => api.patch(`/admin/requirements/${item.id}/price`, { unlock_price: p || null }));
                      }
                    }}>✏️</Button>
                  </div>,
                  <Badge key="status" variant={item.status === "open" ? "default" : item.status === "pending" ? "destructive" : "secondary"} className="capitalize">{item.status}</Badge>,
                  <div key="bids">{item.bids_count || 0}</div>,
                  <div key="actions" className="flex justify-end gap-2">
                    {item.status === "pending" ? (
                      <>
                        <Button size="sm" onClick={() => runAction(`approve-req-${item.id}`, () => api.patch(`/admin/requirements/${item.id}/approve`))} className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => runAction(`reject-req-${item.id}`, () => api.patch(`/admin/requirements/${item.id}/reject`))} className="text-red-600 border-red-200 hover:bg-red-50">
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => runAction(`open-req-${item.id}`, () => api.patch(`/admin/requirements/${item.id}/status`, { status: "open" }))}>
                          Reopen
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => runAction(`close-req-${item.id}`, () => api.patch(`/admin/requirements/${item.id}/close`))}>
                          Expire
                        </Button>
                      </>
                    )}
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

        {activeTab === "database" && (
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 rounded-t-lg">
              <CardTitle className="text-red-700 flex items-center">
                <ShieldAlert className="mr-2 h-5 w-5" /> God Mode: Database Explorer
              </CardTitle>
              <p className="text-sm text-red-600">Direct, unfiltered access to production tables. Use with extreme caution.</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Select Table</label>
                <select 
                  className="w-full max-w-md p-2 border rounded-md"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                >
                  <option value="">-- Choose Table --</option>
                  {dbTables.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {selectedTable && dbData.columns.length > 0 && (
                <div className="overflow-x-auto border rounded-lg max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10 shadow-sm">
                      <tr>
                        {dbData.columns.map(col => <th key={col} className="px-4 py-3 font-semibold">{col}</th>)}
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbData.rows.map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50">
                          {dbData.columns.map(col => (
                            <td key={col} className="px-4 py-3 max-w-[200px] truncate" title={String(row[col])}>
                              {row[col] === null ? <span className="text-slate-400 italic">null</span> : String(row[col])}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-right">
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => {
                                if(confirm('DELETE FOREVER?')) {
                                  runAction(`del-row-${row.id}`, () => api.delete(`/admin/database/query/${selectedTable}/${row.id}`));
                                  setTimeout(() => setSelectedTable(selectedTable), 500); // trigger re-fetch
                                }
                              }}
                            >
                              Drop
                            </Button>
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

        {activeTab === "inquiries" && (
          <Card>
            <CardHeader>
              <CardTitle>Support Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminTable
                headers={["Customer", "Subject", "Message", "Status", "Action"]}
                rows={inquiries.map((item) => [
                  <div key="cust">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-slate-500">{item.email}</div>
                  </div>,
                  <div key="subj" className="font-medium">{item.subject}</div>,
                  <div key="msg" className="max-w-xs truncate">{item.message}</div>,
                  <Badge key="status" variant={item.status === 'resolved' ? 'default' : 'secondary'}>{item.status}</Badge>,
                  <div key="actions" className="flex justify-end gap-2">
                    {item.status !== 'resolved' && (
                      <Button size="sm" onClick={() => runAction(`res-inq-${item.id}`, () => api.patch(`/admin/inquiries/${item.id}/resolve`))}>
                        Resolve
                      </Button>
                    )}
                  </div>
                ])}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "cms" && (
          <Card>
            <CardHeader>
              <CardTitle>Content Management (Blogs)</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminTable
                headers={["Title", "Author", "Status", "Published", "Action"]}
                rows={blogs.map((item) => [
                  <div key="title" className="font-semibold">{item.title}</div>,
                  <div key="author">{item.author?.name}</div>,
                  <Badge key="status" variant={item.status === 'published' ? 'default' : 'secondary'}>{item.status}</Badge>,
                  <div key="date">{item.published_at ? new Date(item.published_at).toLocaleDateString() : '-'}</div>,
                  <div key="actions" className="flex justify-end gap-2">
                    <Button size="sm" variant="destructive" onClick={() => runAction(`del-blog-${item.id}`, () => api.delete(`/admin/blogs/${item.id}`))}>
                      Delete
                    </Button>
                  </div>
                ])}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "subscriptions" && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminTable
                headers={["Plan Name", "Monthly (₹)", "Yearly (₹)", "Active", "Action"]}
                rows={plans.map((item) => [
                  <div key="name" className="font-semibold capitalize">{item.name}</div>,
                  <div key="month">{item.price_monthly}</div>,
                  <div key="year">{item.price_yearly}</div>,
                  <Badge key="status" variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Disabled'}</Badge>,
                  <div key="actions" className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      const p = prompt('Enter new Monthly Price', item.price_monthly);
                      if (p) runAction(`edit-plan-${item.id}`, () => api.post(`/admin/subscription-plans/${item.id}`, { price_monthly: p }));
                    }}>
                      Edit Price
                    </Button>
                  </div>
                ])}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "categories" && (
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-right">
                <Button onClick={() => {
                  const n = prompt('New Category Name?');
                  if (n) runAction('new-cat', () => api.post('/admin/categories', { name: n }));
                }}>+ Add Category</Button>
              </div>
              <AdminTable
                headers={["Name", "Slug", "Action"]}
                rows={categories.map((item) => [
                  <div key="name" className="font-semibold">{item.name}</div>,
                  <div key="slug" className="text-slate-500">{item.slug}</div>,
                  <div key="actions" className="flex justify-end gap-2">
                    <Button size="sm" variant="destructive" onClick={() => runAction(`del-cat-${item.id}`, () => api.delete(`/admin/categories/${item.id}`))}>
                      Delete
                    </Button>
                  </div>
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
