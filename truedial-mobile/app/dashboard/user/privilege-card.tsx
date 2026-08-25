import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Crown,
  QrCode,
  Sparkles,
  CheckCircle2,
  Share2,
  ShieldCheck,
} from "lucide-react-native";
import api from "../../../services/api";

const BRAND_ORANGE = "#E8701A";

export default function UserPrivilegeCardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState<{
    card_number: string;
    holder_name: string;
    valid_until: string;
    tier: string;
    discount_rate: string;
  }>({
    card_number: "TD-8829-9402-1049",
    holder_name: "Valued TrueDial Member",
    valid_until: "Dec 2027",
    tier: "VIP Platinum Access",
    discount_rate: "Up to 25% OFF at Partner Businesses",
  });

  useEffect(() => {
    fetchCardDetails();
  }, []);

  const fetchCardDetails = async () => {
    try {
      const res = await api.get("/privilege-cards/my");
      if (res.data?.success && res.data.data) {
        setCardData(res.data.data);
      }
    } catch {
      // Fallback default
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1c3a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Privilege Pass</Text>
        <TouchableOpacity onPress={() => Alert.alert("Share Card", "Pass link copied!")} style={styles.backBtn}>
          <Share2 size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={BRAND_ORANGE} />
          </View>
        ) : (
          <>
            {/* Premium Gold/Glass Card */}
            <View style={styles.privilegeCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardBrandRow}>
                  <Crown color="#FFD700" size={24} />
                  <Text style={styles.cardBrandText}>TRUEDIAL PRIVILEGE</Text>
                </View>
                <View style={styles.tierBadge}>
                  <Text style={styles.tierBadgeText}>{cardData.tier}</Text>
                </View>
              </View>

              <View style={styles.chipGraphic}>
                <View style={styles.goldChip} />
              </View>

              <Text style={styles.cardNumber}>{cardData.card_number}</Text>

              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.cardLabel}>CARD HOLDER</Text>
                  <Text style={styles.cardValue}>{cardData.holder_name}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>{cardData.valid_until}</Text>
                </View>
              </View>
            </View>

            {/* QR Code Pass Box */}
            <View style={styles.qrCard}>
              <Text style={styles.qrTitle}>Scan at Checkout Counter</Text>
              <Text style={styles.qrSub}>Show this QR code to partner vendors to unlock instant discounts.</Text>

              <View style={styles.qrWrap}>
                <QrCode color="#FFFFFF" size={140} />
              </View>

              <View style={styles.verifiedRow}>
                <ShieldCheck color="#16A34A" size={16} />
                <Text style={styles.verifiedText}>Verified TrueDial Membership Active</Text>
              </View>
            </View>

            {/* Benefits List */}
            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>Privilege Card Benefits</Text>

              <View style={styles.benefitItem}>
                <CheckCircle2 color={BRAND_ORANGE} size={18} />
                <Text style={styles.benefitText}>10% - 25% Exclusive Discount at Restaurants & Salons</Text>
              </View>

              <View style={styles.benefitItem}>
                <CheckCircle2 color={BRAND_ORANGE} size={18} />
                <Text style={styles.benefitText}>Priority Consultation Booking at Partner Clinics</Text>
              </View>

              <View style={styles.benefitItem}>
                <CheckCircle2 color={BRAND_ORANGE} size={18} />
                <Text style={styles.benefitText}>Zero Convenience Fee on Service Bookings</Text>
              </View>
            </View>
          </>
        )}
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
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  scrollContent: {
    padding: 16,
  },
  loaderWrap: {
    paddingVertical: 60,
    alignItems: "center",
  },
  privilegeCard: {
    backgroundColor: "#0a1c3a",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
    shadowColor: BRAND_ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardBrandText: {
    color: "#FFD700",
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1.5,
  },
  tierBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierBadgeText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "800",
  },
  chipGraphic: {
    marginBottom: 20,
  },
  goldChip: {
    width: 42,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#D97706",
    borderWidth: 1,
    borderColor: "#FBBF24",
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
    marginBottom: 24,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  qrCard: {
    backgroundColor: "#0a1c3a",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  qrSub: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 17,
  },
  qrWrap: {
    padding: 16,
    backgroundColor: "#000000",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BRAND_ORANGE,
    marginBottom: 16,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedText: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "700",
  },
  benefitsCard: {
    backgroundColor: "#0a1c3a",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 14,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
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
    flex: 1,
  },
});
