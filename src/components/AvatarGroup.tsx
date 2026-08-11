import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar } from './Avatar';
import { colors } from '../theme';

type Props = {
  avatarIds: { id: string; name: string }[];
  size?: number;
  max?: number;
  borderColor?: string;
};

export function AvatarGroup({
  avatarIds,
  size = 32,
  max = 3,
  borderColor = colors.surfaceContainerLowest,
}: Props) {
  const visible = avatarIds.slice(0, max);
  return (
    <View style={s.wrap}>
      {visible.map((item, i) => (
        <View
          key={item.id}
          style={[
            s.avatar,
            {
              marginLeft: i === 0 ? 0 : -(size * 0.3),
              zIndex: visible.length - i,
            },
          ]}
        >
          <Avatar
            avatarId={item.id}
            name={item.name}
            size={size}
            borderColor={borderColor}
            showBorder
          />
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {},
});
