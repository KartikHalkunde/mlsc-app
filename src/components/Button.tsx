import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, elevation } from '../theme';

type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  compact?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  iconPosition?: 'left' | 'right';
};

export function Button({
  title,
  onPress,
  variant = 'filled',
  icon,
  loading = false,
  compact = false,
  style,
  disabled = false,
  iconPosition = 'left',
}: Props) {
  const isFilled = variant === 'filled';
  const isTonal = variant === 'tonal';
  const isOutlined = variant === 'outlined';
  const isDanger = variant === 'danger';

  const bgColor = isFilled
    ? colors.primary
    : isTonal
    ? colors.secondaryContainer
    : isDanger
    ? colors.errorContainer
    : 'transparent';

  const textColor = isFilled
    ? colors.onPrimary
    : isTonal
    ? colors.onSecondaryContainer
    : isDanger
    ? colors.onErrorContainer
    : colors.primary;

  const rippleColor = isFilled
    ? 'rgba(255,255,255,0.2)'
    : isTonal
    ? colors.onSecondaryContainer + '1A'
    : isDanger
    ? colors.error + '1A'
    : colors.primary + '1A';

  return (
    <View
      style={[
        s.container,
        compact && s.containerCompact,
        style,
        isFilled && elevation.level1,
        (disabled || loading) && s.disabled,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={loading || disabled}
        android_ripple={{ color: rippleColor, borderless: false }}
        style={({ pressed }) => [
          s.button,
          compact && s.buttonCompact,
          { backgroundColor: bgColor },
          isOutlined && s.outlined,
          pressed && !loading && { opacity: 0.92 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <Ionicons name={icon} color={textColor} size={compact ? 16 : 18} />}
            <Text
              style={[
                s.text,
                compact && s.textCompact,
                { color: textColor },
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && <Ionicons name={icon} color={textColor} size={compact ? 16 : 18} />}
          </>
        )}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  containerCompact: {
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.5,
  },
  button: {
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  buttonCompact: {
    height: 36,
    paddingHorizontal: 16,
    gap: 6,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.outline,
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.1,
  },
  textCompact: {
    fontSize: 13,
  },
});
