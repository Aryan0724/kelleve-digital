import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '../../../services/api';
import GlassCard from '../../../components/GlassCard';
import { Camera, Image as ImageIcon, X, Check, ArrowLeft } from 'lucide-react-native';

export default function MediaUploadScreen() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newUris]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please select at least one image to upload.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      images.forEach((uri, index) => {
        const filename = uri.split('/').pop() || `image-${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('media[]', {
          uri,
          name: filename,
          type,
        } as any);
      });

      await api.post('/truedial/vendor/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      Alert.alert('Success', 'Media uploaded successfully!');
      router.back();
    } catch (error: any) {
      console.warn('Media upload failed:', error);
      Alert.alert('Upload Failed', error.message || 'Could not upload media.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950 p-4">
      <View className="flex-row items-center mb-6 mt-8">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#64748B" />
        </TouchableOpacity>
        <Text className="text-2xl font-black text-slate-900 dark:text-white">Upload Media</Text>
      </View>

      <GlassCard className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6">
        <Text className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Photos</Text>
        
        <View className="flex-row gap-4 mb-5">
          <TouchableOpacity 
            className="flex-1 h-24 border-2 border-dashed border-orange-300 dark:border-orange-800 rounded-xl items-center justify-center bg-orange-50 dark:bg-orange-950/20"
            onPress={takePhoto}
          >
            <Camera size={28} color="#E8701A" className="mb-2" />
            <Text className="text-xs font-bold text-orange-600 dark:text-orange-400">Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 h-24 border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-xl items-center justify-center bg-blue-50 dark:bg-blue-950/20"
            onPress={pickImage}
          >
            <ImageIcon size={28} color="#2563EB" className="mb-2" />
            <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">Gallery</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-slate-500 mb-4">Selected Images ({images.length})</Text>

        <View className="flex-row flex-wrap gap-2">
          {images.map((uri, index) => (
            <View key={index} className="w-20 h-20 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
              <Image source={{ uri }} className="w-full h-full" />
              <TouchableOpacity 
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full items-center justify-center"
                onPress={() => removeImage(index)}
              >
                <X size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length === 0 && (
            <View className="w-full py-6 items-center">
              <Text className="text-slate-400 dark:text-slate-500 italic text-sm">No images selected yet</Text>
            </View>
          )}
        </View>
      </GlassCard>

      <TouchableOpacity 
        className={`w-full py-4 rounded-xl items-center flex-row justify-center shadow-md mb-8 ${uploading || images.length === 0 ? 'bg-orange-300 dark:bg-orange-900/50' : 'bg-[#E8701A]'}`}
        onPress={handleUpload}
        disabled={uploading || images.length === 0}
      >
        {uploading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <>
            <Check size={20} color="#FFF" className="mr-2" />
            <Text className="text-white font-bold text-base">Upload {images.length} Image(s)</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
