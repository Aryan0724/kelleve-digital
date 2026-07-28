import React, { useState, useEffect } from 'react';
import { 
  Text, View, ActivityIndicator, ScrollView, Platform, Alert
} from 'react-native';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import { Sparkles, ShieldCheck, Calendar } from 'lucide-react-native';
import { useAuth } from '../context/auth';

interface PrivilegeCardData {
  card_number: string;
  valid_until: string;
  status: string;
}

export default function PrivilegeScreen() {
  const { user } = useAuth();
  const [card, setCard] = useState<PrivilegeCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPrivilegeCard();
  }, []);

  const fetchPrivilegeCard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/privilege-cards');
      const resData = response.data;
      if (resData.success && resData.data) {
        setCard(resData.data);
      } else if (resData.card_number) {
        setCard(resData);
      } else {
        setCard(null);
      }
    } catch (error) {
      console.warn('No active privilege card found or fetch failed');
      setCard(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCard = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/privilege-cards/generate');
      const resData = response.data;
      const cardInfo = resData.data || resData;
      setCard(cardInfo);
      Alert.alert('Success', 'Your TrueDial Privilege Card has been generated successfully!');
    } catch (error: any) {
      Alert.alert('Generation Failed', error.message || 'Could not generate card. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}>
      {/* Background glow */}
      <View className="absolute w-[300px] h-[300px] rounded-full bg-orange-500/10 top-12 -right-24" />

      <View className="mb-6 mt-4">
        <Text className="text-[24px] font-extrabold text-slate-900 dark:text-white tracking-tight">Privilege Club</Text>
        <Text className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Unlock exclusive local B2B discount cards across hospitals, hotels and services.
        </Text>
      </View>

      {loading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#E8701A" />
          <Text className="text-[14px] text-slate-500 dark:text-slate-400 mt-3">Verifying Club membership...</Text>
        </View>
      ) : card ? (
        <View className="items-center">
          {/* Privilege Card UI */}
          <GlassCard className="w-full aspect-[1.58] bg-[#111111] border-[1.5px] border-[#D4AF37] rounded-3xl p-5 justify-between shadow-2xl shadow-amber-500/20">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-[20px] font-bold text-white tracking-wide">TrueDial</Text>
                <Text className="text-[9px] font-bold text-[#E8701A] tracking-widest mt-0.5">PRIVILEGE MEMBER</Text>
              </View>
              <Sparkles size={28} color="#E8701A" />
            </View>

            {/* Simulated Chip */}
            <View className="w-10 h-7 bg-amber-500/20 border border-amber-500/40 rounded-md mt-2.5" />

            <View className="my-3">
              <Text className="text-[20px] font-bold text-white tracking-[3px] font-mono">{card.card_number}</Text>
            </View>

            <View className="flex-row justify-between items-end">
              <View>
                <Text className="text-[8px] text-white/50 tracking-wider mb-0.5">HOLDER NAME</Text>
                <Text className="text-[12px] font-semibold text-white">{user?.name || 'Valued Partner'}</Text>
              </View>
              <View className="items-end">
                <Text className="text-[8px] text-white/50 tracking-wider mb-0.5">VALID UNTIL</Text>
                <Text className="text-[12px] font-semibold text-white">{card.valid_until}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Status Indicators */}
          <GlassCard className="w-full mt-5 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <View className="flex-row items-center">
              <ShieldCheck size={20} color="#10B981" />
              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-semibold text-slate-900 dark:text-white">Status: {card.status}</Text>
                <Text className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Your membership is fully verified and active.</Text>
              </View>
            </View>

            <View className="flex-row items-center mt-3">
              <Calendar size={20} color="#E8701A" />
              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-semibold text-slate-900 dark:text-white">Valid Until: {card.valid_until}</Text>
                <Text className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Card renewal will occur automatically before expiry.</Text>
              </View>
            </View>
          </GlassCard>

          <Text className="text-[12px] text-slate-500 dark:text-slate-400 text-center mt-5 leading-relaxed px-3">
            Present this digital card at any participating TrueDial business outlet in India to claim exclusive discount privileges.
          </Text>
        </View>
      ) : (
        <View className="mt-0">
          <Text className="text-[18px] font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Select Your Privilege Card Tier</Text>

          <View className="gap-3">
            {/* City Card Tier */}
            <GlassCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <View className="bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-md self-start mb-2">
                <Text className="text-[#E8701A] text-[10px] font-extrabold tracking-wider">POPULAR</Text>
              </View>
              <Text className="text-[18px] font-bold text-slate-900 dark:text-white">City Privilege Card</Text>
              <Text className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 mb-3">Unlimited discount access in your home city</Text>
              <View className="flex-row items-baseline my-1">
                <Text className="text-[13px] text-slate-400 line-through mr-2">₹2,999</Text>
                <Text className="text-[22px] font-extrabold text-[#E8701A]">₹999/- <Text className="text-[12px] font-semibold text-emerald-500">Only</Text></Text>
              </View>
              <CustomButton
                title="Get City Card"
                onPress={handleGenerateCard}
                loading={generating}
                className="mt-3"
              />
            </GlassCard>

            {/* Multi-City Card Tier */}
            <GlassCard className="p-5 bg-white dark:bg-slate-900 border border-amber-500/40">
              <View className="bg-amber-500/20 px-2 py-1 rounded-md self-start mb-2">
                <Text className="text-[#F59E0B] text-[10px] font-extrabold tracking-wider">VIP ALL CITIES</Text>
              </View>
              <Text className="text-[18px] font-bold text-slate-900 dark:text-white">Multi-City Privilege Card</Text>
              <Text className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 mb-3">All-India access across 50+ major hubs & airports</Text>
              <View className="flex-row items-baseline my-1">
                <Text className="text-[13px] text-slate-400 line-through mr-2">₹4,999</Text>
                <Text className="text-[22px] font-extrabold text-[#F59E0B]">₹2,999/- <Text className="text-[12px] font-semibold text-emerald-500">Only</Text></Text>
              </View>
              <CustomButton
                title="Get Multi-City Card"
                onPress={handleGenerateCard}
                loading={generating}
                variant="glass"
                className="mt-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-none"
              />
            </GlassCard>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
