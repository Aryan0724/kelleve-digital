import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
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
  BookOpen,
  Clock,
  PlayCircle,
  Star,
  Award,
  CheckCircle2,
  Sparkles,
  Users,
} from "lucide-react-native";
import api from "../services/api";

const BRAND_ORANGE = "#E8701A";

interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  level: string;
  price: number;
  thumbnail: string;
  description?: string;
  rating?: number;
  students_count?: number;
}

const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "Mastering Local SEO & Business Discovery",
    instructor: "Vikram Sharma",
    duration: "4.5 Hours",
    level: "Beginner to Advanced",
    price: 0,
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    description:
      "Learn how to rank your local business #1 on search engines, optimize Google maps, and attract high-converting local leads.",
    rating: 4.9,
    students_count: 1420,
  },
  {
    id: 2,
    title: "Digital Marketing Blueprint for Service Providers",
    instructor: "Ananya Patel",
    duration: "6.0 Hours",
    level: "Intermediate",
    price: 499,
    thumbnail:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=800&auto=format&fit=crop",
    description:
      "Step-by-step masterclass on running profitable Meta & Google ads for salons, clinics, repair services, and local agencies.",
    rating: 4.8,
    students_count: 980,
  },
  {
    id: 3,
    title: "Customer Retention & Service Excellence",
    instructor: "Rahul Verma",
    duration: "3.2 Hours",
    level: "All Levels",
    price: 0,
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    description:
      "Turn one-time callers into lifetime loyal clients using proven communication frameworks and reputation management.",
    rating: 4.9,
    students_count: 2150,
  },
];

export default function AcademyScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/truedial/public/academy/courses");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCourses(res.data.data);
      } else {
        setCourses(MOCK_COURSES);
      }
    } catch {
      setCourses(MOCK_COURSES);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (course: Course) => {
    if (enrolledCourseIds.includes(course.id)) {
      Alert.alert("Already Enrolled", "You are already enrolled in this masterclass!");
      return;
    }
    setEnrolledCourseIds((prev) => [...prev, course.id]);
    setSelectedCourse(null);
    Alert.alert(
      "Enrollment Successful 🎉",
      `You have successfully enrolled in "${course.title}". Start learning today!`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#FFFFFF" size={22} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerBadge}>TRUEDIAL ACADEMY</Text>
          <Text style={styles.headerTitle}>Business Growth Courses</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <Sparkles color="#FFD700" size={16} />
            <Text style={styles.heroBadgeText}>PRO LEARNING HUB</Text>
          </View>
          <Text style={styles.heroTitle}>
            Master the Art of <Text style={styles.heroHighlight}>Business Growth</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Learn from verified industry experts how to scale your services, master digital marketing, and dominate your local market.
          </Text>
        </View>

        {/* Course Filter Bar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Masterclasses</Text>
          <Text style={styles.sectionSub}>Handpicked for business owners</Text>
        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={BRAND_ORANGE} />
          </View>
        ) : (
          courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                activeOpacity={0.9}
                onPress={() => setSelectedCourse(course)}
              >
                <View style={styles.imageWrap}>
                  <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{course.level}</Text>
                  </View>
                  <View style={styles.playOverlay}>
                    <PlayCircle color="#FFFFFF" size={44} />
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.categoryRow}>
                    <BookOpen color={BRAND_ORANGE} size={14} />
                    <Text style={styles.categoryText}>Business & Marketing</Text>
                  </View>

                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.instructorText}>Instructor: {course.instructor}</Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Clock color="#94A3B8" size={13} />
                      <Text style={styles.metaText}>{course.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Star color="#EAB308" size={13} fill="#EAB308" />
                      <Text style={styles.metaText}>{course.rating || 4.9}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Users color="#94A3B8" size={13} />
                      <Text style={styles.metaText}>{course.students_count || 1200}+ Learners</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.priceText}>
                      {course.price === 0 ? "FREE" : `₹${course.price}`}
                    </Text>

                    <TouchableOpacity
                      style={[styles.enrollBtn, isEnrolled && styles.enrolledBtn]}
                      onPress={() => (isEnrolled ? null : handleEnroll(course))}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle2 color="#FFFFFF" size={16} />
                          <Text style={styles.enrollBtnText}>Enrolled</Text>
                        </>
                      ) : (
                        <Text style={styles.enrollBtnText}>Enroll Now</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelectedCourse(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedCourse(null)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>

              <Image source={{ uri: selectedCourse.thumbnail }} style={styles.modalImage} />

              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
                <Text style={styles.modalInstructor}>By {selectedCourse.instructor}</Text>
                <Text style={styles.modalDesc}>{selectedCourse.description}</Text>

                <View style={styles.benefitList}>
                  <View style={styles.benefitItem}>
                    <Award color={BRAND_ORANGE} size={18} />
                    <Text style={styles.benefitText}>Certificate of Completion Included</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Clock color={BRAND_ORANGE} size={18} />
                    <Text style={styles.benefitText}>Lifetime Access to Video Lessons</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={() => handleEnroll(selectedCourse)}
                >
                  <Text style={styles.modalConfirmText}>
                    {selectedCourse.price === 0 ? "Enroll Free Now" : `Enroll for ₹${selectedCourse.price}`}
                  </Text>
                </TouchableOpacity>
              </View>
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
    color: BRAND_ORANGE,
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
    borderColor: "rgba(232, 112, 26, 0.3)",
  },
  heroBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  heroHighlight: {
    color: BRAND_ORANGE,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 19,
  },
  sectionHeader: {
    marginBottom: 16,
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
  courseCard: {
    backgroundColor: "#0a1c3a",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  imageWrap: {
    height: 180,
    width: "100%",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  levelBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  categoryText: {
    color: BRAND_ORANGE,
    fontSize: 12,
    fontWeight: "700",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    lineHeight: 22,
  },
  instructorText: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  enrollBtn: {
    backgroundColor: BRAND_ORANGE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  enrolledBtn: {
    backgroundColor: "#16A34A",
  },
  enrollBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
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
    overflow: "hidden",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  modalImage: {
    width: "100%",
    height: 180,
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  modalInstructor: {
    fontSize: 13,
    color: BRAND_ORANGE,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalDesc: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 20,
  },
  benefitList: {
    gap: 10,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
  modalConfirmBtn: {
    backgroundColor: BRAND_ORANGE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
