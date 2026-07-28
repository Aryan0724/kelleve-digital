import React, { useState, useEffect } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../services/api';
import { ArrowLeft, Plus, Trash2, Edit2, Tag, Save, X } from 'lucide-react-native';

export default function OffersScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [form, setForm] = useState({ title: '', code: '', description: '', discountValue: '', validUntil: '' });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/truedial/vendor/offers');
      const data = res.data?.data || res.data || [];
      setOffers(Array.isArray(data) ? data : []);
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.code) {
      Alert.alert('Error', 'Title and Offer Code are required.');
      return;
    }
    
    setIsModalOpen(false);
    try {
      if (editingOffer) {
        await api.put(`/truedial/vendor/offers/${editingOffer.id}`, form);
      } else {
        await api.post('/truedial/vendor/offers', form);
      }
      fetchOffers();
    } catch (err: any) {
      // Optimistic UI fallback
      const newOffer = { id: editingOffer?.id || Date.now(), ...form, status: 'Active' };
      if (editingOffer) {
        setOffers(prev => prev.map(o => o.id === editingOffer.id ? newOffer : o));
      } else {
        setOffers(prev => [...prev, newOffer]);
      }
    }
  };

  const handleDelete = async (id: number) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    try {
      await api.delete(`/truedial/vendor/offers/${id}`);
    } catch {
      // Ignored
    }
  };

  const openAdd = () => {
    setEditingOffer(null);
    setForm({ title: '', code: '', description: '', discountValue: '', validUntil: '2026-12-31' });
    setIsModalOpen(true);
  };

  const openEdit = (offer: any) => {
    setEditingOffer(offer);
    setForm({ 
      title: offer.title || '', code: offer.code || '', 
      description: offer.description || '', discountValue: offer.discountValue || '', 
      validUntil: offer.validUntil || '2026-12-31' 
    });
    setIsModalOpen(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-4 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">Offers & Promos</Text>
        <TouchableOpacity onPress={openAdd} className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900 items-center justify-center">
          <Plus size={20} color="#10B981" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10B981" className="mt-10" />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {offers.length === 0 ? (
            <View className="items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Tag size={48} color="#CBD5E1" className="mb-4" />
              <Text className="text-slate-500 font-medium">No active offers.</Text>
            </View>
          ) : (
            offers.map(offer => (
              <View key={offer.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-4 shadow-sm border border-slate-200 dark:border-slate-800 border-l-4 border-l-emerald-500">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                    <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[12px]">{offer.code}</Text>
                  </View>
                  <Text className="text-[12px] text-slate-500 font-medium">Valid till: {offer.validUntil}</Text>
                </View>
                <Text className="text-[16px] font-extrabold text-slate-900 dark:text-white mb-2">{offer.title}</Text>
                <Text className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{offer.description}</Text>
                
                <View className="flex-row justify-end pt-3 border-t border-slate-100 dark:border-slate-800 gap-3">
                  <TouchableOpacity onPress={() => openEdit(offer)} className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center">
                    <Edit2 size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(offer.id)} className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 items-center justify-center">
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Add/Edit Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl pt-5 pb-8 px-6 border-t border-slate-200 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white">{editingOffer ? 'Edit Offer' : 'Create Offer'}</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View className="mb-4">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 uppercase">Offer Title</Text>
              <TextInput 
                className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-[15px] text-slate-900 dark:text-white"
                value={form.title} 
                onChangeText={t => setForm({...form, title: t})} 
                placeholder="e.g. 20% Off Modular Kitchens" 
                placeholderTextColor="#94A3B8"
              />
            </View>
            
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 uppercase">Promo Code</Text>
                <TextInput 
                  className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-[15px] text-slate-900 dark:text-white font-bold"
                  value={form.code} 
                  onChangeText={t => setForm({...form, code: t.toUpperCase()})} 
                  placeholder="VIP20" 
                  autoCapitalize="characters" 
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 uppercase">Valid Until</Text>
                <TextInput 
                  className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-[15px] text-slate-900 dark:text-white font-medium"
                  value={form.validUntil} 
                  onChangeText={t => setForm({...form, validUntil: t})} 
                  placeholder="YYYY-MM-DD" 
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
            
            <View className="mb-6">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 uppercase">Terms / Description</Text>
              <TextInput 
                className="h-28 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-[15px] text-slate-900 dark:text-white"
                value={form.description} 
                onChangeText={t => setForm({...form, description: t})} 
                placeholder="Valid for Privilege Card holders..." 
                multiline 
                placeholderTextColor="#94A3B8"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            <TouchableOpacity 
              className="h-14 bg-emerald-500 rounded-xl flex-row items-center justify-center shadow-lg shadow-emerald-500/30"
              onPress={handleSave}
            >
              <Save size={20} color="#FFF" className="mr-2" />
              <Text className="text-white text-[16px] font-bold">Save Offer</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
