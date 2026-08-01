import React, { useState, useEffect } from 'react';
import {
  Text, View, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, Modal, ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { 
  ArrowLeft, Search as SearchIcon, Filter, MapPin, 
  Star, Building2, ShieldCheck, CheckSquare, Square, X 
} from 'lucide-react-native';

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q, city: initialCity, category: initialCategory } = useLocalSearchParams<{ q: string, city: string, category: string }>();
  
  const [query, setQuery] = useState(q || '');
  const [city, setCity] = useState(initialCity || 'Mumbai');
  const [category, setCategory] = useState(initialCategory || '');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [minRating, setMinRating] = useState('');
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [q, initialCity, initialCategory]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get('/truedial/public/businesses', { 
        params: { 
          q: query, 
          city,
          category_name: category,
          verified: verifiedOnly ? 'true' : '',
          premium: premiumOnly ? 'true' : '',
          min_rating: minRating
        } 
      });
      const data = res.data?.data || res.data || [];
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setFilterVisible(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/listing/${item.slug}`)} activeOpacity={0.9} className="bg-white dark:bg-slate-900 rounded-2xl mb-4 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <View className="p-4">
        <View className="flex-row items-start mb-3">
          <View className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 items-center justify-center mr-3 overflow-hidden">
            {item.cover_image || item.media?.[0]?.url ? (
              <View className="w-full h-full bg-slate-200" /> 
            ) : (
              <Building2 size={24} color="#94A3B8" />
            )}
          </View>
          <View className="flex-1 pr-2">
            <View className="flex-row items-center mb-1">
              <Text className="text-[16px] font-extrabold text-slate-900 dark:text-white flex-1" numberOfLines={1}>{item.title}</Text>
              {item.is_verified || item.verified ? (
                <ShieldCheck size={14} color="#10B981" className="ml-1" />
              ) : null}
            </View>
            <View className="flex-row items-center mb-1">
              <Text className="text-[12px] font-bold text-[#E8701A] bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded">
                {item.category?.name || item.category || 'Business'}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <MapPin size={12} color="#64748B" />
              <Text className="text-[12px] font-medium text-slate-500 ml-1">{item.address || item.city || item.locality}</Text>
            </View>
          </View>
        </View>
        
        {item.description ? (
          <Text className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3" numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View className="flex-row justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
          <View className="flex-row items-center bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-900">
            <Star size={12} color="#F59E0B" fill="#F59E0B" className="mr-1" />
            <Text className="text-[12px] font-bold text-amber-600">{item.avg_rating || item.reviews_avg_rating || '4.5'}</Text>
          </View>
          
          <TouchableOpacity className="bg-[#E8701A] px-4 py-2 rounded-lg">
            <Text className="text-white text-[12px] font-bold">View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
            <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-slate-900 dark:text-white">Search</Text>
          <View className="w-10 h-10" />
        </View>

        <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden h-12 shadow-sm">
          <SearchIcon size={18} color="#64748B" className="ml-3 mr-2" />
          <TextInput 
            className="flex-1 text-[15px] text-slate-900 dark:text-white font-medium"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={fetchResults}
            placeholder="Search businesses, services..."
            placeholderTextColor="#94A3B8"
            returnKeyType="search"
          />
          <TouchableOpacity className="p-3 border-l border-slate-300 dark:border-slate-700" onPress={() => setFilterVisible(true)}>
            <Filter size={18} color="#E8701A" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8701A" className="mt-10" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id || Math.random())}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListHeaderComponent={
            <Text className="text-[13px] font-extrabold text-slate-500 uppercase tracking-wider mb-4">
              {results.length} results found
            </Text>
          }
          ListEmptyComponent={
            <View className="items-center justify-center mt-16 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
              <SearchIcon size={48} color="#CBD5E1" className="dark:text-slate-700 mb-4" />
              <Text className="text-slate-900 dark:text-white text-[18px] font-bold mb-2">No businesses found</Text>
              <Text className="text-slate-500 text-center mb-6 leading-relaxed">Try adjusting your filters or searching for a different city.</Text>
              <TouchableOpacity onPress={() => setFilterVisible(true)} className="bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <Text className="text-slate-700 dark:text-slate-300 font-bold">Change Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* FILTER MODAL */}
      <Modal visible={filterVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl pt-5 pb-8 px-6 max-h-[90%] border-t border-slate-200 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-extrabold text-slate-900 dark:text-white">Advanced Filters</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">City</Text>
              <TextInput 
                className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-[15px] text-slate-900 dark:text-white mb-5 font-medium"
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Mumbai"
                placeholderTextColor="#94A3B8"
              />

              <Text className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Category</Text>
              <TextInput 
                className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-[15px] text-slate-900 dark:text-white mb-6 font-medium"
                value={category}
                onChangeText={setCategory}
                placeholder="e.g. Restaurants"
                placeholderTextColor="#94A3B8"
              />

              <Text className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">Quality & Badges</Text>
              <TouchableOpacity 
                className="flex-row items-center mb-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700" 
                onPress={() => setVerifiedOnly(!verifiedOnly)}
              >
                {verifiedOnly ? <CheckSquare size={20} color="#E8701A" /> : <Square size={20} color="#94A3B8" />}
                <ShieldCheck size={18} color="#10B981" className="ml-3 mr-2" />
                <Text className="text-[15px] font-bold text-slate-700 dark:text-slate-300">Verified Businesses Only</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center mb-6 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700" 
                onPress={() => setPremiumOnly(!premiumOnly)}
              >
                {premiumOnly ? <CheckSquare size={20} color="#E8701A" /> : <Square size={20} color="#94A3B8" />}
                <Star size={18} color="#F59E0B" className="ml-3 mr-2" />
                <Text className="text-[15px] font-bold text-slate-700 dark:text-slate-300">Premium Partners</Text>
              </TouchableOpacity>

              <Text className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">Minimum Rating</Text>
              <View className="flex-row justify-between mb-8">
                {['', '3.0', '4.0', '4.5'].map((val) => (
                  <TouchableOpacity 
                    key={val}
                    className={`px-4 py-2 rounded-lg border ${minRating === val ? 'bg-amber-100 border-amber-400 dark:bg-amber-900 dark:border-amber-700' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}
                    onPress={() => setMinRating(val)}
                  >
                    <Text className={`font-bold ${minRating === val ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {val === '' ? 'Any' : `${val}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                className="bg-[#E8701A] h-14 rounded-xl items-center justify-center shadow-lg shadow-orange-500/30"
                onPress={fetchResults}
              >
                <Text className="text-white font-extrabold text-[16px]">Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
