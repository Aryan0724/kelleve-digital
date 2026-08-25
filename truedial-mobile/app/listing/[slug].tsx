import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  Linking,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../services/api";
import {
  Star,
  MapPin,
  Phone,
  MessageSquare,
  ShieldAlert,
  ChevronLeft,
  Share2,
  Navigation,
  MessageCircle,
  Ticket,
  Tag,
  Clock,
  Globe,
  ShieldCheck,
  Heart,
  Play,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  Building,
  Mail,
  Utensils,
  Wifi,
  Car,
  CreditCard,
  Users,
  Check,
  ChevronDown,
  X,
} from "lucide-react-native";
import { useAuth } from "../../context/auth";

const { width } = Dimensions.get("window");

export default function BusinessProfileScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [business, setBusiness] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Menu" | "Reviews" | "Offers"
  >("Overview");
  const [isSaved, setIsSaved] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  // Quote / Lead Capture State
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);

  useEffect(() => {
    if (slug) fetchProfileData();
  }, [slug]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [listingRes, offersRes, reviewsRes] = await Promise.all([
        api.get(`/truedial/public/businesses/${slug}`),
        api.get(`/truedial/public/businesses/${slug}/offers`),
        api.get(`/truedial/public/businesses/${slug}/reviews`),
      ]);

      const bData = listingRes.data?.data || listingRes.data;
      const oData = offersRes.data?.data || offersRes.data || [];
      const rData = reviewsRes.data?.data?.data || reviewsRes.data?.data || [];

      if (bData && bData.basicInfo) {
        bData.reviews = Array.isArray(rData) ? rData : [];
        setBusiness(bData);
      } else {
        setBusiness({
          basicInfo: bData,
          actions: [],
          catalog: { products: [], services: [] },
          reviews: Array.isArray(rData) ? rData : [],
        });
      }
      setOffers(Array.isArray(oData) ? oData : []);
    } catch (error) {
      console.warn("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() =>
        Alert.alert("Error", "Unable to open link"),
      );
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to message this business directly.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push("/(auth)/login") },
        ],
      );
      return;
    }

    const vendorId = basicInfo?.user_id || basicInfo?.id;
    if (!vendorId) {
      Alert.alert(
        "Notice",
        "Direct chat is initializing. You can call or submit an inquiry.",
      );
      return;
    }

    if (user.id === vendorId) {
      Alert.alert("Notice", "This is your own business listing.");
      return;
    }

    setStartingChat(true);
    try {
      const res = await api.post("/conversations", { vendor_id: vendorId });
      const convo = res.data?.data || res.data;
      if (convo?.id) {
        router.push(`/dashboard/chat/${convo.id}`);
      } else {
        Alert.alert("Error", "Unable to start chat with business.");
      }
    } catch (err: any) {
      console.warn("Start chat failed:", err);
      Alert.alert("Notice", err?.message || "Could not start chat right now.");
    } finally {
      setStartingChat(false);
    }
  };

  const handleSubmitQuote = async () => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to request a quote.", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    if (!quoteMessage.trim()) {
      Alert.alert(
        "Missing Info",
        "Please enter your requirements to get a quote.",
      );
      return;
    }

    setSubmittingQuote(true);
    try {
      await api.post("/requirements", {
        title: `Quote Request for ${business?.basicInfo?.title || "Business"}`,
        description: quoteMessage,
        category_id: business?.basicInfo?.category_id || 1,
        target_vendor_id: business?.basicInfo?.user_id, // Optionally assign this to the specific vendor if backend supports it
      });
      Alert.alert(
        "Success",
        "Your quote request has been sent! The business will contact you soon.",
      );
      setQuoteModalVisible(false);
      setQuoteMessage("");
    } catch (err: any) {
      console.warn("Submit quote failed:", err);
      Alert.alert(
        "Error",
        err?.message || "Could not send quote request right now.",
      );
    } finally {
      setSubmittingQuote(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-950">
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (!business || !business.basicInfo) {
    return (
      <View className="flex-1 justify-center items-center p-10 bg-slate-950">
        <ShieldAlert size={48} color="#DC2626" />
        <Text className="text-lg font-bold text-white mt-4 mb-5">
          Business Not Found
        </Text>
        <TouchableOpacity
          className="bg-[#1E40AF] py-3 px-6 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Return to Search</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { basicInfo, catalog, media } = business;
  const heroImage =
    media?.[0]?.url ||
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070";
  const galleryImages = [
    heroImage,
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600",
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600",
  ];

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 1. HERO HEADER WITH BACKDROP */}
        <ImageBackground
          source={{ uri: heroImage }}
          className="w-full h-88 justify-between p-4"
          imageStyle={{ backgroundColor: "#0f172a" }}
        >
          <View className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

          {/* Top Bar Navigation */}
          <View
            style={{ paddingTop: insets.top }}
            className="flex-row justify-between items-center z-20"
          >
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-black/40 items-center justify-center border border-white/20"
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>

            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-black/40 items-center justify-center border border-white/20"
                onPress={() => setIsSaved(!isSaved)}
              >
                <Heart
                  size={20}
                  color={isSaved ? "#EF4444" : "#FFF"}
                  fill={isSaved ? "#EF4444" : "transparent"}
                />
              </TouchableOpacity>

              <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center border border-white/20">
                <Share2 size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Badges & Business Information */}
          <View className="z-20 pb-4 flex-row items-end">
            <View className="w-16 h-16 rounded-full bg-white mr-3 overflow-hidden border-2 border-white items-center justify-center">
              {basicInfo.logo ? (
                <Image
                  source={{ uri: basicInfo.logo }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-orange-100 items-center justify-center">
                  <Text className="text-xl font-black text-[#EA580C]">
                    {basicInfo.title?.[0] || "B"}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-3xl font-black text-white leading-tight mb-0.5">
                {basicInfo.title}
              </Text>
              <Text className="text-slate-200 text-sm font-medium mb-1.5">
                {basicInfo.category || "Restaurant"}
              </Text>

              <View className="flex-row items-center mb-1.5">
                <Text className="text-white font-bold text-sm mr-1">4.5</Text>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-slate-200 text-xs ml-1.5">
                  (1,248 Reviews)
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="flex-row items-center bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                  <ShieldCheck size={12} color="#10B981" className="mr-1" />
                  <Text className="text-emerald-400 text-[11px] font-bold">
                    Verified
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* 3. QUICK ACTION BUTTONS */}
        <View className="px-4 py-5 flex-row justify-between bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <TouchableOpacity 
            className="items-center" 
            onPress={() => {
              const phoneNum = basicInfo.phone || '+919876543210';
              handleAction(`tel:${phoneNum}`);
            }}
          >
            <View className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 items-center justify-center mb-1 border border-emerald-200 dark:border-emerald-800">
              <Phone size={20} color="#16A34A" />
            </View>
            <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
              Call
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="items-center" 
            onPress={() => {
              const rawPhone = (basicInfo.phone || '919876543210').replace(/[^0-9]/g, '');
              handleAction(`https://wa.me/${rawPhone}?text=${encodeURIComponent('Hi, I found your business on TrueDial!')}`);
            }}
          >
            <View className="w-12 h-12 rounded-2xl bg-emerald-500 items-center justify-center mb-1 shadow-sm">
              <MessageCircle size={20} color="#FFFFFF" />
            </View>
            <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
              WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="items-center" 
            onPress={() => {
              const mapQuery = `${basicInfo.title} ${basicInfo.address || basicInfo.city || 'Patna'}`;
              handleAction(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`);
            }}
          >
            <View className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 items-center justify-center mb-1 border border-blue-200 dark:border-blue-800">
              <Navigation size={20} color="#1D4ED8" />
            </View>
            <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
              Directions
            </Text>
          </TouchableOpacity>

          {basicInfo.website ? (
            <TouchableOpacity
              className="items-center"
              onPress={() => handleAction(basicInfo.website)}
            >
              <View className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 items-center justify-center mb-1 border border-blue-500 shadow-sm">
                <Globe size={20} color="#3B82F6" />
              </View>
              <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                Website
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="items-center"
              onPress={handleStartChat}
              disabled={startingChat}
            >
              <View className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 items-center justify-center mb-1 border border-orange-500 shadow-sm">
                <MessageSquare size={20} color="#F97316" />
              </View>
              <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                Chat
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            className="items-center" 
            onPress={() => {
              const nextState = !isSaved;
              setIsSaved(nextState);
              Alert.alert(
                nextState ? 'Business Saved' : 'Removed',
                nextState ? `${basicInfo.title} added to your saved list.` : `${basicInfo.title} removed from saved list.`
              );
            }}
          >
            <View className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 items-center justify-center mb-1 border border-rose-200 dark:border-rose-800">
              <Heart size={20} color="#E11D48" fill={isSaved ? "#E11D48" : "transparent"} />
            </View>
            <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3.5 GET QUOTE BUTTON */}
        <View className="px-4 py-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <TouchableOpacity
            className="w-full bg-[#E8701A] py-3.5 rounded-xl items-center flex-row justify-center shadow-md"
            onPress={() => setQuoteModalVisible(true)}
          >
            <MessageSquare size={18} color="#FFF" className="mr-2" />
            <Text className="text-white font-bold text-sm">
              Request a Quote
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. OPERATING STATUS */}
        <View className="px-4 py-3 bg-slate-50 dark:bg-slate-900 flex-row justify-between items-center border-b border-slate-200 dark:border-slate-800">
          <View className="flex-row items-center">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />
            <Text className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mr-1">
              Open Now
            </Text>
            <Text className="text-xs text-slate-500">• Closes 11:00 PM</Text>
          </View>
          <ChevronDown size={16} color="#64748B" />
        </View>

        {/* 5. NAVIGATION TABS */}
        <View className="flex-row bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          {(["Overview", "Menu", "Reviews", "Offers"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-3 items-center border-b-2 ${activeTab === tab ? "border-[#1E40AF]" : "border-transparent"}`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-xs font-black ${activeTab === tab ? "text-[#1E40AF]" : "text-slate-500"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB CONTENTS */}
        <View className="p-4">
          {/* WHAT PEOPLE LOVE */}
          <Text className="text-sm font-black text-slate-900 dark:text-white mb-2.5">
            What People Love
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{ gap: 8 }}
          >
            <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full">
              <ThumbsUp size={12} color="#16A34A" className="mr-1.5" />
              <Text className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Food Quality (512)
              </Text>
            </View>
            <View className="flex-row items-center bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-full">
              <Sparkles size={12} color="#9333EA" className="mr-1.5" />
              <Text className="text-xs font-bold text-purple-800 dark:text-purple-300">
                Ambience (312)
              </Text>
            </View>
            <View className="flex-row items-center bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={12} color="#2563EB" className="mr-1.5" />
              <Text className="text-xs font-bold text-blue-800 dark:text-blue-300">
                Service (210)
              </Text>
            </View>
            <View className="flex-row items-center bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 px-3 py-1.5 rounded-full">
              <Tag size={12} color="#EA580C" className="mr-1.5" />
              <Text className="text-xs font-bold text-orange-800 dark:text-orange-300">
                Value for Money (156)
              </Text>
            </View>
          </ScrollView>

          {/* ABOUT THIS PLACE */}
          <Text className="text-sm font-black text-slate-900 dark:text-white mb-1.5">
            About This Place
          </Text>
          <Text className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {basicInfo.description ||
              "A multi-cuisine restaurant offering a wide range of delicious dishes in a cozy & family-friendly ambience."}
            <Text className="text-[#1E40AF] font-bold"> ...Read More</Text>
          </Text>

          {/* VIDEO PREVIEW */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-sm font-black text-slate-900 dark:text-white">
                Video Preview
              </Text>
              <Text className="text-xs font-bold text-[#1E40AF]">View All</Text>
            </View>
            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
              }}
              className="w-full h-44 rounded-2xl overflow-hidden justify-center items-center relative shadow-sm"
            >
              <View className="absolute inset-0 bg-black/40" />
              <View className="w-14 h-14 rounded-full bg-white/90 items-center justify-center shadow-lg">
                <Play
                  size={24}
                  color="#1E40AF"
                  fill="#1E40AF"
                  className="ml-1"
                />
              </View>
              <View className="absolute bottom-2.5 right-2.5 bg-black/70 px-2 py-0.5 rounded">
                <Text className="text-white text-[10px] font-bold">01:25</Text>
              </View>
            </ImageBackground>
          </View>

          {/* PHOTO GALLERY */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-sm font-black text-slate-900 dark:text-white">
                Photo Gallery
              </Text>
              <Text className="text-xs font-bold text-[#1E40AF]">View All</Text>
            </View>
            <View className="flex-row justify-between">
              {galleryImages.slice(0, 3).map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  className="w-[31%] h-24 rounded-xl"
                />
              ))}
              <ImageBackground
                source={{ uri: galleryImages[3] }}
                className="w-[31%] h-24 rounded-xl overflow-hidden justify-center items-center"
              >
                <View className="absolute inset-0 bg-black/60" />
                <Text className="text-white font-black text-sm">+12</Text>
              </ImageBackground>
            </View>
          </View>

          {/* TOP OFFERS FOR YOU */}
          <View className="mb-6">
            <Text className="text-sm font-black text-slate-900 dark:text-white mb-2.5">
              Top Offers for You
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {[
                {
                  title: "10% OFF",
                  sub: "Up to ₹500",
                  desc: "On total bill",
                  date: "Valid till 31 Dec 2026",
                },
                {
                  title: "15% OFF",
                  sub: "Up to ₹750",
                  desc: "On total bill",
                  date: "Valid till 31 Dec 2026",
                },
                {
                  title: "20% OFF",
                  sub: "Up to ₹1000",
                  desc: "On total bill",
                  date: "Valid till 31 Dec 2026",
                },
              ].map((off, i) => (
                <View
                  key={i}
                  className="w-40 bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-3 justify-between"
                >
                  <View>
                    <Text className="text-base font-black text-orange-600 dark:text-orange-400">
                      {off.title}
                    </Text>
                    <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {off.sub}
                    </Text>
                    <Text className="text-[11px] text-slate-500">
                      {off.desc}
                    </Text>
                  </View>
                  <View className="mt-3 pt-2 border-t border-orange-200/50 flex-row justify-between items-center">
                    <Text className="text-[9px] text-slate-400">
                      {off.date}
                    </Text>
                    <Text className="text-[9px] font-bold text-orange-600">
                      T&C
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* RATINGS & REVIEWS BREAKDOWN */}
          <View className="mb-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-black text-slate-900 dark:text-white">
                Ratings & Reviews
              </Text>
              <Text className="text-xs font-bold text-[#1E40AF]">View All</Text>
            </View>

            <View className="flex-row items-center">
              <View className="items-center mr-6">
                <Text className="text-3xl font-black text-slate-900 dark:text-white">
                  4.5
                </Text>
                <View className="flex-row my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      color="#F59E0B"
                      fill="#F59E0B"
                      className="mr-0.5"
                    />
                  ))}
                </View>
                <Text className="text-[10px] text-slate-500 font-bold">
                  1,248 Reviews
                </Text>
              </View>

              <View className="flex-1 gap-1.5">
                {[
                  { star: 5, pct: "70%" },
                  { star: 4, pct: "20%" },
                  { star: 3, pct: "7%" },
                  { star: 2, pct: "2%" },
                  { star: 1, pct: "1%" },
                ].map((b) => (
                  <View key={b.star} className="flex-row items-center gap-2">
                    <Text className="text-[10px] font-bold text-slate-600 dark:text-slate-400 w-3">
                      {b.star}★
                    </Text>
                    <View className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: b.pct as any }}
                      />
                    </View>
                    <Text className="text-[9px] font-bold text-slate-400 w-6">
                      {b.pct}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* CONTACT INFO CARD */}
          <View className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <Text className="text-sm font-black text-slate-900 dark:text-white mb-3">
              Contact Info
            </Text>
            <View className="gap-3">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => handleAction(`tel:${basicInfo.phone}`)}
              >
                <Phone size={16} color="#16A34A" className="mr-3" />
                <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {basicInfo.phone || "+91 98765 43210"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() =>
                  handleAction(`whatsapp://send?phone=${basicInfo.phone}`)
                }
              >
                <MessageCircle size={16} color="#10B981" className="mr-3" />
                <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {basicInfo.phone || "+91 98765 43210"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() =>
                  handleAction(basicInfo.website || "https://truedial.com")
                }
              >
                <Globe size={16} color="#1D4ED8" className="mr-3" />
                <Text className="text-xs font-bold text-[#1E40AF]">
                  {basicInfo.website || "www.yellowchilli.com"}
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center">
                <Mail size={16} color="#64748B" className="mr-3" />
                <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  info@yellowchilli.com
                </Text>
              </View>
            </View>
          </View>

          {/* TIMINGS CARD */}
          <View className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <Text className="text-sm font-black text-slate-900 dark:text-white mb-3">
              Timings
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Monday - Friday
                </Text>
                <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  11:00 AM - 11:00 PM
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Saturday - Sunday
                </Text>
                <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  10:00 AM - 11:30 PM
                </Text>
              </View>
            </View>
          </View>

          {/* LOCATION MAP CARD */}
          <View className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <Text className="text-sm font-black text-slate-900 dark:text-white mb-1">
              Location
            </Text>
            <Text className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">
              {basicInfo.title}
            </Text>
            <Text className="text-xs text-slate-500 mb-1">
              {basicInfo.address || "Boring Road, Patna, Bihar - 800001"}
            </Text>
            <Text className="text-[11px] font-bold text-emerald-600 mb-3">
              2.2 km from your location
            </Text>

            <ImageBackground
              source={{
                uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800",
              }}
              className="w-full h-32 rounded-xl overflow-hidden justify-center items-center mb-3 relative"
            >
              <View className="absolute inset-0 bg-black/20" />
              <View className="bg-red-500 p-2 rounded-full shadow-lg">
                <MapPin size={20} color="#FFF" />
              </View>
            </ImageBackground>

            <TouchableOpacity
              className="w-full bg-[#1E40AF] py-3 rounded-xl items-center shadow-sm"
              onPress={() =>
                handleAction(
                  `https://maps.google.com/?q=${encodeURIComponent(basicInfo.address || basicInfo.city)}`,
                )
              }
            >
              <Text className="text-white font-bold text-xs">View on Map</Text>
            </TouchableOpacity>
          </View>

          {/* AMENITIES GRID */}
          <View className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <Text className="text-sm font-black text-slate-900 dark:text-white mb-3">
              Amenities
            </Text>
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {[
                { label: "Parking", icon: Car },
                { label: "Free Wi-Fi", icon: Wifi },
                { label: "AC", icon: Building },
                { label: "Card Payment", icon: CreditCard },
                { label: "Family Area", icon: Users },
              ].map((am, i) => (
                <View
                  key={i}
                  className="w-[30%] bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl items-center border border-slate-200/60"
                >
                  <am.icon size={18} color="#1E40AF" className="mb-1" />
                  <Text className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">
                    {am.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* HIGHLIGHTS */}
          <View className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <Text className="text-sm font-black text-slate-900 dark:text-white mb-3">
              Highlights
            </Text>
            <View className="gap-2.5">
              {[
                "Live Kitchen",
                "Home Delivery",
                "Takeaway Available",
                "Outdoor Seating",
                "Birthday Party Zone",
              ].map((h, i) => (
                <View key={i} className="flex-row items-center">
                  <Check size={14} color="#16A34A" className="mr-2" />
                  <Text className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {h}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 6. STICKY BOTTOM PRIVILEGE CTA BAR */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3.5 flex-row justify-between items-center shadow-lg">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <Text className="text-sm font-black text-[#EA580C]">10% OFF</Text>
            <Text className="text-[11px] font-bold text-slate-800 dark:text-white">
              Up to ₹500
            </Text>
          </View>
          <Text className="text-[10px] text-slate-500">
            With TrueDial Privilege Card
          </Text>
        </View>

        <TouchableOpacity
          className="bg-[#EA580C] px-5 py-3 rounded-full shadow-md"
          onPress={() => router.push("/offers")}
        >
          <Text className="text-white text-[13px] font-bold">
            View Card & Avail Offer
          </Text>
        </TouchableOpacity>
      </View>

      {/* LEAD CAPTURE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={quoteModalVisible}
        onRequestClose={() => setQuoteModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl">
            <View className="flex-row justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <View className="flex-row items-center">
                <MessageSquare size={20} color="#E8701A" className="mr-2" />
                <Text className="text-[18px] font-bold text-slate-900 dark:text-white">
                  Request a Quote
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setQuoteModalVisible(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
              >
                <X size={18} color="#64748B" className="dark:text-slate-400" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Send your detailed requirements to {business?.basicInfo?.title} to
              get an accurate quote.
            </Text>

            <View className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 mb-5 h-32">
              <TextInput
                className="flex-1 text-sm text-slate-900 dark:text-white"
                placeholder="Describe what you need..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                value={quoteMessage}
                onChangeText={setQuoteMessage}
              />
            </View>

            <TouchableOpacity
              className={`w-full py-4 rounded-xl items-center flex-row justify-center shadow-md ${submittingQuote ? "bg-orange-400" : "bg-[#E8701A]"}`}
              onPress={handleSubmitQuote}
              disabled={submittingQuote}
            >
              {submittingQuote ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text className="text-white font-bold text-sm">
                  Send Request
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
