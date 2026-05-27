import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { shadows } from '@/src/theme/colors';
import { layout, radius } from '@/src/theme/tokens';

type CardProps = PropsWithChildren<{
  compact?: boolean;
  highlight?: boolean;
  style?: ViewStyle;
}>;

export function Card({ children, compact, highlight, style }: CardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={StyleSheet.flatten([
        styles.card,
        {
          backgroundColor: highlight ? colors.surface.raised : colors.surface.panel,
        },
        highlight && shadows.panel,
        compact && styles.compact,
        style,
      ])}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  compact: {
    paddingHorizontal: layout.cardPaddingCompactX,
    paddingVertical: layout.cardPaddingCompactY,
  },
});
