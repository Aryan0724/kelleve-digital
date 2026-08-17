import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, RefreshControl, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Search, PenSquare } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useAuth } from '../../context/auth';

export default function MessagesTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) fetchConversations();
    else setLoading(false);
  }, [user]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      // Laravel paginator: { data: [...items], current_page, ... }
      // So res.data is the paginator, res.data.data is the items array.
      let raw = res.data;
      // Unwrap one level of pagination wrapper if present
      if (raw && !Array.isArray(raw) && Array.isArray(raw.data)) {
        raw = raw.data;
      }
      setConversations(Array.isArray(raw) ? raw : []);
    } catch (err: any) {
      console.warn('Could not fetch conversations:', err?.message || err);
      setConversations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const getAvatar = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=E8701A&color=fff&size=100`;

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderItem = ({ item: conv }: { item: any }) => {
    const isVendor = user?.id === conv.vendor_id;
    const participant = isVendor ? conv.customer : conv.vendor;
    const name = participant?.name || conv.project?.title || 'Chat';

    // Backend eager-loads `messages` as an array limited to 1 (latest)
    const lastMsgArr = Array.isArray(conv.messages) ? conv.messages : [];
    const lastMsgObj = lastMsgArr[0] || conv.latest_message || conv.last_message || null;

    // Backend stores message text in `message` column — not `content`/`body`
    const lastMsg = lastMsgObj
      ? (lastMsgObj.message || lastMsgObj.content || lastMsgObj.body || 'Sent a message')
      : 'Tap to start chatting';

    const time = lastMsgObj?.created_at ? formatTime(lastMsgObj.created_at) : '';

    // Each side has its own unread counter on the conversation row
    const unreadCount = isVendor ? (conv.vendor_unread_count || 0) : (conv.customer_unread_count || 0);
    const hasUnread = unreadCount > 0;

    return (
      <TouchableOpacity
        className={`flex-row items-center px-4 py-3.5 mx-4 mb-3 rounded-2xl border shadow-sm ${
          hasUnread
            ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800'
            : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800'
        }`}
        onPress={() => router.push(`/dashboard/chat/${conv.id}`)}
        activeOpacity={0.75}
      >
        <Image
          source={{ uri: getAvatar(name) }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#f1f5f9' }}
        />
        <View style={{ flex: 1 }}>
          <View className="flex-row justify-between items-center mb-1">
            <Text
              className={`text-[15px] flex-1 mr-2 ${hasUnread ? 'font-extrabold text-slate-900 dark:text-white' : 'font-bold text-slate-800 dark:text-slate-200'}`}
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text className="text-[11px] text-slate-400 font-medium">{time}</Text>
          </View>
          <Text
            className={`text-[13px] ${hasUnread ? 'text-slate-800 dark:text-slate-100 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
            numberOfLines={1}
          >
            {lastMsg}
          </Text>
        </View>
        {hasUnread && (
          <View className="w-6 h-6 rounded-full bg-[#E8701A] items-center justify-center ml-2">
            <Text className="text-white text-[10px] font-extrabold">{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 items-center justify-center p-8">
        <MessageSquare size={48} color="#CBD5E1" />
        <Text className="text-[18px] font-bold text-slate-900 dark:text-white mt-4 mb-2">Login to See Messages</Text>
        <Text className="text-[14px] text-slate-500 text-center mb-6">Sign in to view and send messages to businesses.</Text>
        <TouchableOpacity className="bg-[#E8701A] px-8 py-3 rounded-xl" onPress={() => router.push('/(auth)/login')}>
          <Text className="text-white font-bold text-[15px]">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-2 pb-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex-row justify-between items-center">
        <Text className="text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight">Messages</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/30 items-center justify-center border border-orange-200 dark:border-orange-900"
          onPress={() => router.push('/(tabs)/search')}
        >
          <PenSquare size={18} color="#E8701A" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-10 mt-16">
              <View className="w-20 h-20 bg-orange-50 dark:bg-orange-950/30 rounded-full items-center justify-center mb-5 border border-orange-200 dark:border-orange-800">
                <MessageSquare size={32} color="#E8701A" />
              </View>
              <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white mb-2 text-center">No Messages Yet</Text>
              <Text className="text-[14px] text-slate-500 dark:text-slate-400 text-center leading-relaxed mb-6">
                Find a business and tap Chat to start a conversation.
              </Text>
              <TouchableOpacity
                className="bg-[#E8701A] px-6 py-3 rounded-xl flex-row items-center"
                onPress={() => router.push('/(tabs)/search')}
              >
                <Search size={16} color="#fff" />
                <Text className="text-white font-bold ml-2">Find Businesses</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
