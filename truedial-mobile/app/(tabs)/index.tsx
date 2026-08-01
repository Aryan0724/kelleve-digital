import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  Search, MapPin, Grid, Star, Sparkles, Utensils, Building, 
  GraduationCap, HeartPulse, Building2, Briefcase, Bell, 
  User as UserIcon, Scan, ChevronDown, CheckCircle, ChevronRight, 
  ArrowRight, Home as HomeIcon, Award, Package, Droplet, Zap,
  HardHat, Truck, Scissors, Wrench, Landmark, Calendar, ShoppingBag,
  Gem, Store, Megaphone, MessageCircle, CreditCard, Presentation, BookOpen,
  Download, Globe
} from 'lucide-react-native';
import api from '../../services/api';
import { useNotifications } from '../../context/notifications';

interface Listing {
  id: number;
  title: string;
  slug: string;
  description: string;
  city: string;
  category?: {
    id: number;
    name: string;
  };
  reviews_avg_rating?: string;
  featured?: boolean;
}

export default function SearchIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();
  
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Patna');
  const [listings, setListings] = useState<Listing[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, [city]);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [listingsRes, offersRes] = await Promise.all([
        api.get(`/truedial/public/businesses?city=${encodeURIComponent(city)}`).catch(() => null),
        api.get(`/truedial/public/offers`).catch(() => null)
      ]);
      let lData = listingsRes?.data?.data?.data || listingsRes?.data?.data || listingsRes?.data || [];
      if (Array.isArray(lData) && lData.length === 0) {
        // Fallback fetch all listings if specific city returns 0 items
        const fallbackRes = await api.get(`/truedial/public/businesses`).catch(() => null);
        lData = fallbackRes?.data?.data?.data || fallbackRes?.data?.data || fallbackRes?.data || [];
      }

      const oData = offersRes?.data?.data?.data || offersRes?.data?.data || offersRes?.data || [];
      
      setListings(Array.isArray(lData) ? lData.slice(0, 10) : []);
      setOffers(Array.isArray(oData) ? oData.slice(0, 5) : []);
    } catch (error) {
      console.warn("Failed to fetch home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&city=${encodeURIComponent(city)}`);
    }
  };

  const categoriesList = [
    { name: "Restaurants", icon: Utensils, color: "#F97316", bg: "bg-orange-100 dark:bg-orange-950/50" },
    { name: "Hotels", icon: Building, color: "#3B82F6", bg: "bg-blue-100 dark:bg-blue-950/50" },
    { name: "Hospitals", icon: HeartPulse, color: "#EF4444", bg: "bg-red-100 dark:bg-red-950/50" },
    { name: "Education", icon: GraduationCap, color: "#10B981", bg: "bg-green-100 dark:bg-green-950/50" },
    { name: "Interior", icon: HardHat, color: "#CA8A04", bg: "bg-yellow-100 dark:bg-yellow-950/50" },
    { name: "Real Estate", icon: HomeIcon, color: "#A855F7", bg: "bg-purple-100 dark:bg-purple-950/50" },
    { name: "Movers", icon: Truck, color: "#06B6D4", bg: "bg-cyan-100 dark:bg-cyan-950/50" },
    { name: "More", icon: Grid, color: "#64748B", bg: "bg-slate-100 dark:bg-slate-800" }
  ];

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar style="auto" />
      
      {/* 1. TOP HEADER (STICKY) */}
      <View className="pt-2 px-4 pb-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-20">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700" 
            onPress={() => router.push('/(tabs)/dashboard')}
          >
            <UserIcon size={20} color="#E8701A" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              True<Text className="text-[#E8701A]">Dial</Text>
            </Text>
            <Text className="text-[9px] font-black text-[#E8701A] tracking-widest -mt-1">GROWTH PLATFORM</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              className="flex-row items-center bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 rounded-full px-3 py-1.5 max-w-[120px]"
            >
              <MapPin size={12} color="#E8701A" />
              <Text className="text-xs font-bold text-[#E8701A] mx-1" numberOfLines={1}>{city}</Text>
              <ChevronDown size={12} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity className="relative p-1" onPress={() => router.push('/dashboard/notifications')}>
              <Bell size={22} color="#1E293B" className="dark:text-white" />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-[#E8701A] rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                  <Text className="text-white text-[10px] font-bold">{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 h-12 shadow-sm">
          <Search size={18} color="#E8701A" className="mr-2" />
          <TextInput
            className="flex-1 text-slate-900 dark:text-white text-[15px] font-medium"
            placeholder={`Search TrueDial in ${city}`}
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity className="p-1 border-l border-slate-300 dark:border-slate-700 pl-2 ml-1">
            <Scan size={18} color="#64748B" className="dark:text-white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 2. HERO SECTION */}
        <View className="px-4 py-8 bg-blue-50/50 dark:bg-slate-900 items-center border-b border-slate-200 dark:border-slate-800">
          <View className="flex-row items-center bg-orange-100 dark:bg-orange-950/50 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800 mb-4">
            <Sparkles size={12} color="#E8701A" />
            <Text className="text-[10px] font-extrabold text-[#E8701A] uppercase tracking-wider ml-1">India's #1 Local Discovery Engine</Text>
          </View>
          <Text className="text-3xl font-extrabold text-slate-900 dark:text-white text-center leading-tight mb-2">
            Search Across <Text className="text-[#E8701A]">50,000+</Text> Verified Businesses
          </Text>
          <Text className="text-sm text-slate-600 dark:text-slate-400 text-center px-4 mb-6">
            Find verified Interior Designers, Doctors, Hotels & B2B Wholesalers with guaranteed reviews & VIP Privilege discounts.
          </Text>
          
          <TouchableOpacity 
            className="w-full bg-[#EA580C] rounded-xl py-3.5 px-4 flex-row items-center justify-center shadow-lg shadow-orange-500/30"
            onPress={() => router.push('/list-business')}
          >
            <Sparkles size={16} color="#FFFFFF" className="mr-2" />
            <Text className="text-white text-[15px] font-bold">Post Your Requirement / Get Quotes</Text>
          </TouchableOpacity>
        </View>

        {/* 3. PROMOTIONAL FEATURE CARDS (Horizontal Scroll) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-6 px-4" contentContainerStyle={{ paddingRight: 32 }}>
          {/* Card 1: VIP Club */}
          <View className="w-72 bg-amber-600 rounded-3xl p-5 mr-4 overflow-hidden border border-orange-400/30">
            <View className="bg-white/20 self-start px-2.5 py-1 rounded-full mb-3 flex-row items-center">
              <Gem size={12} color="#FFF" />
              <Text className="text-[10px] font-bold text-white ml-1">TrueDial VIP Club</Text>
            </View>
            <Text className="text-xl font-extrabold text-white mb-1">Multi-City VIP Privilege Card</Text>
            <Text className="text-xs text-orange-100 mb-4">Up to 50% discounts across 500+ restaurants, hotels & clinics.</Text>
            <TouchableOpacity className="bg-white py-2 px-4 rounded-lg self-start flex-row items-center" onPress={() => router.push('/offers')}>
              <Text className="text-sm font-bold text-slate-900 mr-1">Claim VIP Card</Text>
              <ArrowRight size={14} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* Card 2: B2B */}
          <View className="w-72 bg-emerald-800 rounded-3xl p-5 mr-4 overflow-hidden border border-emerald-600/30">
            <View className="bg-white/20 self-start px-2.5 py-1 rounded-full mb-3 flex-row items-center">
              <Briefcase size={12} color="#FFF" />
              <Text className="text-[10px] font-bold text-white ml-1">TrueDial B2B Supply</Text>
            </View>
            <Text className="text-xl font-extrabold text-white mb-1">Direct Wholesale & Manufacturing</Text>
            <Text className="text-xs text-emerald-100 mb-4">Source commercial materials directly from verified manufacturers.</Text>
            <TouchableOpacity className="bg-emerald-600 py-2 px-4 rounded-lg self-start flex-row items-center" onPress={() => router.push('/search?category=B2B')}>
              <Text className="text-sm font-bold text-white mr-1">Browse B2B</Text>
              <ArrowRight size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 4. PRIMARY 16-CATEGORY GRID */}
        <View className="px-4 py-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-[11px] font-extrabold text-[#E8701A] uppercase tracking-wider">Top Categories</Text>
              <Text className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">Explore All Services</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/category')}>
              <Text className="text-sm font-bold text-[#E8701A]">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {categoriesList.map((cat, i) => (
              <TouchableOpacity 
                key={i} 
                className="w-[23%] items-center mb-5"
                onPress={() => cat.name === 'More' ? router.push('/category') : router.push(`/search?category=${encodeURIComponent(cat.name)}`)}
              >
                <View className={`w-14 h-14 rounded-2xl justify-center items-center mb-1.5 ${cat.bg} shadow-sm border border-transparent dark:border-slate-800`}>
                  <cat.icon size={24} color={cat.color} />
                </View>
                <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5. EXPLORE TOP VERIFIED BUSINESSES */}
        <View className="px-4 py-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-[11px] font-extrabold text-[#E8701A] uppercase tracking-wider">Top Rated</Text>
              <Text className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">Verified Businesses</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text className="text-sm font-bold text-[#E8701A]">View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color="#E8701A" className="my-6" />
          ) : listings.length > 0 ? (
            listings.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="bg-white dark:bg-slate-950 rounded-2xl p-4 mb-4 shadow-sm border border-slate-200 dark:border-slate-800"
                onPress={() => router.push(`/listing/${item.slug}`)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 pr-3">
                    <Text className="text-[16px] font-extrabold text-slate-900 dark:text-white mb-1 leading-tight">{item.title}</Text>
                    <View className="flex-row items-center flex-wrap">
                      <Text className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mr-2">
                        {item.category?.name || 'Business'}
                      </Text>
                      <View className="flex-row items-center mr-2">
                        <MapPin size={10} color="#64748B" className="mr-0.5" />
                        <Text className="text-[11px] font-semibold text-slate-500">{item.city}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row items-center bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" className="mr-1" />
                    <Text className="text-[11px] font-bold text-amber-600">{item.reviews_avg_rating ? parseFloat(item.reviews_avg_rating).toFixed(1) : '4.5'}</Text>
                  </View>
                </View>
                
                {item.description && (
                  <Text className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3 mt-1" numberOfLines={2}>
                    {item.description}
                  </Text>
                )}

                <View className="flex-row justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                  <Text className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded">● ONLINE NOW</Text>
                  <Text className="text-xs font-bold text-[#E8701A]">View Profile & Offers →</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center py-6">
              <Text className="text-slate-500">No verified businesses found in {city}.</Text>
            </View>
          )}
        </View>

        {/* 6. BUSINESS SOLUTIONS */}
        <View className="px-4 py-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pb-12">
          <View className="items-center mb-8">
            <Text className="text-[11px] font-extrabold text-[#E8701A] uppercase tracking-wider">Grow With Us</Text>
            <Text className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 text-center">Solutions for Your Business</Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {[
              { title: "Free Listing", icon: Store, route: "/list-business" },
              { title: "Marketing", icon: Megaphone, route: "/dashboard/business/marketing" },
              { title: "Privilege Partner", icon: CreditCard, route: "/privilege" },
              { title: "Consulting", icon: Presentation, route: "/consulting" }
            ].map((sol, i) => (
              <TouchableOpacity 
                key={i} 
                className="w-[48%] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 items-center"
                onPress={() => router.push(sol.route as any)}
              >
                <View className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl items-center justify-center shadow-sm mb-3">
                  <sol.icon size={22} color="#0F172A" />
                </View>
                <Text className="text-sm font-bold text-slate-900 dark:text-white text-center">{sol.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
