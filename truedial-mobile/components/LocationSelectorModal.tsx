import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TextInput,
  ScrollView, StyleSheet
} from 'react-native';
import { MapPin, Search, X, Check } from 'lucide-react-native';

interface LocationSelectorModalProps {
  visible: boolean;
  currentCity: string;
  onClose: () => void;
  onSelectCity: (city: string) => void;
}

const POPULAR_CITIES = [
  'Patna', 'Mumbai', 'Delhi NCR', 'Bangalore', 
  'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 
  'Jaipur', 'Lucknow', 'Chandigarh', 'Indore'
];

const ALL_CITIES = [
  'Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga',
  'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik',
  'Delhi NCR', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad',
  'Bangalore', 'Mysore', 'Mangalore',
  'Hyderabad', 'Secunderabad', 'Visakhapatnam',
  'Kolkata', 'Howrah', 'Siliguri',
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot',
  'Jaipur', 'Jodhpur', 'Udaipur', 'Kota',
  'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj',
  'Chandigarh', 'Ludhiana', 'Amritsar',
  'Indore', 'Bhopal', 'Gwalior',
  'Chennai', 'Coimbatore', 'Kochi', 'Thiruvananthapuram'
];

export default function LocationSelectorModal({
  visible,
  currentCity,
  onClose,
  onSelectCity
}: LocationSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = ALL_CITIES.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (city: string) => {
    onSelectCity(city);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Select Location</Text>
              <Text style={styles.subtitle}>Choose your city to explore businesses near you</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchWrapper}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search city (e.g. Patna, Mumbai)..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Quick Select Chips */}
            {!searchQuery && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>POPULAR CITIES</Text>
                <View style={styles.chipsRow}>
                  {POPULAR_CITIES.map(city => {
                    const isSelected = currentCity.toLowerCase().includes(city.toLowerCase());
                    return (
                      <TouchableOpacity
                        key={city}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => handleSelect(city)}
                      >
                        <MapPin size={12} color={isSelected ? '#FFFFFF' : '#1E40AF'} style={{ marginRight: 4 }} />
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                          {city}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* City List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? 'SEARCH RESULTS' : 'ALL CITIES'}
              </Text>

              {filteredCities.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>No city found matching "{searchQuery}"</Text>
                  <TouchableOpacity
                    style={styles.customSelectBtn}
                    onPress={() => handleSelect(searchQuery)}
                  >
                    <Text style={styles.customSelectText}>Use "{searchQuery}" as Location</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                filteredCities.map(city => {
                  const isSelected = currentCity.toLowerCase().includes(city.toLowerCase());
                  return (
                    <TouchableOpacity
                      key={city}
                      style={[styles.cityRow, isSelected && styles.cityRowSelected]}
                      onPress={() => handleSelect(city)}
                    >
                      <View style={styles.cityLeft}>
                        <MapPin size={16} color={isSelected ? '#1E40AF' : '#64748B'} style={{ marginRight: 10 }} />
                        <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                          {city}
                        </Text>
                      </View>
                      {isSelected && <Check size={18} color="#1E40AF" />}
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipSelected: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    borderRadius: 8,
  },
  cityRowSelected: {
    backgroundColor: '#F0F9FF',
  },
  cityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  cityNameSelected: {
    fontWeight: '800',
    color: '#1E40AF',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  customSelectBtn: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  customSelectText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
