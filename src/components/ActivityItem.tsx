import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { colors, radius } from '../theme';

type Props = {
  avatarId?: string;
  name: string;
  action: string; // e.g. "joined CSI Student Chapter"
  time: string;
  onPress?: () => void;
};

export function ActivityItem({ avatarId, name, action, time, onPress }: Props) {
  // Parse action to split into action verb and target
  let verb = '';
  let target = '';
  if (action.startsWith('joined ')) {
    verb = 'joined';
    target = action.replace('joined ', '');
  } else if (action.startsWith('registered for ')) {
    verb = 'registered for';
    target = action.replace('registered for ', '');
  } else if (action.startsWith('attended ')) {
    verb = 'attended';
    target = action.replace('attended ', '');
  } else if (action.startsWith('is attending ')) {
    verb = 'is attending';
    target = action.replace('is attending ', '');
  } else {
    verb = action;
  }

  let iconName: keyof typeof Ionicons.glyphMap = 'notifications';
  if (verb === 'joined') iconName = 'people';
  else if (verb.includes('register')) iconName = 'ticket';
  else if (verb.includes('attend')) iconName = 'calendar';

  return (
    <Pressable
      onPress={onPress}
      style={s.wrap}
      android_ripple={{ color: colors.onSurface + '0D' }}
    >
      <View style={s.avatarWrap}>
        <Avatar avatarId={avatarId} name={name} size={42} />
        <View style={s.badge}>
          <Ionicons name={iconName} size={10} color={colors.primary} />
        </View>
      </View>
      <View style={s.info}>
        <Text style={s.textTop}>
          <Text style={s.bold}>{name}</Text> {verb}
        </Text>
        {target ? <Text style={s.textBottom}>{target}</Text> : null}
      </View>
      <Text style={s.time}>{time.replace(' ago', '').replace('min', 'm').replace('hrs', 'h').replace('hr', 'h')}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + '30',
  },
  avatarWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primaryContainer,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  info: { flex: 1, justifyContent: 'center' },
  textTop: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  textBottom: {
    fontSize: 14,
    color: colors.onSurface,
    marginTop: 2,
  },
  bold: {
    fontWeight: '700',
    color: colors.onSurface,
  },
  time: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
});
