import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Laptop, ChevronRight, CheckCircle, Clock } from 'lucide-react-native';
import api from '../../../services/api';

const BRAND_ORANGE = "#E8701A";

export default function VendorProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/projects');
      setProjects(res.data?.data || res.data || []);
    } catch {
      // Mock Fallback
      setProjects([
        { id: 1, title: "E-Commerce App Development", client: "Organic Foods Ltd.", progress: 75, deadline: "Sep 15, 2026", status: "Active" },
        { id: 2, title: "Brand Identity Guidelines", client: "Apex Tech solutions", progress: 40, deadline: "Sep 30, 2026", status: "Active" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = (id: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const nextProgress = Math.min(100, p.progress + 10);
        return { 
          ...p, 
          progress: nextProgress,
          status: nextProgress === 100 ? 'Completed' : p.status
        };
      }
      return p;
    }));
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />
      
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Laptop size={20} color={BRAND_ORANGE} />
          <Text style={s.headerTitle}>Agency Project Center</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={BRAND_ORANGE} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.scrollContent}>
          {projects.length === 0 ? (
            <View style={s.emptyState}>
              <Laptop size={50} color="#94A3B8" />
              <Text style={s.emptyTitle}>No Projects Found</Text>
              <Text style={s.emptySub}>Add client contracts to start managing tasks and deliverables.</Text>
            </View>
          ) : (
            projects.map(p => (
              <View key={p.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.projectTitle}>{p.title}</Text>
                    <Text style={s.client}>Client: {p.client}</Text>
                  </View>
                  <View style={[s.badge, p.status === 'Completed' ? s.successBadge : s.activeBadge]}>
                    <Text style={[s.badgeText, p.status === 'Completed' ? s.successText : s.activeText]}>
                      {p.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={s.progressSection}>
                  <View style={s.progressTextRow}>
                    <Text style={s.progressLabel}>Completion Progress</Text>
                    <Text style={s.progressNum}>{p.progress}%</Text>
                  </View>
                  <View style={s.progressBarTrack}>
                    <View style={[s.progressBarFill, { width: `${p.progress}%` }]} />
                  </View>
                </View>

                <View style={s.footer}>
                  <Text style={s.deadline}>Deadline: {p.deadline}</Text>
                  {p.status !== 'Completed' && (
                    <TouchableOpacity style={s.actionBtn} onPress={() => handleUpdateProgress(p.id)}>
                      <Text style={s.actionBtnText}>Update Progress +10%</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050f24' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#0a1c3a', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, gap: 14 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center', paddingHorizontal: 40 },
  card: { backgroundColor: '#0a1c3a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  projectTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  client: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  activeBadge: { backgroundColor: 'rgba(96, 165, 250, 0.15)' },
  successBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  badgeText: { fontSize: 10, fontWeight: '800' },
  activeText: { color: '#60A5FA' },
  successText: { color: '#10B981' },
  progressSection: { marginVertical: 12 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progressLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  progressNum: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  progressBarTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: BRAND_ORANGE },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 10 },
  deadline: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  actionBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  actionBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' }
});
