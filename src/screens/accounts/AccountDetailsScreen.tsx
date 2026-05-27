import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

import { lineWidth, layout, radius, spacing } from '@/src/theme/tokens';
import { bottomSheetPresets, useBottomSheet } from '@/src/components/BottomSheet';
import { Card } from '@/src/components/Card';
import { FundActionGrid, type FundActionGridItem } from '@/src/components/FundActionGrid';
import { GlobalMenuList } from '@/src/components/GlobalMenuList';
import { AppIcon } from '@/src/components/AppIcon';
import { IconSurface } from '@/src/components/IconSurface';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { TradeDirectionIcon } from '@/src/components/TradeDirectionIcon';
import { AppText } from '@/src/components/Typography';
import { buildTradingAccountProfiles, getAccountStatusLabel } from '@/src/domain/accountProfiles';
import { directionLabel, formatMoney, formatNumber } from '@/src/domain/format';
import { getFundingOperationActions } from '@/src/domain/funding';
import type { Locale } from '@/src/i18n/translations';
import { useToast } from '@/src/feedback/Toast';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { account, positions } = useBroker();
  const { locale, colors, t, tradingAccountCountPreset, tradingAccountDataPreset, tradingAccountScenario, tradingAccountStatusPreset } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const toast = useToast();
  const profiles = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const profile = profiles.find((item) => item.id === id) ?? profiles[0];
  const statusTone: StatusPillTone = profile.group === 'demo' ? 'brand' : profile.group === 'readOnly' ? 'warning' : 'success';
  const closedPnlPeriods = buildClosedPnlPeriods(profile.realizedPnl);
  const positionRows = positions.length > 0
    ? positions.map((position) => ({
        direction: position.direction,
        id: position.id,
        lots: formatNumber(position.lots, 2, locale),
        pnl: position.unrealizedPnl,
        priceRange: `${formatNumber(position.openPrice, 2, locale)} - ${formatNumber(position.currentPrice, 2, locale)}`,
        symbol: position.symbol.replace('/', ''),
      }))
    : getDetailDemoPositions(locale);
  const openMoreMenu = () => {
    bottomSheet.show(bottomSheetPresets.actionMenu({
      content: (
        <AccountMoreSheet
          onSelect={(label, tone) => {
            bottomSheet.hide();
            toast.show({
              message: t('common.demoActionNoChange'),
              title: label,
              tone,
            });
          }}
        />
      ),
    }));
  };

  return (
    <Screen
      align="center"
      back
      backHref="/accounts"
      rightActions={[{ icon: 'icon.system.more', label: t('top.more'), onPress: openMoreMenu }]}
      title={t('accountDetails.title')}>
      <Card compact>
        <View style={styles.detailHeader}>
          <IconSurface icon="icon.account.trading" sizeVariant="sm" />
          <View style={styles.detailTitleBlock}>
            <View style={styles.detailTitleRow}>
              <AppText variant="subtitle">{profile.accountNo}</AppText>
              <StatusPill compact label={getAccountStatusLabel(profile.group, locale)} tone={statusTone} />
            </View>
          <AppText tone="muted" variant="caption">
            {profile.platform} · {profile.currency} · {profile.type}
          </AppText>
        </View>
      </View>

        <View style={styles.detailMetrics}>
          <SmallMetric label={t('account.equity')} value={formatNumber(profile.equity, 2, locale)} />
          <SmallMetric label={t('account.balance')} value={formatNumber(profile.balance, 2, locale)} />
          <SmallMetric label={t('accountDetails.realizedPnl')} tone={profile.realizedPnl >= 0 ? 'down' : 'up'} value={formatMoney(profile.realizedPnl, profile.currency, 2, locale)} />
        </View>
      </Card>

      <Card>
        <View style={styles.marginStatus}>
          <View style={styles.marginCopy}>
            <AppText tone="muted" variant="caption">{t('portfolio.unrealizedPnl')}</AppText>
            <AppText tone={profile.unrealizedPnl >= 0 ? 'down' : 'up'} variant="title">
              {formatMoney(profile.unrealizedPnl, profile.currency, 2, locale)}
            </AppText>
          </View>
          <MarginGauge value={profile.marginLevel} />
        </View>

        <View style={StyleSheet.flatten([styles.divider, { backgroundColor: colors.border.subtle }])} />
        <View style={styles.detailMetrics}>
          <SmallMetric label={t('account.freeMargin')} value={formatNumber(profile.freeMargin, 2, locale)} />
          <SmallMetric label={t('account.usedMargin')} value={formatNumber(profile.usedMargin, 2, locale)} />
        </View>
        <View style={styles.detailMetrics}>
          <SmallMetric label={t('accountDetails.leverage')} value={profile.leverage} />
          <SmallMetric label={t('portfolio.current')} value={`${positionRows.length}`} />
        </View>
        <AppText tone="muted" variant="caption">{t('accountDetails.server')}: {profile.server}</AppText>
      </Card>

      <FundActionGrid
        items={[
          ...getFundingOperationActions(t, profile.id),
          { icon: 'icon.system.settings', label: t('accountDetails.leverage'), tone: 'up' },
          { icon: 'icon.security.lock', label: t('auth.password'), tone: 'blue' },
          { icon: 'icon.trading.order_ticket', label: t('quick.trade'), tone: 'brand' },
        ] satisfies FundActionGridItem[]}
      />

      <View style={StyleSheet.flatten([styles.menuListInset, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        <GlobalMenuList
          contained
          items={[
            { icon: 'icon.kyc.identity' as const, label: t('accountDetails.menuBasicInfo'), onPress: () => router.push(`/account-basic/${profile.id}` as never) },
            { icon: 'icon.wallet.balance' as const, label: t('account.title'), onPress: () => router.push(`/account-balance/${profile.id}` as never) },
            { icon: 'icon.wallet.transfer' as const, label: t('accountDetails.swap') },
            { icon: 'icon.trading.history' as const, label: t('portfolio.orderRecords'), onPress: () => router.push(`/account-orders/${profile.id}` as never) },
            { icon: 'icon.trading.history' as const, label: t('accountDetails.depositRecords'), onPress: () => router.push({ pathname: '/funding/transactions', params: { accountId: profile.id, operation: 'deposit' } } as never) },
            { icon: 'icon.trading.history' as const, label: t('accountDetails.withdrawalRecords'), onPress: () => router.push({ pathname: '/funding/transactions', params: { accountId: profile.id, operation: 'withdrawal' } } as never) },
          ]}
        />
      </View>

      <Card compact>
        <View style={styles.cardTitleRow}>
          <AppText variant="subtitle">{t('portfolio.current')}</AppText>
          <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
        </View>
        {positionRows.map((position, index) => (
          <View key={position.id} style={StyleSheet.flatten([styles.positionRow, index < positionRows.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
            <TradeDirectionIcon direction={position.direction} sizeVariant="sm" />
            <View style={styles.positionMain}>
              <View style={styles.positionTitle}>
                <AppText variant="caption">{position.symbol}</AppText>
                <AppText tone={position.direction === 'buy' ? 'down' : 'up'} variant="caption">
                  {directionLabel(position.direction, locale).toLowerCase()} {position.lots}
                </AppText>
              </View>
              <AppText tone="muted" variant="eyebrow">{position.priceRange}</AppText>
            </View>
            <AppText tone={position.pnl >= 0 ? 'down' : 'up'} variant="caption">
              {formatNumber(position.pnl, 2, locale)}
            </AppText>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.cardTitleRow}>
          <AppText variant="subtitle">{t('accountDetails.closedPnl')}</AppText>
          <StatusPill compact icon="icon.system.chevron_down" label={t('portfolio.symbolsCount', { count: 5 })} tone="neutral" />
        </View>
        <AppText tone={profile.realizedPnl >= 0 ? 'down' : 'up'} variant="subtitle">
          {formatMoney(profile.realizedPnl, profile.currency, 2, locale)}
        </AppText>
        <AppText tone="muted" variant="caption">{t('portfolio.totalClosedPnl')}</AppText>
        <ClosedPnlChart realizedPnl={profile.realizedPnl} />
        <View style={styles.symbolLegendRow}>
          {[
            ['Total', colors.brand.fg],
            ['XAUUSD', colors.text.tertiary],
            ['EURUSD', colors.border.default],
          ].map(([label, color]) => (
            <View key={label} style={styles.symbolLegendItem}>
              <View style={StyleSheet.flatten([styles.symbolLegendDot, { backgroundColor: color }])} />
              <AppText tone="muted" variant="eyebrow">{label}</AppText>
            </View>
          ))}
        </View>
        <View style={styles.periodRow}>
          {closedPnlPeriods.map((item) => (
            <StatusPill
              compact
              key={item.period}
              label={`${item.period} ${formatMoney(item.value, profile.currency, 2, locale)}`}
              style={styles.periodPill}
              tone={item.value >= 0 ? 'down' : 'up'}
            />
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.cardTitleRow}>
          <AppText variant="subtitle">{t('portfolio.pnlCalendar')}</AppText>
          <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
        </View>
        <View style={styles.calendarGrid}>
          {Array.from({ length: 31 }).map((_, index) => {
            const day = index + 1;
            const positive = [6, 7, 9, 10, 13, 15, 16, 20, 21, 22, 23, 24, 27].includes(day);
            const negative = [8, 14, 17, 28].includes(day);
            const bg = positive ? `${colors.market.down.fg}20` : negative ? `${colors.market.up.fg}18` : colors.surface.subtle;
            return (
              <View key={day} style={StyleSheet.flatten([styles.dayCell, { backgroundColor: bg, borderColor: colors.border.subtle }])}>
                <AppText variant="eyebrow">{day}</AppText>
                <AppText tone={positive ? 'down' : negative ? 'up' : 'muted'} variant="eyebrow">
                  {positive || negative ? '12.42' : '0.00'}
                </AppText>
              </View>
            );
          })}
        </View>
        <View style={styles.calendarStats}>
          <SmallMetric label={t('portfolio.profitableDays')} tone="down" value="17" />
          <SmallMetric label={t('portfolio.losingDays')} tone="up" value="8" />
        </View>
      </Card>
    </Screen>
  );
}

function AccountMoreSheet({ onSelect }: { onSelect: (label: string, tone?: 'danger' | 'default') => void }) {
  const { colors, t } = useProductSettings();
  const items = [
    { icon: 'icon.trading.order' as const, label: t('accountDetails.tradingJournal'), tone: 'default' as const },
    { icon: 'icon.account.archive' as const, label: t('accountDetails.archiveAccount'), tone: 'default' as const },
    { icon: 'icon.system.delete' as const, label: t('accountDetails.deleteAccount'), tone: 'danger' as const },
  ];

  return (
    <View style={styles.moreSheet}>
      <View style={StyleSheet.flatten([styles.menuListInset, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        <GlobalMenuList
          contained
          items={items.map((item) => ({
            ...item,
            onPress: () => onSelect(item.label, item.tone),
          }))}
          showChevron={false}
        />
      </View>
    </View>
  );
}

function MarginGauge({ value }: { value: number }) {
  const { locale, colors, t } = useProductSettings();
  const normalized = Math.max(0, Math.min(value / 1000, 100));
  const needleAngle = (-150 + normalized * 1.2) * (Math.PI / 180);
  const centerX = 120;
  const centerY = 96;
  const needleEndX = centerX + Math.cos(needleAngle) * 58;
  const needleEndY = centerY + Math.sin(needleAngle) * 58;
  const riskLabel = t('accountDetails.risk');
  const safeLabel = t('accountDetails.safe');
  const safetyTitle = t('accountDetails.safetyIndex');

  return (
    <View style={styles.gaugeWrap}>
      <View style={styles.gaugeStage}>
        <Svg height={106} width={240}>
          <Path d="M 34 96 A 86 86 0 0 1 206 96" fill="none" stroke={colors.border.subtle} strokeLinecap="round" strokeWidth={14} />
          <Path d="M 34 96 A 86 86 0 0 1 65 30" fill="none" stroke={colors.status.danger.fg} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 69 28 A 86 86 0 0 1 102 13" fill="none" stroke={colors.status.warning.fg} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 108 12 A 86 86 0 0 1 132 12" fill="none" stroke={colors.text.tertiary} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 138 13 A 86 86 0 0 1 171 28" fill="none" stroke={colors.market.down.fg} strokeLinecap="butt" strokeWidth={14} />
          <Path d="M 175 30 A 86 86 0 0 1 206 96" fill="none" stroke={colors.market.down.fg} strokeLinecap="butt" strokeWidth={14} />
          {[34, 65, 102, 120, 138, 175, 206].map((x, index) => (
            <Line key={`${x}-${index}`} opacity={0.22} stroke={colors.text.tertiary} strokeLinecap="round" strokeWidth={2} x1={x} x2={x} y1={92} y2={98} />
          ))}
          <Line stroke={colors.text.primary} strokeLinecap="round" strokeWidth={4} x1={centerX} x2={needleEndX} y1={centerY} y2={needleEndY} />
          <Circle cx={centerX} cy={centerY} fill={colors.surface.canvas} r={8} stroke={colors.text.primary} strokeWidth={3} />
        </Svg>
        <View style={styles.gaugeLabels}>
          <AppText tone="muted" variant="caption">{riskLabel}</AppText>
          <AppText tone="muted" variant="caption">{safeLabel}</AppText>
        </View>
      </View>
      <AppText variant="subtitle">{safetyTitle}</AppText>
      <StatusPill compact label={`${safeLabel} · ${formatNumber(value, 2, locale)}%`} tone="success" />
    </View>
  );
}

function ClosedPnlChart({ realizedPnl }: { realizedPnl: number }) {
  const { colors } = useProductSettings();
  const width = 292;
  const height = 132;
  const chartTotal = realizedPnl === 0 ? 100 : realizedPnl;
  const totalValues = buildClosedPnlSeries(chartTotal, [0, 0.2, 0.08, 0.48, 0.36, 0.68, 0.58, 0.86, 1]);
  const symbolSeries = [
    { color: colors.text.tertiary, values: buildClosedPnlSeries(chartTotal * 0.44, [0, 0.12, 0.04, 0.26, 0.2, 0.38, 0.34, 0.5, 0.62]) },
    { color: colors.border.default, values: buildClosedPnlSeries(chartTotal * -0.18, [0, -0.08, -0.02, -0.16, -0.1, -0.22, -0.18, -0.28, -0.34]) },
  ];
  const allValues = [...totalValues, ...symbolSeries.flatMap((series) => series.values)];

  return (
    <View style={styles.performanceChart}>
      <Svg height={height} width={width}>
        {symbolSeries.map((series, index) => (
          <Polyline
            fill="none"
            key={`symbol-${index}`}
            opacity={0.55}
            points={pointsForSeries(series.values, allValues, width, height)}
            stroke={series.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        ))}
        <Polyline
          fill="none"
          points={pointsForSeries(totalValues, allValues, width, height)}
          stroke={colors.brand.fg}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
        />
      </Svg>
    </View>
  );
}

function SmallMetric({ label, tone, value }: { label: string; tone?: 'down' | 'up'; value: string }) {
  return (
    <View style={styles.smallMetric}>
      <AppText tone={tone} variant="body">{value}</AppText>
      <AppText tone="muted" variant="caption">{label}</AppText>
    </View>
  );
}

function buildClosedPnlPeriods(realizedPnl: number) {
  return [
    { period: '1W', value: realizedPnl * 0.22 },
    { period: '3W', value: realizedPnl * 0.48 },
    { period: '1M', value: realizedPnl * 0.72 },
    { period: '6M', value: realizedPnl },
  ];
}

function buildClosedPnlSeries(total: number, factors: number[]) {
  return factors.map((factor) => total * factor);
}

function pointsForSeries(values: number[], allValues: number[], width: number, height: number) {
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues, 0);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

function getDetailDemoPositions(locale: Locale) {
  return Array.from({ length: 5 }).map((_, index) => ({
    direction: 'buy' as const,
    id: `detail-demo-${index}`,
    lots: formatNumber(5, 2, locale),
    pnl: 500,
    priceRange: '1887.87 - 1888.87',
    symbol: 'XAUUSD',
  }));
}

const styles = StyleSheet.create({
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 14,
  },
  calendarStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  cardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: lineWidth.hairline,
    gap: 2,
    height: 38,
    justifyContent: 'center',
    width: '13.3%',
  },
  detailHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  detailMetrics: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 14,
  },
  detailTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  detailTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  divider: {
    height: lineWidth.hairline,
    marginVertical: 12,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    width: 236,
  },
  gaugeStage: {
    alignItems: 'center',
    height: 118,
    justifyContent: 'flex-start',
  },
  gaugeWrap: {
    alignItems: 'center',
    gap: 2,
    marginTop: 8,
  },
  marginCopy: {
    alignItems: 'center',
    gap: 2,
  },
  marginStatus: {
    alignItems: 'center',
  },
  moreSheet: {
    marginHorizontal: 14,
    marginTop: 14,
  },
  menuListInset: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
    paddingHorizontal: layout.cardPaddingX,
  },
  performanceChart: {
    alignItems: 'center',
    height: 142,
    justifyContent: 'center',
    marginTop: 8,
    overflow: 'hidden',
  },
  periodPill: {
    flex: 1,
    justifyContent: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  positionMain: {
    flex: 1,
    minWidth: 0,
  },
  positionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    minHeight: 52,
    paddingVertical: 7,
  },
  positionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  smallMetric: {
    flex: 1,
    gap: 2,
  },
  symbolLegendDot: {
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  symbolLegendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  symbolLegendRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
});
