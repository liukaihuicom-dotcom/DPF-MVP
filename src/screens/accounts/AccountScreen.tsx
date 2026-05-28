import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/design-public-assets/components';
import { DescribedLabel } from '@/src/design-public-assets/components';
import { FundActionGrid } from '@/src/design-public-assets/components';
import { Metric } from '@/src/design-public-assets/components';
import { bottomSheetPresets, useBottomSheet } from '@/src/design-public-assets/components';
import { MetricDescriptionSheet } from '@/src/design-public-assets/business-components';
import { Screen } from '@/src/design-public-assets/components';
import { Sparkline } from '@/src/design-public-assets/components';
import { TradingAccountCard } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import {
  buildTradingAccountProfiles,
  getAccountStatusLabel,
  tradingAccountStatusGroups,
  type TradingAccountProfile,
} from '@/src/domain/accountProfiles';
import { formatCompactMoney, formatMoney, formatVolumeMillions, localizeText, statusLabel } from '@/src/domain/format';
import { getFundingOperationActions } from '@/src/domain/funding';
import { commissions, partnerMetrics } from '@/src/domain/mockData';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, layout, radius, size, spacing, typography } from '@/src/design-public-assets/tokens';

export default function AccountScreen() {
  return <TraderAccountsScreen />;
}

function TraderAccountsScreen() {
  const { account, positions } = useBroker();
  const {
    locale,
    colors,
    t,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
  } = useProductSettings();
  const accounts = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const overview = buildAccountOverview(accounts, positions.length);
  const selectedFundingAccount = accounts.find((item) => item.group === 'active') ?? accounts[0];
  const fundingActions = getFundingOperationActions(t, selectedFundingAccount?.id);

  return (
    <Screen title={t('tabs.accounts')}>
      <AccountOverviewCard overview={overview} />
      <FundActionGrid items={fundingActions} />
      <View style={styles.accountGroups}>
        {tradingAccountStatusGroups.map((group) => {
          const groupedAccounts = accounts.filter((item) => item.group === group);
          if (groupedAccounts.length === 0) {
            return null;
          }

          return (
            <View key={group} style={styles.accountGroup}>
              <View style={styles.accountGroupTitle}>
                <AppText style={styles.accountGroupTitleText} tone="muted">
                  {getAccountStatusLabel(group, locale)} ({groupedAccounts.length})
                </AppText>
              </View>
              {groupedAccounts.map((profile) => (
                <AccountListCard key={profile.id} profile={profile} />
              ))}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

function AccountListCard({ profile }: { profile: TradingAccountProfile }) {
  return (
    <TradingAccountCard
      accessibilityLabel={profile.accountNo}
      onPress={() => router.push(`/account-details/${profile.id}`)}
      profile={profile}
      trailing="chevron"
    />
  );
}

type AccountOverview = {
  activeAccountCount: number;
  todayPnl: number;
  latestTrade: string;
  openPositionCount: number;
  totalAccountCount: number;
  totalEquity: number;
  totalFreeMargin: number;
  totalRealizedPnl: number;
  totalReturn: number;
  totalUnrealizedPnl: number;
  totalUsedMargin: number;
  trendValues: number[];
};

function AccountOverviewCard({ overview }: { overview: AccountOverview }) {
  const { locale, colors, t } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const totalEquityLabel = t('accounts.overview.totalEquity');
  const totalEquityValue = formatMoney(overview.totalEquity, 'USD', 2, locale);
  const openTotalEquityDescription = () => {
    bottomSheet.show(bottomSheetPresets.detail({
      content: (
        <MetricDescriptionSheet
          description={t('accounts.overview.description.totalEquity')}
          label={totalEquityLabel}
          value={totalEquityValue}
        />
      ),
      title: totalEquityLabel,
    }));
  };

  return (
    <Card>
      <View style={styles.overviewCardContent}>
        <View style={styles.overviewPrimary}>
          <DescribedLabel
            accessibilityLabel={t('accounts.overview.totalEquityHelp')}
            label={totalEquityLabel}
            onPress={openTotalEquityDescription}
          />
          <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.overviewEquityValue} variant="quote">
            {totalEquityValue}
          </AppText>
          <View style={styles.overviewDailyBlock}>
            <View style={styles.overviewDailyRow}>
              <AppText tone="muted" variant="caption">{t('accounts.overview.dailyPnl')}</AppText>
              <AppText numberOfLines={1} style={styles.overviewDailyValue} tone={overview.todayPnl >= 0 ? 'up' : 'down'} variant="subtitle">
                {formatMoney(overview.todayPnl, 'USD', 2, locale)}
              </AppText>
            </View>
            <View style={styles.overviewTrend}>
              <Sparkline edgeToEdge color={overview.todayPnl >= 0 ? colors.market.up.fg : colors.market.down.fg} height={56} values={overview.trendValues} width="100%" />
            </View>
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.overviewVerticalDivider, { backgroundColor: colors.border.subtle }])} />

        <View style={styles.overviewSide}>
          <OverviewSideMetric
            label={t('accounts.overview.totalUnrealizedPnl')}
            tone={overview.totalUnrealizedPnl >= 0 ? 'up' : 'down'}
            value={formatMoney(overview.totalUnrealizedPnl, 'USD', 2, locale)}
          />
          <OverviewSideMetric
            label={t('accounts.overview.totalReturn')}
            tone={overview.totalReturn >= 0 ? 'up' : 'down'}
            value={formatMoney(overview.totalReturn, 'USD', 2, locale)}
          />
          <OverviewSideMetric label={t('accounts.overview.activeAccounts')} value={`${overview.activeAccountCount}`} />
        </View>
      </View>
    </Card>
  );
}

function OverviewSideMetric({ label, tone, value }: { label: string; tone?: 'down' | 'up'; value: string }) {
  return (
    <View style={styles.overviewSideMetric}>
      <AppText style={styles.overviewSideMetricLabel} tone="muted">{label}</AppText>
      <AppText adjustsFontSizeToFit numberOfLines={1} tone={tone} variant="subtitle">
        {value}
      </AppText>
    </View>
  );
}

export function CommissionScreen({ showBack = false }: { showBack?: boolean }) {
  const { locale, colors, t } = useProductSettings();

  return (
    <Screen back={showBack} backHref="/quick" title={t('commission.title')}>
      <Card highlight>
        <View style={styles.metricRow}>
          <Metric label={t('commission.pending')} tone="amber" value={formatCompactMoney(partnerMetrics.pendingCommission, 'USD', locale)} />
          <Metric label={t('commission.settled')} tone="up" value={formatCompactMoney(partnerMetrics.settledCommission, 'USD', locale)} />
        </View>
      </Card>

      <Card>
        <AppText variant="subtitle">{t('commission.rule')}</AppText>
        <View style={styles.ruleRow}>
          <Metric label={t('commission.fxMajor')} value="$82/M" />
          <Metric label={t('commission.gold')} value="$120/M" />
          <Metric label={t('commission.indexCfd')} value="$64/M" />
        </View>
        <AppText tone="muted" variant="caption">
          {t('commission.ruleHint')}
        </AppText>
      </Card>

      <View style={styles.sectionTitle}>
        <AppText variant="subtitle">{t('commission.details')}</AppText>
        <AppText tone="dim" variant="caption">
          {localizeText(partnerMetrics.month, locale)}
        </AppText>
      </View>
      <Card compact>
        {commissions.map((commission) => (
          <View key={commission.id} style={StyleSheet.flatten([styles.recordRow, { borderBottomColor: colors.border.subtle }])}>
            <View style={styles.recordMain}>
              <AppText variant="body">{commission.clientName}</AppText>
              <AppText tone="muted" variant="caption">
                {commission.symbol} · {formatVolumeMillions(commission.volume, locale)} · ${commission.ratePerMillion}/M
              </AppText>
            </View>
            <View style={styles.recordSide}>
              <AppText tone={commission.status === 'pending' ? 'amber' : 'up'} variant="body">
                {formatMoney(commission.amount, 'USD', 2, locale)}
              </AppText>
              <AppText tone="dim" variant="caption">
                {statusLabel(commission.status, locale)}
              </AppText>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

export function PartnerCommissionRoute() {
  return <CommissionScreen showBack />;
}

function buildAccountOverview(accounts: TradingAccountProfile[], openPositionCount: number): AccountOverview {
  const activeAccounts = accounts.filter((profile) => profile.group === 'active' || profile.group === 'demo');
  const totalRealizedPnl = accounts.reduce((total, profile) => total + profile.realizedPnl, 0);
  const totalUnrealizedPnl = accounts.reduce((total, profile) => total + profile.unrealizedPnl, 0);

  const totalEquity = accounts.reduce((total, profile) => total + profile.equity, 0);
  const totalReturn = totalRealizedPnl + totalUnrealizedPnl;

  return {
    activeAccountCount: activeAccounts.length,
    todayPnl: totalReturn,
    latestTrade: activeAccounts[0]?.lastTrade ?? accounts[0]?.lastTrade ?? '--',
    openPositionCount,
    totalAccountCount: accounts.length,
    totalEquity,
    totalFreeMargin: accounts.reduce((total, profile) => total + profile.freeMargin, 0),
    totalRealizedPnl,
    totalReturn,
    totalUnrealizedPnl,
    totalUsedMargin: accounts.reduce((total, profile) => total + profile.usedMargin, 0),
    trendValues: buildOverviewTrend(totalEquity, totalReturn),
  };
}

function buildOverviewTrend(totalEquity: number, totalReturn: number) {
  const base = Math.max(totalEquity - totalReturn, 1);
  return [base * 0.996, base * 1.002, base * 0.999, base * 1.008, base * 1.006, base * 1.014, totalEquity * 0.998, totalEquity];
}

const styles = StyleSheet.create({
  accountGroup: {
    gap: spacing.md,
  },
  accountGroups: {
    gap: spacing.xxl,
    paddingTop: spacing.md,
  },
  accountGroupTitle: {
    paddingHorizontal: spacing.lg,
  },
  accountGroupTitleText: {
    ...typography.caption,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  overviewCardContent: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: radius.lg,
  },
  overviewDailyBlock: {
    gap: spacing.xs + spacing.xxs,
    marginTop: spacing.lg,
  },
  overviewDailyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  overviewDailyValue: {
    minWidth: 0,
  },
  overviewEquityValue: {
    ...typography.quote,
  },
  overviewPrimary: {
    flex: 1.24,
    minWidth: 0,
  },
  overviewSide: {
    flex: 0.82,
    gap: spacing.md,
    justifyContent: 'center',
    minWidth: 116,
  },
  overviewSideMetric: {
    gap: spacing.xs - lineWidth.strong,
    minWidth: 0,
  },
  overviewSideMetricLabel: {
    ...typography.captionRegular,
  },
  overviewTrend: {
    alignItems: 'flex-end',
    height: size.control.lg,
    justifyContent: 'center',
    width: '100%',
  },
  overviewVerticalDivider: {
    alignSelf: 'stretch',
    width: lineWidth.hairline,
  },
  recordMain: {
    flex: 1,
    minWidth: 0,
  },
  recordRow: {
    alignItems: 'center',
    borderBottomWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 60,
    paddingVertical: spacing.sm + spacing.xxs,
  },
  recordSide: {
    alignItems: 'flex-end',
    minWidth: 92,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm + spacing.xxs,
    marginTop: spacing.md,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
