import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/Typography';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, spacing } from '@/src/theme/tokens';

type MetricDescriptionSheetProps = {
  description: string;
  label: string;
  value: string;
};

export function MetricDescriptionSheet({ description, label, value }: MetricDescriptionSheetProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.sheet}>
      <View style={StyleSheet.flatten([styles.valueCard, { backgroundColor: colors.surface.panel }])}>
        <AppText tone="muted" variant="caption">
          {label}
        </AppText>
        <AppText numberOfLines={1} variant="subtitle">
          {value}
        </AppText>
      </View>
      <AppText tone="muted" variant="body">
        {description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    gap: spacing.lg,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
  },
  valueCard: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    padding: spacing.md,
  },
});
