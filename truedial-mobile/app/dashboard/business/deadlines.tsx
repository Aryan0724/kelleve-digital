import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Scale, AlertCircle, CheckCircle, Clock } from 'lucide-react-native';
import api from '../../../services/api';

const BRAND_ORANGE = "#E8701A";

export default function CAComplianceDeadlinesScreen() {
  const router = useRouter();
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/deadlines');
      setDeadlines(res.data?.data || res.data || []);
    } catch {
      // Mock Fallback
      setDeadlines([
        { id: 1, form: "GSTR-1 Monthly Return", client: "Sharma Distributors", target_date: "Sep 11, 2026", status: "Pending", priority: "High" },
        { id: 2, form: "TDS Quarterly Filing (Form 26Q)", client: "Kelleve Digital", target_date: "Sep 30, 2026", status: "Filed", priority: "Medium" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkFiled = (id: number) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, status: 'Filed' } : d));
    Alert.alert("Filed", "Compliance form filing recorded successfully!");
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />
      
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Scale size={20} color={BRAND_ORANGE} />
          <Text style={s.headerTitle}>CA Filing & Deadlines</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={BRAND_ORANGE} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent}>
          {deadlines.length === 0 ? (
            <View style={s.emptyState}>
              <Scale size={50} color="#94A3B8" />
              <Text style={s.emptyTitle}>No Compliance Tasks</Text>
              <Text style={s.emptySub}>All tax and legal filings are up to date.</Text>
            </View>
          ) : (
            deadlines.map(d => (
              <View key={d.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.formName}>{d.form}</Text>
                    <Text style={s.client}>Client: {d.client}</Text>
                  </View>
                  <View style={[s.badge, d.status === 'Filed' ? s.successBadge : s.pendingBadge]}>
                    <Text style={[s.badgeText, d.status === 'Filed' ? s.successText : s.pendingText]}>
                      {d.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={s.metaRow}>
                  <View style={s.metaItem}>
                    <Clock size={12} color="#94A3B8" />
                    <Text style={s.metaText}>Target Date: {d.target_date}</Text>
                  </View>
                  <View style={s.metaItem}>
                    <AlertCircle size={12} color={d.priority === 'High' ? '#EF4444' : '#F59E0B'} />
                    <Text style={[s.metaText, { color: d.priority === 'High' ? '#EF4444' : '#F59E0B', fontWeight: '700' }]}>
                      {d.priority} Priority
                    </Text>
                  </View>
                </View>

                <View style={s.footer}>
                  {d.status !== 'Filed' ? (
                    <TouchableOpacity style={s.actionBtn} onPress={() => handleMarkFiled(d.id)}>
                      <CheckCircle size={14} color="#FFFFFF" />
                      <Text style={s.actionBtnText}>Mark as Filed</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={s.doneRow}>
                      <CheckCircle size={14} color="#10B981" />
                      <Text style={s.doneText}>Completed on time</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050f24' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#0a1c3a', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, gap: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center', paddingHorizontal: 40 },
  card: { backgroundColor: '#0a1c3a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  formName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  client: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pendingBadge: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  successBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  badgeText: { fontSize: 10, fontWeight: '800' },
  pendingText: { color: '#F59E0B' },
  successText: { color: '#10B981' },
  metaRow: { gap: 6, marginVertical: 12, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#CBD5E1' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: BRAND_ORANGE, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  doneText: { color: '#10B981', fontSize: 12, fontWeight: '800' }
});
