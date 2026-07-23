"use client";

import React, { useState, useEffect } from "react";
import { TrueDialAPI } from "@/lib/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line 
} from "recharts";
import { 
  Eye, MousePointerClick, TrendingUp, TrendingDown, Clock, Activity, Users, MessageSquare 
} from "lucide-react";

export default function AnalyticsDashboard({ listingId }: { listingId?: number }) {
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const [overviewRes, chartRes] = await Promise.all([
          TrueDialAPI.getAnalyticsOverview(listingId, period),
          TrueDialAPI.getAnalyticsChart(listingId, period)
        ]);

        if (overviewRes.success) setData(overviewRes.data);
        if (chartRes.success) setChartData(chartRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [listingId, period]);

  const MetricCard = ({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend?: number }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : trend < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h4 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{value}</p>
    </div>
  );

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Loading analytics data...</div>;
  }

  if (!data || !data.current) {
    return <div className="p-8 text-center text-zinc-500">No analytics data available.</div>;
  }

  const { current, trends } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analytics Overview</h2>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Profile Views" 
          value={current.views || 0} 
          icon={<Eye className="w-5 h-5" />} 
          trend={trends.views} 
        />
        <MetricCard 
          title="Search Impressions" 
          value={current.search_impressions || 0} 
          icon={<Activity className="w-5 h-5" />} 
          trend={trends.search_impressions} 
        />
        <MetricCard 
          title="Customer Interactions" 
          value={(current.phone_clicks || 0) + (current.whatsapp_clicks || 0) + (current.website_clicks || 0) + (current.direction_clicks || 0)} 
          icon={<Users className="w-5 h-5" />} 
          trend={trends.phone_clicks} // rough proxy
        />
        <MetricCard 
          title="Offer Views" 
          value={current.offer_views || 0} 
          icon={<MousePointerClick className="w-5 h-5" />} 
          trend={trends.offer_views} 
        />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm mt-6">
        <h3 className="font-bold text-lg mb-6">Engagement Trends</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f4620" />
              <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => {
                const date = new Date(val);
                return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
              }} />
              <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" name="Profile Views" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Search Impressions" dataKey="search_impressions" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              <Line type="monotone" name="Total Interactions" dataKey="total_interactions" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deep Dive Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Interactions Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">Phone Calls</span>
              <span className="font-bold">{current.phone_clicks || 0}</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (current.phone_clicks || 0) / Math.max(1, (current.phone_clicks || 0) + (current.whatsapp_clicks || 0)) * 100)}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-zinc-600 dark:text-zinc-400">WhatsApp Messages</span>
              <span className="font-bold">{current.whatsapp_clicks || 0}</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, (current.whatsapp_clicks || 0) / Math.max(1, (current.phone_clicks || 0) + (current.whatsapp_clicks || 0)) * 100)}%` }}></div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-zinc-600 dark:text-zinc-400">Website Clicks</span>
              <span className="font-bold">{current.website_clicks || 0}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-zinc-600 dark:text-zinc-400">Get Directions</span>
              <span className="font-bold">{current.direction_clicks || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Content Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg"><Activity className="w-4 h-4"/></div>
                <span className="font-medium">Product Views</span>
              </div>
              <span className="font-bold text-lg">{current.product_views || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg"><Activity className="w-4 h-4"/></div>
                <span className="font-medium">Service Views</span>
              </div>
              <span className="font-bold text-lg">{current.service_views || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg"><MessageSquare className="w-4 h-4"/></div>
                <span className="font-medium">New Reviews</span>
              </div>
              <span className="font-bold text-lg">{current.review_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
