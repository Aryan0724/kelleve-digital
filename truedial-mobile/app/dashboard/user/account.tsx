import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import LocationSelectorModal from '../../../components/LocationSelectorModal';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Shield, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../../context/auth';

const ROLE_LABELS: Record<string, string> = {
  customer: 'Explorer',
  business: 'Business Owner',
  builder: 'Real Estate Developer',
  supplier: 'Service Provider',
  worker: 'Freelancer',
  admin: 'Admin',
};

export default function AccountScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || 'Patna',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/user/profile').catch(() => api.get('/auth/me'));
        const userData = res?.data?.data || res?.data || {};
        setForm({
          name: userData.name || user?.name || '',
          email: userData.email || user?.email || '',
          phone: userData.phone || user?.phone || '',
          city: userData.city || user?.city || 'Patna',
        });
      } catch (err) {
        if (user) {
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            city: user.city || 'Patna',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }

    setSaving(true);
    try {
      await api.put('/user/profile', {
        name: form.name,
        phone: form.phone,
        city: form.city,
      });

      if (refreshUser) {
        await refreshUser();
      }
      Alert.alert('Success', 'Your profile details have been updated!');
      router.back();
    } catch (err: any) {
      console.error('Profile update error:', err);
      const msg = err?.response?.data?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const InputGroup = ({ label, value, onChangeText, icon, keyboardType = 'default', editable = true }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, !editable && styles.disabledInput]}>
        {icon}
        <TextInput
          style={[styles.input, !editable && { color: '#64748B' }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#94A3B8"
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
          {saving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Save size={18} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8701A" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          
          {/* User Badge Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>
                {form.name ? form.name.substring(0, 2).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{form.name || 'User Account'}</Text>
              <Text style={styles.profileEmail}>{form.email}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.roleBadge}>
                  <Shield size={10} color="#E8701A" style={{ marginRight: 4 }} />
                  <Text style={styles.roleBadgeText}>
                    {ROLE_LABELS[user?.role?.toLowerCase() || ''] || (user?.role ? user.role.toUpperCase() : 'EXPLORER')}
                  </Text>
                </View>
                {user?.has_listing && (
                  <View style={styles.verifiedBadge}>
                    <CheckCircle2 size={10} color="#10B981" style={{ marginRight: 4 }} />
                    <Text style={styles.verifiedBadgeText}>BUSINESS OWNER</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Edit Fields */}
          <Text style={styles.sectionHeader}>PERSONAL DETAILS</Text>
          <InputGroup 
            label="FULL NAME" 
            value={form.name} 
            onChangeText={(t: string) => setForm({...form, name: t})} 
            icon={<User size={18} color="#94A3B8" style={styles.icon} />} 
          />

          <InputGroup 
            label="PHONE NUMBER" 
            value={form.phone} 
            onChangeText={(t: string) => setForm({...form, phone: t})} 
            icon={<Phone size={18} color="#94A3B8" style={styles.icon} />} 
            keyboardType="phone-pad" 
          />

          <InputGroup 
            label="EMAIL ADDRESS" 
            value={form.email} 
            editable={false}
            icon={<Mail size={18} color="#94A3B8" style={styles.icon} />} 
            keyboardType="email-address" 
          />

          <Text style={styles.label}>CITY / LOCATION</Text>
          <TouchableOpacity 
            style={styles.locationSelector}
            onPress={() => setLocationModalVisible(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MapPin size={18} color="#1E40AF" style={styles.icon} />
              <Text style={styles.locationText}>{form.city || 'Select City'}</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.submitBtn}>
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Save Profile Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      <LocationSelectorModal
        visible={locationModalVisible}
        currentCity={form.city}
        onClose={() => setLocationModalVisible(false)}
        onSelectCity={(selectedCity) => setForm({ ...form, city: selectedCity })}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8701A', alignItems: 'center', justifyContent: 'center' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8701A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E8701A',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '800', color: '#64748B', marginBottom: 6, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  disabledInput: { backgroundColor: '#F1F5F9' },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 48, fontSize: 15, color: '#1E293B', fontWeight: '500' },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#E8701A',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
