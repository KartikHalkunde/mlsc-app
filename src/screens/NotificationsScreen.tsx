import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../components/NotificationItem';
import { EmptyState } from '../components/EmptyState';
import { notifications } from '../data/notifications';
import { colors, spacing } from '../theme';

export function NotificationsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.onBackground} />
          </Pressable>
          <Text style={s.title}>Notifications</Text>
        </View>

        {notifications.length > 0 ? (
          <View style={s.list}>
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                avatarId={n.avatarId}
                name={n.name}
                action={n.action}
                time={n.time}
                read={n.read}
                icon={n.icon as any}
                iconColor={n.iconColor}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="notifications-outline"
            title="All caught up!"
            subtitle="You have no new notifications."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  backBtn: { height: 44, width: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  title: { fontSize: 24, fontWeight: '700', color: colors.onBackground },
  list: { borderRadius: 12, backgroundColor: colors.surfaceContainerLowest, overflow: 'hidden' },
});
