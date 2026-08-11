import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CampusEvent } from '../types';
import { getClub } from '../data/events';
import { colors, radius } from '../theme';

type Props = {
  event: CampusEvent;
  onPress: () => void;
};

export function SearchEventCard({ event, onPress }: Props) {
  const club = getClub(event.clubId);
  return (
    <View style={s.wrap}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.onSurface + '1A' }}
        style={s.inner}
      >
        <Image source={{ uri: event.image }} style={s.image} />
        
        <View style={s.info}>
          <Text style={s.title} numberOfLines={1}>{event.title}</Text>
          
          <View style={s.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={s.metaText}>{event.day} {event.month} 2026 • {event.time}</Text>
          </View>
          
          <View style={s.metaRow}>
            <Ionicons name="business-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={s.metaText}>by {club.name}</Text>
          </View>
        </View>
        

      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  image: {
    width: 90,
    height: 70,
    borderRadius: radius.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  bookmark: {
    paddingLeft: 8,
  },
});
