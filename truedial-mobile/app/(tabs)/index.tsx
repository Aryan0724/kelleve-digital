import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Menu, Bell, MessageCircle, MapPin, Mic, Search, ChevronDown,
  Utensils, HeartPulse, Building, GraduationCap, HardHat, Car,
  Smartphone, Shirt, Wrench, ArrowRight, ShieldCheck, Star,
  Briefcase, Megaphone, Globe, Trophy, Newspaper, Tag, CreditCard,
  Bookmark, Users, Truck, Bug, PartyPopper, Scale
} from "lucide-react-native";
import api from "../../services/api";
import { useNotifications } from "../../context/notifications";
import LocationSelectorModal from "../../components/LocationSelectorModal";

const { width } = Dimensions.get("window");

interface Listing {
  id: number;
  title: string;
  slug: string;
  description: string;
  city: string;
  category?: { id: number; name: string };
  reviews_avg_rating?: string;
  is_verified?: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Patna");
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData(city);
  }, []);

  const fetchHomeData = async (targetCity = city) => {
    setLoading(true);
    try {
      const res = await api
        .get(`/truedial/public/businesses?city=${encodeURIComponent(targetCity)}`)
        .catch(() => null);
      let lData = res?.data?.data?.data || res?.data?.data || res?.data || [];
      if (Array.isArray(lData) && lData.length === 0) {
        const fallback = await api.get(`/truedial/public/businesses`).catch(() => null);
        lData = fallback?.data?.data?.data || fallback?.data?.data || fallback?.data || [];
      }
      setListings(Array.isArray(lData) ? lData.slice(0, 8) : []);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&city=${encodeURIComponent(city)}`);
    }
  };

  // 14 Categories mapping the web app
  const topCategories = [
    { name: "Restaurant\n& Food", icon: Utensils, color: "#EA580C" },
    { name: "Hotel\n& Resort", icon: Building, color: "#9333EA" },
    { name: "Hospital\n& Healthcare", icon: HeartPulse, color: "#DC2626" },
    { name: "Education\n& Coaching", icon: GraduationCap, color: "#2563EB" },
    { name: "Interior\n& Const.", icon: HardHat, color: "#D97706" },
    { name: "Automobile", icon: Car, color: "#0284C7" },
    { name: "Electronics\n& Mobile", icon: Smartphone, color: "#059669" },
    { name: "Fashion\n& Lifestyle", icon: Shirt, color: "#DB2777" },
    { name: "Real Estate", icon: Building, color: "#7C3AED" },
    { name: "Home\nServices", icon: Wrench, color: "#0F766E" },
    { name: "Movers\n& Packers", icon: Truck, color: "#D97706" },
    { name: "Pest\nControl", icon: Bug, color: "#65A30D" },
    { name: "Wedding\n& Events", icon: PartyPopper, color: "#C026D3" },
    { name: "CA & Legal\nServices", icon: Scale, color: "#475569" },
  ];

  const trendingServices = [
    { title: "Pest Control", badge: "20% OFF", color: "#1e3a8a" },
    { title: "Packers & Movers", badge: "FAST", color: "#1e40af" },
    { title: "Wedding Planners", badge: "PREMIUM", color: "#1d4ed8" },
    { title: "Modular Kitchen", badge: "TRENDING", color: "#2563eb" },
    { title: "AC Repair", badge: "SUMMER", color: "#3b82f6" },
  ];

  const topBusinesses = [
    { name: "Sharma Packers", rating: "4.9", location: "Andheri West, Mumbai" },
    { name: "Apollo Diagnostics", rating: "4.8", location: "Koramangala, Bangalore" },
    { name: "GreenLeaf Pest", rating: "4.7", location: "Connaught Place, Delhi" },
    { name: "Vivid Interiors", rating: "5.0", location: "Banjara Hills, Hyderabad" },
  ];

  const blogs = [
    { title: "How to Optimize Your Business Listing", category: "MARKETING" },
    { title: "5 Proven Strategies to Convert Leads", category: "SALES" },
    { title: "Why Online Reviews Are Important", category: "SEO" }
  ];

  return (
    <View className="flex-1 bg-[#F8FAFC]" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* ══════════════ TOP BAR ══════════════ */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 z-20">
        <TouchableOpacity onPress={() => router.push("/dashboard/user/account" as any)} className="p-1">
          <Menu size={22} color="#0B1D3A" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)" as any)} className="flex-row items-center gap-1.5">
          <View className="w-7 h-7 rounded-lg bg-orange-600 items-center justify-center">
            <Text className="text-white font-black text-[10px]">TD</Text>
          </View>
          <Text className="text-lg font-black text-blue-800">
            true<Text className="text-orange-600">dial</Text>
            <Text className="text-slate-500 text-xs">.com</Text>
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <TouchableOpacity className="p-1" onPress={() => router.push("/(tabs)/messages" as any)}>
            <MessageCircle size={20} color="#0B1D3A" />
          </TouchableOpacity>
          <TouchableOpacity className="p-1 ml-1 relative" onPress={() => router.push("/dashboard/notifications" as any)}>
            <Bell size={20} color="#0B1D3A" />
            {(unreadCount > 0) && (
              <View className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-500 items-center justify-center px-0.5">
                <Text className="text-white text-[8px] font-black">{unreadCount > 9 ? "9+" : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* ══════════════ HERO & SEARCH ══════════════ */}
        <View className="bg-[#0B1D3A] pb-6">
          <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
            <TouchableOpacity className="flex-row items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full" onPress={() => setLocationModalVisible(true)}>
              <MapPin size={14} color="#FBBF24" />
              <Text className="text-[13px] font-bold text-white mx-0.5">{city}</Text>
              <ChevronDown size={14} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-white/10 items-center justify-center">
              <Mic size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="px-4 mt-2 mb-4">
            <Text className="text-2xl font-black text-white">Search Anything,</Text>
            <Text className="text-2xl font-black text-orange-500">Anywhere in India.</Text>
            <Text className="text-xs text-slate-300 font-medium mt-1">Over 50,000+ verified businesses</Text>
          </View>

          {/* Search bar */}
          <View className="mx-4 bg-white rounded-xl h-12 flex-row items-center shadow-lg shadow-black/20 overflow-hidden">
            <View className="px-3 border-r border-slate-200 h-full justify-center">
              <Text className="text-[11px] font-bold text-slate-500">FIND</Text>
            </View>
            <TextInput
              className="flex-1 text-[13px] text-slate-800 px-3 h-full"
              placeholder="Search services, businesses..."
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity className="bg-orange-600 h-full px-4 items-center justify-center" onPress={handleSearch}>
              <Search size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ══════════════ PROMO BANNER (Horizontal) ══════════════ */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
          <View className="w-[300px] h-[120px] bg-blue-900 rounded-2xl p-4 overflow-hidden relative">
            <View className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-800 rounded-full" />
            <Text className="text-white font-black text-lg">List Your Business</Text>
            <Text className="text-blue-200 text-xs mt-1">Get premium leads and customers.</Text>
            <TouchableOpacity className="mt-4 bg-orange-600 self-start px-4 py-1.5 rounded-lg">
              <Text className="text-white font-bold text-xs">Start FREE</Text>
            </TouchableOpacity>
          </View>
          <View className="w-[300px] h-[120px] bg-emerald-900 rounded-2xl p-4 overflow-hidden relative">
            <View className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-800 rounded-full" />
            <Text className="text-white font-black text-lg">TrueDial Deals</Text>
            <Text className="text-emerald-200 text-xs mt-1">Up to 50% off on top services.</Text>
            <TouchableOpacity className="mt-4 bg-white self-start px-4 py-1.5 rounded-lg">
              <Text className="text-emerald-900 font-bold text-xs">Explore</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ══════════════ POPULAR CATEGORIES ══════════════ */}
        <View className="px-4 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black text-slate-900">Popular Categories</Text>
            <TouchableOpacity onPress={() => router.push("/category" as any)}>
              <Text className="text-xs font-bold text-blue-700">View All →</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-y-4">
            {topCategories.map((cat, i) => (
              <TouchableOpacity
                key={i}
                className="w-1/4 items-center mb-2"
                onPress={() => router.push(`/search?category=${encodeURIComponent(cat.name.replace("\n", " "))}&city=${encodeURIComponent(city)}` as any)}
              >
                <View className="w-14 h-14 rounded-full items-center justify-center mb-1.5 shadow-sm bg-white border border-slate-100" style={{ shadowColor: cat.color, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}>
                  <cat.icon size={22} color={cat.color} strokeWidth={2} />
                </View>
                <Text className="text-[9px] font-bold text-slate-700 text-center leading-[11px]">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ══════════════ TRENDING SERVICES ══════════════ */}
        <View className="pb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black text-slate-900">Trending Services</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
            {trendingServices.map((service, i) => (
              <TouchableOpacity key={i} className="w-36 h-48 rounded-2xl overflow-hidden bg-slate-200 relative shadow-md">
                <View className="absolute inset-0 bg-slate-800" />
                <View className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <View className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[8px] font-black uppercase text-blue-900 shadow-sm">
                  <Text className="text-[8px] font-black uppercase text-blue-900">{service.badge}</Text>
                </View>
                <Text className="absolute bottom-3 left-3 text-white font-bold text-sm drop-shadow-md pr-2 leading-tight">
                  {service.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════ TOP RATED BUSINESSES ══════════════ */}
        <View className="pb-6 bg-white pt-6 border-t border-slate-100">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black text-slate-900">Top Rated Businesses</Text>
            <TouchableOpacity onPress={() => router.push("/search" as any)}>
              <Text className="text-xs font-bold text-blue-700">See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
            {topBusinesses.map((biz, i) => (
              <View key={i} className="w-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center">
                    <Text className="text-blue-700 font-black text-lg">{biz.name.charAt(0)}</Text>
                  </View>
                  <View className="flex-row items-center gap-1 bg-green-100 px-2 py-0.5 rounded">
                    <Text className="text-green-800 text-[10px] font-bold">{biz.rating}</Text>
                    <Star size={10} color="#166534" fill="#166534" />
                  </View>
                </View>
                <Text className="font-bold text-slate-900 text-sm mb-1">{biz.name}</Text>
                <Text className="text-[10px] text-slate-500 mb-4">{biz.location}</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity className="flex-1 bg-green-600 py-2 rounded-lg items-center">
                    <Text className="text-white font-bold text-[10px]">Call Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-blue-50 py-2 rounded-lg items-center">
                    <Text className="text-blue-700 font-bold text-[10px]">Get Quote</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════ HOW TRUEDIAL HELPS ══════════════ */}
        <View className="px-4 py-8 bg-blue-50/50">
          <Text className="text-xl font-black text-slate-900 text-center mb-6">
            How <Text className="text-orange-500">TrueDial</Text> Helps You Grow
          </Text>
          <View className="gap-3">
            {[
              { title: "Digital Business Profile", desc: "Build your trusted online presence.", icon: Bookmark },
              { title: "Reach More Customers", desc: "Get genuine business leads.", icon: Users },
              { title: "Promote Offers & Deals", desc: "Increase sales with smart marketing.", icon: Megaphone }
            ].map((feature, i) => (
              <View key={i} className="flex-row items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-4">
                <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center">
                  <feature.icon size={20} color="#1E40AF" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 text-[13px]">{feature.title}</Text>
                  <Text className="text-slate-500 text-[11px] mt-0.5">{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ══════════════ BUSINESS INSIGHTS & BLOGS ══════════════ */}
        <View className="px-4 py-8 bg-slate-900">
          <Text className="text-xl font-black text-white mb-1">Business Insights & Guides</Text>
          <Text className="text-slate-400 text-[11px] mb-6">Expert advice to grow your business.</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {blogs.map((blog, i) => (
              <TouchableOpacity key={i} className="w-64 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                <View className="h-32 bg-slate-700 relative">
                  <View className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded-full">
                    <Text className="text-[8px] font-black text-blue-900">{blog.category}</Text>
                  </View>
                </View>
                <View className="p-4">
                  <Text className="text-slate-400 text-[9px] font-bold tracking-widest mb-1">AUG 2026</Text>
                  <Text className="text-white font-bold text-[13px] leading-tight mb-4">{blog.title}</Text>
                  <Text className="text-blue-400 text-[10px] font-bold">Read Article →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ══════════════ RECENT VERIFIED LISTINGS ══════════════ */}
        <View className="px-4 pt-8 pb-4">
          <Text className="text-lg font-black text-slate-900 mb-4">Recently Verified</Text>
          {loading ? (
            <ActivityIndicator color="#1E40AF" className="mt-4" />
          ) : listings.length > 0 ? (
            listings.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-white rounded-2xl p-4 mb-3 border border-slate-200 shadow-sm"
                onPress={() => router.push(`/listing/${item.slug}` as any)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 pr-2">
                    <Text className="text-[14px] font-bold text-slate-900" numberOfLines={1}>{item.title}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <View className="bg-blue-50 px-2 py-0.5 rounded">
                        <Text className="text-[9px] font-bold text-blue-700">{item.category?.name || "Business"}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <MapPin size={9} color="#64748B" />
                        <Text className="text-[10px] text-slate-500 ml-0.5">{item.city}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <Star size={10} color="#D97706" fill="#D97706" />
                    <Text className="text-[10px] font-bold text-amber-800">
                      {item.reviews_avg_rating ? parseFloat(item.reviews_avg_rating).toFixed(1) : "4.5"}
                    </Text>
                  </View>
                </View>
                {item.description && (
                  <Text className="text-[11px] text-slate-500 leading-[16px] mb-3" numberOfLines={2}>{item.description}</Text>
                )}
                <View className="flex-row justify-between items-center pt-2 border-t border-slate-100">
                  <Text className="text-[9px] font-bold text-emerald-600 tracking-wider">● VERIFIED</Text>
                  <Text className="text-[10px] font-bold text-blue-700">View Details →</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : null}
        </View>

      </ScrollView>

      <LocationSelectorModal
        visible={locationModalVisible}
        currentCity={city}
        onClose={() => setLocationModalVisible(false)}
        onSelectCity={(selectedCity) => {
          setCity(selectedCity);
          fetchHomeData(selectedCity);
        }}
      />
    </View>
  );
}
