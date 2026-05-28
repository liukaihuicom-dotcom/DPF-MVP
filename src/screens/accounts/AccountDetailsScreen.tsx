import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { lineWidth, layout, radius, size, spacing } from '@/src/design-public-assets/tokens';
import { bottomSheetPresets, useBottomSheet } from '@/src/design-public-assets/components';
import { Card } from '@/src/design-public-assets/components';
import { FundActionGrid, type FundActionGridItem } from '@/src/design-public-assets/components';
import { GlobalMenuList } from '@/src/design-public-assets/components';
import { AppIcon } from '@/src/design-public-assets/components';
import { IconSurface } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { StatusPill, type StatusPillTone } from '@/src/design-public-assets/components';
import { TradeDirectionIcon } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { AccountClosedPnlTrendChart, MetricCluster, RiskGauge } from '@/src/design-public-assets/business-components';
import { buildTradingAccountProfiles, getAccountStatusLabel } from '@/src/domain/accountProfiles';
import { directionLabel, formatMoney, formatNumber } from '@/src/domain/format';
import { getFundingOperationActions } from '@/src/domain/funding';
import type { Locale } from '@/src/design-public-assets/copy';
import { useToast } from '@/src/feedback/Toast';
import { useProductSettings } from '@/src/design-public-assets/copy';
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

        <MetricCluster
          items={[
            { label: t('account.equity'), value: formatNumber(profile.equity, 2, locale) },
            { label: t('account.balance'), value: formatNumber(profile.balance, 2, locale) },
            { label: t('accountDetails.realizedPnl'), tone: profile.realizedPnl >= 0 ? 'down' : 'up', value: formatMoney(profile.realizedPnl, profile.currency, 2, locale) },
          ]}
          style={styles.detailMetrics}
        />
      </Card>

      <Card>
        <View style={styles.marginStatus}>
          <View style={styles.marginCopy}>
            <AppText tone="muted" variant="caption">{t('portfolio.unrealizedPnl')}</AppText>
            <AppText tone={profile.unrealizedPnl >= 0 ? 'up' : 'down'} variant="title">
              {formatMoney(profile.unrealizedPnl, profile.currency, 2, locale)}
            </AppText>
          </View>
          <RiskGauge
            locale={locale}
            riskLabel={t('accountDetails.risk')}
            safeLabel={t('accountDetails.safe')}
            title={t('accountDetails.safetyIndex')}
            value={profile.marginLevel}
          />
        </View>

        <View style={StyleSheet.flatten([styles.divider, { backgroundColor: colors.border.subtle }])} />
        <MetricCluster
          items={[
            { label: t('account.freeMargin'), value: formatNumber(profile.freeMargin, 2, locale) },
            { label: t('account.usedMargin'), value: formatNumber(profile.usedMargin, 2, locale) },
          ]}
          style={styles.detailMetrics}
        />
        <MetricCluster
          items={[
            { label: t('accountDetails.leverage'), value: profile.leverage },
            { label: t('portfolio.current'), value: `${positionRows.length}` },
          ]}
          style={styles.detailMetrics}
        />
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
                <AppText tone={position.direction === 'buy' ? 'up' : 'down'} variant="caption">
                  {directionLabel(position.direction, locale).toLowerCase()} {position.lots}
                </AppText>
              </View>
              <AppText tone="muted" variant="eyebrow">{position.priceRange}</AppText>
            </View>
            <AppText tone={position.pnl >= 0 ? 'up' : 'down'} variant="caption">
              {formatNumber(position.pnl, 2, locale)}
            </AppText>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.cardTitleRow}>
          <AppText variant="subtitle">{t('accountDetails.closedPnl')}</AppText>
          <StatusPill compact icon="icon.system.chevron_down" label={t('portfolio.symbolsCount', { count: size.chart.closedPnlLegendCount })} tone="neutral" />
        </View>
        <AppText tone={profile.realizedPnl >= 0 ? 'up' : 'down'} variant="subtitle">
          {formatMoney(profile.realizedPnl, profile.currency, 2, locale)}
        </AppText>
        <AppText tone="muted" variant="caption">{t('portfolio.totalClosedPnl')}</AppText>
        <AccountClosedPnlTrendChart realizedPnl={profile.realizedPnl} />
        <View style={styles.symbolLegendRow}>
          {[
            [t('common.total'), colors.brand.fg],
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
              tone={item.value >= 0 ? 'up' : 'down'}
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
          {Array.from({ length: size.chart.calendarDayCount }).map((_, index) => {
            const day = index + 1;
            const positive = [6, 7, 9, 10, 13, 15, 16, 20, 21, 22, 23, 24, 27].includes(day);
            const negative = [8, 14, 17, 28].includes(day);
            const bg = positive ? colors.overlay.up.subtle : negative ? colors.overlay.down.subtle : colors.surface.subtle;
            return (
              <View key={day} style={StyleSheet.flatten([styles.dayCell, { backgroundColor: bg, borderColor: colors.border.subtle }])}>
                <AppText variant="eyebrow">{day}</AppText>
                <AppText tone={positive ? 'up' : negative ? 'down' : 'muted'} variant="eyebrow">
                  {positive || negative ? '12.42' : '0.00'}
                </AppText>
              </View>
            );
          })}
        </View>
        <View style={styles.calendarStats}>
          <MetricCluster
            items={[
              { label: t('portfolio.profitableDays'), tone: 'up', value: String(size.chart.profitableDemoDays) },
              { label: t('portfolio.losingDays'), tone: 'down', value: String(size.chart.losingDemoDays) },
            ]}
          />
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

function buildClosedPnlPeriods(realizedPnl: number) {
  return [
    { period: '1W', value: realizedPnl * 0.22 },
    { period: '3W', value: realizedPnl * 0.48 },
    { period: '1M', value: realizedPnl * 0.72 },
    { period: '6M', value: realizedPnl },
  ];
}

function getDetailDemoPositions(locale: Locale) {
  return Array.from({ length: size.chart.closedPnlLegendCount }).map((_, index) => ({
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
    gap: spacing.xs,
    marginTop: radius.lg,
  },
  calendarStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
  },
  cardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm + spacing.xxs,
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: spacing.xs + lineWidth.strong,
    borderWidth: lineWidth.hairline,
    gap: spacing.xxs,
    height: size.control.sm - spacing.xxs,
    justifyContent: 'center',
    width: '13.3%',
  },
  detailHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm + spacing.xxs,
  },
  detailMetrics: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginTop: radius.lg,
  },
  detailTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  detailTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + lineWidth.strong,
  },
  divider: {
    height: lineWidth.hairline,
    marginVertical: spacing.md,
  },
  marginCopy: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  marginStatus: {
    alignItems: 'center',
  },
  moreSheet: {
    marginHorizontal: radius.lg,
    marginTop: radius.lg,
  },
  menuListInset: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
    paddingHorizontal: layout.cardPaddingX,
  },
  periodPill: {
    flex: 1,
    justifyContent: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  positionMain: {
    flex: 1,
    minWidth: 0,
  },
  positionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm + lineWidth.strong,
    minHeight: layout.touchTargetMin + spacing.sm,
    paddingVertical: spacing.xs + spacing.xxs + lineWidth.strong,
  },
  positionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  symbolLegendDot: {
    borderRadius: radius.full,
    height: spacing.xs + spacing.xxs,
    width: spacing.xs + spacing.xxs,
  },
  symbolLegendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  symbolLegendRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xxs,
  },
});
