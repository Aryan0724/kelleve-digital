/**
 * Job Board
 * Unique tab for: Worker / Automotive vendors (Plumber, Electrician, Carpenter, Mechanic, etc.)
 * Ported from: truedial-frontend/src/app/dashboard/vendor/jobs/page.tsx
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Briefcase, MapPin, Clock, IndianRupee, Star, CheckCircle, Power, Phone } from 'lucide-react-native';
import api from '../../../services/api';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    Pending:   { bg: '#FEF3C7', text: '#D97706' },
    Accepted:  { bg: '#DBEAFE', text: '#2563EB' },
    Completed: { bg: '#D1FAE5', text: '#059669' },
    Declined:  { bg: '#FEE2E2', text: '#DC2626' },
  };
  const c = map[status] || { bg: '#F1F5F9', text: '#64748B' };
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
      <Text style={{ color: c.text, fontSize: 11, fontWeight: '700' }}>{status}</Text>
    </View>
  );
}

export default function JobBoardScreen() {
  const router = useRouter();
  const [online, setOnline] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Completed'>('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/job-requests');
      setJobs(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: number, status: string) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));

  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Briefcase size={20} color="#E8701A" />
          <Text style={s.headerTitle}>Job Board</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 2 }}>
          <Switch
            value={online}
            onValueChange={setOnline}
            trackColor={{ false: '#CBD5E1', true: '#10B981' }}
            thumbColor="white"
          />
          <Text style={{ fontSize: 9, fontWeight: '700', color: online ? '#10B981' : '#94A3B8' }}>
            {online ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </View>
      </View>

      {/* Online Banner */}
      <View style={[s.banner, { backgroundColor: online ? '#ECFDF5' : '#F8FAFC', borderColor: online ? '#A7F3D0' : '#E2E8F0' }]}>
        <View style={[s.statusDot, { backgroundColor: online ? '#10B981' : '#CBD5E1' }]} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: '#1E293B', fontSize: 14 }}>
            {online ? 'You are ONLINE' : 'You are OFFLINE'}
          </Text>
          <Text style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>
            {online
              ? 'Customers within 15km can see and book you'
              : 'Your profile is hidden from instant booking'}
          </Text>
        </View>
        <View style={s.earnBadge}>
          <IndianRupee size={12} color="#E8701A" />
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#E8701A' }}>
            {jobs.filter(j => j.status === 'Completed').length * 800}
          </Text>
          <Text style={{ fontSize: 9, color: '#94A3B8' }}>earned</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {(['All', 'Pending', 'Accepted', 'Completed'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filterTab, filter === f && s.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[s.filterLabel, filter === f && s.filterLabelActive]}>
              {f === 'All' ? `All (${jobs.length})` :
               f === 'Pending' ? `Pending (${jobs.filter(j => j.status === 'Pending').length})` :
               f === 'Accepted' ? `Active (${jobs.filter(j => j.status === 'Accepted').length})` :
               `Done (${jobs.filter(j => j.status === 'Completed').length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Job List */}
      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop: 40}}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <CheckCircle size={48} color="#D1FAE5" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B', marginTop: 12 }}>No jobs found</Text>
            </View>
          ) : (
            filtered.map(job => (
              <View key={job.id} style={s.card}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <Text style={s.jobTitle}>{job.title}</Text>
                      {job.urgency === 'Urgent' && (
                        <View style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#DC2626' }}>⚡ URGENT</Text>
                        </View>
                      )}
                    </View>
                </View>
                <Text style={s.customerName}>{job.customer}</Text>
              </View>
              <StatusBadge status={job.status} />
            </View>

            <View style={s.cardMeta}>
              <View style={s.metaItem}><MapPin size={12} color="#94A3B8" /><Text style={s.metaText}>{job.address}</Text></View>
              <View style={s.metaItem}><Clock size={12} color="#94A3B8" /><Text style={s.metaText}>{job.date}</Text></View>
              <View style={s.metaItem}>
                <IndianRupee size={12} color="#10B981" />
                <Text style={[s.metaText, { color: '#10B981', fontWeight: '700' }]}>{job.budget}</Text>
                <Text style={s.distanceText}>• {job.distance}</Text>
              </View>
            </View>

            <View style={s.cardFooter}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {job.status === 'Pending' && (
                  <>
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#10B981', flex: 2 }]} onPress={() => updateStatus(job.id, 'Accepted')}>
                      <CheckCircle size={14} color="white" />
                      <Text style={s.btnText}>Accept Job</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA', flex: 1 }]} onPress={() => updateStatus(job.id, 'Declined')}>
                      <Text style={[s.btnText, { color: '#DC2626' }]}>Decline</Text>
                    </TouchableOpacity>
                  </>
                )}
                {job.status === 'Accepted' && (
                  <>
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#DBEAFE', flex: 2 }]} onPress={() => updateStatus(job.id, 'Completed')}>
                      <Star size={14} color="#2563EB" />
                      <Text style={[s.btnText, { color: '#2563EB' }]}>Mark Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', flex: 1 }]}>
                      <Phone size={14} color="#64748B" />
                      <Text style={[s.btnText, { color: '#64748B' }]}>Call</Text>
                    </TouchableOpacity>
                  </>
                )}
                {job.status === 'Completed' && (
                  <View style={[s.btn, { backgroundColor: '#D1FAE5', flex: 1 }]}>
                    <CheckCircle size={14} color="#059669" />
                    <Text style={[s.btnText, { color: '#059669' }]}>Completed ✓</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 14, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, margin: 16, padding: 14, borderRadius: 16, borderWidth: 1 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  earnBadge: { alignItems: 'center', backgroundColor: '#FFF7ED', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#FED7AA' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 4 },
  filterTab: { flex: 1, paddingVertical: 8, paddingHorizontal: 4, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#E8701A' },
  filterLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', textAlign: 'center' },
  filterLabelActive: { color: 'white' },
  card: {
    backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0',
    overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 14, paddingBottom: 8 },
  jobTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  customerName: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  cardMeta: { paddingHorizontal: 14, paddingBottom: 12, gap: 5 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: '#64748B' },
  distanceText: { fontSize: 12, color: '#94A3B8' },
  cardFooter: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 12 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 10 },
  btnText: { fontSize: 13, fontWeight: '700', color: 'white' },
});
