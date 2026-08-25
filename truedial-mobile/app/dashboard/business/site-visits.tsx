/**
 * Site Visits & Inspection Bookings Screen
 * Tab for Architects, Interior Designers, Real Estate Agents, Contractors
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, CheckCircle, Phone, Navigation, FileText, Plus } from 'lucide-react-native';
import api from '../../../services/api';

export default function SiteVisitsScreen() {
  const router = useRouter();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/site-visits');
      setVisits(res.data?.data || res.data || []);
    } catch {
      setVisits([
        {
          id: 1,
          clientName: "Sunil Verma",
          projectType: "3BHK Villa Interior Consultation",
          address: "Road #4, Rajendra Nagar, Patna",
          date: "Today",
          time: "03:30 PM",
          status: "Confirmed",
          phone: "9876543210",
          notes: "Client wants modular kitchen + false ceiling demo samples.",
        },
        {
          id: 2,
          clientName: "Dr. Anjali Mehta",
          projectType: "Clinic Renovation Site Measurement",
          address: "Bailey Road, Patna",
          date: "Tomorrow",
          time: "11:00 AM",
          status: "Pending",
          phone: "9876543211",
          notes: "Need site visit before submitting quotation.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: number, status: string) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MapPin size={20} color="#E8701A" />
          <Text style={s.headerTitle}>Site Visits & Inspections</Text>
        </View>
        <TouchableOpacity style={s.addBtn}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Header */}
      <View style={s.statsRow}>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#F59E0B' }]}>{visits.filter(v => v.status === 'Pending').length}</Text><Text style={s.statLabel}>Pending</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#3B82F6' }]}>{visits.filter(v => v.status === 'Confirmed').length}</Text><Text style={s.statLabel}>Confirmed</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#10B981' }]}>{visits.filter(v => v.status === 'Completed').length}</Text><Text style={s.statLabel}>Completed</Text></View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 14 }}>
          {visits.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <CheckCircle size={48} color="#10B981" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginTop: 12 }}>No site visits booked.</Text>
            </View>
          ) : (
            visits.map(visit => (
              <View key={visit.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.clientName}>{visit.clientName}</Text>
                    <Text style={s.projectType}>{visit.projectType}</Text>
                  </View>
                  <Text style={s.statusText}>{visit.status}</Text>
                </View>

                <View style={s.infoBlock}>
                  <View style={s.infoRow}><MapPin size={13} color="#94A3B8" /><Text style={s.infoText}>{visit.address}</Text></View>
                  <View style={s.infoRow}><Clock size={13} color="#94A3B8" /><Text style={s.infoText}>{visit.date} at {visit.time}</Text></View>
                  {visit.notes ? (
                    <View style={s.infoRow}><FileText size={13} color="#E8701A" /><Text style={s.notesText}>{visit.notes}</Text></View>
                  ) : null}
                </View>

                <View style={s.cardFooter}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {visit.status === 'Pending' && (
                      <TouchableOpacity style={[s.btn, { backgroundColor: '#10B981', flex: 2 }]} onPress={() => updateStatus(visit.id, 'Confirmed')}>
                        <CheckCircle size={13} color="white" />
                        <Text style={s.btnText}>Confirm Visit</Text>
                      </TouchableOpacity>
                    )}
                    {visit.status === 'Confirmed' && (
                      <TouchableOpacity style={[s.btn, { backgroundColor: '#2563EB', flex: 2 }]} onPress={() => updateStatus(visit.id, 'Completed')}>
                        <CheckCircle size={13} color="white" />
                        <Text style={s.btnText}>Mark Done</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[s.btn, { backgroundColor: 'rgba(255,255,255,0.1)', flex: 1 }]}>
                      <Phone size={13} color="#FFFFFF" />
                      <Text style={[s.btnText, { color: '#FFFFFF' }]}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, { backgroundColor: 'rgba(232, 112, 26, 0.2)', flex: 1 }]}>
                      <Navigation size={13} color="#E8701A" />
                      <Text style={[s.btnText, { color: '#E8701A' }]}>Maps</Text>
                    </TouchableOpacity>
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
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8701A', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10, backgroundColor: '#0a1c3a' },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  card: { backgroundColor: '#0a1c3a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  clientName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  projectType: { fontSize: 12, color: '#E8701A', fontWeight: '600' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#60A5FA' },
  infoBlock: { gap: 6, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginVertical: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 12, color: '#CBD5E1', flex: 1 },
  notesText: { fontSize: 12, color: '#E8701A', flex: 1 },
  cardFooter: { paddingTop: 4 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10 },
  btnText: { fontSize: 12, fontWeight: '700', color: 'white' },
});
