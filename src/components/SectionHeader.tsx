import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.left}>
        <Text style={s.title}>{title}</Text>
        {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
      </View>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          android_ripple={{ color: colors.primary + '1A', borderless: true }}
          style={s.action}
        >
          <Text style={s.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  left: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onBackground,
  },
  subtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  action: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: -8,
  },
  actionText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
