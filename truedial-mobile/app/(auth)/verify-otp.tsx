import React, { useState, useRef } from 'react';
import {
  Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { API_BASE_URL } from '../../constants/config';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { contact } = useLocalSearchParams<{ contact: string }>();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1 && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (text === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      Alert.alert('Error', 'Please enter the full 6-digit code.');
      return;
    }
    
    setLoading(true);
    try {
      // Import api at the top if not already there, but we can fetch natively or via the context.
      // Let's assume we have an endpoint for OTP verification in the backend.
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ token: fullCode, email: contact })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success !== false) {
        Alert.alert('Success', 'Phone/Email verified! You can now set a new password.');
        router.replace('/(auth)/login');
      } else {
        Alert.alert('Verification Failed', data.message || 'Invalid OTP code.');
      }
    } catch (err: any) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <Text className="text-[28px] font-extrabold text-slate-900 dark:text-white mb-2">OTP Verification</Text>
          <Text className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Enter the verification code we just sent to{'\n'}
            <Text className="font-extrabold text-slate-900 dark:text-white">{contact}</Text>
          </Text>

          <View className="flex-row justify-between mb-8">
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={el => { inputs.current[idx] = el; }}
                className={`w-[50px] h-[60px] rounded-xl border text-[24px] font-bold text-center text-slate-900 dark:text-white ${digit ? 'border-[#E8701A] bg-orange-50 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                value={digit}
                onChangeText={t => handleChange(t, idx)}
                onKeyPress={e => e.nativeEvent.key === 'Backspace' ? handleBackspace('', idx) : null}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity 
            className="bg-[#E8701A] rounded-xl h-[52px] items-center justify-center mb-6 shadow-md shadow-orange-500/20" 
            onPress={handleVerify} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white text-[16px] font-bold">Verify Code</Text>}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="text-[14px] text-slate-500 dark:text-slate-400">Didn't receive code? </Text>
            <TouchableOpacity>
              <Text className="text-[14px] font-bold text-blue-500 dark:text-blue-400">Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
