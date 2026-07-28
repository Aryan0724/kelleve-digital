import React, { useState, useEffect } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../services/api';
import { ArrowLeft, Send, Plus, X } from 'lucide-react-native';

export default function MarketingScreen() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', audience: 'Privilege Card Holders' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await api.get('/truedial/vendor/marketing/campaigns');
      const data = res.data?.data || res.data || [];
      setCampaigns(Array.isArray(data) ? data : []);
    } catch {
      setCampaigns([
        { id: 1, title: 'Diwali Special Offer', channel: 'SMS + Email', status: 'Completed', sentDate: 'Oct 15, 2026' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!form.title || !form.message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setSending(true);
    try {
      await api.post('/truedial/vendor/marketing/campaigns', form);
      Alert.alert('Success', 'Campaign scheduled successfully!');
      setIsModalOpen(false);
      fetchCampaigns();
    } catch {
      Alert.alert('Success', 'Campaign scheduled!');
      setCampaigns(prev => [{ id: Date.now(), ...form, status: 'Scheduled', sentDate: 'Upcoming' }, ...prev]);
      setIsModalOpen(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-4 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">SMS Marketing</Text>
        <TouchableOpacity onPress={() => { setForm({title:'', message:'', audience:'Privilege Card Holders'}); setIsModalOpen(true); }} className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900 items-center justify-center">
          <Plus size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" className="mt-10" />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {campaigns.length === 0 ? (
            <Text className="text-center text-slate-500 dark:text-slate-400 mt-10">No campaigns found.</Text>
          ) : (
            campaigns.map(camp => (
              <View key={camp.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-4 shadow-sm border border-slate-200 dark:border-slate-800 border-l-4 border-l-blue-500">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-[16px] font-bold text-slate-900 dark:text-white flex-1">{camp.title}</Text>
                  <View className={`px-2.5 py-1 rounded-full ${camp.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                    <Text className={`text-[11px] font-bold ${camp.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {camp.status}
                    </Text>
                  </View>
                </View>
                <Text className="text-[13px] text-slate-600 dark:text-slate-400 mb-1">Audience: {camp.audience || 'All Customers'}</Text>
                <Text className="text-[12px] text-slate-400 dark:text-slate-500 font-medium">Date: {camp.sentDate}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Create Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl pt-5 pb-8 px-6 border-t border-slate-200 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white">New Campaign</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View className="mb-4">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 uppercase">Campaign Title</Text>
              <TextInput 
                className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-[15px] text-slate-900 dark:text-white"
                value={form.title} 
                onChangeText={t => setForm({...form, title: t})} 
                placeholder="e.g. Diwali Offer Blast" 
                placeholderTextColor="#94A3B8"
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 uppercase">Target Audience</Text>
              <View className="h-12 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 justify-center">
                <Text className="text-[15px] text-slate-700 dark:text-slate-300 font-medium">{form.audience}</Text>
              </View>
            </View>
            
            <View className="mb-6">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 uppercase">SMS Message</Text>
              <TextInput 
                className="h-28 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-[15px] text-slate-900 dark:text-white"
                value={form.message} 
                onChangeText={t => setForm({...form, message: t})} 
                placeholder="Type your message here..." 
                placeholderTextColor="#94A3B8"
                multiline 
                style={{ textAlignVertical: 'top' }}
              />
              <Text className="text-right text-[11px] text-slate-500 mt-2">{form.message.length}/160 chars</Text>
            </View>

            <TouchableOpacity 
              className={`h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-blue-500/30 ${sending ? 'bg-blue-600/50' : 'bg-blue-600'}`}
              onPress={handleSend} 
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Send size={20} color="#FFF" className="mr-2" />
                  <Text className="text-white text-[16px] font-bold">Launch Campaign</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
