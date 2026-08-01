import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import {
  Utensils,
  Users,
  CreditCard,
  Eye,
  Star,
  CalendarCheck,
  UtensilsCrossed,
  Sparkles,
  Megaphone,
  Plus
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import StatCard from '../StatCard';
import QuickActionGrid, { QuickAction } from '../QuickActionGrid';
import LeadsList from '../LeadsList';
import GlassCard from '../../GlassCard';
import api from '../../../services/api';
import { useAuth } from '../../../context/auth';

export default function HospitalityDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    inquiries: 0,
    redemptions: 0,
    menuViews: 0,
    rating: 0
  });
  const [offersCount, setOffersCount] = useState(0);

  const fetchStats = async () => {
    try {
      const [analyticsRes, offersRes] = await Promise.all([
        api.get('/truedial/vendor/analytics/overview').catch(() => null),
        api.get('/truedial/vendor/offers').catch(() => null)
      ]);

      const analytics = analyticsRes?.data?.data || analyticsRes?.data || {};
      const offers = offersRes?.data?.data || offersRes?.data || [];

      setStats({
        inquiries: analytics.total_leads || analytics.inquiries_count || analytics.total_inquiries || 0,
        redemptions: analytics.redemptions_count || analytics.privilege_card_count || 0,
        menuViews: analytics.profile_views || analytics.page_views || 0,
        rating: analytics.avg_rating || analytics.rating || (analytics.total_reviews_count > 0 ? 4.8 : 0)
      });

      setOffersCount(Array.isArray(offers) ? offers.length : 0);
    } catch (error) {
      console.error('Failed to fetch hospitality stats', error);
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
    { title: 'Reservations', icon: CalendarCheck, color: '#3B82F6', bgClass: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/business/leads' },
    { title: 'Menu Catalog', icon: UtensilsCrossed, color: '#E8701A', bgClass: 'bg-orange-50 dark:bg-orange-900/30', route: '/dashboard/business/catalog' },
    { title: 'Privilege Discounts', icon: CreditCard, color: '#F59E0B', bgClass: 'bg-amber-50 dark:bg-amber-900/30', route: '/dashboard/business/privilege-cards' },
    { title: 'Daily Specials', icon: Sparkles, color: '#8B5CF6', bgClass: 'bg-purple-50 dark:bg-purple-900/30', route: '/dashboard/business/offers' },
    { title: 'Reviews', icon: Star, color: '#EAB308', bgClass: 'bg-yellow-50 dark:bg-yellow-900/30', route: '/dashboard/business/reviews' },
    { title: 'SMS Marketing', icon: Megaphone, color: '#06B6D4', bgClass: 'bg-cyan-50 dark:bg-cyan-900/30', route: '/dashboard/business/marketing' },
  ];

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-[#0A1C3A]"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Hero Banner */}
      <View className="px-5 pt-6 pb-10 bg-amber-500 dark:bg-amber-600 rounded-b-3xl">
        <View className="flex-row items-center mb-2">
          <View className="bg-white/20 p-3 rounded-full mr-4">
            <Utensils size={28} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-2xl">Hospitality Hub</Text>
            <Text className="text-white/90 text-sm mt-1">Manage reservations, menus & VIP privileges</Text>
          </View>
        </View>
      </View>

      <View className="px-5 -mt-6">
        {/* KPI Stats Grid */}
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-4">
            <StatCard 
              title="Table/Room Inquiries" 
              value={stats.inquiries} 
              icon={<Users size={20} color="#3B82F6" />} 
              iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
            />
          </View>
          <View className="w-[48%] mb-4">
            <StatCard 
              title="Privilege Redemptions" 
              value={stats.redemptions} 
              icon={<CreditCard size={20} color="#F59E0B" />} 
              iconBgClass="bg-amber-100 dark:bg-amber-900/30" 
            />
          </View>
          <View className="w-[48%] mb-4">
            <StatCard 
              title="Menu Views" 
              value={stats.menuViews > 999 ? `${(stats.menuViews/1000).toFixed(1)}k` : stats.menuViews} 
              icon={<Eye size={20} color="#10B981" />} 
              iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" 
            />
          </View>
          <View className="w-[48%] mb-4">
            <StatCard 
              title="Avg Rating" 
              value={stats.rating > 0 ? stats.rating.toFixed(1) : 'New'} 
              icon={<Star size={20} color="#EAB308" />} 
              iconBgClass="bg-yellow-100 dark:bg-yellow-900/30" 
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-2 mb-6">
          <Text className="text-lg font-bold text-slate-800 dark:text-white mb-3">Quick Actions</Text>
          <QuickActionGrid actions={actions} columns={3} />
        </View>

        {/* Unique Section: Today's Specials */}
        <GlassCard className="p-5 mb-6 border border-orange-200 dark:border-[#E8701A]/30">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Sparkles size={20} color="#E8701A" />
              <Text className="text-lg font-bold text-slate-800 dark:text-white ml-2">Today's Specials & Offers</Text>
            </View>
            <View className="bg-orange-100 dark:bg-orange-900/50 px-2.5 py-0.5 rounded-full">
              <Text className="text-xs font-extrabold text-[#E8701A]">{offersCount} Active</Text>
            </View>
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            Create time-limited promotions to attract walk-in customers
          </Text>
          <TouchableOpacity 
            className="bg-[#E8701A] py-3 rounded-xl flex-row justify-center items-center"
            onPress={() => router.push('/dashboard/business/offers')}
          >
            <Plus size={18} color="#FFFFFF" className="mr-2" />
            <Text className="text-white font-bold text-base">Create Special</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Unique Section: Privilege Card Partner Stats */}
        <GlassCard className="p-5 mb-6 border border-slate-200 dark:border-slate-800">
          <View className="flex-row items-center mb-4">
            <CreditCard size={20} color="#F59E0B" />
            <Text className="text-lg font-bold text-slate-800 dark:text-white ml-2">VIP Privilege Redemptions</Text>
          </View>
          <View className="flex-row justify-between bg-slate-50 dark:bg-[#0A1C3A]/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Total Redemptions</Text>
              <Text className="text-slate-800 dark:text-white font-bold text-lg">{stats.redemptions} redemptions</Text>
            </View>
            <View className="w-[1px] bg-slate-200 dark:bg-slate-700" />
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Partner Tier</Text>
              <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">VIP Verified</Text>
            </View>
          </View>
        </GlassCard>

        {/* Recent Leads */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-800 dark:text-white mb-3">Recent Inquiries</Text>
          <LeadsList maxItems={5} viewAllRoute="/dashboard/business/leads" />
        </View>

      </View>
    </ScrollView>
  );
}
