import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  GraduationCap, 
  UserPlus, 
  BookOpen, 
  IndianRupee, 
  Star, 
  School, 
  Megaphone,
  CheckCircle,
  ChevronRight
} from 'lucide-react-native';


import { useAuth } from '../../../context/auth';
import api from '../../../services/api';

import StatCard from '../StatCard';
import QuickActionGrid, { QuickAction } from '../QuickActionGrid';
import LeadsList from '../LeadsList';
import GlassCard from '../../GlassCard';

export default function EducationDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    inquiries: '245',
    inquiriesTrend: '+15%',
    inquiriesUp: true,
    enrollments: '84',
    enrollmentsTrend: '+8%',
    enrollmentsUp: true,
    feeCollected: '₹4.2L',
    feeTrend: '+12%',
    feeUp: true,
    rating: '4.8',
    ratingTrend: 'Top 10%',
    ratingUp: true
  });

  const fetchStats = async () => {
    try {
      const response = await api.get('/truedial/vendor/analytics/overview');
      if (response.data) {
        // Map API response to stats if available
        // Fallback already provided in initial state
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const actions: QuickAction[] = [
    { title: 'Admissions', icon: UserPlus, color: '#0D9488', bgClass: 'bg-teal-50 dark:bg-teal-900/30', route: '/dashboard/business/leads' },
    { title: 'Courses', icon: BookOpen, color: '#3B82F6', bgClass: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/business/catalog' },
    { title: 'Fee Structure', icon: IndianRupee, color: '#10B981', bgClass: 'bg-emerald-50 dark:bg-emerald-900/30', route: '/dashboard/business/offers' },
    { title: 'Edit Profile', icon: School, color: '#E8701A', bgClass: 'bg-orange-50 dark:bg-orange-900/30', route: '/dashboard/business/profile-edit' },
    { title: 'Reviews', icon: Star, color: '#EAB308', bgClass: 'bg-yellow-50 dark:bg-yellow-900/30', route: '/dashboard/business/reviews' },
    { title: 'Marketing', icon: Megaphone, color: '#06B6D4', bgClass: 'bg-cyan-50 dark:bg-cyan-900/30', route: '/dashboard/business/marketing' },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D9488" />
      }
    >
      {/* Hero Banner */}
      <View className="px-4 pt-6 pb-6">
        <View
          className="rounded-3xl p-6 shadow-lg shadow-teal-500/30 bg-teal-700"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-white/20 p-3 rounded-2xl">
              <GraduationCap size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">Institute</Text>
            </View>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">Education Hub</Text>
          <Text className="text-teal-100 text-sm">Courses, admissions & student management</Text>
        </View>
      </View>

      {/* KPI Stats Grid */}
      <View className="px-4 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-4">
          <StatCard 
            title="Student Inquiries" 
            value={stats.inquiries} 
            icon={<UserPlus size={20} color="#0D9488" />} 
            iconBgClass="bg-teal-50 dark:bg-teal-900/30" 
            trend={stats.inquiriesTrend} 
            trendUp={stats.inquiriesUp} 
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard 
            title="Course Enrollments" 
            value={stats.enrollments} 
            icon={<BookOpen size={20} color="#3B82F6" />} 
            iconBgClass="bg-blue-50 dark:bg-blue-900/30" 
            trend={stats.enrollmentsTrend} 
            trendUp={stats.enrollmentsUp} 
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard 
            title="Fee Collected" 
            value={stats.feeCollected} 
            icon={<IndianRupee size={20} color="#10B981" />} 
            iconBgClass="bg-emerald-50 dark:bg-emerald-900/30" 
            trend={stats.feeTrend} 
            trendUp={stats.feeUp} 
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard 
            title="Institute Rating" 
            value={stats.rating} 
            icon={<Star size={20} color="#EAB308" />} 
            iconBgClass="bg-yellow-50 dark:bg-yellow-900/30" 
            trend={stats.ratingTrend} 
            trendUp={stats.ratingUp} 
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mt-2 mb-6">
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* Course Enrollment Stats */}
      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 px-1">
          Enrollment Overview
        </Text>
        <GlassCard className="p-5 border border-teal-200 dark:border-teal-900">
          <View className="flex-col gap-4">
            {/* Course 1 */}
            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-slate-700 dark:text-slate-300 font-medium">JEE Advanced Batch</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs">42 students</Text>
              </View>
              <View className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <View className="h-full bg-teal-500 rounded-full" style={{ width: '84%' }} />
              </View>
            </View>

            {/* Course 2 */}
            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-slate-700 dark:text-slate-300 font-medium">NEET Foundation</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs">38 students</Text>
              </View>
              <View className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <View className="h-full bg-blue-500 rounded-full" style={{ width: '76%' }} />
              </View>
            </View>

            {/* Course 3 */}
            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-slate-700 dark:text-slate-300 font-medium">Spoken English</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs">25 students</Text>
              </View>
              <View className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <View className="h-full bg-purple-500 rounded-full" style={{ width: '50%' }} />
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            className="mt-5 flex-row items-center justify-center py-2 border-t border-slate-100 dark:border-slate-800"
            onPress={() => router.push('/dashboard/business/catalog')}
          >
            <Text className="text-teal-600 dark:text-teal-400 font-medium mr-1">Manage Courses</Text>
            <ChevronRight size={16} color="#0D9488" />
          </TouchableOpacity>
        </GlassCard>
      </View>

      {/* Certification Badges */}
      <View className="px-4 mb-6">
        <GlassCard className="p-4 border border-slate-200 dark:border-slate-800">
          <View className="flex-row gap-3 mb-2">
            <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
              <CheckCircle size={14} color="#10B981" />
              <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-medium ml-1.5">
                Verified Institute
              </Text>
            </View>
            <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800/50">
              <CheckCircle size={14} color="#3B82F6" />
              <Text className="text-blue-700 dark:text-blue-400 text-xs font-medium ml-1.5">
                NAAC Accredited
              </Text>
            </View>
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1 px-1">
            Accredited institutions receive 2x more inquiries
          </Text>
        </GlassCard>
      </View>

      {/* Recent Leads */}
      <View className="px-4 mb-8">
        <LeadsList maxItems={5} viewAllRoute="/dashboard/business/leads" />
      </View>

    </ScrollView>
  );
}
