import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { formatPercent, formatPrice } from '@/src/domain/format';
import { getDisplayChange } from '@/src/domain/trading';
import type { Instrument } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { radius, size, spacing, typography } from '@/src/theme/tokens';

import { InstrumentIcon } from './InstrumentIcon';
import { NativePressable } from './NativePressable';
import { getQuoteChangeVisual } from './quoteVisuals';
import { Sparkline } from './Sparkline';
import { AppText } from './Typography';

type FeaturedInstrumentCardProps = {
  instrument: Instrument;
};

const featuredCardWidth = size.control.lg * 3;
const featuredChartHeight = size.control.sm;

export function FeaturedInstrumentCard({ instrument }: FeaturedInstrumentCardProps) {
  const { colors, t } = useProductSettings();
  const { change, changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, colors);
  const signedChange = `${change >= 0 ? '+' : ''}${formatPrice(instrument, change)}`;

  return (
    <Link asChild href={`/instrument/${instrument.id}`}>
      <NativePressable
        accessibilityLabel={`${t('markets.hot')} ${instrument.symbol}`}
        accessibilityRole="button"
        style={StyleSheet.flatten([styles.card, { backgroundColor: colors.surface.panel }])}>
        <View style={styles.header}>
          <InstrumentIcon instrument={instrument} size={size.icon.lg} />
          <AppText numberOfLines={1} style={styles.symbol} variant="subtitle">
            {instrument.symbol}
          </AppText>
        </View>

        <View style={styles.quote}>
          <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.price} tone={quoteVisual.tone}>
            {formatPrice(instrument, instrument.ask)}
          </AppText>
          <AppText numberOfLines={1} style={styles.changeLine} tone={quoteVisual.tone}>
            {signedChange} {formatPercent(changePercent)}
          </AppText>
        </View>

        <View style={styles.chart}>
          <Sparkline color={quoteVisual.color} edgeToEdge height={featuredChartHeight} values={instrument.sparkline} width="100%" />
        </View>
      </NativePressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    gap: spacing.sm,
    minHeight: size.control.lg * 3,
    padding: spacing.md,
    width: featuredCardWidth,
  },
  changeLine: {
    ...typography.bodySm,
  },
  chart: {
    marginTop: 'auto',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  price: {
    ...typography.displayLg,
  },
  quote: {
    gap: spacing.xxs,
  },
  symbol: {
    flex: 1,
    minWidth: 0,
  },
});
