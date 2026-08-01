import React, { useState, useEffect, useRef } from 'react';
import {
  Text, View, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../../services/api';
import { ArrowLeft, Send, Phone, Info, MessageSquare } from 'lucide-react-native';
import { useAuth } from '../../../context/auth';

interface Message {
  id: number;
  message?: string;
  content?: string;
  body?: string;
  sender_id: number;
  sender?: { name: string };
  created_at: string;
}

interface Conversation {
  id: number;
  customer_id: number;
  vendor_id: number;
  customer?: { id: number; name: string };
  vendor?: { id: number; name: string };
  project?: {
    id: number;
    title: string;
    budget_min?: string;
    budget_max?: string;
    status?: string;
  };
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [participantName, setParticipantName] = useState('Chat');

  const fetchMessages = async (isPolling = false) => {
    try {
      const res = await api.get(`/conversations/${id}/messages`);
      const msgs = res.data?.data || res.data || [];
      if (Array.isArray(msgs)) {
        setMessages(prev => {
          if (isPolling && prev.length === msgs.length) {
            return prev;
          }
          return msgs;
        });
      }
    } catch (err) {
      if (!isPolling) console.warn('Failed to load messages:', err);
    }
  };

  const fetchConversationDetails = async () => {
    try {
      const res = await api.get(`/conversations/${id}`);
      const convo = res.data?.data || res.data;
      if (convo) {
        setConversation(convo);
        const isVendor = user?.id === convo.vendor_id;
        const participant = isVendor ? convo.customer : convo.vendor;
        setParticipantName(participant?.name || convo.project?.title || 'Chat');
      }
    } catch (err) {
      console.warn('Failed to load conversation details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchConversationDetails();
    fetchMessages();

    // 5-second polling interval for real-time chat updates (matching FindMyInterior)
    pollingInterval.current = setInterval(() => {
      fetchMessages(true);
    }, 5000);

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [id]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    setSending(true);
    setInputText('');

    const tempId = Date.now();
    const optimistic: Message = {
      id: tempId,
      message: text,
      sender_id: user?.id || 0,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimistic]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const res = await api.post(`/conversations/${id}/messages`, { message: text });
      const newMsg = res.data?.data || res.data;
      if (newMsg?.id) {
        setMessages(prev => prev.map(m => m.id === tempId ? newMsg : m));
      }
      fetchMessages(true);
    } catch {
      // Keep optimistic message on screen
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMsgText = (item: Message) =>
    item.message || item.content || item.body || '';

  const isMine = (item: Message) =>
    item.sender_id === user?.id || item.sender_id === 0;

  const getAvatar = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=E8701A&color=fff&size=100`;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>
        
        <Image
          source={{ uri: getAvatar(participantName) }}
          style={styles.headerAvatar}
        />
        
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName} numberOfLines={1}>{participantName}</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerSub}>Online • TrueDial Instant Chat</Text>
          </View>
        </View>
      </View>

      {/* ── Project / Requirement Info Banner ── */}
      {conversation?.project && (
        <View style={styles.projectBanner}>
          <Info size={16} color="#E8701A" style={{ marginTop: 2, marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.projectTitle} numberOfLines={1}>
              {conversation.project.title}
            </Text>
            {conversation.project.budget_min && (
              <Text style={styles.projectSub}>
                Budget: ₹{conversation.project.budget_min} - ₹{conversation.project.budget_max || conversation.project.budget_min}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* ── Messages & Input ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#E8701A" />
            <Text style={styles.loadingText}>Loading messages…</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            style={styles.flex}
            data={messages}
            keyExtractor={(item, i) => String(item.id || i)}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconWrap}>
                  <MessageSquare size={28} color="#E8701A" />
                </View>
                <Text style={styles.emptyTitle}>Start the Conversation</Text>
                <Text style={styles.emptyText}>Send a message to discuss requirements & services 👋</Text>
              </View>
            }
            renderItem={({ item }) => {
              const mine = isMine(item);
              const text = getMsgText(item);
              return (
                <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
                  {!mine && item.sender?.name && (
                    <Text style={styles.senderLabel}>{item.sender.name}</Text>
                  )}
                  <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                    <Text style={[styles.bubbleText, mine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
                      {text}
                    </Text>
                    <Text style={[styles.timestamp, mine ? styles.timestampMine : styles.timestampTheirs]}>
                      {formatTime(item.created_at)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* ── Input Bar ── */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            returnKeyType="default"
            onSubmitEditing={Platform.OS === 'ios' ? undefined : handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            activeOpacity={0.75}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Send size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex: {
    flex: 1,
  },
  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: '#E8701A',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
    marginRight: 5,
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  // ── Project Banner ──
  projectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 1,
    borderBottomColor: '#FFEDD5',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  projectTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9A3412',
  },
  projectSub: {
    fontSize: 11,
    color: '#C2410C',
    marginTop: 1,
  },
  // ── Messages ──
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 8,
  },
  listContent: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  // ── Bubbles ──
  row: {
    marginVertical: 4,
    maxWidth: '82%',
  },
  rowMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  rowTheirs: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E8701A',
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: '#E8701A',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMine: {
    color: '#FFFFFF',
  },
  bubbleTextTheirs: {
    color: '#0F172A',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampMine: {
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'right',
  },
  timestampTheirs: {
    color: '#94A3B8',
  },
  // ── Input Bar ──
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 120,
    marginRight: 8,
    minHeight: 42,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8701A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8701A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 5,
  },
  sendBtnDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
});
