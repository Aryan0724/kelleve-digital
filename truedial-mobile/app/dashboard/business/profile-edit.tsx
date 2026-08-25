import React, { useState, useEffect } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import api from '../../../services/api';
import {
  ArrowLeft, Save, Building, MapPin, Phone, Mail, Globe,
  Clock, Plus, ImageIcon, Tag, Navigation, Check, X
} from 'lucide-react-native';

const WORKING_HOURS_PRESETS = [
  "09:00 AM - 08:00 PM",
  "10:00 AM - 07:00 PM",
  "08:00 AM - 10:00 PM",
  "09:00 AM - 09:00 PM (Sun Closed)",
  "24 Hours Open",
  "10:30 AM - 08:30 PM",
];

export default function ProfileEditScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);

  const [profile, setProfile] = useState({
    title: '', tagline: '', description: '', phone: '', email: '', website: '',
    address: '', city: '', gstin: '', working_hours: '', lat: null as number | null, lng: null as number | null
  });
  const [profileId, setProfileId] = useState<number | null>(null);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/truedial/vendor/my-business');
        const data = res.data?.data || res.data;
        if (data) {
          setProfileId(data.id);
          setProfile({
            title: data.title || '', tagline: data.tagline || '', description: data.description || '',
            phone: data.phone || '', email: data.email || '', website: data.website || '',
            address: data.address || '', city: data.city || '', gstin: data.gstin || '',
            working_hours: data.working_hours || '09:00 AM - 08:00 PM',
            lat: data.lat || null, lng: data.lng || null
          });
          if (data.media) {
             setGallery(data.media);
          }
        }
      } catch (err) {
        Alert.alert('Notice', 'Could not load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    try {
      await api.put(`/truedial/vendor/businesses/${profileId}`, profile);
      Alert.alert('Success', 'Business profile updated successfully!');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const detectLocation = async () => {
    setDetectingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to detect your location automatically.');
        setDetectingLocation(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;

      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        const formattedAddress = [
          place.name, place.street, place.subregion, place.district
        ].filter(Boolean).join(', ');
        const detectedCity = place.city || place.subregion || place.region || '';

        setProfile(prev => ({
          ...prev,
          address: formattedAddress || prev.address,
          city: detectedCity || prev.city,
          lat: latitude,
          lng: longitude
        }));

        Alert.alert('Location Detected', `Updated city to "${detectedCity}" and address.`);
      } else {
        setProfile(prev => ({ ...prev, lat: latitude, lng: longitude }));
        Alert.alert('Coordinates Saved', `GPS Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) saved.`);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Could not detect location. Please enter manually.');
    } finally {
      setDetectingLocation(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImage = result.assets[0];
      setGallery([...gallery, { uri: newImage.uri, id: Date.now() }]);
    }
  };

  const InputField = ({ label, value, onChangeText, icon, multiline = false, placeholder, rightElement }: any) => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-1.5 ml-1">
        <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">{label}</Text>
        {rightElement}
      </View>
      <View className={`flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 ${multiline ? 'pt-3 pb-3 items-start' : 'h-12 items-center'}`}>
        {icon && (
          <View className={`${multiline ? 'mt-0.5' : ''}`}>
            {React.cloneElement(icon, { color: '#94A3B8', className: 'mr-2.5 dark:text-slate-500' })}
          </View>
        )}
        <TextInput
          className={`flex-1 text-[15px] text-slate-900 dark:text-white ${multiline ? 'h-24' : ''}`}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          placeholderTextColor="#94A3B8"
          style={multiline ? { textAlignVertical: 'top' } : {}}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView className="flex-1 bg-slate-50 dark:bg-slate-950" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving || !profileId} className="w-10 h-10 rounded-full bg-[#E8701A] items-center justify-center shadow-sm shadow-orange-500/30">
          {saving ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Save size={18} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8701A" className="mt-10" />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          
          <Text className="text-[16px] font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Business Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {gallery.map((img: any, i: number) => (
              <View key={i} className="w-24 h-24 rounded-xl bg-slate-200 mr-3 overflow-hidden border border-slate-300 dark:border-slate-700">
                <Image source={{ uri: img.url || img.uri }} className="w-full h-full" />
              </View>
            ))}
            <TouchableOpacity 
              onPress={pickImage} 
              className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 items-center justify-center"
            >
              <ImageIcon size={24} color="#94A3B8" className="mb-1" />
              <Text className="text-[11px] text-slate-500 font-bold">Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>

          <InputField label="BUSINESS NAME" value={profile.title} onChangeText={(t: string) => setProfile({...profile, title: t})} icon={<Building size={18} />} placeholder="e.g. Acme Innovations" />
          <InputField label="TAGLINE" value={profile.tagline} onChangeText={(t: string) => setProfile({...profile, tagline: t})} icon={<Tag size={18} />} placeholder="e.g. Quality Services Since 2020" />
          <InputField label="DESCRIPTION" value={profile.description} onChangeText={(t: string) => setProfile({...profile, description: t})} multiline placeholder="Describe your business offerings, amenities, etc." />
          
          <Text className="text-[16px] font-extrabold text-slate-900 dark:text-white mt-4 mb-3 tracking-tight">Contact Info</Text>
          <InputField label="PHONE" value={profile.phone} onChangeText={(t: string) => setProfile({...profile, phone: t})} icon={<Phone size={18} />} placeholder="e.g. 9876543210" />
          <InputField label="EMAIL" value={profile.email} onChangeText={(t: string) => setProfile({...profile, email: t})} icon={<Mail size={18} />} placeholder="e.g. info@business.com" />
          <InputField label="WEBSITE" value={profile.website} onChangeText={(t: string) => setProfile({...profile, website: t})} icon={<Globe size={18} />} placeholder="e.g. https://mybusiness.com" />
          
          <Text className="text-[16px] font-extrabold text-slate-900 dark:text-white mt-4 mb-3 tracking-tight">Location & Details</Text>
          
          <InputField 
            label="ADDRESS" 
            value={profile.address} 
            onChangeText={(t: string) => setProfile({...profile, address: t})} 
            icon={<MapPin size={18} />} 
            multiline 
            placeholder="Street name, landmark, area"
            rightElement={
              <TouchableOpacity 
                onPress={detectLocation} 
                disabled={detectingLocation} 
                className="flex-row items-center bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-lg border border-orange-200 dark:border-orange-900"
              >
                {detectingLocation ? (
                  <ActivityIndicator size="small" color="#E8701A" className="mr-1" />
                ) : (
                  <Navigation size={12} color="#E8701A" className="mr-1" />
                )}
                <Text className="text-[#E8701A] text-[11px] font-bold">Auto-Detect GPS</Text>
              </TouchableOpacity>
            }
          />
          
          <InputField label="CITY" value={profile.city} onChangeText={(t: string) => setProfile({...profile, city: t})} placeholder="e.g. Patna" />
          <InputField label="GSTIN" value={profile.gstin} onChangeText={(t: string) => setProfile({...profile, gstin: t})} placeholder="e.g. 10AAAAA0000A1Z5" />
          
          {/* Working Hours Picker */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-1.5 ml-1">
              <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">WORKING HOURS</Text>
              <TouchableOpacity 
                onPress={() => setShowHoursModal(true)}
                className="bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-lg border border-orange-200 dark:border-orange-900"
              >
                <Text className="text-[#E8701A] text-[11px] font-bold">Choose Preset</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 h-12 items-center">
              <Clock size={18} color="#94A3B8" className="mr-2.5 dark:text-slate-500" />
              <TextInput
                className="flex-1 text-[15px] text-slate-900 dark:text-white"
                value={profile.working_hours}
                onChangeText={(t: string) => setProfile({...profile, working_hours: t})}
                placeholder="e.g. 09:00 AM - 08:00 PM"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </ScrollView>
      )}

      {/* Working Hours Preset Modal */}
      <Modal visible={showHoursModal} transparent animationType="slide" onRequestClose={() => setShowHoursModal(false)}>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800">
            <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white">Select Working Hours</Text>
              <TouchableOpacity onPress={() => setShowHoursModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text className="text-[13px] text-slate-500 dark:text-slate-400 mb-4 font-semibold">Tap a preset operating schedule to apply:</Text>

            {WORKING_HOURS_PRESETS.map((preset, idx) => {
              const isSelected = profile.working_hours === preset;
              return (
                <TouchableOpacity
                  key={idx}
                  className={`flex-row justify-between items-center p-4 rounded-xl mb-2.5 border ${isSelected ? 'bg-orange-50 dark:bg-orange-950/30 border-[#E8701A]' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}
                  onPress={() => {
                    setProfile({ ...profile, working_hours: preset });
                    setShowHoursModal(false);
                  }}
                >
                  <View className="flex-row items-center">
                    <Clock size={16} color={isSelected ? "#E8701A" : "#64748B"} className="mr-3" />
                    <Text className={`text-[14px] font-bold ${isSelected ? 'text-[#E8701A]' : 'text-slate-800 dark:text-slate-200'}`}>{preset}</Text>
                  </View>
                  {isSelected && <Check size={18} color="#E8701A" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
