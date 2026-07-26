import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, useColorScheme } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'navy' | 'orange' | 'gold' | 'default';
}

export default function GlassCard({ children, style, variant = 'default' }: GlassCardProps) {
  // Generate card styling depending on variant
  const cardStyle = [
    styles.cardBase,
    styles.cardLight,
    variant === 'navy' && styles.cardNavy,
    variant === 'orange' && styles.cardOrange,
    variant === 'gold' && styles.cardGold,
    style
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 6,
    // iOS Shadow
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android Elevation
    elevation: 2,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardNavy: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    shadowColor: '#000000',
  },
  cardOrange: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    shadowColor: '#F05A24',
  },
  cardGold: {
    backgroundColor: '#111111',
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
  },
});
