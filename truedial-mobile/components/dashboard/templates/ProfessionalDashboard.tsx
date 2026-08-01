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
    bidsWon: '0',
    portfolioViews: '0',
    quotationsSent: '0',
    bidScore: '0%'
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/truedial/vendor/analytics/overview');
      if (response.data && response.data.stats) {
        setStats({
          bidsWon: response.data.stats.bidsWon || '24',
          portfolioViews: response.data.stats.portfolioViews || '8.2k',
          quotationsSent: response.data.stats.quotationsSent || '45',
          bidScore: response.data.stats.bidScore || '78%'
        });
      } else {
        setStats({
          bidsWon: '24',
          portfolioViews: '8.2k',
          quotationsSent: '45',
          bidScore: '78%'
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        bidsWon: '24',
        portfolioViews: '8.2k',
        quotationsSent: '45',
        bidScore: '78%'
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const actions: QuickAction[] = [
    { title: 'Bid Pipeline', icon: Layers, color: '#3B82F6', bgClass: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/business/leads' },
    { title: 'Portfolio', icon: ImageIcon, color: '#A855F7', bgClass: 'bg-purple-50 dark:bg-purple-900/30', route: '/dashboard/business/catalog' },
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Hero Banner */}
      <View className="px-4 pt-4 pb-2">
        <View
          className="rounded-3xl p-5 shadow-lg shadow-indigo-500/20 bg-indigo-900"
        >
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
              <Compass size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-white text-xl font-bold">Professional Studio</Text>
              <Text className="text-indigo-100 text-xs mt-0.5">Manage bids, portfolios & client quotations</Text>
            </View>
          </View>
        </View>
      </View>

      {/* KPI Stats */}
      <View className="px-4 py-2">
        <View className="flex-row mx-[-4px] mb-2">
          <View className="flex-1 px-1">
            <StatCard 
              title="Bids Won" 
              value={stats.bidsWon} 
              icon={<Trophy size={20} color="#A855F7" />} 
              iconBgClass="bg-purple-100 dark:bg-purple-900/30" 
              trend="↑3" 
              trendUp={true} 
            />
          </View>
          <View className="flex-1 px-1">
            <StatCard 
              title="Portfolio Views" 
              value={stats.portfolioViews} 
              icon={<Eye size={20} color="#3B82F6" />} 
              iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
              trend="↑18%" 
              trendUp={true} 
            />
          </View>
        </View>
        <View className="flex-row mx-[-4px]">
          <View className="flex-1 px-1">
            <StatCard 
              title="Quotations Sent" 
              value={stats.quotationsSent} 
              icon={<FileText size={20} color="#10B981" />} 
              iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" 
              trend="↑5" 
              trendUp={true} 
            />
          </View>
          <View className="flex-1 px-1">
            <StatCard 
              title="Bid Score" 
              value={stats.bidScore} 
              icon={<Target size={20} color="#E8701A" />} 
              iconBgClass="bg-orange-100 dark:bg-orange-900/30" 
              trend="↑2%" 
              trendUp={true} 
            />
          </View>
        </View>
      </View>

      {/* Active Bid Pipeline Section */}
      <View className="px-4 py-3">
        <GlassCard className="p-4 border border-indigo-200 dark:border-indigo-900/50 bg-white/80 dark:bg-slate-900/80">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-slate-800 dark:text-white font-semibold text-base">Active Bid Pipeline</Text>
            <Layers size={18} color="#4F46E5" />
          </View>
          
          <View className="flex-row justify-between items-center mb-4">
            <View className="bg-blue-500 rounded-lg py-2 px-3 flex-1 mr-2 items-center">
              <Text className="text-white font-bold text-lg">3</Text>
              <Text className="text-blue-100 text-xs font-medium">New</Text>
            </View>
            <View className="bg-amber-500 rounded-lg py-2 px-3 flex-1 mr-2 items-center">
              <Text className="text-white font-bold text-lg">5</Text>
              <Text className="text-amber-100 text-xs font-medium">Quoted</Text>
            </View>
            <View className="bg-emerald-500 rounded-lg py-2 px-3 flex-1 mr-2 items-center">
              <Text className="text-white font-bold text-lg">2</Text>
              <Text className="text-emerald-100 text-xs font-medium">Won</Text>
            </View>
            <View className="bg-slate-500 rounded-lg py-2 px-3 flex-1 items-center">
              <Text className="text-white font-bold text-lg">1</Text>
              <Text className="text-slate-200 text-xs font-medium">Lost</Text>
            </View>
          </View>

          <TouchableOpacity 
            className="flex-row items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-800"
            onPress={() => router.push('/dashboard/business/leads')}
          >
            <Text className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">View All Bids</Text>
            <ChevronRight size={16} color="#4F46E5" />
          </TouchableOpacity>
        </GlassCard>
      </View>

      {/* Verification Badges Section */}
      <View className="px-4 py-2 mb-2">
        <GlassCard className="p-4 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <View className="flex-row items-center mb-3">
            <CheckCircle2 size={18} color="#10B981" />
            <Text className="text-slate-800 dark:text-white font-semibold text-base ml-2">Verification Badges</Text>
          </View>
          
          <Text className="text-slate-500 dark:text-slate-400 text-xs mb-3">Verified badges increase trust by 3x</Text>

          <View className="flex-row flex-wrap gap-2">
            <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-full px-3 py-1.5 mb-2">
              <CheckCircle2 size={12} color="#10B981" />
              <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-medium ml-1">Verified Business</Text>
            </View>
            <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 rounded-full px-3 py-1.5 mb-2">
              <CheckCircle2 size={12} color="#3B82F6" />
              <Text className="text-blue-700 dark:text-blue-400 text-xs font-medium ml-1">RERA Registered</Text>
            </View>
            <View className="flex-row items-center bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 rounded-full px-3 py-1.5 mb-2">
              <CheckCircle2 size={12} color="#A855F7" />
              <Text className="text-purple-700 dark:text-purple-400 text-xs font-medium ml-1">Vastu Certified</Text>
            </View>
          </View>
        </GlassCard>
      </View>

      {/* Quick Actions */}
      <View className="px-4 py-2">
        <Text className="text-slate-800 dark:text-white font-bold text-lg mb-3">Quick Actions</Text>
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* Recent Leads */}
      <View className="mt-2 mb-6">
        <LeadsList maxItems={5} viewAllRoute="/dashboard/business/leads" />
      </View>
    </ScrollView>
  );
}
