import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/auth';
import StatCard from '../StatCard';
import QuickActionGrid, { QuickAction } from '../QuickActionGrid';
import GlassCard from '../../GlassCard';
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
  ArrowRight,
  Minus,
  Plus
} from 'lucide-react-native';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [budget, setBudget] = useState(100000);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const increaseBudget = () => {
    if (budget < 2000000) setBudget(budget + 50000);
  };

  const decreaseBudget = () => {
    if (budget > 50000) setBudget(budget - 50000);
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const estimatedSavings = budget * 0.2;

  const actions: QuickAction[] = [
    { title: 'My Requirements', icon: ListTodo, color: '#3B82F6', bgClass: 'bg-blue-50 dark:bg-blue-900/30', route: '/dashboard/user/my-requirements' },
    { title: 'Saved Businesses', icon: Bookmark, color: '#10B981', bgClass: 'bg-emerald-50 dark:bg-emerald-900/30', route: '/dashboard/user/saved' },
    { title: 'Privilege Card', icon: CreditCard, color: '#F59E0B', bgClass: 'bg-amber-50 dark:bg-amber-900/30', route: '/privilege' },
    { title: 'Browse Offers', icon: Tag, color: '#8B5CF6', bgClass: 'bg-purple-50 dark:bg-purple-900/30', route: '/(tabs)/offers' },
    { title: 'Account', icon: User, color: '#64748B', bgClass: 'bg-slate-50 dark:bg-slate-900/30', route: '/dashboard/user/account' },
    { title: 'Settings', icon: Settings, color: '#6B7280', bgClass: 'bg-gray-50 dark:bg-gray-900/30', route: '/dashboard/user/settings' },
  ];

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-slate-950 px-4 pt-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />
      }
    >
      {/* Hero: VIP Privilege Card Preview */}
      <GlassCard variant="gold" className="p-6 mb-6 rounded-2xl bg-[#111111] border border-[#D4AF37] relative overflow-hidden">
        <View className="absolute -top-10 -right-10 opacity-10">
          <Sparkles size={120} color="#D4AF37" />
        </View>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-xl font-bold tracking-widest">TrueDial</Text>
            <Text className="text-[#E8701A] text-xs font-semibold mt-1">PRIVILEGE MEMBER</Text>
          </View>
          <View className="w-10 h-8 bg-amber-400/80 rounded-md border border-amber-300 opacity-80" />
        </View>
        
        <Text className="text-[#D4AF37] text-lg font-mono tracking-widest mb-4">
          TD-VIP-XXXXX
        </Text>
        
        <View className="flex-row justify-between items-end mt-2">
          <View>
            <Text className="text-white/60 text-xs uppercase mb-1">Card Holder</Text>
            <Text className="text-white font-medium text-base">{user?.name || 'Valued Member'}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => router.push('/privilege')}
            className="bg-[#D4AF37]/20 px-4 py-2 rounded-full border border-[#D4AF37]/50"
          >
            <Text className="text-[#D4AF37] text-xs font-semibold">View Full Card</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* KPIs Grid */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <View className="w-[48%] mb-4">
          <StatCard
            title="Active Requirements"
            value="3"
            icon={<ListTodo size={20} color="#3B82F6" />}
            iconBgClass="bg-blue-100 dark:bg-blue-900/30"
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard
            title="Quotes Received"
            value="8"
            icon={<MessageSquare size={20} color="#10B981" />}
            iconBgClass="bg-emerald-100 dark:bg-emerald-900/30"
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard
            title="Businesses Saved"
            value="12"
            icon={<Bookmark size={20} color="#8B5CF6" />}
            iconBgClass="bg-purple-100 dark:bg-purple-900/30"
          />
        </View>
        <View className="w-[48%] mb-4">
          <StatCard
            title="VIP Savings"
            value="₹0"
            icon={<IndianRupee size={20} color="#F59E0B" />}
            iconBgClass="bg-amber-100 dark:bg-amber-900/30"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mb-8">
        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your Dashboard</Text>
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* VIP Savings Calculator */}
      <GlassCard className="p-5 mb-6 border border-amber-200 dark:border-amber-900/50 bg-white/50 dark:bg-slate-900/50">
        <View className="flex-row items-center mb-2">
          <IndianRupee size={20} color="#F59E0B" className="mr-2" />
          <Text className="text-lg font-bold text-slate-900 dark:text-white">VIP Savings Calculator</Text>
        </View>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Estimate your savings with a TrueDial Privilege Card
        </Text>

        <View className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-5 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={decreaseBudget}
            className={`w-10 h-10 rounded-full items-center justify-center ${budget <= 50000 ? 'bg-slate-200 dark:bg-slate-700' : 'bg-white dark:bg-slate-600 shadow-sm'}`}
            disabled={budget <= 50000}
          >
            <Minus size={20} color={budget <= 50000 ? '#94A3B8' : '#334155'} />
          </TouchableOpacity>
          
          <View className="items-center">
            <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Your Event Budget</Text>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(budget)}</Text>
          </View>

          <TouchableOpacity 
            onPress={increaseBudget}
            className={`w-10 h-10 rounded-full items-center justify-center ${budget >= 2000000 ? 'bg-slate-200 dark:bg-slate-700' : 'bg-white dark:bg-slate-600 shadow-sm'}`}
            disabled={budget >= 2000000}
          >
            <Plus size={20} color={budget >= 2000000 ? '#94A3B8' : '#334155'} />
          </TouchableOpacity>
        </View>

        <View className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl mb-5 border border-amber-100 dark:border-amber-900/30 items-center">
          <Text className="text-amber-600 dark:text-amber-400 font-medium mb-1">Estimated Savings (Up to 20%)</Text>
          <Text className="text-2xl font-bold text-amber-700 dark:text-amber-500">{formatCurrency(estimatedSavings)}</Text>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/privilege')}
          className="bg-[#E8701A] py-3.5 rounded-xl flex-row items-center justify-center"
        >
          <Text className="text-white font-bold text-base mr-2">Get Your VIP Card</Text>
          <ArrowRight size={18} color="#ffffff" />
        </TouchableOpacity>
      </GlassCard>

      {/* List Your Business */}
      <GlassCard className="p-5 mb-8 border border-orange-100 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-950/20">
        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">Grow your business on TrueDial</Text>
        <Text className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Reach thousands of local customers for free
        </Text>
        
        <TouchableOpacity 
          onPress={() => router.push('/list-business' as any)}
          className="bg-slate-900 dark:bg-white py-3 px-5 rounded-xl self-start flex-row items-center"
        >
          <Text className="text-white dark:text-slate-900 font-semibold mr-2">List Now</Text>
          <ArrowRight size={16} color="#E8701A" />
        </TouchableOpacity>
      </GlassCard>

    </ScrollView>
  );
}
