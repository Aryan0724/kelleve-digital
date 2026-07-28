import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import api from '../../services/api';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import { Tag, Sparkles, X, Plus, Calendar, Percent } from 'lucide-react-native';
import { useAuth } from '../../context/auth';

interface Offer {
  id: number;
  title: string;
  discount_percentage: number;
  valid_until: string;
  business_name?: string;
}

export default function OffersScreen() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Post Offer Modal Form state
  const [modalVisible, setModalVisible] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/offers');
      const data = response.data.data || response.data;
      setOffers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.warn('Failed to load offers from server, using fallback');
      setOffers([
        {
          id: 1,
          title: "Flat 25% Off on OPD Services",
          discount_percentage: 25,
          valid_until: "2026-12-31",
          business_name: "Apex Multi-Specialty Hospital"
        },
        {
          id: 2,
          title: "Buy 1 Get 1 Free on Pizzas",
          discount_percentage: 50,
          valid_until: "2026-11-15",
          business_name: "The Grand Royal Restaurant"
        },
        {
          id: 3,
          title: "15% Off Deluxe Suite Booking",
          discount_percentage: 15,
          valid_until: "2026-10-31",
          business_name: "Blue Horizon Luxury Hotel"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostOffer = async () => {
    if (!offerTitle || !discountPercent) {
      Alert.alert('Incomplete Form', 'Please enter a title and discount percentage.');
      return;
    }
    const percent = parseInt(discountPercent, 10);
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      Alert.alert('Invalid Discount', 'Discount must be a number between 1 and 100.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/offers', {
        title: offerTitle,
        discount_percentage: percent,
        valid_until: validUntil
      });
      Alert.alert('Success', 'Your offer has been posted successfully!');
      setModalVisible(false);
      setOfferTitle('');
      setDiscountPercent('');
      fetchOffers();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not post offer. Ensure you are authorized.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderOfferCard = ({ item }: { item: Offer }) => {
    return (
      <GlassCard className="mb-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className="bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-500/30 rounded-md px-2.5 py-1">
            <Text className="text-[#E8701A] font-extrabold text-[13px]">{item.discount_percentage}% OFF</Text>
          </View>
          <Tag size={20} color="#E8701A" />
        </View>

        <Text className="text-[18px] font-bold text-slate-900 dark:text-white">{item.title}</Text>
        <Text className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
          {item.business_name || 'Participating TrueDial Partner'}
        </Text>

        <View className="flex-row justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
          <View className="flex-row items-center">
            <Calendar size={14} color="#94A3B8" className="dark:text-slate-500" />
            <Text className="text-[12px] text-slate-500 dark:text-slate-400 ml-1.5">Valid until: {item.valid_until}</Text>
          </View>
          <Text className="text-[11px] font-semibold text-emerald-500">Active Offer</Text>
        </View>
      </GlassCard>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950 pb-16">
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3 mt-10">
        <View className="flex-1 mr-2">
          <Text className="text-[24px] font-extrabold text-slate-900 dark:text-white tracking-tight">Exclusive Offers</Text>
          <Text className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Unlock corporate savings with your Privilege Card</Text>
        </View>
        <TouchableOpacity 
          className="bg-[#E8701A] w-11 h-11 rounded-full justify-center items-center shadow-md shadow-orange-500/30" 
          onPress={() => setModalVisible(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#E8701A" />
          <Text className="text-[14px] text-slate-500 dark:text-slate-400 mt-3 font-semibold">Fetching available discounts...</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderOfferCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 px-5">
              <Tag size={48} color="#CBD5E1" className="dark:text-slate-700" />
              <Text className="text-[18px] font-bold text-slate-900 dark:text-white mt-4">No Offers Found</Text>
              <Text className="text-[13px] text-slate-500 dark:text-slate-400 text-center mt-1.5 leading-relaxed">
                There are currently no active B2B campaigns. Check back soon!
              </Text>
            </View>
          }
        />
      )}

      {/* Post Offer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center bg-black/60 p-5"
        >
          <View className="w-full">
            <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl shadow-black/10">
              <View className="flex-row justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <View className="flex-row items-center">
                  <Sparkles size={20} color="#E8701A" className="mr-2" />
                  <Text className="text-[18px] font-bold text-slate-900 dark:text-white">Post New Offer</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                  <X size={18} color="#64748B" className="dark:text-slate-400" />
                </TouchableOpacity>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled">
                <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Offer Description / Title</Text>
                <View className="flex-row items-center h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 mb-4">
                  <TextInput
                    className="flex-1 text-[14px] text-slate-900 dark:text-white"
                    placeholder="e.g. 30% Off on Executive Suite Booking"
                    placeholderTextColor="#94A3B8"
                    value={offerTitle}
                    onChangeText={setOfferTitle}
                  />
                </View>

                <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Discount Percentage (%)</Text>
                <View className="flex-row items-center h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 mb-4">
                  <Percent size={18} color="#94A3B8" className="mr-2 dark:text-slate-500" />
                  <TextInput
                    className="flex-1 text-[14px] text-slate-900 dark:text-white"
                    placeholder="e.g. 30"
                    placeholderTextColor="#94A3B8"
                    value={discountPercent}
                    onChangeText={setDiscountPercent}
                    keyboardType="numeric"
                  />
                </View>

                <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Expiry Date (YYYY-MM-DD)</Text>
                <View className="flex-row items-center h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 mb-4">
                  <Calendar size={18} color="#94A3B8" className="mr-2 dark:text-slate-500" />
                  <TextInput
                    className="flex-1 text-[14px] text-slate-900 dark:text-white"
                    placeholder="e.g. 2026-12-31"
                    placeholderTextColor="#94A3B8"
                    value={validUntil}
                    onChangeText={setValidUntil}
                  />
                </View>

                <CustomButton
                  title="Publish Business Offer"
                  onPress={handlePostOffer}
                  loading={submitting}
                  className="mt-2 h-[50px]"
                />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
