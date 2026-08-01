import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Factory, 
  FileQuestion, 
  Receipt, 
  Package, 
  ShieldCheck, 
  Star, 
  CreditCard,
  ChevronRight
} from 'lucide-react-native';

import StatCard from '../StatCard';
import QuickActionGrid, { QuickAction } from '../QuickActionGrid';
import LeadsList from '../LeadsList';
import GlassCard from '../../GlassCard';
import api from '../../../services/api';

export default function WholesaleDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    rfqsReceived: 0,
    tenderQuotes: 0,
    bulkOrders: 0,
    gstinStatus: 'Pending'
  });

  const [rfqList, setRfqList] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const [analyticsRes, rfqsRes, businessRes] = await Promise.all([
        api.get('/truedial/vendor/analytics/overview').catch(() => null),
        api.get('/rfqs').catch(() => null),
        api.get('/truedial/vendor/my-business').catch(() => null)
      ]);

      const analytics = analyticsRes?.data?.data || analyticsRes?.data || {};
      const rfqs = rfqsRes?.data?.data || rfqsRes?.data || [];
      const biz = businessRes?.data?.data || businessRes?.data || {};

      setRfqList(Array.isArray(rfqs) ? rfqs.slice(0, 3) : []);

      setStats({
        rfqsReceived: Array.isArray(rfqs) ? rfqs.length : (analytics.total_leads || 0),
        tenderQuotes: analytics.quotations_count || analytics.active_offers_count || 0,
        bulkOrders: analytics.bulk_orders_count || biz.products_count || 0,
        gstinStatus: biz.gstin ? 'Verified' : 'Pending'
      });
    } catch (error) {
      console.error('Failed to fetch wholesale analytics:', error);
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
    {
      title: 'Product Catalog',
      icon: Package,
      color: '#10B981',
      bgClass: 'bg-emerald-50 dark:bg-emerald-900/30',
      route: '/dashboard/business/catalog'
    },
    {
      title: 'RFQ Manager',
      icon: FileQuestion,
      color: '#3B82F6',
      bgClass: 'bg-blue-50 dark:bg-blue-900/30',
      route: '/dashboard/business/leads'
    },
    {
      title: 'Tender Quotes',
      icon: Receipt,
      color: '#8B5CF6',
      bgClass: 'bg-purple-50 dark:bg-purple-900/30',
      route: '/dashboard/business/offers'
    },
    {
      title: 'GSTIN Verify',
      icon: ShieldCheck,
      color: '#059669',
      bgClass: 'bg-emerald-50 dark:bg-emerald-900/30',
      route: '/dashboard/business/profile-edit'
    },
    {
      title: 'Reviews',
      icon: Star,
      color: '#EAB308',
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/30',
      route: '/dashboard/business/reviews'
    },
    {
      title: 'Subscription',
      icon: CreditCard,
      color: '#F59E0B',
      bgClass: 'bg-amber-50 dark:bg-amber-900/30',
      route: '/dashboard/business/subscription'
    }
  ];

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-[#0A1C3A]"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Hero Banner */}
      <View className="px-4 pt-6 pb-2">
        <View className="rounded-3xl p-6 shadow-lg shadow-teal-900/20 bg-emerald-800">
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-white/20 p-3 rounded-2xl">
              <Factory size={32} color="#FFFFFF" />
            </View>
            <View className="bg-white/10 px-3 py-1 rounded-full">
              <Text className="text-teal-50 text-xs font-medium">Wholesale Hub</Text>
            </View>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">
            B2B Supply Hub
          </Text>
          <Text className="text-teal-100 text-sm">
            RFQs, tender quotes & bulk order management
          </Text>
        </View>
      </View>

      {/* KPI Stats Grid */}
      <View className="px-4 py-4 flex-row flex-wrap justify-between">
        <View className="w-[48%] mb-3">
          <StatCard 
            title="RFQs Received" 
            value={stats.rfqsReceived} 
            icon={<FileQuestion size={20} color="#10B981" />} 
            iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Tender Quotes" 
            value={stats.tenderQuotes} 
            icon={<Receipt size={20} color="#3B82F6" />} 
            iconBgClass="bg-blue-100 dark:bg-blue-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="Bulk Catalog Items" 
            value={stats.bulkOrders} 
            icon={<Package size={20} color="#F59E0B" />} 
            iconBgClass="bg-amber-100 dark:bg-amber-900/30" 
          />
        </View>
        <View className="w-[48%] mb-3">
          <StatCard 
            title="GSTIN Status" 
            value={stats.gstinStatus} 
            icon={<ShieldCheck size={20} color="#059669" />} 
            iconBgClass="bg-emerald-100 dark:bg-emerald-900/30" 
          />
        </View>
      </View>

      {/* Unique Section: RFQ Inbox */}
      <View className="px-4 mb-4">
        <GlassCard className="p-4 border-emerald-500/20 dark:border-emerald-500/10">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-bold text-slate-900 dark:text-white">Latest RFQ Requests</Text>
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => router.push('/dashboard/business/leads')}
            >
              <Text className="text-xs font-semibold text-[#E8701A] mr-1">View All</Text>
              <ChevronRight size={14} color="#E8701A" />
            </TouchableOpacity>
          </View>

          {rfqList.length === 0 ? (
            <Text className="text-slate-400 text-center py-4 text-xs">No active RFQs yet. New bulk buyer quotes will appear here.</Text>
          ) : (
            rfqList.map((rfq, idx) => (
              <View 
                key={rfq.id || idx}
                className={`py-2.5 flex-row items-center justify-between ${idx !== rfqList.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
              >
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rfq.title || rfq.product_name || 'Bulk Supply Request'}</Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Qty: {rfq.quantity || '500 Units'} • {rfq.location || 'Patna'}</Text>
                </View>
                <View className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                  <Text className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Pending Quote</Text>
                </View>
              </View>
            ))
          )}
        </GlassCard>
      </View>

      {/* Unique Section: GSTIN Verification */}
      <View className="px-4 mb-4">
        <GlassCard className="p-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-3">
            <View className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center mr-3">
              <ShieldCheck size={20} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-900 dark:text-white">GSTIN Verification</Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {stats.gstinStatus === 'Verified' ? '✓ Verified GSTIN increases buyer trust for bulk orders' : 'Add your GSTIN to gain B2B trust badge'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            className="bg-[#E8701A] px-3 py-1.5 rounded-xl"
            onPress={() => router.push('/dashboard/business/profile-edit')}
          >
            <Text className="text-xs font-bold text-white">Update GSTIN</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>

      {/* Quick Actions */}
      <View className="px-4 mb-4">
        <Text className="text-base font-bold text-slate-900 dark:text-white mb-3">Supply Chain Tools</Text>
        <QuickActionGrid actions={actions} columns={3} />
      </View>

      {/* Recent Leads */}
      <View className="px-4 mb-6">
        <LeadsList maxItems={5} />
      </View>
    </ScrollView>
  );
}
