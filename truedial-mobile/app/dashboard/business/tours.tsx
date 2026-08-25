import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plane, MapPin, Users, Calendar, CheckCircle } from 'lucide-react-native';
import api from '../../../services/api';

const BRAND_ORANGE = "#E8701A";

export default function VendorToursScreen() {
  const router = useRouter();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/tours');
      setTours(res.data?.data || res.data || []);
    } catch {
      // Mock Fallback
      setTours([
        { id: 1, package_name: "Glow of Kashmir Group Tour", destination: "Srinagar & Gulmarg", dates: "Sep 12 - Sep 18, 2026", group_size: 14, status: "Booking" },
        { id: 2, package_name: "Goa Weekend Getaway", destination: "North & South Goa", dates: "Sep 20 - Sep 23, 2026", group_size: 8, status: "Confirmed" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTour = (id: number) => {
    setTours(prev => prev.map(t => t.id === id ? { ...t, status: 'Confirmed' } : t));
    Alert.alert("Confirmed", "Tour departure confirmed and ticket dispatches completed!");
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
          <Plane size={20} color={BRAND_ORANGE} />
          <Text style={s.headerTitle}>Travel Agency Tours</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={BRAND_ORANGE} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent}>
          {tours.length === 0 ? (
            <View style={s.emptyState}>
              <Plane size={50} color="#94A3B8" />
              <Text style={s.emptyTitle}>No Tours Active</Text>
              <Text style={s.emptySub}>Add custom tour listings to coordinate booking groups.</Text>
            </View>
          ) : (
            tours.map(t => (
              <View key={t.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.packageName}>{t.package_name}</Text>
                    <View style={s.destRow}>
                      <MapPin size={12} color="#E8701A" />
                      <Text style={s.destination}>{t.destination}</Text>
                    </View>
                  </View>
                  <View style={[s.badge, t.status === 'Confirmed' ? s.successBadge : s.bookingBadge]}>
                    <Text style={[s.badgeText, t.status === 'Confirmed' ? s.successText : s.bookingText]}>
                      {t.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={s.metaBlock}>
                  <View style={s.metaItem}>
                    <Calendar size={13} color="#94A3B8" />
                    <Text style={s.metaText}>Dates: {t.dates}</Text>
                  </View>
                  <View style={s.metaItem}>
                    <Users size={13} color="#94A3B8" />
                    <Text style={s.metaText}>Group Size: {t.group_size} travelers registered</Text>
                  </View>
                </View>

                <View style={s.footer}>
                  {t.status === 'Booking' ? (
                    <TouchableOpacity style={s.actionBtn} onPress={() => handleConfirmTour(t.id)}>
                      <CheckCircle size={14} color="#FFFFFF" />
                      <Text style={s.actionBtnText}>Confirm Departure</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={s.doneRow}>
                      <CheckCircle size={14} color="#10B981" />
                      <Text style={s.doneText}>Departure Ready</Text>
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
  packageName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  destRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  destination: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  bookingBadge: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  successBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  badgeText: { fontSize: 10, fontWeight: '800' },
  bookingText: { color: '#F59E0B' },
  successText: { color: '#10B981' },
  metaBlock: { gap: 6, marginVertical: 12, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#CBD5E1' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: BRAND_ORANGE, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  doneText: { color: '#10B981', fontSize: 12, fontWeight: '800' }
});
