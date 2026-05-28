import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { resolveIconTone, type AppIconName, type IconTone, type LegacyAppIconName } from '@/src/icons/iconRegistry';
import { useThemeColors } from '@/src/settings/ProductSettings';
import type { ThemeColors } from '@/src/theme/colors';
import { layout, radius } from '@/src/theme/tokens';

import { AppIcon } from './AppIcon';
import type { AppIconStyleVariant } from './AppIcon';

export type IconSurfaceTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'up' | 'down' | 'tertiary' | 'disabled';
export type IconSurfaceSizeVariant = keyof typeof layout.iconSurface;
export type IconSurfaceBackground = 'visible' | 'hidden';

type IconSurfaceProps = {
  accessibilityLabel?: string;
  background?: IconSurfaceBackground;
  decorative?: boolean;
  icon: AppIconName | LegacyAppIconName;
  sizeVariant?: IconSurfaceSizeVariant;
  style?: StyleProp<ViewStyle>;
  styleVariant?: AppIconStyleVariant;
  tone?: IconSurfaceTone;
};

export type IconSurfaceColors = {
  backgroundColor: string;
  iconTone: IconTone;
};

export function resolveIconSurfaceTone(colors: ThemeColors, tone: IconSurfaceTone = 'neutral'): IconSurfaceColors {
  switch (tone) {
    case 'brand':
      return { backgroundColor: colors.overlay.brand.subtle, iconTone: 'brand' };
    case 'success':
      return { backgroundColor: `${colors.status.success.fg}12`, iconTone: 'success' };
    case 'down':
      return { backgroundColor: colors.overlay.down.subtle, iconTone: 'down' };
    case 'warning':
      return { backgroundColor: colors.overlay.warning.subtle, iconTone: 'warning' };
    case 'danger':
    case 'up':
      return { backgroundColor: colors.overlay.up.subtle, iconTone: 'up' };
    case 'info':
      return { backgroundColor: colors.overlay.info.subtle, iconTone: 'info' };
    case 'tertiary':
      return { backgroundColor: colors.surface.subtle, iconTone: 'tertiary' };
    case 'disabled':
      return { backgroundColor: colors.surface.disabled, iconTone: 'disabled' };
    case 'neutral':
    default:
      return { backgroundColor: colors.surface.subtle, iconTone: 'primary' };
  }
}

export function IconSurface({
  accessibilityLabel,
  background = 'visible',
  decorative = true,
  icon,
  sizeVariant = 'md',
  style,
  styleVariant = 'line',
  tone = 'neutral',
}: IconSurfaceProps) {
  const colors = useThemeColors();
  const surface = layout.iconSurface[sizeVariant] ?? layout.iconSurface.md;
  const toneConfig = resolveIconSurfaceTone(colors, tone);
  const backgroundColor = background === 'visible' ? toneConfig.backgroundColor : 'transparent';

  return (
    <View
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
      accessibilityRole={decorative ? undefined : 'image'}
      accessible={!decorative}
      style={StyleSheet.flatten([
        styles.surface,
        {
          backgroundColor,
          borderRadius: radius.full,
          height: surface.container,
          width: surface.container,
        },
        style,
      ])}>
      <AppIcon name={icon} size={surface.icon} styleVariant={styleVariant} tone={toneConfig.iconTone} />
    </View>
  );
}

export function resolveIconSurfaceColors(colors: ThemeColors, tone: IconSurfaceTone = 'neutral') {
  const resolved = resolveIconSurfaceTone(colors, tone);
  return {
    backgroundColor: resolved.backgroundColor,
    iconColor: resolveIconTone(colors, resolved.iconTone),
    iconTone: resolved.iconTone,
  };
}

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
