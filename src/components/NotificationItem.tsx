import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { colors } from '../theme';

type Props = {
  avatarId?: string;
  name: string;
  action: string;
  time: string;
  read?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress?: () => void;
};

export function NotificationItem({
  avatarId,
  name,
  action,
  time,
  read = true,
  icon = 'notifications',
  iconColor = colors.primary,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.wrap, !read && s.unread]}
      android_ripple={{ color: colors.onSurface + '0D' }}
    >
      <View style={s.avatarWrap}>
        <Avatar avatarId={avatarId} name={name} size={42} />
        <View style={[s.badge, { backgroundColor: iconColor }]}>
          <Ionicons name={icon} size={12} color="#fff" />
        </View>
      </View>
      <View style={s.info}>
        <Text style={s.text} numberOfLines={2}>
          <Text style={s.bold}>{name}</Text> {action}
        </Text>
        <Text style={s.time}>{time}</Text>
      </View>
      {!read && <View style={s.dot} />}
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  unread: {
    backgroundColor: colors.primaryContainer + '30',
  },
  avatarWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  info: { flex: 1 },
  text: {
    fontSize: 13,
    color: colors.onSurface,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '600',
  },
  time: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
