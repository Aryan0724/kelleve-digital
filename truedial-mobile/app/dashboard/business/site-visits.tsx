/**
 * Site Visits
 * Unique tab for: Builder, Interior Designer, Real Estate, Architect
 * Ported from: truedial-frontend/src/app/dashboard/vendor/site-visits/page.tsx
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import {
  ArrowLeft, CalendarCheck, MapPin, Clock, User, Plus, X,
  CheckCircle, Phone, FileText, Navigation
} from 'lucide-react-native';

const MOCK_VISITS = [
  { id: 1, clientName: 'Rohit & Sunita Kumar', phone: '9876541234', address: '301 Skyline Towers, Andheri West, Mumbai', projectType: '3BHK Interior Design', date: 'Today', time: '11:00 AM', status: 'Confirmed', notes: 'Client wants a modern minimalist look. Budget ~₹12L.' },
  { id: 2, clientName: 'Vinay Mehta', phone: '9812345678', address: 'Plot 14, Sector 4, Kharghar, Navi Mumbai', projectType: 'New Construction – Duplex', date: 'Tomorrow', time: '10:30 AM', status: 'Pending', notes: 'Wants vastu-compliant layout. Send portfolio beforehand.' },
  { id: 3, clientName: 'Riya Sharma', phone: '9900001111', address: '12 Green Avenue, Thane West', projectType: 'Kitchen Remodel', date: 'Fri, 22 Aug', time: '3:00 PM', status: 'Pending', notes: 'Interested in modular kitchen.' },
  { id: 4, clientName: 'Aditya Construction Co.', phone: '9823456789', address: 'Survey No. 88, Pune-Mumbai Hwy, Panvel', projectType: 'Commercial Office Fitout', date: 'Last Monday', time: '9:00 AM', status: 'Completed', notes: 'Signed contract. ₹45L project.' },
];

function Badge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Confirmed: ['#DBEAFE', '#2563EB'],
    Pending:   ['#FEF3C7', '#D97706'],
    Completed: ['#D1FAE5', '#059669'],
    Cancelled: ['#FEE2E2', '#DC2626'],
  };
  const [bg, text] = map[status] || ['#F1F5F9', '#64748B'];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
      <Text style={{ color: text, fontSize: 11, fontWeight: '700' }}>{status}</Text>
    </View>
  );
}

export default function SiteVisitsScreen() {
  const router = useRouter();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/site-visits');
      setVisits(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ clientName: '', phone: '', address: '', projectType: '', date: '', time: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const updateStatus = (id: number, status: string) =>
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status } : v));

  const handleAdd = () => {
    if (!form.clientName.trim() || !form.address.trim()) {
      return Alert.alert('Required', 'Client name and address are required');
    }
    setSubmitting(true);
    setTimeout(() => {
      setVisits(prev => [...prev, { ...form, id: Date.now(), status: 'Pending' }]);
      setShowAdd(false);
      setForm({ clientName: '', phone: '', address: '', projectType: '', date: '', time: '', notes: '' });
      setSubmitting(false);
    }, 800);
  };

  const todayVisits = visits.filter(v => v.date === 'Today' || v.date === 'Tomorrow');
  const pendingCount = visits.filter(v => v.status === 'Pending').length;
  const confirmedCount = visits.filter(v => v.status === 'Confirmed').length;
  const doneCount = visits.filter(v => v.status === 'Completed').length;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <CalendarCheck size={20} color="#8B5CF6" />
          <Text style={s.headerTitle}>Site Visits</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#F59E0B' }]}>{pendingCount}</Text><Text style={s.statLabel}>Pending</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#3B82F6' }]}>{confirmedCount}</Text><Text style={s.statLabel}>Confirmed</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#10B981' }]}>{doneCount}</Text><Text style={s.statLabel}>Completed</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#8B5CF6' }]}>{todayVisits.length}</Text><Text style={s.statLabel}>This Week</Text></View>
      </View>

      {loading ? (
        <View style={{flex:1, justifyContent:\'center\', alignItems:\'center\', marginTop: 40}}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
        {visits.map(visit => (
          <TouchableOpacity key={visit.id} activeOpacity={0.9} onPress={() => setExpanded(expanded === visit.id ? null : visit.id)}>
            <View style={[s.card, visit.status === 'Completed' && { opacity: 0.75 }]}>
              <View style={s.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.clientName}>{visit.clientName}</Text>
                  <Text style={s.projectType}>{visit.projectType}</Text>
                </View>
                <Badge status={visit.status} />
              </View>

              <View style={s.infoRow}>
                <View style={s.infoItem}><MapPin size={13} color="#94A3B8" /><Text style={s.infoText} numberOfLines={1}>{visit.address}</Text></View>
                <View style={s.infoItem}><Clock size={13} color="#94A3B8" /><Text style={s.infoText}>{visit.date} at {visit.time}</Text></View>
              </View>

              {/* Expanded Notes */}
              {expanded === visit.id && (
                <View style={s.notesBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <FileText size={13} color="#8B5CF6" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#8B5CF6' }}>Visit Notes</Text>
                  </View>
                  <Text style={s.notesText}>{visit.notes || 'No notes added.'}</Text>
                </View>
              )}

              {/* Actions */}
              {visit.status !== 'Completed' && (
                <View style={s.actionsRow}>
                  {visit.status === 'Pending' && (
                    <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#10B981', flex: 2 }]} onPress={() => updateStatus(visit.id, 'Confirmed')}>
                      <CheckCircle size={13} color="white" />
                      <Text style={s.actionBtnText}>Confirm Visit</Text>
                    </TouchableOpacity>
                  )}
                  {visit.status === 'Confirmed' && (
                    <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#DBEAFE', flex: 2 }]} onPress={() => updateStatus(visit.id, 'Completed')}>
                      <CheckCircle size={13} color="#2563EB" />
                      <Text style={[s.actionBtnText, { color: '#2563EB' }]}>Mark Done</Text>
                    </TouchableOpacity>
                  )}
                  {visit.phone ? (
                    <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', flex: 1 }]}>
                      <Phone size={13} color="#64748B" />
                      <Text style={[s.actionBtnText, { color: '#64748B' }]}>Call</Text>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#F3E8FF', flex: 1 }]}>
                    <Navigation size={13} color="#8B5CF6" />
                    <Text style={[s.actionBtnText, { color: '#8B5CF6' }]}>Directions</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Visit Modal */}
      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setShowAdd(false)}><X size={22} color="#64748B" /></TouchableOpacity>
            <Text style={s.modalTitle}>Schedule Site Visit</Text>
            <TouchableOpacity style={s.saveBtn} onPress={handleAdd} disabled={submitting}>
              {submitting ? <ActivityIndicator size="small" color="white" /> : <Text style={s.saveBtnText}>Add</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
            {[
              { key: 'clientName', label: 'Client Name *', placeholder: 'e.g. Rohit Kumar' },
              { key: 'phone', label: 'Phone', placeholder: '10-digit number' },
              { key: 'address', label: 'Site Address *', placeholder: 'Full address' },
              { key: 'projectType', label: 'Project Type', placeholder: 'e.g. 3BHK Interior Design' },
              { key: 'date', label: 'Date', placeholder: 'e.g. Tomorrow, 22 Aug' },
              { key: 'time', label: 'Time', placeholder: 'e.g. 11:00 AM' },
              { key: 'notes', label: 'Notes', placeholder: 'Any special instructions...' },
            ].map(f => (
              <View key={f.key}>
                <Text style={s.fieldLabel}>{f.label}</Text>
                <TextInput
                  style={s.fieldInput}
                  placeholder={f.placeholder}
                  placeholderTextColor="#94A3B8"
                  value={(form as any)[f.key]}
                  onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                  multiline={f.key === 'notes' || f.key === 'address'}
                  numberOfLines={f.key === 'notes' ? 3 : 1}
                />
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
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  card: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 14, paddingBottom: 8 },
  clientName: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  projectType: { fontSize: 12, color: '#8B5CF6', fontWeight: '600' },
  infoRow: { paddingHorizontal: 14, paddingBottom: 12, gap: 5 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 12, color: '#64748B', flex: 1 },
  notesBox: { marginHorizontal: 14, marginBottom: 10, backgroundColor: '#F3E8FF', borderRadius: 10, padding: 12 },
  notesText: { fontSize: 13, color: '#6B21A8', lineHeight: 19 },
  actionsRow: { flexDirection: 'row', gap: 8, padding: 14, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10 },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: 'white' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: 'white' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  saveBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10 },
  saveBtnText: { color: 'white', fontWeight: '800', fontSize: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  fieldInput: { backgroundColor: 'white', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: '#1E293B' },
});
