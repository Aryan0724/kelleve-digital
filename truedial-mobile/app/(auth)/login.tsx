import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import { Mail, Lock, Sparkles } from 'lucide-react-native';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50 dark:bg-slate-950"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        {/* Glow Effects */}
        <View className="absolute w-[250px] h-[250px] rounded-full opacity-10 bg-[#F05A24] -top-12 -right-12" />
        <View className="absolute w-[250px] h-[250px] rounded-full opacity-10 bg-[#2563EB] -bottom-12 -left-12" />

        {/* Logo Section */}
        <View className="items-center mb-8">
          <View className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-950 justify-center items-center border border-orange-100 dark:border-orange-900 mb-4">
            <Sparkles size={24} color="#E8701A" />
          </View>
          <Text className="text-[32px] font-extrabold text-slate-900 dark:text-white tracking-tight">TrueDial</Text>
          <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1.5 text-center">India's Emerging Business Growth Platform</Text>
        </View>

        {/* Login Card */}
        <GlassCard className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Text className="text-[22px] font-bold text-slate-900 dark:text-white mb-1.5">Welcome Back</Text>
          <Text className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">Sign in to manage listings, cards, and active offers</Text>

          {errorMsg && (
            <View className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-3 mb-4">
              <Text className="text-red-600 dark:text-red-400 text-[13px] font-bold text-center">{errorMsg}</Text>
            </View>
          )}

          {/* Email Input */}
          <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</Text>
          <View className={`flex-row items-center h-12 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 mb-4 ${focusEmail ? 'border-[#E8701A] bg-orange-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'}`}>
            <Mail size={18} color={focusEmail ? '#E8701A' : '#708090'} className="mr-2" />
            <TextInput
              className="flex-1 text-[14px] text-slate-900 dark:text-white"
              placeholder="e.g. john@example.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusEmail(true)}
              onBlur={() => setFocusEmail(false)}
            />
          </View>

          {/* Password Input */}
          <Text className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</Text>
          <View className={`flex-row items-center h-12 bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 mb-4 ${focusPassword ? 'border-[#E8701A] bg-orange-50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-700'}`}>
            <Lock size={18} color={focusPassword ? '#E8701A' : '#708090'} className="mr-2" />
            <TextInput
              className="flex-1 text-[14px] text-slate-900 dark:text-white"
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              onFocus={() => setFocusPassword(true)}
              onBlur={() => setFocusPassword(false)}
            />
          </View>
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} className="items-end mb-4">
            <Text className="text-[13px] font-bold text-blue-600 dark:text-blue-400">Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton 
            title="Sign In" 
            onPress={handleLogin} 
            loading={loading}
            className="mt-2"
          />
        </GlassCard>

        {/* Bottom Nav */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-[#E8701A] font-extrabold text-sm"> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
