import { StyleSheet, View } from 'react-native';

import { formatMoney } from '@/src/domain/format';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppText } from '../Typography';

type RiskPriceRowProps = {
  caption: string;
  label: string;
  pnl: number;
  price: string;
};

export function RiskPriceRow({ caption, label, pnl, price }: RiskPriceRowProps) {
  const { locale, colors } = useProductSettings();
  const pnlTone = pnl >= 0 ? 'up' : 'down';
  const pnlColor = pnl >= 0 ? colors.market.up.fg : colors.market.down.fg;

  return (
    <View style={StyleSheet.flatten([styles.row, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
      <View style={styles.copy}>
        <AppText variant="caption">{label}</AppText>
        <AppText tone="muted" variant="caption">
          {caption}
        </AppText>
      </View>
      <View style={styles.valueBlock}>
        <AppText variant="number">{price}</AppText>
        <View style={StyleSheet.flatten([styles.pnlPill, { backgroundColor: `${pnlColor}12`, borderColor: `${pnlColor}55` }])}>
          <AppText tone={pnlTone} variant="caption">
            {formatMoney(pnl, 'USD', 2, locale)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  pnlPill: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  row: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minHeight: size.tab.barHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  valueBlock: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
});
