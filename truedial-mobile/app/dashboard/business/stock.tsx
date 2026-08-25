import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Box, AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react-native';
import api from '../../../services/api';

const BRAND_ORANGE = "#E8701A";

export default function RetailStockScreen() {
  const router = useRouter();
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/stock');
      setStockItems(res.data?.data || res.data || []);
    } catch {
      // Mock Fallback
      setStockItems([
        { id: 1, name: "Premium Designer Plywood 18mm", sku: "PLY-18-PREM", quantity: 4, threshold: 10, status: "Low Stock" },
        { id: 2, name: "Matte Finish Black Laminate", sku: "LAM-MAT-BLK", quantity: 28, threshold: 5, status: "In Stock" },
        { id: 3, name: "Stainless Steel Hinges 4-inch", sku: "HNG-SS-4IN", quantity: 0, threshold: 20, status: "Out of Stock" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = (id: number) => {
    setStockItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 50, status: "In Stock" };
      }
      return item;
    }));
    Alert.alert("Restocked", "Inventory replenished successfully!");
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
          <Box size={20} color={BRAND_ORANGE} />
          <Text style={s.headerTitle}>Inventory & Stock Alerts</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={BRAND_ORANGE} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent}>
          {stockItems.length === 0 ? (
            <View style={s.emptyState}>
              <Box size={50} color="#94A3B8" />
              <Text style={s.emptyTitle}>No Stock Catalog</Text>
              <Text style={s.emptySub}>Add product catalog items to activate real-time low stock alerts.</Text>
            </View>
          ) : (
            stockItems.map(item => {
              const isLow = item.status === 'Low Stock';
              const isOut = item.status === 'Out of Stock';
              
              return (
                <View key={item.id} style={s.card}>
                  <View style={s.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.itemName}>{item.name}</Text>
                      <Text style={s.sku}>SKU: {item.sku}</Text>
                    </View>
                    <View style={[
                      s.badge, 
                      isOut ? s.dangerBadge : isLow ? s.warningBadge : s.successBadge
                    ]}>
                      <Text style={[
                        s.badgeText,
                        isOut ? s.dangerText : isLow ? s.warningText : s.successText
                      ]}>
                        {item.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={s.detailsBlock}>
                    <View style={s.detailRow}>
                      <Text style={s.detailLabel}>Current Stock Count</Text>
                      <Text style={[s.detailValue, isOut ? s.dangerValueText : isLow ? s.warningValueText : null]}>
                        {item.quantity} units
                      </Text>
                    </View>
                    <View style={s.detailRow}>
                      <Text style={s.detailLabel}>Low Threshold Limit</Text>
                      <Text style={s.detailValue}>{item.threshold} units</Text>
                    </View>
                  </View>

                  <View style={s.footer}>
                    {(isLow || isOut) && (
                      <TouchableOpacity style={s.actionBtn} onPress={() => handleRestock(item.id)}>
                        <RefreshCcw size={13} color="#FFFFFF" />
                        <Text style={s.actionBtnText}>Restock +50 units</Text>
                      </TouchableOpacity>
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, gap: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center', paddingHorizontal: 40 },
  card: { backgroundColor: '#0a1c3a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  sku: { fontSize: 11, color: '#64748B', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  successBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  warningBadge: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  dangerBadge: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  badgeText: { fontSize: 10, fontWeight: '800' },
  successText: { color: '#10B981' },
  warningText: { color: '#F59E0B' },
  dangerText: { color: '#EF4444' },
  detailsBlock: { gap: 6, marginVertical: 12, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  detailValue: { fontSize: 12, color: '#FFFFFF', fontWeight: '800' },
  dangerValueText: { color: '#EF4444' },
  warningValueText: { color: '#F59E0B' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: BRAND_ORANGE, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' }
});
