import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { X, Star } from 'lucide-react-native';
import api from '../../services/api';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  businessSlug: string;
  onSuccess: () => void;
}

export default function ReviewModal({ visible, onClose, businessSlug, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setLoading(true);
    try {
      await api.post(`/truedial/user/businesses/${businessSlug}/reviews`, {
        rating,
        body: reviewText
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.warn('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-slate-900 rounded-t-[24px] p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-[18px] font-extrabold text-slate-900 dark:text-white">Write a Review</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
              <X size={18} color="#64748B" className="dark:text-slate-400" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-6">
            <Text className="text-slate-500 mb-2">Tap to rate</Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star 
                    size={32} 
                    color={star <= rating ? "#F59E0B" : "#CBD5E1"} 
                    fill={star <= rating ? "#F59E0B" : "transparent"} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-[11px] font-extrabold text-slate-500 tracking-wider mb-2 ml-1">YOUR REVIEW (OPTIONAL)</Text>
            <TextInput 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-[15px] text-slate-900 dark:text-white h-32"
              style={{ textAlignVertical: 'top' }}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Tell others about your experience..."
              placeholderTextColor="#94A3B8"
              multiline
            />
          </View>

          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={rating === 0 || loading}
            className={`rounded-xl py-3.5 flex-row items-center justify-center ${rating > 0 ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text className="text-white text-[16px] font-bold">Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
