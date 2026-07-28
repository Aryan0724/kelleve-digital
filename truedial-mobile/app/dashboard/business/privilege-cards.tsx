import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Search, CheckCircle2, XCircle } from 'lucide-react-native';

export default function VendorPrivilegeCardsScreen() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState<any>(null);

  const handleValidate = () => {
    if (!cardNumber.trim() || cardNumber.length < 5) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }
    
    setLoading(true);
    setCardStatus(null);
    
    // Simulate API call to validate card
    setTimeout(() => {
      setLoading(false);
      // Mock validation logic
      if (cardNumber.includes('VIP')) {
        setCardStatus({ valid: true, owner: 'Rahul Kumar', expiry: '2027-12-31', tier: 'Gold' });
      } else {
        setCardStatus({ valid: false, reason: 'Card not found or expired' });
      }
    }, 1200);
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">Privilege VIP Cards</Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-6 border border-slate-200 dark:border-slate-800 shadow-sm items-center">
          <View className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 items-center justify-center mb-4">
            <CreditCard size={32} color="#E8701A" />
          </View>
          <Text className="text-[16px] font-bold text-slate-900 dark:text-white mb-2 text-center">Validate Customer Card</Text>
          <Text className="text-[13px] text-slate-500 dark:text-slate-400 text-center mb-6 px-4">
            Enter a customer's TrueDial Privilege Card number to verify its validity before applying discounts.
          </Text>

          <View className="w-full mb-4">
            <View className="flex-row h-14 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 items-center">
              <Search size={20} color="#94A3B8" className="mr-3" />
              <TextInput 
                className="flex-1 text-[16px] text-slate-900 dark:text-white font-mono tracking-widest uppercase"
                placeholder="TD-VIP-XXXX"
                placeholderTextColor="#94A3B8"
                value={cardNumber}
                onChangeText={setCardNumber}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <TouchableOpacity 
            className="w-full h-14 bg-[#E8701A] rounded-xl items-center justify-center flex-row shadow-lg shadow-orange-500/30"
            onPress={handleValidate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text className="text-white text-[16px] font-bold">Validate Card</Text>
            )}
          </TouchableOpacity>
        </View>

        {cardStatus && (
          <View className={`rounded-2xl p-5 border shadow-sm ${cardStatus.valid ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'}`}>
            <View className="flex-row items-center mb-4">
              {cardStatus.valid ? (
                <CheckCircle2 size={24} color="#10B981" />
              ) : (
                <XCircle size={24} color="#EF4444" />
              )}
              <Text className={`text-[18px] font-bold ml-2 ${cardStatus.valid ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                {cardStatus.valid ? 'Valid Membership' : 'Invalid Card'}
              </Text>
            </View>

            {cardStatus.valid ? (
              <View className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-slate-500 dark:text-slate-400 text-[13px]">Card Holder</Text>
                  <Text className="text-slate-900 dark:text-white font-bold text-[14px]">{cardStatus.owner}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-slate-500 dark:text-slate-400 text-[13px]">Tier</Text>
                  <View className="bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">
                    <Text className="text-amber-600 dark:text-amber-400 font-bold text-[11px] uppercase">{cardStatus.tier}</Text>
                  </View>
                </View>
                <View className="flex-row justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <Text className="text-slate-500 dark:text-slate-400 text-[13px]">Valid Until</Text>
                  <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-[13px]">{cardStatus.expiry}</Text>
                </View>
              </View>
            ) : (
              <Text className="text-red-600 dark:text-red-400 text-[14px] font-medium">{cardStatus.reason}</Text>
            )}
          </View>
        )}

      </ScrollView>
    </View>
  );
}
