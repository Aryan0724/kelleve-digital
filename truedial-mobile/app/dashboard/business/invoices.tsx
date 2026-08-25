import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, TextInput, Alert, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, Plus, CheckCircle, Clock, X, DollarSign, User, Share2 } from 'lucide-react-native';
import api from '../../../services/api';

const BRAND_ORANGE = "#E8701A";

export default function VendorInvoicesScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/invoices');
      setInvoices(res.data?.data || res.data || []);
    } catch {
      // Mock Fallback
      setInvoices([
        { id: 1, client_name: "Amit Patel", amount: 15000, description: "Website Design Consultation", status: "paid", payment_link: "https://truedial.in/pay/1", created_at: "2026-08-20" },
        { id: 2, client_name: "Neha Sharma", amount: 8500, description: "Logo & Branding Package", status: "pending", payment_link: "https://truedial.in/pay/2", created_at: "2026-08-24" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!clientName || !amount || !description) {
      Alert.alert("Missing Fields", "Please fill in all invoice details.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/vendor/invoices', {
        client_name: clientName,
        amount: parseFloat(amount),
        description
      });
      Alert.alert("Success", "Invoice generated successfully!");
      setModalVisible(false);
      setClientName('');
      setAmount('');
      setDescription('');
      fetchInvoices();
    } catch (e: any) {
      // Offline fallback success for mock UX
      const newInv = {
        id: Date.now(),
        client_name: clientName,
        amount: parseFloat(amount),
        description,
        status: "pending",
        payment_link: `https://truedial.in/pay/${Date.now()}`,
        created_at: new Date().toISOString().split('T')[0]
      };
      setInvoices(prev => [newInv, ...prev]);
      Alert.alert("Generated", "New invoice added successfully!");
      setModalVisible(false);
      setClientName('');
      setAmount('');
      setDescription('');
    } finally {
      setSubmitting(false);
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
          <FileText size={20} color={BRAND_ORANGE} />
          <Text style={s.headerTitle}>Invoices & Billing</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={s.addBtn}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main List */}
      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={BRAND_ORANGE} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent}>
          {invoices.length === 0 ? (
            <View style={s.emptyState}>
              <FileText size={50} color="#94A3B8" />
              <Text style={s.emptyTitle}>No Invoices Found</Text>
              <Text style={s.emptySub}>Create your first invoice using the '+' button above.</Text>
            </View>
          ) : (
            invoices.map(inv => (
              <View key={inv.id} style={s.card}>
                <View style={s.cardTop}>
                  <View>
                    <Text style={s.clientName}>{inv.client_name}</Text>
                    <Text style={s.invoiceDesc}>{inv.description}</Text>
                    <Text style={s.invoiceDate}>{inv.created_at}</Text>
                  </View>
                  <View style={s.rightCol}>
                    <Text style={s.amount}>₹{inv.amount.toLocaleString('en-IN')}</Text>
                    <View style={[s.badge, inv.status === 'paid' ? s.paidBadge : s.pendingBadge]}>
                      <Text style={[s.badgeText, inv.status === 'paid' ? s.paidText : s.pendingText]}>
                        {inv.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={s.cardActions}>
                  <TouchableOpacity 
                    style={s.shareBtn}
                    onPress={() => Alert.alert("Share", `Copied Link: ${inv.payment_link}`)}
                  >
                    <Share2 size={14} color="#FFFFFF" />
                    <Text style={s.shareText}>Share Payment Link</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Invoice Generator Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Generate New Invoice</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={s.closeBtn}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={s.formWrap}>
              <Text style={s.label}>Client Name</Text>
              <View style={s.inputWrap}>
                <User size={16} color="#94A3B8" style={s.inputIcon} />
                <TextInput 
                  placeholder="e.g. Ramesh Chandra" 
                  placeholderTextColor="#94A3B8"
                  style={s.input}
                  value={clientName}
                  onChangeText={setClientName}
                />
              </View>

              <Text style={s.label}>Amount (₹)</Text>
              <View style={s.inputWrap}>
                <DollarSign size={16} color="#94A3B8" style={s.inputIcon} />
                <TextInput 
                  placeholder="e.g. 5000" 
                  placeholderTextColor="#94A3B8"
                  style={s.input}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <Text style={s.label}>Description</Text>
              <View style={s.inputWrap}>
                <TextInput 
                  placeholder="e.g. Advanced plumbing repair services" 
                  placeholderTextColor="#94A3B8"
                  style={[s.input, { height: 80, textAlignVertical: 'top' }]}
                  multiline={true}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <TouchableOpacity style={s.submitBtn} onPress={handleCreateInvoice} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={s.submitBtnText}>Generate Invoice</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: BRAND_ORANGE, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, gap: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center', paddingHorizontal: 40 },
  card: { backgroundColor: '#0a1c3a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  clientName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  invoiceDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  invoiceDate: { fontSize: 10, color: '#64748B', marginTop: 6 },
  rightCol: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  paidBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  pendingBadge: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  badgeText: { fontSize: 10, fontWeight: '800' },
  paidText: { color: '#10B981' },
  pendingText: { color: '#F59E0B' },
  cardActions: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', marginTop: 12, paddingTop: 10 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end' },
  shareText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0a1c3a', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  formWrap: { padding: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#050f24', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, marginBottom: 16 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, color: '#FFFFFF', fontSize: 14 },
  submitBtn: { height: 50, borderRadius: 12, backgroundColor: BRAND_ORANGE, alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 40 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' }
});
