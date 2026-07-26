import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import api from '../../services/api';
import GlassCard from '../../components/GlassCard';
import CustomButton from '../../components/CustomButton';
import { Tag, Sparkles, X, Plus, Calendar, Percent } from 'lucide-react-native';
import { useAuth } from '../../context/auth';

interface Offer {
  id: number;
  title: string;
  discount_percentage: number;
  valid_until: string;
  business_name?: string;
}

export default function OffersScreen() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Post Offer Modal Form state
  const [modalVisible, setModalVisible] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/offers');
      const data = response.data.data || response.data;
      setOffers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.warn('Failed to load offers from server, using fallback');
      // Mock active offers for presentation
      setOffers([
        {
          id: 1,
          title: "Flat 25% Off on OPD Services",
          discount_percentage: 25,
          valid_until: "2026-12-31",
          business_name: "Apex Multi-Specialty Hospital"
        },
        {
          id: 2,
          title: "Buy 1 Get 1 Free on Pizzas",
          discount_percentage: 50,
          valid_until: "2026-11-15",
          business_name: "The Grand Royal Restaurant"
        },
        {
          id: 3,
          title: "15% Off Deluxe Suite Booking",
          discount_percentage: 15,
          valid_until: "2026-10-31",
          business_name: "Blue Horizon Luxury Hotel"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostOffer = async () => {
    if (!offerTitle || !discountPercent) {
      Alert.alert('Incomplete Form', 'Please enter a title and discount percentage.');
      return;
    }
    const percent = parseInt(discountPercent, 10);
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      Alert.alert('Invalid Discount', 'Discount must be a number between 1 and 100.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/offers', {
        title: offerTitle,
        discount_percentage: percent,
        valid_until: validUntil
      });
      Alert.alert('Success', 'Your offer has been posted successfully!');
      setModalVisible(false);
      setOfferTitle('');
      setDiscountPercent('');
      fetchOffers();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not post offer. Ensure you are authorized.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderOfferCard = ({ item }: { item: Offer }) => {
    return (
      <GlassCard variant="default" style={styles.offerCard}>
        <View style={styles.offerCardTop}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.discount_percentage}% OFF</Text>
          </View>
          <Tag size={20} color="#E8701A" />
        </View>

        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.businessName}>
          {item.business_name || 'Participating TrueDial Partner'}
        </Text>

        <View style={styles.offerFooter}>
          <View style={styles.dateCol}>
            <Calendar size={14} color="rgba(255,255,255,0.4)" />
            <Text style={styles.validUntilText}>Valid until: {item.valid_until}</Text>
          </View>
          <Text style={styles.cardStatusText}>Active Offer</Text>
        </View>
      </GlassCard>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.title}>Exclusive Offers</Text>
          <Text style={styles.subtitle}>Unlock corporate savings with your Privilege Card</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E8701A" />
          <Text style={styles.loadingText}>Fetching available discounts...</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderOfferCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Tag size={48} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyTitle}>No Offers Found</Text>
              <Text style={styles.emptyDesc}>There are currently no active B2B campaigns. Check back soon!</Text>
            </View>
          }
        />
      )}

      {/* Post Offer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <GlassCard variant="navy" style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Sparkles size={20} color="#E8701A" style={{ marginRight: 8 }} />
                  <Text style={styles.modalTitle}>Post New Offer</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.inputLabel}>Offer Description / Title</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 30% Off on Executive Suite Booking"
                    placeholderTextColor="rgba(255, 255, 255, 0.35)"
                    value={offerTitle}
                    onChangeText={setOfferTitle}
                  />
                </View>

                <Text style={styles.inputLabel}>Discount Percentage (%)</Text>
                <View style={styles.inputWrapper}>
                  <Percent size={18} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 30"
                    placeholderTextColor="rgba(255, 255, 255, 0.35)"
                    value={discountPercent}
                    onChangeText={setDiscountPercent}
                    keyboardType="numeric"
                  />
                </View>

                <Text style={styles.inputLabel}>Expiry Date (YYYY-MM-DD)</Text>
                <View style={styles.inputWrapper}>
                  <Calendar size={18} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 2026-12-31"
                    placeholderTextColor="rgba(255, 255, 255, 0.35)"
                    value={validUntil}
                    onChangeText={setValidUntil}
                  />
                </View>

                <CustomButton
                  title="Publish Business Offer"
                  onPress={handlePostOffer}
                  loading={submitting}
                  style={styles.submitBtn}
                />
              </ScrollView>
            </GlassCard>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: Platform.OS === 'ios' ? 88 : 64,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
    marginTop: 4,
  },
  addBtn: {
    backgroundColor: '#F05A24',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F05A24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  offerCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  offerCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeContainer: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#F05A24',
    fontWeight: '800',
    fontSize: 13,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  businessName: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 12,
  },
  dateCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validUntilText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
  },
  cardStatusText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
  },
  modalCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
  },
  submitBtn: {
    marginTop: 10,
  },
});
