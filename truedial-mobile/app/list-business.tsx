import React, { useState, useEffect } from 'react';
import { 
  Text, View, TextInput, ScrollView, Alert,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import { Building, MapPin, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '../context/auth';

interface Category {
  id: number;
  name: string;
}

export default function ListBusinessScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '', category_id: '', city: '', phone: '', description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: String(data[0].id) }));
        }
      } catch {
        setCategories([
          { id: 1, name: 'Restaurants' }, { id: 2, name: 'Hotels' }, { id: 3, name: 'Hospitals' },
          { id: 4, name: 'Education' }, { id: 5, name: 'Interior Designers' }, { id: 6, name: 'Real Estate' },
        ]);
        setFormData(prev => ({ ...prev, category_id: '1' }));
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!formData.title || !formData.city || !formData.phone) {
      Alert.alert('Missing Fields', 'Please fill in the business title, city, and phone number.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/truedial/vendor/businesses', {
        title: formData.title,
        category_id: parseInt(formData.category_id),
        city_id: 1, // Defaulting to 1 since city is currently a text input
        address: formData.city,
        district: formData.city,
        state: 'Unknown',
        phone: formData.phone,
        description: formData.description || 'Verified Business'
      });
      
      if (refreshUser) {
        await refreshUser();
      }
      setSuccess(true);
    } catch (error: any) {
      console.error('List business error:', error);
      const errMsg = error?.response?.data?.message || error?.message || '';
      
      if (errMsg.includes('already have a business listing')) {
        Alert.alert(
          'Business Already Listed',
          'You already have an active business listing. Redirecting to your dashboard...',
          [{ text: 'Go to Dashboard', onPress: async () => {
            if (refreshUser) await refreshUser();
            router.replace('/(tabs)/dashboard');
          }}]
        );
      } else {
        Alert.alert('Error', errMsg || 'Failed to list business. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 justify-center items-center p-8">
        <CheckCircle2 size={64} color="#10B981" className="mb-5" />
        <Text className="text-[24px] font-extrabold text-slate-900 dark:text-white mb-2 text-center">Business Listed!</Text>
        <Text className="text-[15px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
          Your business is now live on the TrueDial network.
        </Text>
        <CustomButton 
          title="Go to Dashboard" 
          onPress={() => router.replace('/(tabs)/dashboard')}
          className="w-full mt-6"
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 100 }}>
      <TouchableOpacity className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 justify-center items-center border border-slate-200 dark:border-slate-800 mb-6" onPress={() => router.back()}>
        <ArrowLeft size={24} color="#1E293B" className="dark:text-white" />
      </TouchableOpacity>

      <Text className="text-[28px] font-extrabold text-slate-900 dark:text-white mb-2">List Your Business</Text>
      <Text className="text-[15px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">Join thousands of verified vendors growing their reach on TrueDial.</Text>

      <GlassCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        
        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">BUSINESS NAME</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5">
            <Building size={18} color="#94A3B8" className="mr-2.5 dark:text-slate-500" />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white"
              placeholder="e.g. Acme Interio Pvt Ltd"
              placeholderTextColor="#94A3B8"
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1">
            {categories.map(cat => {
              const isSelected = formData.category_id === String(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setFormData({...formData, category_id: String(cat.id)})}
                  className={`px-3.5 py-2 rounded-full mr-2 border ${isSelected ? 'bg-[#E8701A] border-[#E8701A]' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                >
                  <Text className={`text-[13px] font-bold ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{cat.name}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">CITY / LOCATION</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5">
            <MapPin size={18} color="#94A3B8" className="mr-2.5 dark:text-slate-500" />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white"
              placeholder="e.g. Mumbai, Maharashtra"
              placeholderTextColor="#94A3B8"
              value={formData.city}
              onChangeText={(text) => setFormData({...formData, city: text})}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">BUSINESS PHONE</Text>
          <View className="flex-row items-center h-[52px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5">
            <Phone size={18} color="#94A3B8" className="mr-2.5 dark:text-slate-500" />
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white"
              placeholder="e.g. +91 9876543210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 ml-1">DESCRIPTION</Text>
          <TextInput
            className="h-[100px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-[15px] text-slate-900 dark:text-white"
            placeholder="Tell us about your services..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        <CustomButton 
          title={loading ? "Submitting..." : "List Business for Free"} 
          onPress={handleSubmit} 
          disabled={loading}
          className="mt-2"
        />
      </GlassCard>
    </ScrollView>
  );
}
