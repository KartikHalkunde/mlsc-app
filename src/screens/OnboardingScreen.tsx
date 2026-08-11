import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { useStudent } from '../context/UserContext';
import { getAvatarsByGender } from '../data/avatars';
import { Gender } from '../types';
import { colors, radius, spacing } from '../theme';

export function OnboardingScreen() {
  const { register } = useStudent();
  const [f, setF] = useState({ name: '', email: '', id: '', branch: '', year: '', phone: '', username: '', bio: '' });
  const [gender, setGender] = useState<Gender>('male');
  const [avatar, setAvatar] = useState('m1');

  const set = (k: keyof typeof f) => (v: string) => setF((x) => ({ ...x, [k]: v }));
  const avatars = getAvatarsByGender(gender);

  const submit = () => {
    if (!f.email.endsWith('@vcet.edu.in')) return Alert.alert('Use your VCET email', 'Please register with your official @vcet.edu.in college email.');
    if (!f.name || !f.email || !f.username || !f.id || !f.branch || !f.year || !f.phone) return Alert.alert('Almost there', 'Please complete all profile details.');
    register({ ...f, id: f.username, studentId: f.id, bio: f.bio || "Hey, I'm on VCET Campus! 👋", avatar, banner: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', gender, clubs: [], clubRoles: {}, friends: ['aditi', 'rohan'], enrolledEvents: [] });
  };

  return (
    <KeyboardAvoidingView style={s.safe} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.brand}>
          <View style={s.logo}><Ionicons name="school" size={28} color="#fff" /></View>
          <Text style={s.college}>VIDYAVARDHINI'S COLLEGE</Text>
          <Text style={s.of}>OF ENGINEERING & TECHNOLOGY</Text>
        </View>

        <Text style={s.title}>Your campus,{'\n'}all in one place.</Text>
        <Text style={s.sub}>Create your VCET student account to discover clubs, events and people.</Text>

        <View style={s.note}>
          <Ionicons name="shield-checkmark" color={colors.onSecondaryContainer} size={18} />
          <Text style={s.noteText}>Only official VCET emails can create an account.</Text>
        </View>

        <Text style={s.sectionLabel}>I IDENTIFY AS</Text>
        <View style={s.genderRow}>
          {(['male', 'female'] as Gender[]).map((g) => (
            <View key={g} style={[s.genderPillWrap, gender === g && s.genderPillWrapActive]}>
              <Pressable style={s.genderPill} onPress={() => { setGender(g); setAvatar(g === 'male' ? 'm1' : 'f1'); }}>
                <Ionicons name={g === 'male' ? 'male' : 'female'} size={18} color={gender === g ? colors.onPrimaryContainer : colors.onSurfaceVariant} />
                <Text style={[s.genderText, gender === g && s.genderTextActive]}>{g === 'male' ? 'Male' : 'Female'}</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={s.sectionLabel}>PICK YOUR LOOK</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.avatarRow}>
          {avatars.map((a) => (
            <Pressable key={a.id} onPress={() => setAvatar(a.id)} style={[s.avatarOption, avatar === a.id && s.avatarSelected]}>
              <Image source={{ uri: a.url }} style={s.avatarImg} />
              {avatar === a.id && <View style={s.avatarCheck}><Ionicons name="checkmark" size={14} color="#fff" /></View>}
            </Pressable>
          ))}
        </ScrollView>

        <FormInput label="FULL NAME" value={f.name} onChangeText={set('name')} placeholder="Your full name" />
        <FormInput label="COLLEGE EMAIL" value={f.email} onChangeText={set('email')} placeholder="you@vcet.edu.in" keyboardType="email-address" autoCapitalize="none" />
        <FormInput label="USERNAME" value={f.username} onChangeText={set('username')} placeholder="e.g. priya_codes" autoCapitalize="none" />
        <FormInput label="YOUR ONE-LINER BIO" value={f.bio} onChangeText={set('bio')} placeholder={'e.g. "Topped the KT charts in FY 🏆"'} />
        <FormInput label="STUDENT ID" value={f.id} onChangeText={set('id')} placeholder="VCET student ID" />
        <FormInput label="BRANCH" value={f.branch} onChangeText={set('branch')} placeholder="e.g. Computer Engineering" />
        <FormInput label="YEAR" value={f.year} onChangeText={set('year')} placeholder="e.g. Third Year" />
        <FormInput label="CONTACT NUMBER" value={f.phone} onChangeText={set('phone')} placeholder="Contact number" keyboardType="phone-pad" />

        <Button title="Create my account" onPress={submit} />
        <Button
          title="Quick Demo Sign In"
          variant="tonal"
          onPress={() => {
            register({ id: 'kaartikk26', studentId: 'VCET2024CS001', name: 'Kartik Halkunde', email: 'kartik@vcet.edu.in', username: 'kaartikk26', bio: 'Ironic flex: topped the KT charts in FY 🏆', branch: 'Computer Engineering', year: 'Third Year', phone: '9876543210', avatar: 'm1', banner: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif', gender: 'male', clubs: [], clubRoles: {}, friends: ['aditi', 'rohan'], enrolledEvents: [] });
          }}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  brand: { alignItems: 'center', marginTop: 16 },
  logo: { height: 56, width: 56, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  college: { color: colors.onBackground, fontSize: 15, fontWeight: '700', letterSpacing: 0.5, marginTop: 14 },
  of: { fontSize: 10, color: colors.onSurfaceVariant, letterSpacing: 1.5, fontWeight: '700', marginTop: 3 },
  title: { fontSize: 30, lineHeight: 38, fontWeight: '700', color: colors.onBackground, marginTop: 28 },
  sub: { fontSize: 15, lineHeight: 22, color: colors.onSurfaceVariant, marginTop: 8 },
  note: { marginVertical: 20, backgroundColor: colors.secondaryContainer, borderRadius: radius.md, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center' },
  noteText: { color: colors.onSecondaryContainer, fontSize: 13, fontWeight: '500', flex: 1 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color: colors.onSurfaceVariant, marginTop: 8, marginBottom: 10 },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genderPillWrap: { flex: 1, borderRadius: radius.full, borderWidth: 1, borderColor: colors.outline, overflow: 'hidden' },
  genderPillWrapActive: { backgroundColor: colors.primaryContainer, borderColor: 'transparent' },
  genderPill: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  genderText: { fontSize: 13, fontWeight: '600', color: colors.onSurfaceVariant },
  genderTextActive: { color: colors.onPrimaryContainer },
  avatarRow: { gap: 12, paddingBottom: 20 },
  avatarOption: { height: 72, width: 72, borderRadius: 36, borderWidth: 3, borderColor: 'transparent', overflow: 'hidden', backgroundColor: colors.surfaceContainerHighest },
  avatarSelected: { borderColor: colors.primary },
  avatarImg: { height: '100%', width: '100%', resizeMode: 'cover' },
  avatarCheck: { position: 'absolute', bottom: 2, right: 2, height: 22, width: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
