import { useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppTextTone } from '@/src/components/Typography';
import { InstrumentIcon } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { HeaderIconButton } from '@/src/design-public-assets/components';
import { getQuoteChangeVisual } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { SegmentedTabs } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { TradingTerminalChart } from '@/src/design-public-assets/business-components';
import type { TradingTerminalChartState } from '@/src/components/business/TradingTerminalChart';
import type { Instrument, InstrumentMarketStatus, InstrumentQuoteStatus } from '@/src/domain/types';
import { directionLabel, formatMoney, formatNumber, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { calculateMargin, getDisplayChange } from '@/src/domain/trading';
import { useToast } from '@/src/feedback/Toast';
import type { Locale, TranslationKey } from '@/src/design-public-assets/copy';
import { impactLight } from '@/src/feedback/haptics';
import { navigateBackOrReplace, safeRouteTargets } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';
import { layout, lineWidth, radius, size, spacing, typography } from '@/src/design-public-assets/tokens';

type QuoteVisual = {
  color: string;
  tone: AppTextTone;
};

type DetailTabKey = 'chart' | 'news' | 'signals' | 'specs';
type InstrumentMetric = {
  label: string;
  tone?: 'default' | 'down' | 'up';
  value: string;
};
type InstrumentMetricGroup = {
  items: InstrumentMetric[];
  title: string;
};

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
  const [selectedTab, setSelectedTab] = useState<DetailTabKey>('chart');
  const instrument = findInstrument(id);
  if (!instrument) {
    return (
      <Screen back backHref="/markets" title={t('common.invalidInstrument')}>
        <AppText variant="title">{t('common.invalidInstrument')}</AppText>
      </Screen>
    );
  }

  const { change, changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, colors);
  const sampleLots = instrument.symbol === 'XAU/USD' ? size.chart.sampleLotsMetal : size.chart.sampleLotsDefault;
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
        <View style={StyleSheet.flatten([styles.pageHeader, { backgroundColor: colors.surface.canvas }])}>
          <HeaderIconButton
            accessibilityLabel={t('top.back')}
            icon="icon.system.back"
            onPress={() => {
              void impactLight();
              navigateBackOrReplace(safeRouteTargets.markets);
            }}
            surface="neutral"
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

        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          style={StyleSheet.flatten([styles.scroller, { backgroundColor: colors.surface.canvas }])}>
          <View style={StyleSheet.flatten([styles.detailPage, { backgroundColor: colors.surface.panel }])}>
            <MainQuoteArea
              change={change}
              changePercent={changePercent}
              instrument={instrument}
              locale={locale}
              quoteVisual={quoteVisual}
              sampleLots={sampleLots}
              t={t}
            />

            <View style={StyleSheet.flatten([styles.riskPanel, { backgroundColor: colors.status.warning.bg }])}>
              <AppText style={styles.riskText} tone="amber">{t('risk.general')}</AppText>
            </View>

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

            {selectedTab === 'chart' ? <TradingTerminalChart density="embedded" instrument={instrument} state={resolveTerminalState(instrument)} /> : null}

            <InstrumentTabPanel
              instrument={instrument}
              locale={locale}
              colors={colors}
              sampleLots={sampleLots}
              selectedTab={selectedTab}
              t={t}
            />
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor: colors.surface.raised, borderTopColor: colors.border.subtle }])}>
          <View style={styles.tradeRow}>
            <NativePressable
              accessibilityLabel={`${directionLabel('sell', locale)} ${formatPrice(instrument, instrument.bid)}`}
              onPress={() => openOrder('sell')}
              style={StyleSheet.flatten([styles.tradeButton, { backgroundColor: colors.market.down.fg }])}>
              <AppText numberOfLines={1} style={styles.tradeText} tone="white">
                {directionLabel('sell', locale)} {formatPrice(instrument, instrument.bid)}
              </AppText>
            </NativePressable>
            <NativePressable
              accessibilityLabel={`${directionLabel('buy', locale)} ${formatPrice(instrument, instrument.ask)}`}
              onPress={() => openOrder('buy')}
              style={StyleSheet.flatten([styles.tradeButton, { backgroundColor: colors.market.up.fg }])}>
              <AppText numberOfLines={1} style={styles.tradeText} tone="white">
                {directionLabel('buy', locale)} {formatPrice(instrument, instrument.ask)}
              </AppText>
            </NativePressable>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}

function MainQuoteArea({
  change,
  changePercent,
  instrument,
  locale,
  quoteVisual,
  sampleLots,
  t,
}: {
  change: number;
  changePercent: number;
  instrument: Instrument;
  locale: Locale;
  quoteVisual: QuoteVisual;
  sampleLots: number;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  const statusTone = instrument.quoteStatus === 'live' && instrument.marketStatus === 'open' ? 'up' : instrument.quoteStatus === 'restricted' ? 'danger' : 'amber';
  const snapshotItems = buildTradeSnapshot(instrument, locale, sampleLots, t);

  return (
    <View style={styles.quoteArea}>
      <View style={styles.quoteHero}>
        <View style={styles.detailContextRow}>
          <AppText numberOfLines={1} style={styles.detailContextText} tone="dim">
            {t('markets.title')} / {t('control.pageConsole.page.instrument.title')}
          </AppText>
        </View>
        <View style={styles.identityBlock}>
          <InstrumentIcon instrument={instrument} size={layout.touchTargetMin} />
          <View style={styles.identityCopy}>
            <View style={styles.identityTitleRow}>
              <AppText numberOfLines={1} style={styles.instrumentTitle}>
                {instrument.symbol}
              </AppText>
              <View style={styles.statusCluster}>
                <AppText numberOfLines={1} style={styles.statusText} tone={statusTone}>
                  {t(marketStatusKey(instrument.marketStatus))}
                </AppText>
                <AppText numberOfLines={1} style={styles.statusText} tone={statusTone}>
                  {t(quoteStatusKey(instrument.quoteStatus))}
                </AppText>
              </View>
            </View>
            <AppText numberOfLines={1} style={styles.instrumentSubtitle} tone="dim">
              {localizeText(instrument.name, locale)}
            </AppText>
          </View>
        </View>

        <View style={styles.priceBlock}>
          <View style={styles.priceTopRow}>
            <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.lastPrice}>
              {formatPrice(instrument, (instrument.bid + instrument.ask) / 2)}
            </AppText>
            <View style={StyleSheet.flatten([styles.changePill, { borderColor: quoteVisual.color }])}>
              <AppText numberOfLines={1} style={styles.changePillText} tone={quoteVisual.tone}>
                {changePercent >= 0 ? t('common.trendUpSymbol') : t('common.trendDownSymbol')} {change > 0 ? t('common.plusSign') : ''}
                {formatPrice(instrument, change)}
              </AppText>
            </View>
          </View>
          <View style={styles.quoteMetaRow}>
            <AppText style={styles.inlineChange} tone={quoteVisual.tone}>
              {formatPercent(changePercent)}
            </AppText>
            <View style={styles.quoteMetaDivider} />
            <AppText style={styles.quoteMetaText} tone="dim">
              {t('instrument.quoteUpdatedAt')} {formatQuoteTime(instrument.quoteUpdatedAt, locale)}
            </AppText>
          </View>
        </View>
      </View>

      <MetricGroup items={snapshotItems} title={t('instrument.tradeSnapshot')} />
    </View>
  );
}

function buildTradeSnapshot(instrument: Instrument, locale: Locale, sampleLots: number, t: (key: TranslationKey, params?: Record<string, string | number>) => string): InstrumentMetric[] {
  return [
    { label: t('common.bid'), tone: 'down', value: formatPrice(instrument, instrument.bid) },
    { label: t('common.ask'), tone: 'up', value: formatPrice(instrument, instrument.ask) },
    { label: t('common.spread'), value: formatNumber(instrument.spread, 1, locale) },
    { label: t('common.leverage'), value: `${instrument.leverage}x` },
    { label: t('instrument.marginSample', { lots: sampleLots }), value: formatMoney(calculateMargin(instrument, sampleLots, instrument.ask), instrument.marginCurrency, 0, locale) },
    { label: t('instrument.tradeHours'), value: localizeText(instrument.tradingHours, locale) },
  ];
}

function buildSpecGroups(instrument: Instrument, locale: Locale, sampleLots: number, t: (key: TranslationKey, params?: Record<string, string | number>) => string): InstrumentMetricGroup[] {
  return [
    {
      title: t('instrument.specGroup.priceRange'),
      items: [
        { label: t('instrument.open'), value: formatPrice(instrument, instrument.openPrice) },
        { label: t('instrument.prevClose'), value: formatPrice(instrument, instrument.previousClose) },
        { label: t('instrument.dayHigh'), tone: 'up', value: formatPrice(instrument, instrument.dayHigh) },
        { label: t('instrument.dayLow'), tone: 'down', value: formatPrice(instrument, instrument.dayLow) },
        { label: t('instrument.weekHigh'), value: formatPrice(instrument, instrument.weekHigh) },
        { label: t('instrument.weekLow'), value: formatPrice(instrument, instrument.weekLow) },
        { label: t('instrument.yearHigh'), value: formatPrice(instrument, instrument.yearHigh) },
        { label: t('instrument.yearLow'), value: formatPrice(instrument, instrument.yearLow) },
      ],
    },
    {
      title: t('instrument.specGroup.contract'),
      items: [
        { label: t('common.contractSize'), value: formatNumber(instrument.contractSize, 0, locale) },
        { label: t('instrument.pipSize'), value: formatNumber(instrument.pipSize, instrument.pipSize >= 0.01 ? 2 : 5, locale) },
        { label: t('instrument.tickSize'), value: formatNumber(instrument.tickSize, instrument.tickSize >= 0.01 ? 2 : 5, locale) },
        { label: t('instrument.tickValue'), value: formatMoney(instrument.tickValue, instrument.quoteCurrency, 2, locale) },
        { label: t('instrument.baseCurrency'), value: instrument.baseCurrency },
        { label: t('instrument.quoteCurrency'), value: instrument.quoteCurrency },
      ],
    },
    {
      title: t('instrument.specGroup.costsLimits'),
      items: [
        { label: t('instrument.minLot'), value: formatNumber(instrument.minLot, 2, locale) },
        { label: t('instrument.maxLot'), value: formatNumber(instrument.maxLot, instrument.maxLot >= 100 ? 0 : 2, locale) },
        { label: t('instrument.lotStep'), value: formatNumber(instrument.lotStep, 2, locale) },
        { label: t('instrument.marginSample', { lots: sampleLots }), value: formatMoney(calculateMargin(instrument, sampleLots, instrument.ask), instrument.marginCurrency, 0, locale) },
        { label: t('instrument.swapLong'), value: formatMoney(instrument.swapLong, instrument.marginCurrency, 2, locale) },
        { label: t('instrument.swapShort'), value: formatMoney(instrument.swapShort, instrument.marginCurrency, 2, locale) },
        { label: t('instrument.tradeHours'), value: localizeText(instrument.tradingHours, locale) },
        { label: t('instrument.quoteStatus'), value: t(quoteStatusKey(instrument.quoteStatus)) },
      ],
    },
  ];
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
  colors: ReturnType<typeof useProductSettings>['colors'];
  sampleLots: number;
  selectedTab: DetailTabKey;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  if (selectedTab === 'chart') {
    return null;
  }

  if (selectedTab === 'specs') {
    return (
      <View style={styles.specPanel}>
        {buildSpecGroups(instrument, locale, sampleLots, t).map((group) => (
          <MetricGroup key={group.title} items={group.items} title={group.title} />
        ))}
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
          <AppText style={styles.newsBrand} tone="muted">{t('instrument.marketBriefBrand')}</AppText>
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

function MetricGroup({ items, title }: InstrumentMetricGroup) {
  return (
    <View style={styles.metricGroup}>
      <AppText tone="dim" variant="eyebrow">
        {title}
      </AppText>
      <View style={styles.metricGrid}>
        {items.map((item) => (
          <QuoteTile key={item.label} label={item.label} tone={item.tone} value={item.value} />
        ))}
      </View>
    </View>
  );
}

function QuoteTile({ label, tone = 'default', value }: InstrumentMetric) {
  return (
    <View style={styles.quoteTile}>
      <AppText numberOfLines={1} style={styles.quoteStatLabel} tone="dim">
        {label}
      </AppText>
      <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.quoteStatValue} tone={tone}>
        {value}
      </AppText>
    </View>
  );
}

function resolveTerminalState(instrument: Instrument): TradingTerminalChartState {
  if (instrument.marketStatus === 'restricted' || instrument.quoteStatus === 'restricted') {
    return 'restricted';
  }

  if (instrument.marketStatus === 'closed' || instrument.quoteStatus === 'closed') {
    return 'market_closed';
  }

  if (instrument.quoteStatus === 'stale' || instrument.quoteStatus === 'delayed') {
    return 'quote_stale';
  }

  return 'default';
}

function quoteStatusKey(status: InstrumentQuoteStatus): TranslationKey {
  const keys: Record<InstrumentQuoteStatus, TranslationKey> = {
    closed: 'instrument.quoteStatus.closed',
    delayed: 'instrument.quoteStatus.delayed',
    live: 'instrument.quoteStatus.live',
    restricted: 'instrument.quoteStatus.restricted',
    stale: 'instrument.quoteStatus.stale',
  };

  return keys[status];
}

function marketStatusKey(status: InstrumentMarketStatus): TranslationKey {
  const keys: Record<InstrumentMarketStatus, TranslationKey> = {
    closed: 'instrument.marketStatus.closed',
    open: 'instrument.marketStatus.open',
    preMarket: 'instrument.marketStatus.preMarket',
    restricted: 'instrument.marketStatus.restricted',
  };

  return keys[status];
}

function formatQuoteTime(value: string, locale: Locale) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  }).format(date);
}

const styles = StyleSheet.create({
  actionCapsule: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: layout.touchTargetMin,
    paddingHorizontal: spacing.xs,
  },
  capsuleButton: {
    width: layout.headerIconButtonSize,
  },
  content: {
    paddingBottom: size.viewport.detailFooterInset,
  },
  changePill: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: spacing.sm + spacing.xxs,
    paddingVertical: spacing.xxs,
  },
  changePillText: {
    ...typography.caption,
  },
  detailPage: {
    minHeight: size.viewport.detailPageMinHeight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  detailContextRow: {
    flexDirection: 'row',
    minWidth: 0,
  },
  detailContextText: {
    ...typography.captionSm,
  },
  detailTabs: {
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
  footerSafe: {
    borderTopWidth: lineWidth.hairline,
  },
  identityBlock: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minWidth: 0,
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
  },
  identityTitleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  inlineChange: {
    ...typography.caption,
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
  metricLabel: {
    ...typography.caption,
  },
  metricValue: {
    ...typography.titleMd,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricGroup: {
    gap: spacing.md,
  },
  newsBrand: {
    ...typography.caption,
  },
  newsFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs + spacing.xxs,
  },
  newsSource: {
    ...typography.caption,
    marginTop: spacing.md,
  },
  newsTitle: {
    ...typography.titleMd,
  },
  pagePanel: {
    gap: spacing.sm + spacing.xxs,
    marginTop: spacing.lg + spacing.xxs,
  },
  pageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  priceBlock: {
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  priceTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    width: '100%',
  },
  quoteArea: {
    borderRadius: radius.none,
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  quoteHero: {
    gap: spacing.md,
  },
  quoteMetaDivider: {
    borderRadius: radius.full,
    height: spacing.xs,
    opacity: 0.7,
    width: lineWidth.strong,
  },
  quoteMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  quoteMetaText: {
    ...typography.caption,
  },
  quoteStatLabel: {
    ...typography.captionSm,
  },
  quoteStatValue: {
    ...typography.bodySm,
    flexShrink: 1,
    textAlign: 'right',
  },
  quoteTile: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: spacing.xxs,
    minWidth: size.viewport.detailSideMinWidth,
  },
  riskPanel: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
    gap: spacing.xs,
    paddingTop: spacing.sm + spacing.xxs,
  },
  signalRows: {
    gap: spacing.sm + spacing.xxs,
    marginTop: spacing.xs,
  },
  specPanel: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  statusCluster: {
    alignItems: 'flex-end',
    gap: spacing.xxs,
    maxWidth: size.viewport.detailSideMaxWidth,
  },
  statusText: {
    ...typography.microLabel,
  },
  tradeButton: {
    alignItems: 'center',
    borderRadius: radius.xl + spacing.xxs,
    flex: 1,
    minHeight: size.control.lg - spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingVertical: radius.lg,
  },
  tradeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  tradeText: {
    ...typography.buttonMd,
  },
});
