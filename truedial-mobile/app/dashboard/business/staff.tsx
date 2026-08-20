/**
 * Staff & Stylists
 * Unique tab for: Beauty/Salon vendors
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Modal,
  TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Users, Plus, X, Star, Clock, Scissors, Phone } from 'lucide-react-native';

const MOCK_STAFF = [
  { id: 1, name: 'Neha Sharma', role: 'Senior Stylist', speciality: 'Bridal & Hair Coloring', rating: 4.9, appointments: 12, available: true, phone: '9876500011' },
  { id: 2, name: 'Priya Iyer', role: 'Nail Artist', speciality: 'Nail Art & Extensions', rating: 4.7, appointments: 8, available: true, phone: '9876500012' },
  { id: 3, name: 'Kavita Rao', role: 'Makeup Artist', speciality: 'HD Makeup & Bridal Makeup', rating: 4.8, appointments: 5, available: false, phone: '9876500013' },
  { id: 4, name: 'Rahul Verma', role: 'Hairstylist', speciality: 'Men\'s Haircut & Beard Grooming', rating: 4.6, appointments: 15, available: true, phone: '9876500014' },
];

export default function StaffScreen() {
  const router = useRouter();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/staff');
      setStaff(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', speciality: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const toggleAvailable = (id: number) =>
    setStaff(prev => prev.map(s => s.id === id ? { ...s, available: !s.available } : s));

  const handleAdd = () => {
    if (!form.name.trim() || !form.role.trim()) return Alert.alert('Required', 'Name and role are required');
    setSubmitting(true);
    setTimeout(() => {
      setStaff(prev => [...prev, { ...form, id: Date.now(), rating: 0, appointments: 0, available: true }]);
      setShowAdd(false);
      setForm({ name: '', role: '', speciality: '', phone: '' });
      setSubmitting(false);
    }, 600);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><ArrowLeft size={22} color="#1E293B" /></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Users size={20} color="#EC4899" />
          <Text style={s.headerTitle}>Staff & Stylists</Text>
        </View>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: '#EC4899' }]} onPress={() => setShowAdd(true)}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View style={s.statsRow}>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#10B981' }]}>{staff.filter(s => s.available).length}</Text><Text style={s.statLabel}>Available</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#F43F5E' }]}>{staff.filter(s => !s.available).length}</Text><Text style={s.statLabel}>Busy</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#6366F1' }]}>{staff.reduce((a, m) => a + m.appointments, 0)}</Text><Text style={s.statLabel}>Appts Today</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#F59E0B' }]}>{staff.length}</Text><Text style={s.statLabel}>Total Staff</Text></View>
      </View>

      {loading ? (
        <View style={{flex:1, justifyContent:\'center\', alignItems:\'center\', marginTop: 40}}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
        {staff.map(member => (
          <View key={member.id} style={s.card}>
            <View style={s.cardTop}>
              <View style={[s.avatar, { backgroundColor: member.available ? '#FCE7F3' : '#F1F5F9' }]}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: member.available ? '#EC4899' : '#94A3B8' }}>
                  {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.staffName}>{member.name}</Text>
                <Text style={s.staffRole}>{member.role}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  {member.rating > 0 && (
                    <View style={s.ratingChip}>
                      <Star size={10} color="#F59E0B" fill="#F59E0B" />
                      <Text style={s.ratingText}>{member.rating}</Text>
                    </View>
                  )}
                  <View style={s.apptChip}>
                    <Clock size={10} color="#8B5CF6" />
                    <Text style={s.apptText}>{member.appointments} today</Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Switch
                  value={member.available}
                  onValueChange={() => toggleAvailable(member.id)}
                  trackColor={{ false: '#CBD5E1', true: '#10B981' }}
                  thumbColor="white"
                  style={{ transform: [{ scale: 0.85 }] }}
                />
                <Text style={{ fontSize: 9, fontWeight: '700', color: member.available ? '#10B981' : '#94A3B8' }}>
                  {member.available ? 'FREE' : 'BUSY'}
                </Text>
              </View>
            </View>
            <View style={s.cardBottom}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                <Scissors size={12} color="#EC4899" />
                <Text style={s.speciality} numberOfLines={1}>{member.speciality}</Text>
              </View>
              <TouchableOpacity style={s.callBtn}>
                <Phone size={12} color="#64748B" />
                <Text style={s.callBtnText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setShowAdd(false)}><X size={22} color="#64748B" /></TouchableOpacity>
            <Text style={s.modalTitle}>Add Staff Member</Text>
            <TouchableOpacity style={[s.saveBtn, { backgroundColor: '#EC4899' }]} onPress={handleAdd} disabled={submitting}>
              {submitting ? <ActivityIndicator size="small" color="white" /> : <Text style={s.saveBtnText}>Add</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
            {[
              { key: 'name', label: 'Full Name *', placeholder: 'Staff member name' },
              { key: 'role', label: 'Role *', placeholder: 'e.g. Senior Stylist, Nail Artist' },
              { key: 'speciality', label: 'Speciality', placeholder: 'e.g. Bridal Makeup, Hair Coloring' },
              { key: 'phone', label: 'Phone', placeholder: 'Contact number' },
            ].map(f => (
              <View key={f.key}>
                <Text style={s.fieldLabel}>{f.label}</Text>
                <TextInput style={s.fieldInput} placeholder={f.placeholder} placeholderTextColor="#94A3B8"
                  value={(form as any)[f.key]} onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))} />
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  card: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 10 },
  avatar: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  staffName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  staffRole: { fontSize: 12, color: '#8B5CF6', fontWeight: '600', marginTop: 1 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  apptChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F3E8FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  apptText: { fontSize: 11, fontWeight: '600', color: '#7C3AED' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 14, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  speciality: { fontSize: 12, color: '#64748B', flex: 1 },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  callBtnText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: 'white' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10 },
  saveBtnText: { color: 'white', fontWeight: '800', fontSize: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  fieldInput: { backgroundColor: 'white', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: '#1E293B' },
});
