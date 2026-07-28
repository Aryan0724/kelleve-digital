import React, { useState } from 'react';
import {
  Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Phone } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendReset = () => {
    if (!inputValue.trim()) {
      Alert.alert('Error', `Please enter your ${method}`);
      return;
    }
    setLoading(true);
    
    // Simulate API call for reset
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Code Sent', 
        `We've sent a 6-digit OTP to your ${method}.`,
        [{ text: 'Enter Code', onPress: () => router.push({ pathname: '/(auth)/verify-otp', params: { contact: inputValue } }) }]
      );
    }, 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className={`p-4 ${Platform.OS === 'android' ? 'mt-6' : 'mt-0'}`}>
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 items-center justify-center border border-slate-200 dark:border-slate-800">
            <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 pt-2">
          <Text className="text-[28px] font-extrabold text-slate-900 dark:text-white mb-2">Forgot Password?</Text>
          <Text className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Don't worry! It happens. Please enter the phone number or email associated with your account.
          </Text>

          <View className="flex-row bg-slate-50 dark:bg-slate-900 rounded-xl p-1 mb-6 border border-slate-200 dark:border-slate-800">
            <TouchableOpacity 
              className={`flex-1 flex-row py-3 items-center justify-center rounded-lg ${method === 'phone' ? 'bg-white dark:bg-slate-800 shadow-sm shadow-slate-200 dark:shadow-none' : ''}`} 
              onPress={() => setMethod('phone')}
            >
              <Phone size={16} color={method === 'phone' ? '#E8701A' : '#64748B'} className="mr-2" />
              <Text className={`text-sm ${method === 'phone' ? 'text-[#E8701A] font-bold' : 'text-slate-500 font-semibold'}`}>Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 flex-row py-3 items-center justify-center rounded-lg ${method === 'email' ? 'bg-white dark:bg-slate-800 shadow-sm shadow-slate-200 dark:shadow-none' : ''}`} 
              onPress={() => setMethod('email')}
            >
              <Mail size={16} color={method === 'email' ? '#E8701A' : '#64748B'} className="mr-2" />
              <Text className={`text-sm ${method === 'email' ? 'text-[#E8701A] font-bold' : 'text-slate-500 font-semibold'}`}>Email</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">{method.toUpperCase()}</Text>
            <View className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4">
              <TextInput
                className="h-[50px] text-[16px] text-slate-900 dark:text-white"
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={method === 'phone' ? 'Enter mobile number' : 'Enter email address'}
                placeholderTextColor="#94A3B8"
                keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity 
            className="bg-[#E8701A] rounded-xl h-[52px] items-center justify-center mt-2 shadow-md shadow-orange-500/20" 
            onPress={handleSendReset} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white text-[16px] font-bold">Send OTP Code</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
