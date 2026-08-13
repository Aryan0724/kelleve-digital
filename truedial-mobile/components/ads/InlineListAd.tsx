import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Linking, Dimensions } from 'react-native';
import api from '../../services/api';

const { width } = Dimensions.get('window');

interface Advertisement {
  id: number;
  title: string;
  media_type: 'image' | 'video' | 'html';
  banner_url?: string;
  custom_code?: string;
  link?: string;
}

interface InlineListAdProps {
  targetCity?: string;
  targetCategoryId?: number;
}

export default function InlineListAd({ targetCity, targetCategoryId }: InlineListAdProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAd = async () => {
      try {
        let url = `/advertisements?location=in_list`;
        if (targetCity) url += `&target_city=${encodeURIComponent(targetCity)}`;
        if (targetCategoryId) url += `&target_category_id=${targetCategoryId}`;

        const res = await api.get(url);
        const data = res.data?.data || res.data;
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAd(data[0]);
        }
      } catch (error) {
        console.warn('Failed to fetch inline ad:', error);
      }
    };

    fetchAd();
    return () => { isMounted = false; };
  }, [targetCity, targetCategoryId]);

  useEffect(() => {
    if (ad && !hasTrackedImpression.current) {
      api.post(`/advertisements/${ad.id}/impression`).catch(() => {});
      hasTrackedImpression.current = true;
    }
  }, [ad]);

  const handleClick = () => {
    if (ad) {
      api.post(`/advertisements/${ad.id}/click`).catch(() => {});
      if (ad.link) {
        Linking.openURL(ad.link).catch(() => {});
      }
    }
  };

  if (!ad) return null;

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handleClick}
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginVertical: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, zIndex: 10 }}>
        <Text style={{ color: 'white', fontSize: 9, fontWeight: 'bold' }}>SPONSORED</Text>
      </View>

      {ad.media_type === 'image' && ad.banner_url ? (
        <Image 
          source={{ uri: ad.banner_url }} 
          style={{ width: '100%', height: width * 0.45, resizeMode: 'cover', backgroundColor: '#F1F5F9' }}
        />
      ) : (
        <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', minHeight: 120, backgroundColor: '#F8FAFC' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E40AF', textAlign: 'center' }}>{ad.title}</Text>
          {ad.link && (
            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 8, textAlign: 'center' }}>
              Tap to learn more &rarr;
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
