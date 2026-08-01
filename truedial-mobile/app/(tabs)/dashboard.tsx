import React from 'react';
import { 
  Text, View, ScrollView, TouchableOpacity, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import { resolveDashboardTemplate, TEMPLATE_CONFIG } from '../../constants/dashboards';

// Shared components
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import MenuItem from '../../components/dashboard/MenuItem';
import GlassCard from '../../components/GlassCard';

// Dashboard templates
import HospitalityDashboard from '../../components/dashboard/templates/HospitalityDashboard';
import HealthcareDashboard from '../../components/dashboard/templates/HealthcareDashboard';
import ProfessionalDashboard from '../../components/dashboard/templates/ProfessionalDashboard';
import WholesaleDashboard from '../../components/dashboard/templates/WholesaleDashboard';
import LocalServiceDashboard from '../../components/dashboard/templates/LocalServiceDashboard';
import EducationDashboard from '../../components/dashboard/templates/EducationDashboard';
import CustomerDashboard from '../../components/dashboard/templates/CustomerDashboard';

// Icons
import { 
  User, LogOut, HelpCircle, Shield, Settings 
} from 'lucide-react-native';

/**
 * Dashboard Tab Screen — Category-Aware Router
 * 
 * Detects the user's role and business_category, then renders
 * the appropriate industry-specific dashboard template.
 * 
 * Below every template, the shared Account section is rendered
 * (profile, settings, help, privacy, sign out).
 */
export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Resolve which dashboard template to show
  const template = resolveDashboardTemplate(
    user?.role,
    user?.has_listing,
    user?.business_category
  );

  const config = TEMPLATE_CONFIG[template];

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

  // Render the correct dashboard template
  const renderTemplate = () => {
    switch (template) {
      case 'hospitality':
        return <HospitalityDashboard />;
      case 'healthcare':
        return <HealthcareDashboard />;
      case 'professional':
        return <ProfessionalDashboard />;
      case 'wholesale':
        return <WholesaleDashboard />;
      case 'local-service':
        return <LocalServiceDashboard />;
      case 'education':
        return <EducationDashboard />;
      case 'customer':
        return <CustomerDashboard />;
      default:
        return <ProfessionalDashboard />;
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Sticky Header */}
      <View className="pt-14 px-4 pb-3 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 z-20">
        <DashboardHeader
          userName={user?.name || ''}
          badgeLabel={config.badgeLabel}
        />
      </View>

      {/* Dashboard Content */}
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Template-specific content */}
        {renderTemplate()}

        {/* ────────────────────────────────────────── */}
        {/* Shared Account Section (always visible) */}
        {/* ────────────────────────────────────────── */}
        <View className="px-4 mt-6">
          <Text className="text-[15px] font-extrabold text-slate-900 dark:text-white mb-3 ml-1 tracking-tight">Account</Text>
          <GlassCard className="mb-6 p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
            <MenuItem 
              icon={<User size={18} color="#3B82F6" />} 
              title="Account Profile" 
              subtitle="Edit name, email, phone" 
              noBorder 
              onPress={() => router.push('/dashboard/user/account')} 
            />
            <MenuItem 
              icon={<Settings size={18} color="#64748B" />} 
              title="Settings & Privacy" 
              subtitle="Security and notification preferences" 
              onPress={() => router.push('/dashboard/user/settings')} 
            />
            <MenuItem 
              icon={<HelpCircle size={18} color="#10B981" />} 
              title="Help & Support" 
              subtitle="FAQs and customer care" 
              onPress={() => Alert.alert('Support', 'Support ticketing coming soon')} 
            />
            <MenuItem 
              icon={<Shield size={18} color="#8B5CF6" />} 
              title="Privacy Policy" 
              subtitle="Terms of service" 
              onPress={() => Alert.alert('Privacy', 'Privacy policy document')} 
            />
            <TouchableOpacity 
              className="flex-row items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800" 
              onPress={handleLogout}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 items-center justify-center mr-3 border border-red-100 dark:border-red-900/50">
                  <LogOut size={18} color="#EF4444" />
                </View>
                <Text className="text-[15px] font-bold text-red-500">Sign Out</Text>
              </View>
            </TouchableOpacity>
          </GlassCard>

          <View className="items-center mt-2 mb-4">
            <Text className="text-[12px] font-semibold text-slate-400 dark:text-slate-500">TrueDial App v2.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
