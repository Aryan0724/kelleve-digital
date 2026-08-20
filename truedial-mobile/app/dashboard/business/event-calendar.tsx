/**
 * Event Calendar
 * Unique tab for: Events vendors (Wedding Planner, Photographer, DJ, Decorator)
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, MapPin, Clock, IndianRupee, Calendar, CheckCircle, Phone, Plus } from 'lucide-react-native';
import api from '../../../services/api';

const EVENTS = [
  { id: 1, eventName: 'Sharma Wedding Reception', type: 'Wedding Photography', client: 'Rohit & Priya Sharma', venue: 'The Grand Ballroom, BKC Mumbai', date: 'Sat, Aug 23', time: '6:00 PM – 11:00 PM', value: '₹75,000', status: 'Confirmed', team: 3 },
  { id: 2, eventName: 'Mehta Corporate Event', type: 'Corporate Photography', client: 'TechFlow Solutions Pvt Ltd', venue: 'Taj Lands End, Bandra', date: 'Fri, Aug 29', time: '10:00 AM – 4:00 PM', value: '₹35,000', status: 'Pending', team: 2 },
  { id: 3, eventName: 'Iyer Pre-Wedding Shoot', type: 'Pre-Wedding Photography', client: 'Suresh & Meera Iyer', venue: 'Marine Drive, South Mumbai', date: 'Sun, Sep 7', time: '5:30 AM – 9:00 AM', value: '₹18,000', status: 'Confirmed', team: 2 },
  { id: 4, eventName: 'Kapoor 25th Anniversary', type: 'Portrait Photography', client: 'Rajesh & Sunita Kapoor', venue: 'Residence, Juhu', date: 'Sat, Aug 16', time: '4:00 PM – 8:00 PM', value: '₹22,000', status: 'Completed', team: 1 },
];

function Badge({ status }: { status: string }) {
  const m: Record<string, [string, string]> = {
    Confirmed: ['#DBEAFE', '#2563EB'],
    Pending:   ['#FEF3C7', '#D97706'],
    Completed: ['#D1FAE5', '#059669'],
  };
  const [bg, text] = m[status] || ['#F1F5F9', '#64748B'];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
      <Text style={{ color: text, fontSize: 11, fontWeight: '700' }}>{status}</Text>
    </View>
  );
}

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
    } catch (e) {
      console.error(e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: number, status: string) =>
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));

  const totalValue = events.filter(e => e.status !== 'Cancelled')
    .reduce((a, e) => a + parseInt(String(e.value || '0').replace(/[₹,]/g, '') || '0'), 0);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><ArrowLeft size={22} color="#1E293B" /></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Camera size={20} color="#EC4899" />
          <Text style={s.headerTitle}>Event Calendar</Text>
        </View>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: '#EC4899' }]}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Revenue Banner */}
      <View style={s.revenueBanner}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600' }}>Pipeline Value</Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#1E293B', marginTop: 2 }}>
            ₹{totalValue.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={s.statsInline}>
          <View style={s.miniStat}><Text style={[s.miniStatNum, { color: '#3B82F6' }]}>{events.filter(e => e.status === 'Confirmed').length}</Text><Text style={s.miniStatLabel}>Confirmed</Text></View>
          <View style={s.miniStat}><Text style={[s.miniStatNum, { color: '#F59E0B' }]}>{events.filter(e => e.status === 'Pending').length}</Text><Text style={s.miniStatLabel}>Pending</Text></View>
          <View style={s.miniStat}><Text style={[s.miniStatNum, { color: '#10B981' }]}>{events.filter(e => e.status === 'Completed').length}</Text><Text style={s.miniStatLabel}>Done</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
        {events.map(event => (
          <View key={event.id} style={s.card}>
            <View style={s.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.eventName}>{event.eventName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                  <View style={s.typeBadge}><Text style={s.typeText}>{event.type}</Text></View>
                </View>
              </View>
              <Badge status={event.status} />
            </View>

            <View style={s.divider} />

      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop: 40}}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
          {events.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Calendar size={60} color="#E2E8F0" />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 16 }}>No events found</Text>
            </View>
          ) : events.map(event => (
            <View key={event.id} style={s.card}>
              <View style={s.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.eventName}>{event.eventName}</Text>
                  <Text style={s.eventType}>{event.type}</Text>
                </View>
                <Badge status={event.status} />
              </View>

              <View style={s.cardBody}>
                <View style={s.clientRow}>
                  <Text style={s.clientName}>{event.client}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <IndianRupee size={16} color="#EC4899" />
                    <Text style={s.valueText}>{event.value}</Text>
                  </View>
                </View>

                <View style={s.metaGrid}>
                  <View style={s.metaItem}><Calendar size={12} color="#94A3B8" /><Text style={s.metaText}>{event.date}</Text></View>
                  <View style={s.metaItem}><Clock size={12} color="#94A3B8" /><Text style={s.metaText}>{event.time}</Text></View>
                  <View style={s.metaItem}><MapPin size={12} color="#94A3B8" /><Text style={s.metaText}>{event.venue}</Text></View>
                </View>
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
                      <TouchableOpacity style={[s.btn, { backgroundColor: '#DBEAFE', flex: 2 }]} onPress={() => updateStatus(event.id, 'Completed')}>
                        <Text style={[s.btnText, { color: '#2563EB' }]}>Mark Completed</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', flex: 1 }]}>
                      <Phone size={13} color="#64748B" />
                      <Text style={[s.btnText, { color: '#64748B' }]}>Call</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 14, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  revenueBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statsInline: { flexDirection: 'row', gap: 10 },
  miniStat: { alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  miniStatNum: { fontSize: 18, fontWeight: '800' },
  miniStatLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  card: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 14, paddingBottom: 10 },
  eventName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  typeBadge: { backgroundColor: '#FDF4FF', borderWidth: 1, borderColor: '#F3E8FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '700', color: '#EC4899' },
  divider: { height: 1, backgroundColor: '#F8FAFC', marginHorizontal: 14 },
  metaBlock: { padding: 14, paddingTop: 10, paddingBottom: 10, gap: 5 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#64748B', flex: 1 },
  cardFooter: { flexDirection: 'row', gap: 8, padding: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10 },
  btnText: { fontSize: 12, fontWeight: '700', color: 'white' },
});
