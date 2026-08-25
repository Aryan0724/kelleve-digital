/**
 * Vendor Job & RFQ Lead Dispatch Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Briefcase, MapPin, Clock, IndianRupee, Phone, CheckCircle, Star } from 'lucide-react-native';
import api from '../../../services/api';

export default function VendorJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/truedial/vendor/jobs');
      setJobs(res.data?.data || res.data || []);
    } catch {
      setJobs([
        {
          id: 101,
          title: "Full Home Interior Work",
          customer: "Rajesh Kumar",
          budget: "₹3,50,000",
          address: "Boring Road, Patna",
          date: "Aug 26, 2026",
          status: "Pending",
          urgency: "Urgent",
          distance: "2.4 km away",
        },
        {
          id: 102,
          title: "AC Repair & Maintenance",
          customer: "Sanjay Singh",
          budget: "₹1,800",
          address: "Kankarbagh, Patna",
          date: "Aug 25, 2026",
          status: "Accepted",
          urgency: "Normal",
          distance: "4.1 km away",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id: number, status: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Briefcase size={20} color="#E8701A" />
          <Text style={s.headerTitle}>Job Dispatch & RFQs</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 14 }}>
          {jobs.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <CheckCircle size={48} color="#10B981" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginTop: 12 }}>No jobs dispatched yet.</Text>
            </View>
          ) : (
            jobs.map(job => (
              <View key={job.id} style={s.card}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Text style={s.jobTitle}>{job.title}</Text>
                      {job.urgency === 'Urgent' && (
                        <View style={s.urgentBadge}>
                          <Text style={s.urgentText}>⚡ URGENT</Text>
                        </View>
                      )}
                    </View>
                    <Text style={s.customerName}>{job.customer}</Text>
                  </View>
                  <Text style={s.statusText}>{job.status}</Text>
                </View>

                <View style={s.cardMeta}>
                  <View style={s.metaItem}><MapPin size={12} color="#94A3B8" /><Text style={s.metaText}>{job.address}</Text></View>
                  <View style={s.metaItem}><Clock size={12} color="#94A3B8" /><Text style={s.metaText}>{job.date}</Text></View>
                  <View style={s.metaItem}>
                    <IndianRupee size={12} color="#10B981" />
                    <Text style={[s.metaText, { color: '#10B981', fontWeight: '700' }]}>{job.budget}</Text>
                    <Text style={s.distanceText}> • {job.distance}</Text>
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
                        <TouchableOpacity style={[s.btn, { backgroundColor: 'rgba(239, 68, 68, 0.2)', flex: 1 }]} onPress={() => updateStatus(job.id, 'Declined')}>
                          <Text style={[s.btnText, { color: '#EF4444' }]}>Decline</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {job.status === 'Accepted' && (
                      <>
                        <TouchableOpacity style={[s.btn, { backgroundColor: '#2563EB', flex: 2 }]} onPress={() => updateStatus(job.id, 'Completed')}>
                          <Star size={14} color="white" />
                          <Text style={s.btnText}>Mark Complete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.btn, { backgroundColor: 'rgba(255,255,255,0.1)', flex: 1 }]}>
                          <Phone size={14} color="#FFFFFF" />
                          <Text style={[s.btnText, { color: '#FFFFFF' }]}>Call</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {job.status === 'Completed' && (
                      <View style={[s.btn, { backgroundColor: '#10B981', flex: 1 }]}>
                        <CheckCircle size={14} color="white" />
                        <Text style={s.btnText}>Completed ✓</Text>
                      </View>
                    )}
                  </View>
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
  card: { backgroundColor: '#0a1c3a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  jobTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  customerName: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  urgentBadge: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  urgentText: { fontSize: 10, fontWeight: '800', color: '#F87171' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#60A5FA' },
  cardMeta: { gap: 4, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginVertical: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#CBD5E1' },
  distanceText: { fontSize: 11, color: '#94A3B8' },
  cardFooter: { paddingTop: 6 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 10 },
  btnText: { fontSize: 12, fontWeight: '700', color: 'white' },
});
