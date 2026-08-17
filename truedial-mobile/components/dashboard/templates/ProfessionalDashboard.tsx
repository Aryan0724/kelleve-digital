import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { 
  Eye, Star, Users, BarChart3, MessageSquare,
  Store, Megaphone, CreditCard, Sparkles,
  ChevronRight, CheckCircle2, TrendingUp, Target
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import StatCard from '../StatCard';
import QuickActionGrid, { QuickAction } from '../QuickActionGrid';
import LeadsList from '../LeadsList';
import GlassCard from '../../GlassCard';
import api from '../../../services/api';
import { useAuth } from '../../../context/auth';

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    profileViews: 0,
    enquiriesReceived: 0,
    avgRating: '0.0',
    profileScore: '85%'
  });

  const [enquiryCounts, setEnquiryCounts] = useState({
    newCount: 0,
    contacted: 0,
    converted: 0,
    closed: 0
  });

  const fetchStats = async () => {
    try {
      const [analyticsRes, leadsRes] = await Promise.all([
        api.get('/truedial/vendor/analytics/overview').catch(() => null),
        api.get('/truedial/vendor/crm/leads').catch(() => null)
      ]);

      const analytics = analyticsRes?.data?.data || analyticsRes?.data || {};
      const leads = leadsRes?.data?.data || leadsRes?.data || [];

      let newC = 0, contactedC = 0, convertedC = 0, closedC = 0;

      if (Array.isArray(leads)) {
        leads.forEach((l: any) => {
          const status = (l.status || '').toLowerCase();
          if (status === 'converted' || status === 'won') convertedC++;
          else if (status === 'contacted' || status === 'in_progress') contactedC++;
          else if (status === 'closed' || status === 'lost') closedC++;
          else newC++;
        });
      }

      setEnquiryCounts({ newCount: newC, contacted: contactedC, converted: convertedC, closed: closedC });

      setStats({
        profileViews: analytics.profile_views || 0,
        enquiriesReceived: Array.isArray(leads) ? leads.length : (analytics.total_leads || 0),
        avgRating: analytics.avg_rating ? parseFloat(String(analytics.avg_rating)).toFixed(1) : '0.0',
        profileScore: analytics.profile_score ? `${analytics.profile_score}%` : '85%'
      });
    } catch (error) {
      console.error('Error fetching business stats:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchStats(); }, []);

  const actions: QuickAction[] = [
    { title: 'Enquiries', icon: MessageSquare, color: '#3B82F6', bgClass: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/business/leads' },
    { title: 'Catalog', icon: Store, color: '#8B5CF6', bgClass: 'bg-purple-50 dark:bg-purple-900/30', route: '/dashboard/business/catalog' },
    { title: 'Offers', icon: CreditCard, color: '#10B981', bgClass: 'bg-emerald-50 dark:bg-emerald-900/30', route: '/dashboard/business/offers' },
    { title: 'Edit Profile', icon: Store, color: '#E8701A', bgClass: 'bg-orange-50 dark:bg-orange-900/30', route: '/dashboard/business/profile-edit' },
    { title: 'Reviews', icon: Star, color: '#EAB308', bgClass: 'bg-yellow-50 dark:bg-yellow-900/30', route: '/dashboard/business/reviews' },
    { title: 'Marketing', icon: Megaphone, color: '#06B6D4', bgClass: 'bg-cyan-50 dark:bg-cyan-900/30', route: '/dashboard/business/marketing' },
    { title: 'VIP Cards', icon: CreditCard, color: '#F59E0B', bgClass: 'bg-amber-50 dark:bg-amber-900/30', route: '/dashboard/business/privilege-cards' },
    { title: 'Analytics', icon: BarChart3, color: '#6366F1', bgClass: 'bg-indigo-50 dark:bg-indigo-900/30', route: '/dashboard/business/analytics' },
    { title: 'AI Center', icon: Sparkles, color: '#EC4899', bgClass: 'bg-pink-50 dark:bg-pink-900/30', route: '/dashboard/business/ai-center' },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Hero Banner */}
      <View className="px-4 pt-4 pb-2">
        <View className="rounded-3xl p-5 shadow-lg" style={{ backgroundColor: '#9a3412' }}>
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">Business Dashboard</Text>
              <Text className="text-orange-100 text-xs mt-0.5">Manage listings, leads & business growth</Text>
            </View>
          </View>
        </View>
      </View>

      {/* KPI Stats Grid */}
      <View className="px-4 py-3 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Profile Views" 
            value={stats.profileViews > 999 ? `${(stats.profileViews / 1000).toFixed(1)}k` : stats.profileViews} 
            icon={<Eye size={18} color="#3B82F6" />} 
            iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Enquiries Received" 
            value={stats.enquiriesReceived} 
            icon={<Users size={18} color="#10B981" />} 
            iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Avg Rating" 
            value={stats.avgRating} 
            icon={<Star size={18} color="#EAB308" />} 
            iconBgClass="bg-yellow-100 dark:bg-yellow-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Profile Score" 
            value={stats.profileScore} 
            icon={<Target size={18} color="#E8701A" />} 
            iconBgClass="bg-orange-100 dark:bg-orange-900/30" 
          />
        </View>
      </View>

      {/* Enquiry Pipeline */}
      <View className="px-4 my-2">
        <GlassCard className="p-4 border-orange-100 dark:border-orange-900/40" style={{ backgroundColor: 'rgba(255, 247, 237, 0.5)' }}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-900 dark:text-white">Enquiry Pipeline</Text>
            <TouchableOpacity onPress={() => router.push('/dashboard/business/leads' as any)}>
              <Text className="text-xs font-bold text-orange-600 dark:text-orange-400">View All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <View className="items-center flex-1">
              <View className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{enquiryCounts.newCount}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">New</Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />
            <View className="items-center flex-1">
              <View className="bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{enquiryCounts.contacted}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">Contacted</Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />
            <View className="items-center flex-1">
              <View className="bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{enquiryCounts.converted}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">Converted</Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />
            <View className="items-center flex-1">
              <View className="bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{enquiryCounts.closed}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">Closed</Text>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* Trust Badges */}
      <View className="px-4 my-1">
        <GlassCard className="p-4 border-slate-200 dark:border-slate-800">
          <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Trust Badges</Text>
          <View className="flex-row flex-wrap gap-2 mb-2">
            <View className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg flex-row items-center">
              <CheckCircle2 size={12} color="#10B981" />
              <Text className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 ml-1">Verified Business</Text>
            </View>
            <View className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg flex-row items-center">
              <CheckCircle2 size={12} color="#3B82F6" />
              <Text className="text-[11px] font-medium text-blue-700 dark:text-blue-300 ml-1">GST Registered</Text>
            </View>
            <View className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 px-2.5 py-1 rounded-lg flex-row items-center">
              <CheckCircle2 size={12} color="#8B5CF6" />
              <Text className="text-[11px] font-medium text-purple-700 dark:text-purple-300 ml-1">Top Rated</Text>
            </View>
          </View>
          <Text className="text-[11px] text-slate-500 dark:text-slate-400">Verified badges increase customer trust by 3x</Text>
        </GlassCard>
      </View>

      {/* Quick Actions Grid */}
      <View className="px-4 my-3">
        <Text className="text-sm font-bold text-slate-900 dark:text-white mb-3 ml-1">Business Tools</Text>
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* Recent Leads Section */}
      <View className="px-4 my-2 mb-6">
        <LeadsList maxItems={5} />
      </View>
    </ScrollView>
  );
}
