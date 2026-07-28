import React, { useState, useEffect } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Plus, Trash2, Edit2, Package, Save, X } from 'lucide-react-native';

export default function CatalogScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products'|'services'>('products');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '' });

  useEffect(() => {
    fetchCatalog();
  }, [activeTab]);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await api.get('/truedial/vendor/my-business');
      const data = res.data?.data || res.data;
      if (data) {
        setItems(activeTab === 'products' ? (data.products || []) : (data.services || []));
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      Alert.alert('Error', 'Name and price are required.');
      return;
    }
    
    const newItem = { id: editingItem?.id || Date.now(), ...form };
    let newItems = [];
    if (editingItem) {
      newItems = items.map(i => i.id === editingItem.id ? newItem : i);
    } else {
      newItems = [...items, newItem];
    }
    setItems(newItems);
    setIsModalOpen(false);

    try {
      const endpoint = activeTab === 'products' ? '/truedial/vendor/businesses/me/products' : '/truedial/vendor/businesses/me/services';
      await api.put(endpoint, { [activeTab]: newItems });
    } catch (err: any) {
      console.warn('API save failed:', err.message);
    }
  };

  const handleDelete = async (id: number) => {
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    try {
      const endpoint = activeTab === 'products' ? '/truedial/vendor/businesses/me/products' : '/truedial/vendor/businesses/me/services';
      await api.put(endpoint, { [activeTab]: newItems });
    } catch (err) {
      console.warn('Delete API failed');
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setForm({ name: '', price: '', description: '', category: '' });
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setForm({ name: item.name, price: String(item.price), description: item.description || '', category: item.category || '' });
    setIsModalOpen(true);
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">Catalog</Text>
        <TouchableOpacity onPress={openAdd} className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/30 items-center justify-center border border-orange-100 dark:border-orange-500/30">
          <Plus size={20} color="#E8701A" />
        </TouchableOpacity>
      </View>

      <View className="flex-row bg-white dark:bg-slate-900 px-4 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'products' ? 'border-[#E8701A]' : 'border-transparent'}`} onPress={() => setActiveTab('products')}>
          <Text className={`text-[14px] ${activeTab === 'products' ? 'text-[#E8701A] font-bold' : 'text-slate-500 font-semibold'}`}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'services' ? 'border-[#E8701A]' : 'border-transparent'}`} onPress={() => setActiveTab('services')}>
          <Text className={`text-[14px] ${activeTab === 'services' ? 'text-[#E8701A] font-bold' : 'text-slate-500 font-semibold'}`}>Services</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8701A" className="mt-10" />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {items.length === 0 ? (
            <View className="items-center justify-center mt-16">
              <Package size={48} color="#CBD5E1" className="dark:text-slate-700" />
              <Text className="text-slate-400 font-semibold mt-3">No {activeTab} added yet.</Text>
            </View>
          ) : (
            items.map(item => (
              <View key={item.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 mb-3 flex-row items-center border border-slate-200 dark:border-slate-800 shadow-sm">
                <View className="flex-1 pr-3">
                  <Text className="text-[16px] font-bold text-slate-900 dark:text-white">{item.name}</Text>
                  <Text className="text-[14px] font-bold text-[#E8701A] mt-1">₹ {item.price}</Text>
                  {item.description ? <Text className="text-[13px] text-slate-500 dark:text-slate-400 mt-1" numberOfLines={2}>{item.description}</Text> : null}
                </View>
                <View className="flex-row gap-x-2">
                  <TouchableOpacity onPress={() => openEdit(item)} className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center border border-blue-100 dark:border-blue-800">
                    <Edit2 size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/30 items-center justify-center border border-red-100 dark:border-red-900">
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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-slate-900 rounded-t-[24px] p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'products' ? 'Product' : 'Service'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                <X size={18} color="#64748B" className="dark:text-slate-400" />
              </TouchableOpacity>
            </View>
            
            <View className="mb-4">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 ml-1">NAME</Text>
              <TextInput 
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-[15px] text-slate-900 dark:text-white"
                value={form.name} onChangeText={t => setForm({...form, name: t})} placeholder="Item name" placeholderTextColor="#94A3B8" 
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 ml-1">PRICE (₹)</Text>
              <TextInput 
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-[15px] text-slate-900 dark:text-white"
                value={form.price} onChangeText={t => setForm({...form, price: t})} placeholder="0.00" keyboardType="numeric" placeholderTextColor="#94A3B8" 
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 ml-1">DESCRIPTION</Text>
              <TextInput 
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-[15px] text-slate-900 dark:text-white h-24"
                style={{ textAlignVertical: 'top' }}
                value={form.description} onChangeText={t => setForm({...form, description: t})} placeholder="Details..." multiline placeholderTextColor="#94A3B8" 
              />
            </View>

            <TouchableOpacity className="bg-[#E8701A] rounded-xl py-3.5 flex-row items-center justify-center shadow-md shadow-orange-500/20" onPress={handleSave}>
              <Save size={20} color="#FFF" className="mr-2" />
              <Text className="text-white text-[16px] font-bold">Save {activeTab === 'products' ? 'Product' : 'Service'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
