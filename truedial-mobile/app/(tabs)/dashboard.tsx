import React from 'react';
import { 
  Text, View, ScrollView, TouchableOpacity, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import { 
  User, LogOut, ChevronRight, HelpCircle, Shield, Award, 
  Building, ListTodo, Store, BarChart3, Mail, Megaphone,
  Briefcase, MessageSquare, Star, Settings, Tag, Bookmark, Bell
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of TrueDial?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/(auth)/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        }
      }
    ]);
  };

  const getInitials = (name: string) => {
    if (!name) return 'TD';
    return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  };

  const MenuItem = ({ icon, title, subtitle, onPress, noBorder = false }: any) => (
    <TouchableOpacity className={`flex-row items-center justify-between p-4 ${!noBorder ? 'border-t border-slate-100 dark:border-slate-800' : ''}`} onPress={onPress}>
      <View className="flex-row items-center flex-1">
        <View className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 items-center justify-center mr-3 border border-slate-200 dark:border-slate-800">
          {icon}
        </View>
        <View>
          <Text className="text-[15px] font-bold text-slate-900 dark:text-white">{title}</Text>
          {subtitle && <Text className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight size={16} color="#94A3B8" className="dark:text-slate-500" />
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerStyle={{ padding: 16, paddingBottom: 40, paddingTop: 60 }}>
      {/* Top Bar with Notifications */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-[24px] font-extrabold text-slate-900 dark:text-white">Profile</Text>
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm"
          onPress={() => router.push('/notifications')}
        >
          <Bell size={20} color="#1E293B" className="dark:text-white" />
          <View className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </TouchableOpacity>
      </View>

      {/* Profile Header Box */}
      <GlassCard className="mb-6 p-5 border border-orange-200 dark:border-orange-500/30">
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-[#E8701A] items-center justify-center mr-4 border-2 border-white/20">
            <Text className="text-[20px] font-extrabold text-white tracking-widest">{getInitials(user?.name || '')}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white mb-1">{user?.name || 'Valued User'}</Text>
            <View className="flex-row items-center bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-500/30 self-start px-2 py-1 rounded-md">
              <Award size={10} color="#E8701A" className="mr-1" />
              <Text className="text-[11px] font-bold text-[#E8701A]">{user?.role === 'business' || user?.has_listing ? 'TrueDial Business' : 'TrueDial User'}</Text>
            </View>
        </View>
      </GlassCard>

      {user?.role === 'business' || user?.has_listing ? (
        <>
          {/* Business Dashboard Menu */}
          <Text className="text-[15px] font-extrabold text-slate-900 dark:text-white mb-3 ml-1 tracking-tight">Business Dashboard</Text>
          <GlassCard className="mb-6 p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
            <MenuItem 
              icon={<BarChart3 size={18} color="#3B82F6" />} title="Performance Overview" subtitle="KPIs, profile views & stats" 
              noBorder onPress={() => router.push('/dashboard/business/overview')} 
            />
            <MenuItem 
              icon={<Briefcase size={18} color="#10B981" />} title="CRM Leads Inbox" subtitle="Manage incoming inquiries" 
              onPress={() => router.push('/dashboard/business/leads')} 
            />
            <MenuItem 
              icon={<Store size={18} color="#E8701A" />} title="Edit Business Profile" subtitle="Update details, logo & hours" 
              onPress={() => router.push('/dashboard/business/profile-edit')} 
            />
            <MenuItem 
              icon={<Tag size={18} color="#8B5CF6" />} title="Products & Services" subtitle="Manage your catalog" 
              onPress={() => router.push('/dashboard/business/catalog')} 
            />
            <MenuItem 
              icon={<Star size={18} color="#F59E0B" />} title="Customer Reviews" subtitle="Read and reply to reviews" 
              onPress={() => router.push('/dashboard/business/reviews')} 
            />
            <MenuItem 
              icon={<Award size={18} color="#EC4899" />} title="Promotional Offers" subtitle="Create discounts & VIP codes" 
              onPress={() => router.push('/dashboard/business/offers')} 
            />
            <MenuItem 
              icon={<Megaphone size={18} color="#06B6D4" />} title="SMS Marketing" subtitle="Send targeted campaigns" 
              onPress={() => router.push('/dashboard/business/marketing')} 
            />
            <MenuItem 
              icon={<Building size={18} color="#6366F1" />} title="Subscription & Billing" subtitle="Manage your VIP plan" 
              onPress={() => router.push('/dashboard/business/subscription')} 
            />
          </GlassCard>
        </>
      ) : (
        <>
          {/* User Dashboard Actions */}
          <Text className="text-[15px] font-extrabold text-slate-900 dark:text-white mb-3 ml-1 tracking-tight">My Dashboard</Text>
          <GlassCard className="mb-6 p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
            <MenuItem 
              icon={<ListTodo size={18} color="#2563EB" />} title="My Requirements & Quotes" subtitle="Track your service requests" 
              noBorder onPress={() => router.push('/dashboard/user/my-requirements')} 
            />
            <MenuItem 
              icon={<Bookmark size={18} color="#10B981" />} title="Saved Projects & Vendors" subtitle="Your bookmarked items" 
              onPress={() => router.push('/dashboard/user/saved')} 
            />
          </GlassCard>

          <Text className="text-[15px] font-extrabold text-slate-900 dark:text-white mb-3 ml-1 tracking-tight">For Businesses</Text>
          <GlassCard className="mb-6 p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
            <View className="flex-row items-center p-4 bg-orange-50 dark:bg-orange-950/20">
              <View className="flex-1 pr-3">
                <Text className="text-[14px] font-extrabold text-slate-900 dark:text-white mb-1">List your business on TrueDial</Text>
                <Text className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Reach thousands of local customers for free.</Text>
              </View>
              <CustomButton title="Start Now" onPress={() => router.push('/list-business')} className="px-4 h-9" />
            </View>
          </GlassCard>
        </>
      )}

      {/* Account Settings (For both) */}
      <Text className="text-[15px] font-extrabold text-slate-900 dark:text-white mb-3 ml-1 tracking-tight">Account</Text>
      <GlassCard className="mb-6 p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
        <MenuItem 
          icon={<User size={18} color="#3B82F6" />} title="Account Profile" subtitle="Edit name, email, phone" 
          noBorder onPress={() => router.push('/dashboard/user/account')} 
        />
        <MenuItem 
          icon={<Settings size={18} color="#64748B" />} title="Settings & Privacy" subtitle="Security and notification preferences" 
          onPress={() => router.push('/dashboard/user/settings')} 
        />
        <MenuItem 
          icon={<HelpCircle size={18} color="#10B981" />} title="Help & Support" subtitle="FAQs and customer care" 
          onPress={() => Alert.alert('Support', 'Support ticketing coming soon')} 
        />
        <MenuItem 
          icon={<Shield size={18} color="#8B5CF6" />} title="Privacy Policy" subtitle="Terms of service" 
          onPress={() => Alert.alert('Privacy', 'Privacy policy document')} 
        />
        <TouchableOpacity className="flex-row items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800" onPress={handleLogout}>
          <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 items-center justify-center mr-3 border border-red-100 dark:border-red-900/50">
              <LogOut size={18} color="#EF4444" />
            </View>
            <Text className="text-[15px] font-bold text-red-500">Sign Out</Text>
          </View>
        </TouchableOpacity>
      </GlassCard>
      
      <View className="items-center mt-2">
        <Text className="text-[12px] font-semibold text-slate-400 dark:text-slate-500">TrueDial App v2.0</Text>
      </View>
    </ScrollView>
  );
}
