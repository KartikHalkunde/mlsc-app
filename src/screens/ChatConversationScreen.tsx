import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { useChat } from '../context/ChatContext';
import { getPerson } from '../data/events';
import { colors, radius, spacing, elevation } from '../theme';

export function ChatConversationScreen({ route, navigation }: any) {
  const { conversationId, participantId } = route.params;
  const { messages, sendMessage, conversations } = useChat();
  const conversation = conversations.find(c => c.id === conversationId);
  const isGroup = conversation?.isGroup;
  
  const person = getPerson(participantId);
  const name = isGroup ? 'MLSC Group' : (person?.name ?? 'Chat');
  const avatarId = isGroup ? 'mlsc' : person?.avatar;
  const status = isGroup ? '5 members' : 'Online';

  const msgs = messages.filter(m => m.conversationId === conversationId);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(conversationId, input.trim());
    setInput('');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={[s.header, elevation.level1]}>
          <Pressable onPress={() => navigation.goBack()} style={[s.backBtn, { zIndex: 10 }]}>
            <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
          </Pressable>
          <View style={s.headerCenterWrap}>
            <Avatar avatarId={avatarId} name={name} size={36} />
            <View style={s.headerTextWrap}>
              <Text style={s.headerName}>{name}</Text>
              <Text style={s.headerStatus}>{status}</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={msgs}
          keyExtractor={(m) => m.id}
          contentContainerStyle={s.messageList}
          renderItem={({ item, index }) => {
            const isSelf = item.senderId === 'self';
            const nextMsg = msgs[index + 1];
            const isLastInGroup = !nextMsg || nextMsg.senderId !== item.senderId;

            return (
              <View style={[
                s.bubbleWrap, 
                isSelf ? s.bubbleWrapSelf : s.bubbleWrapOther,
                !isLastInGroup && { marginBottom: 2 }
              ]}>
                <View style={[
                  s.bubble, 
                  isSelf ? s.bubbleSelf : s.bubbleOther,
                  !isLastInGroup && (isSelf ? { borderBottomRightRadius: radius.lg } : { borderBottomLeftRadius: radius.lg })
                ]}>
                  {item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={s.msgImage} />
                  )}
                  {item.text ? <Text style={[s.bubbleText, isSelf ? s.bubbleTextSelf : s.bubbleTextOther]}>{item.text}</Text> : null}
                  <View style={s.timeRow}>
                    <Text style={[s.bubbleTime, isSelf ? s.bubbleTimeSelf : s.bubbleTimeOther]}>{item.time}</Text>
                    {isSelf && (
                      <Ionicons 
                        name={item.read ? "checkmark-done" : "checkmark"} 
                        size={14} 
                        color={item.read ? "#4CAF50" : (colors.onPrimary + '99')} 
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* Input */}
        <View style={[s.inputBar, elevation.level2]}>
          <View style={s.textInputWrap}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Message..."
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              style={s.textInput}
              multiline
            />
          </View>
          <Pressable onPress={handleSend} style={[s.sendBtn, input.trim().length > 0 ? s.sendBtnActive : s.sendBtnInactive]}>
            <Ionicons name="send" size={18} color={input.trim().length > 0 ? colors.onPrimary : colors.onSurfaceVariant} style={{ marginLeft: 2 }} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.surface },
  backBtn: { height: 40, width: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  headerCenterWrap: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, pointerEvents: 'none' },
  headerTextWrap: { justifyContent: 'center' },
  headerName: { fontSize: 16, fontWeight: '600', color: colors.onSurface },
  headerStatus: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  messageList: { padding: 16, paddingBottom: 8 },
  bubbleWrap: { marginBottom: 12, width: '100%' },
  bubbleWrapSelf: { alignItems: 'flex-end' },
  bubbleWrapOther: { alignItems: 'flex-start' },
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.xl },
  bubbleSelf: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.surfaceContainerHigh, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextSelf: { color: colors.onPrimary },
  bubbleTextOther: { color: colors.onSurface },
  msgImage: { width: 220, height: 160, borderRadius: radius.md, marginBottom: 8, backgroundColor: '#eee' },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  bubbleTime: { fontSize: 10, fontWeight: '500' },
  bubbleTimeSelf: { color: colors.onPrimary + 'B3' },
  bubbleTimeOther: { color: colors.onSurfaceVariant },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, paddingBottom: 16, backgroundColor: colors.surface, gap: 10 },
  textInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerHigh, borderRadius: 22, minHeight: 44 },
  textInput: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15, color: colors.onSurface, maxHeight: 100 },
  sendBtn: { height: 44, width: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: { backgroundColor: colors.primary },
  sendBtnInactive: { backgroundColor: colors.surfaceContainerHigh },
});
