import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ChatListItem } from '../components/ChatListItem';
import { EmptyState } from '../components/EmptyState';
import { conversations } from '../data/chat';
import { getPerson } from '../data/events';
import { colors, radius, spacing } from '../theme';

export function ChatScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('all');
  const [q, setQ] = useState('');
  const [readConversations, setReadConversations] = useState<Set<string>>(new Set());

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={{ width: 80 }} />
        <Text style={s.headerTitle}>Chats</Text>
        <View style={s.headerRight}>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsRow}>
          <TabItem label="All" active={activeTab === 'all'} onPress={() => setActiveTab('all')} />
          <TabItem label="Unread" active={activeTab === 'unread'} onPress={() => setActiveTab('unread')} />
          <TabItem label="Groups" active={activeTab === 'groups'} onPress={() => setActiveTab('groups')} />
          <TabItem label="Requests" active={activeTab === 'requests'} onPress={() => setActiveTab('requests')} />
        </ScrollView>

        {/* Search Bar */}
        <View style={s.searchRow}>
          <View style={s.searchBar}>
            <Ionicons name="search" size={20} color={colors.onSurfaceVariant} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search messages or people..."
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              style={s.searchInput}
            />
            {q.length > 0 && (
              <Pressable onPress={() => setQ('')} hitSlop={8}>
                <Ionicons name="close-circle" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Chat List */}
        {conversations.length > 0 ? (
          <View style={s.list}>
            {conversations.map((conv, i) => {
              const person = getPerson(conv.participantId);
              if (!person) return null;
              
              // Handle group mock for "ML Club Group" or others
              const isGroup = person.name.includes('Group');
              let displayMsg = conv.lastMessage;
              if (isGroup && displayMsg === "Let's meet up today!") {
                displayMsg = "Neha: New announcement uploaded";
              }

              const displayUnread = readConversations.has(conv.id) ? 0 : conv.unreadCount;

              return (
                <View key={conv.id} style={s.listItemWrap}>
                  <ChatListItem
                    avatarId={person.avatar}
                    name={person.name}
                    lastMessage={displayMsg}
                    time={conv.time}
                    unreadCount={displayUnread}
                    online={i < 2}
                    onPress={() => {
                      setReadConversations(prev => new Set(prev).add(conv.id));
                      navigation.navigate('ChatConversation', { conversationId: conv.id, participantId: conv.participantId });
                    }}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <EmptyState
            icon="chatbubbles-outline"
            title="No messages yet"
            subtitle="Start a conversation with your friends!"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TabItem({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) {
  return (
    <Pressable style={[s.tab, active && s.tabActive]} onPress={onPress}>
      <Text style={[s.tabText, active && s.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onBackground,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scroll: { paddingBottom: 110 },
  tabsRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  tabTextActive: {
    color: '#fff',
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.onSurface,
  },
  list: { 
    backgroundColor: '#fff', 
  },
  listItemWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surfaceContainerHigh,
  },
});
