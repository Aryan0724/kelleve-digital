import React from 'react';
import { Text, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgClass?: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ title, value, icon, iconBgClass = 'bg-blue-100 dark:bg-blue-900/30', trend, trendUp }: StatCardProps) {
  return (
    <View className="w-[48%] bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
      <View className="flex-row items-center justify-between mb-3">
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${iconBgClass}`}>
          {icon}
        </View>
        {trend && (
          <View className={`px-1.5 py-0.5 rounded-md ${trendUp ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
            <Text className={`text-[10px] font-bold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>{trend}</Text>
          </View>
        )}
      </View>
      <Text className="text-[24px] font-extrabold text-slate-900 dark:text-white mb-1">{value}</Text>
      <Text className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">{title}</Text>
    </View>
  );
}
