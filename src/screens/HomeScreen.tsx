import React, { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { SectionHeader } from '../components/SectionHeader';
import { ActivityItem } from '../components/ActivityItem';
import { AvatarGroup } from '../components/AvatarGroup';
import { Button } from '../components/Button';
import { events, clubs } from '../data/events';
import { feedItems } from '../data/feed';
import { notifications } from '../data/notifications';
import { useStudent } from '../context/UserContext';
import { colors, radius, spacing, elevation } from '../theme';

export function HomeScreen({ navigation }: any) {
  const { student } = useStudent();
  const [activeSlide, setActiveSlide] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const featuredEvents = events.filter((e) => e.featured).slice(0, 3);
  if (featuredEvents.length === 0) featuredEvents.push(events[0]);
  const upcomingEvents = events.filter((e) => !featuredEvents.find(f => f.id === e.id)).slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = student?.name.split(' ')[0] ?? '';

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Clubs the student hasn't joined
  const suggestedClubs = clubs.filter((c) => !student?.clubs.includes(c.id));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Header ─────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Image 
              source={{ uri: 'https://media.licdn.com/dms/image/v2/D4D0BAQFrDaN60ahXxw/company-logo_200_200/company-logo_200_200/0/1734353281710/vcetvasai_logo?e=1787788800&v=beta&t=a0OAG4muWpYg-LASHFdzkQrpqSiClhFhFQjTk0AEyjA' }} 
              style={s.collegeLogo} 
              resizeMode="contain"
            />
            <Text style={s.headerCollegeName}>VCET</Text>
          </View>
          <View style={s.headerRight}>
            <Pressable
              onPress={() => navigation.navigate('Notifications')}
              style={s.notifBtn}
              android_ripple={{ color: colors.onSurface + '1A', borderless: true, radius: 24 }}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.onSurface} />
              <View style={s.notifBadge} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Profile')}>
              <Avatar avatarId={student?.avatar} name={student?.name} size={40} />
            </Pressable>
          </View>
        </View>

        {/* ── Featured Event Carousel ─────────────────────────────────── */}
        <View style={s.featuredCardWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              if (slide !== activeSlide) setActiveSlide(slide);
            }}
            scrollEventThrottle={16}
          >
            {featuredEvents.map((featured) => (
              <View key={featured.id} style={[s.featuredCard, { width: screenWidth - 32 }]}>
                <ImageBackground
                  source={{ uri: featured.image }}
                  style={StyleSheet.absoluteFill}
                  imageStyle={{ opacity: 0.85 }}
                >
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(9, 2, 29, 0.4)' }]} />
                </ImageBackground>

                <View style={s.featuredContent}>
                  <View style={s.featuredBadge}>
                    <Text style={s.featuredBadgeText}>FEATURED EVENT</Text>
                  </View>
                  <Text style={s.featuredTitle}>{featured.title}</Text>

                  <View style={s.featuredMeta}>
                    <Ionicons name="calendar-outline" size={14} color="#E0E0E0" />
                    <Text style={s.featuredMetaText}>{featured.day} {featured.month} 2026 • {featured.time}</Text>
                  </View>
                  <View style={s.featuredMeta}>
                    <Ionicons name="location-outline" size={14} color="#E0E0E0" />
                    <Text style={s.featuredMetaText}>{featured.venue}</Text>
                  </View>

                  <Pressable style={s.featuredBtn} onPress={() => navigation.navigate('Event', { id: featured.id })}>
                    <Text style={s.featuredBtnText}>View Details</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* Carousel dots */}
          <View style={s.carouselDots}>
            {featuredEvents.map((_, i) => (
              <View key={i} style={[s.dot, activeSlide === i && s.dotActive]} />
            ))}
          </View>
        </View>

        {/* ── Your Feed ──────────────────────────────────────── */}
        <SectionHeader title="Your Feed" />
        <View style={s.feedCard}>
          {feedItems.slice(0, 4).map((item) => (
            <ActivityItem
              key={item.id}
              avatarId={item.avatarId}
              name={item.name}
              action={item.action}
              time={item.time}
              onPress={() => item.userId && navigation.navigate('UserProfile', { userId: item.userId })}
            />
          ))}
        </View>

        {/* ── Upcoming Events ────────────────────────────────── */}
        <View style={{ marginTop: 24 }}>
          <SectionHeader
            title="Upcoming Events"
            actionLabel="See all"
            onAction={() => navigation.navigate('Events')}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.horizontalScroll}
        >
          {upcomingEvents.map((e) => (
            <Pressable key={e.id} style={s.verticalEventCard} onPress={() => navigation.navigate('Event', { id: e.id })}>
              <ImageBackground source={{ uri: e.image }} style={s.vecImage} imageStyle={s.vecImageInner}>
                <View style={s.vecDate}>
                  <Text style={s.vecDateNum}>{e.day}</Text>
                  <Text style={s.vecDateMonth}>{e.month}</Text>
                </View>
              </ImageBackground>
              <View style={s.vecBody}>
                <Text style={s.vecTitle} numberOfLines={1}>{e.title}</Text>
                <Text style={s.vecMeta} numberOfLines={1}>{e.time.split(' ')[0]} {e.time.split(' ')[1]} • {e.venue}</Text>

                <View style={s.vecCatWrap}>
                  <Text style={s.vecCat}>{e.category.charAt(0).toUpperCase() + e.category.slice(1)}</Text>
                </View>

                <View style={s.vecFooter}>
                  <AvatarGroup avatarIds={[{ id: 'm1', name: '' }, { id: 'f2', name: '' }, { id: 'm3', name: '' }, { id: 'f4', name: '' }]} size={24} />
                  <View style={s.vecPlusWrap}><Text style={s.vecPlusText}>+{e.attendees > 99 ? '99' : e.attendees}</Text></View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Clubs You May Like ─────────────────────────────── */}
        <View style={{ marginTop: 24 }}>
          <SectionHeader title="Clubs You May Like" actionLabel="See all" onAction={() => navigation.navigate('List', { title: 'Clubs You May Like', type: 'clubs', dataIds: suggestedClubs.map(c => c.id) })} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.horizontalScroll}
        >
          {suggestedClubs.map((club) => {
            return (
              <Pressable key={club.id} style={s.verticalClubCard} onPress={() => navigation.navigate('ClubProfile', { clubId: club.id })}>

                <View style={s.vccLogoWrap}>
                  {club.logo ? (
                    <Image source={{ uri: club.logo }} style={s.vccLogo} />
                  ) : (
                    <View style={[s.vccLogo, { backgroundColor: club.color, alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{club.shortName}</Text>
                    </View>
                  )}
                </View>
                <Text style={s.vccName} numberOfLines={1}>{club.name}</Text>
                <Text style={s.vccMembers}>{club.members}</Text>
                <View style={s.vccFooter}>
                  <AvatarGroup avatarIds={[{ id: 'm1', name: '' }, { id: 'f2', name: '' }, { id: 'm3', name: '' }]} size={20} />
                  <Text style={s.vccFriends}>3 friends</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 110 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collegeLogo: {
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  headerCollegeName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.onBackground,
    letterSpacing: 0.5,
  },
  notifBtn: {
    height: 44,
    width: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.background,
  },

  // Featured
  featuredCardWrap: {
    marginBottom: 8,
  },
  featuredCard: {
    backgroundColor: '#09021D', // Dark background for the card
    borderRadius: radius.lg,
    overflow: 'hidden',
    minHeight: 180,
  },
  featuredContent: {
    padding: 20,
  },
  featuredBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: '#D0BCFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  featuredMetaText: {
    color: '#E0E0E0',
    fontSize: 13,
  },
  featuredBtn: {
    backgroundColor: '#6750A4',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    marginTop: 12,
  },
  featuredBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.outlineVariant,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },

  // Feed
  feedCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },

  // Horizontal scroll
  horizontalScroll: {
    paddingRight: 16,
    gap: 12,
  },

  // Vertical Event Card
  verticalEventCard: {
    width: 220,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  vecImage: {
    height: 110,
  },
  vecImageInner: {
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  vecDate: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  vecDateNum: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 18,
  },
  vecDateMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  vecBody: {
    padding: 12,
  },
  vecTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 4,
  },
  vecMeta: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 10,
  },
  vecCatWrap: {
    backgroundColor: colors.primaryContainer,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: 12,
  },
  vecCat: {
    fontSize: 11,
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  vecFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vecPlusWrap: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  vecPlusText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },

  // Vertical Club Card
  verticalClubCard: {
    width: 180,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },

  vccLogoWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceContainerHigh,
    marginBottom: 12,
    overflow: 'hidden',
  },
  vccLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  vccName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  vccMembers: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 12,
  },
  vccFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vccFriends: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
});
