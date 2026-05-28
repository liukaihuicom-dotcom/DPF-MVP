import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import type { ThemeColors } from '@/src/theme/colors';
import { lineWidth, radius } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { AppText, type AppTextTone } from './Typography';

export type StatusPillTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand' | 'up' | 'down';
export type StatusPillAppearance = 'filled' | 'outline';

export type StatusPillProps = {
  appearance?: StatusPillAppearance;
  compact?: boolean;
  icon?: AppIconName | ReactNode;
  label: string;
  size?: 'md' | 'sm';
  style?: StyleProp<ViewStyle>;
  tone: StatusPillTone;
};

function resolveTone(colors: ThemeColors, tone: StatusPillTone): { color: string; iconTone: IconTone; textTone: AppTextTone } {
  switch (tone) {
    case 'success':
      return { color: colors.status.success.fg, iconTone: 'success', textTone: 'success' };
    case 'warning':
      return { color: colors.status.warning.fg, iconTone: 'warning', textTone: 'amber' };
    case 'danger':
      return { color: colors.status.danger.fg, iconTone: 'danger', textTone: 'danger' };
    case 'info':
      return { color: colors.status.info.fg, iconTone: 'info', textTone: 'blue' };
    case 'brand':
      return { color: colors.brand.fg, iconTone: 'brand', textTone: 'brand' };
    case 'up':
      return { color: colors.market.up.fg, iconTone: 'up', textTone: 'up' };
    case 'down':
      return { color: colors.market.down.fg, iconTone: 'down', textTone: 'down' };
    case 'neutral':
    default:
      return { color: colors.text.tertiary, iconTone: 'tertiary', textTone: 'muted' };
  }
}

export function StatusPill({ appearance = 'filled', compact, icon, label, size = compact ? 'sm' : 'md', style, tone }: StatusPillProps) {
  const colors = useThemeColors();
  const toneConfig = resolveTone(colors, tone);
  const isSmall = size === 'sm';
  const isOutline = appearance === 'outline';
  const iconNode =
    typeof icon === 'string' ? <AppIcon name={icon as AppIconName} sizeVariant={isSmall ? 'micro' : 'xs'} tone={toneConfig.iconTone} /> : icon ?? null;
  const semanticBackground = tone === 'neutral' ? colors.surface.subtle : `${toneConfig.color}12`;
  const semanticBorder = tone === 'neutral' ? colors.border.subtle : `${toneConfig.color}55`;

  return (
    <View
      style={StyleSheet.flatten([
        styles.pill,
        isSmall && styles.small,
        isOutline
          ? {
              backgroundColor: 'transparent',
              borderColor: semanticBorder,
              borderWidth: lineWidth.hairline,
            }
          : {
              backgroundColor: semanticBackground,
              borderColor: 'transparent',
              borderWidth: lineWidth.none,
            },
        style,
      ])}>
      {iconNode}
      <AppText numberOfLines={1} style={styles.label} tone={toneConfig.textTone} variant={isSmall ? 'microLabel' : 'caption'}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    borderRadius: radius.full,
    flexDirection: 'row',
    gap: 5,
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  small: {
    gap: 4,
    minHeight: 22,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  label: {
    flexShrink: 1,
    minWidth: 0,
  },
});
