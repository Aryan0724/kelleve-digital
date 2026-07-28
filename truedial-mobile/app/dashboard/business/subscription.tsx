import React, { useState } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Award } from 'lucide-react-native';
import api from '../../../services/api';

export default function SubscriptionScreen() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);

  const handleUpgrade = async (planId: number, planName: string) => {
    setLoadingPlan(planId);
    try {
      // 1. Create Order
      const orderRes = await api.post('/truedial/vendor/payments/order', {
        plan_id: planId,
        billing_cycle: 'yearly'
      });
      
      const { order_id, payment_id } = orderRes.data.data;

      // 2. Mock payment confirmation if no Razorpay keys are loaded on backend
      if (orderRes.data.data.key === 'mock_key') {
        const verifyRes = await api.post('/truedial/vendor/payments/verify', {
          razorpay_order_id: order_id,
          razorpay_payment_id: payment_id || 'mock_payment_id',
          razorpay_signature: 'mock_signature'
        });

        if (verifyRes.data.success) {
          Alert.alert('Success', `You have successfully upgraded to ${planName}!`);
          router.back();
        } else {
          Alert.alert('Error', verifyRes.data.message || 'Payment verification failed');
        }
      } else {
        // Here we would integrate react-native-razorpay in a production build
        Alert.alert('Checkout Initiated', `Razorpay Order ID: ${order_id}\n\nNative SDK integration required for production checkout.`);
      }

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initiate payment');
    } finally {
      setLoadingPlan(null);
    }
  };

  const PlanCard = ({ planId, title, price, recommended, features }: any) => (
    <View className={`bg-white dark:bg-slate-900 rounded-[20px] p-6 mb-5 border-2 ${recommended ? 'border-[#E8701A] bg-orange-50/30 dark:bg-orange-900/10' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
      {recommended && (
        <View className="absolute -top-3.5 self-center bg-[#E8701A] px-4 py-1.5 rounded-full shadow-sm shadow-orange-500/20">
          <Text className="text-white text-[11px] font-extrabold tracking-wider uppercase">Most Popular</Text>
        </View>
      )}
      <Text className="text-[18px] font-bold text-slate-700 dark:text-slate-300 mb-3">{title}</Text>
      <View className="flex-row items-end mb-6">
        <Text className="text-[20px] font-bold text-slate-900 dark:text-white mb-1 mr-0.5">₹</Text>
        <Text className="text-[40px] font-extrabold text-slate-900 dark:text-white">{price}</Text>
        <Text className="text-[14px] text-slate-400 dark:text-slate-500 mb-2 ml-1">/month</Text>
      </View>
      
      <View className="mb-6">
        {features.map((f: string, i: number) => (
          <View key={i} className="flex-row items-start mb-3">
            <CheckCircle2 size={16} color={recommended ? '#E8701A' : '#10B981'} className="mr-2.5 mt-0.5" />
            <Text className="flex-1 text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">{f}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        className={`rounded-xl py-4 items-center justify-center flex-row ${recommended ? 'bg-[#E8701A] shadow-md shadow-orange-500/20' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`} 
        onPress={() => handleUpgrade(planId, title)}
        disabled={loadingPlan === planId}
      >
        {loadingPlan === planId ? (
          <ActivityIndicator size="small" color={recommended ? "white" : "#E8701A"} />
        ) : (
          <Text className={`text-[16px] font-bold ${recommended ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
            Choose {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">Subscription Plans</Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="items-center py-6">
          <View className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 items-center justify-center mb-4 border border-orange-200 dark:border-orange-500/30">
            <Award size={32} color="#E8701A" />
          </View>
          <Text className="text-[24px] font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Upgrade Your Business</Text>
          <Text className="text-[14px] text-slate-500 dark:text-slate-400 text-center px-4 leading-relaxed">
            Get verified, rank higher, and close more deals with premium features.
          </Text>
        </View>

        <PlanCard 
          planId={1}
          title="Free Starter" 
          price="0" 
          features={[
            "Standard Business Listing",
            "Up to 5 lead inquiries/month",
            "Basic contact form",
            "Standard directory placement"
          ]}
        />

        <PlanCard 
          planId={2}
          title="Professional VIP" 
          price="1,499" 
          recommended={true}
          features={[
            "Verified Business Shield Badge",
            "Unlimited direct customer leads",
            "0% commission on inquiries",
            "SMS & Email marketing tools",
            "Priority ranking in search"
          ]}
        />
        
        <PlanCard 
          planId={3}
          title="Enterprise Turnkey" 
          price="3,999" 
          features={[
            "Everything in Professional VIP",
            "Featured homepage showcase spot",
            "Multi-city listings",
            "Dedicated relationship manager"
          ]}
        />
      </ScrollView>
    </View>
  );
}
