/**
 * Housekeeping Board
 * Unique tab for: Hospitality vendors (Hotel, Resort, PG, Guest House)
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Hotel, CheckCircle, Clock, AlertCircle, Bed } from 'lucide-react-native';

const ROOMS = [
  { id: 101, type: 'Deluxe', floor: 1, status: 'Dirty', guest: 'Checked Out', priority: 'High' },
  { id: 102, type: 'Suite', floor: 1, status: 'Occupied', guest: 'Mr. Rohit Kumar', priority: 'Low' },
  { id: 103, type: 'Standard', floor: 1, status: 'Clean', guest: 'Vacant', priority: 'None' },
  { id: 201, type: 'Deluxe', floor: 2, status: 'In Progress', guest: 'Checking In @ 2PM', priority: 'High' },
  { id: 202, type: 'Standard', floor: 2, status: 'Dirty', guest: 'Checked Out', priority: 'Normal' },
  { id: 203, type: 'Suite', floor: 2, status: 'Occupied', guest: 'Mrs. Priya Iyer', priority: 'Low' },
  { id: 301, type: 'Deluxe', floor: 3, status: 'Clean', guest: 'Vacant', priority: 'None' },
  { id: 302, type: 'Standard', floor: 3, status: 'Dirty', guest: 'Checked Out', priority: 'Normal' },
];

function statusStyle(status: string) {
  const map: Record<string, [string, string, string]> = {
    'Dirty':       ['#FEF2F2', '#EF4444', '#FECACA'],
    'In Progress': ['#FEF3C7', '#D97706', '#FDE68A'],
    'Clean':       ['#ECFDF5', '#059669', '#A7F3D0'],
    'Occupied':    ['#EFF6FF', '#2563EB', '#BFDBFE'],
  };
  return map[status] || ['#F8FAFC', '#64748B', '#E2E8F0'];
}

export default function HousekeepingScreen() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/rooms/housekeeping');
      setRooms(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: number, status: string) =>
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  const floors = [...new Set(rooms.map(r => r.floor))].sort();
  const filtered = filter === 'All' ? rooms : rooms.filter(r => r.status === filter);

  const counts = {
    Dirty: rooms.filter(r => r.status === 'Dirty').length,
    'In Progress': rooms.filter(r => r.status === 'In Progress').length,
    Clean: rooms.filter(r => r.status === 'Clean').length,
    Occupied: rooms.filter(r => r.status === 'Occupied').length,
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><ArrowLeft size={22} color="#1E293B" /></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Hotel size={20} color="#F59E0B" />
          <Text style={s.headerTitle}>Housekeeping</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {Object.entries(counts).map(([label, count]) => {
          const [bg, text] = statusStyle(label);
          return (
            <TouchableOpacity key={label} style={[s.statBox, { backgroundColor: bg }, filter === label && { borderColor: text, borderWidth: 2 }]} onPress={() => setFilter(filter === label ? 'All' : label)}>
              <Text style={[s.statNum, { color: text }]}>{count}</Text>
              <Text style={[s.statLabel, { color: text }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop: 40}}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}>
          {floors.map(floor => {
            const floorRooms = filtered.filter(r => r.floor === floor);
            if (floorRooms.length === 0) return null;
            return (
              <View key={floor}>
                <Text style={s.floorLabel}>Floor {floor}</Text>
                <View style={s.roomGrid}>
                  {floorRooms.map(room => {
                    const [bg, text, border] = statusStyle(room.status);
                    return (
                      <View key={room.id} style={[s.roomCard, { backgroundColor: bg, borderColor: border }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                          <Text style={[s.roomId, { color: text }]}>Room {room.id}</Text>
                          {room.priority === 'High' && (
                            <AlertCircle size={14} color="#EF4444" />
                          )}
                        </View>
                        <Text style={s.roomType}>{room.type}</Text>
                        <Text style={s.guestName} numberOfLines={1}>{room.guest}</Text>
                        <View style={{ flexDirection: 'row', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                          {room.status === 'Dirty' && (
                            <TouchableOpacity style={[s.roomBtn, { backgroundColor: '#F59E0B' }]} onPress={() => updateStatus(room.id, 'In Progress')}>
                              <Text style={s.roomBtnText}>Start</Text>
                            </TouchableOpacity>
                          )}
                          {room.status === 'In Progress' && (
                            <TouchableOpacity style={[s.roomBtn, { backgroundColor: '#10B981' }]} onPress={() => updateStatus(room.id, 'Clean')}>
                              <CheckCircle size={11} color="white" />
                              <Text style={s.roomBtnText}>Done</Text>
                            </TouchableOpacity>
                          )}
                          {room.status === 'Clean' && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <CheckCircle size={14} color="#059669" />
                              <Text style={{ fontSize: 11, fontWeight: '700', color: '#059669' }}>Ready</Text>
                            </View>
                          )}
                          {room.status === 'Occupied' && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Bed size={12} color="#2563EB" />
                              <Text style={{ fontSize: 11, fontWeight: '700', color: '#2563EB' }}>Occupied</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, gap: 8, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statBox: { flex: 1, alignItems: 'center', borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: 'transparent' },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  floorLabel: { fontSize: 13, fontWeight: '800', color: '#64748B', marginBottom: 8, marginLeft: 2 },
  roomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  roomCard: { width: '47%', borderRadius: 14, padding: 12, borderWidth: 1.5 },
  roomId: { fontSize: 16, fontWeight: '800' },
  roomType: { fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 2 },
  guestName: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  roomBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  roomBtnText: { fontSize: 11, fontWeight: '700', color: 'white' },
});
