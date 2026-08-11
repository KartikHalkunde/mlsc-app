import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CampusEvent } from '../types';
import { getClub } from '../data/events';
import { colors, radius, elevation } from '../theme';

// ── Club Mark (logo placeholder) ────────────────────────────────────
export function ClubMark({
  clubId,
  size = 40,
}: {
  clubId: string;
  size?: number;
}) {
  const c = getClub(clubId);
  if (c.logo) {
    return (
      <View
        style={[
          s.mark,
          {
            height: size,
            width: size,
            borderRadius: size * 0.28,
            backgroundColor: '#fff',
            overflow: 'hidden',
          },
        ]}
      >
        <Image
          source={{ uri: c.logo }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        s.mark,
        {
          height: size,
          width: size,
          borderRadius: size * 0.28,
          backgroundColor: c.color,
        },
      ]}
    >
      <Text style={[s.markText, { fontSize: size * 0.28 }]}>
        {c.shortName === 'VCET SC' ? 'SC' : c.shortName}
      </Text>
    </View>
  );
}

// ── Event Card ──────────────────────────────────────────────────────
export function EventCard({
  event,
  onPress,
  featured = false,
}: {
  event: CampusEvent;
  onPress: () => void;
  featured?: boolean;
}) {
  const club = getClub(event.clubId);
  return (
    <View style={[s.cardWrapper, featured && s.featuredWrapper, elevation.level1]}>
      <Pressable
        style={s.card}
        onPress={onPress}
        android_ripple={{ color: colors.onSurface + '1A' }}
      >
        <ImageBackground
          source={{ uri: event.image }}
          style={[s.image, featured && s.featuredImage]}
          imageStyle={s.imageInner}
        >
          <View style={s.shade} />
          <View style={s.top}>
            <ClubMark clubId={event.clubId} size={36} />
            <View style={s.date}>
              <Text style={s.dateNum}>{event.day}</Text>
              <Text style={s.dateMonth}>{event.month}</Text>
            </View>
          </View>
          {featured && (
            <View style={s.featuredCopy}>
              <Text style={s.featuredKicker}>FEATURED EVENT</Text>
              <Text style={s.featuredTitle}>{event.title}</Text>
            </View>
          )}
        </ImageBackground>
        <View style={s.body}>
          <View style={s.clubLine}>
            <View style={[s.clubDot, { backgroundColor: club.color }]} />
            <Text style={s.clubName}>
              {club.shortName} · {club.tagline}
            </Text>
          </View>
          {!featured && <Text style={s.title}>{event.title}</Text>}
          <View style={s.metaRow}>
            <View style={s.meta}>
              <Ionicons name="time-outline" size={14} color={colors.primary} />
              <Text style={s.metaText}>{event.time}</Text>
            </View>
            <View style={s.meta}>
              <Ionicons name="location-outline" size={14} color={colors.onSurfaceVariant} />
              <Text style={s.metaText}>{event.venue}</Text>
            </View>
          </View>
          <View style={s.footer}>
            <View style={s.attendeeChip}>
              <Ionicons name="people-outline" size={14} color={colors.primary} />
              <Text style={s.attendeeText}>{event.attendees} interested</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  // Mark
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: '#fff',
    fontWeight: '800',
  },

  // Card
  cardWrapper: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerLowest,
    overflow: 'hidden',
    marginBottom: 16,
  },
  featuredWrapper: {
    marginBottom: 20,
  },
  card: {
    flex: 1,
  },
  image: {
    height: 150,
    justifyContent: 'space-between',
  },
  featuredImage: {
    height: 220,
  },
  imageInner: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  shade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  top: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  date: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  dateNum: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 18,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  featuredCopy: {
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  featuredKicker: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.primaryContainer,
  },
  featuredTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: '#fff',
    fontWeight: '700',
    marginTop: 4,
  },

  // Body
  body: {
    padding: 14,
  },
  clubLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clubDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  clubName: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    color: colors.onSurface,
    fontWeight: '700',
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    flexShrink: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant + '60',
  },
  attendeeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  attendeeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});
