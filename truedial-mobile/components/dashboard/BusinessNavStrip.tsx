/**
 * BusinessNavStrip
 * 
 * A horizontally scrollable pill-tab strip for vendor dashboards.
 * Renders personalized tabs including the unique tab (Kitchen Display, Patient Records, etc.)
 * exactly like the web sidebar does.
 */
import React, { useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useMobileVendorNav, MobileNavItem } from '../../hooks/useMobileVendorNav';

interface Props {
  /** Optional: override the detected active route */
  activeRoute?: string;
}

export default function BusinessNavStrip({ activeRoute }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = useMobileVendorNav();
  const scrollRef = useRef<ScrollView>(null);
  const currentRoute = activeRoute || pathname;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {navItems.map((item, idx) => {
          const isActive = currentRoute === item.route ||
            currentRoute.startsWith(item.route.replace('/overview', ''));
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.route + idx}
              style={[
                styles.pill,
                isActive && { backgroundColor: item.color, borderColor: item.color },
                item.isUnique && !isActive && styles.uniquePill,
              ]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.75}
            >
              {item.isUnique && !isActive && (
                <View style={[styles.uniqueDot, { backgroundColor: item.color }]} />
              )}
              <Icon
                size={14}
                color={isActive ? '#FFFFFF' : item.isUnique ? item.color : '#64748B'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text style={[
                styles.pillLabel,
                isActive && styles.pillLabelActive,
                item.isUnique && !isActive && { color: item.color, fontWeight: '800' },
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  uniquePill: {
    borderStyle: 'dashed',
    backgroundColor: '#FFF7ED',
  },
  uniqueDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  pillLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
