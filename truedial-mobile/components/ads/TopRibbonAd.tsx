import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { X } from 'lucide-react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Advertisement {
  id: number;
  title: string;
  media_type: 'image' | 'video' | 'html';
  banner_url?: string;
  custom_code?: string;
  link?: string;
}

interface TopRibbonAdProps {
  targetCity?: string;
  targetCategoryId?: number;
}

export default function TopRibbonAd({ targetCity, targetCategoryId }: TopRibbonAdProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const checkAndFetchAd = async () => {
      try {
        const dismissed = await AsyncStorage.getItem('ribbon_ad_dismissed');
        // Simple session simulation: clear on app restart in a real app.
        // For now, let's just fetch it anyway if it's not dismissed permanently.
        if (dismissed === 'true') {
          return;
        }

        let url = `/advertisements?location=top_ribbon`;
        if (targetCity) url += `&target_city=${encodeURIComponent(targetCity)}`;
        if (targetCategoryId) url += `&target_category_id=${targetCategoryId}`;

        const res = await api.get(url);
        const data = res.data?.data || res.data;
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAd(data[0]);
          setIsVisible(true);
        }
      } catch (error) {
        console.warn('Failed to fetch top ribbon ad:', error);
      }
    };

    checkAndFetchAd();
    return () => { isMounted = false; };
  }, [targetCity, targetCategoryId]);

  useEffect(() => {
    if (isVisible && ad && !hasTrackedImpression.current) {
      api.post(`/advertisements/${ad.id}/impression`).catch(() => {});
      hasTrackedImpression.current = true;
    }
  }, [isVisible, ad]);

  const handleClose = () => {
    setIsVisible(false);
    AsyncStorage.setItem('ribbon_ad_dismissed', 'true');
  };

  const handleClick = () => {
    if (ad) {
      api.post(`/advertisements/${ad.id}/click`).catch(() => {});
      if (ad.link) {
        Linking.openURL(ad.link).catch(() => {});
      }
    }
  };

  if (!isVisible || !ad) return null;

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handleClick}
      style={{
        width: '100%',
        backgroundColor: '#EFF6FF',
        borderBottomWidth: 1,
        borderBottomColor: '#DBEAFE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {ad.media_type === 'image' && ad.banner_url ? (
          <Image 
            source={{ uri: ad.banner_url }} 
            style={{ width: '100%', height: 40, resizeMode: 'contain' }}
          />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(30,64,175,0.2)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1E40AF' }}>TOP DEAL</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1E40AF' }} numberOfLines={1}>
              {ad.title}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        onPress={handleClose} 
        style={{ padding: 4, marginLeft: 8 }}
      >
        <X size={16} color="#64748B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
