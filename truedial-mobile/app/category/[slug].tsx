import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../services/api';
import { ArrowLeft, MapPin, Star, Building2, SlidersHorizontal } from 'lucide-react-native';

export default function CategoryScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState(slug?.replace(/-/g, ' ').toUpperCase() || 'CATEGORY');

  useEffect(() => {
    const fetchCategoryResults = async () => {
      setLoading(true);
      try {
        const catQuery = slug ? slug.replace(/-/g, ' ') : '';
        const res = await api.get(`/truedial/public/businesses?category_name=${encodeURIComponent(catQuery)}`).catch(
          () => api.get(`/truedial/public/search?category_name=${encodeURIComponent(catQuery)}`)
        );
        
        let data = res.data?.data?.data || res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length === 0) {
          const fallback = await api.get('/truedial/public/businesses').catch(() => null);
          data = fallback?.data?.data?.data || fallback?.data?.data || fallback?.data || [];
        }
        setResults(Array.isArray(data) ? data : []);
        setCategoryName(catQuery || 'Category');
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryResults();
  }, [slug]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/listing/${item.slug}`)}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Building2 size={24} color="#059669" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.city}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 4 }} />
          <Text style={styles.ratingText}>{item.reviews_avg_rating || '4.5'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{categoryName}</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => router.push(`/search?category=${encodeURIComponent(categoryName)}`)}>
          <SlidersHorizontal size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id || Math.random())}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>{results.length} businesses found</Text>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No businesses listed in this category yet.</Text>
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
  filterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', textTransform: 'capitalize' },
  resultsCount: { fontSize: 13, color: '#64748B', marginBottom: 16, fontWeight: '600' },
  emptyText: { color: '#94A3B8', marginTop: 40, fontSize: 15, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748B' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#B45309' },
});
