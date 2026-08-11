import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CampusEvent } from '../types';
import { getClub } from '../data/events';
import { AvatarGroup } from './AvatarGroup';
import { colors, radius, elevation } from '../theme';

type Props = {
  event: CampusEvent;
  onPress: () => void;

};

export function CompactEventCard({ event, onPress }: Props) {
  const club = getClub(event.clubId);
  return (
    <View style={s.wrap}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.onSurface + '1A' }}
        style={s.inner}
      >
        {/* Left Image */}
        <ImageBackground source={{ uri: event.image }} style={s.image} imageStyle={s.imageInner}>
          <View style={s.dateBlock}>
            <Text style={s.dateDay}>{event.day}</Text>
            <Text style={s.dateMonth}>{event.month}</Text>
          </View>
        </ImageBackground>

        {/* Right Info */}
        <View style={s.info}>
          <View style={s.infoHeader}>
            <Text style={s.title} numberOfLines={1}>{event.title}</Text>

          </View>
          
          <Text style={s.clubText} numberOfLines={1}>
            by <Text style={[s.clubName, { color: colors.primary }]}>{club.name}</Text>
          </Text>
          
          <View style={s.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={s.metaText}>{event.time}</Text>
          </View>
          <View style={s.metaRow}>
            <Ionicons name="location-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={s.metaText}>{event.venue}</Text>
          </View>
          
          <View style={s.footer}>
            <View style={s.avatars}>
              <AvatarGroup avatarIds={[{id:'m1',name:''},{id:'f2',name:''},{id:'m3',name:''},{id:'f4',name:''}]} size={22} />
              <View style={s.plusWrap}>
                <Text style={s.plusText}>+{event.attendees > 99 ? '99' : event.attendees}</Text>
              </View>
            </View>
            <View style={s.catWrap}>
              <Text style={s.catText}>{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</Text>
            </View>
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
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  inner: {
    flexDirection: 'row',
    height: 140,
  },
  image: {
    width: 120,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  imageInner: {
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  dateBlock: {
    backgroundColor: '#fff',
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dateDay: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 18,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  bookmark: {
    marginTop: -2,
    marginRight: -2,
  },
  clubText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
    marginBottom: 6,
  },
  clubName: {
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plusWrap: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  plusText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  catWrap: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  catText: {
    fontSize: 10,
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
});
