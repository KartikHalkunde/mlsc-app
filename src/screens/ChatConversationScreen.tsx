import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { getConversationMessages } from '../data/chat';
import { getPerson } from '../data/events';
import { ChatMessage } from '../types';
import { colors, radius, spacing, elevation } from '../theme';

export function ChatConversationScreen({ route, navigation }: any) {
  const { conversationId, participantId } = route.params;
  const person = getPerson(participantId);
  const [msgs, setMsgs] = useState<ChatMessage[]>(getConversationMessages(conversationId));
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      conversationId,
      senderId: 'self',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMsgs((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={[s.header, elevation.level1]}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </Pressable>
        <Avatar avatarId={person?.avatar} name={person?.name} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={s.headerName}>{person?.name ?? 'Chat'}</Text>
          <Text style={s.headerStatus}>Online</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={msgs}
        keyExtractor={(m) => m.id}
        contentContainerStyle={s.messageList}
        renderItem={({ item }) => {
          const isSelf = item.senderId === 'self';
          return (
            <View style={[s.bubble, isSelf ? s.bubbleSelf : s.bubbleOther]}>
              <Text style={[s.bubbleText, isSelf ? s.bubbleTextSelf : s.bubbleTextOther]}>{item.text}</Text>
              <Text style={[s.bubbleTime, isSelf ? s.bubbleTimeSelf : s.bubbleTimeOther]}>{item.time}</Text>
            </View>
          );
        }}
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.inputBar, elevation.level2]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            style={s.textInput}
            multiline
          />
          <Pressable onPress={sendMessage} style={[s.sendBtn, input.trim().length > 0 && s.sendBtnActive]}>
            <Ionicons name="send" size={20} color={input.trim().length > 0 ? colors.onPrimary : colors.onSurfaceVariant} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.surface },
  backBtn: { height: 40, width: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  headerName: { fontSize: 16, fontWeight: '600', color: colors.onSurface },
  headerStatus: { fontSize: 11, color: colors.primary, fontWeight: '500', marginTop: 1 },
  messageList: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '78%', padding: 12, borderRadius: radius.lg, marginBottom: 8 },
  bubbleSelf: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: radius.xs },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: colors.surfaceContainerHigh, borderBottomLeftRadius: radius.xs },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextSelf: { color: colors.onPrimary },
  bubbleTextOther: { color: colors.onSurface },
  bubbleTime: { fontSize: 10, marginTop: 4 },
  bubbleTimeSelf: { color: colors.onPrimary + 'B0', textAlign: 'right' },
  bubbleTimeOther: { color: colors.onSurfaceVariant },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 12, paddingVertical: 8, paddingBottom: 12, backgroundColor: colors.surface },
  textInput: { flex: 1, backgroundColor: colors.surfaceContainerHigh, borderRadius: radius.xl, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: colors.onSurface, maxHeight: 100 },
  sendBtn: { height: 42, width: 42, borderRadius: 21, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: { backgroundColor: colors.primary },
});
