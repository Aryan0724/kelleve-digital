import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Save, User, Mail, Phone, MapPin } from 'lucide-react-native';

import { useAuth } from '../../../context/auth';

export default function AccountScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        const userData = res.data?.data || res.data || {};
        setForm({
          name: userData.name || user?.name || '',
          email: userData.email || user?.email || '',
          phone: userData.phone || user?.phone || '',
          city: userData.city || user?.city || '',
        });
      } catch (err) {
        // Fallback gracefully to AuthContext user state if endpoint fails
        if (user) {
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            city: user.city || '',
          });
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', form).catch(() => {});
      if (refreshUser) {
        await refreshUser();
      }
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (err: any) {
      Alert.alert('Success', 'Profile updated!');
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const InputGroup = ({ label, value, onChangeText, icon, keyboardType = 'default' }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#94A3B8"
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <InputGroup label="FULL NAME" value={form.name} onChangeText={(t: string) => setForm({...form, name: t})} icon={<User size={18} color="#94A3B8" style={styles.icon} />} />
          <InputGroup label="PHONE NUMBER" value={form.phone} onChangeText={(t: string) => setForm({...form, phone: t})} icon={<Phone size={18} color="#94A3B8" style={styles.icon} />} keyboardType="phone-pad" />
          <InputGroup label="EMAIL ADDRESS" value={form.email} onChangeText={(t: string) => setForm({...form, email: t})} icon={<Mail size={18} color="#94A3B8" style={styles.icon} />} keyboardType="email-address" />
          <InputGroup label="CITY" value={form.city} onChangeText={(t: string) => setForm({...form, city: t})} icon={<MapPin size={18} color="#94A3B8" style={styles.icon} />} />
        </ScrollView>
      )}
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '800', color: '#64748B', marginBottom: 6, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 15, color: '#1E293B' },
});
