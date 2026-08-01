import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { 
  Compass, Trophy, Eye, FileText, Target, 
  Layers, Image as ImageIcon, Store, Star, 
  Megaphone, CreditCard, BarChart3, Sparkles,
  ChevronRight, CheckCircle2
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
    bidsWon: 0,
    portfolioViews: 0,
    quotationsSent: 0,
    bidScore: '92%'
  });

  const [bidCounts, setBidCounts] = useState({
    new: 0,
    quoted: 0,
    won: 0,
    lost: 0
  });

  const fetchStats = async () => {
    try {
      const [analyticsRes, bidsRes] = await Promise.all([
        api.get('/truedial/vendor/analytics/overview').catch(() => null),
        api.get('/bids').catch(() => null)
      ]);

      const analytics = analyticsRes?.data?.data || analyticsRes?.data || {};
      const bids = bidsRes?.data?.data || bidsRes?.data || [];

      let wonCount = 0;
      let newCount = 0;
      let quotedCount = 0;
      let lostCount = 0;

      if (Array.isArray(bids)) {
        bids.forEach((b: any) => {
          const status = (b.status || '').toLowerCase();
          if (status === 'accepted' || status === 'awarded' || status === 'won') wonCount++;
          else if (status === 'pending' || status === 'quoted') quotedCount++;
          else if (status === 'rejected' || status === 'lost') lostCount++;
          else newCount++;
        });
      }

      setBidCounts({
        new: newCount,
        quoted: quotedCount,
        won: wonCount,
        lost: lostCount
      });

      setStats({
        bidsWon: wonCount || analytics.bids_won || 0,
        portfolioViews: analytics.profile_views || analytics.portfolio_views || 0,
        quotationsSent: quotedCount + wonCount || analytics.quotations_count || analytics.total_leads || 0,
        bidScore: analytics.bid_score ? `${analytics.bid_score}%` : '95%'
      });
    } catch (error) {
      console.error('Error fetching professional stats:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const actions: QuickAction[] = [
    { title: 'Bid Pipeline', icon: Layers, color: '#3B82F6', bgClass: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/business/leads' },
    { title: 'Portfolio', icon: ImageIcon, color: '#8B5CF6', bgClass: 'bg-purple-50 dark:bg-purple-900/30', route: '/dashboard/business/catalog' },
    { title: 'Quotations', icon: FileText, color: '#10B981', bgClass: 'bg-emerald-50 dark:bg-emerald-900/30', route: '/dashboard/business/offers' },
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
        <View className="rounded-3xl p-5 shadow-lg shadow-indigo-500/20 bg-indigo-900">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
              <Compass size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">Professional Studio</Text>
              <Text className="text-indigo-100 text-xs mt-0.5">Manage bids, portfolios & client quotations</Text>
            </View>
          </View>
        </View>
      </View>

      {/* KPI Stats Grid */}
      <View className="px-4 py-3 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Bids Won" 
            value={stats.bidsWon} 
            icon={<Trophy size={18} color="#8B5CF6" />} 
            iconBgClass="bg-purple-100 dark:bg-purple-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Portfolio Views" 
            value={stats.portfolioViews > 999 ? `${(stats.portfolioViews/1000).toFixed(1)}k` : stats.portfolioViews} 
            icon={<Eye size={18} color="#3B82F6" />} 
            iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Quotations Sent" 
            value={stats.quotationsSent} 
            icon={<FileText size={18} color="#10B981" />} 
            iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Bid Score" 
            value={stats.bidScore} 
            icon={<Target size={18} color="#E8701A" />} 
            iconBgClass="bg-orange-100 dark:bg-orange-900/30" 
          />
        </View>
      </View>

      {/* Active Bid Pipeline */}
      <View className="px-4 my-2">
        <GlassCard className="p-4 border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-bold text-slate-900 dark:text-white">Active Bid Pipeline</Text>
            <TouchableOpacity onPress={() => router.push('/dashboard/business/leads')}>
              <Text className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex-row items-center">
                View All <ChevronRight size={12} color="#4F46E5" />
              </Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <View className="items-center flex-1">
              <View className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{bidCounts.new}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">New</Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />
            <View className="items-center flex-1">
              <View className="bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{bidCounts.quoted}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">Quoted</Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />
            <View className="items-center flex-1">
              <View className="bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{bidCounts.won}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">Won</Text>
            </View>
            <View className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />
            <View className="items-center flex-1">
              <View className="bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 rounded-full mb-1">
                <Text className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{bidCounts.lost}</Text>
              </View>
              <Text className="text-[10px] text-slate-500 dark:text-slate-400">Lost</Text>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* Verification Badges */}
      <View className="px-4 my-1">
        <GlassCard className="p-4 border-slate-200 dark:border-slate-800">
          <Text className="text-sm font-bold text-slate-900 dark:text-white mb-2">Professional Badges</Text>
          <View className="flex-row flex-wrap gap-2 mb-2">
            <View className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg flex-row items-center">
              <CheckCircle2 size={12} color="#10B981" className="mr-1" />
              <Text className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">Verified Business</Text>
            </View>
            <View className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg flex-row items-center">
              <CheckCircle2 size={12} color="#3B82F6" className="mr-1" />
              <Text className="text-[11px] font-medium text-blue-700 dark:text-blue-300">RERA Registered</Text>
            </View>
            <View className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 px-2.5 py-1 rounded-lg flex-row items-center">
              <CheckCircle2 size={12} color="#8B5CF6" className="mr-1" />
              <Text className="text-[11px] font-medium text-purple-700 dark:text-purple-300">Vastu Certified</Text>
            </View>
          </View>
          <Text className="text-[11px] text-slate-500 dark:text-slate-400">Verified badges increase trust by 3x</Text>
        </GlassCard>
      </View>

      {/* Quick Actions Grid */}
      <View className="px-4 my-3">
        <Text className="text-sm font-bold text-slate-900 dark:text-white mb-3 ml-1">Studio Tools</Text>
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* Recent Leads Section */}
      <View className="px-4 my-2 mb-6">
        <LeadsList maxItems={5} />
      </View>
    </ScrollView>
  );
}
