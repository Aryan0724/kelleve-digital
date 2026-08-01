import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import api from '../../services/api';

interface Lead {
  id: number;
  name?: string;
  phone?: string;
  status?: string;
}

interface LeadsListProps {
  maxItems?: number;
  viewAllRoute?: string;
}

export default function LeadsList({ maxItems = 5, viewAllRoute = '/dashboard/business/leads' }: LeadsListProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await api.get('/truedial/vendor/crm/leads').catch(() => ({ data: { data: [] } }));
      const data = res.data?.data || res.data || [];
      setLeads(Array.isArray(data) ? data.slice(0, maxItems) : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'Contacted':
        return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' };
      case 'Converted':
        return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' };
      default:
        return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' };
    }
  };

  if (loading) {
    return <ActivityIndicator color="#E8701A" className="my-6" />;
  }

  return (
    <View>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[18px] font-bold text-slate-900 dark:text-white">Recent Leads</Text>
        <TouchableOpacity onPress={() => router.push(viewAllRoute as any)}>
          <Text className="text-[14px] font-bold text-[#E8701A]">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
        {leads.length === 0 ? (
          <Text className="text-slate-400 text-center py-4">No leads yet. Your first inquiry will appear here.</Text>
        ) : (
          leads.map((lead, idx) => {
            const statusStyle = getStatusStyle(lead.status);
            return (
              <TouchableOpacity
                key={lead.id}
                className={`flex-row items-center py-3 ${idx !== leads.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                onPress={() => router.push(viewAllRoute as any)}
              >
                <View className="flex-1">
                  <Text className="text-[15px] font-bold text-slate-900 dark:text-white">{lead.name || 'User'}</Text>
                  <Text className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">{lead.phone}</Text>
                </View>
                <View className={`px-2.5 py-1 rounded-full ${statusStyle.bg}`}>
                  <Text className={`text-[11px] font-extrabold tracking-wider uppercase ${statusStyle.text}`}>{lead.status || 'New'}</Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" className="ml-2 dark:text-slate-500" />
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
}
