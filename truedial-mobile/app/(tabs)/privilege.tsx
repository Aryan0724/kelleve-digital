import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import api from '../../services/api';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import { CreditCard, Sparkles, ShieldCheck, Calendar } from 'lucide-react-native';
import { useAuth } from '../../context/auth';

interface PrivilegeCardData {
  card_number: string;
  valid_until: string;
  status: string;
}

export default function PrivilegeScreen() {
  const { user } = useAuth();
  const [card, setCard] = useState<PrivilegeCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPrivilegeCard();
  }, []);

  const fetchPrivilegeCard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/privilege-cards');
      const resData = response.data;
      if (resData.success && resData.data) {
        setCard(resData.data);
      } else if (resData.card_number) {
        setCard(resData);
      } else {
        setCard(null);
      }
    } catch (error) {
      console.warn('No active privilege card found or fetch failed');
      setCard(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCard = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/privilege-cards/generate');
      const resData = response.data;
      const cardInfo = resData.data || resData;
      setCard(cardInfo);
      Alert.alert('Success', 'Your TrueDial Privilege Card has been generated successfully!');
    } catch (error: any) {
      Alert.alert('Generation Failed', error.message || 'Could not generate card. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Background glow */}
      <View style={styles.glowBall} />

      <View style={styles.header}>
        <Text style={styles.title}>Privilege Club</Text>
        <Text style={styles.subtitle}>Unlock exclusive local B2B discount cards across hospitals, hotels and services.</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E8701A" />
          <Text style={styles.loadingText}>Verifying Club membership...</Text>
        </View>
      ) : card ? (
        <View style={styles.cardContainer}>
          {/* Privilege Card UI */}
          <GlassCard style={styles.digitalCard}>
            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.cardBrand}>TrueDial</Text>
                <Text style={styles.cardSubBrand}>PRIVILEGE MEMBER</Text>
              </View>
              <Sparkles size={28} color="#E8701A" />
            </View>

            {/* Simulated Chip */}
            <View style={styles.cardChip} />

            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumber}>{card.card_number}</Text>
            </View>

            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.cardLabel}>HOLDER NAME</Text>
                <Text style={styles.cardValue}>{user?.name || 'Valued Partner'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cardLabel}>VALID UNTIL</Text>
                <Text style={styles.cardValue}>{card.valid_until}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Status Indicators */}
          <GlassCard style={styles.statusInfoCard}>
            <View style={styles.infoRow}>
              <ShieldCheck size={20} color="#10B981" />
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTitle}>Status: {card.status}</Text>
                <Text style={styles.infoDesc}>Your membership is fully verified and active.</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { marginTop: 12 }]}>
              <Calendar size={20} color="#E8701A" />
              <View style={styles.infoTextCol}>
                <Text style={styles.infoTitle}>Valid Until: {card.valid_until}</Text>
                <Text style={styles.infoDesc}>Card renewal will occur automatically before expiry.</Text>
              </View>
            </View>
          </GlassCard>

          <Text style={styles.cardInstructions}>
            Present this digital card at any participating TrueDial business outlet in India to claim exclusive discount privileges.
          </Text>
        </View>
      ) : (
        <View style={styles.emptyCardContainer}>
          {/* Card Tiers Selection matching Client Design */}
          <Text style={styles.tierSectionTitle}>Select Your Privilege Card Tier</Text>

          <View style={styles.tiersContainer}>
            {/* City Card Tier */}
            <GlassCard variant="orange" style={styles.tierCard}>
              <View style={styles.tierBadge}>
                <Text style={styles.tierBadgeText}>POPULAR</Text>
              </View>
              <Text style={styles.tierName}>City Privilege Card</Text>
              <Text style={styles.tierDesc}>Unlimited discount access in your home city</Text>
              <View style={styles.priceRow}>
                <Text style={styles.oldPrice}>₹2,999</Text>
                <Text style={styles.newPrice}>₹999/- <Text style={styles.onlyText}>Only</Text></Text>
              </View>
              <CustomButton
                title="Get City Card"
                onPress={handleGenerateCard}
                loading={generating}
                style={{ marginTop: 12 }}
              />
            </GlassCard>

            {/* Multi-City Card Tier */}
            <GlassCard variant="navy" style={[styles.tierCard, { borderColor: '#F59E0B' }]}>
              <View style={[styles.tierBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Text style={[styles.tierBadgeText, { color: '#F59E0B' }]}>VIP ALL CITIES</Text>
              </View>
              <Text style={styles.tierName}>Multi-City Privilege Card</Text>
              <Text style={styles.tierDesc}>All-India access across 50+ major hubs & airports</Text>
              <View style={styles.priceRow}>
                <Text style={styles.oldPrice}>₹4,999</Text>
                <Text style={styles.newPrice}>₹2,999/- <Text style={styles.onlyText}>Only</Text></Text>
              </View>
              <CustomButton
                title="Get Multi-City Card"
                onPress={handleGenerateCard}
                loading={generating}
                variant="glass"
                style={{ marginTop: 12 }}
              />
            </GlassCard>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  glowBall: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(240, 90, 36, 0.08)',
    top: 50,
    right: -100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 18,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 12,
  },
  cardContainer: {
    alignItems: 'center',
  },
  digitalCard: {
    width: '100%',
    aspectRatio: 1.58, // Credit card proportion
    backgroundColor: '#111111',
    borderColor: '#D4AF37', // Gold border
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  cardSubBrand: {
    fontSize: 9,
    fontWeight: '700',
    color: '#F05A24',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  cardChip: {
    width: 40,
    height: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 10,
  },
  cardNumberContainer: {
    marginVertical: 12,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 3,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  statusInfoCard: {
    width: '100%',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  infoDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardInstructions: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  emptyCardContainer: {
    marginTop: 0,
  },
  tierSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  tiersContainer: {
    gap: 14,
  },
  tierCard: {
    padding: 18,
    marginVertical: 0,
    backgroundColor: '#FFFFFF',
  },
  tierBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tierBadgeText: {
    color: '#F05A24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  tierDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  oldPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  newPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F05A24',
  },
  onlyText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
});
