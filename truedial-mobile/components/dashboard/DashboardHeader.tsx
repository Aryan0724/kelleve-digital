import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Bell, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../context/notifications';

interface DashboardHeaderProps {
  userName: string;
  badgeLabel: string;
  onNotificationPress?: () => void;
}

export default function DashboardHeader({ userName, badgeLabel, onNotificationPress }: DashboardHeaderProps) {
  const router = useRouter();
  let unreadCount = 0;
  try {
    const notifications = useNotifications();
    unreadCount = notifications.unreadCount;
  } catch {
    // Notifications context may not be available
  }

  const getInitials = (name: string) => {
    if (!name) return 'TD';
    return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <View className="flex-row items-center justify-between mb-5">
      <View className="flex-row items-center flex-1">
        <View className="w-14 h-14 rounded-full bg-[#E8701A] items-center justify-center mr-4 border-2 border-white/20 shadow-lg shadow-orange-500/20">
          <Text className="text-[20px] font-extrabold text-white tracking-widest">{getInitials(userName)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white mb-1" numberOfLines={1}>{userName || 'Valued User'}</Text>
          <View className="flex-row items-center bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-500/30 self-start px-2 py-1 rounded-md">
            <Award size={10} color="#E8701A" className="mr-1" />
            <Text className="text-[11px] font-bold text-[#E8701A]">{badgeLabel}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm"
        onPress={onNotificationPress || (() => router.push('/dashboard/notifications'))}
      >
        <Bell size={20} color="#1E293B" className="dark:text-white" />
        {unreadCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-[#E8701A] rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
            <Text className="text-white text-[10px] font-bold">{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
