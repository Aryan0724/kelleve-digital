import React, { useState, useEffect, useCallback } from 'react';
import {
  Text, View, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { MessageSquare, ArrowLeft, Search } from 'lucide-react-native';
import { useAuth } from '../../../context/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConversationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/conversations');
      const data = res.data?.data || res.data || [];
      setConversations(Array.isArray(data) ? data : []);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchConversations();
    else setLoading(false);
  }, [user, fetchConversations]);

  const onRefresh = () => { setRefreshing(true); fetchConversations(); };

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

  const renderConversation = ({ item: conv }: { item: any }) => {
    const isVendor = user?.id === conv.vendor_id;
    const participant = isVendor ? conv.customer : conv.vendor;
    const name = participant?.name || conv.project?.title || 'Chat';

    const lastMsgArr = Array.isArray(conv.messages) ? conv.messages : [];
    const lastMsgObj = lastMsgArr[0] || conv.latest_message || conv.last_message || null;

    const lastMsg = lastMsgObj
      ? (lastMsgObj.message || lastMsgObj.content || lastMsgObj.body || 'Sent a message')
      : 'Tap to start chatting';

    const time = lastMsgObj?.created_at ? formatTime(lastMsgObj.created_at) : '';
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
          {conv.project && (
            <Text className="text-[11px] text-[#E8701A] font-semibold mb-0.5" numberOfLines={1}>
              Re: {conv.project.title}
            </Text>
          )}
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
      <View className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
          <ArrowLeft size={20} color="#64748B" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">Messages</Text>
        <View className="w-10" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderConversation}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-10 mt-16">
              <View className="w-20 h-20 bg-orange-50 dark:bg-orange-950/30 rounded-full items-center justify-center mb-5 border border-orange-200 dark:border-orange-800">
                <MessageSquare size={32} color="#E8701A" />
              </View>
              <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white mb-2 text-center">No Messages Yet</Text>
              <Text className="text-[14px] text-slate-500 dark:text-slate-400 text-center leading-relaxed mb-6">
                When you send an inquiry or chat with a business, your messages will appear here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
