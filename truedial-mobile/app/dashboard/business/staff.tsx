/**
 * Staff & Resource Management Screen
 * Tab for Salons, Clinics, Spas, Service Workshops
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Phone, Calendar, Plus, CheckCircle } from 'lucide-react-native';
import api from '../../../services/api';

export default function StaffManagementScreen() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/staff');
      setStaffList(res.data?.data || res.data || []);
    } catch {
      setStaffList([
        {
          id: 1,
          name: "Pooja Sharma",
          role: "Senior Hair Stylist & Makeup Artist",
          phone: "9876543201",
          available: true,
          appointmentsToday: 4,
          rating: 4.9,
        },
        {
          id: 2,
          name: "Rohan Verma",
          role: "Nail Care & Facial Specialist",
          phone: "9876543202",
          available: false,
          appointmentsToday: 2,
          rating: 4.7,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = (id: number) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, available: !s.available } : s));
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Users size={20} color="#E8701A" />
          <Text style={s.headerTitle}>Staff & Team Management</Text>
        </View>
        <TouchableOpacity style={s.addBtn}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Header Stats */}
      <View style={s.statsRow}>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#10B981' }]}>{staffList.filter(s => s.available).length}</Text><Text style={s.statLabel}>Available</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#60A5FA' }]}>{staffList.reduce((acc, s) => acc + s.appointmentsToday, 0)}</Text><Text style={s.statLabel}>Appts Today</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#E8701A' }]}>{staffList.length}</Text><Text style={s.statLabel}>Total Staff</Text></View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 14 }}>
          {staffList.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Users size={48} color="#94A3B8" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginTop: 12 }}>No staff members added.</Text>
            </View>
          ) : (
            staffList.map(member => (
              <View key={member.id} style={s.card}>
                <View style={s.cardTop}>
                  <View style={s.avatar}>
                    <Text style={s.avatarText}>
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.staffName}>{member.name}</Text>
                    <Text style={s.staffRole}>{member.role}</Text>
                  </View>

                  <Switch
                    value={member.available}
                    onValueChange={() => toggleAvailability(member.id)}
                    trackColor={{ false: "#334155", true: "#10B981" }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={s.cardMeta}>
                  <View style={s.metaItem}>
                    <Calendar size={13} color="#94A3B8" />
                    <Text style={s.metaText}>{member.appointmentsToday} appointments today</Text>
                  </View>
                  <View style={s.metaItem}>
                    <CheckCircle size={13} color={member.available ? "#10B981" : "#F87171"} />
                    <Text style={[s.metaText, { color: member.available ? "#10B981" : "#F87171", fontWeight: "700" }]}>
                      {member.available ? "Duty Active" : "On Leave / Off"}
                    </Text>
                  </View>
                </View>

                <View style={s.cardFooter}>
                  <TouchableOpacity style={s.callBtn}>
                    <Phone size={13} color="#FFFFFF" />
                    <Text style={s.callBtnText}>Call Staff</Text>
                  </TouchableOpacity>
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
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(232, 112, 26, 0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#E8701A', fontSize: 16, fontWeight: '800' },
  staffName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  staffRole: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  cardMeta: { gap: 6, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginVertical: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#CBD5E1' },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  callBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
