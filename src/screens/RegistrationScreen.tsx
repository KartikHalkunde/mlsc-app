import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { events, getClub } from '../data/events';
import { useStudent } from '../context/UserContext';
import { colors, radius, spacing, elevation } from '../theme';

export function RegistrationScreen({ route, navigation }: any) {
  const { student, enrollEvent, joinClub } = useStudent();
  const [enrolled, setEnrolled] = useState(false);
  const isClub = route.params.type === 'club';
  
  const target = isClub 
    ? getClub(route.params.id)
    : events.find((x) => x.id === route.params.id);
    
  const c = isClub 
    ? target 
    : getClub((target as any)?.clubId);

  if (!student || !target || !c) return null;

  if (enrolled) return (
    <SafeAreaView style={s.safe}>
      <View style={s.success}>
        <View style={s.check}><Ionicons name="checkmark" size={36} color="#fff" /></View>
        <Text style={s.successTitle}>Registration Successful!</Text>
        <Text style={s.successText}>You have successfully {isClub ? 'joined' : 'registered for'} {isClub ? (target as any).name : (target as any).title}.</Text>
        <View style={[s.successCard, elevation.level1]}>
          {!isClub && (
            <>
              <Detail icon="calendar-outline" label="Date" value={(target as any).date} />
              <Detail icon="time-outline" label="Time" value={(target as any).time} />
              <Detail icon="location-outline" label="Venue" value={(target as any).venue} />
            </>
          )}
          <Detail icon="people-outline" label={isClub ? 'Club' : 'Organizer'} value={(c as any).name} />
        </View>
        <Text style={s.confirmNote}>Confirmation sent to your email.</Text>
        <Button title={isClub ? "Back to Club" : "Back to Events"} variant="tonal" onPress={() => navigation.goBack()} style={{ width: '100%', marginTop: 20 }} />
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>{isClub ? 'Join' : 'Register for'} {isClub ? (target as any).name : (target as any).title}</Text>
        <Text style={s.sub}>Confirm your details to complete {isClub ? 'registration' : 'registration'}.</Text>

        <View style={[s.eventCard, elevation.level1]}>
          <Text style={s.eventName}>{isClub ? (target as any).name : (target as any).title}</Text>
          {!isClub && (
            <>
              <Text style={s.eventInfo}>{(target as any).date} · {(target as any).time}</Text>
              <Text style={s.eventInfo}>{(target as any).venue}</Text>
            </>
          )}
          {isClub && (
            <Text style={s.eventInfo}>{(target as any).tagline}</Text>
          )}
        </View>

        <Text style={s.label}>YOUR INFORMATION</Text>
        <Text style={s.note}>We'll use your profile information for this registration.</Text>

        <View style={s.profilePreview}>
          <Avatar avatarId={student.avatar} name={student.name} size={52} />
          <View style={{ flex: 1 }}>
            <Text style={s.profileName}>{student.name}</Text>
            <Text style={s.profileHandle}>@{student.username}</Text>
          </View>
        </View>

        <View style={[s.detailsCard, elevation.level1]}>
          <DetailRow label="College email" value={student.email} isFirst />
          <DetailRow label="Student ID" value={student.studentId} />
          <DetailRow label="Department / Year" value={`${student.branch} · ${student.year}`} />
          <DetailRow label="Contact number" value={student.phone} />
        </View>

        <Button title={isClub ? "Confirm Join" : "Confirm Registration"} onPress={() => { 
          if (isClub) {
            joinClub((target as any).id);
          } else {
            enrollEvent((target as any).id); 
          }
          setEnrolled(true); 
        }} style={{ marginTop: 24 }} />
        <Text style={s.privacy}>By {isClub ? 'joining' : 'registering'}, you agree to receive {isClub ? 'club-related' : 'event-related'} updates from VCET and {(c as any).shortName}.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={s.detailItem}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <View><Text style={s.detailItemLabel}>{label}</Text><Text style={s.detailItemValue}>{value}</Text></View>
    </View>
  );
}

function DetailRow({ label, value, isFirst = false }: { label: string; value: string; isFirst?: boolean }) {
  return (
    <View style={[s.detail, !isFirst && s.detailBorder]}>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: colors.onBackground, marginTop: 8 },
  sub: { fontSize: 14, lineHeight: 20, color: colors.onSurfaceVariant, marginTop: 6 },
  eventCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md, padding: 16, marginTop: 20 },
  eventName: { fontSize: 18, color: colors.onSurface, fontWeight: '700' },
  eventInfo: { fontSize: 13, color: colors.onSurfaceVariant, marginTop: 6 },
  label: { fontSize: 12, letterSpacing: 0.5, color: colors.onSurfaceVariant, fontWeight: '600', marginTop: 28 },
  note: { fontSize: 13, lineHeight: 18, color: colors.onSurfaceVariant, marginTop: 6, marginBottom: 14 },
  profilePreview: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surfaceContainerLow, borderRadius: radius.md, padding: 14, marginBottom: 14 },
  profileName: { fontSize: 16, fontWeight: '700', color: colors.onSurface },
  profileHandle: { fontSize: 13, color: colors.primary, fontWeight: '500', marginTop: 2 },
  detailsCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md, overflow: 'hidden' },
  detail: { padding: 14 },
  detailBorder: { borderTopWidth: 1, borderTopColor: colors.outlineVariant + '40' },
  detailLabel: { fontSize: 11, color: colors.onSurfaceVariant, fontWeight: '600' },
  detailValue: { fontSize: 15, color: colors.onSurface, fontWeight: '500', marginTop: 3 },
  privacy: { fontSize: 11, lineHeight: 16, textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 20, paddingHorizontal: 16 },
  success: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  check: { height: 72, width: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 24, color: colors.onBackground, fontWeight: '700', marginTop: 20 },
  successText: { fontSize: 14, lineHeight: 20, color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 },
  successCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.md, padding: 16, marginTop: 24, width: '100%', gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailItemLabel: { fontSize: 11, color: colors.onSurfaceVariant, fontWeight: '600' },
  detailItemValue: { fontSize: 13, color: colors.onSurface, fontWeight: '500' },
  confirmNote: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 16 },
});
