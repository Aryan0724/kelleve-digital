import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TextInput,
  ScrollView, StyleSheet
} from 'react-native';
import { Tag, Search, X, Check } from 'lucide-react-native';

interface Category {
  id: number;
  name: string;
}

interface CategorySelectorModalProps {
  visible: boolean;
  categories: Category[];
  selectedCategoryId: string;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
}

export default function CategorySelectorModal({
  visible,
  categories,
  selectedCategoryId,
  onClose,
  onSelectCategory,
}: CategorySelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (cat: Category) => {
    onSelectCategory(cat);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Select Business Category</Text>
              <Text style={styles.subtitle}>Choose the category that best fits your business</Text>
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
              placeholder="Search category (e.g. Restaurant, Hotel, Hospital)..."
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

          {/* Category List */}
          <Text style={{fontSize: 11, color: '#94A3B8', marginBottom: 8, textAlign: 'right'}}>{filteredCategories.length} categories</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {filteredCategories.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No category found matching "{searchQuery}"</Text>
              </View>
            ) : (
              filteredCategories.map(cat => {
                const isSelected = selectedCategoryId === String(cat.id);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.row, isSelected && styles.rowSelected]}
                    onPress={() => handleSelect(cat)}
                  >
                    <View style={styles.rowLeft}>
                      <Tag size={16} color={isSelected ? '#E8701A' : '#64748B'} style={{ marginRight: 10 }} />
                      <Text style={[styles.catName, isSelected && styles.catNameSelected]}>
                        {cat.name}
                      </Text>
                    </View>
                    {isSelected && <Check size={18} color="#E8701A" />}
                  </TouchableOpacity>
                );
              })
            )}
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
    maxHeight: '80%',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    borderRadius: 10,
  },
  rowSelected: {
    backgroundColor: '#FFF7ED',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  catNameSelected: {
    fontWeight: '800',
    color: '#E8701A',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
});
