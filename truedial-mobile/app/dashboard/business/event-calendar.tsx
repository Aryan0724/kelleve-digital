/**
 * Event Calendar & Shoot Bookings
 * Tab for Event Managers, Photographers, Videographers
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Plus, Calendar, Clock, MapPin, Phone, CheckCircle } from 'lucide-react-native';
import api from '../../../services/api';

export default function EventCalendarScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/events');
      setEvents(res.data?.data || res.data || []);
    } catch {
      setEvents([
        {
          id: 1,
          eventName: "Sharma Wedding Shoot",
          type: "Photography",
          status: "Confirmed",
          date: "Aug 28, 2026",
          time: "10:00 AM - 10:00 PM",
          venue: "Grand Palace Resort, Patna",
          value: "₹85,000",
        },
        {
          id: 2,
          eventName: "Corporate Tech Summit",
          type: "Event Mgmt",
          status: "Pending",
          date: "Sep 05, 2026",
          time: "09:00 AM - 05:00 PM",
          venue: "Hotel Maurya, Patna",
          value: "₹45,000",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: number, status: string) =>
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));

  const totalValue = events.filter(e => e.status !== 'Cancelled')
    .reduce((a, e) => a + parseInt(String(e.value || '0').replace(/[₹,]/g, '') || '0'), 0);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><ArrowLeft size={22} color="#FFFFFF" /></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Camera size={20} color="#E8701A" />
          <Text style={s.headerTitle}>Event Calendar</Text>
        </View>
        <TouchableOpacity style={s.addBtn}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Revenue Banner */}
      <View style={s.revenueBanner}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>Pipeline Value</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#E8701A', marginTop: 2 }}>
            ₹{totalValue.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={s.statsInline}>
          <View style={s.miniStat}><Text style={[s.miniStatNum, { color: '#3B82F6' }]}>{events.filter(e => e.status === 'Confirmed').length}</Text><Text style={s.miniStatLabel}>Confirmed</Text></View>
          <View style={s.miniStat}><Text style={[s.miniStatNum, { color: '#F59E0B' }]}>{events.filter(e => e.status === 'Pending').length}</Text><Text style={s.miniStatLabel}>Pending</Text></View>
          <View style={s.miniStat}><Text style={[s.miniStatNum, { color: '#10B981' }]}>{events.filter(e => e.status === 'Completed').length}</Text><Text style={s.miniStatLabel}>Done</Text></View>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
          {events.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#94A3B8' }}>No event bookings scheduled.</Text>
            </View>
          ) : (
            events.map(event => (
              <View key={event.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.eventName}>{event.eventName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <View style={s.typeBadge}><Text style={s.typeText}>{event.type}</Text></View>
                      <Text style={s.statusText}>{event.status}</Text>
                    </View>
                  </View>
                  <Text style={s.valueText}>{event.value}</Text>
                </View>

                <View style={s.divider} />

                <View style={s.metaGrid}>
                  <View style={s.metaItem}><Calendar size={12} color="#94A3B8" /><Text style={s.metaText}>{event.date}</Text></View>
                  <View style={s.metaItem}><Clock size={12} color="#94A3B8" /><Text style={s.metaText}>{event.time}</Text></View>
                  <View style={s.metaItem}><MapPin size={12} color="#94A3B8" /><Text style={s.metaText}>{event.venue}</Text></View>
                </View>

                {event.status !== 'Completed' && (
                  <View style={s.cardFooter}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {event.status === 'Pending' && (
                        <TouchableOpacity style={[s.btn, { backgroundColor: '#10B981', flex: 2 }]} onPress={() => updateStatus(event.id, 'Confirmed')}>
                          <CheckCircle size={13} color="white" />
                          <Text style={s.btnText}>Confirm Booking</Text>
                        </TouchableOpacity>
                      )}
                      {event.status === 'Confirmed' && (
                        <TouchableOpacity style={[s.btn, { backgroundColor: '#2563EB', flex: 2 }]} onPress={() => updateStatus(event.id, 'Completed')}>
                          <Text style={[s.btnText, { color: 'white' }]}>Mark Completed</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={[s.btn, { backgroundColor: 'rgba(255,255,255,0.1)', flex: 1 }]}>
                        <Phone size={13} color="#FFFFFF" />
                        <Text style={[s.btnText, { color: '#FFFFFF' }]}>Call</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#0a1c3a', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8701A', alignItems: 'center', justifyContent: 'center' },
  revenueBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a1c3a', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  statsInline: { flexDirection: 'row', gap: 8 },
  miniStat: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  miniStatNum: { fontSize: 16, fontWeight: '800' },
  miniStatLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '600' },
  card: { backgroundColor: '#0a1c3a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 14 },
  eventName: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  typeBadge: { backgroundColor: 'rgba(232, 112, 26, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '700', color: '#E8701A' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#60A5FA' },
  valueText: { fontSize: 15, fontWeight: '800', color: '#10B981' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  metaGrid: { padding: 14, gap: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#CBD5E1', flex: 1 },
  cardFooter: { padding: 14, paddingTop: 0 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10 },
  btnText: { fontSize: 12, fontWeight: '700', color: 'white' },
});
