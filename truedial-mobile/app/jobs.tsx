import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Building2,
  IndianRupee,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react-native";
import api from "../services/api";

const BRAND_ORANGE = "#E8701A";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted_at: string;
  description?: string;
  requirements?: string[];
}

const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Marketing Manager",
    company: "Kelleve Digital",
    location: "Patna / Remote",
    type: "Full-Time",
    salary: "₹45,000 - ₹60,000 / mo",
    posted_at: "2 days ago",
    description:
      "Looking for an experienced marketing manager to drive local B2B campaigns and manage vendor acquisition.",
    requirements: [
      "3+ years in B2B marketing",
      "Proficient in Meta Ads & Local SEO",
      "Strong team management skills",
    ],
  },
  {
    id: 2,
    title: "Customer Support Specialist",
    company: "TrueDial Care",
    location: "Muzaffarpur",
    type: "Full-Time",
    salary: "₹18,000 - ₹25,000 / mo",
    posted_at: "1 day ago",
    description:
      "Assist business owners with listing setup, privilege card inquiries, and client support.",
    requirements: [
      "Fluent in Hindi & English",
      "Good communication skills",
      "Basic computer proficiency",
    ],
  },
  {
    id: 3,
    title: "Field Sales Executive",
    company: "TrueDial Business Network",
    location: "Gaya / Bhagalpur",
    type: "Full-Time + Commission",
    salary: "₹25,000 - ₹35,000 / mo",
    posted_at: "3 days ago",
    description:
      "Onboard local shops, restaurants, salons, and clinics to the TrueDial growth platform.",
    requirements: [
      "Own vehicle required",
      "High energy and sales drive",
      "Freshers welcome",
    ],
  },
];

export default function JobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/truedial/public/jobs");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setJobs(res.data.data);
      } else {
        setJobs(MOCK_JOBS);
      }
    } catch {
      setJobs(MOCK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = (job: Job) => {
    if (!applicantName.trim() || !applicantPhone.trim()) {
      Alert.alert("Missing Details", "Please enter your full name and phone number to submit application.");
      return;
    }
    setAppliedJobIds((prev) => [...prev, job.id]);
    setSelectedJob(null);
    setApplicantName("");
    setApplicantPhone("");
    Alert.alert(
      "Application Sent 🚀",
      `Your application for "${job.title}" at ${job.company} has been submitted successfully!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#FFFFFF" size={22} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerBadge}>TRUEDIAL CAREERS</Text>
          <Text style={styles.headerTitle}>Job Board & Hiring</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Header Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <Sparkles color="#60A5FA" size={16} />
            <Text style={styles.heroBadgeText}>VERIFIED LOCAL JOBS</Text>
          </View>
          <Text style={styles.heroTitle}>
            Find Your Next <Text style={{ color: "#60A5FA" }}>Career Move</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Direct hiring from verified businesses, agencies, and companies across India.
          </Text>

          <View style={styles.searchBar}>
            <Search color="#94A3B8" size={18} />
            <TextInput
              placeholder="Search job title, company, or city..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Job Openings</Text>
          <Text style={styles.sectionSub}>{filteredJobs.length} openings found</Text>
        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#60A5FA" />
          </View>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            return (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.companyRow}>
                      <Building2 color="#94A3B8" size={13} />
                      <Text style={styles.companyName}>{job.company}</Text>
                    </View>
                  </View>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{job.type}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MapPin color="#94A3B8" size={13} />
                    <Text style={styles.metaText}>{job.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <IndianRupee color="#60A5FA" size={13} />
                    <Text style={styles.salaryText}>{job.salary}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.postedRow}>
                    <Clock color="#64748B" size={12} />
                    <Text style={styles.postedText}>{job.posted_at}</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.applyBtn, isApplied && styles.appliedBtn]}
                    onPress={() => (isApplied ? null : setSelectedJob(job))}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 color="#FFFFFF" size={15} />
                        <Text style={styles.applyBtnText}>Applied</Text>
                      </>
                    ) : (
                      <Text style={styles.applyBtnText}>Apply Now</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Application Modal */}
      {selectedJob && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelectedJob(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedJob(null)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>

              <ScrollView style={{ padding: 20 }}>
                <Text style={styles.modalJobTitle}>{selectedJob.title}</Text>
                <Text style={styles.modalCompany}>{selectedJob.company} • {selectedJob.location}</Text>

                <Text style={styles.modalSectionTitle}>Job Description</Text>
                <Text style={styles.modalDesc}>{selectedJob.description}</Text>

                {selectedJob.requirements && (
                  <>
                    <Text style={styles.modalSectionTitle}>Key Requirements</Text>
                    {selectedJob.requirements.map((req, idx) => (
                      <View key={idx} style={styles.reqItem}>
                        <CheckCircle2 color="#60A5FA" size={14} />
                        <Text style={styles.reqText}>{req}</Text>
                      </View>
                    ))}
                  </>
                )}

                <Text style={[styles.modalSectionTitle, { marginTop: 20 }]}>Quick Application</Text>
                <TextInput
                  placeholder="Your Full Name"
                  placeholderTextColor="#94A3B8"
                  style={styles.inputField}
                  value={applicantName}
                  onChangeText={setApplicantName}
                />
                <TextInput
                  placeholder="Your Phone Number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  style={styles.inputField}
                  value={applicantPhone}
                  onChangeText={setApplicantPhone}
                />

                <TouchableOpacity
                  style={styles.submitApplyBtn}
                  onPress={() => handleApply(selectedJob)}
                >
                  <Text style={styles.submitApplyText}>Submit Application</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050f24",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#0a1c3a",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    alignItems: "center",
  },
  headerBadge: {
    color: "#60A5FA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: "#0a1c3a",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.3)",
  },
  heroBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: "#60A5FA",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sectionSub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  loaderWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  jobCard: {
    backgroundColor: "#0a1c3a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  companyName: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  typeBadge: {
    backgroundColor: "rgba(96, 165, 250, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: "#60A5FA",
    fontSize: 11,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#CBD5E1",
    fontSize: 12,
  },
  salaryText: {
    color: "#60A5FA",
    fontSize: 12,
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  postedText: {
    color: "#64748B",
    fontSize: 11,
  },
  applyBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  appliedBtn: {
    backgroundColor: "#16A34A",
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0a1c3a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  modalJobTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    marginTop: 10,
  },
  modalCompany: {
    fontSize: 13,
    color: "#60A5FA",
    fontWeight: "600",
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    marginTop: 10,
  },
  modalDesc: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 19,
    marginBottom: 12,
  },
  reqItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  reqText: {
    color: "#CBD5E1",
    fontSize: 13,
  },
  inputField: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    color: "#FFFFFF",
    fontSize: 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  submitApplyBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  submitApplyText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
