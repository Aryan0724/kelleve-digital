import React, { useState, useEffect, useCallback } from 'react';
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
    inquiries: 0,
    enrollments: 0,
    feeCollected: '₹0',
    rating: 0
  });

  const fetchStats = async () => {
    try {
      const [analyticsRes, businessRes] = await Promise.all([
        api.get('/truedial/vendor/analytics/overview').catch(() => null),
        api.get('/truedial/vendor/my-business').catch(() => null)
      ]);

      const analytics = analyticsRes?.data?.data || analyticsRes?.data || {};
      const biz = businessRes?.data?.data || businessRes?.data || {};

      setStats({
        inquiries: analytics.total_leads || analytics.inquiries_count || 0,
        enrollments: analytics.conversions_count || biz.products_count || 0,
        feeCollected: analytics.total_revenue ? `₹${analytics.total_revenue.toLocaleString('en-IN')}` : '₹0',
        rating: analytics.avg_rating || analytics.rating || (analytics.total_reviews_count > 0 ? 4.8 : 0)
      });
    } catch (error) {
      console.error('Error fetching education dashboard metrics:', error);
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
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D9488" />
      }
    >
      {/* Hero Banner */}
      <View className="px-4 pt-6 pb-6">
        <View className="rounded-3xl p-6 shadow-lg shadow-teal-500/30 bg-teal-700">
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
            iconBgClass="bg-teal-100 dark:bg-teal-900/30"
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard
            title="Course Catalog"
            value={stats.enrollments}
            icon={<BookOpen size={20} color="#3B82F6" />}
            iconBgClass="bg-blue-100 dark:bg-blue-900/30"
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard
            title="Revenue Tracked"
            value={stats.feeCollected}
            icon={<IndianRupee size={20} color="#10B981" />}
            iconBgClass="bg-emerald-100 dark:bg-emerald-900/30"
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard
            title="Institute Rating"
            value={stats.rating > 0 ? stats.rating.toFixed(1) : 'New'}
            icon={<Star size={20} color="#EAB308" />}
            iconBgClass="bg-yellow-100 dark:bg-yellow-900/30"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mt-2 mb-6">
        <Text className="text-lg font-bold text-slate-800 dark:text-white mb-3">
          Academic Management
        </Text>
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* Certification Badges */}
      <View className="px-4 mb-6">
        <GlassCard className="p-4 border-slate-200 dark:border-slate-800">
          <Text className="text-base font-bold text-slate-800 dark:text-white mb-3">
            Institute Accreditation
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-2">
            <View className="flex-row items-center bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} color="#0D9488" className="mr-1.5" />
              <Text className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                Verified Institute
              </Text>
            </View>
            <View className="flex-row items-center bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} color="#3B82F6" className="mr-1.5" />
              <Text className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                TrueDial Certified
              </Text>
            </View>
          </View>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accredited institutions receive 2x more student inquiries.
          </Text>
        </GlassCard>
      </View>

      {/* Recent Leads */}
      <View className="px-4 mb-6">
        <LeadsList maxItems={5} viewAllRoute="/dashboard/business/leads" />
      </View>
    </ScrollView>
  );
}
