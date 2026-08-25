import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Search,
  Clock,
  Tag,
  TrendingUp,
  ChevronRight,
  BookOpen,
} from "lucide-react-native";

const BRAND_ORANGE = "#E8701A";

export interface BlogItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  imageUrl: string;
  content: string;
}

export const BLOG_DATA: BlogItem[] = [
  {
    id: 1,
    slug: "10-proven-ways-to-get-more-local-customers",
    title: "10 Proven Ways to Get More Local Customers in 2026",
    excerpt:
      "Discover actionable strategies for local business owners to rank higher on search directories, generate WhatsApp inquiries, and build trust.",
    category: "Marketing & Sales",
    author: "Amit Roy",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    date: "Aug 22, 2026",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    content: `Growing a local service or retail business in India requires a smart mix of digital presence and word-of-mouth trust. Here are 10 battle-tested steps:

1. Optimize Your TrueDial Listing: Complete 100% of your business details including GST, working hours, and high-resolution photo galleries.
2. Leverage WhatsApp Instant Booking: Enable direct WhatsApp links on your business profile to allow instant quotes.
3. Offer Privilege Card Discounts: Join the TrueDial Privilege Card network to attract high-value repeat customers.
4. Encourage Authentic Customer Reviews: Reply promptly to every customer review to boost trust scores.
5. Publish Weekly Offers: Keep your deals fresh to stay on top of category searches.`,
  },
  {
    id: 2,
    slug: "how-privilege-cards-increase-repeat-footfall",
    title: "How Privilege Cards Increase Repeat Footfall by 40%",
    excerpt:
      "Learn why digital loyalty cards are replacing traditional paper coupons for restaurants, salons, and medical clinics.",
    category: "Customer Growth",
    author: "Priya Sharma",
    authorAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    date: "Aug 19, 2026",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop",
    content: `Customer retention is 5x cheaper than acquiring new leads. Loyalty programs built directly into TrueDial allow vendors to issue digital privilege passes.

Benefits of Digital Privilege Cards:
• Zero printing cost - 100% digital QR pass on mobile.
• Instant verification at cashier counters.
• Automated SMS & WhatsApp notifications for milestone rewards.`,
  },
  {
    id: 3,
    slug: "local-seo-guide-for-clinics-and-repair-shops",
    title: "Local SEO Guide for Clinics, Salons & Repair Shops",
    excerpt:
      "Complete checklist to capture voice searches, map directions, and phone leads in your city.",
    category: "SEO & Growth",
    author: "Rahul Verma",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    date: "Aug 14, 2026",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?q=80&w=800&auto=format&fit=crop",
    content: `When someone searches for "best dentist near me" or "laptop repair in Patna", speed and accuracy win the client.

Key checklist:
- Exact business name, address, and phone number consistency across all web properties.
- Category tags matching specific services (e.g. Root Canal vs General Dentistry).
- High rating average (4.5+ stars).`,
  },
];

export default function BlogListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Marketing & Sales", "Customer Growth", "SEO & Growth"];

  const filteredBlogs = BLOG_DATA.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#FFFFFF" size={22} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerBadge}>TRUEDIAL BLOG</Text>
          <Text style={styles.headerTitle}>Business Guides & Tips</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <TrendingUp color={BRAND_ORANGE} size={16} />
            <Text style={styles.heroBadgeText}>GROWTH & INSIGHTS</Text>
          </View>
          <Text style={styles.heroTitle}>
            Strategies to Grow Your <Text style={{ color: BRAND_ORANGE }}>Business</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Expert guides, marketing tactics, and local SEO strategies to dominate your local market.
          </Text>

          <View style={styles.searchBar}>
            <Search color="#94A3B8" size={18} />
            <TextInput
              placeholder="Search guides, marketing tips..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.activeChip]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.activeChipText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Blog Cards */}
        {filteredBlogs.map((blog) => (
          <TouchableOpacity
            key={blog.id}
            style={styles.blogCard}
            activeOpacity={0.9}
            onPress={() => router.push(`/blog/${blog.slug}` as any)}
          >
            <Image source={{ uri: blog.imageUrl }} style={styles.blogImage} />
            <View style={styles.cardBody}>
              <View style={styles.categoryRow}>
                <Tag color={BRAND_ORANGE} size={12} />
                <Text style={styles.categoryText}>{blog.category}</Text>
              </View>

              <Text style={styles.blogTitle}>{blog.title}</Text>
              <Text style={styles.blogExcerpt} numberOfLines={2}>
                {blog.excerpt}
              </Text>

              <View style={styles.authorRow}>
                <Image source={{ uri: blog.authorAvatar }} style={styles.authorAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.authorName}>{blog.author}</Text>
                  <Text style={styles.dateText}>
                    {blog.date} • {blog.readTime}
                  </Text>
                </View>
                <ChevronRight color={BRAND_ORANGE} size={18} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(232, 112, 26, 0.3)",
  },
  heroBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: BRAND_ORANGE,
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
  chipScroll: {
    marginBottom: 16,
  },
  chip: {
    backgroundColor: "#0a1c3a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: BRAND_ORANGE,
    borderColor: BRAND_ORANGE,
  },
  chipText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  activeChipText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  blogCard: {
    backgroundColor: "#0a1c3a",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  blogImage: {
    width: "100%",
    height: 170,
    resizeMode: "cover",
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
  blogTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    lineHeight: 22,
  },
  blogExcerpt: {
    fontSize: 12,
    color: "#CBD5E1",
    lineHeight: 18,
    marginBottom: 14,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  authorName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  dateText: {
    color: "#94A3B8",
    fontSize: 11,
  },
});
