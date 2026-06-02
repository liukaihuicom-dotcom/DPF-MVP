import { useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeaderIconButton } from '@/src/components/HeaderIconButton';
import { InstrumentIcon } from '@/src/components/InstrumentIcon';
import { NativePressable } from '@/src/components/NativePressable';
import { SegmentedTabs } from '@/src/components/SegmentedTabs';
import { AppText, type AppTextTone } from '@/src/components/Typography';
import { getQuoteChangeVisual } from '@/src/components/quoteVisuals';
import { directionLabel, formatMoney, formatNumber, formatPercent, formatPrice, localizeText } from '@/src/domain/format';
import { calculateMargin, getDisplayChange } from '@/src/domain/trading';
import type { Instrument, InstrumentMarketStatus, InstrumentQuoteStatus } from '@/src/domain/types';
import type { Locale, TranslationKey } from '@/src/i18n/translations';
import type { ThemeColors } from '@/src/theme/colors';
import { layout, lineWidth, radius, size, spacing, typography } from '@/src/theme/tokens';

import { TradingTerminalChart, type TradingTerminalChartState } from './TradingTerminalChart';

type InstrumentWorkspaceTab = 'overview' | 'specs' | 'news' | 'signals';

type InstrumentDetailWorkspaceProps = {
  colors: ThemeColors;
  instrument: Instrument;
  locale: Locale;
  onBack: () => void;
  onBuy: () => void;
  onSell: () => void;
  onSecondaryAction: (action: string) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

type QuoteVisual = {
  color: string;
  tone: AppTextTone;
};

type MetricItem = {
  label: string;
  tone?: 'default' | 'down' | 'up';
  value: string;
};

type MetricGroup = {
  items: MetricItem[];
  title: string;
};

const workspaceTabs: { id: InstrumentWorkspaceTab; labelKey: TranslationKey }[] = [
  { id: 'overview', labelKey: 'instrument.tab.overview' },
  { id: 'specs', labelKey: 'instrument.tab.specs' },
  { id: 'news', labelKey: 'instrument.tab.news' },
  { id: 'signals', labelKey: 'instrument.tab.signals' },
];

const HEADER_SUMMARY_SCROLL_THRESHOLD = spacing.xl;

export function InstrumentDetailWorkspace({
  colors,
  instrument,
  locale,
  onBack,
  onBuy,
  onSell,
  onSecondaryAction,
  t,
}: InstrumentDetailWorkspaceProps) {
  const [selectedTab, setSelectedTab] = useState<InstrumentWorkspaceTab>('overview');
  const [headerSummaryVisible, setHeaderSummaryVisible] = useState(false);
  const { change, changePercent } = getDisplayChange(instrument);
  const quoteVisual = getQuoteChangeVisual(changePercent, colors);
  const sampleLots = instrument.symbol === 'XAU/USD' ? size.chart.sampleLotsMetal : size.chart.sampleLotsDefault;
  const decisionItems = useMemo(() => buildDecisionItems(instrument, locale, t), [instrument, locale, t]);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextVisible = event.nativeEvent.contentOffset.y > HEADER_SUMMARY_SCROLL_THRESHOLD;
    setHeaderSummaryVisible((current) => (current === nextVisible ? current : nextVisible));
  };

  return (
    <View style={StyleSheet.flatten([styles.outer, { backgroundColor: colors.surface.canvas }])}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <InstrumentHeader
          change={change}
          changePercent={changePercent}
          colors={colors}
          instrument={instrument}
          locale={locale}
          onBack={onBack}
          onSecondaryAction={onSecondaryAction}
          quoteVisual={quoteVisual}
          showSummary={headerSummaryVisible}
          t={t}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="never"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={StyleSheet.flatten([styles.scroller, { backgroundColor: colors.surface.panel }])}>
          <View style={styles.primaryStack}>
            <QuoteHeader change={change} changePercent={changePercent} instrument={instrument} locale={locale} quoteVisual={quoteVisual} t={t} />
            <DecisionStrip items={decisionItems} />
          </View>

          <TradingTerminalChart density="embedded" instrument={instrument} state={resolveTerminalState(instrument)} toolbarMode="compact" />

          <SegmentedTabs
            equalWidth
            items={workspaceTabs.map((tab) => {
              const label = t(tab.labelKey);

              return {
                accessibilityLabel: label,
                label,
                value: tab.id,
              };
            })}
            onValueChange={setSelectedTab}
            style={styles.workspaceTabs}
            value={selectedTab}
            variant="underline"
          />

          <InstrumentAuxiliaryPanel
            colors={colors}
            instrument={instrument}
            locale={locale}
            quoteVisual={quoteVisual}
            sampleLots={sampleLots}
            selectedTab={selectedTab}
            t={t}
          />
        </ScrollView>

        <TradeQuoteActionBar colors={colors} instrument={instrument} locale={locale} onBuy={onBuy} onSell={onSell} t={t} />
      </SafeAreaView>
    </View>
  );
}

function InstrumentHeader({
  change,
  changePercent,
  colors,
  instrument,
  locale,
  onBack,
  onSecondaryAction,
  quoteVisual,
  showSummary,
  t,
}: {
  change: number;
  changePercent: number;
  colors: ThemeColors;
  instrument: Instrument;
  locale: Locale;
  onBack: () => void;
  onSecondaryAction: (action: string) => void;
  quoteVisual: QuoteVisual;
  showSummary: boolean;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  const midPrice = formatPrice(instrument, (instrument.bid + instrument.ask) / lineWidth.selected);

  return (
    <View style={StyleSheet.flatten([styles.header, { backgroundColor: colors.surface.canvas }])}>
      <HeaderIconButton accessibilityLabel={t('top.back')} backgroundContext="canvas" icon="icon.system.back" onPress={onBack} surface="auto" tone="default" />
      <View style={styles.headerSummary}>
        {showSummary ? (
          <View style={styles.headerSummaryInner}>
            <View style={styles.headerTitleRow}>
              <AppText numberOfLines={1} variant="title.pageCompact">
                {instrument.symbol}
              </AppText>
              <AppText numberOfLines={1} tone={quoteVisual.tone} variant="label.control">
                {midPrice}
              </AppText>
            </View>
            <AppText numberOfLines={1} tone={quoteVisual.tone} variant="label.helper">
              {formatPercent(changePercent)} · {change > 0 ? t('common.plusSign') : ''}
              {formatPrice(instrument, change)}
            </AppText>
          </View>
        ) : (
          <View style={styles.headerSummaryPlaceholder} />
        )}
      </View>
      <View style={styles.headerActions}>
        <HeaderIconButton
          accessibilityLabel={t('instrument.share')}
          backgroundContext="canvas"
          icon="icon.ib.network"
          onPress={() => onSecondaryAction(t('instrument.share'))}
          surface="auto"
          tone="default"
        />
        <HeaderIconButton
          accessibilityLabel={t('top.more')}
          backgroundContext="canvas"
          icon="icon.system.more"
          onPress={() => onSecondaryAction(t('top.more'))}
          surface="auto"
          tone="default"
        />
      </View>
    </View>
  );
}

function QuoteHeader({
  change,
  changePercent,
  instrument,
  locale,
  quoteVisual,
  t,
}: {
  change: number;
  changePercent: number;
  instrument: Instrument;
  locale: Locale;
  quoteVisual: QuoteVisual;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  return (
    <View style={styles.quoteHeader}>
      <View style={styles.priceRow}>
        <View style={styles.priceCopy}>
          <AppText numberOfLines={1} style={styles.lastPrice}>
            {formatPrice(instrument, (instrument.bid + instrument.ask) / lineWidth.selected)}
          </AppText>
          <View style={styles.quoteMetaRow}>
            <AppText tone={quoteVisual.tone} variant="label.control">
              {formatPercent(changePercent)}
            </AppText>
            <AppText tone="muted" variant="label.helper">
              {t('instrument.quoteUpdatedAt')} {formatQuoteTime(instrument.quoteUpdatedAt, locale)}
            </AppText>
          </View>
        </View>
        <View style={StyleSheet.flatten([styles.changePill, { borderColor: quoteVisual.color }])}>
          <AppText numberOfLines={1} tone={quoteVisual.tone} variant="label.control">
            {changePercent >= 0 ? t('common.trendUpSymbol') : t('common.trendDownSymbol')} {change > 0 ? t('common.plusSign') : ''}
            {formatPrice(instrument, change)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

function DecisionStrip({ items }: { items: MetricItem[] }) {
  return (
    <View style={styles.decisionStrip}>
      {items.map((item) => (
        <View key={item.label} style={styles.decisionItem}>
          <AppText numberOfLines={1} tone="dim" variant="label.minimum">
            {item.label}
          </AppText>
          <AppText numberOfLines={1} style={styles.decisionValue} tone={item.tone} variant="label.metric">
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function InstrumentAuxiliaryPanel({
  colors,
  instrument,
  locale,
  quoteVisual,
  sampleLots,
  selectedTab,
  t,
}: {
  colors: ThemeColors;
  instrument: Instrument;
  locale: Locale;
  quoteVisual: QuoteVisual;
  sampleLots: number;
  selectedTab: InstrumentWorkspaceTab;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  if (selectedTab === 'specs') {
    return (
      <View style={styles.auxiliaryStack}>
        {buildSpecGroups(instrument, locale, sampleLots, t).map((group) => (
          <MetricGroupView key={group.title} items={group.items} title={group.title} />
        ))}
      </View>
    );
  }

  if (selectedTab === 'news') {
    return (
      <View style={styles.auxiliaryStack}>
        <ArticleSummary
          eyebrow={t('instrument.marketBriefSource')}
          footerLeft={t('instrument.marketBriefBrand')}
          footerRight={t('instrument.marketOpen')}
          title={t('instrument.marketBriefTitle')}
          body={t('instrument.marketBriefBody')}
        />
      </View>
    );
  }

  if (selectedTab === 'signals') {
    const { changePercent } = getDisplayChange(instrument);

    return (
      <View style={styles.auxiliaryStack}>
        <ArticleSummary eyebrow={t('instrument.signalSource')} title={t('instrument.signalTitle')} body={t('instrument.signalBody')} />
        <View style={styles.signalList}>
          {[
            [t('instrument.signalBias'), changePercent >= 0 ? t('common.buy') : t('common.sell'), quoteVisual.tone],
            [t('instrument.signalRisk'), t('risk.general'), 'default'],
          ].map(([label, value, tone]) => (
            <View key={label} style={StyleSheet.flatten([styles.signalRow, { borderTopColor: colors.border.subtle }])}>
              <AppText tone="dim" variant="label.helper">
                {label}
              </AppText>
              <AppText tone={tone as AppTextTone} variant="body.secondary">
                {value}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.auxiliaryStack}>
      <MetricGroupView items={buildOverviewItems(instrument, locale, sampleLots, t)} title={t('instrument.tradeSnapshot')} />
      <View style={StyleSheet.flatten([styles.riskNotice, { backgroundColor: colors.status.warning.bg }])}>
        <AppText tone="amber" variant="label.helper">
          {t('risk.general')}
        </AppText>
      </View>
    </View>
  );
}

function ArticleSummary({
  body,
  eyebrow,
  footerLeft,
  footerRight,
  title,
}: {
  body: string;
  eyebrow: string;
  footerLeft?: string;
  footerRight?: string;
  title: string;
}) {
  return (
    <View style={styles.articleSummary}>
      <AppText tone="dim" variant="label.helper">
        {eyebrow}
      </AppText>
      <AppText variant="title.card">{title}</AppText>
      <AppText tone="muted" variant="body.secondary">
        {body}
      </AppText>
      {footerLeft || footerRight ? (
        <View style={styles.articleFooter}>
          {footerLeft ? (
            <AppText tone="muted" variant="label.helper">
              {footerLeft}
            </AppText>
          ) : null}
          {footerRight ? (
            <AppText tone="dim" variant="label.helper">
              {footerRight}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function MetricGroupView({ items, title }: MetricGroup) {
  return (
    <View style={styles.metricGroup}>
      <AppText tone="dim" variant="eyebrow">
        {title}
      </AppText>
      <View style={styles.metricGrid}>
        {items.map((item) => (
          <View key={item.label} style={styles.metricItem}>
            <AppText numberOfLines={1} tone="dim" variant="label.helper">
              {item.label}
            </AppText>
            <AppText numberOfLines={1} style={styles.metricValue} tone={item.tone} variant="body.primary">
              {item.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function TradeQuoteActionBar({
  colors,
  instrument,
  locale,
  onBuy,
  onSell,
  t,
}: {
  colors: ThemeColors;
  instrument: Instrument;
  locale: Locale;
  onBuy: () => void;
  onSell: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}) {
  return (
    <SafeAreaView edges={['bottom']} style={StyleSheet.flatten([styles.footer, { backgroundColor: colors.surface.raised, borderTopColor: colors.border.subtle }])}>
      <View style={styles.footerMeta}>
        <AppText numberOfLines={1} tone="muted" variant="label.helper">
          {t('instrument.footer.quoteContext', {
            spread: formatNumber(instrument.spread, 1, locale),
            status: t(quoteStatusKey(instrument.quoteStatus)),
          })}
        </AppText>
        <AppText numberOfLines={1} tone="amber" variant="label.minimum">
          {t('instrument.riskCompact')}
        </AppText>
      </View>
      <View style={styles.tradeButtons}>
        <TradeButton direction="sell" instrument={instrument} onPress={onSell} tone={colors.market.down.fg} locale={locale} />
        <TradeButton direction="buy" instrument={instrument} onPress={onBuy} tone={colors.market.up.fg} locale={locale} />
      </View>
    </SafeAreaView>
  );
}

function TradeButton({
  direction,
  instrument,
  locale,
  onPress,
  tone,
}: {
  direction: 'buy' | 'sell';
  instrument: Instrument;
  locale: Locale;
  onPress: () => void;
  tone: string;
}) {
  const price = direction === 'buy' ? instrument.ask : instrument.bid;

  return (
    <NativePressable
      accessibilityLabel={`${directionLabel(direction, locale)} ${formatPrice(instrument, price)}`}
      onPress={onPress}
      style={StyleSheet.flatten([styles.tradeButton, { backgroundColor: tone }])}>
      <AppText numberOfLines={1} tone="white" variant="label.controlLarge">
        {directionLabel(direction, locale)} {formatPrice(instrument, price)}
      </AppText>
    </NativePressable>
  );
}

function buildDecisionItems(instrument: Instrument, locale: Locale, t: (key: TranslationKey, params?: Record<string, string | number>) => string): MetricItem[] {
  return [
    { label: t('common.bid'), tone: 'down', value: formatPrice(instrument, instrument.bid) },
    { label: t('common.ask'), tone: 'up', value: formatPrice(instrument, instrument.ask) },
    { label: t('common.spread'), value: formatNumber(instrument.spread, 1, locale) },
    { label: t('common.leverage'), value: `${instrument.leverage}x` },
  ];
}

function buildOverviewItems(instrument: Instrument, locale: Locale, sampleLots: number, t: (key: TranslationKey, params?: Record<string, string | number>) => string): MetricItem[] {
  return [
    { label: t('instrument.open'), value: formatPrice(instrument, instrument.openPrice) },
    { label: t('instrument.prevClose'), value: formatPrice(instrument, instrument.previousClose) },
    { label: t('instrument.dayHigh'), tone: 'up', value: formatPrice(instrument, instrument.dayHigh) },
    { label: t('instrument.dayLow'), tone: 'down', value: formatPrice(instrument, instrument.dayLow) },
    { label: t('instrument.marginSample', { lots: sampleLots }), value: formatMoney(calculateMargin(instrument, sampleLots, instrument.ask), instrument.marginCurrency, 0, locale) },
    { label: t('instrument.tradeHours'), value: localizeText(instrument.tradingHours, locale) },
  ];
}

function buildSpecGroups(instrument: Instrument, locale: Locale, sampleLots: number, t: (key: TranslationKey, params?: Record<string, string | number>) => string): MetricGroup[] {
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
  articleFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleSummary: {
    gap: spacing.sm,
  },
  auxiliaryStack: {
    gap: layout.sectionGap,
  },
  changePill: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: spacing.sm + spacing.xxs,
    paddingVertical: spacing.xs,
  },
  content: {
    gap: layout.sectionGap,
    paddingBottom: layout.screenBottomPadding + size.control.lg + spacing.xxl,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  decisionItem: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: size.metric.minWidth,
  },
  decisionStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.controlGap,
  },
  decisionValue: {
    textAlign: 'right',
  },
  footer: {
    borderTopWidth: lineWidth.hairline,
    gap: layout.controlGap,
    paddingBottom: layout.screenBottomPadding,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  footerMeta: {
    gap: spacing.xxs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: layout.controlGap,
    paddingBottom: spacing.sm,
    paddingHorizontal: layout.topBarPaddingX,
    paddingTop: spacing.sm,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  headerTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  headerSummary: {
    flex: 1,
    justifyContent: 'center',
    minHeight: layout.touchTargetMin,
    minWidth: spacing.none,
  },
  headerSummaryInner: {
    gap: spacing.xxs,
    minWidth: spacing.none,
  },
  headerSummaryPlaceholder: {
    minHeight: layout.touchTargetMin,
  },
  lastPrice: {
    ...typography.quote,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricGroup: {
    gap: spacing.md,
  },
  metricItem: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: spacing.xxs,
    minWidth: size.viewport.detailSideMinWidth,
  },
  metricValue: {
    textAlign: 'right',
  },
  outer: {
    flex: 1,
  },
  priceCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: spacing.none,
  },
  priceRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  primaryStack: {
    gap: spacing.md,
  },
  quoteHeader: {
    gap: spacing.sm,
  },
  quoteMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  riskNotice: {
    borderRadius: radius.card,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: spacing.sm,
  },
  safe: {
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  signalList: {
    gap: spacing.md,
  },
  signalRow: {
    borderTopWidth: lineWidth.hairline,
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  tradeButton: {
    alignItems: 'center',
    borderRadius: radius.xl + spacing.xxs,
    flex: 1,
    minHeight: size.control.lg - spacing.xxs,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  tradeButtons: {
    flexDirection: 'row',
    gap: layout.controlGap,
  },
  workspaceTabs: {
    gap: spacing.xl,
  },
});
