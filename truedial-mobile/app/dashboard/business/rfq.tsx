/**
 * RFQ Board (Request for Quotation)
 * Unique tab for: Supplier / Wholesale / B2B vendors
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, ShoppingBag, Search, IndianRupee, Package, Clock, CheckCircle, ChevronRight } from 'lucide-react-native';

const MOCK_RFQS = [
  { id: 1, material: 'Italian Marble Flooring', buyer: 'Rohit Interiors Pvt Ltd', qty: '500 sqft', location: 'Mumbai', budget: '₹3,50,000', received: '2h ago', status: 'New', urgent: true },
  { id: 2, material: 'Plywood 18mm BWR Grade', buyer: 'Sharma Modular Kitchen', qty: '200 sheets', location: 'Pune', budget: '₹1,20,000', received: '5h ago', status: 'Quoted', urgent: false },
  { id: 3, material: 'Asian Paints Royale Sheen 20L', buyer: 'Kapoor Construction', qty: '150 cans', location: 'Navi Mumbai', budget: '₹75,000', received: '1d ago', status: 'New', urgent: false },
  { id: 4, material: 'Egger Laminate Sheets', buyer: 'M/s Verma Furnitures', qty: '500 pcs', location: 'Thane', budget: '₹2,80,000', received: '2d ago', status: 'Closed', urgent: false },
  { id: 5, material: 'Somany Floor Tiles 2x2', buyer: 'Joshi Builders LLP', qty: '1000 boxes', location: 'Andheri', budget: '₹4,50,000', received: '3d ago', status: 'Quoted', urgent: false },
];

function Badge({ status }: { status: string }) {
  const m: Record<string, [string, string]> = {
    New:    ['#DBEAFE', '#2563EB'],
    Quoted: ['#FEF3C7', '#D97706'],
    Closed: ['#D1FAE5', '#059669'],
    Lost:   ['#FEE2E2', '#DC2626'],
  };
  const [bg, text] = m[status] || ['#F1F5F9', '#64748B'];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
      <Text style={{ color: text, fontSize: 11, fontWeight: '700' }}>{status}</Text>
    </View>
  );
}

export default function RFQBoardScreen() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchRfqs();
  }, []);

  const fetchRfqs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/rfq');
      setRfqs(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
      setRfqs([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: number, status: string) =>
    setRfqs(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  const filtered = rfqs.filter(r =>
    (filter === 'All' || r.status === filter) &&
    (r.material.toLowerCase().includes(search.toLowerCase()) || r.buyer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><ArrowLeft size={22} color="#1E293B" /></TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ShoppingBag size={20} color="#10B981" />
          <Text style={s.headerTitle}>RFQ Board</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#EF4444' }}>{rfqs.filter(r => r.status === 'New').length} New</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={s.searchBar}>
        <Search size={16} color="#94A3B8" />
        <TextInput style={s.searchInput} placeholder="Search material or buyer..." placeholderTextColor="#94A3B8"
          value={search} onChangeText={setSearch} />
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {['All', 'New', 'Quoted', 'Closed'].map(f => (
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
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <CheckCircle size={60} color="#E2E8F0" />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 16 }}>No RFQs found</Text>
            </View>
          ) : filtered.map(rfq => (
            <View key={rfq.id} style={[s.card, rfq.urgent && s.cardUrgent]}>
              <View style={s.cardTop}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <Text style={s.materialName}>{rfq.material}</Text>
                    {rfq.urgent && (
                      <View style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#EF4444' }}>URGENT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.buyerName}>{rfq.buyer}</Text>
                </View>
                <Badge status={rfq.status} />
              </View>

              <View style={s.cardMeta}>
                <View style={s.metaItem}><Package size={12} color="#94A3B8" /><Text style={s.metaText}>{rfq.qty}</Text></View>
                <View style={s.metaItem}><IndianRupee size={12} color="#10B981" /><Text style={[s.metaText, { color: '#10B981', fontWeight: '700' }]}>{rfq.budget}</Text></View>
                <View style={s.metaItem}><Clock size={12} color="#94A3B8" /><Text style={s.metaText}>{rfq.received} • {rfq.location}</Text></View>
              </View>

              {rfq.status !== 'Closed' && rfq.status !== 'Lost' && (
                <View style={s.cardFooter}>
                  {rfq.status === 'New' && (
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#10B981', flex: 2 }]} onPress={() => updateStatus(rfq.id, 'Quoted')}>
                      <CheckCircle size={13} color="white" />
                      <Text style={s.btnText}>Send Quotation</Text>
                    </TouchableOpacity>
                  )}
                  {rfq.status === 'Quoted' && (
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#DBEAFE', flex: 2 }]} onPress={() => updateStatus(rfq.id, 'Closed')}>
                      <Text style={[s.btnText, { color: '#2563EB' }]}>Mark Closed (Won)</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={[s.btn, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', flex: 1 }]}>
                    <ChevronRight size={13} color="#64748B" />
                    <Text style={[s.btnText, { color: '#64748B' }]}>Details</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 14, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  searchInput: { flex: 1, fontSize: 14, color: '#1E293B' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterTab: { flex: 1, paddingVertical: 7, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#10B981' },
  filterLabel: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  filterLabelActive: { color: 'white' },
  card: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 14, paddingBottom: 8 },
  materialName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  buyerName: { fontSize: 12, color: '#64748B' },
  cardMeta: { paddingHorizontal: 14, paddingBottom: 10, gap: 5 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#64748B' },
  cardFooter: { flexDirection: 'row', gap: 8, padding: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10 },
  btnText: { fontSize: 12, fontWeight: '700', color: 'white' },
});
