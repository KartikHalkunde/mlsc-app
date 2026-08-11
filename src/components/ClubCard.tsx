import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClubMark } from './EventCard';
import { AvatarGroup } from './AvatarGroup';
import { colors, radius, elevation } from '../theme';
import { Club } from '../types';

type Props = {
  club: Club;
  onPress: () => void;
  mutualCount?: number;
};

export function ClubCard({ club, onPress, mutualCount = 0 }: Props) {
  return (
    <View style={s.wrap}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.onSurface + '0D' }}
        style={s.inner}
      >
        <ClubMark clubId={club.id} size={48} />
        <View style={s.info}>
          <Text style={s.name} numberOfLines={1}>{club.name}</Text>
          <Text style={s.meta} numberOfLines={1}>{club.tagline || club.shortName}</Text>
          
          <View style={s.mutualRow}>
            <Ionicons name="people-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={s.mutual}>
              {club.members} • {mutualCount > 0 && <Text style={{color: colors.primary}}>{mutualCount} friends are members</Text>}
            </Text>
            {mutualCount > 0 && (
              <View style={{marginLeft: 4}}>
                <AvatarGroup avatarIds={[{id:'m1',name:''},{id:'f2',name:''},{id:'m3',name:''}]} size={16} />
              </View>
            )}
          </View>
        </View>
        <Pressable
          style={s.viewBtn}
          onPress={onPress}
          android_ripple={{ color: colors.primary + '1A' }}
          hitSlop={8}
        >
          <Text style={s.viewBtnText}>View Club</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
    marginBottom: 12,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
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
    marginTop: 6,
  },
  mutual: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  viewBtn: {
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
