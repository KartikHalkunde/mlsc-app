import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  label: string;
  active?: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
};

export function CategoryChip({ label, active = false, onPress, icon }: Props) {
  return (
    <View style={[s.wrap, active && s.wrapActive]}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: active ? 'rgba(255,255,255,0.2)' : colors.primary + '1A', borderless: false }}
        style={s.inner}
      >
        {icon && icon}
        <Text style={[s.text, active && s.textActive]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  wrapActive: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  textActive: {
    color: '#fff',
  },
});
