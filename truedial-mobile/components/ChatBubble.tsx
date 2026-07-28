import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isMine: boolean;
  senderName?: string;
}

export default function ChatBubble({ message, timestamp, isMine, senderName }: ChatBubbleProps) {
  return (
    <View style={[styles.wrapper, isMine ? styles.wrapperMine : styles.wrapperTheirs]}>
      {!isMine && senderName && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.messageText, isMine ? styles.textMine : styles.textTheirs]}>
          {message}
        </Text>
        <Text style={[styles.timestamp, isMine ? styles.timestampMine : styles.timestampTheirs]}>
          {timestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  wrapperMine: {
    alignItems: 'flex-end',
  },
  wrapperTheirs: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E8701A',
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: '#E8701A',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  textMine: {
    color: '#FFFFFF',
  },
  textTheirs: {
    color: '#1E293B',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampMine: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  timestampTheirs: {
    color: '#94A3B8',
  },
});
