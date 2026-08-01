import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Circle, Search, ArrowRight } from 'lucide-react-native';
import api from '../../services/api';
import { useAuth } from '../../context/auth';

export default function MessagesTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      const data = res.data?.data || res.data;
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Could not fetch conversations:', err);
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

  const getAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E8701A&color=fff&size=100`;
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950 pt-12">
      {/* Header */}
      <View className="px-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex-row justify-between items-center">
        <Text className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight">Messages</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 items-center justify-center border border-slate-200 dark:border-slate-800">
          <Search size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-20 h-20 bg-orange-50 dark:bg-orange-950/30 rounded-full items-center justify-center mb-6">
            <MessageSquare size={32} color="#E8701A" />
          </View>
          <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white mb-2 text-center">No Messages Yet</Text>
          <Text className="text-[14px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            When you contact vendors or receive inquiries, your chat messages will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E8701A" />}
        >
          {conversations.map((conv) => {
            const participant = conv.participant || (user?.id === conv.vendor_id ? conv.customer : conv.vendor) || conv.user || conv.other_user;
            const name = participant?.name || conv.title || 'Support Chat';
            const lastMsgObj = conv.latest_message || conv.last_message || {};
            const lastMsg = lastMsgObj.content || lastMsgObj.body || lastMsgObj.message || 'Started a conversation';
            const time = lastMsgObj.created_at ? new Date(lastMsgObj.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
            
            return (
              <TouchableOpacity 
                key={conv.id} 
                className="flex-row items-center p-4 mb-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                onPress={() => router.push(`/dashboard/chat/${conv.id}`)}
              >
                <Image source={{ uri: getAvatar(name) }} className="w-13 h-13 rounded-full mr-3.5 bg-slate-200" />
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-[15px] font-bold text-slate-900 dark:text-white" numberOfLines={1}>{name}</Text>
                    <Text className="text-[11px] text-slate-400 font-medium">{time}</Text>
                  </View>
                  <Text className="text-[13px] text-slate-500 dark:text-slate-400" numberOfLines={1}>{lastMsg}</Text>
                </View>
                {!lastMsgObj.is_read && lastMsgObj.sender_id && lastMsgObj.sender_id !== user?.id && (
                  <Circle size={10} color="#E8701A" fill="#E8701A" className="ml-3" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
