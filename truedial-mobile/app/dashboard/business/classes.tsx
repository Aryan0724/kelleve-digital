/**
 * Class Schedule
 * Unique tab for: Fitness vendors (Gym, Yoga Studio, Dance Academy, etc.)
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Dumbbell, Users, Clock, CheckCircle, Plus, Calendar } from 'lucide-react-native';
import api from '../../../services/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MOCK_CLASSES = [
  { id: 1, name: 'Morning Yoga Flow', instructor: 'Kavita Singh', time: '6:00 AM', duration: '60 min', enrolled: 18, capacity: 20, days: ['Mon', 'Wed', 'Fri'], category: 'Yoga', color: '#10B981' },
  { id: 2, name: 'High Intensity Bootcamp', instructor: 'Rahul Mehta', time: '7:00 AM', duration: '45 min', enrolled: 12, capacity: 15, days: ['Tue', 'Thu', 'Sat'], category: 'HIIT', color: '#EF4444' },
  { id: 3, name: 'Zumba Fitness', instructor: 'Priya Kapoor', time: '6:30 PM', duration: '60 min', enrolled: 25, capacity: 30, days: ['Mon', 'Wed', 'Fri'], category: 'Dance Fitness', color: '#8B5CF6' },
  { id: 4, name: 'Strength Training', instructor: 'Amit Joshi', time: '8:00 AM', duration: '90 min', enrolled: 8, capacity: 10, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], category: 'Weights', color: '#F59E0B' },
  { id: 5, name: 'Weekend Pilates', instructor: 'Sneha Iyer', time: '9:00 AM', duration: '75 min', enrolled: 15, capacity: 16, days: ['Sat', 'Sun'], category: 'Pilates', color: '#06B6D4' },
];

export default function ClassScheduleScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/classes');
      setClasses(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const dayClasses = classes.filter(c => Array.isArray(c.days) ? c.days.includes(selectedDay) : c.days === selectedDay);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><ArrowLeft size={22} color="#1E293B" /></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Calendar size={20} color="#10B981" />
          <Text style={s.headerTitle}>Class Schedule</Text>
        </View>
        <TouchableOpacity style={[s.addBtn, { backgroundColor: '#10B981' }]}>
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <View style={s.dayStrip}>
        {DAYS.map(day => (
          <TouchableOpacity key={day} style={[s.dayTab, selectedDay === day && s.dayTabActive]} onPress={() => setSelectedDay(day)}>
            <Text style={[s.dayLabel, selectedDay === day && s.dayLabelActive]}>{day}</Text>
            <Text style={[s.dayCount, selectedDay === day && { color: 'white' }]}>
              {classes.filter(c => Array.isArray(c.days) ? c.days.includes(day) : c.days === day).length}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#10B981' }]}>{dayClasses.length}</Text><Text style={s.statLabel}>Classes</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#3B82F6' }]}>{dayClasses.reduce((a, c) => a + c.enrolled, 0)}</Text><Text style={s.statLabel}>Enrolled</Text></View>
        <View style={s.statBox}><Text style={[s.statNum, { color: '#8B5CF6' }]}>{dayClasses.reduce((a, c) => a + c.capacity, 0)}</Text><Text style={s.statLabel}>Capacity</Text></View>
      </View>

      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop: 40}}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
          {dayClasses.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Dumbbell size={48} color="#E2E8F0" />
              <Text style={{ color: '#94A3B8', marginTop: 12, fontWeight: '600' }}>No classes on {selectedDay}</Text>
            </View>
          ) : dayClasses.map(cls => {
            const fill = Math.round((cls.enrolled / cls.capacity) * 100);
            const isFull = cls.enrolled >= cls.capacity;
            return (
              <View key={cls.id} style={s.card}>
                <View style={[s.colorBar, { backgroundColor: cls.color || '#10B981' }]} />
                <View style={s.cardContent}>
                  <View style={s.cardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.className}>{cls.name}</Text>
                      <Text style={s.instructorName}>with {cls.instructor}</Text>
                    </View>
                    <View style={{ backgroundColor: (cls.color || '#10B981') + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, borderColor: (cls.color || '#10B981') + '40' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: cls.color || '#10B981' }}>{cls.category}</Text>
                    </View>
                  </View>
                  <View style={s.metaRow}>
                    <View style={s.metaItem}><Clock size={12} color="#94A3B8" /><Text style={s.metaText}>{cls.time} • {cls.duration}</Text></View>
                    <View style={s.metaItem}><Users size={12} color="#94A3B8" /><Text style={s.metaText}>{cls.enrolled}/{cls.capacity}</Text></View>
                  </View>
                  {/* Fill bar */}
                  <View style={s.fillBarBg}>
                    <View style={[s.fillBar, { width: `${fill}%` as any, backgroundColor: isFull ? '#EF4444' : (cls.color || '#10B981') }]} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '600' }}>{fill}% full</Text>
                    {isFull && <Text style={{ fontSize: 10, color: '#EF4444', fontWeight: '700' }}>FULL</Text>}
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
  dayStrip: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 10, gap: 6 },
  dayTab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' },
  dayTabActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  dayLabel: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  dayLabelActive: { color: 'white' },
  dayCount: { fontSize: 13, fontWeight: '800', color: '#94A3B8', marginTop: 1 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingVertical: 8 },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  colorBar: { width: 5 },
  cardContent: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  className: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  instructorName: { fontSize: 12, color: '#64748B' },
  metaRow: { flexDirection: 'row', gap: 14, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: '#64748B' },
  fillBarBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  fillBar: { height: '100%', borderRadius: 3 },
});
