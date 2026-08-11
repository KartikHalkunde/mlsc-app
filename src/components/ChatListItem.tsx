import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { colors } from '../theme';

type Props = {
  avatarId?: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  online?: boolean;
  onPress: () => void;
};

export function ChatListItem({
  avatarId,
  name,
  lastMessage,
  time,
  unreadCount = 0,
  online = false,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={s.wrap}
      android_ripple={{ color: colors.onSurface + '0D' }}
    >
      <View style={s.avatarWrap}>
        <Avatar avatarId={avatarId} name={name} size={48} />
        {online && <View style={s.onlineIndicator} />}
      </View>
      <View style={s.info}>
        <View style={s.topRow}>
          <Text style={[s.name, unreadCount > 0 && s.nameUnread]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[s.time, unreadCount > 0 && s.timeUnread]}>{time}</Text>
        </View>
        <View style={s.bottomRow}>
          <Text
            style={[s.message, unreadCount > 0 && s.messageUnread]}
            numberOfLines={1}
          >
            {lastMessage.includes(': ') ? (
              <>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                  {lastMessage.split(': ')[0]}: 
                </Text>
                {lastMessage.split(': ')[1]}
              </>
            ) : (
              lastMessage
            )}
          </Text>
          {unreadCount > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatarWrap: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34A853',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  info: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.onSurface,
    flex: 1,
    marginRight: 8,
  },
  nameUnread: {
    fontWeight: '700',
  },
  time: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  timeUnread: {
    fontWeight: '600',
    color: colors.onSurface,
  },
  message: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    flex: 1,
    marginRight: 8,
  },
  messageUnread: {
    color: colors.onSurface,
    fontWeight: '500',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});
