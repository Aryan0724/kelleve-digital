"use client";

import React, { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, Eye, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await TrueDialAPI.getAnalyticsOverview();
      if (res.success && res.data) {
        // The API returns { current: { metrics }, previous: { metrics }, trends: { metrics } }
        // We'll just map the current metrics to the overview state.
        setOverview(res.data.current || res.data); 
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#E8701A]" />
      </div>
    );
  }

  const defaultOverview = overview || {
    profile_views: 0,
    search_appearances: 0,
    leads_generated: 0,
    card_uses: 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your business performance, views, and lead generation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-200">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{defaultOverview.profile_views}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total views this month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-200">Search Appearances</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#E8701A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{defaultOverview.search_appearances}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Times shown in search</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-200">Leads Generated</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{defaultOverview.leads_generated}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Customer contacts made</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-200">Privilege Card Uses</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{defaultOverview.card_uses}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Discounts claimed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white dark:bg-[#0a1c3a]/50 dark:border dark:border-white/10 mt-8">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Performance Chart</CardTitle>
          <CardDescription>Views and engagement over the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center border-t border-slate-100 dark:border-slate-800/50 mt-4">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <BarChart3 className="mx-auto h-12 w-12 mb-2 opacity-20" />
            <p>Chart visualization will populate once sufficient data is gathered.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
