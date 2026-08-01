import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export interface QuickAction {
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  bgClass: string;
  route: string;
}

interface QuickActionGridProps {
  actions: QuickAction[];
  columns?: 3 | 4;
}

export default function QuickActionGrid({ actions, columns = 3 }: QuickActionGridProps) {
  const router = useRouter();
  const widthClass = columns === 4 ? 'w-[23%]' : 'w-[31%]';

  return (
    <View className="flex-row flex-wrap justify-between">
      {actions.map((action, i) => (
        <TouchableOpacity
          key={i}
          className={`${widthClass} bg-white dark:bg-slate-900 rounded-2xl p-3 mb-3 items-center border border-slate-200 dark:border-slate-800 shadow-sm`}
          onPress={() => router.push(action.route as any)}
          activeOpacity={0.7}
        >
          <View className={`w-10 h-10 rounded-xl items-center justify-center mb-2 ${action.bgClass}`}>
            <action.icon size={20} color={action.color} />
          </View>
          <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center" numberOfLines={2}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
