import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/auth';
import StatCard from '../StatCard';
import QuickActionGrid, { QuickAction } from '../QuickActionGrid';
import GlassCard from '../../GlassCard';
import api from '../../../services/api';
import {
  Sparkles,
  ListTodo,
  MessageSquare,
  Bookmark,
  IndianRupee,
  CreditCard,
  Tag,
  User,
  Settings,
  Plus,
  Minus
} from 'lucide-react-native';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [budget, setBudget] = useState(100000);
  const [stats, setStats] = useState({
    enquiriesCount: 0,
    savedVendorsCount: 0,
    chatsCount: 0
  });

  const fetchUserData = async () => {
    try {
      const [savedVendorsRes, enquiriesRes, convosRes] = await Promise.all([
        api.get('/truedial/user/saved-businesses').catch(() => null),
        api.get('/truedial/inquiries/me').catch(() => null),
        api.get('/conversations').catch(() => null)
      ]);

      const vendors = savedVendorsRes?.data?.data || savedVendorsRes?.data || [];
      const enquiries = enquiriesRes?.data?.data || enquiriesRes?.data || [];
      const convos = convosRes?.data?.data || convosRes?.data || [];

      setStats({
        enquiriesCount: Array.isArray(enquiries) ? enquiries.length : 0,
        savedVendorsCount: Array.isArray(vendors) ? vendors.length : 0,
        chatsCount: Array.isArray(convos) ? convos.length : 0
      });
    } catch (error) {
      console.error('Failed to fetch user dashboard data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  const calculateSavings = () => {
    return (budget * 0.2).toLocaleString('en-IN');
  };

  const actions: QuickAction[] = [
    {
      title: 'My Enquiries',
      icon: ListTodo,
      color: '#3B82F6',
      bgClass: 'bg-blue-50 dark:bg-blue-900/30',
      route: '/dashboard/user/my-requirements'
    },
    {
      title: 'Saved Items',
      icon: Bookmark,
      color: '#10B981',
      bgClass: 'bg-emerald-50 dark:bg-emerald-900/30',
      route: '/dashboard/user/saved'
    },
    {
      title: 'Privilege Card',
      icon: CreditCard,
      color: '#F59E0B',
      bgClass: 'bg-amber-50 dark:bg-amber-900/30',
      route: '/privilege'
    },
    {
      title: 'Browse Offers',
      icon: Tag,
      color: '#8B5CF6',
      bgClass: 'bg-purple-50 dark:bg-purple-900/30',
      route: '/(tabs)/offers'
    },
    {
      title: 'Account',
      icon: User,
      color: '#64748B',
      bgClass: 'bg-slate-50 dark:bg-slate-800',
      route: '/dashboard/user/account'
    },
    {
      title: 'Settings',
      icon: Settings,
      color: '#64748B',
      bgClass: 'bg-slate-50 dark:bg-slate-800',
      route: '/dashboard/user/settings'
    }
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-[#0A1C3A]"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* VIP Card Section */}
      <View className="px-4 pt-6 pb-2">
        <GlassCard className="p-6 bg-[#111111] border border-[#D4AF37]/50 rounded-3xl shadow-xl shadow-amber-900/20">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-[#D4AF37] font-black tracking-widest text-lg">TRUEDIAL</Text>
              <Text className="text-orange-400 text-[10px] font-bold tracking-wider uppercase mt-0.5">
                VIP PRIVILEGE MEMBER
              </Text>
            </View>
            <Sparkles size={24} color="#D4AF37" />
          </View>

          {/* SIM Chip effect */}
          <View className="w-10 h-7 rounded bg-amber-400/80 mb-6 border border-amber-300 flex-row items-center justify-around px-1">
            <View className="w-[1px] h-full bg-amber-600/50" />
            <View className="w-[1px] h-full bg-amber-600/50" />
          </View>

          <Text className="text-slate-400 font-mono text-base tracking-widest mb-4">
            TD-VIP-{user?.id ? String(user.id).padStart(5, '0') : '98412'}
          </Text>

          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">MEMBER NAME</Text>
              <Text className="text-white font-bold text-base mt-0.5">{user?.name || 'Customer'}</Text>
            </View>
            <TouchableOpacity 
              className="bg-[#D4AF37] px-4 py-2 rounded-xl"
              onPress={() => router.push('/privilege')}
            >
              <Text className="text-slate-950 font-bold text-xs">View Full Card</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>

      {/* KPI Stats Grid */}
      <View className="px-4 py-4 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-3">
          <StatCard 
            title="My Enquiries" 
            value={stats.enquiriesCount} 
            icon={<ListTodo size={20} color="#3B82F6" />} 
            iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Active Chats" 
            value={stats.chatsCount} 
            icon={<MessageSquare size={20} color="#10B981" />} 
            iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Saved Businesses" 
            value={stats.savedVendorsCount} 
            icon={<Bookmark size={20} color="#8B5CF6" />} 
            iconBgClass="bg-purple-100 dark:bg-purple-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Estimated VIP Savings" 
            value={`₹${calculateSavings()}`} 
            icon={<IndianRupee size={20} color="#F59E0B" />} 
            iconBgClass="bg-amber-100 dark:bg-amber-900/30" 
          />
        </View>
      </View>

      {/* Calculator Section */}
      <View className="px-4 mb-4">
        <GlassCard className="p-5 border border-amber-500/20 dark:border-amber-500/10">
          <Text className="text-base font-bold text-slate-900 dark:text-white mb-1">VIP Savings Calculator</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400 mb-4">Estimate your savings with a TrueDial Privilege Card</Text>

          <View className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-2xl mb-4 flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] font-extrabold text-slate-400 uppercase">EXPECTED SPEND</Text>
              <Text className="text-xl font-black text-[#E8701A]">₹{budget.toLocaleString('en-IN')}</Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity 
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700"
                onPress={() => setBudget(Math.max(50000, budget - 50000))}
              >
                <Minus size={18} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity 
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700"
                onPress={() => setBudget(Math.min(2000000, budget + 50000))}
              >
                <Plus size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ~20% VIP Savings = ₹{calculateSavings()}
            </Text>
            <TouchableOpacity 
              className="bg-[#E8701A] px-4 py-2 rounded-xl"
              onPress={() => router.push('/privilege')}
            >
              <Text className="text-xs font-bold text-white">Get VIP Card</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mb-4">
        <Text className="text-base font-bold text-slate-900 dark:text-white mb-3">Your Dashboard</Text>
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* List Business Promo */}
      <View className="px-4 mb-6">
        <GlassCard className="p-5 bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 flex-row justify-between items-center">
          <View className="flex-1 mr-3">
            <Text className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Grow your business on TrueDial</Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">Reach thousands of local customers for free</Text>
          </View>
          <TouchableOpacity 
            className="bg-[#E8701A] px-4 py-2.5 rounded-xl"
            onPress={() => router.push('/list-business')}
          >
            <Text className="text-xs font-bold text-white">List Now →</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </ScrollView>
  );
}
