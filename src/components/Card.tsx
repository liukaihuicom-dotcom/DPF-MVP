import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { shadows } from '@/src/theme/colors';
import { layout, radius } from '@/src/theme/tokens';

type CardProps = PropsWithChildren<{
  compact?: boolean;
  highlight?: boolean;
  surface?: 'default' | 'emphasis' | 'list' | 'plain' | 'risk';
  style?: ViewStyle;
}>;

export function Card({ children, compact, highlight, surface = highlight ? 'emphasis' : 'default', style }: CardProps) {
  const colors = useThemeColors();
  const surfaceStyle = {
    default: { backgroundColor: colors.surface.panel },
    emphasis: { backgroundColor: colors.surface.raised },
    list: { backgroundColor: colors.surface.panel },
    plain: { backgroundColor: colors.surface.canvas },
    risk: { backgroundColor: colors.surface.subtle },
  }[surface];

  return (
    <View
      style={StyleSheet.flatten([
        styles.card,
        surfaceStyle,
        surface === 'emphasis' && shadows.panel,
        compact && styles.compact,
        surface === 'list' && styles.list,
        surface === 'plain' && styles.plain,
        style,
      ])}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  compact: {
    paddingHorizontal: layout.cardPaddingCompactX,
    paddingVertical: layout.cardPaddingCompactY,
  },
  list: {
    overflow: 'hidden',
    paddingVertical: layout.cardListPaddingY,
  },
  plain: {
    borderRadius: radius.none,
  },
});
