import React, { useState, useEffect } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '../../../services/api';
import { ArrowLeft, Save, Building, MapPin, Phone, Mail, Globe, Clock, Plus, ImageIcon } from 'lucide-react-native';

export default function ProfileEditScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    title: '', tagline: '', description: '', phone: '', email: '', website: '',
    address: '', city: '', gstin: '', working_hours: ''
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
            working_hours: data.working_hours || ''
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
      
      // Real implementation would upload via FormData here
      // const formData = new FormData();
      // formData.append('image', { uri: newImage.uri, name: 'photo.jpg', type: 'image/jpeg' } as any);
      // await api.post(`/truedial/vendor/businesses/${profileId}/media`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
  };

  const InputField = ({ label, value, onChangeText, icon, multiline = false }: any) => (
    <View className="mb-4">
      <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 ml-1 uppercase">{label}</Text>
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
          placeholder={`Enter ${label.toLowerCase()}`}
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

          <InputField label="BUSINESS NAME" value={profile.title} onChangeText={(t: string) => setProfile({...profile, title: t})} icon={<Building size={18} />} />
          <InputField label="TAGLINE" value={profile.tagline} onChangeText={(t: string) => setProfile({...profile, tagline: t})} />
          <InputField label="DESCRIPTION" value={profile.description} onChangeText={(t: string) => setProfile({...profile, description: t})} multiline />
          
          <Text className="text-[16px] font-extrabold text-slate-900 dark:text-white mt-4 mb-3 tracking-tight">Contact Info</Text>
          <InputField label="PHONE" value={profile.phone} onChangeText={(t: string) => setProfile({...profile, phone: t})} icon={<Phone size={18} />} />
          <InputField label="EMAIL" value={profile.email} onChangeText={(t: string) => setProfile({...profile, email: t})} icon={<Mail size={18} />} />
          <InputField label="WEBSITE" value={profile.website} onChangeText={(t: string) => setProfile({...profile, website: t})} icon={<Globe size={18} />} />
          
          <Text className="text-[16px] font-extrabold text-slate-900 dark:text-white mt-4 mb-3 tracking-tight">Location & Details</Text>
          <InputField label="ADDRESS" value={profile.address} onChangeText={(t: string) => setProfile({...profile, address: t})} icon={<MapPin size={18} />} multiline />
          <InputField label="CITY" value={profile.city} onChangeText={(t: string) => setProfile({...profile, city: t})} />
          <InputField label="GSTIN" value={profile.gstin} onChangeText={(t: string) => setProfile({...profile, gstin: t})} />
          <InputField label="WORKING HOURS" value={profile.working_hours} onChangeText={(t: string) => setProfile({...profile, working_hours: t})} icon={<Clock size={18} />} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
