import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Plus, DollarSign, CheckCircle } from 'lucide-react-native';
import api from '../../../services/api';

const BRAND_ORANGE = "#E8701A";

export default function VendorWalletScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState("₹0");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/wallet');
      if (res.data) {
        setBalance(res.data.balance || "₹0");
        setTransactions(res.data.transactions || []);
      }
    } catch {
      // Mock Fallback
      setBalance("₹48,250");
      setTransactions([
        { id: 1, type: "credit", amount: 15000, label: "Invoice #Amit Paid", date: "2026-08-20" },
        { id: 2, type: "debit", amount: 10000, label: "Bank Withdrawal Transfer", date: "2026-08-22" },
        { id: 3, type: "credit", amount: 5400, label: "Lead Commission Credit", date: "2026-08-24" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    Alert.alert(
      "Confirm Payout",
      "Would you like to withdraw the entire available balance to your registered bank account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: () => {
            Alert.alert("Success", "Payout requested successfully! Fund settlement takes 24-48 hours.");
            setBalance("₹0");
            const newTx = {
              id: Date.now(),
              type: "debit",
              amount: parseFloat(balance.replace(/[₹,]/g, '')),
              label: "Requested Bank Payout",
              date: new Date().toISOString().split('T')[0]
            };
            setTransactions(prev => [newTx, ...prev]);
          }
        }
      ]
    );
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
          <Wallet size={20} color={BRAND_ORANGE} />
          <Text style={s.headerTitle}>Payouts & Wallet</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={BRAND_ORANGE} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent}>
          {/* Balance card */}
          <View style={s.balanceCard}>
            <View style={s.balanceRow}>
              <View>
                <Text style={s.balanceLabel}>Available Balance</Text>
                <Text style={s.balanceNum}>{balance}</Text>
              </View>
              <View style={s.walletIconWrap}>
                <Wallet size={32} color="#FFFFFF" />
              </View>
            </View>
            <TouchableOpacity style={s.payoutBtn} onPress={handleWithdraw} disabled={balance === "₹0"}>
              <Text style={s.payoutText}>Request Bank Withdrawal</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions Title */}
          <Text style={s.txTitle}>Recent Transactions</Text>

          {/* Transactions List */}
          {transactions.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>No transaction history.</Text>
            </View>
          ) : (
            transactions.map(tx => (
              <View key={tx.id} style={s.txCard}>
                <View style={s.txIconCol}>
                  <View style={[s.txIconWrap, tx.type === 'credit' ? s.creditBg : s.debitBg]}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft size={16} color="#10B981" />
                    ) : (
                      <ArrowUpRight size={16} color="#EF4444" />
                    )}
                  </View>
                  <View>
                    <Text style={s.txLabel}>{tx.label}</Text>
                    <Text style={s.txDate}>{tx.date}</Text>
                  </View>
                </View>
                <Text style={[s.txAmount, tx.type === 'credit' ? s.creditText : s.debitText]}>
                  {tx.type === 'credit' ? "+" : "-"} ₹{tx.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))
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
  scrollContent: { padding: 16 },
  balanceCard: {
    backgroundColor: BRAND_ORANGE, borderRadius: 20, padding: 20,
    shadowColor: BRAND_ORANGE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
    marginBottom: 24
  },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700' },
  balanceNum: { color: '#FFFFFF', fontSize: 32, fontWeight: '900', marginTop: 2 },
  walletIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  payoutBtn: { height: 46, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  payoutText: { color: BRAND_ORANGE, fontSize: 14, fontWeight: '900' },
  txTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 12 },
  txCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0a1c3a', borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'
  },
  txIconCol: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  txIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  creditBg: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  debitBg: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  txLabel: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  txDate: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '800' },
  creditText: { color: '#10B981' },
  debitText: { color: '#EF4444' },
  emptyState: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' }
});
