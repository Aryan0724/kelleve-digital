import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  noBorder?: boolean;
}

export default function MenuItem({ icon, title, subtitle, onPress, noBorder = false }: MenuItemProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between p-4 ${!noBorder ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 items-center justify-center mr-3 border border-slate-200 dark:border-slate-800">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-slate-900 dark:text-white">{title}</Text>
          {subtitle && <Text className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight size={16} color="#94A3B8" className="dark:text-slate-500" />
    </TouchableOpacity>
  );
}
