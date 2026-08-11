import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CategoryChip } from '../components/CategoryChip';
import { SquareCard } from '../components/SquareCard';
import { EmptyState } from '../components/EmptyState';
import { SectionHeader } from '../components/SectionHeader';
import { clubs, events, people } from '../data/events';
import { useStudent } from '../context/UserContext';
import { colors, radius, spacing } from '../theme';
import { Pressable } from 'react-native';

type FilterType = 'all' | 'students' | 'clubs' | 'events';

const filterIcons: Record<FilterType, keyof typeof Ionicons.glyphMap> = {
  all: 'list', // Not used for 'all' in image, but we'll conditionally omit
  students: 'people-outline',
  clubs: 'shield-checkmark-outline',
  events: 'calendar-outline',
};

export function SearchScreen({ navigation }: any) {
  const { student, toggleFriend } = useStudent();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const lower = q.toLowerCase();

  const filteredClubs = useMemo(
    () =>
      clubs.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(lower) ||
          c.shortName.toLowerCase().includes(lower)
      ),
    [lower]
  );

  const filteredPeople = useMemo(
    () =>
      people.filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(lower) ||
          p.username.toLowerCase().includes(lower) ||
          p.branch.toLowerCase().includes(lower)
      ),
    [lower]
  );

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          !q ||
          e.title.toLowerCase().includes(lower) ||
          e.venue.toLowerCase().includes(lower)
      ),
    [lower]
  );

  const showStudents = filter === 'all' || filter === 'students';
  const showClubs = filter === 'all' || filter === 'clubs';
  const showEvents = filter === 'all' || filter === 'events';

  const hasResults =
    (showStudents && filteredPeople.length > 0) ||
    (showClubs && filteredClubs.length > 0) ||
    (showEvents && filteredEvents.length > 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ width: 44 }} />
          <Text style={s.title}>Search</Text>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            style={s.notifBtn}
            android_ripple={{ color: colors.onSurface + '1A', borderless: true, radius: 24 }}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.onSurface} />
            <View style={s.notifBadge} />
          </Pressable>
        </View>

        {/* Search bar */}
        <View style={s.searchRow}>
          <View style={s.searchBar}>
            <Ionicons name="search" size={20} color={colors.onSurfaceVariant} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search students, clubs, events..."
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              style={s.searchInput}
            />
            {q.length > 0 && (
              <Pressable onPress={() => setQ('')} hitSlop={8}>
                <Ionicons name="close-circle" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
        >
          {(['all', 'students', 'clubs', 'events'] as FilterType[]).map((f) => {
            const isActive = filter === f;
            return (
              <CategoryChip
                key={f}
                label={f.charAt(0).toUpperCase() + f.slice(1)}
                active={isActive}
                onPress={() => setFilter(f)}
                icon={f !== 'all' ? <Ionicons name={filterIcons[f]} size={16} color={isActive ? '#fff' : colors.onSurface} /> : undefined}
              />
            );
          })}
        </ScrollView>

        {!hasResults && q.length > 0 ? (
          <EmptyState
            icon="search-outline"
            title="No results found"
            subtitle={`We couldn't find anything matching "${q}". Try a different search.`}
          />
        ) : (
          <>
            {/* Students */}
            {showStudents && filteredPeople.length > 0 && (
              <View style={s.section}>
                <SectionHeader title="Students" actionLabel="See all >" onAction={() => navigation.navigate('List', { title: 'Students', type: 'students', dataIds: filteredPeople.map(p => p.id) })} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
                  {filteredPeople.map((p) => {
                    const mutualCount = student
                      ? p.friends.filter((f) => student.friends.includes(f)).length
                      : 0;
                    return (
                      <SquareCard
                        key={p.id}
                        id={p.id}
                        type="student"
                        title={p.name}
                        subtitle={p.branch}
                        avatarId={p.avatar}
                        mutualCount={mutualCount}
                        onPress={() => navigation.navigate('UserProfile', { userId: p.id })}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Clubs */}
            {showClubs && filteredClubs.length > 0 && (
              <View style={s.section}>
                <SectionHeader title="Clubs" actionLabel="See all >" onAction={() => navigation.navigate('List', { title: 'Clubs', type: 'clubs', dataIds: filteredClubs.map(c => c.id) })} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
                  {filteredClubs.map((c) => {
                    const mutualCount = student
                      ? c.memberIds.filter((id) => student.friends.includes(id)).length
                      : 0;
                    return (
                      <SquareCard
                        key={c.id}
                        id={c.id}
                        type="club"
                        title={c.name}
                        subtitle={`${c.members} members`}
                        clubId={c.id}
                        mutualCount={mutualCount}
                        onPress={() => navigation.navigate('ClubProfile', { clubId: c.id })}

                      />
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Events */}
            {showEvents && filteredEvents.length > 0 && (
              <View style={s.section}>
                <SectionHeader title="Events" actionLabel="See all >" onAction={() => navigation.navigate('List', { title: 'Events', type: 'events', dataIds: filteredEvents.map(e => e.id) })} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hScroll}>
                  {filteredEvents.map((e) => (
                    <SquareCard
                      key={e.id}
                      id={e.id}
                      type="event"
                      title={e.title}
                      subtitle={`${e.day} ${e.month}`}
                      onPress={() => navigation.navigate('Event', { id: e.id })}

                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}
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
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onBackground,
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

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.onSurface,
  },
  filterBtn: {
    height: 48,
    width: 48,
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Chips
  chipRow: {
    gap: 8,
    marginTop: 4,
    marginBottom: 24,
  },

  // List
  section: {
    marginBottom: 20,
  },
  hScroll: {
    paddingRight: 16,
  },
});
