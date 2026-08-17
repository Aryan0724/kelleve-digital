import React, { useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../context/notifications';
import { ArrowLeft, Bell, BellOff, CheckCheck } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllRead } = useNotifications();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  const getNotifIcon = (type: string) => {
    if (type.includes('lead') || type.includes('inquiry')) return '📩';
    if (type.includes('review')) return '⭐';
    if (type.includes('message') || type.includes('chat')) return '💬';
    if (type.includes('offer')) return '🎁';
    return '🔔';
  };

  const renderNotification = ({ item }: { item: any }) => {
    const isUnread = !item.read_at;
    return (
      <TouchableOpacity
        style={[styles.notifRow, isUnread && styles.notifUnread]}
        onPress={() => markAsRead(item.id)}
      >
        <Text style={styles.notifIcon}>{getNotifIcon(item.type || '')}</Text>
        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text style={[styles.notifTitle, isUnread && styles.notifTitleUnread]} numberOfLines={1}>
              {item.data?.title || 'Notification'}
            </Text>
            <Text style={styles.notifTime}>{formatTime(item.created_at)}</Text>
          </View>
          <Text style={styles.notifMessage} numberOfLines={2}>
            {item.data?.message || item.data?.body || 'You have a new notification'}
          </Text>
        </View>
        {isUnread && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <CheckCheck size={18} color="#E8701A" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBar}>
          <Text style={styles.unreadBarText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      {loading && notifications.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <BellOff size={48} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyText}>
            You'll receive notifications when you get new leads, reviews, or offers.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  markAllBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  unreadBar: {
    backgroundColor: '#FFF7ED', paddingVertical: 8, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#FFEDD5',
  },
  unreadBarText: { fontSize: 13, fontWeight: '700', color: '#E8701A' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#334155', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  notifRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
  },
  notifUnread: { backgroundColor: '#FFFBF5' },
  notifIcon: { fontSize: 24, marginRight: 12, width: 36, textAlign: 'center' },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: 14, fontWeight: '600', color: '#475569', flex: 1 },
  notifTitleUnread: { fontWeight: '800', color: '#1E293B' },
  notifTime: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginLeft: 8 },
  notifMessage: { fontSize: 13, color: '#64748B', marginTop: 3, lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E8701A', marginLeft: 8 },
});
