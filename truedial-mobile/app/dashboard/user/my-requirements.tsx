import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, ListTodo, MapPin, Clock, ChevronRight } from 'lucide-react-native';

export default function MyRequirementsScreen() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await api.get('/truedial/inquiries/me');
      const data = res.data?.data || res.data || [];
      setInquiries(Array.isArray(data) ? data : []);
    } catch {
      // Offline fallback
      setInquiries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);
  const onRefresh = () => { setRefreshing(true); fetchInquiries(); };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.reqName}>{item.title || item.subject || item.message?.substring(0, 60) || 'Service Enquiry'}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MapPin size={14} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.infoText}>{item.city || 'Any'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Clock size={14} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.infoText}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>

      {item.business && (
        <View style={styles.businessBox}>
          <Text style={styles.businessLabel}>Sent to:</Text>
          <Text style={styles.businessName}>{item.business.title}</Text>
        </View>
      )}
      
      <View style={styles.cardFooter}>
        <Text style={styles.descText} numberOfLines={2}>"{item.message || 'I am looking for your services.'}"</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Enquiries</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8701A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={inquiries}
          keyExtractor={(item) => String(item.id || Math.random())}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ListTodo size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>You haven't sent any enquiries yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { color: '#94A3B8', marginTop: 12, fontSize: 15 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  reqName: { fontSize: 16, fontWeight: '700', color: '#1E293B', flex: 1, paddingRight: 12 },
  statusBadge: { backgroundColor: '#FFF7ED', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '700', color: '#E8701A' },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  businessBox: { backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8, marginBottom: 12 },
  businessLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 2 },
  businessName: { fontSize: 14, color: '#1E293B', fontWeight: '700' },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  descText: { fontSize: 14, color: '#475569', fontStyle: 'italic' }
});
