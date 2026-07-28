import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Utensils, Building, HeartPulse, GraduationCap, HardHat, Home, Truck, Wrench, Briefcase, Package, ShoppingBag, Scissors, Landmark } from 'lucide-react-native';

export default function AllCategoriesScreen() {
  const router = useRouter();

  const categories = [
    { name: "Restaurants", icon: Utensils, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-950/50" },
    { name: "Hotels", icon: Building, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/50" },
    { name: "Hospitals", icon: HeartPulse, color: "text-red-500", bg: "bg-red-100 dark:bg-red-950/50" },
    { name: "Education", icon: GraduationCap, color: "text-green-500", bg: "bg-green-100 dark:bg-green-950/50" },
    { name: "Interior Designers", icon: HardHat, color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-950/50" },
    { name: "Real Estate", icon: Home, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-950/50" },
    { name: "Packers & Movers", icon: Truck, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-950/50" },
    { name: "Electricians", icon: Wrench, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-950/50" },
    { name: "B2B Wholesale", icon: Package, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-950/50" },
    { name: "Shopping", icon: ShoppingBag, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-950/50" },
    { name: "Salons & Spa", icon: Scissors, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-950/50" },
    { name: "Consulting & Legal", icon: Landmark, color: "text-slate-600", bg: "bg-slate-200 dark:bg-slate-800" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center pt-4 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white ml-4">All Categories</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {categories.map((cat, i) => (
            <TouchableOpacity 
              key={i} 
              className="w-[31%] items-center mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
              onPress={() => router.push(`/search?category=${encodeURIComponent(cat.name)}`)}
            >
              <View className={`w-14 h-14 rounded-full justify-center items-center mb-3 ${cat.bg}`}>
                <cat.icon size={24} className={cat.color} />
              </View>
              <Text className="text-[12px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
