import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, ActionSheetIOS, Platform, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Phone, Mail, MoreVertical } from 'lucide-react-native';

export default function LeadsScreen() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await api.get('/truedial/vendor/crm/leads');
      const data = res.data?.data || res.data || [];
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  const onRefresh = () => { setRefreshing(true); fetchLeads(); };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/truedial/vendor/crm/leads/${id}/status`, { status });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch {
      Alert.alert('Error', 'Could not update status');
    }
  };

  const handleOptions = (lead: any) => {
    const options = ['Cancel', 'Mark Contacted', 'Mark Converted', 'Mark Invalid'];
    const statuses = ['', 'Contacted', 'Converted', 'Invalid'];
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (btnIdx) => {
          if (btnIdx > 0) updateStatus(lead.id, statuses[btnIdx]);
        }
      );
    } else {
      Alert.alert('Update Status', 'Select new status for this lead', [
        { text: 'Contacted', onPress: () => updateStatus(lead.id, 'Contacted') },
        { text: 'Converted', onPress: () => updateStatus(lead.id, 'Converted') },
        { text: 'Cancel', style: 'cancel' }
      ]);
    }
  };

  const renderLead = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.name}>{item.name || 'User'}</Text>
          <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity onPress={() => handleOptions(item)} style={styles.optionsBtn}>
          <MoreVertical size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      {item.message && (
        <Text style={styles.message} numberOfLines={2}>"{item.message}"</Text>
      )}

      <View style={styles.contactRow}>
        <View style={styles.contactItem}>
          <Phone size={14} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.contactText}>{item.phone}</Text>
        </View>
        {item.email && (
          <View style={styles.contactItem}>
            <Mail size={14} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={[styles.statusBadge, 
          item.status === 'Contacted' ? { backgroundColor: '#DBEAFE' } : 
          item.status === 'Converted' ? { backgroundColor: '#D1FAE5' } : 
          { backgroundColor: '#FEF3C7' }
        ]}>
          <Text style={[styles.statusText, 
            item.status === 'Contacted' ? { color: '#2563EB' } : 
            item.status === 'Converted' ? { color: '#059669' } : 
            { color: '#D97706' }
          ]}>{item.status || 'New'}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.chatBtn}
          onPress={() => router.push('/dashboard/chat')}
        >
          <Text style={styles.chatBtnText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CRM Leads</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8701A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={leads}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderLead}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No leads available.</Text>
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
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  time: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  optionsBtn: { padding: 4 },
  message: { fontSize: 14, color: '#475569', fontStyle: 'italic', marginBottom: 12, backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  contactItem: { flexDirection: 'row', alignItems: 'center' },
  contactText: { fontSize: 13, color: '#475569' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { fontSize: 12, fontWeight: '700' },
  chatBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#E8701A' },
  chatBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 40 }
});
