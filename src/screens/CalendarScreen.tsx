import React, { useState, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CategoryChip } from '../components/CategoryChip';
import { CompactEventCard } from '../components/CompactEventCard';
import { EmptyState } from '../components/EmptyState';
import { events, getClub } from '../data/events';
import { EventCategory } from '../types';
import { useStudent } from '../context/UserContext';
import { colors, radius, spacing } from '../theme';

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const categories: { label: string; value: EventCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Competitions', value: 'competition' },
  { label: 'Seminars', value: 'seminar' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Sports', value: 'sports' },
];

export function CalendarScreen({ navigation }: any) {
  const { student } = useStudent();
  const [month, setMonth] = useState<'Aug' | 'Sep'>('Aug');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'Date' | 'Popularity'>('Date');

  const count = month === 'Aug' ? 31 : 30;
  const startOffset = month === 'Aug' ? 6 : 2; // Day of week the month starts (0=Sun)

  const filteredEvents = useMemo(() => {
    let result = events.filter((e) => e.month === month);
    if (activeCategory !== 'all') {
      result = result.filter((e) => e.category === activeCategory);
    }
    if (selectedDay !== null) {
      result = result.filter((e) => e.day === selectedDay);
    }
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(lower) ||
          getClub(e.clubId).name.toLowerCase().includes(lower)
      );
    }
    
    if (sort === 'Date') {
      result.sort((a, b) => a.day - b.day);
    } else {
      result.sort((a, b) => b.attendees - a.attendees);
    }

    return result;
  }, [month, activeCategory, selectedDay, search, sort]);

  const eventDays = useMemo(
    () => new Set(events.filter((e) => e.month === month).map((e) => e.day)),
    [month]
  );

  const today = new Date().getDate();
  const isCurrentMonth = month === 'Aug'; // simplified

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ width: 44 }} />
          <Text style={s.title}>Events</Text>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            style={s.notifBtn}
            android_ripple={{ color: colors.onSurface + '1A', borderless: true, radius: 24 }}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.onSurface} />
            <View style={s.notifBadge} />
          </Pressable>
        </View>

        {/* Search */}
        <View style={s.searchRow}>
          <View style={s.searchBar}>
            <Ionicons name="search" size={20} color={colors.onSurfaceVariant} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search events..."
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              style={s.searchInput}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Calendar */}
        <View style={s.calendarCard}>
          {/* Month header */}
          <View style={s.monthRow}>
            <Pressable
              onPress={() => { setMonth(month === 'Aug' ? 'Sep' : 'Aug'); setSelectedDay(null); }}
              style={s.arrowBtn}
              android_ripple={{ color: colors.primary + '1A', borderless: true, radius: 20 }}
            >
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
            </Pressable>
            <Text style={s.monthText}>
              {month === 'Aug' ? 'August 2026' : 'September 2026'}
            </Text>
            <Pressable
              onPress={() => { setMonth(month === 'Aug' ? 'Sep' : 'Aug'); setSelectedDay(null); }}
              style={s.arrowBtn}
              android_ripple={{ color: colors.primary + '1A', borderless: true, radius: 20 }}
            >
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </Pressable>
          </View>

          {/* Day headers */}
          <View style={s.weekRow}>
            {days.map((d, i) => (
              <Text style={s.dayLabel} key={i}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={s.grid}>
            {/* Empty cells for offset */}
            {Array.from({ length: startOffset }, (_, i) => (
              <View key={`empty-${i}`} style={s.cell} />
            ))}
            {Array.from({ length: count }, (_, i) => i + 1).map((n) => {
              const hasEvent = eventDays.has(n);
              const isToday = isCurrentMonth && n === today;
              const isSelected = selectedDay === n;
              return (
                <Pressable
                  key={n}
                  style={s.cell}
                  onPress={() => setSelectedDay(selectedDay === n ? null : n)}
                >
                  <View style={[
                    s.cellInner,
                    isToday && s.cellToday,
                    isSelected && s.cellSelected,
                    hasEvent && !isSelected && !isToday && s.cellHasEvent,
                  ]}>
                    <Text
                      style={[
                        s.cellText,
                        hasEvent && !isSelected && !isToday && s.cellHasEventText,
                        isToday && s.cellTodayText,
                        isSelected && s.cellSelectedText,
                      ]}
                    >
                      {n}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipRow}
        >
          {categories.map((cat) => (
            <CategoryChip
              key={cat.value}
              label={cat.label}
              active={activeCategory === cat.value}
              onPress={() => setActiveCategory(cat.value)}
            />
          ))}
        </ScrollView>

        {/* Events list */}
        <View style={s.listHeader}>
          <Text style={s.listTitle}>
            {selectedDay
              ? `Events on ${month} ${selectedDay}`
              : 'Upcoming Events'}
          </Text>
          <Pressable style={s.sortBtn} onPress={() => setSort(sort === 'Date' ? 'Popularity' : 'Date')}>
            <Text style={s.sortText}>Sort by: <Text style={s.sortBold}>{sort}</Text></Text>
            <Ionicons name="swap-vertical" size={14} color={colors.primary} />
          </Pressable>
        </View>

        {filteredEvents.length > 0 ? (
          filteredEvents.map((e) => (
            <CompactEventCard
              key={e.id}
              event={e}
              onPress={() => navigation.navigate('Event', { id: e.id })}

            />
          ))
        ) : (
          <EmptyState
            icon="calendar-outline"
            title="No events found"
            subtitle={
              selectedDay
                ? `No events on ${month} ${selectedDay}. Try another date.`
                : 'Try adjusting your filters or search.'
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const CELL_SIZE = `${100 / 7}%` as any;

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

  // Calendar card
  calendarCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  arrowBtn: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabel: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  cell: {
    width: CELL_SIZE,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellToday: {
    backgroundColor: '#333333',
  },
  cellSelected: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#000',
  },
  cellText: {
    fontSize: 14,
    color: colors.onSurface,
    fontWeight: '500',
  },
  cellTodayText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  cellSelectedText: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
  cellHasEvent: {
    backgroundColor: colors.primary,
  },
  cellHasEventText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // Chips
  chipRow: {
    gap: 8,
    paddingBottom: 24,
  },

  // List
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onBackground,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  sortBold: {
    fontWeight: '700',
    color: colors.primary,
  },
});
