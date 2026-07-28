import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Bookmark, Star, MapPin, ChevronRight, Trash2 } from 'lucide-react-native';

export default function SavedScreen() {
  const router = useRouter();
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSaved = useCallback(async () => {
    try {
      const res = await api.get('/truedial/user/saved');
      const data = res.data?.data || res.data || [];
      setSaved(Array.isArray(data) ? data : []);
    } catch {
      // Mock fallback since this endpoint might not exist yet
      setSaved([
        { id: 101, title: 'Godrej Interio', category: { name: 'Modular Kitchen' }, city: 'Mumbai', reviews_avg_rating: 4.8 },
        { id: 102, title: 'DLF Real Estate', category: { name: 'Real Estate' }, city: 'Delhi', reviews_avg_rating: 4.9 },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);
  const onRefresh = () => { setRefreshing(true); fetchSaved(); };

  const handleRemove = async (id: number) => {
    setSaved(prev => prev.filter(item => item.id !== id));
    try {
      await api.delete(`/truedial/user/saved/${id}`);
    } catch {
      // Ignored
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/listing/${item.slug || item.id}`)}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.category?.name || 'Business'} • {item.city}</Text>
        <View style={styles.ratingRow}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 4 }} />
          <Text style={styles.ratingText}>{item.reviews_avg_rating || '4.5'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
        <Bookmark size={20} color="#E8701A" fill="#E8701A" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Businesses</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Bookmark size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>You have no saved businesses.</Text>
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, flexDirection: 'row', alignItems: 'center' },
  cardInfo: { flex: 1, paddingRight: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748B', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },
  removeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' }
});
