/**
 * Kitchen Display System (KDS)
 * Unique tab for: Food & Beverage vendors (Restaurant, Cafe, etc.)
 * Ported from: truedial-frontend/src/app/dashboard/vendor/kitchen/page.tsx
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';
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
    } catch (e) {
      console.error(e);
      setTickets([]);
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
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
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
        <View style={s.statBubble}><Text style={[s.statNum, { color: '#EF4444' }]}>{tickets.filter(t => t.timeElapsed >= 20 && t.status !== 'ready').length}</Text><Text style={s.statLabel}>Delayed</Text></View>
      </View>

      {/* Ticket List */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}>
        {tickets.map(ticket => {
          const tc = timerColor(ticket.timeElapsed);
          const isReady = ticket.status === 'ready';
          const isLate = ticket.timeElapsed >= 20 && !isReady;

          return (
            <View key={ticket.id} style={[s.card, isLate && s.cardLate, isReady && s.cardReady]}>
              {/* Card Header */}
              <View style={[s.cardHeader, isLate && { backgroundColor: '#FEF2F2' }]}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <Text style={s.ticketId}>#{ticket.id.split('-')[1]}</Text>
                    <View style={{ backgroundColor: typeColor(ticket.type), paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                      <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>{ticket.type}</Text>
                    </View>
                  </View>
                  <Text style={s.ticketTable}>
                    {ticket.type === 'Dine-In' ? `Table: ${ticket.table}` : ticket.table}
                  </Text>
                </View>
                <View style={[s.timerBadge, { backgroundColor: tc.bg, borderColor: tc.border }]}>
                  <Clock size={12} color={tc.text} />
                  <Text style={[s.timerText, { color: tc.text }]}>{ticket.timeElapsed}m</Text>
                </View>
              </View>

              {/* Items */}
              <View style={s.itemsList}>
                {ticket.items.map((item, i) => (
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
                  <View style={[s.actionBtn, { backgroundColor: '#D1FAE5', flexDirection: 'row', justifyContent: 'center', gap: 6 }]}>
                    <CheckCircle size={16} color="#059669" />
                    <Text style={[s.actionBtnText, { color: '#059669' }]}>Ready to Serve</Text>
                  </View>
      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop: 40}}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {tickets.length === 0 ? (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40}}>
              <CheckCircle size={60} color="#D1FAE5" />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 16 }}>All caught up!</Text>
              <Text style={{ color: '#94A3B8', marginTop: 4 }}>Waiting for new orders...</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ flex: 1 }}>
                {tickets.filter(t => t.status === 'new' || t.status === 'preparing').map(renderTicket)}
              </View>
            </View>
          )}
        </ScrollView>
      )}
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
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  liveText: { fontSize: 11, fontWeight: '800', color: '#059669' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statBubble: { flex: 1, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  card: {
    backgroundColor: 'white', borderRadius: 16, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardLate: { borderColor: '#FCA5A5' },
  cardReady: { borderColor: '#6EE7B7', opacity: 0.85 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FAFAFA' },
  ticketId: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  ticketTable: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  timerText: { fontSize: 13, fontWeight: '700' },
  itemsList: { padding: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10 },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  qtyBadge: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 13, fontWeight: '800', color: '#475569' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1E293B', lineHeight: 20 },
  notesBubble: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start' },
  notesText: { color: '#EF4444', fontSize: 11, fontWeight: '600' },
  cardFooter: { padding: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FAFAFA' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 12 },
  actionBtnText: { color: 'white', fontSize: 15, fontWeight: '800' },
});
