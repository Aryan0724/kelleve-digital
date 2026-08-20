/**
 * Patient Records (EHR)
 * Unique tab for: Healthcare vendors (Doctor, Clinic, Hospital, etc.)
 * Ported from: truedial-frontend/src/app/dashboard/vendor/patients/page.tsx
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  Modal, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import {
  ArrowLeft, Users, Search, Plus, Activity, Clock,
  Phone, Stethoscope, X, ChevronRight, FilePlus
} from 'lucide-react-native';

const MOCK_PATIENTS = [
  { id: 1, name: 'Suresh Menon', patient_identifier: 'PT-1042', age: 58, gender: 'Male', blood_group: 'O+', condition: 'Hypertension', phone: '9876543210', last_visit_at: '2026-08-15T10:00:00Z', status: 'Active' },
  { id: 2, name: 'Meera Reddy', patient_identifier: 'PT-1043', age: 34, gender: 'Female', blood_group: 'A+', condition: 'Diabetes Type 2', phone: '9123456789', last_visit_at: '2026-08-18T11:30:00Z', status: 'Active' },
  { id: 3, name: 'Kiran Rao', patient_identifier: 'PT-1044', age: 45, gender: 'Male', blood_group: 'B-', condition: 'Asthma', phone: '9999900000', last_visit_at: '2026-08-10T09:00:00Z', status: 'Follow-up' },
  { id: 4, name: 'Anita Shah', patient_identifier: 'PT-1045', age: 27, gender: 'Female', blood_group: 'AB+', condition: 'Migraine', phone: '9800012345', last_visit_at: null, status: 'New' },
];

interface Patient {
  id: number;
  name: string;
  patient_identifier: string;
  age: number;
  gender: string;
  blood_group: string;
  condition: string;
  phone: string;
  last_visit_at: string | null;
  status: string;
}

export default function PatientRecordsScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', age: '', gender: '', condition: '', blood_group: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const res = await api.get('/truedial/vendor/patients');
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        setPatients(data);
        setSelected(data[0]);
        return;
      }
    } catch {}
    // Fallback to mock
    setPatients(MOCK_PATIENTS);
    setSelected(MOCK_PATIENTS[0]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPatients().finally(() => setLoading(false)); }, [fetchPatients]);

  const handleAdd = async () => {
    if (!form.name.trim()) return Alert.alert('Required', 'Patient name is required');
    setSubmitting(true);
    try {
      await api.post('/truedial/vendor/patients', { ...form, age: form.age ? parseInt(form.age) : null });
      setShowAdd(false);
      setForm({ name: '', phone: '', age: '', gender: '', condition: '', blood_group: '' });
      fetchPatients();
    } catch {
      Alert.alert('Error', 'Failed to add patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.patient_identifier?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Users size={20} color="#3B82F6" />
          <Text style={s.headerTitle}>Patient Records</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchBar}>
        <Search size={16} color="#94A3B8" />
        <TextInput
          style={s.searchInput}
          placeholder="Search name, phone, Patient ID..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Stats Row */}
      <View style={s.statsRow}>
        <View style={s.statChip}><Text style={[s.statNum, { color: '#10B981' }]}>{patients.filter(p => p.status === 'Active').length}</Text><Text style={s.statLabel}>Active</Text></View>
        <View style={s.statChip}><Text style={[s.statNum, { color: '#F59E0B' }]}>{patients.filter(p => p.status === 'Follow-up').length}</Text><Text style={s.statLabel}>Follow-up</Text></View>
        <View style={s.statChip}><Text style={[s.statNum, { color: '#3B82F6' }]}>{patients.filter(p => p.status === 'New').length}</Text><Text style={s.statLabel}>New</Text></View>
        <View style={s.statChip}><Text style={[s.statNum, { color: '#6366F1' }]}>{patients.length}</Text><Text style={s.statLabel}>Total</Text></View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
      ) : (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Patient List */}
          <ScrollView style={s.patientList} contentContainerStyle={{ paddingVertical: 8 }}>
            {filtered.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[s.patientRow, selected?.id === p.id && s.patientRowActive]}
                onPress={() => setSelected(p)}
              >
                <View style={[s.patientAvatar, selected?.id === p.id && { backgroundColor: '#DBEAFE' }]}>
                  <Text style={[s.patientAvatarText, selected?.id === p.id && { color: '#2563EB' }]}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.patientName, selected?.id === p.id && { color: '#2563EB' }]}>{p.name}</Text>
                  <Text style={s.patientMeta}>{p.patient_identifier} • {p.age}y {p.gender.charAt(0)}</Text>
                </View>
                <ChevronRight size={14} color={selected?.id === p.id ? '#3B82F6' : '#CBD5E1'} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Detail Panel */}
          {selected && (
            <ScrollView style={s.detailPanel} contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>
              {/* Patient Card */}
              <View style={s.detailCard}>
                <View style={s.detailAvatarRow}>
                  <View style={s.detailAvatar}>
                    <Text style={s.detailAvatarText}>{selected.name.slice(0, 2).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.detailName}>{selected.name}</Text>
                    <View style={s.statusBadge}>
                      <Text style={s.statusText}>{selected.status}</Text>
                    </View>
                  </View>
                </View>

                <View style={s.vitalsGrid}>
                  <View style={s.vitalBox}>
                    <Text style={s.vitalLabel}>ID</Text>
                    <Text style={s.vitalValue}>{selected.patient_identifier}</Text>
                  </View>
                  <View style={s.vitalBox}>
                    <Text style={s.vitalLabel}>Age</Text>
                    <Text style={s.vitalValue}>{selected.age} yrs</Text>
                  </View>
                  <View style={s.vitalBox}>
                    <Text style={s.vitalLabel}>Blood</Text>
                    <Text style={[s.vitalValue, { color: '#EF4444' }]}>{selected.blood_group || 'N/A'}</Text>
                  </View>
                  <View style={s.vitalBox}>
                    <Text style={s.vitalLabel}>Gender</Text>
                    <Text style={s.vitalValue}>{selected.gender}</Text>
                  </View>
                </View>

                <View style={s.conditionRow}>
                  <Activity size={14} color="#EF4444" />
                  <Text style={s.conditionText}>{selected.condition || 'No condition stated'}</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  <TouchableOpacity style={s.callBtn}>
                    <Phone size={14} color="#3B82F6" />
                    <Text style={s.callBtnText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.consultBtn}>
                    <FilePlus size={14} color="white" />
                    <Text style={s.consultBtnText}>New Consultation</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Timeline */}
              <View style={s.timelineCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                  <Stethoscope size={16} color="#3B82F6" />
                  <Text style={s.timelineTitle}>Medical History & Timeline</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <View style={s.timelineDot}><Stethoscope size={12} color="white" /></View>
                  <View style={s.timelineEntry}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={s.timelineEventTitle}>Profile Created</Text>
                      <Text style={{ fontSize: 11, color: '#3B82F6', fontWeight: '700' }}>
                        {selected.last_visit_at
                          ? new Date(selected.last_visit_at).toLocaleDateString()
                          : 'Today'}
                      </Text>
                    </View>
                    <Text style={s.timelineEventDesc}>Patient record created in TrueDial EHR system.</Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                      <View style={s.tagChip}><Clock size={10} color="#64748B" /><Text style={s.tagText}>
                        {selected.last_visit_at ? 'Last: ' + new Date(selected.last_visit_at).toLocaleDateString() : 'New Patient'}
                      </Text></View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      )}

      {/* Add Patient Modal */}
      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <X size={22} color="#64748B" />
            </TouchableOpacity>
            <Text style={s.modalTitle}>Add New Patient</Text>
            <TouchableOpacity style={s.saveBtn} onPress={handleAdd} disabled={submitting}>
              {submitting ? <ActivityIndicator size="small" color="white" /> : <Text style={s.saveBtnText}>Save</Text>}
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
            {[
              { key: 'name', label: 'Full Name *', placeholder: 'e.g. Rohit Kumar' },
              { key: 'phone', label: 'Phone Number', placeholder: '10-digit mobile' },
              { key: 'age', label: 'Age', placeholder: 'e.g. 35', keyboard: 'numeric' as const },
              { key: 'gender', label: 'Gender', placeholder: 'Male / Female / Other' },
              { key: 'blood_group', label: 'Blood Group', placeholder: 'e.g. O+' },
              { key: 'condition', label: 'Primary Condition', placeholder: 'e.g. Hypertension' },
            ].map(f => (
              <View key={f.key}>
                <Text style={s.fieldLabel}>{f.label}</Text>
                <TextInput
                  style={s.fieldInput}
                  placeholder={f.placeholder}
                  placeholderTextColor="#94A3B8"
                  value={(form as any)[f.key]}
                  onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
                  keyboardType={f.keyboard || 'default'}
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
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  searchInput: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '500' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statChip: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  statNum: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  patientList: { width: 160, borderRightWidth: 1, borderRightColor: '#F1F5F9', backgroundColor: 'white' },
  patientRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  patientRowActive: { backgroundColor: '#EFF6FF' },
  patientAvatar: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  patientAvatarText: { fontSize: 13, fontWeight: '800', color: '#475569' },
  patientName: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  patientMeta: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  detailPanel: { flex: 1, backgroundColor: '#F8FAFC' },
  detailCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  detailAvatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  detailAvatar: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
  detailAvatarText: { fontSize: 18, fontWeight: '800', color: '#2563EB' },
  detailName: { fontSize: 17, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  statusBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  vitalBox: { width: '47%', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  vitalLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', marginBottom: 2 },
  vitalValue: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', padding: 10, borderRadius: 10 },
  conditionText: { fontSize: 13, fontWeight: '600', color: '#DC2626' },
  callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10, borderWidth: 1.5, borderColor: '#BFDBFE', paddingVertical: 9 },
  callBtnText: { fontSize: 13, fontWeight: '700', color: '#3B82F6' },
  consultBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10, backgroundColor: '#10B981', paddingVertical: 9 },
  consultBtnText: { fontSize: 13, fontWeight: '700', color: 'white' },
  timelineCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  timelineTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  timelineDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  timelineEntry: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  timelineEventTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  timelineEventDesc: { fontSize: 12, color: '#64748B', marginTop: 2 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 10, color: '#64748B', fontWeight: '600' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: 'white' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  saveBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10 },
  saveBtnText: { color: 'white', fontWeight: '800', fontSize: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  fieldInput: { backgroundColor: 'white', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: '#1E293B' },
});
