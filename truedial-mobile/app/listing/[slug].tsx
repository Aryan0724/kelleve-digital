import React, { useState, useEffect } from 'react';
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
  Platform,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import api from '../../services/api';
import { Star, MapPin, Phone, MessageSquare, ShieldAlert, 
  ChevronLeft, Share2, Navigation, MessageCircle, 
  Ticket, Tag, Clock, Globe, ShieldCheck 
} from 'lucide-react-native';
import { useAuth } from '../../context/auth';

export default function BusinessProfileScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [business, setBusiness] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    if (slug) fetchProfileData();
  }, [slug]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [listingRes, offersRes, reviewsRes] = await Promise.all([
        api.get(`/truedial/public/businesses/${slug}`),
        api.get(`/truedial/public/businesses/${slug}/offers`),
        api.get(`/truedial/public/businesses/${slug}/reviews`)
      ]);
      
      const bData = listingRes.data?.data || listingRes.data;
      const oData = offersRes.data?.data || offersRes.data || [];
      
      // The reviews endpoint might be paginated, so extract the array
      const rData = reviewsRes.data?.data?.data || reviewsRes.data?.data || [];
      
      if (bData && bData.basicInfo) {
        bData.reviews = Array.isArray(rData) ? rData : [];
        setBusiness(bData);
      } else {
        setBusiness({ 
          basicInfo: bData, 
          actions: [], 
          catalog: { products: [], services: [] },
          reviews: Array.isArray(rData) ? rData : []
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
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to open link'));
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to message this business directly.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/(auth)/login') }
      ]);
      return;
    }

    const vendorId = basicInfo?.user_id;
    if (!vendorId) {
      Alert.alert('Notice', 'Direct chat is initializing. You can also submit an inquiry or call.');
      return;
    }

    if (user.id === vendorId) {
      Alert.alert('Notice', 'This is your own business listing.');
      return;
    }

    setStartingChat(true);
    try {
      const res = await api.post('/conversations', { vendor_id: vendorId });
      const convo = res.data?.data || res.data;
      if (convo?.id) {
        router.push(`/dashboard/chat/${convo.id}`);
      } else {
        Alert.alert('Error', 'Unable to start chat with business.');
      }
    } catch (err: any) {
      console.warn('Start chat failed:', err);
      Alert.alert('Notice', err?.message || 'Could not start chat right now.');
    } finally {
      setStartingChat(false);
    }
  };

  const handlePostReview = async () => {
    if (!business?.basicInfo?.slug) return;
    if (!reviewText) {
      Alert.alert('Empty Review', 'Please write a review comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/truedial/user/businesses/${business.basicInfo.slug}/reviews`, { 
        rating, 
        body: reviewText,
        title: "App Review" // Providing a default title since mobile UI doesn't have a title field yet
      });
      Alert.alert('Success', 'Thank you! Your review has been submitted.');
      setReviewText('');
      setRating(5);
      fetchProfileData(); 
    } catch (error: any) {
      console.warn('Submit review failed', error);
      Alert.alert('Error', 'Failed to submit review. Make sure you are logged in.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#E8701A" />
      </View>
    );
  }

  if (!business || !business.basicInfo) {
    return (
      <View className="flex-1 justify-center items-center p-10 bg-slate-50 dark:bg-slate-950">
        <ShieldAlert size={48} color="#DC2626" />
        <Text className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-5">Business Not Found</Text>
        <TouchableOpacity 
          className="bg-[#E8701A] py-3 px-6 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Return to Search</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { basicInfo, catalog, media } = business;
  const heroImage = media?.[0]?.url || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070';

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* 1. HERO GALLERY */}
        <ImageBackground source={{ uri: heroImage }} className="w-full h-80 justify-end" imageStyle={{ backgroundColor: '#0f172a' }}>
          <View className="absolute inset-0 bg-black/60" />
          
          <SafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between p-4 z-10">
            <TouchableOpacity 
              className="w-10 h-10 rounded-full bg-black/50 items-center justify-center backdrop-blur-md border border-white/20"
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/50 items-center justify-center backdrop-blur-md border border-white/20">
              <Share2 size={20} color="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>

          <View className="p-5 w-full z-10 pb-6">
            <View className="flex-row items-center flex-wrap gap-2 mb-3">
              <View className="bg-orange-500/20 px-3 py-1 rounded border border-orange-500/50 backdrop-blur-md">
                <Text className="text-orange-400 text-[11px] font-bold uppercase">{basicInfo.category || "Business"}</Text>
              </View>
              {basicInfo.verified && (
                <View className="bg-green-500/20 px-3 py-1 rounded border border-green-500/50 backdrop-blur-md flex-row items-center">
                  <ShieldCheck size={12} color="#4ADE80" className="mr-1" />
                  <Text className="text-green-400 text-[11px] font-bold uppercase">Verified Premium</Text>
                </View>
              )}
            </View>
            
            <Text className="text-3xl font-extrabold text-white mb-2 leading-tight">{basicInfo.title}</Text>
            
            <View className="flex-row items-center">
              <MapPin size={14} color="#CBD5E1" className="mr-1" />
              <Text className="text-slate-300 text-sm font-medium">{basicInfo.address || basicInfo.city}</Text>
            </View>
          </View>
        </ImageBackground>

        {/* 2. QUICK ACTIONS */}
        <View className="px-3 py-4 flex-row justify-around bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-20 -mt-2 rounded-t-2xl">
          <TouchableOpacity className="items-center" onPress={() => handleAction(`tel:${basicInfo.phone}`)}>
            <View className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-1">
              <Phone size={18} color="#2563EB" />
            </View>
            <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center" onPress={handleStartChat} disabled={startingChat}>
            <View className="w-11 h-11 rounded-full bg-orange-100 dark:bg-orange-950/30 items-center justify-center mb-1 border border-orange-200 dark:border-orange-900">
              {startingChat ? (
                <ActivityIndicator size="small" color="#E8701A" />
              ) : (
                <MessageSquare size={18} color="#E8701A" />
              )}
            </View>
            <Text className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400">Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center" onPress={() => handleAction(`whatsapp://send?phone=${basicInfo.phone}`)}>
            <View className="w-11 h-11 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-1">
              <MessageCircle size={18} color="#16A34A" />
            </View>
            <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300">WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center" onPress={() => handleAction(`https://maps.google.com/?q=${encodeURIComponent(basicInfo.address || basicInfo.city)}`)}>
            <View className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center mb-1">
              <Navigation size={18} color="#D97706" />
            </View>
            <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Directions</Text>
          </TouchableOpacity>

          {basicInfo.website && (
            <TouchableOpacity className="items-center" onPress={() => handleAction(basicInfo.website)}>
              <View className="w-11 h-11 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mb-1">
                <Globe size={18} color="#9333EA" />
              </View>
              <Text className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Website</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="p-5">
          {/* 3. ABOUT SECTION */}
          <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white mb-3">About {basicInfo.title}</Text>
          <Text className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            {basicInfo.description || "This business has not provided a description yet."}
          </Text>

          {/* 4. ACTIVE OFFERS */}
          {offers && offers.length > 0 && (
            <View className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/50 mb-8">
              <View className="flex-row items-center mb-4">
                <Ticket size={20} color="#2563EB" className="mr-2" />
                <Text className="text-[18px] font-extrabold text-blue-900 dark:text-blue-100">Special Offers</Text>
              </View>
              
              {offers.map((offer: any) => (
                <View key={offer.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-3">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-[16px] font-bold text-slate-900 dark:text-white flex-1 mr-2">{offer.title}</Text>
                    {offer.discount_value && (
                      <View className="bg-red-100 px-2 py-1 rounded">
                        <Text className="text-[10px] font-bold text-red-700">
                          {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-[13px] text-slate-600 dark:text-slate-400 mb-3">{offer.description}</Text>
                  
                  <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <View className="flex-row items-center">
                      <Clock size={12} color="#94A3B8" className="mr-1" />
                      <Text className="text-[11px] font-medium text-slate-500">Valid till {new Date(offer.valid_until || Date.now()).toLocaleDateString()}</Text>
                    </View>
                    {offer.promo_code && (
                      <Text className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        Code: {offer.promo_code}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 5. CATALOG - PRODUCTS */}
          {catalog?.products && catalog.products.length > 0 && (
            <View className="mb-8">
              <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white mb-4">Products</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                {catalog.products.map((product: any) => (
                  <View key={product.id} className="w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mr-4 overflow-hidden">
                    {product.media && product.media.length > 0 ? (
                      <ImageBackground source={{ uri: product.media[0].url }} className="w-full h-32 bg-slate-200" />
                    ) : (
                      <View className="w-full h-32 bg-slate-100 dark:bg-slate-800 items-center justify-center">
                        <Tag size={24} color="#94A3B8" />
                      </View>
                    )}
                    <View className="p-4">
                      <Text className="font-bold text-slate-900 dark:text-white text-[15px] mb-1">{product.name}</Text>
                      <Text className="text-slate-500 dark:text-slate-400 text-[12px] mb-2" numberOfLines={2}>{product.description}</Text>
                      {product.price && <Text className="font-bold text-[#E8701A]">₹{product.price}</Text>}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 6. CATALOG - SERVICES */}
          {catalog?.services && catalog.services.length > 0 && (
            <View className="mb-8">
              <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white mb-4">Services</Text>
              {catalog.services.map((service: any) => (
                <View key={service.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-3">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="font-bold text-slate-900 dark:text-white text-[15px] flex-1">{service.name}</Text>
                    {service.price_starting_at && <Text className="font-bold text-[#E8701A] text-[13px]">From ₹{service.price_starting_at}</Text>}
                  </View>
                  <Text className="text-slate-500 dark:text-slate-400 text-[13px]">{service.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 7. WRITE A REVIEW */}
          {user ? (
            <>
              <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white mb-4">Write a Review</Text>
              <View className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
            <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-3">Rating</Text>
            <View className="flex-row items-center mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star size={32} color="#F59E0B" fill={star <= rating ? '#F59E0B' : 'transparent'} className="mr-2" />
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">Your Review</Text>
            <View className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 h-28 mb-4">
              <TextInput
                className="flex-1 text-[14px] text-slate-900 dark:text-white"
                multiline
                numberOfLines={4}
                placeholder="Tell others about your experience..."
                placeholderTextColor="#94A3B8"
                value={reviewText}
                onChangeText={setReviewText}
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            <TouchableOpacity 
              className="w-full bg-[#E8701A] py-3.5 rounded-xl items-center flex-row justify-center"
              onPress={handlePostReview}
              disabled={submittingReview}
            >
              {submittingReview ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text className="text-white font-bold text-[15px]">Submit Review</Text>
              )}
              </TouchableOpacity>
            </View>
            </>
          ) : (
            <View className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl mb-8 items-center border border-slate-200 dark:border-slate-800">
              <Text className="text-slate-600 dark:text-slate-400 font-medium mb-3 text-center">Login to share your experience with others.</Text>
              <TouchableOpacity className="bg-slate-800 dark:bg-slate-700 px-6 py-2.5 rounded-xl" onPress={() => router.push('/login')}>
                <Text className="text-white font-bold text-sm">Login / Register</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 8. CUSTOMER REVIEWS */}
          <View className="mb-8">
            <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white mb-4">Customer Reviews</Text>
            {business.reviews && business.reviews.length > 0 ? (
              business.reviews.map((item: any) => (
                <View key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-3">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-[15px] font-bold text-slate-900 dark:text-white">{item.user?.name || 'Anonymous'}</Text>
                    <View className="flex-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} color="#F59E0B" fill={star <= item.rating ? '#F59E0B' : 'transparent'} className="mr-0.5" />
                      ))}
                    </View>
                  </View>
                  <Text className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">{item.review}</Text>
                  <Text className="text-[11px] font-medium text-slate-400 text-right mt-3">
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <View className="items-center py-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <MessageSquare size={36} color="#CBD5E1" className="mb-3" />
                <Text className="text-slate-500 font-medium">No reviews yet. Be the first to review!</Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
