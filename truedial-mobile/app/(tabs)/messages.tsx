import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Circle, Search, ArrowRight } from 'lucide-react-native';
import api from '../../services/api';
import { useAuth } from '../../context/auth';

export default function MessagesTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  const getAvatar = (name: string) => {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F05A24&color=fff&size=100`;
    return fallback;
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950 pt-14">
      <View className="px-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex-row justify-between items-center">
        <Text className="text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight">Chats</Text>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 items-center justify-center border border-slate-200 dark:border-slate-800">
          <Search size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F05A24" />
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-20 h-20 bg-orange-50 dark:bg-orange-950/30 rounded-full items-center justify-center mb-6">
            <MessageSquare size={32} color="#F05A24" />
          </View>
          <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white mb-2 text-center">No Messages Yet</Text>
          <Text className="text-[14px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            When you contact vendors or receive inquiries, your conversations will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {conversations.map((conv) => {
            const isVendor = user?.id === conv.vendor_id;
            const otherUser = isVendor ? conv.customer : conv.vendor;
            const name = otherUser?.name || 'Unknown User';
            const lastMsg = conv.latest_message?.content || 'Started a conversation';
            const time = conv.latest_message?.created_at ? new Date(conv.latest_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
            
            return (
              <TouchableOpacity 
                key={conv.id} 
                className="flex-row items-center p-4 mb-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                onPress={() => router.push(`/chat/${conv.id}`)}
              >
                <Image source={{ uri: getAvatar(name) }} className="w-14 h-14 rounded-full mr-4 bg-slate-200" />
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-[16px] font-bold text-slate-900 dark:text-white" numberOfLines={1}>{name}</Text>
                    <Text className="text-[12px] text-slate-400 font-medium">{time}</Text>
                  </View>
                  <Text className="text-[14px] text-slate-500 dark:text-slate-400" numberOfLines={1}>{lastMsg}</Text>
                </View>
                {!conv.latest_message?.is_read && conv.latest_message?.sender_id !== user?.id && (
                  <Circle size={10} color="#F05A24" fill="#F05A24" className="ml-3" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
