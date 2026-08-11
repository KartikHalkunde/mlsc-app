import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '../theme';

export function FormInput({
  label,
  error,
  ...props
}: { label: string; error?: string } & TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={s.wrap}>
      <Text style={[s.label, focused && s.labelFocused, error && s.labelError]}>
        {label}
      </Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.onSurfaceVariant + '80'}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[
          s.input,
          props.multiline && s.multi,
          focused && s.focus,
          error && s.error,
          props.style,
        ]}
      />
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  labelFocused: {
    color: colors.primary,
  },
  labelError: {
    color: colors.error,
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    color: colors.onSurface,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: colors.surfaceContainerLowest,
  },
  multi: {
    minHeight: 100,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  focus: {
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 15,
    backgroundColor: colors.surfaceContainerLow,
  },
  error: {
    borderColor: colors.error,
    borderWidth: 2,
    paddingHorizontal: 15,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});
