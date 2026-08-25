/**
 * Kitchen Display System (KDS)
 * Tab for Food & Beverage vendors (Restaurant, Cafe, etc.)
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChefHat, Clock, Flame, Check, CheckCircle } from 'lucide-react-native';
import api from '../../../services/api';

function timerColor(mins: number) {
  if (mins >= 20) return { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626' };
  if (mins >= 10) return { bg: '#FEF3C7', border: '#FCD34D', text: '#D97706' };
  return { bg: '#ECFDF5', border: '#6EE7B7', text: '#059669' };
}

function typeColor(type: string) {
  if (type === 'Dine-In') return '#3B82F6';
  if (type === 'Delivery') return '#8B5CF6';
  return '#E8701A';
}

export default function KitchenDisplayScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/orders?type=kitchen');
      setTickets(res.data?.data || res.data || []);
    } catch {
      setTickets([
        {
          id: "ORD-101",
          type: "Dine-In",
          table: "Table 4",
          timeElapsed: 12,
          status: "preparing",
          items: [
            { name: "Paneer Butter Masala", qty: 1, notes: "Extra spicy" },
            { name: "Butter Naan", qty: 4, notes: "" },
          ],
        },
        {
          id: "ORD-102",
          type: "Delivery",
          table: "Swiggy #904",
          timeElapsed: 4,
          status: "new",
          items: [
            { name: "Chicken Biryani", qty: 2, notes: "With raita" },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTickets(prev => prev.map(t => ({
        ...t,
        timeElapsed: t.status !== 'ready' ? t.timeElapsed + 1 : t.timeElapsed
      })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (newStatus === 'ready') {
      setTimeout(() => setTickets(prev => prev.filter(t => t.id !== id)), 3000);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChefHat size={20} color="#E8701A" />
          <Text style={s.headerTitle}>Kitchen Display (KDS)</Text>
        </View>
        <View style={s.liveChip}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Ticker Counts */}
      <View style={s.statsRow}>
        <View style={s.statBubble}><Text style={[s.statNum, { color: '#3B82F6' }]}>{tickets.filter(t => t.status === 'new').length}</Text><Text style={s.statLabel}>New</Text></View>
        <View style={s.statBubble}><Text style={[s.statNum, { color: '#F59E0B' }]}>{tickets.filter(t => t.status === 'preparing').length}</Text><Text style={s.statLabel}>Cooking</Text></View>
        <View style={s.statBubble}><Text style={[s.statNum, { color: '#10B981' }]}>{tickets.filter(t => t.status === 'ready').length}</Text><Text style={s.statLabel}>Ready</Text></View>
      </View>

      {/* Ticket List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}>
          {tickets.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
              <CheckCircle size={60} color="#10B981" />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginTop: 16 }}>All caught up!</Text>
              <Text style={{ color: '#94A3B8', marginTop: 4 }}>Waiting for new orders...</Text>
            </View>
          ) : (
            tickets.map(ticket => {
              const tc = timerColor(ticket.timeElapsed);
              const isReady = ticket.status === 'ready';
              const isLate = ticket.timeElapsed >= 20 && !isReady;

              return (
                <View key={ticket.id} style={[s.card, isLate && s.cardLate, isReady && s.cardReady]}>
                  {/* Card Header */}
                  <View style={[s.cardHeader, isLate && { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <Text style={s.ticketId}>#{ticket.id}</Text>
                        <View style={{ backgroundColor: typeColor(ticket.type), paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                          <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>{ticket.type}</Text>
                        </View>
                      </View>
                      <Text style={s.ticketTable}>{ticket.table}</Text>
                    </View>
                    <View style={[s.timerBadge, { backgroundColor: tc.bg, borderColor: tc.border }]}>
                      <Clock size={12} color={tc.text} />
                      <Text style={[s.timerText, { color: tc.text }]}>{ticket.timeElapsed}m</Text>
                    </View>
                  </View>

                  {/* Items */}
                  <View style={s.itemsList}>
                    {ticket.items.map((item: any, i: number) => (
                      <View key={i} style={[s.itemRow, i < ticket.items.length - 1 && s.itemRowBorder]}>
                        <View style={s.qtyBadge}><Text style={s.qtyText}>{item.qty}x</Text></View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.itemName}>{item.name}</Text>
                          {item.notes ? (
                            <View style={s.notesBubble}><Text style={s.notesText}>* {item.notes}</Text></View>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Action Button */}
                  <View style={s.cardFooter}>
                    {ticket.status === 'new' && (
                      <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#3B82F6' }]} onPress={() => updateStatus(ticket.id, 'preparing')}>
                        <Flame size={16} color="white" />
                        <Text style={s.actionBtnText}>Start Cooking</Text>
                      </TouchableOpacity>
                    )}
                    {ticket.status === 'preparing' && (
                      <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#10B981' }]} onPress={() => updateStatus(ticket.id, 'ready')}>
                        <Check size={16} color="white" />
                        <Text style={s.actionBtnText}>Mark Ready</Text>
                      </TouchableOpacity>
                    )}
                    {ticket.status === 'ready' && (
                      <View style={[s.actionBtn, { backgroundColor: '#10B981', flexDirection: 'row', justifyContent: 'center', gap: 6 }]}>
                        <CheckCircle size={16} color="white" />
                        <Text style={[s.actionBtnText, { color: 'white' }]}>Ready to Serve</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
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
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  liveText: { fontSize: 11, fontWeight: '800', color: '#10B981' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10, backgroundColor: '#0a1c3a' },
  statBubble: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  card: {
    backgroundColor: '#0a1c3a', borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  cardLate: { borderColor: '#EF4444' },
  cardReady: { borderColor: '#10B981', opacity: 0.85 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.03)' },
  ticketId: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  ticketTable: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  timerText: { fontSize: 12, fontWeight: '700' },
  itemsList: { padding: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8 },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  qtyBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', lineHeight: 20 },
  notesBubble: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start' },
  notesText: { color: '#F87171', fontSize: 11, fontWeight: '600' },
  cardFooter: { padding: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 12 },
  actionBtnText: { color: 'white', fontSize: 14, fontWeight: '800' },
});
