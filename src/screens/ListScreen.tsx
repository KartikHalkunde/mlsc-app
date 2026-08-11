import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StudentCard } from '../components/StudentCard';
import { ClubCard } from '../components/ClubCard';
import { CompactEventCard } from '../components/CompactEventCard';
import { clubs, events, people } from '../data/events';
import { colors, radius, spacing, elevation } from '../theme';

export function ListScreen({ route, navigation }: any) {
  const { title, type, dataIds } = route.params;

  let data: any[] = [];
  if (type === 'students') {
    data = dataIds ? people.filter((p: any) => dataIds.includes(p.id)) : people;
  } else if (type === 'clubs') {
    data = dataIds ? clubs.filter(c => dataIds.includes(c.id)) : clubs;
  } else if (type === 'events') {
    data = dataIds ? events.filter(e => dataIds.includes(e.id)) : events;
  } else if (type === 'activities') {
    // mock some activities since we don't have a real activities table
    data = []; 
  }

  const renderItem = ({ item }: { item: any }) => {
    if (type === 'students') {
      return (
        <View style={s.itemWrap}>
          <StudentCard 
            person={item} 
            onPress={() => navigation.navigate('UserProfile', { userId: item.id })} 
          />
        </View>
      );
    }
    if (type === 'clubs') {
      return (
        <View style={s.itemWrap}>
          <ClubCard 
            club={item} 
            onPress={() => navigation.navigate('ClubProfile', { clubId: item.id })} 
          />
        </View>
      );
    }
    if (type === 'events') {
      return (
        <View style={s.itemWrap}>
          <CompactEventCard 
            event={item} 
            onPress={() => navigation.navigate('Event', { id: item.id })} 
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.headerBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.onBackground} />
        </Pressable>
        <Text style={s.headerTitle}>{title}</Text>
        <View style={s.headerBtn} />
      </View>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={s.emptyText}>No items found.</Text>}
      />
    </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHigh,
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
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  itemWrap: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 40,
  }
});
