import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import GlassCard from '../../../components/GlassCard';
import CustomButton from '../../../components/CustomButton';
import { ArrowLeft, Tag, Plus, X, Edit, Trash2, Sparkles, Percent, Calendar } from 'lucide-react-native';

export default function OffersManagerScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null);
  const [offerTitle, setOfferTitle] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/truedial/vendor/offers');
      const data = response.data.data || response.data;
      setOffers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.warn('Failed to fetch offers:', error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (offer: any = null) => {
    if (offer) {
      setEditingOfferId(offer.id);
      setOfferTitle(offer.title);
      setDiscountPercent(String(offer.discount_percentage));
      setValidUntil(offer.valid_until);
    } else {
      setEditingOfferId(null);
      setOfferTitle('');
      setDiscountPercent('');
      setValidUntil(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // default to 30 days
    }
    setModalVisible(true);
  };

  const handleSaveOffer = async () => {
    if (!offerTitle || !discountPercent || !validUntil) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: offerTitle,
        discount_percentage: parseInt(discountPercent, 10),
        valid_until: validUntil
      };

      if (editingOfferId) {
        await api.put(`/truedial/vendor/offers/${editingOfferId}`, payload);
      } else {
        await api.post('/truedial/vendor/offers', payload);
      }
      
      Alert.alert('Success', editingOfferId ? 'Offer updated!' : 'Offer created!');
      setModalVisible(false);
      fetchOffers();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#64748B" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-slate-900 dark:text-white">Manage Offers</Text>
        </View>
        <TouchableOpacity 
          className="bg-[#E8701A] w-10 h-10 rounded-full justify-center items-center shadow-sm"
          onPress={() => handleOpenModal()}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {offers.length === 0 ? (
            <View className="items-center justify-center py-20 px-5">
              <Tag size={48} color="#CBD5E1" className="dark:text-slate-700" />
              <Text className="text-lg font-bold text-slate-900 dark:text-white mt-4">No Active Offers</Text>
              <Text className="text-sm text-slate-500 text-center mt-2">
                Create an offer to attract more TrueDial Privilege Members to your business.
              </Text>
              <CustomButton
                title="Create First Offer"
                onPress={() => handleOpenModal()}
                className="mt-6 w-full"
              />
            </View>
          ) : (
            offers.map((offer) => (
              <GlassCard key={offer.id} className="mb-4 p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 pr-2">
                    <View className="bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-md self-start mb-2">
                      <Text className="text-orange-600 dark:text-orange-400 font-extrabold text-xs">{offer.discount_percentage}% OFF</Text>
                    </View>
                    <Text className="text-base font-bold text-slate-900 dark:text-white">{offer.title}</Text>
                    <Text className="text-xs text-slate-500 mt-1">Valid until: {offer.valid_until}</Text>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity onPress={() => handleOpenModal(offer)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Edit size={16} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            ))
          )}
        </ScrollView>
      )}

      {/* Offer Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 shadow-xl">
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center">
                <Sparkles size={20} color="#E8701A" className="mr-2" />
                <Text className="text-lg font-bold text-slate-900 dark:text-white">{editingOfferId ? 'Edit Offer' : 'Create Offer'}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView className="mb-4">
              <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Offer Title</Text>
              <View className="flex-row items-center h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 mb-4">
                <TextInput
                  className="flex-1 text-sm text-slate-900 dark:text-white"
                  placeholder="e.g. 20% Off Services"
                  placeholderTextColor="#94A3B8"
                  value={offerTitle}
                  onChangeText={setOfferTitle}
                />
              </View>

              <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Discount (%)</Text>
              <View className="flex-row items-center h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 mb-4">
                <Percent size={18} color="#94A3B8" className="mr-2" />
                <TextInput
                  className="flex-1 text-sm text-slate-900 dark:text-white"
                  placeholder="e.g. 15"
                  placeholderTextColor="#94A3B8"
                  value={discountPercent}
                  onChangeText={setDiscountPercent}
                  keyboardType="numeric"
                />
              </View>

              <Text className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Valid Until</Text>
              <View className="flex-row items-center h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 mb-4">
                <Calendar size={18} color="#94A3B8" className="mr-2" />
                <TextInput
                  className="flex-1 text-sm text-slate-900 dark:text-white"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                  value={validUntil}
                  onChangeText={setValidUntil}
                />
              </View>

              <CustomButton title="Save Offer" onPress={handleSaveOffer} loading={submitting} className="mt-2" />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
