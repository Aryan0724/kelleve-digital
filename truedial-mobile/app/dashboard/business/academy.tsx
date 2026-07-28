import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, PlayCircle } from 'lucide-react-native';

export default function AcademyScreen() {
  const router = useRouter();

  const articles = [
    { title: "How to rank #1 on TrueDial search", category: "SEO", readTime: "5 min", color: "bg-blue-500" },
    { title: "Closing 80% of your incoming leads", category: "Sales", readTime: "8 min", color: "bg-emerald-500" },
    { title: "Mastering WhatsApp Marketing", category: "Marketing", readTime: "4 min", color: "bg-orange-500" }
  ];

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">TD Academy</Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Featured Course */}
        <TouchableOpacity className="bg-slate-900 rounded-[20px] overflow-hidden mb-6 shadow-md border border-slate-800">
          <View className="h-40 bg-indigo-600 justify-center items-center">
            <PlayCircle size={48} color="white" opacity={0.8} />
          </View>
          <View className="p-5">
            <View className="bg-indigo-500 self-start px-2 py-1 rounded mb-2">
              <Text className="text-[10px] font-bold text-white uppercase tracking-wider">Featured Masterclass</Text>
            </View>
            <Text className="text-xl font-extrabold text-white mb-1">The TrueDial Growth Blueprint</Text>
            <Text className="text-sm text-slate-400">Learn how top businesses generate 10x ROI on the platform.</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-[18px] font-bold text-slate-900 dark:text-white mb-4">Latest Articles</Text>
        
        {articles.map((item, idx) => (
          <TouchableOpacity key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-4 mb-3 border border-slate-200 dark:border-slate-800 flex-row items-center shadow-sm">
            <View className={`w-12 h-12 rounded-lg ${item.color} items-center justify-center mr-4`}>
              <BookOpen size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">{item.title}</Text>
              <View className="flex-row items-center">
                <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.category}</Text>
                <Text className="text-[11px] text-slate-400 mx-2">•</Text>
                <Text className="text-[11px] text-slate-500">{item.readTime} read</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
