import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { 
  Wrench, 
  PhoneCall, 
  CheckCircle, 
  Users, 
  Star, 
  IndianRupee, 
  CalendarDays, 
  Tag, 
  Megaphone,
  ArrowRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import api from '../../../services/api';
import { useAuth } from '../../../context/auth';
import GlassCard from '../../GlassCard';
import StatCard from '../StatCard';
import QuickActionGrid, { QuickAction } from '../QuickActionGrid';
import LeadsList from '../LeadsList';

export default function LocalServiceDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  const [instantCallbackEnabled, setInstantCallbackEnabled] = useState(true);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/truedial/vendor/analytics/overview');
      if (res.data?.data) {
        setStats(res.data.data);
      } else {
        setStats({
          serviceCallbacks: 124,
          jobsCompleted: 856,
          repeatCustomers: 45,
          avgRating: 4.8
        });
      }
    } catch (error) {
      // Fallback
      setStats({
        serviceCallbacks: 124,
        jobsCompleted: 856,
        repeatCustomers: 45,
        avgRating: 4.8
      });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  const actions: QuickAction[] = [
    { title: 'Rate Card', icon: IndianRupee, color: '#10B981', bgClass: 'bg-emerald-50 dark:bg-emerald-900/30', route: '/dashboard/business/catalog' },
    { title: 'Callbacks', icon: PhoneCall, color: '#9333EA', bgClass: 'bg-purple-50 dark:bg-purple-900/30', route: '/dashboard/business/leads' },
    { title: 'Schedule', icon: CalendarDays, color: '#3B82F6', bgClass: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/business/profile-edit' },
    { title: 'Offers', icon: Tag, color: '#F59E0B', bgClass: 'bg-amber-50 dark:bg-amber-900/30', route: '/dashboard/business/offers' },
    { title: 'Reviews', icon: Star, color: '#EAB308', bgClass: 'bg-yellow-50 dark:bg-yellow-900/30', route: '/dashboard/business/reviews' },
    { title: 'Marketing', icon: Megaphone, color: '#06B6D4', bgClass: 'bg-cyan-50 dark:bg-cyan-900/30', route: '/dashboard/business/marketing' },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-[#0A1C3A]"
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />
      }
    >
      {/* Hero Banner */}
      <View className="px-5 pt-5 pb-6 bg-purple-600 dark:bg-purple-900 rounded-b-3xl mb-6">
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
            <Wrench size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">Service Center</Text>
            <Text className="text-purple-100 text-sm mt-1">Callbacks, rate cards & service scheduling</Text>
          </View>
        </View>
      </View>

      <View className="px-5 space-y-6">
        {/* KPIs */}
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-4">
            <StatCard 
              title="Service Callbacks" 
              value={stats?.serviceCallbacks?.toString() || "0"} 
              icon={<PhoneCall size={20} color="#9333EA" />} 
              iconBgClass="bg-purple-100 dark:bg-purple-900/30" 
              trend="↑12%" 
              trendUp={true} 
            />
          </View>
          <View className="w-[48%] mb-4">
            <StatCard 
              title="Jobs Completed" 
              value={stats?.jobsCompleted?.toString() || "0"} 
              icon={<CheckCircle size={20} color="#10B981" />} 
              iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" 
              trend="↑5%" 
              trendUp={true} 
            />
          </View>
          <View className="w-[48%] mb-4">
            <StatCard 
              title="Repeat Customers" 
              value={stats?.repeatCustomers?.toString() || "0"} 
              icon={<Users size={20} color="#3B82F6" />} 
              iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
              trend="↑8%" 
              trendUp={true} 
            />
          </View>
          <View className="w-[48%] mb-4">
            <StatCard 
              title="Avg Rating" 
              value={stats?.avgRating?.toString() || "0.0"} 
              icon={<Star size={20} color="#EAB308" />} 
              iconBgClass="bg-yellow-100 dark:bg-yellow-900/30" 
              trend="↑0.2" 
              trendUp={true} 
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View>
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">Quick Actions</Text>
          <QuickActionGrid actions={actions} columns={3} />
        </View>

        {/* Instant Callback Section */}
        <GlassCard className="p-5 border border-purple-200 dark:border-purple-900/50">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mr-3">
                <PhoneCall size={20} color="#9333EA" />
              </View>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">Instant Callback</Text>
            </View>
            
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setInstantCallbackEnabled(!instantCallbackEnabled)}
              className={`w-14 h-8 rounded-full p-1 justify-center ${instantCallbackEnabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <View className={`w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-200 ${instantCallbackEnabled ? 'self-end' : 'self-start'}`} />
            </TouchableOpacity>
          </View>
          
          <Text className="text-sm text-slate-500 dark:text-slate-400 mb-3 ml-[52px]">
            When enabled, customers can request an immediate callback
          </Text>
          
          {instantCallbackEnabled && (
            <View className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl mt-2 flex-row items-center border border-purple-100 dark:border-purple-800/30">
              <CheckCircle size={16} color="#9333EA" className="mr-2" />
              <Text className="text-sm text-purple-800 dark:text-purple-300 font-medium flex-1">
                Active — Customers see "Call Back Now" button on your profile
              </Text>
            </View>
          )}
        </GlassCard>

        {/* Service Rate Card Section */}
        <GlassCard className="p-5 border border-slate-200 dark:border-slate-800">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-slate-900 dark:text-white">Your Rate Card</Text>
            <TouchableOpacity onPress={() => router.push('/dashboard/business/catalog')}>
              <Text className="text-sm font-medium text-purple-600 dark:text-purple-400">Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <Text className="text-base text-slate-700 dark:text-slate-300">AC Service & Repair</Text>
              <Text className="text-base font-bold text-slate-900 dark:text-white">₹499</Text>
            </View>
            <View className="flex-row justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <Text className="text-base text-slate-700 dark:text-slate-300">Deep Cleaning</Text>
              <Text className="text-base font-bold text-slate-900 dark:text-white">₹1,299</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-base text-slate-700 dark:text-slate-300">Plumbing Visit</Text>
              <Text className="text-base font-bold text-slate-900 dark:text-white">₹299</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            className="mt-4 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl flex-row justify-center items-center"
            onPress={() => router.push('/dashboard/business/catalog')}
          >
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mr-2">Manage All Rates</Text>
            <ArrowRight size={16} color="#475569" />
          </TouchableOpacity>
        </GlassCard>

        {/* Recent Leads */}
        <View className="mt-2">
          <LeadsList maxItems={5} viewAllRoute="/dashboard/business/leads" />
        </View>
      </View>
    </ScrollView>
  );
}
