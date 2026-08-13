import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import { X } from 'lucide-react-native';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Advertisement {
  id: number;
  title: string;
  media_type: 'image' | 'video' | 'html';
  banner_url?: string;
  custom_code?: string;
  link?: string;
}

interface PopupAdProps {
  targetCity?: string;
  targetCategoryId?: number;
}

export default function PopupAd({ targetCity, targetCategoryId }: PopupAdProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const checkAndFetchAd = async () => {
      try {
        const lastSeenStr = await AsyncStorage.getItem('last_popup_ad_seen');
        if (lastSeenStr) {
          const lastSeen = new Date(lastSeenStr).getTime();
          const now = new Date().getTime();
          const minutesSinceLastSeen = (now - lastSeen) / (1000 * 60);
          
          if (minutesSinceLastSeen < 5) {
            return; // Skip if seen in last 5 mins
          }
        }

        let url = `/advertisements?location=popup`;
        if (targetCity) url += `&target_city=${encodeURIComponent(targetCity)}`;
        if (targetCategoryId) url += `&target_category_id=${targetCategoryId}`;

        const res = await api.get(url);
        const data = res.data?.data || res.data;
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAd(data[0]);
          setIsOpen(true);
        }
      } catch (error) {
        console.warn('Failed to fetch popup ad:', error);
      }
    };

    const timer = setTimeout(() => {
      checkAndFetchAd();
    }, 2500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [targetCity, targetCategoryId]);

  useEffect(() => {
    if (isOpen && ad && !hasTrackedImpression.current) {
      api.post(`/advertisements/${ad.id}/impression`).catch(() => {});
      hasTrackedImpression.current = true;
      AsyncStorage.setItem('last_popup_ad_seen', new Date().toISOString());
    }
  }, [isOpen, ad]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    if (ad) {
      api.post(`/advertisements/${ad.id}/click`).catch(() => {});
      if (ad.link) {
        Linking.openURL(ad.link).catch(() => {});
      }
      setIsOpen(false);
    }
  };

  if (!isOpen || !ad) return null;

  return (
    <Modal
      transparent={true}
      visible={isOpen}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: width * 0.85, backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 }}>
          
          <TouchableOpacity 
            onPress={handleClose}
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 20 }}
          >
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} onPress={handleClick}>
            <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, zIndex: 10 }}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>ADVERTISEMENT</Text>
            </View>

            {ad.media_type === 'image' && ad.banner_url ? (
              <Image 
                source={{ uri: ad.banner_url }} 
                style={{ width: '100%', height: width * 0.85, resizeMode: 'contain', backgroundColor: '#F8FAFC' }}
              />
            ) : (
              <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', minHeight: 200, backgroundColor: '#F8FAFC' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1E40AF', textAlign: 'center' }}>{ad.title}</Text>
                <Text style={{ fontSize: 14, color: '#64748B', marginTop: 10, textAlign: 'center' }}>Tap to view details</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
