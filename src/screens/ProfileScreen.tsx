import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { FormInput } from '../components/FormInput';
import { SquareCard } from '../components/SquareCard';
import { CompactEventCard } from '../components/CompactEventCard';
import { EmptyState } from '../components/EmptyState';
import { clubs, events, getPerson } from '../data/events';
import { getAvatarsByGender } from '../data/avatars';
import { useStudent } from '../context/UserContext';
import { colors, radius, spacing, elevation } from '../theme';

export function ProfileScreen({ navigation }: any) {
  const { student, update, logout } = useStudent();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [draft, setDraft] = useState({ name: '', bio: '', branch: '', year: '', phone: '', avatar: '' });
  
  if (!student) return null;

  const studentClubs = clubs.filter((c) => student.clubs.includes(c.id));
  const enrolledEvents = events.filter((e) => student.enrolledEvents.includes(e.id));

  const friendProfiles = student.friends.map((id) => getPerson(id)).filter(Boolean) as NonNullable<ReturnType<typeof getPerson>>[];

  const startEdit = () => { setDraft({ name: student.name, bio: student.bio, branch: student.branch, year: student.year, phone: student.phone, avatar: student.avatar }); setEditing(true); };
  const saveEdit = () => { update(draft); setEditing(false); Alert.alert('Saved ✓', 'Your profile has been updated.'); };
  const avatarOptions = getAvatarsByGender(student.gender);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={{ width: 60 }} />
        <Text style={s.headerTitle}>Profile</Text>
        <View style={s.headerRight}>
          {editing ? (
            <Pressable onPress={saveEdit} hitSlop={8} style={s.editHeaderBtn}>
              <Text style={s.editHeaderBtnText}>Save</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Banner & Card */}
        <View style={s.bannerWrap}>
          <Image 
            source={{ uri: student.banner || 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif' }} 
            style={s.bannerBg} 
            resizeMode="cover" 
          />
          
          <View style={[s.profileCard, elevation.level2]}>
            {editing ? (
              <>
                <View style={s.avatarWrap}>
                  <Avatar avatarId={draft.avatar} name={draft.name} size={96} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.avatarPicker}>
                  {avatarOptions.map((a) => (
                    <Pressable key={a.id} onPress={() => setDraft((d) => ({ ...d, avatar: a.id }))} style={[s.avatarOpt, draft.avatar === a.id && s.avatarOptActive]}>
                      <Image source={{ uri: a.url }} style={s.avatarOptImg} />
                    </Pressable>
                  ))}
                </ScrollView>
                <View style={s.editFieldsRow}>
                  <FormInput label="DISPLAY NAME" value={draft.name} onChangeText={(v: string) => setDraft((d) => ({ ...d, name: v }))} />
                  <FormInput label="BRANCH" value={draft.branch} onChangeText={(v: string) => setDraft((d) => ({ ...d, branch: v }))} />
                  <FormInput label="YEAR" value={draft.year} onChangeText={(v: string) => setDraft((d) => ({ ...d, year: v }))} />
                </View>
              </>
            ) : (
              <>
                <View style={s.avatarWrap}>
                  <Avatar avatarId={student.avatar} name={student.name} size={96} />
                  <View style={s.onlineDot} />
                </View>
                
                <Text style={s.name}>{student.name}</Text>
                <Text style={s.metaPrimary}>{student.branch} • {student.year}</Text>
                <View style={s.locationRow}>
                  <Ionicons name="business-outline" size={14} color={colors.onSurfaceVariant} />
                  <Text style={s.metaSecondary}>Vidyavardhini College of Engineering</Text>
                </View>

                {/* Stats */}
                <View style={s.statsRow}>
                  <StatItem 
                    icon="people-outline" 
                    num={student.friends.length.toString()} 
                    label="Friends" 
                    onPress={() => navigation.navigate('List', { title: 'Friends', type: 'students', dataIds: student.friends })}
                  />
                  <View style={s.statDiv} />
                  <StatItem 
                    icon="shield-checkmark-outline" 
                    num={studentClubs.length.toString()} 
                    label="Clubs" 
                    onPress={() => navigation.navigate('List', { title: 'My Clubs', type: 'clubs', dataIds: student.clubs })}
                  />
                  <View style={s.statDiv} />
                  <StatItem 
                    icon="calendar-outline" 
                    num={enrolledEvents.length.toString()} 
                    label="Events" 
                    onPress={() => navigation.navigate('List', { title: 'My Events', type: 'events', dataIds: student.enrolledEvents })}
                  />
                </View>

                {/* Action Buttons */}
                <View style={s.actionRow}>
                  <Pressable style={[s.actionBtn, s.btnPrimary]} onPress={startEdit} android_ripple={{ color: 'rgba(255,255,255,0.2)' }}>
                    <Ionicons name="create-outline" size={16} color="#fff" />
                    <Text style={s.btnPrimaryText}>Edit Profile</Text>
                  </Pressable>
                  
                  <Pressable style={[s.actionBtn, s.btnOutlined]} onPress={() => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out', onPress: logout, style: 'destructive' }])} android_ripple={{ color: colors.onSurfaceVariant + '1A' }}>
                    <Ionicons name="log-out-outline" size={16} color={colors.onSurfaceVariant} />
                    <Text style={[s.btnOutlinedText, { color: colors.onSurfaceVariant }]}>Sign Out</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>

        {!editing && (
          <>
            {/* Tabs */}
            <View style={s.tabsRow}>
              <TabItem label="About" active={activeTab === 'about'} onPress={() => setActiveTab('about')} />
              <TabItem label="Clubs" active={activeTab === 'clubs'} onPress={() => setActiveTab('clubs')} />
              <TabItem label="Events" active={activeTab === 'events'} onPress={() => setActiveTab('events')} />
              <TabItem label="Network" active={activeTab === 'network'} onPress={() => setActiveTab('network')} />
            </View>

            <View style={s.body}>
              {/* About Section */}
              {activeTab === 'about' && (
                <View style={s.section}>
                  <View style={s.secHeader}>
                    <Text style={s.sectionTitle}>About Me</Text>
                  </View>
                  <Text style={s.bioText}>{student.bio || "Write something about yourself..."}</Text>
                  
                  <View style={s.infoGrid}>
                    <InfoGridItem icon="mail-outline" label="Email" val={student.email} />
                    <InfoGridItem icon="id-card-outline" label="Student ID" val={student.studentId} />
                    <InfoGridItem icon="call-outline" label="Phone" val={student.phone || 'Add phone number'} />
                    <InfoGridItem icon="calendar-outline" label="Year" val={student.year} />
                  </View>
                </View>
              )}

              {/* Clubs Section */}
              {activeTab === 'clubs' && (
                <View style={s.section}>
                  <View style={s.secHeader}>
                    <Text style={s.sectionTitle}>My Clubs</Text>
                  </View>
                  {studentClubs.length > 0 ? (
                    <View style={s.grid}>
                      {studentClubs.map((c) => (
                        <Pressable key={c.id} style={[s.miniClubCard, elevation.level1]} onPress={() => navigation.navigate('ClubProfile', { clubId: c.id })}>
                          {c.logo ? (
                            <Image source={{ uri: c.logo }} style={s.miniClubLogo} />
                          ) : (
                            <View style={[s.miniClubLogo, { backgroundColor: c.color, alignItems: 'center', justifyContent: 'center' }]}>
                              <Text style={{color: '#fff', fontWeight: 'bold'}}>{c.shortName}</Text>
                            </View>
                          )}
                          <Text style={s.miniClubName} numberOfLines={2}>{c.name}</Text>
                          <View style={s.miniClubBadge}>
                            <Text style={s.miniClubBadgeText}>{student.clubRoles[c.id] ?? 'Member'}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  ) : (
                    <EmptyState
                      icon="shield-outline"
                      title="No clubs yet"
                      subtitle="Discover clubs on the Search tab and join communities that match your interests."
                      actionLabel="Find Clubs"
                      onAction={() => navigation.navigate('Search')}
                    />
                  )}
                </View>
              )}

              {/* Events Section */}
              {activeTab === 'events' && (
                <View style={s.section}>
                  <View style={s.secHeader}>
                    <Text style={s.sectionTitle}>My Events</Text>
                  </View>
                  <View style={[s.grid, { marginBottom: 16 }]}>
                    <EventStatCard icon="calendar-outline" iconColor={colors.primary} num={enrolledEvents.length.toString()} label="Events Registered" />
                    <EventStatCard icon="checkmark-circle-outline" iconColor="#4CAF50" num="0" label="Events Attended" />
                  </View>
                  {enrolledEvents.length > 0 ? (
                    enrolledEvents.map((e) => (
                      <CompactEventCard
                        key={e.id}
                        event={e}
                        onPress={() => navigation.navigate('Event', { id: e.id })}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon="calendar-outline"
                      title="No upcoming events"
                      subtitle="You haven't registered for any events yet. Check out the calendar to see what's happening."
                      actionLabel="Browse Events"
                      onAction={() => navigation.navigate('Calendar')}
                    />
                  )}                </View>
              )}

              {/* Network Section */}
              {activeTab === 'network' && (
                <View style={s.section}>
                  <View style={s.secHeader}>
                    <Text style={s.sectionTitle}>My Friends</Text>
                  </View>
                  {friendProfiles.length > 0 ? (
                    <View style={s.friendList}>
                      {friendProfiles.map((f) => (
                        <Pressable key={f.id} style={[s.friendRow, elevation.level1]} onPress={() => navigation.navigate('UserProfile', { userId: f.id })}>
                          <Avatar avatarId={f.avatar} name={f.name} size={48} />
                          <View style={s.friendInfo}>
                            <Text style={s.friendName}>{f.name}</Text>
                            <Text style={s.friendMeta}>@{f.username}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
                        </Pressable>
                      ))}
                    </View>
                  ) : (
                    <EmptyState
                      icon="people-outline"
                      title="No friends yet"
                      subtitle="Connect with other students by viewing their profiles and adding them."
                    />
                  )}
                </View>
              )}
            </View>
          </>
        )}

        {editing && (
          <View style={s.body}>
            <FormInput label="BIO" value={draft.bio} onChangeText={(v: string) => setDraft((d) => ({ ...d, bio: v }))} placeholder="Your one-liner..." />
            <FormInput label="PHONE" value={draft.phone} onChangeText={(v: string) => setDraft((d) => ({ ...d, phone: v }))} keyboardType="phone-pad" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ icon, num, label, onPress }: { icon: any, num: string, label: string, onPress?: () => void }) {
  return (
    <Pressable style={s.statCol} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={s.statNum}>{num}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Pressable>
  );
}

function TabItem({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) {
  return (
    <Pressable style={[s.tab, active && s.tabActive]} onPress={onPress}>
      <Text style={[s.tabText, active && s.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function InfoGridItem({ icon, label, val, locked }: { icon: any, label: string, val: string, locked?: boolean }) {
  return (
    <View style={s.infoGridItem}>
      <View style={s.infoIconWrap}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={s.infoContent}>
        <Text style={s.infoLabel}>{label}</Text>
        <View style={s.infoValRow}>
          <Text style={s.infoVal}>{val}</Text>
          {locked && <Ionicons name="lock-closed-outline" size={12} color={colors.onSurfaceVariant} style={{marginLeft: 4}} />}
        </View>
      </View>
    </View>
  );
}

function EventStatCard({ icon, iconColor, num, label }: { icon: any, iconColor: string, num: string, label: string }) {
  return (
    <View style={s.eventStatCard}>
      <View style={[s.eventStatIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={s.eventStatInfo}>
        <Text style={s.eventStatNum}>{num}</Text>
        <Text style={s.eventStatLabel}>{label}</Text>
      </View>
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
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onBackground,
    textAlign: 'center',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  editHeaderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.full,
  },
  editHeaderBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  scroll: { paddingBottom: 110 },
  bannerWrap: {
    position: 'relative',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  bannerBg: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 120,
    backgroundColor: '#865DFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    marginTop: 60,
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  avatarWrap: {
    marginTop: -48,
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 52,
    padding: 4,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarPicker: { gap: 12, paddingBottom: 16, marginTop: 12 },
  avatarOpt: { borderWidth: 2, borderColor: 'transparent', borderRadius: 28, padding: 2 },
  avatarOptActive: { borderColor: colors.primary },
  avatarOptImg: { width: 52, height: 52, borderRadius: 26 },
  editFieldsRow: { width: '100%', gap: 12 },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onBackground,
  },
  metaPrimary: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  metaSecondary: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    marginBottom: 20,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  statDiv: {
    width: 1,
    height: 30,
    backgroundColor: colors.surfaceContainerHigh,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: radius.md,
    gap: 6,
  },
  btnPrimary: {
    flex: 2,
    backgroundColor: colors.primary,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  btnOutlined: {
    flex: 1.5,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    backgroundColor: '#fff',
  },
  btnOutlinedText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  body: {
    padding: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: radius.lg,
  },
  secHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onBackground,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.onSurface,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoGridItem: {
    width: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.onSurface,
    fontWeight: '500',
  },
  infoValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  infoVal: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  miniClubCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  miniClubLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 12,
  },
  miniClubName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 10,
    height: 36,
  },
  miniClubBadge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  miniClubBadgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  eventStatCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: 16,
    gap: 14,
  },
  eventStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventStatInfo: {
    flex: 1,
  },
  eventStatNum: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
  },
  eventStatLabel: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  friendList: {
    gap: 12,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  friendMeta: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
});
