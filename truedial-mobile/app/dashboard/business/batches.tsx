/**
 * Batch Schedule
 * Unique tab for: Education vendors (Coaching, School, Music/Dance Academy)
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, GraduationCap, Users, Clock, BookOpen, Plus, Calendar } from 'lucide-react-native';
import api from '../../../services/api';

const BATCHES = [
  { id: 1, name: 'JEE Main Batch 2026', subject: 'Physics + Chemistry + Math', teacher: 'Dr. Ramesh Gupta', students: 45, capacity: 50, timing: 'Mon-Fri | 7:00 AM – 9:00 AM', startDate: 'Aug 1', endDate: 'Mar 31', status: 'Active', level: 'Advanced' },
  { id: 2, name: 'Class X Board Prep', subject: 'All Subjects', teacher: 'Mrs. Sunita Sharma', students: 30, capacity: 35, timing: 'Mon-Sat | 4:00 PM – 6:00 PM', startDate: 'Jul 15', endDate: 'Feb 28', status: 'Active', level: 'Intermediate' },
  { id: 3, name: 'NEET Biology Crash Course', subject: 'Biology', teacher: 'Dr. Priya Iyer', students: 60, capacity: 60, timing: 'Sat-Sun | 9:00 AM – 1:00 PM', startDate: 'Sep 1', endDate: 'Nov 30', status: 'Starting Soon', level: 'Advanced' },
  { id: 4, name: 'Class VI-VIII Foundation', subject: 'Math + Science', teacher: 'Mr. Kapil Mehta', students: 22, capacity: 30, timing: 'Mon-Wed-Fri | 5:00 PM – 6:30 PM', startDate: 'Jun 1', endDate: 'Apr 30', status: 'Active', level: 'Beginner' },
];

const LEVEL_COLORS: Record<string, string> = {
  Advanced: '#8B5CF6',
  Intermediate: '#3B82F6',
  Beginner: '#10B981',
};

export default function BatchScheduleScreen() {
  const router = useRouter();
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/batches');
      setBatches(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'All' ? batches : batches.filter(b => b.status === filter);
  const totalStudents = batches.reduce((a, b) => a + (b.students || 0), 0);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><ArrowLeft size={22} color="#1E293B" /></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <GraduationCap size={20} color="#059669" />
          <Text style={s.headerTitle}>Batch Schedule</Text>
        </View>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: '#059669' }]}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={s.statsRow}>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#059669' }]}>{batches.filter(b => b.status === 'Active').length}</Text><Text style={s.statLabel}>Active</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#3B82F6' }]}>{totalStudents}</Text><Text style={s.statLabel}>Students</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#F59E0B' }]}>{batches.filter(b => b.status === 'Starting Soon').length}</Text><Text style={s.statLabel}>Upcoming</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#8B5CF6' }]}>{batches.length}</Text><Text style={s.statLabel}>Total</Text></View>
      </View>

      {/* Filter */}
      <View style={s.filterRow}>
        {['All', 'Active', 'Starting Soon', 'Completed'].map(f => (
          <TouchableOpacity key={f} style={[s.filterTab, filter === f && s.filterTabActive]} onPress={() => setFilter(f)}>
            <Text style={[s.filterLabel, filter === f && s.filterLabelActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop: 40}}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <GraduationCap size={48} color="#E2E8F0" />
              <Text style={{ color: '#94A3B8', marginTop: 12, fontWeight: '600' }}>No batches found</Text>
            </View>
          ) : filtered.map(batch => {
            const fill = Math.round(((batch.students || 0) / (batch.capacity || 1)) * 100);
            const isFull = (batch.students || 0) >= (batch.capacity || 1);
            const levelColor = LEVEL_COLORS[batch.level] || '#64748B';
            return (
              <View key={batch.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.batchName}>{batch.name}</Text>
                    <Text style={s.subjectName}>{batch.subject}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <View style={[s.levelBadge, { backgroundColor: levelColor + '20', borderColor: levelColor + '40' }]}>
                      <Text style={[s.levelText, { color: levelColor }]}>{batch.level}</Text>
                    </View>
                    <View style={{ backgroundColor: batch.status === 'Active' ? '#D1FAE5' : '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: batch.status === 'Active' ? '#059669' : '#D97706' }}>{batch.status}</Text>
                    </View>
                  </View>
                </View>

                <View style={s.metaGrid}>
                  <View style={s.metaItem}><BookOpen size={12} color="#94A3B8" /><Text style={s.metaText}>{batch.teacher}</Text></View>
                  <View style={s.metaItem}><Clock size={12} color="#94A3B8" /><Text style={s.metaText}>{batch.timing}</Text></View>
                  <View style={s.metaItem}><Calendar size={12} color="#94A3B8" /><Text style={s.metaText}>{batch.startDate} → {batch.endDate}</Text></View>
                </View>

                {/* Enrollment Bar */}
                <View style={{ marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <View style={s.metaItem}><Users size={12} color="#94A3B8" /><Text style={s.metaText}>{batch.students}/{batch.capacity} students</Text></View>
                    {isFull && <Text style={{ fontSize: 10, fontWeight: '800', color: '#EF4444' }}>FULL</Text>}
                  </View>
                  <View style={s.fillBarBg}>
                    <View style={[s.fillBar, { width: `${fill}%` as any, backgroundColor: isFull ? '#EF4444' : '#059669' }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingVertical: 8 },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 6, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterTab: { flex: 1, paddingVertical: 7, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#059669' },
  filterLabel: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  filterLabelActive: { color: 'white' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  batchName: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  subjectName: { fontSize: 12, color: '#059669', fontWeight: '600' },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  levelText: { fontSize: 10, fontWeight: '700' },
  metaGrid: { gap: 5 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#64748B' },
  fillBarBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  fillBar: { height: '100%', borderRadius: 3 },
});
