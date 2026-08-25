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
  Newspaper,
  Radio,
  Calendar,
  ArrowRight,
  Play,
  Pause,
  Sparkles,
} from "lucide-react-native";
import api from "../services/api";

const BRAND_ORANGE = "#E8701A";

interface Article {
  id: number;
  title: string;
  category: "News" | "Podcast" | "Market Insights";
  published_at: string;
  excerpt: string;
  image: string;
  content?: string;
  audio_url?: string;
}

const MOCK_NEWS: Article[] = [
  {
    id: 1,
    title: "GST Updates 2026: Impact on Local Retail & Service Sector",
    category: "News",
    published_at: "2026-08-20",
    excerpt:
      "New tax simplified structures for SMBs and key compliance updates every business owner must know.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
    content:
      "The Finance Ministry has announced key simplifications for small and medium enterprises (SMEs) with turnover under 2 Crores. This guide breaks down quarterly filing requirements and input tax credit changes.",
  },
  {
    id: 2,
    title: "Podcast Ep. 42: How Muzaffarpur's Top Restaurant Scaled 5x",
    category: "Podcast",
    published_at: "2026-08-18",
    excerpt:
      "Exclusive interview with Founder Rajesh Kumar on customer loyalty, digital menus, and TrueDial privilege cards.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    content:
      "In this episode, we chat with Rajesh Kumar about building a local dining empire, training staff, and driving repeat orders.",
  },
  {
    id: 3,
    title: "Tier 2 & 3 Cities Driving India's Digital Business Boom",
    category: "Market Insights",
    published_at: "2026-08-15",
    excerpt:
      "Over 65% of new online service bookings now originate outside metro hubs like Delhi & Mumbai.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    content:
      "Hyperlocal discovery platforms like TrueDial are empowering regional businesses across Bihar, Jharkhand, and UP to capture high-intent digital clients.",
  },
];

export default function NewsScreen() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await api.get("/truedial/public/news");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setArticles(res.data.data);
      } else {
        setArticles(MOCK_NEWS);
      }
    } catch {
      setArticles(MOCK_NEWS);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(
    (a) => activeCategory === "All" || a.category === activeCategory
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color="#FFFFFF" size={22} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerBadge}>TRUEDIAL MEDIA</Text>
          <Text style={styles.headerTitle}>News & Podcasts</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <Sparkles color="#FFD700" size={16} />
            <Text style={styles.heroBadgeText}>MARKET INSIGHTS</Text>
          </View>
          <Text style={styles.heroTitle}>
            Stay Ahead of the <Text style={{ color: BRAND_ORANGE }}>Market</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Latest business insights, regulatory updates, and exclusive interviews with industry leaders.
          </Text>
        </View>

        {/* Category Filter Chips */}
        <View style={styles.chipRow}>
          {["All", "News", "Podcast", "Market Insights"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.activeChip]}
              onPress={() => setActiveCategory(cat)}
            >
              {cat === "Podcast" && <Radio color={activeCategory === cat ? "#FFFFFF" : BRAND_ORANGE} size={13} />}
              <Text style={[styles.chipText, activeCategory === cat && styles.activeChipText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={BRAND_ORANGE} />
          </View>
        ) : (
          filteredArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              activeOpacity={0.9}
              onPress={() => setSelectedArticle(article)}
            >
              <View style={styles.imageWrap}>
                <Image source={{ uri: article.image }} style={styles.articleImage} />
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{article.category}</Text>
                </View>
                {article.category === "Podcast" && (
                  <View style={styles.podcastOverlay}>
                    <Radio color="#FFFFFF" size={32} />
                  </View>
                )}
              </View>

              <View style={styles.cardBody}>
                <View style={styles.dateRow}>
                  <Calendar color="#94A3B8" size={13} />
                  <Text style={styles.dateText}>{article.published_at}</Text>
                </View>

                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleExcerpt} numberOfLines={2}>
                  {article.excerpt}
                </Text>

                <View style={styles.readMoreRow}>
                  <Text style={styles.readMoreText}>
                    {article.category === "Podcast" ? "Listen Now" : "Read Article"}
                  </Text>
                  <ArrowRight color={BRAND_ORANGE} size={14} />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Detail Modal */}
      {selectedArticle && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setSelectedArticle(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedArticle(null)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>

              <Image source={{ uri: selectedArticle.image }} style={styles.modalImage} />

              <ScrollView style={{ padding: 20 }}>
                <Text style={styles.modalCategory}>{selectedArticle.category}</Text>
                <Text style={styles.modalArticleTitle}>{selectedArticle.title}</Text>
                <Text style={styles.modalDate}>Published {selectedArticle.published_at}</Text>

                {selectedArticle.category === "Podcast" && (
                  <TouchableOpacity
                    style={styles.playerBar}
                    onPress={() => {
                      setIsPlayingPodcast(!isPlayingPodcast);
                      Alert.alert(
                        isPlayingPodcast ? "Audio Paused" : "Playing Podcast 🎧",
                        "Streaming TrueDial business episode..."
                      );
                    }}
                  >
                    {isPlayingPodcast ? <Pause color="#FFFFFF" size={24} /> : <Play color="#FFFFFF" size={24} />}
                    <Text style={styles.playerText}>
                      {isPlayingPodcast ? "Pause Podcast Episode" : "Play Podcast Episode (18 mins)"}
                    </Text>
                  </TouchableOpacity>
                )}

                <Text style={styles.modalArticleContent}>
                  {selectedArticle.content || selectedArticle.excerpt}
                </Text>
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
    color: "#FFD700",
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
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#0a1c3a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
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
  loaderWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  articleCard: {
    backgroundColor: "#0a1c3a",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  imageWrap: {
    height: 170,
    width: "100%",
    position: "relative",
  },
  articleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  catBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  podcastOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  dateText: {
    color: "#94A3B8",
    fontSize: 11,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    lineHeight: 22,
  },
  articleExcerpt: {
    fontSize: 12,
    color: "#CBD5E1",
    lineHeight: 18,
    marginBottom: 12,
  },
  readMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readMoreText: {
    color: BRAND_ORANGE,
    fontSize: 13,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
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
  modalCategory: {
    color: BRAND_ORANGE,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  modalArticleTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  modalDate: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 16,
  },
  playerBar: {
    backgroundColor: BRAND_ORANGE,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  playerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  modalArticleContent: {
    fontSize: 14,
    color: "#E2E8F0",
    lineHeight: 22,
    marginBottom: 20,
  },
});
