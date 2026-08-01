import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { 
  HeartPulse, CalendarPlus, UserCheck, Siren, Star, 
  Stethoscope, Clock, CreditCard
} from 'lucide-react-native';

import StatCard from '../StatCard';
import QuickActionGrid, { QuickAction } from '../QuickActionGrid';
import LeadsList from '../LeadsList';
import GlassCard from '../../GlassCard';
import api from '../../../services/api';
import { useAuth } from '../../../context/auth';

const HealthcareDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    appointments: '142',
    doctors: '12',
    emergency: 'ON',
    rating: '4.8'
  });
  
  const [isEmergencyOn, setIsEmergencyOn] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('/truedial/vendor/analytics/overview');
      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Fallback values are already in state
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
    { title: 'Appointments', icon: CalendarPlus, color: '#0D9488', bgClass: 'bg-teal-50 dark:bg-teal-900/30', route: '/dashboard/business/leads' },
    { title: 'Doctor Directory', icon: Stethoscope, color: '#3B82F6', bgClass: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/business/catalog' },
    { title: 'Clinic Timings', icon: Clock, color: '#64748B', bgClass: 'bg-slate-50 dark:bg-slate-900/30', route: '/dashboard/business/profile-edit' },
    { title: 'Emergency Toggle', icon: Siren, color: '#EF4444', bgClass: 'bg-red-50 dark:bg-red-900/30', route: '/dashboard/business/profile-edit' },
    { title: 'Reviews', icon: Star, color: '#EAB308', bgClass: 'bg-yellow-50 dark:bg-yellow-900/30', route: '/dashboard/business/reviews' },
    { title: 'Subscription', icon: CreditCard, color: '#A855F7', bgClass: 'bg-purple-50 dark:bg-purple-900/30', route: '/dashboard/business/subscription' },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D9488" />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Hero Banner */}
      <View className="px-4 pt-4 pb-6">
        <View
          className="rounded-3xl p-6 shadow-lg shadow-teal-500/30 bg-teal-700"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-white/20 p-3 rounded-2xl">
              <HeartPulse size={32} color="#FFFFFF" />
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-medium">Healthcare Hub</Text>
            </View>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">
            Welcome, {user?.name || 'Doctor'}!
          </Text>
          <Text className="text-teal-50 text-sm font-medium">
            Appointments, specialist directory & emergency services
          </Text>
        </View>
      </View>

      {/* KPI Stats Grid */}
      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-slate-800 dark:text-white mb-3">Overview</Text>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          <View className="w-[48%]">
            <StatCard 
              title="Appointment Requests" 
              value={stats.appointments} 
              icon={<CalendarPlus size={20} color="#0D9488" />} 
              iconBgClass="bg-teal-100 dark:bg-teal-900/30" 
            />
          </View>
          <View className="w-[48%]">
            <StatCard 
              title="Active Doctors" 
              value={stats.doctors} 
              icon={<UserCheck size={20} color="#3B82F6" />} 
              iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
            />
          </View>
          <View className="w-[48%]">
            <StatCard 
              title="Emergency Status" 
              value={isEmergencyOn ? 'ON' : 'OFF'} 
              icon={<Siren size={20} color="#EF4444" />} 
              iconBgClass="bg-red-100 dark:bg-red-900/30" 
            />
          </View>
          <View className="w-[48%]">
            <StatCard 
              title="Patient Rating" 
              value={stats.rating} 
              icon={<Star size={20} color="#EAB308" />} 
              iconBgClass="bg-yellow-100 dark:bg-yellow-900/30" 
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-slate-800 dark:text-white mb-3">Quick Actions</Text>
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* Unique Section: 24x7 Emergency Services */}
      <View className="px-4 mb-6">
        <GlassCard className="p-5 border border-emerald-200 dark:border-emerald-800/50 bg-white/80 dark:bg-slate-800/80">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <View className="bg-red-50 dark:bg-red-900/30 p-2 rounded-xl mr-3">
                <Siren size={24} color="#EF4444" />
              </View>
              <Text className="text-lg font-bold text-slate-800 dark:text-white">Emergency Services</Text>
            </View>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setIsEmergencyOn(!isEmergencyOn)}
              className={`w-14 h-8 rounded-full p-1 justify-center ${isEmergencyOn ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <View className={`w-6 h-6 rounded-full bg-white shadow-sm ${isEmergencyOn ? 'self-end' : 'self-start'}`} />
            </TouchableOpacity>
          </View>
          <Text className="text-slate-600 dark:text-slate-300 text-sm mb-3 leading-5">
            Enable to show your clinic as available for emergencies
          </Text>
          <View className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">
              24x7 Emergency Badge will appear on your profile
            </Text>
          </View>
        </GlassCard>
      </View>

      {/* Unique Section: Specialist Directory */}
      <View className="px-4 mb-6">
        <GlassCard className="p-5 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80">
          <View className="flex-row items-center mb-2">
            <Stethoscope size={20} color="#3B82F6" className="mr-2" />
            <Text className="text-lg font-bold text-slate-800 dark:text-white">Your Specialist Team</Text>
          </View>
          <Text className="text-slate-600 dark:text-slate-300 text-sm mb-4">
            Add doctors and specialists to your profile
          </Text>
          <TouchableOpacity 
            className="bg-slate-100 dark:bg-slate-700 py-3 rounded-xl items-center justify-center border border-slate-200 dark:border-slate-600"
            activeOpacity={0.7}
            onPress={() => router.push('/dashboard/business/catalog')}
          >
            <Text className="text-slate-800 dark:text-white font-medium">Manage Directory</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>

      {/* Recent Leads */}
      <View className="px-4 mb-2">
        <LeadsList maxItems={5} viewAllRoute="/dashboard/business/leads" />
      </View>
    </ScrollView>
  );
};

export default HealthcareDashboard;
