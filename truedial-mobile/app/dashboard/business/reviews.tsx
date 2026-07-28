import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, TextInput, KeyboardAvoidingView, Platform, Modal, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Star, Reply, Send, X } from 'lucide-react-native';

export default function ReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await api.get('/truedial/vendor/reviews');
      const data = res.data?.data || res.data || [];
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      // Offline fallback
      setReviews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);
  const onRefresh = () => { setRefreshing(true); fetchReviews(); };

  const handleSendReply = async () => {
    if (!replyText.trim() || !replyingTo) return;
    setSending(true);
    try {
      await api.post(`/truedial/vendor/reviews/${replyingTo.id}/reply`, { reply: replyText.trim() });
      setReviews(prev => prev.map(r => r.id === replyingTo.id ? { ...r, reply: replyText.trim() } : r));
      setReplyingTo(null);
      setReplyText('');
      Alert.alert('Success', 'Reply posted successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not send reply');
    } finally {
      setSending(false);
    }
  };

  const renderStars = (rating: number) => (
    <View style={{ flexDirection: 'row', marginBottom: 6 }}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} color={i < rating ? '#F59E0B' : '#E2E8F0'} fill={i < rating ? '#F59E0B' : 'transparent'} />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8701A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
          ListEmptyComponent={<Text style={styles.emptyText}>No reviews yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.author}>{item.author || item.user?.name || 'Customer'}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
              {renderStars(item.rating || 5)}
              <Text style={styles.comment}>{item.comment}</Text>

              {item.reply ? (
                <View style={styles.replyBox}>
                  <Text style={styles.replyTitle}>Your Reply:</Text>
                  <Text style={styles.replyText}>{item.reply}</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.replyBtn} onPress={() => setReplyingTo(item)}>
                  <Reply size={14} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={styles.replyBtnText}>Reply to Customer</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      {/* Reply Modal */}
      <Modal visible={!!replyingTo} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reply to Review</Text>
              <TouchableOpacity onPress={() => { setReplyingTo(null); setReplyText(''); }}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.replyingToText}>Replying to: {replyingTo?.author || replyingTo?.user?.name || 'Customer'}</Text>
            
            <TextInput
              style={styles.replyInput}
              placeholder="Write your professional response..."
              multiline
              value={replyText}
              onChangeText={setReplyText}
              autoFocus
            />

            <TouchableOpacity style={styles.sendBtn} onPress={handleSendReply} disabled={sending || !replyText.trim()}>
              {sending ? <ActivityIndicator size="small" color="#FFF" /> : <Send size={18} color="#FFF" style={{ marginRight: 8 }} />}
              {!sending && <Text style={styles.sendBtnText}>Post Reply</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#FFFFFF',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  author: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  date: { fontSize: 12, color: '#94A3B8' },
  comment: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 12 },
  replyBox: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, marginTop: 8 },
  replyTitle: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  replyText: { fontSize: 13, color: '#475569', lineHeight: 18 },
  replyBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  replyBtnText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  replyingToText: { fontSize: 14, color: '#64748B', marginBottom: 16 },
  replyInput: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, height: 120, textAlignVertical: 'top', fontSize: 15, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  sendBtn: { backgroundColor: '#E8701A', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});
