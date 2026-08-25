import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Star, MessageSquare, Building2, ThumbsUp } from "lucide-react-native";
import api from "../../../services/api";

const BRAND_ORANGE = "#E8701A";

interface UserReview {
  id: number;
  business_name: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
  helpful_count?: number;
  vendor_reply?: string;
}

const MOCK_USER_REVIEWS: UserReview[] = [
  {
    id: 1,
    business_name: "Godrej Interio",
    rating: 5,
    title: "Outstanding Quality & On-Time Delivery!",
    body: "Purchased a complete modular kitchen setup. The staff was professional and installed everything within 3 days.",
    created_at: "2026-08-10",
    helpful_count: 14,
    vendor_reply: "Thank you so much for your feedback! Glad you liked the modular kitchen.",
  },
  {
    id: 2,
    business_name: "Apollo Clinic & Diagnostics",
    rating: 4,
    title: "Fast Diagnostics & Clean Environment",
    body: "Got full body checkup done. Report was delivered digitally on WhatsApp within 24 hours.",
    created_at: "2026-08-01",
    helpful_count: 8,
  },
];

export default function UserReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserReviews = useCallback(async () => {
    try {
      const res = await api.get("/truedial/user/reviews");
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      } else {
        setReviews(MOCK_USER_REVIEWS);
      }
    } catch {
      setReviews(MOCK_USER_REVIEWS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserReviews();
  }, [fetchUserReviews]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserReviews();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        color={i < rating ? "#EAB308" : "#475569"}
        fill={i < rating ? "#EAB308" : "transparent"}
        style={{ marginRight: 2 }}
      />
    ));
  };

  const renderItem = ({ item }: { item: UserReview }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.businessRow}>
          <Building2 color={BRAND_ORANGE} size={16} />
          <Text style={styles.businessName}>{item.business_name}</Text>
        </View>
        <Text style={styles.dateText}>{item.created_at}</Text>
      </View>

      <View style={styles.ratingRow}>{renderStars(item.rating)}</View>

      <Text style={styles.reviewTitle}>{item.title}</Text>
      <Text style={styles.reviewBody}>{item.body}</Text>

      {item.helpful_count !== undefined && (
        <View style={styles.helpfulRow}>
          <ThumbsUp color="#94A3B8" size={13} />
          <Text style={styles.helpfulText}>{item.helpful_count} people found this helpful</Text>
        </View>
      )}

      {item.vendor_reply && (
        <View style={styles.replyBox}>
          <View style={styles.replyHeader}>
            <MessageSquare color={BRAND_ORANGE} size={13} />
            <Text style={styles.replyTitle}>Owner Response</Text>
          </View>
          <Text style={styles.replyText}>{item.vendor_reply}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reviews & Ratings</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={BRAND_ORANGE} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND_ORANGE} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Star size={48} color="#475569" />
              <Text style={styles.emptyText}>You haven't submitted any reviews yet.</Text>
            </View>
          }
        />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  loaderWrap: {
    paddingVertical: 60,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#0a1c3a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  businessRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  dateText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  reviewBody: {
    fontSize: 13,
    color: "#CBD5E1",
    lineHeight: 19,
    marginBottom: 10,
  },
  helpfulRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  helpfulText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  replyBox: {
    backgroundColor: "rgba(232, 112, 26, 0.1)",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: BRAND_ORANGE,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  replyTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_ORANGE,
  },
  replyText: {
    fontSize: 12,
    color: "#E2E8F0",
    lineHeight: 17,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#94A3B8",
    marginTop: 12,
    fontSize: 14,
  },
});
