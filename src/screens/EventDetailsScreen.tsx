import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { AvatarGroup } from '../components/AvatarGroup';
import { events, getClub, getPerson } from '../data/events';
import { useStudent } from '../context/UserContext';
import { colors, radius, spacing, elevation } from '../theme';

export function EventDetailsScreen({ route, navigation }: any) {
  const { student, unenrollEvent } = useStudent();
  const e = events.find((x) => x.id === route.params.id)!;
  const c = getClub(e.clubId);

  const friendsAttending = student
    ? student.friends.map((id) => getPerson(id)).filter((p) => p && p.enrolledEvents.includes(e.id))
    : [];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Top Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.headerBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.onBackground} />
        </Pressable>
        <Text style={s.headerTitle}>Event Details</Text>
        <View style={s.headerRight}>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={s.heroWrap}>
          <Image source={{ uri: e.image }} style={s.heroImg} />
          {/* Date Badge */}
          <View style={[s.dateBadge, elevation.level2]}>
            <Text style={s.dateBadgeNum}>{e.day}</Text>
            <Text style={s.dateBadgeMonth}>{e.month}</Text>
          </View>

        </View>

        <View style={s.content}>
          {/* Title & Club */}
          <Text style={s.title}>{e.title}</Text>
          <Text style={s.byText}>
            by <Text style={s.byClub}>{c.name}</Text>
          </Text>

          {/* Meta Info */}
          <View style={s.metaRow}>
            <View style={s.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.onSurfaceVariant} />
              <Text style={s.metaText}>{e.day} {e.month} 2026, Sunday</Text>
            </View>
            <View style={s.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.onSurfaceVariant} />
              <Text style={s.metaText}>{e.time}</Text>
            </View>
          </View>
          <View style={[s.metaRow, { marginTop: 16, justifyContent: 'space-between' }]}>
            <View style={s.metaItem}>
              <Ionicons name="location-outline" size={16} color={colors.onSurfaceVariant} />
              <Text style={s.metaText}>{e.venue}</Text>
            </View>
            <View style={s.catWrap}>
              <Text style={s.catText}>{e.category.charAt(0).toUpperCase() + e.category.slice(1)}</Text>
            </View>
          </View>

          <View style={s.divider} />

          {/* Attendees Row */}
          <View style={s.attendeeRow}>
            <View style={s.attendeeLeft}>
              <AvatarGroup avatarIds={[{id:'m1',name:''},{id:'f2',name:''},{id:'m3',name:''},{id:'f4',name:''}]} size={24} />
              <View style={s.plusWrap}><Text style={s.plusText}>+{e.attendees > 99 ? '99' : e.attendees}</Text></View>
              <Text style={s.attendeeText}>3 friends are attending</Text>
            </View>
            <View style={s.attendeeRight}>
              <AvatarGroup avatarIds={friendsAttending.slice(0,3).map(f=>({id:f!.avatar,name:f!.name}))} size={20} />
              <Ionicons name="chevron-forward" size={16} color={colors.onSurfaceVariant} style={{ marginLeft: 4 }} />
            </View>
          </View>

          <View style={s.divider} />

          {/* About */}
          <Text style={s.sectionTitle}>About this Event</Text>
          <Text style={s.desc}>{e.description || "TechFest is our annual flagship event that brings together innovators, developers, and tech enthusiasts for a day of learning, building, and networking. Get ready for incredible talks, exciting competitions, and hands-on workshops!"}</Text>

          {/* Expect */}
          <Text style={s.sectionTitle}>What to Expect</Text>
          <View style={s.expectList}>
            <ExpectItem icon="easel-outline" text="Technical Workshops" />
            <ExpectItem icon="trophy-outline" text="Competitions & Prizes" />
            <ExpectItem icon="people-outline" text="Networking Opportunities" />
            <ExpectItem icon="calendar-outline" text="Goodies & Certificates" />
          </View>

          {/* Organizer */}
          <Text style={s.sectionTitle}>Organizer</Text>
          <View style={[s.orgCard, elevation.level1]}>
            {c.logo ? (
              <Image source={{ uri: c.logo }} style={s.orgLogo} />
            ) : (
              <View style={[s.orgLogo, { backgroundColor: c.color, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>{c.shortName}</Text>
              </View>
            )}
            <View style={s.orgInfo}>
              <Text style={s.orgName}>{c.name}</Text>
              <Text style={s.orgTag}>{c.tagline}</Text>
            </View>
            <Pressable style={s.orgBtn} onPress={() => navigation.navigate('ClubProfile', { clubId: c.id })}>
              <Text style={s.orgBtnText}>View Club</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky */}
      <View style={[s.bottomBar, elevation.level3]}>
        <View style={s.bottomLeft}>
          <AvatarGroup avatarIds={friendsAttending.slice(0,3).map(f=>({id:f!.avatar,name:f!.name}))} size={24} />
          <Text style={s.bottomText}>
            <Text style={{fontWeight: '500'}}>{friendsAttending.length} friends</Text>{"\n"}are attending
          </Text>
        </View>
        {student?.enrolledEvents.includes(e.id) ? (
          <Button 
            title="Unregister" 
            onPress={() => unenrollEvent(e.id)} 
            style={s.registerBtn}
            variant="tonal"
            icon="close"
            iconPosition="right"
          />
        ) : (
          <Button 
            title="Register Now" 
            onPress={() => navigation.navigate('Enroll', { id: e.id })} 
            style={s.registerBtn}
            icon="arrow-forward"
            iconPosition="right"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function ExpectItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={s.expectItem}>
      <View style={s.expectIconBox}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={s.expectText}>{text}</Text>
    </View>
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.onBackground,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -10,
  },
  scroll: {
    paddingBottom: 120,
  },
  heroWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: radius.lg,
    position: 'relative',
  },
  heroImg: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
  },
  dateBadge: {
    position: 'absolute',
    bottom: -20,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeNum: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 28,
  },
  dateBadgeMonth: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  bookmarkBadge: {
    position: 'absolute',
    bottom: -18,
    right: 20,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onBackground,
  },
  byText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
    marginBottom: 20,
  },
  byClub: {
    fontWeight: '600',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  catWrap: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  catText: {
    fontSize: 11,
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerHigh,
    marginVertical: 20,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: radius.md,
  },
  attendeeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusWrap: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  plusText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  attendeeText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  attendeeRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onBackground,
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.onSurfaceVariant,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: radius.lg,
    marginBottom: 32,
    overflow: 'hidden',
  },
  expectList: {
    gap: 16,
    marginBottom: 32,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: radius.lg,
  },
  expectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  expectIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expectText: {
    fontSize: 14,
    color: colors.onSurface,
  },
  orgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  orgLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onSurface,
  },
  orgTag: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  orgBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  orgBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
  registerBtn: {
    paddingHorizontal: 24,
  },
});
