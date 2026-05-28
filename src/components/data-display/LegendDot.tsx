import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { resolveThemeTone } from '@/src/theme/colors';
import { radius, size, spacing } from '@/src/theme/tokens';

import type { IconTone } from '../AppIcon';
import { AppText } from '../Typography';

type LegendDotProps = {
  label: string;
  tone: Extract<IconTone, 'amber' | 'blue' | 'brand' | 'danger' | 'down' | 'success' | 'text' | 'textDim' | 'textMuted' | 'up'>;
};

export function LegendDot({ label, tone }: LegendDotProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.item}>
      <View style={StyleSheet.flatten([styles.dot, { backgroundColor: resolveThemeTone(colors, tone) }])} />
      <AppText tone="muted" variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: radius.full,
    height: size.icon.xs,
    width: size.icon.xs,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
