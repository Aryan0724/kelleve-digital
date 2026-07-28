import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles, Bot, User } from 'lucide-react-native';

export default function AiCenterScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am your TrueDial AI Business Consultant. How can I help you grow your business today?" }
  ]);

  const handleSend = () => {
    if (!prompt.trim()) return;

    setMessages([...messages, { role: 'user', text: prompt }]);
    setPrompt('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I can help you optimize your business listing, suggest marketing strategies, or draft promotional offers. Would you like me to analyze your current profile?" 
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={22} color="#1E293B" className="dark:text-white" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Sparkles size={16} color="#8B5CF6" className="mr-2" />
          <Text className="text-[20px] font-extrabold text-slate-900 dark:text-white">AI Business Center</Text>
        </View>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
          
          <View className="items-center mb-6 mt-4">
            <View className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center mb-3">
              <Bot size={32} color="#6366F1" />
            </View>
            <Text className="text-[14px] text-slate-500 text-center px-4">
              Ask questions about TrueDial algorithms, SEO optimization, or business strategy.
            </Text>
          </View>

          {messages.map((msg, idx) => (
            <View key={idx} className={`flex-row mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <View className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 items-center justify-center mr-2 mt-1">
                  <Bot size={16} color="#6366F1" />
                </View>
              )}
              
              <View className={`max-w-[75%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[#E8701A] rounded-tr-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-sm shadow-sm'}`}>
                <Text className={`text-[15px] leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {msg.text}
                </Text>
              </View>

              {msg.role === 'user' && (
                <View className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 items-center justify-center ml-2 mt-1">
                  <User size={16} color="#64748B" />
                </View>
              )}
            </View>
          ))}

          {loading && (
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 items-center justify-center mr-2">
                <Bot size={16} color="#6366F1" />
              </View>
              <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 rounded-tl-sm border border-slate-200 dark:border-slate-800">
                <ActivityIndicator size="small" color="#6366F1" />
              </View>
            </View>
          )}
        </ScrollView>

        <View className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex-row items-center">
          <View className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full flex-row items-center px-4 h-[44px]">
            <TextInput
              className="flex-1 text-[15px] text-slate-900 dark:text-white h-full"
              placeholder="Ask anything..."
              placeholderTextColor="#94A3B8"
              value={prompt}
              onChangeText={setPrompt}
              onSubmitEditing={handleSend}
            />
          </View>
          <TouchableOpacity 
            className={`w-[44px] h-[44px] rounded-full items-center justify-center ml-3 ${prompt.trim() ? 'bg-[#E8701A]' : 'bg-slate-200 dark:bg-slate-800'}`}
            onPress={handleSend}
            disabled={!prompt.trim() || loading}
          >
            <Send size={18} color={prompt.trim() ? "white" : "#94A3B8"} className="ml-1" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
