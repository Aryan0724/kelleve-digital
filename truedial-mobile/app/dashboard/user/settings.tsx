import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Lock, Shield, Eye, Smartphone } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    pushNotifs: true, emailNotifs: false, smsNotifs: true,
    publicProfile: true, showActivity: false
  });

  const toggle = (key: string) => setSettings(s => ({ ...s, [key]: !s[key as keyof typeof s] }));

  const SettingRow = ({ icon, title, subtitle, value, onToggle }: any) => (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.iconBox}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#CBD5E1', true: '#3B82F6' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings & Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <SettingRow title="Push Notifications" subtitle="Receive alerts on your device" value={settings.pushNotifs} onToggle={() => toggle('pushNotifs')} icon={<Smartphone size={18} color="#3B82F6" />} />
          <View style={styles.divider} />
          <SettingRow title="Email Notifications" subtitle="Weekly digests and updates" value={settings.emailNotifs} onToggle={() => toggle('emailNotifs')} icon={<Bell size={18} color="#10B981" />} />
          <View style={styles.divider} />
          <SettingRow title="SMS Alerts" subtitle="Important account and security alerts" value={settings.smsNotifs} onToggle={() => toggle('smsNotifs')} icon={<Shield size={18} color="#E8701A" />} />
        </View>

        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.card}>
          <SettingRow title="Public Profile" subtitle="Allow others to see your basic profile" value={settings.publicProfile} onToggle={() => toggle('publicProfile')} icon={<Eye size={18} color="#8B5CF6" />} />
          <View style={styles.divider} />
          <SettingRow title="Activity Status" subtitle="Show when you are online" value={settings.showActivity} onToggle={() => toggle('showActivity')} icon={<Lock size={18} color="#06B6D4" />} />
        </View>

        <TouchableOpacity 
          style={styles.dangerZone}
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to permanently delete your TrueDial account and all listed business data?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete Account', 
                  style: 'destructive', 
                  onPress: () => Alert.alert('Request Submitted', 'Your account deletion request has been submitted to TrueDial support.') 
                }
              ]
            );
          }}
        >
          <Text style={styles.dangerText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#64748B', marginBottom: 12, marginTop: 16, marginLeft: 4, textTransform: 'uppercase' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 16 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  textContainer: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  dangerZone: { marginTop: 40, padding: 16, alignItems: 'center' },
  dangerText: { color: '#EF4444', fontSize: 15, fontWeight: '700' }
});
