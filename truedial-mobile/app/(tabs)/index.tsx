import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Menu,
  Bell,
  MessageCircle,
  MapPin,
  Mic,
  Search,
  ChevronDown,
  Utensils,
  HeartPulse,
  Building,
  GraduationCap,
  HardHat,
  Car,
  Smartphone,
  Shirt,
  Grid,
  ArrowRight,
  ShieldCheck,
  Star,
  Briefcase,
  Megaphone,
  Globe,
  Sparkles,
  Trophy,
  Award,
  Radio,
  Newspaper,
  Layers,
  Tag,
  CreditCard,
  PlusCircle,
  Bookmark,
} from "lucide-react-native";
import api from "../../services/api";
import { useNotifications } from "../../context/notifications";

const { width } = Dimensions.get("window");

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
  is_verified?: boolean;
}

export default function SearchIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Patna, Bihar");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const res = await api
        .get(`/truedial/public/businesses?city=Patna`)
        .catch(() => null);
      let lData = res?.data?.data?.data || res?.data?.data || res?.data || [];
      if (Array.isArray(lData) && lData.length === 0) {
        const fallbackRes = await api
          .get(`/truedial/public/businesses`)
          .catch(() => null);
        lData =
          fallbackRes?.data?.data?.data ||
          fallbackRes?.data?.data ||
          fallbackRes?.data ||
          [];
      }
      setListings(Array.isArray(lData) ? lData.slice(0, 10) : []);
    } catch (error) {
      console.warn("Failed to fetch home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&city=Patna`);
    }
  };

  const quickActions = [
    {
      name: "Find Business",
      icon: Search,
      color: "#1D4ED8",
      bg: "bg-blue-100 dark:bg-blue-950/60",
      route: "/search",
    },
    {
      name: "Best Deals & Offers",
      icon: Tag,
      color: "#16A34A",
      bg: "bg-emerald-100 dark:bg-emerald-950/60",
      route: "/offers",
    },
    {
      name: "Privilege Card",
      icon: CreditCard,
      color: "#9333EA",
      bg: "bg-purple-100 dark:bg-purple-950/60",
      route: "/offers",
    },
    {
      name: "Post Requirement",
      icon: PlusCircle,
      color: "#EA580C",
      bg: "bg-orange-100 dark:bg-orange-950/60",
      route: "/(tabs)/post",
    },
    {
      name: "Truedial Academy",
      icon: GraduationCap,
      color: "#2563EB",
      bg: "bg-sky-100 dark:bg-sky-950/60",
      route: "/category",
    },
  ];

  const topCategories = [
    {
      name: "Restaurant & Food",
      icon: Utensils,
      color: "#EA580C",
      bg: "bg-orange-50 dark:bg-orange-950/40",
    },
    {
      name: "Hospital & Healthcare",
      icon: HeartPulse,
      color: "#DC2626",
      bg: "bg-red-50 dark:bg-red-950/40",
    },
    {
      name: "Hotel & Resort",
      icon: Building,
      color: "#7C3AED",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      name: "Education & Coaching",
      icon: GraduationCap,
      color: "#2563EB",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      name: "Interior & Construction",
      icon: HardHat,
      color: "#D97706",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      name: "Automobile",
      icon: Car,
      color: "#0284C7",
      bg: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      name: "Electronics & Mobile",
      icon: Smartphone,
      color: "#059669",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      name: "Fashion & Lifestyle",
      icon: Shirt,
      color: "#DB2777",
      bg: "bg-pink-50 dark:bg-pink-950/40",
    },
    {
      name: "Real Estate",
      icon: Building,
      color: "#9333EA",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      name: "More Categories",
      icon: Grid,
      color: "#475569",
      bg: "bg-slate-100 dark:bg-slate-800",
    },
  ];

  const ecosystemPlatforms = [
    {
      name: "truedial.com",
      tag: "Business Listing & Growth",
      color: "#1E40AF",
      logoBg: "bg-blue-600",
    },
    {
      name: "PYND.in",
      tag: "Tender & Project Marketplace",
      color: "#D97706",
      logoBg: "bg-amber-600",
    },
    {
      name: "Best in Bharat",
      tag: "Top Businesses in India",
      color: "#1D4ED8",
      logoBg: "bg-blue-700",
    },
    {
      name: "Best in Bihar.in",
      tag: "Bihar's Trusted Directory",
      color: "#059669",
      logoBg: "bg-emerald-600",
    },
    {
      name: "EasyGet.in",
      tag: "Deals & Services Near You",
      color: "#DC2626",
      logoBg: "bg-red-600",
    },
  ];

  const premiumServices = [
    {
      name: "Digital Marketing",
      icon: Megaphone,
      color: "#9333EA",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      name: "SMS / WhatsApp Campaign",
      icon: MessageCircle,
      color: "#16A34A",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      name: "Business Consulting",
      icon: Briefcase,
      color: "#2563EB",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      name: "Website Development",
      icon: Globe,
      color: "#EA580C",
      bg: "bg-orange-50 dark:bg-orange-950/40",
    },
    {
      name: "AI Business Solutions",
      icon: Sparkles,
      color: "#7C3AED",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
  ];

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-[#F8FAFC] dark:bg-slate-950"
    >
      <StatusBar style="dark" />

      {/* 1. TOP BAR */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-20">
        <TouchableOpacity className="p-1">
          <Menu size={24} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>

        {/* Brand Logo */}
        <View className="items-center">
          <View className="flex-row items-center">
            <View className="w-6 h-6 rounded-full bg-[#E8701A] items-center justify-center mr-1">
              <Text className="text-white text-[13px] font-black">P</Text>
            </View>
            <Text className="text-[20px] font-black text-[#1E40AF] tracking-tight">
              truedial<Text className="text-[#E8701A]">.com</Text>
            </Text>
          </View>
          <View className="flex-row items-center -mt-0.5">
            <ShieldCheck size={10} color="#1E40AF" />
            <Text className="text-[9px] font-bold text-[#1E40AF] ml-0.5 uppercase tracking-wider">
              100% Verified
            </Text>
          </View>
        </View>

        {/* Right Icons */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="relative p-1"
            onPress={() => router.push("/(tabs)/messages")}
          >
            <MessageCircle
              size={22}
              color="#1E293B"
              className="dark:text-white"
            />
            <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="relative p-1"
            onPress={() => router.push("/dashboard/notifications")}
          >
            <Bell size={22} color="#1E293B" className="dark:text-white" />
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-[16px] items-center justify-center px-0.5">
              <Text className="text-white text-[9px] font-bold">
                {unreadCount > 0 ? unreadCount : 3}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-[#F8FAFC] dark:bg-slate-950"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 2 & 3. SMART SEARCH & HERO BANNER COMBINED */}
        <View className="px-4 py-4">
          <View className="bg-[#0A1C3A] rounded-2xl p-5 overflow-hidden shadow-lg border border-[#1E40AF]/40 relative">
            {/* Background elements to match design slightly */}
            <View className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-10 -mt-10 blur-3xl" />
            <View className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/20 rounded-full -ml-10 -mb-10 blur-3xl" />

            {/* Location Bar & Voice */}
            <View className="flex-row items-center justify-between mb-4 z-10">
              <TouchableOpacity className="flex-row items-center bg-white px-3.5 py-2.5 rounded-full shadow-sm">
                <MapPin size={16} color="#1E40AF" />
                <Text className="text-[13px] font-bold text-slate-900 mx-1.5">
                  {city}
                </Text>
                <ChevronDown size={14} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                <Mic size={18} color="#1E40AF" />
              </TouchableOpacity>
            </View>

            {/* Search Bar Input */}
            <View className="flex-row items-center bg-white rounded-full pl-4 pr-1.5 h-12 shadow-md mb-6 z-10">
              <Search size={18} color="#64748B" className="mr-2" />
              <TextInput
                className="flex-1 text-slate-900 text-[14px] font-medium"
                placeholder="Search Business, Service, Product..."
                placeholderTextColor="#94A3B8"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                className="bg-[#1E40AF] h-9 w-12 rounded-full items-center justify-center flex-row shadow-sm"
                onPress={handleSearch}
              >
                <Search size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Hero Text */}
            <View className="z-10 flex-row">
              <View className="flex-1 pr-2">
                <Text className="text-xs font-semibold text-blue-200 mb-1">
                  India's Emerging
                </Text>
                <Text className="text-[26px] font-black text-[#F59E0B] leading-[30px]">
                  Business Growth
                </Text>
                <Text className="text-[26px] font-black text-white leading-[30px] mb-2">
                  Platform
                </Text>
                <Text className="text-[11px] text-blue-100 font-medium mb-1">
                  Beyond Listing.
                </Text>
                <Text className="text-[11px] text-blue-100 font-medium mb-4">
                  We Help Businesses Grow.
                </Text>

                <TouchableOpacity
                  className="bg-[#F59E0B] py-2.5 px-4 rounded-full self-start flex-row items-center shadow-md mb-4"
                  onPress={() => router.push("/search")}
                >
                  <Text className="text-xs font-black text-slate-900 mr-1.5">
                    Explore Now
                  </Text>
                  <ArrowRight size={14} color="#0F172A" />
                </TouchableOpacity>

                {/* Pagination Dots */}
                <View className="flex-row items-center gap-1.5">
                  <View className="w-4 h-1.5 bg-white rounded-full" />
                  <View className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  <View className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                </View>
              </View>

              {/* Right side floating badge - replacing the image since we don't have it */}
              <View className="w-[100px] items-center pt-2">
                <View className="bg-[#1E40AF]/40 border border-blue-400/30 p-2 rounded-xl items-center text-center">
                  <Trophy size={20} color="#F59E0B" className="mb-1" />
                  <Text className="text-[9px] font-bold text-white text-center leading-tight">
                    Trusted by Thousands of Businesses
                  </Text>
                  <Text className="text-[9px] font-bold text-white text-center leading-tight mt-0.5">
                    Across India
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 4. QUICK ACTIONS BAR */}
        <View className="px-4 py-3">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              Quick Actions
            </Text>
            <TouchableOpacity onPress={() => router.push("/category")}>
              <Text className="text-xs font-bold text-[#1E40AF]">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                className="items-center w-20"
                onPress={() => router.push(action.route as any)}
              >
                <View
                  className={`w-[52px] h-[52px] rounded-full items-center justify-center mb-2 ${action.bg} shadow-sm border border-slate-100 dark:border-slate-800`}
                >
                  <action.icon
                    size={24}
                    color={action.color}
                    strokeWidth={1.5}
                  />
                </View>
                <Text className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center leading-[14px]">
                  {action.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 5. TOP CATEGORIES */}
        <View className="px-4 py-5 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 mt-2">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-[11px] font-black text-[#1E40AF] uppercase tracking-wider">
                Top Categories
              </Text>
              <Text className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Explore Key Services
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/category")}>
              <Text className="text-xs font-bold text-[#1E40AF]">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {topCategories.map((cat, i) => (
              <TouchableOpacity
                key={i}
                className="w-[18%] items-center mb-4"
                onPress={() =>
                  cat.name === "More Categories"
                    ? router.push("/category")
                    : router.push(
                        `/search?category=${encodeURIComponent(cat.name)}`,
                      )
                }
              >
                <View
                  className={`w-12 h-12 rounded-2xl justify-center items-center mb-1 ${cat.bg} shadow-sm`}
                >
                  <cat.icon size={22} color={cat.color} strokeWidth={1.5} />
                </View>
                <Text
                  className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight"
                  numberOfLines={2}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 6. OUR ECOSYSTEM PLATFORM */}
        <View className="px-4 py-5">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-[11px] font-black text-[#1E40AF] uppercase tracking-wider">
                Our Ecosystem
              </Text>
              <Text className="text-lg font-black text-slate-900 dark:text-white">
                Growth Platforms
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/search")}>
              <Text className="text-xs font-bold text-[#1E40AF]">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {ecosystemPlatforms.map((plat, i) => (
              <View
                key={i}
                className="w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm justify-between"
              >
                <View className="flex-row items-center mb-2">
                  <View
                    className={`w-8 h-8 rounded-xl ${plat.logoBg} items-center justify-center mr-2.5`}
                  >
                    <Globe size={16} color="#FFFFFF" />
                  </View>
                  <Text
                    className="text-sm font-black text-slate-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {plat.name}
                  </Text>
                </View>
                <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  {plat.tag}
                </Text>
                <TouchableOpacity className="bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded-lg flex-row items-center justify-between">
                  <Text className="text-[11px] font-bold text-[#1E40AF]">
                    Explore
                  </Text>
                  <ArrowRight size={12} color="#1E40AF" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 7. PREMIUM SERVICES */}
        <View className="px-4 py-5 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-[11px] font-black text-[#1E40AF] uppercase tracking-wider">
                High Value
              </Text>
              <Text className="text-lg font-black text-slate-900 dark:text-white">
                Premium Services
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/search")}>
              <Text className="text-xs font-bold text-[#1E40AF]">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {premiumServices.map((serv, i) => (
              <TouchableOpacity
                key={i}
                className="w-36 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 items-center justify-center shadow-sm"
              >
                <View
                  className={`w-12 h-12 rounded-2xl justify-center items-center mb-2 ${serv.bg}`}
                >
                  <serv.icon size={22} color={serv.color} />
                </View>
                <Text className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center leading-tight">
                  {serv.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 8. LEARNING & INSIGHTS */}
        <View className="px-4 py-5">
          <Text className="text-[11px] font-black text-[#1E40AF] uppercase tracking-wider mb-1">
            Knowledge Hub
          </Text>
          <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">
            Learning & Insights
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {/* Card 1: Academy */}
            <View className="w-64 bg-[#E0E7FF] dark:bg-slate-800 rounded-2xl p-4 shadow-sm justify-between">
              <View className="flex-row items-start mb-2">
                <View className="bg-white p-2 rounded-xl mr-3 shadow-sm">
                  <GraduationCap size={24} color="#1E40AF" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-[#1E40AF] dark:text-blue-400">
                    TRUEDIAL ACADEMY
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Learn • Grow • Succeed
                  </Text>
                </View>
              </View>
              <Text className="text-xs font-bold text-slate-800 dark:text-white mt-1 mb-3">
                Industry Oriented Professional Courses
              </Text>
              <TouchableOpacity className="self-start flex-row items-center border-b border-[#1E40AF]">
                <Text className="text-[11px] font-bold text-[#1E40AF] mr-1">
                  Know More
                </Text>
                <ArrowRight size={12} color="#1E40AF" />
              </TouchableOpacity>
            </View>

            {/* Card 2: Podcast */}
            <View className="w-64 bg-[#F3E8FF] dark:bg-slate-800 rounded-2xl p-4 shadow-sm justify-between">
              <View className="flex-row items-start mb-2">
                <View className="bg-white p-2 rounded-xl mr-3 shadow-sm">
                  <Mic size={24} color="#7C3AED" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-[#7C3AED] dark:text-purple-400">
                    TRUEDIAL PODCAST
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Every Business Has a Story
                  </Text>
                </View>
              </View>
              <Text className="text-xs font-bold text-slate-800 dark:text-white mt-1 mb-3">
                Founder Insights & Entrepreneurship
              </Text>
              <TouchableOpacity className="self-start flex-row items-center border-b border-[#7C3AED]">
                <Text className="text-[11px] font-bold text-[#7C3AED] mr-1">
                  Listen Now
                </Text>
                <ArrowRight size={12} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            {/* Card 3: News */}
            <View className="w-64 bg-[#DBEAFE] dark:bg-slate-800 rounded-2xl p-4 shadow-sm justify-between">
              <View className="flex-row items-start mb-2">
                <View className="bg-white p-2 rounded-xl mr-3 shadow-sm">
                  <Globe size={24} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-[#2563EB] dark:text-blue-400">
                    TD NEWS
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Business News That Matters
                  </Text>
                </View>
              </View>
              <Text className="text-xs font-bold text-slate-800 dark:text-white mt-1 mb-3">
                Market Trends & Trade Reports
              </Text>
              <TouchableOpacity className="self-start flex-row items-center border-b border-[#2563EB]">
                <Text className="text-[11px] font-bold text-[#2563EB] mr-1">
                  Read More
                </Text>
                <ArrowRight size={12} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* 9. STATS BANNER & APP PROMO */}
        <View className="mx-4 mb-4">
          <View className="bg-[#0A1C3A] rounded-t-2xl p-5 border border-slate-800 shadow-lg">
            <View className="flex-row justify-between items-center flex-wrap gap-y-4">
              <View className="w-[48%] items-center border-r border-slate-800 pr-2">
                <Text className="text-xl font-black text-white">50,000+</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Verified Businesses
                </Text>
              </View>
              <View className="w-[48%] items-center pl-2">
                <Text className="text-xl font-black text-white">5 Lakh+</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Happy Customers
                </Text>
              </View>
              <View className="w-[48%] items-center border-r border-slate-800 pr-2 pt-2 border-t border-slate-800">
                <Text className="text-xl font-black text-white">100+</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Cities Coverage
                </Text>
              </View>
              <View className="w-[48%] items-center pl-2 pt-2 border-t border-slate-800">
                <View className="flex-row items-center">
                  <Star
                    size={16}
                    color="#F59E0B"
                    fill="#F59E0B"
                    className="mr-1"
                  />
                  <Text className="text-xl font-black text-white">4.8/5</Text>
                </View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  User Rating
                </Text>
              </View>
            </View>
          </View>

          {/* Download App Banner */}
          <View className="bg-blue-500 rounded-b-2xl p-4 flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-sm font-black text-white mb-0.5">
                Download TRUEDIAL App
              </Text>
              <Text className="text-[10px] text-blue-100 font-medium leading-tight">
                Find Businesses | Best Deals{"\n"}Grow Your Business
              </Text>
            </View>
            <View className="gap-1.5">
              <View className="bg-black py-1 px-2.5 rounded flex-row items-center justify-center">
                <Text className="text-white text-[8px] font-bold">
                  GET IT ON
                </Text>
                <Text className="text-white text-[10px] font-black ml-1">
                  Google Play
                </Text>
              </View>
              <View className="bg-black py-1 px-2.5 rounded flex-row items-center justify-center">
                <Text className="text-white text-[8px] font-bold">
                  Download on the
                </Text>
                <Text className="text-white text-[10px] font-black ml-1">
                  App Store
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 10. VERIFIED BUSINESS LISTINGS SECTION */}
        <View className="px-4 py-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-[11px] font-black text-[#1E40AF] uppercase tracking-wider">
                Top Rated
              </Text>
              <Text className="text-lg font-black text-slate-900 dark:text-white">
                Verified Businesses
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/search")}>
              <Text className="text-xs font-bold text-[#1E40AF]">
                View All →
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color="#1E40AF" className="my-6" />
          ) : listings.length > 0 ? (
            listings.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 mb-3.5 shadow-sm border border-slate-200 dark:border-slate-800"
                onPress={() => router.push(`/listing/${item.slug}`)}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 pr-3">
                    <Text className="text-[15px] font-black text-slate-900 dark:text-white mb-1 leading-tight">
                      {item.title}
                    </Text>
                    <View className="flex-row items-center flex-wrap">
                      <Text className="text-[10px] font-extrabold text-[#1E40AF] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded mr-2">
                        {item.category?.name || "Business"}
                      </Text>
                      <View className="flex-row items-center">
                        <MapPin size={10} color="#64748B" className="mr-0.5" />
                        <Text className="text-[11px] font-medium text-slate-500">
                          {item.city}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row items-center bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                    <Star
                      size={12}
                      color="#F59E0B"
                      fill="#F59E0B"
                      className="mr-1"
                    />
                    <Text className="text-[11px] font-extrabold text-amber-700">
                      {item.reviews_avg_rating
                        ? parseFloat(item.reviews_avg_rating).toFixed(1)
                        : "4.5"}
                    </Text>
                  </View>
                </View>

                {item.description && (
                  <Text
                    className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3"
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}

                <View className="flex-row justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-2.5">
                  <Text className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                    ● ONLINE NOW
                  </Text>
                  <Text className="text-xs font-bold text-[#1E40AF]">
                    View Details →
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
