import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from './Avatar';
import { ClubMark } from './EventCard';
import { colors, radius, elevation } from '../theme';

type Props = {
  id: string;
  type: 'club' | 'student' | 'event';
  title: string;
  subtitle: string;
  imageUrl?: string;
  avatarId?: string; // for students
  clubId?: any; // for clubs
  mutualCount?: number;
  onPress: () => void;

};

export function SquareCard({
  type,
  title,
  subtitle,
  avatarId,
  clubId,
  mutualCount = 0,
  onPress,

}: Props) {
  return (
    <Pressable
      style={s.card}
      onPress={onPress}
      android_ripple={{ color: colors.onSurface + '0D' }}
    >
      <View style={s.centerWrap}>
        {type === 'club' ? (
          <ClubMark clubId={clubId} size={56} />
        ) : type === 'student' ? (
          <Avatar avatarId={avatarId} name={title} size={56} />
        ) : (
          <View style={[s.eventIcon, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="calendar-outline" size={28} color={colors.primary} />
          </View>
        )}
      </View>

      <Text style={s.title} numberOfLines={1}>{title}</Text>
      <Text style={s.subtitle} numberOfLines={1}>{subtitle}</Text>

      {mutualCount > 0 && (
        <View style={s.footerRow}>
          <AvatarGroup avatarIds={[{id:'m1',name:''},{id:'f2',name:''},{id:'m3',name:''}]} size={16} />
          <Text style={s.mutualText}>{mutualCount} {type === 'student' ? 'mutual friends' : 'friends'}</Text>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    marginRight: 12,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  centerWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
  },
  mutualText: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
  }
});
