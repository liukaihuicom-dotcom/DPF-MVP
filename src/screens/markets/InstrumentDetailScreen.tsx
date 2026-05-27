import { useMemo, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Line, Path, Rect, Stop } from 'react-native-svg';

import { InstrumentIcon } from '@/src/components/InstrumentIcon';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon } from '@/src/components/AppIcon';
import { HeaderIconButton } from '@/src/components/HeaderIconButton';
import { getQuoteChangeVisual } from '@/src/components/quoteVisuals';
import { Screen } from '@/src/components/Screen';
import { SegmentedTabs } from '@/src/components/SegmentedTabs';
import { AppText } from '@/src/components/Typography';
import type { Instrument } from '@/src/domain/types';
import { directionLabel, formatMoney, formatNumber, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { calculateMargin, getDisplayChange } from '@/src/domain/trading';
import { useToast } from '@/src/feedback/Toast';
import type { Locale, TranslationKey } from '@/src/i18n/translations';
import { impactLight } from '@/src/feedback/haptics';
import { navigateBackOrReplace, safeRouteTargets } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import type { ThemeColors } from '@/src/theme/colors';
import { lineWidth, radius, spacing, typography } from '@/src/theme/tokens';

type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y';
type DetailTabKey = 'chart' | 'news' | 'signals' | 'specs';

const detailTabs: { id: DetailTabKey; labelKey: 'instrument.tab.chart' | 'instrument.tab.news' | 'instrument.tab.signals' | 'instrument.tab.specs' }[] = [
  { id: 'chart', labelKey: 'instrument.tab.chart' },
  { id: 'specs', labelKey: 'instrument.tab.specs' },
  { id: 'news', labelKey: 'instrument.tab.news' },
  { id: 'signals', labelKey: 'instrument.tab.signals' },
];
export default function InstrumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findInstrument } = useBroker();
  const { locale, colors, t } = useProductSettings();
  const toast = useToast();
  const { width } = useWindowDimensions();
  const [selectedTab, setSelectedTab] = useState<DetailTabKey>('chart');
  const instrument = findInstrument(id);
  const chartValues = useMemo(
    () => (instrument ? buildDetailSeries(instrument.sparkline, '3M') : []),
    [instrument],
  );

  if (!instrument) {
    return (
      <Screen back backHref="/markets" title={t('common.invalidInstrument')}>
        <AppText variant="title">{t('common.invalidInstrument')}</AppText>
      </Screen>
    );
  }

  const { change, changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, colors);
  const chartWidth = Math.min(Math.max(width - 48, 312), 382);
  const sampleLots = instrument.symbol === 'XAU/USD' ? 0.2 : 0.1;
  const weekHigh = Math.max(instrument.dayHigh, ...instrument.sparkline);
  const weekLow = Math.min(instrument.dayLow, ...instrument.sparkline);
  const quoteMetricColumns: { label: string; tone?: 'default' | 'down' | 'up'; value: string }[][] = [
    [
      { label: t('instrument.open'), value: formatPrice(instrument, instrument.previousClose) },
      { label: t('instrument.dayHigh'), tone: 'down', value: formatPrice(instrument, instrument.dayHigh) },
      { label: t('instrument.weekHigh'), value: formatPrice(instrument, weekHigh) },
    ],
    [
      { label: t('instrument.prevClose'), value: formatPrice(instrument, instrument.previousClose) },
      { label: t('instrument.dayLow'), tone: 'up', value: formatPrice(instrument, instrument.dayLow) },
      { label: t('common.spread'), value: `${instrument.spread}` },
    ],
  ];
  const showPlaceholder = (action: string) => {
    void impactLight();
    toast.show({
      message: t('top.placeholderMessage'),
      title: t('top.placeholderTitle', { action }),
    });
  };
  const openOrder = (direction: 'buy' | 'sell') => {
    void impactLight();
    router.push(`/order/${instrument.id}?direction=${direction}` as never);
  };

  return (
    <View style={StyleSheet.flatten([styles.shell, { backgroundColor: colors.surface.canvas }])}>
      <Stack.Screen options={{ title: instrument.symbol }} />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          style={StyleSheet.flatten([styles.scroller, { backgroundColor: colors.surface.canvas }])}>
          <View style={StyleSheet.flatten([styles.detailPage, { backgroundColor: colors.surface.panel }])}>
            <View style={styles.pageActions}>
              <HeaderIconButton
                accessibilityLabel={t('top.back')}
                icon="icon.system.back"
                onPress={() => {
                  void impactLight();
                  navigateBackOrReplace(safeRouteTargets.markets);
                }}
                tone="default"
              />

              <View style={StyleSheet.flatten([styles.actionCapsule, { backgroundColor: colors.surface.subtle, borderColor: colors.border.default }])}>
                <HeaderIconButton
                  accessibilityLabel={t('instrument.share')}
                  icon="icon.ib.network"
                  onPress={() => showPlaceholder(t('instrument.share'))}
                  style={styles.capsuleButton}
                  tone="default"
                  variant="ghost"
                />
                <HeaderIconButton
                  accessibilityLabel={t('top.more')}
                  icon="icon.system.more"
                  onPress={() => showPlaceholder(t('top.more'))}
                  style={styles.capsuleButton}
                  variant="ghost"
                />
              </View>
            </View>

            <View style={StyleSheet.flatten([styles.quoteArea, { backgroundColor: colors.surface.panel }])}>
              <View style={styles.identityBlock}>
                <InstrumentIcon instrument={instrument} size={44} />
                <View style={styles.identityCopy}>
                  <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.instrumentTitle}>
                    {instrument.symbol}
                  </AppText>
                  <AppText numberOfLines={1} style={styles.instrumentSubtitle} tone="dim">
                    {localizeText(instrument.name, locale)}
                  </AppText>
                </View>
              </View>

              <View style={styles.priceBlock}>
                <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.lastPrice}>
                  {formatPrice(instrument, instrument.bid)}
                </AppText>
                <AppText style={styles.inlineChange} tone={quoteVisual.tone}>
                  {changePercent >= 0 ? '▲' : '▼'} {change > 0 ? '+' : ''}
                  {formatPrice(instrument, change)} ({formatPercent(changePercent)})
                </AppText>
              </View>

              <View style={styles.quoteInfoGrid}>
                {quoteMetricColumns.map((column) => (
                  <View key={column.map((item) => item.label).join('-')} style={styles.quoteInfoColumn}>
                    {column.map((item) => (
                      <QuoteStat key={item.label} label={item.label} tone={item.tone} value={item.value} />
                    ))}
                  </View>
                ))}
              </View>
            </View>

            <View style={StyleSheet.flatten([styles.divider, { backgroundColor: colors.border.subtle }])} />

            <SegmentedTabs
              equalWidth={false}
              items={detailTabs.map((tab) => {
                const label = t(tab.labelKey);

                return {
                  accessibilityLabel: label,
                  label,
                  value: tab.id,
                };
              })}
              onValueChange={(nextTab) => {
                void impactLight();
                setSelectedTab(nextTab);
              }}
              style={styles.detailTabs}
              value={selectedTab}
              variant="underline"
            />

            {selectedTab === 'chart' ? (
              <>
                <DetailChart
                  color={quoteVisual.color}
                  instrument={instrument}
                  colors={colors}
                  rangeEndLabel={t('instrument.now')}
                  rangeStartLabel={t('instrument.open')}
                  values={chartValues}
                  width={chartWidth}
                />
                <VolumeBars color={quoteVisual.color} colors={colors} values={chartValues} width={chartWidth} />
              </>
            ) : null}

            <InstrumentTabPanel
              instrument={instrument}
              locale={locale}
              colors={colors}
              sampleLots={sampleLots}
              selectedTab={selectedTab}
              t={t}
            />

            <View style={StyleSheet.flatten([styles.riskPanel, { borderColor: colors.border.subtle }])}>
              <AppText style={styles.riskText} tone="amber">{t('risk.general')}</AppText>
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor: colors.surface.raised, borderTopColor: colors.border.subtle }])}>
          <View style={styles.tradeRow}>
            <NativePressable
              accessibilityLabel={`${directionLabel('sell', locale)} ${formatPrice(instrument, instrument.bid)}`}
              onPress={() => openOrder('sell')}
              style={StyleSheet.flatten([styles.tradeButton, { backgroundColor: colors.market.up.fg }])}>
              <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.tradeText} tone="white">
                {directionLabel('sell', locale)} {formatPrice(instrument, instrument.bid)}
              </AppText>
            </NativePressable>
            <NativePressable
              accessibilityLabel={`${directionLabel('buy', locale)} ${formatPrice(instrument, instrument.ask)}`}
              onPress={() => openOrder('buy')}
              style={StyleSheet.flatten([styles.tradeButton, { backgroundColor: colors.market.down.fg }])}>
              <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.tradeText} tone="white">
                {directionLabel('buy', locale)} {formatPrice(instrument, instrument.ask)}
              </AppText>
            </NativePressable>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}

function InstrumentTabPanel({
  instrument,
  locale,
  colors,
  sampleLots,
  selectedTab,
  t,
}: {
  instrument: Instrument;
  locale: Locale;
  colors: ThemeColors;
  sampleLots: number;
  selectedTab: DetailTabKey;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  if (selectedTab === 'chart' || selectedTab === 'specs') {
    return (
      <View style={styles.dataGrid}>
        <MetricColumn
          items={[
            [t('instrument.open'), formatPrice(instrument, instrument.previousClose)],
            [t('common.spread'), `${instrument.spread}`],
            [t('instrument.dayLow'), formatPrice(instrument, instrument.dayLow)],
          ]}
          colors={colors}
        />
        <View style={StyleSheet.flatten([styles.gridDivider, { backgroundColor: colors.border.default }])} />
        <MetricColumn
          items={[
            [t('instrument.dayHigh'), formatPrice(instrument, instrument.dayHigh)],
            [t('common.leverage'), `${instrument.leverage}x`],
            [t('instrument.marginSample', { lots: sampleLots }), formatMoney(calculateMargin(instrument, sampleLots, instrument.ask), 'USD', 0, locale)],
          ]}
          colors={colors}
        />
        <View style={StyleSheet.flatten([styles.gridDivider, { backgroundColor: colors.border.default }])} />
        <MetricColumn
          items={[
            [t('instrument.baseCurrency'), instrument.baseCurrency],
            [t('instrument.quoteCurrency'), instrument.quoteCurrency],
            [t('common.contractSize'), formatNumber(instrument.contractSize, 0, locale)],
          ]}
          colors={colors}
        />
      </View>
    );
  }

  if (selectedTab === 'news') {
    return (
      <View style={styles.pagePanel}>
        <AppText style={styles.newsSource} tone="dim">{t('instrument.marketBriefSource')}</AppText>
        <AppText style={styles.newsTitle}>{t('instrument.marketBriefTitle')}</AppText>
        <AppText style={styles.panelBodyText} tone="muted">{t('instrument.marketBriefBody')}</AppText>
        <View style={styles.newsFooter}>
          <AppText style={styles.newsBrand} tone="muted">dupoin/market</AppText>
          <AppText style={styles.marketStatus} tone="dim">{t('instrument.marketOpen')}</AppText>
        </View>
      </View>
    );
  }

  const { changePercent } = getDisplayChange(instrument);

  return (
    <View style={styles.pagePanel}>
      <AppText style={styles.newsSource} tone="dim">{t('instrument.signalSource')}</AppText>
      <AppText style={styles.newsTitle}>{t('instrument.signalTitle')}</AppText>
      <AppText style={styles.panelBodyText} tone="muted">{t('instrument.signalBody')}</AppText>
      <View style={styles.signalRows}>
        {[
          [t('instrument.signalBias'), changePercent >= 0 ? t('common.buy') : t('common.sell')],
          [t('instrument.signalRisk'), t('risk.general')],
        ].map(([label, value]) => (
          <View key={label} style={StyleSheet.flatten([styles.signalRow, { borderTopColor: colors.border.subtle }])}>
            <AppText style={styles.metricLabel} tone="dim">{label}</AppText>
            <AppText style={styles.metricValue}>{value}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function DetailChart({
  color,
  instrument,
  colors,
  rangeEndLabel,
  rangeStartLabel,
  values,
  width,
}: {
  color: string;
  instrument: Instrument;
  colors: ThemeColors;
  rangeEndLabel: string;
  rangeStartLabel: string;
  values: number[];
  width: number;
}) {
  const height = 258;
  const axisWidth = 68;
  const chartWidth = width - axisWidth;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.12, instrument.pipSize * 8);
  const scaleMin = min - padding;
  const scaleMax = max + padding;
  const range = scaleMax - scaleMin || 1;
  const topPad = 14;
  const bottomPad = 34;
  const plotHeight = height - topPad - bottomPad;
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * chartWidth;
    const y = topPad + plotHeight - ((value - scaleMin) / range) * plotHeight;

    return { x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - bottomPad} L 0 ${height - bottomPad} Z`;
  const gridY = [topPad, topPad + plotHeight * 0.5, topPad + plotHeight];
  const labels = [scaleMax, (scaleMax + scaleMin) / 2, scaleMin];
  const gradientId = `detail-chart-${instrument.id}`;

  return (
    <View style={StyleSheet.flatten([styles.chartFrame, { borderColor: colors.border.subtle, width }])}>
      <Svg height={height} width={width}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.36} />
            <Stop offset="1" stopColor={color} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        {gridY.map((y) => (
          <Line key={`grid-${y}`} stroke={colors.border.subtle} strokeOpacity={0.9} strokeWidth={1} x1={0} x2={chartWidth} y1={y} y2={y} />
        ))}
        <Line stroke={colors.border.subtle} strokeOpacity={0.9} strokeWidth={1} x1={chartWidth * 0.66} x2={chartWidth * 0.66} y1={topPad} y2={height - bottomPad} />
        <Path d={areaPath} fill={`url(#${gradientId})`} />
        <Path d={linePath} fill="none" stroke={color} strokeLinejoin="round" strokeWidth={3.4} />
      </Svg>
      <View style={styles.axisLabels}>
        {labels.map((label) => (
          <AppText key={label} style={styles.axisText} tone="muted">
            {formatPrice(instrument, label)}
          </AppText>
        ))}
      </View>
      <View style={StyleSheet.flatten([styles.chartBaseline, { backgroundColor: colors.text.tertiary }])} />
      <View style={styles.monthLabels}>
        <AppText style={styles.monthLabel} tone="muted">{rangeStartLabel}</AppText>
        <AppText style={styles.monthLabel} tone="muted">{rangeEndLabel}</AppText>
      </View>
    </View>
  );
}

function VolumeBars({ color, colors, values, width }: { color: string; colors: ThemeColors; values: number[]; width: number }) {
  const height = 44;
  const barGap = 5;
  const barCount = Math.min(values.length, 40);
  const source = values.slice(-barCount);
  const chartWidth = width - 72;
  const barWidth = Math.max((chartWidth - barGap * (source.length - 1)) / source.length, 2);
  const deltas = source.map((value, index) => Math.abs(value - (source[index - 1] ?? value)));
  const maxDelta = Math.max(...deltas, 1);

  return (
    <View style={StyleSheet.flatten([styles.volumeWrap, { width }])}>
      <Svg height={height} width={chartWidth}>
        {source.map((_, index) => {
          const delta = deltas[index];
          const barHeight = 4 + (delta / maxDelta) * 30;
          const x = index * (barWidth + barGap);

          return <Rect fill={index % 7 === 0 ? color : colors.text.tertiary} height={barHeight} key={`bar-${index}`} opacity={0.78} rx={barWidth / 2} width={barWidth} x={x} y={height - barHeight - 6} />;
        })}
      </Svg>
    </View>
  );
}

function QuoteStat({ label, tone = 'default', value }: { label: string; tone?: 'default' | 'down' | 'up'; value: string }) {
  return (
    <View style={styles.quoteStat}>
      <AppText numberOfLines={1} style={styles.quoteStatLabel} tone="dim">
        {label}
      </AppText>
      <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.quoteStatValue} tone={tone}>
        {value}
      </AppText>
    </View>
  );
}

function MetricColumn({ items, colors }: { items: [string, string][]; colors: ThemeColors }) {
  return (
    <View style={styles.metricColumn}>
      {items.map(([label, value]) => (
        <View key={label} style={styles.metricLine}>
          <AppText numberOfLines={1} style={styles.metricLabel} tone="dim">
            {label}
          </AppText>
          <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.metricValue}>
            {value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function buildDetailSeries(values: number[], timeframe: Timeframe) {
  const multipliers: Record<Timeframe, number> = {
    '1D': 0.38,
    '1W': 0.68,
    '1M': 1,
    '3M': 1.28,
    '1Y': 1.62,
  };
  const source = values.length > 1 ? values : [values[0] ?? 1, values[0] ?? 1];
  const expanded: number[] = [];
  const volatility = (Math.max(...source) - Math.min(...source) || source[0] * 0.002) * multipliers[timeframe];

  source.forEach((value, index) => {
    const next = source[index + 1] ?? value;
    const segmentCount = index === source.length - 1 ? 1 : 5;

    for (let step = 0; step < segmentCount; step += 1) {
      const progress = step / segmentCount;
      const wave = Math.sin((expanded.length + 1) * 1.7) * volatility * 0.12;
      const notch = expanded.length % 9 === 0 ? -volatility * 0.18 : expanded.length % 7 === 0 ? volatility * 0.1 : 0;
      expanded.push(value + (next - value) * progress + wave + notch);
    }
  });

  return expanded.slice(-42);
}

const styles = StyleSheet.create({
  actionCapsule: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 10,
  },
  axisLabels: {
    gap: 68,
    position: 'absolute',
    right: 0,
    top: 12,
    width: 64,
  },
  axisText: {
    ...typography.captionSm,
  },
  capsuleButton: {
    width: 40,
  },
  chartBaseline: {
    bottom: 34,
    height: lineWidth.hairline,
    left: 0,
    opacity: 0.7,
    position: 'absolute',
    right: 68,
  },
  chartFrame: {
    borderWidth: lineWidth.none,
    height: 258,
    marginTop: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    paddingBottom: 132,
  },
  dataGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  divider: {
    height: lineWidth.hairline,
    marginTop: spacing.md,
  },
  detailPage: {
    minHeight: 780,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  detailTabs: {
    gap: 24,
    marginTop: 8,
  },
  footerSafe: {
    borderTopWidth: lineWidth.hairline,
  },
  gridDivider: {
    width: lineWidth.hairline,
  },
  identityBlock: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
  },
  inlineChange: {
    ...typography.bodyMd,
    marginTop: spacing.xxs,
  },
  instrumentSubtitle: {
    ...typography.captionSm,
    minWidth: 0,
  },
  instrumentTitle: {
    ...typography.displayLg,
  },
  lastPrice: {
    ...typography.quote,
  },
  marketStatus: {
    ...typography.bodyMd,
  },
  metricColumn: {
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  metricLabel: {
    ...typography.caption,
  },
  metricLine: {
    gap: 2,
  },
  metricValue: {
    ...typography.titleMd,
  },
  monthLabel: {
    ...typography.captionSm,
  },
  monthLabels: {
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 12,
    position: 'absolute',
    right: 86,
  },
  newsBrand: {
    ...typography.caption,
  },
  newsFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  newsSource: {
    ...typography.caption,
    marginTop: 12,
  },
  newsTitle: {
    ...typography.titleMd,
  },
  pagePanel: {
    gap: 10,
    marginTop: 18,
  },
  pageActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceBlock: {
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  quoteArea: {
    borderRadius: radius.none,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  quoteInfoColumn: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  quoteInfoGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xxs,
  },
  quoteStat: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minHeight: spacing.xl,
    minWidth: 0,
    paddingVertical: spacing.xxs,
  },
  quoteStatLabel: {
    ...typography.captionSm,
  },
  quoteStatValue: {
    ...typography.caption,
    flexShrink: 1,
    textAlign: 'right',
  },
  riskPanel: {
    borderRadius: 16,
    borderWidth: lineWidth.none,
    marginTop: 24,
    padding: 14,
  },
  riskText: {
    ...typography.captionSm,
  },
  panelBodyText: {
    ...typography.bodySm,
  },
  safe: {
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  shell: {
    flex: 1,
  },
  signalRow: {
    borderTopWidth: lineWidth.hairline,
    gap: 4,
    paddingTop: 10,
  },
  signalRows: {
    gap: 10,
    marginTop: 4,
  },
  tradeButton: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  tradeRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tradeText: {
    ...typography.buttonMd,
  },
  volumeWrap: {
    alignItems: 'flex-start',
    height: 44,
    justifyContent: 'center',
    marginTop: 8,
  },
});
