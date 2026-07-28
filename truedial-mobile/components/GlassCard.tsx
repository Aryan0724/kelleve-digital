import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'navy' | 'orange' | 'gold' | 'default';
  className?: string;
}

export default function GlassCard({ children, style, variant = 'default', className = '' }: GlassCardProps) {
  let variantClasses = 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800';
  
  if (variant === 'navy') {
    variantClasses = 'bg-[#0F172A] border-[#1E293B] shadow-black';
  } else if (variant === 'orange') {
    variantClasses = 'bg-[#FFF7ED] border-[#FFEDD5] dark:bg-orange-950/20 dark:border-orange-900 shadow-orange-500/20';
  } else if (variant === 'gold') {
    variantClasses = 'bg-[#111111] border-[#D4AF37] shadow-[#D4AF37]/20';
  }

  return (
    <View 
      className={`rounded-2xl border p-4 my-1.5 shadow-sm ${variantClasses} ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}
