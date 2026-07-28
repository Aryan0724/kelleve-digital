import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ArrowLeft, CheckCircle2, AlertCircle, Info } from 'lucide-react-native';
import api from '../services/api';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const data = res.data?.data || res.data;
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Could not fetch notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (err) {
      console.warn('Error marking notification as read', err);
    }
  };

  const getIcon = (type: string) => {
    if (type?.includes('Success')) return <CheckCircle2 size={24} color="#10B981" />;
    if (type?.includes('Alert') || type?.includes('Error')) return <AlertCircle size={24} color="#EF4444" />;
    return <Info size={24} color="#3B82F6" />;
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">Notifications</Text>
        <View className="w-10" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F05A24" />
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-20 h-20 bg-orange-50 dark:bg-orange-950/30 rounded-full items-center justify-center mb-6">
            <Bell size={32} color="#F05A24" />
          </View>
          <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white mb-2 text-center">All Caught Up!</Text>
          <Text className="text-[14px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            You don't have any new notifications at the moment.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {notifications.map((notif) => (
            <TouchableOpacity 
              key={notif.id} 
              className={`flex-row p-4 mb-3 rounded-2xl border ${!notif.read_at ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'} shadow-sm`}
              onPress={() => markAsRead(notif.id)}
            >
              <View className="mr-4 mt-1">
                {getIcon(notif.type)}
              </View>
              <View className="flex-1">
                <Text className={`text-[15px] ${!notif.read_at ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'} mb-1`}>
                  {notif.data?.title || 'Notification'}
                </Text>
                <Text className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                  {notif.data?.message || 'You have a new update on TrueDial.'}
                </Text>
                <Text className="text-[11px] text-slate-400 font-medium">
                  {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
              </View>
              {!notif.read_at && (
                <View className="w-2 h-2 rounded-full bg-[#F05A24] mt-2" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
