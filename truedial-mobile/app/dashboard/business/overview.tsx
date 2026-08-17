import React, { useState, useEffect, useCallback } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Users, Eye, Star, Trophy, ChevronRight } from 'lucide-react-native';

export default function BusinessOverviewScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      const [statRes, leadRes] = await Promise.all([
        api.get('/truedial/vendor/analytics/overview').catch(() => ({ data: { data: null } })),
        api.get('/truedial/vendor/crm/leads').catch(() => ({ data: { data: [] } }))
      ]);
      setStats(statRes.data?.data || statRes.data || { profile_views: 0, leads_generated: 0, avg_rating: 0 });
      const leadsData = leadRes.data?.data || leadRes.data || [];
      setLeads(Array.isArray(leadsData) ? leadsData.slice(0, 5) : []);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);
  const onRefresh = () => { setRefreshing(true); fetchOverview(); };

  const StatCard = ({ title, value, icon, bgClass, iconBgClass }: any) => (
    <View className={`w-[48%] bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 ${bgClass}`}>
      <View className={`w-10 h-10 rounded-xl items-center justify-center mb-3 ${iconBgClass}`}>
        {icon}
      </View>
      <Text className="text-[24px] font-extrabold text-slate-900 dark:text-white mb-1">{value}</Text>
      <Text className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">{title}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">Overview</Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#E8701A" className="mt-10" />
        ) : (
          <>
            {/* KPI Grid */}
            <View className="flex-row flex-wrap justify-between gap-y-3 mb-6">
              <StatCard title="Profile Views" value={stats?.profile_views || '0'} 
                icon={<Eye size={20} color="#3B82F6" />} iconBgClass="bg-blue-100 dark:bg-blue-900/30" bgClass="" />
              <StatCard title="Enquiries" value={stats?.leads_generated || stats?.enquiries || '0'} 
                icon={<Users size={20} color="#10B981" />} iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" bgClass="" />
              <StatCard title="Avg Rating" value={stats?.avg_rating || '0.0'} 
                icon={<Star size={20} color="#EAB308" />} iconBgClass="bg-yellow-100 dark:bg-yellow-900/30" bgClass="" />
              <StatCard title="This Month" value={stats?.monthly_views || stats?.profile_views || '0'} 
                icon={<Trophy size={20} color="#8B5CF6" />} iconBgClass="bg-purple-100 dark:bg-purple-900/30" bgClass="" />
            </View>

            {/* Quick Actions Grid */}
            <Text className="text-[18px] font-bold text-slate-900 dark:text-white mb-3 mt-2">Quick Actions</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              {[
                { title: 'Enquiries', icon: Users, color: '#10B981', bg: 'bg-emerald-50 dark:bg-emerald-900/30', route: '/dashboard/business/leads' },
                { title: 'Catalog', icon: Trophy, color: '#8B5CF6', bg: 'bg-purple-50 dark:bg-purple-900/30', route: '/dashboard/business/catalog' },
                { title: 'Offers', icon: Star, color: '#F59E0B', bg: 'bg-yellow-50 dark:bg-yellow-900/30', route: '/dashboard/business/offers' },
                { title: 'Marketing', icon: Eye, color: '#3B82F6', bg: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/business/marketing' },
                { title: 'Subscription', icon: Trophy, color: '#EC4899', bg: 'bg-pink-50 dark:bg-pink-900/30', route: '/dashboard/business/subscription' },
                { title: 'Profile', icon: Users, color: '#0F172A', bg: 'bg-slate-100 dark:bg-slate-800', route: '/dashboard/business/profile-edit' },
                { title: 'VIP Cards', icon: Trophy, color: '#E8701A', bg: 'bg-orange-50 dark:bg-orange-900/30', route: '/dashboard/business/privilege-cards' },
                { title: 'Academy', icon: Eye, color: '#06B6D4', bg: 'bg-cyan-50 dark:bg-cyan-900/30', route: '/dashboard/business/academy' },
                { title: 'AI Center', icon: Star, color: '#6366F1', bg: 'bg-indigo-50 dark:bg-indigo-900/30', route: '/dashboard/business/ai-center' }
              ].map((action, i) => (
                <TouchableOpacity 
                  key={i} 
                  className="w-[31%] bg-white dark:bg-slate-900 rounded-2xl p-3 mb-3 items-center border border-slate-200 dark:border-slate-800 shadow-sm"
                  onPress={() => router.push(action.route as any)}
                >
                  <View className={`w-10 h-10 rounded-xl items-center justify-center mb-2 ${action.bg}`}>
                    <action.icon size={20} color={action.color} />
                  </View>
                  <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center">{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recent Leads */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-[18px] font-bold text-slate-900 dark:text-white">Recent Leads</Text>
              <TouchableOpacity onPress={() => router.push('/dashboard/business/leads')}>
                <Text className="text-[14px] font-bold text-[#E8701A]">View All</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              {leads.length === 0 ? (
                <Text className="text-slate-400 text-center py-4">No leads yet.</Text>
              ) : (
                leads.map((lead, idx) => {
                  const isContacted = lead.status === 'Contacted';
                  const isConverted = lead.status === 'Converted';
                  const statusBg = isContacted ? 'bg-blue-100 dark:bg-blue-900/30' : isConverted ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30';
                  const statusColor = isContacted ? 'text-blue-600 dark:text-blue-400' : isConverted ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400';

                  return (
                    <TouchableOpacity 
                      key={lead.id} 
                      className={`flex-row items-center py-3 ${idx !== leads.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`} 
                      onPress={() => router.push('/dashboard/business/leads')}
                    >
                      <View className="flex-1">
                        <Text className="text-[15px] font-bold text-slate-900 dark:text-white">{lead.name || 'User'}</Text>
                        <Text className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">{lead.phone}</Text>
                      </View>
                      <View className={`px-2.5 py-1 rounded-full ${statusBg}`}>
                        <Text className={`text-[11px] font-extrabold tracking-wider uppercase ${statusColor}`}>{lead.status || 'New'}</Text>
                      </View>
                      <ChevronRight size={16} color="#94A3B8" className="ml-2 dark:text-slate-500" />
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
