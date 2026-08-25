import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Clock, Tag, Share2, Sparkles } from "lucide-react-native";
import { BLOG_DATA } from "./index";

const BRAND_ORANGE = "#E8701A";

export default function BlogDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const blog = BLOG_DATA.find((b) => b.slug === slug) || BLOG_DATA[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#FFFFFF" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {blog.title}
        </Text>
        <TouchableOpacity style={styles.backBtn}>
          <Share2 color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Category & Title */}
        <View style={styles.categoryRow}>
          <Tag color={BRAND_ORANGE} size={14} />
          <Text style={styles.categoryText}>{blog.category}</Text>
        </View>

        <Text style={styles.title}>{blog.title}</Text>

        {/* Author Header */}
        <View style={styles.authorHeader}>
          <Image source={{ uri: blog.authorAvatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.authorName}>{blog.author}</Text>
            <View style={styles.dateRow}>
              <Clock color="#94A3B8" size={12} />
              <Text style={styles.dateText}>
                {blog.date} • {blog.readTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Hero Image */}
        <Image source={{ uri: blog.imageUrl }} style={styles.coverImage} />

        {/* Content Body */}
        <Text style={styles.contentBody}>{blog.content}</Text>

        {/* Call To Action Box */}
        <View style={styles.ctaBox}>
          <View style={styles.ctaBadgeRow}>
            <Sparkles color="#FFD700" size={16} />
            <Text style={styles.ctaBadgeText}>GROW YOUR BUSINESS</Text>
          </View>
          <Text style={styles.ctaTitle}>Want 100+ new customers every month?</Text>
          <Text style={styles.ctaSub}>
            List your business on TrueDial today to get verified, boost local SEO, and manage inquiries.
          </Text>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push("/list-business" as any)}
          >
            <Text style={styles.ctaBtnText}>List Your Business Free</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
  scrollContent: {
    padding: 18,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  categoryText: {
    color: BRAND_ORANGE,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 28,
    marginBottom: 16,
  },
  authorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  dateText: {
    color: "#94A3B8",
    fontSize: 12,
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  contentBody: {
    fontSize: 14,
    color: "#E2E8F0",
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaBox: {
    backgroundColor: "#0a1c3a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(232, 112, 26, 0.4)",
    marginBottom: 20,
  },
  ctaBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  ctaBadgeText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  ctaSub: {
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaBtn: {
    backgroundColor: BRAND_ORANGE,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  ctaBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
