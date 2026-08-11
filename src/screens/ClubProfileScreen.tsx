import React, { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { ClubMark } from '../components/EventCard';
import { CompactEventCard } from '../components/CompactEventCard';
import { AvatarGroup } from '../components/AvatarGroup';
import { clubs, events, getPerson } from '../data/events';
import { useStudent } from '../context/UserContext';
import { colors, radius, spacing, elevation } from '../theme';

const { width } = Dimensions.get('window');

export function ClubProfileScreen({ route, navigation }: any) {
  const { student, leaveClub } = useStudent();
  const club = clubs.find((c) => c.id === route.params.clubId);
  const [activeTab, setActiveTab] = useState('upcoming');
  if (!club) return null;

  const memberProfiles = club.memberIds.map((id) => getPerson(id)).filter(Boolean) as NonNullable<ReturnType<typeof getPerson>>[];
  const clubEvents = events.filter((e) => e.clubId === club.id);
  const mutualFriends = student ? memberProfiles.filter((m) => student.friends.includes(m.id)) : [];

  // Leadership
  const leaders = memberProfiles.filter((m) => {
    const role = m.clubRoles[club.id];
    return role && role !== 'Member';
  });

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.headerBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.onBackground} />
        </Pressable>
        <Text style={s.headerTitle} numberOfLines={1}>{club.name}</Text>
        <View style={s.headerRight}>
          <Pressable style={s.headerBtn} hitSlop={8}>
            <Ionicons name="notifications-outline" size={22} color={colors.onBackground} />
          </Pressable>

        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={s.bannerWrap}>
          {club.banner ? (
            <Image source={{ uri: club.banner }} style={s.bannerImg} />
          ) : (
            <View style={[s.bannerImg, { backgroundColor: club.color }]} />
          )}
          {/* Logo overlapping banner */}
          <View style={s.logoWrap}>
            {club.logo ? (
              <Image source={{ uri: club.logo }} style={s.logoImg} />
            ) : (
              <View style={[s.logoImg, { backgroundColor: club.color, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 24}}>{club.shortName}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={s.body}>
          {/* Title & Join Button */}
          <View style={s.titleRow}>
            <View style={s.titleLeft}>
              <Text style={s.titleName}>{club.name}</Text>
              <Text style={s.titleTag}>{club.tagline}</Text>
            </View>
            {student?.clubs.includes(club.id as any) ? (
              <Pressable style={[s.joinBtn, { backgroundColor: colors.surfaceContainerHighest }]} android_ripple={{ color: 'rgba(0,0,0,0.1)' }} onPress={() => leaveClub(club.id as any)}>
                <Ionicons name="exit-outline" size={16} color={colors.onSurface} />
                <Text style={[s.joinBtnText, { color: colors.onSurface }]}>Leave Club</Text>
              </Pressable>
            ) : (
              <Pressable style={s.joinBtn} android_ripple={{ color: 'rgba(255,255,255,0.2)' }} onPress={() => navigation.navigate('Enroll', { id: club.id, type: 'club' })}>
                <Ionicons name="person-add-outline" size={16} color="#fff" />
                <Text style={s.joinBtnText}>Join Club</Text>
              </Pressable>
            )}
          </View>

          {/* Meta */}
          <View style={s.metaRow}>
            <Ionicons name="people-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={s.metaText}>{club.memberIds.length} Members</Text>
            <Text style={s.metaDot}>•</Text>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={s.metaText}>Verified Club</Text>
            <Text style={s.metaDot}>•</Text>
            <Ionicons name="location-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={s.metaText} numberOfLines={1}>Vidyavardhini College of Engineering</Text>
          </View>

          {/* Mutual Friends */}
          <Pressable style={s.mutualCard} android_ripple={{ color: colors.primary + '1A' }}>
            <AvatarGroup avatarIds={mutualFriends.slice(0, 4).map((f) => ({ id: f.avatar, name: f.name }))} size={28} />
            <View style={s.plusWrap}><Text style={s.plusText}>+{mutualFriends.length > 4 ? mutualFriends.length - 4 : 8}</Text></View>
            <View style={s.mutualInfo}>
              <Text style={s.mutualTitle}>4 of your friends are members</Text>
              <Text style={s.mutualSub}>Rahul, Sania, Aryan and 1 other</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.onSurfaceVariant} />
          </Pressable>

          {/* About */}
          <Text style={s.sectionTitle}>About</Text>
          <View style={s.aboutRow}>
            <View style={s.aboutLeft}>
              <Text style={s.aboutText}>{club.description}</Text>
            </View>
            <View style={s.aboutRight}>
              <View style={s.infoItem}>
                <Ionicons name="calendar-outline" size={20} color={colors.onSurfaceVariant} />
                <View>
                  <Text style={s.infoLabel}>Founded</Text>
                  <Text style={s.infoVal}>2005</Text>
                </View>
              </View>
              <View style={s.infoItem}>
                <Ionicons name="star-outline" size={20} color={colors.onSurfaceVariant} />
                <View>
                  <Text style={s.infoLabel}>Category</Text>
                  <Text style={s.infoVal}>Technical</Text>
                </View>
              </View>
              <View style={s.infoItem}>
                <Ionicons name="people-outline" size={20} color={colors.onSurfaceVariant} />
                <View>
                  <Text style={s.infoLabel}>Open to</Text>
                  <Text style={s.infoVal}>All Students</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Leadership */}
          {leaders.length > 0 && (
            <View style={s.leadershipSec}>
              <View style={s.secHeader}>
                <Text style={s.sectionTitle}>Leadership</Text>
                <Pressable onPress={() => navigation.navigate('List', { title: 'Leadership', type: 'students', dataIds: leaders.map(l => l.id) })}>
                  <Text style={s.viewAll}>View All</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.leaderScroll}>
                {leaders.map((m) => (
                  <View key={m.id} style={[s.leaderCard, elevation.level1]}>
                    <View style={s.leaderAvatarWrap}>
                      <Avatar avatarId={m.avatar} name={m.name} size={64} />
                      {m.clubRoles[club.id] === 'President' && (
                        <View style={s.leaderBadge}>
                          <Ionicons name="ribbon" size={12} color={colors.primary} />
                        </View>
                      )}
                    </View>
                    <Text style={s.leaderName} numberOfLines={1}>{m.name}</Text>
                    <Text style={s.leaderRole} numberOfLines={1}>{m.clubRoles[club.id]}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Tabs */}
          <View style={s.tabsRow}>
            <TabItem icon="calendar" label="Upcoming Events" active={activeTab === 'upcoming'} onPress={() => setActiveTab('upcoming')} />
            <TabItem icon="calendar-outline" label="Past Events" active={activeTab === 'past'} onPress={() => setActiveTab('past')} />

            <TabItem icon="people-outline" label="Members" active={activeTab === 'members'} onPress={() => setActiveTab('members')} />
          </View>

          {/* Content Based on Tab */}
          <View style={s.eventsList}>
            {activeTab === 'upcoming' && clubEvents.map((e) => (
              <CompactEventCard key={e.id} event={e} onPress={() => navigation.navigate('Event', { id: e.id })} />
            ))}
            {activeTab === 'past' && clubEvents.map((e) => (
              <CompactEventCard key={`past-${e.id}`} event={{ ...e, title: `${e.title} (2025)`, date: 'August 10, 2025', day: 10, month: 'Aug' }} onPress={() => navigation.navigate('Event', { id: e.id })} />
            ))}
            {activeTab === 'members' && memberProfiles.map((m) => (
              <Pressable key={m.id} style={s.memberRow} onPress={() => navigation.navigate('UserProfile', { studentId: m.id })}>
                <Avatar avatarId={m.avatar} name={m.name} size={48} />
                <View style={s.memberInfo}>
                  <Text style={s.memberName}>{m.name}</Text>
                  <Text style={s.memberRole}>{m.clubRoles[club.id] || 'Member'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TabItem({ icon, label, active, onPress }: { icon: any, label: string, active: boolean, onPress: () => void }) {
  return (
    <Pressable style={[s.tab, active && s.tabActive]} onPress={onPress}>
      <Ionicons name={icon} size={18} color={active ? colors.primary : colors.onSurfaceVariant} />
      <Text style={[s.tabText, active && s.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.onBackground,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -10,
  },
  scroll: { paddingBottom: 40 },
  bannerWrap: {
    paddingHorizontal: 16,
    marginTop: 8,
    position: 'relative',
    marginBottom: 40,
  },
  bannerImg: {
    width: '100%',
    height: 160,
    borderRadius: radius.lg,
  },
  logoWrap: {
    position: 'absolute',
    bottom: -32,
    left: 32,
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 4,
  },
  logoImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  body: {
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleLeft: {
    flex: 1,
    paddingRight: 16,
  },
  titleName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onBackground,
  },
  titleTag: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    gap: 6,
  },
  joinBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  metaDot: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginHorizontal: 8,
  },
  mutualCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 24,
  },
  plusWrap: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: -8,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  plusText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  mutualInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mutualTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  mutualSub: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onBackground,
    marginBottom: 12,
  },
  aboutRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: radius.lg,
  },
  aboutLeft: {
    flex: 1,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  showMore: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  aboutRight: {
    width: 140,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: 12,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },
  leadershipSec: {
    marginBottom: 24,
  },
  secHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  leaderScroll: {
    paddingBottom: 4,
    gap: 12,
  },
  leaderCard: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    width: 110,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  leaderAvatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  leaderBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primaryContainer,
    borderRadius: 10,
    padding: 3,
    borderWidth: 2,
    borderColor: '#fff',
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
  },
  leaderRole: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  eventsList: {
    gap: 0,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
  },
  memberRole: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
