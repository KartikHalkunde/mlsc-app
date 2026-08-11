import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getAvatarUrl } from '../data/avatars';
import { colors } from '../theme';

type Props = {
  avatarId?: string;
  name?: string;
  size?: number;
  borderColor?: string;
  showBorder?: boolean;
};

export function Avatar({
  avatarId,
  name,
  size = 48,
  borderColor = colors.primary,
  showBorder = false,
}: Props) {
  const hasAvatar = avatarId && avatarId !== '';
  const borderW = showBorder ? 2.5 : 0;
  const innerSize = size - borderW * 2;

  return (
    <View
      style={[
        s.wrap,
        {
          height: size,
          width: size,
          borderRadius: size / 2,
          borderColor: showBorder ? borderColor : 'transparent',
          borderWidth: borderW,
        },
      ]}
    >
      {hasAvatar ? (
        <Image
          source={{ uri: getAvatarUrl(avatarId) }}
          style={[
            s.image,
            {
              height: innerSize,
              width: innerSize,
              borderRadius: innerSize / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            s.fallback,
            {
              height: innerSize,
              width: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: borderColor,
            },
          ]}
        >
          <Text style={[s.initial, { fontSize: size * 0.36 }]}>
            {name?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#fff',
    fontWeight: '700',
  },
});
