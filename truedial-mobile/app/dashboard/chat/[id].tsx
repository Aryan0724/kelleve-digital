import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../../services/api';
import ChatBubble from '../../../components/ChatBubble';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useAuth } from '../../../context/auth';

interface Message {
  id: number;
  body?: string;
  content?: string;
  message?: string;
  sender_id: number;
  sender?: { name: string };
  created_at: string;
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [participantName, setParticipantName] = useState('Chat');

  useEffect(() => {
    fetchChat();
  }, [id]);

  const fetchChat = async () => {
    try {
      const [convoRes, msgRes] = await Promise.all([
        api.get(`/conversations/${id}`).catch(() => null),
        api.get(`/conversations/${id}/messages`).catch(() => null),
      ]);
      
      const convo = convoRes?.data?.data || convoRes?.data;
      if (convo) {
        const participant = convo.participant || (user?.id === convo.vendor_id ? convo.customer : convo.vendor) || convo.user;
        setParticipantName(participant?.name || convo.title || 'Chat');
      }

      const msgs = msgRes?.data?.data || msgRes?.data || [];
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.warn('Failed to load chat detail:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    
    setSending(true);
    setInputText('');

    const tempId = Date.now();
    const optimistic: Message = {
      id: tempId,
      content: text,
      body: text,
      message: text,
      sender_id: user?.id || 0,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimistic]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const res = await api.post(`/conversations/${id}/messages`, {
        content: text,
        body: text,
        message: text
      });
      const newMsg = res.data?.data || res.data;
      if (newMsg && newMsg.id) {
        setMessages(prev => prev.map(m => m.id === tempId ? newMsg : m));
      }
    } catch (err) {
      console.log('Sent message locally via fallback');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{participantName}</Text>
          <Text style={styles.headerSub}>TrueDial Direct Messaging</Text>
        </View>
      </View>

      {/* Messages List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E8701A" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={({ item }) => {
            const msgText = item.content || item.body || item.message || '';
            const isMine = item.sender_id === user?.id || item.sender_id === 0;
            return (
              <ChatBubble
                message={msgText}
                timestamp={formatTime(item.created_at)}
                isMine={isMine}
                senderName={item.sender?.name}
              />
            );
          }}
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Send size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingBottom: 14,
    paddingHorizontal: 16, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  headerSub: { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  input: {
    flex: 1, backgroundColor: '#F1F5F9', borderRadius: 22, paddingHorizontal: 16,
    paddingVertical: 10, fontSize: 15, color: '#1E293B', maxHeight: 100, marginRight: 8,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8701A',
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
