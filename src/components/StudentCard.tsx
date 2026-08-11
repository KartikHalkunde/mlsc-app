import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { colors, radius } from '../theme';
import { PersonProfile } from '../types';

type Props = {
  person: PersonProfile;
  isFriend?: boolean;
  onPress: () => void;
  onToggleFriend?: () => void;
  mutualCount?: number;
};

export function StudentCard({
  person,
  isFriend = false,
  onPress,
  onToggleFriend,
  mutualCount = 0,
}: Props) {
  return (
    <Pressable
      style={s.wrap}
      onPress={onPress}
      android_ripple={{ color: colors.onSurface + '0D' }}
    >
      <Avatar avatarId={person.avatar} name={person.name} size={44} />
      <View style={s.info}>
        <Text style={s.name} numberOfLines={1}>{person.name}</Text>
        <Text style={s.meta} numberOfLines={1}>
          {person.branch} · {person.year}
        </Text>
        {mutualCount > 0 && (
          <View style={s.mutualRow}>
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text style={s.mutual}>
              <Text style={{color: colors.primary}}>{mutualCount}</Text> mutual friend{mutualCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
      {isFriend ? (
        <View style={s.friendTag}>
          <Ionicons name="checkmark" size={14} color={colors.onSecondaryContainer} />
          <Text style={s.friendTagText}>Friend</Text>
        </View>
      ) : onToggleFriend ? (
        <Pressable
          style={s.addBtn}
          onPress={onToggleFriend}
          android_ripple={{ color: colors.primary + '1A' }}
          hitSlop={8}
        >
          <Ionicons name="person-add-outline" size={16} color={colors.primary} />
          <Text style={s.addBtnText}>Add Friend</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    marginBottom: 12,
  },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
  },
  meta: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  mutualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  mutual: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  friendTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  friendTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSecondaryContainer,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
