import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin } from 'lucide-react-native';
// Note: In a real app we would use react-native-maps. For this sprint we render a placeholder.

export default function MapScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interactive Map</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapPlaceholder}>
        <View style={styles.circle}>
          <MapPin size={48} color="#E8701A" />
        </View>
        <Text style={styles.title}>Map View Unavailable</Text>
        <Text style={styles.subtitle}>Install react-native-maps to enable this feature.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    zIndex: 10
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  mapPlaceholder: { flex: 1, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', padding: 20 },
  circle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(232, 112, 26, 0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center' }
});
