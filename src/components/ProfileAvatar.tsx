import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useProductSettings } from '@/src/settings/ProductSettings';

export type ProfileAvatarId = 'frank' | 'mika' | 'alex' | 'sophia';

type ProfileAvatarProps = {
  id: ProfileAvatarId;
  selected?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

const avatarSources: Record<ProfileAvatarId, { uri: string }> = {
  alex: {
    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80',
  },
  frank: {
    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=80',
  },
  mika: {
    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&h=240&q=80',
  },
  sophia: {
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80',
  },
};

export function getProfileAvatarUri(id: ProfileAvatarId) {
  return avatarSources[id].uri;
}

export const profileAvatarOptions: { id: ProfileAvatarId; name: string }[] = [
  { id: 'frank', name: 'Frank' },
  { id: 'mika', name: 'Mika' },
  { id: 'alex', name: 'Alex' },
  { id: 'sophia', name: 'Sophia' },
];

export function ProfileAvatar({ id, selected, size = 58, style }: ProfileAvatarProps) {
  const { colors } = useProductSettings();
  const borderWidth = selected ? 3 : 1;

  return (
    <View
      style={StyleSheet.flatten([
        styles.frame,
        {
          backgroundColor: colors.surface.subtle,
          borderColor: selected ? colors.text.primary : colors.border.subtle,
          borderRadius: size / 2,
          borderWidth,
          height: size,
          width: size,
        },
        style,
      ])}>
      <Image resizeMode="cover" source={avatarSources[id]} style={StyleSheet.flatten([styles.image, { borderRadius: size / 2 }])} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
