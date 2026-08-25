import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Car, CheckCircle, Navigation, Phone } from 'lucide-react-native';
import api from '../../../services/api';

const BRAND_ORANGE = "#E8701A";

export default function GarageDashboardScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/garage');
      setVehicles(res.data?.data || res.data || []);
    } catch {
      // Mock Fallback
      setVehicles([
        { id: 1, model: "Hyundai i20 (BR-01-EE-4921)", owner: "Vikram Sen", issue: "Engine tuning & Oil change", status: "Repairing", arrival_date: "2026-08-25" },
        { id: 2, model: "Honda City (BR-01-AF-9024)", owner: "Sanya Roy", issue: "Brake pad replacement", status: "Diagnosing", arrival_date: "2026-08-25" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (id: number, status: string) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v));
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
          <Car size={20} color={BRAND_ORANGE} />
          <Text style={s.headerTitle}>Garage Job Cards</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={BRAND_ORANGE} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent}>
          {vehicles.length === 0 ? (
            <View style={s.emptyState}>
              <Car size={50} color="#94A3B8" />
              <Text style={s.emptyTitle}>No Active Jobs</Text>
              <Text style={s.emptySub}>All vehicle repairs have been completed and delivered.</Text>
            </View>
          ) : (
            vehicles.map(v => (
              <View key={v.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View>
                    <Text style={s.vehicleModel}>{v.model}</Text>
                    <Text style={s.owner}>Owner: {v.owner}</Text>
                  </View>
                  <View style={s.statusBadge}>
                    <Text style={s.statusText}>{v.status}</Text>
                  </View>
                </View>

                <View style={s.issueWrap}>
                  <Text style={s.issueLabel}>REPORTED ISSUE & WORK</Text>
                  <Text style={s.issueText}>{v.issue}</Text>
                </View>

                <View style={s.footer}>
                  <View style={s.actions}>
                    {v.status === 'Diagnosing' && (
                      <TouchableOpacity style={[s.actionBtn, s.primaryBtn]} onPress={() => handleUpdateStatus(v.id, 'Repairing')}>
                        <Text style={s.actionBtnText}>Start Repair</Text>
                      </TouchableOpacity>
                    )}
                    {v.status === 'Repairing' && (
                      <TouchableOpacity style={[s.actionBtn, s.successBtn]} onPress={() => handleUpdateStatus(v.id, 'Ready')}>
                        <Text style={s.actionBtnText}>Mark Ready</Text>
                      </TouchableOpacity>
                    )}
                    {v.status === 'Ready' && (
                      <View style={s.deliveredBadge}>
                        <CheckCircle size={14} color="#10B981" />
                        <Text style={s.deliveredText}>Job Completed</Text>
                      </View>
                    )}
                  </View>
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
  vehicleModel: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  owner: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  statusBadge: { backgroundColor: 'rgba(96, 165, 250, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#60A5FA', fontSize: 10, fontWeight: '800' },
  issueWrap: { marginVertical: 12, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  issueLabel: { fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  issueText: { fontSize: 13, color: '#E2E8F0', marginTop: 4, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  primaryBtn: { backgroundColor: BRAND_ORANGE },
  successBtn: { backgroundColor: '#10B981' },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  deliveredBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliveredText: { color: '#10B981', fontSize: 12, fontWeight: '800' }
});
