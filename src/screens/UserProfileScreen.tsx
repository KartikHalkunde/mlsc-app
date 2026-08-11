import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { CompactEventCard } from '../components/CompactEventCard';
import { EmptyState } from '../components/EmptyState';
import { clubs, events, getPerson } from '../data/events';
import { useStudent } from '../context/UserContext';
import { colors, radius, spacing, elevation } from '../theme';

export function UserProfileScreen({ route, navigation }: any) {
  const { student, toggleFriend } = useStudent();
  const person = getPerson(route.params.userId);
  const [activeTab, setActiveTab] = useState('about');
  
  if (!person) return null;

  const isFriend = student?.friends.includes(person.id) ?? false;
  const personClubs = clubs.filter((c) => person.clubs.includes(c.id));
  const personEvents = events.filter((e) => person.enrolledEvents.includes(e.id));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.headerBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.onBackground} />
        </Pressable>
        <View style={s.headerRight}>
          <Pressable style={s.headerBtn} hitSlop={8}>
            <Ionicons name="notifications-outline" size={22} color={colors.onBackground} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={s.bannerWrap}>
          {person.banner ? (
            <Image source={{ uri: person.banner }} style={s.bannerBg} resizeMode="cover" />
          ) : (
            <View style={s.bannerBg} />
          )}
          
          {/* Main Profile Card */}
          <View style={[s.profileCard, elevation.level2]}>
            <View style={s.avatarWrap}>
              <Avatar avatarId={person.avatar} name={person.name} size={96} />
              <View style={s.onlineDot} />
            </View>
            
            <Text style={s.name}>{person.name}</Text>
            <Text style={s.metaPrimary}>{person.branch} • {person.year}</Text>
            <View style={s.locationRow}>
              <Ionicons name="business-outline" size={14} color={colors.onSurfaceVariant} />
              <Text style={s.metaSecondary}>Vidyavardhini College of Engineering</Text>
            </View>

            {/* Stats Row */}
            <View style={s.statsRow}>
              <StatItem 
                icon="people-outline" 
                num={person.friends.length.toString()} 
                label="Friends" 
                onPress={() => navigation.navigate('List', { title: 'Friends', type: 'students', dataIds: person.friends })}
              />
              <View style={s.statDiv} />
              <StatItem 
                icon="shield-checkmark-outline" 
                num={personClubs.length.toString()} 
                label="Clubs" 
                onPress={() => navigation.navigate('List', { title: 'Clubs', type: 'clubs', dataIds: person.clubs })}
              />
              <View style={s.statDiv} />
              <StatItem 
                icon="calendar-outline" 
                num={personEvents.length.toString()} 
                label="Events" 
                onPress={() => navigation.navigate('List', { title: 'Events', type: 'events', dataIds: person.enrolledEvents })}
              />
            </View>

            {/* Action Buttons */}
            <View style={s.actionRow}>
              <Pressable 
                style={[s.actionBtn, s.btnPrimary]} 
                onPress={() => toggleFriend(person.id)}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <Ionicons name={isFriend ? 'person-remove-outline' : 'person-add-outline'} size={16} color="#fff" />
                <Text style={s.btnPrimaryText}>{isFriend ? 'Remove Friend' : 'Add Friend'}</Text>
              </Pressable>
              
              {isFriend && (
                <Pressable style={[s.actionBtn, s.btnOutlined]} android_ripple={{ color: colors.primary + '1A' }}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
                  <Text style={s.btnOutlinedText}>Message</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* Tabs Row */}
        <View style={s.tabsRow}>
          <TabItem label="About" active={activeTab === 'about'} onPress={() => setActiveTab('about')} />
          <TabItem label="Clubs" active={activeTab === 'clubs'} onPress={() => setActiveTab('clubs')} />
          <TabItem label="Events" active={activeTab === 'events'} onPress={() => setActiveTab('events')} />
          <TabItem label="Activity" active={activeTab === 'activity'} onPress={() => setActiveTab('activity')} />
        </View>

        <View style={s.body}>
          {/* About Section */}
          {activeTab === 'about' && (
            <View style={s.section}>
              <View style={s.secHeader}>
                <Text style={s.sectionTitle}>About Me</Text>
              </View>
              <Text style={s.bioText}>{person.bio || "Passionate developer who loves building products and solving real-world problems. Always eager to learn new technologies and collaborate on exciting ideas."}</Text>
            </View>
          )}

          {/* Clubs Section */}
          {activeTab === 'clubs' && (
            <View style={s.section}>
              <View style={s.secHeader}>
                <Text style={s.sectionTitle}>Clubs</Text>
                <Pressable onPress={() => navigation.navigate('List', { title: 'Clubs', type: 'clubs', dataIds: person.clubs })}>
                  <Text style={s.viewAll}>View All</Text>
                </Pressable>
              </View>
              {personClubs.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
                  {personClubs.map((c) => (
                    <View key={c.id} style={[s.miniClubCard, elevation.level1]}>
                      {c.logo ? (
                        <Image source={{ uri: c.logo }} style={s.miniClubLogo} />
                      ) : (
                        <View style={[s.miniClubLogo, { backgroundColor: c.color, alignItems: 'center', justifyContent: 'center' }]}>
                          <Text style={{color: '#fff', fontWeight: 'bold'}}>{c.shortName}</Text>
                        </View>
                      )}
                      <Text style={s.miniClubName} numberOfLines={2}>{c.name}</Text>
                      <View style={s.miniClubBadge}>
                        <Text style={s.miniClubBadgeText}>{person.clubRoles[c.id] ?? 'Member'}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <EmptyState
                  icon="shield-outline"
                  title="No clubs"
                  subtitle={`${person.name} hasn't joined any clubs yet.`}
                />
              )}
            </View>
          )}

          {/* Events Section */}
          {activeTab === 'events' && (
            <View style={s.section}>
              <View style={s.secHeader}>
                <Text style={s.sectionTitle}>Events</Text>
                <Pressable onPress={() => navigation.navigate('List', { title: 'Events', type: 'events', dataIds: person.enrolledEvents })}>
                  <Text style={s.viewAll}>View All</Text>
                </Pressable>
              </View>
              <View style={[s.grid, { marginBottom: 16 }]}>
                <EventStatCard icon="calendar-outline" iconColor={colors.primary} num={personEvents.length.toString()} label="Events Registered" />
                <EventStatCard icon="checkmark-circle-outline" iconColor="#4CAF50" num="0" label="Events Attended" />
              </View>
              {personEvents.length > 0 ? (
                personEvents.map((e) => (
                  <CompactEventCard
                    key={e.id}
                    event={e}
                    onPress={() => navigation.push('Event', { id: e.id })}
                  />
                ))
              ) : (
                <EmptyState
                  icon="calendar-outline"
                  title="No upcoming events"
                  subtitle={`${person.name} hasn't registered for any events yet.`}
                />
              )}
            </View>
          )}

          {/* Recent Activity */}
          {activeTab === 'activity' && (
            <View style={s.section}>
              <View style={s.secHeader}>
                <Text style={s.sectionTitle}>Recent Activity</Text>
                <Pressable onPress={() => navigation.navigate('List', { title: 'Recent Activity', type: 'activities' })}>
                  <Text style={s.viewAll}>View All</Text>
                </Pressable>
              </View>
              <View style={s.activityList}>
                <ActivityItem 
                  icon="person-add-outline" 
                  iconColor={colors.primary} 
                  title="Joined CSI Student Chapter" 
                  time="2 days ago" 
                />
                <ActivityItem 
                  icon="calendar-outline" 
                  iconColor="#4CAF50" 
                  title="Registered for TechFest 2026" 
                  time="3 days ago" 
                  img="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
                />
                <ActivityItem 
                  icon="ticket-outline" 
                  iconColor={colors.primary} 
                  title="Attended AI Workshop" 
                  time="1 week ago" 
                  img="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80"
                />
                <ActivityItem 
                  icon="trophy-outline" 
                  iconColor="#FF9800" 
                  title="Participated in Hackathon 3.0" 
                  time="2 weeks ago" 
                  img="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=800&q=80"
                />
              </View>
            </View>
          )}
        </View>
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

function ActivityItem({ icon, iconColor, title, time, img }: { icon: any, iconColor: string, title: string, time: string, img?: string }) {
  return (
    <View style={s.activityRow}>
      <View style={[s.activityIconWrap, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={s.activityContent}>
        <Text style={s.activityTitle} numberOfLines={1}>{title}</Text>
        <Text style={s.activityTime}>{time}</Text>
      </View>
      {img && <Image source={{ uri: img }} style={s.activityImg} />}
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
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -8,
  },
  scroll: { paddingBottom: 40 },
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
    backgroundColor: '#865DFF', // Purple banner color
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
  viewAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  editBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.onSurface,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
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
  hScroll: {
    paddingBottom: 8,
    gap: 12,
  },
  miniClubCard: {
    width: 130,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: 16,
    width: 200,
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
  activityList: {
    gap: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  activityTime: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  activityImg: {
    width: 80,
    height: 48,
    borderRadius: radius.sm,
  },
});
