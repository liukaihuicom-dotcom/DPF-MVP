import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/src/components/Card';
import { CurrencyFlag } from '@/src/components/CurrencyFlag';
import { DescribedLabel } from '@/src/components/DescribedLabel';
import { FundActionGrid } from '@/src/components/FundActionGrid';
import { IconSurface } from '@/src/components/IconSurface';
import { Metric } from '@/src/components/Metric';
import { NativePressable } from '@/src/components/NativePressable';
import { bottomSheetPresets, useBottomSheet } from '@/src/components/BottomSheet';
import { AppIcon } from '@/src/components/AppIcon';
import { Screen } from '@/src/components/Screen';
import { Sparkline } from '@/src/components/Sparkline';
import { StatusPill, type StatusPillTone } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import {
  buildTradingAccountProfiles,
  getAccountStatusLabel,
  tradingAccountStatusGroups,
  type TradingAccountProfile,
} from '@/src/domain/accountProfiles';
import { formatCompactMoney, formatMoney, formatVolumeMillions, localizeText, statusLabel } from '@/src/domain/format';
import { getFundingOperationActions } from '@/src/domain/funding';
import { commissions, partnerMetrics } from '@/src/domain/mockData';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, layout, radius, spacing, typography } from '@/src/theme/tokens';

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
  const { locale, colors, t } = useProductSettings();
  const status = profile.group !== 'active' ? getAccountStatusLabel(profile.group, locale) : '';
  const statusTone: StatusPillTone = profile.group === 'demo' ? 'brand' : profile.group === 'disabled' || profile.group === 'archived' ? 'danger' : 'warning';

  return (
    <NativePressable
      accessibilityLabel={profile.accountNo}
      minTouch={86}
      onPress={() => router.push(`/account-details/${profile.id}`)}
      style={StyleSheet.flatten([styles.accountCard, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
      <IconSurface icon="icon.account.trading" sizeVariant="md" />
      <View style={styles.accountCardBody}>
        <View style={styles.accountCardTop}>
          <View style={styles.accountTitleBlock}>
            <View style={styles.accountNumberRow}>
              <AppText variant="subtitle">{profile.accountNo}</AppText>
              {status ? <StatusPill compact label={status} tone={statusTone} /> : null}
            </View>
            <View style={styles.accountMetaRow}>
              <CurrencyFlag currency={profile.currency} size={14} />
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {profile.currency} · {profile.platform} · {profile.type}
              </AppText>
            </View>
          </View>
          <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
        </View>

        <View style={StyleSheet.flatten([styles.accountDivider, { backgroundColor: colors.border.subtle }])} />
        <View style={styles.accountValues}>
          <View style={styles.accountValueCell}>
            <AppText style={styles.accountValueAmount}>{formatMoney(profile.equity, profile.currency, 2, locale)}</AppText>
            <AppText style={styles.accountValueLabel} tone="muted">
              {t('account.equity')}
            </AppText>
          </View>
          <View style={styles.accountValueCell}>
            <AppText style={styles.accountValueAmount} tone={profile.unrealizedPnl >= 0 ? 'down' : 'up'}>
              {formatMoney(profile.unrealizedPnl, profile.currency, 2, locale)}
            </AppText>
            <AppText style={styles.accountValueLabel} tone="muted">
              {t('portfolio.unrealizedPnl')}
            </AppText>
          </View>
        </View>
        <AppText tone="dim" variant="caption">
          {t('accountDetails.lastTrade')} {profile.lastTrade}
        </AppText>
      </View>
    </NativePressable>
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
              <AppText numberOfLines={1} style={styles.overviewDailyValue} tone={overview.todayPnl >= 0 ? 'down' : 'up'} variant="subtitle">
                {formatMoney(overview.todayPnl, 'USD', 2, locale)}
              </AppText>
            </View>
            <View style={styles.overviewTrend}>
              <Sparkline edgeToEdge color={overview.todayPnl >= 0 ? colors.market.down.fg : colors.market.up.fg} height={56} values={overview.trendValues} width="100%" />
            </View>
          </View>
        </View>

        <View style={StyleSheet.flatten([styles.overviewVerticalDivider, { backgroundColor: colors.border.subtle }])} />

        <View style={styles.overviewSide}>
          <OverviewSideMetric
            label={t('accounts.overview.totalUnrealizedPnl')}
            tone={overview.totalUnrealizedPnl >= 0 ? 'down' : 'up'}
            value={formatMoney(overview.totalUnrealizedPnl, 'USD', 2, locale)}
          />
          <OverviewSideMetric
            label={t('accounts.overview.totalReturn')}
            tone={overview.totalReturn >= 0 ? 'down' : 'up'}
            value={formatMoney(overview.totalReturn, 'USD', 2, locale)}
          />
          <OverviewSideMetric label={t('accounts.overview.activeAccounts')} value={`${overview.activeAccountCount}`} />
        </View>
      </View>
    </Card>
  );
}

function MetricDescriptionSheet({ description, label, value }: { description: string; label: string; value: string }) {
  const { colors } = useProductSettings();

  return (
    <View style={styles.descriptionSheet}>
      <View style={StyleSheet.flatten([styles.descriptionValueCard, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
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
          <Metric label={t('commission.settled')} tone="down" value={formatCompactMoney(partnerMetrics.settledCommission, 'USD', locale)} />
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
              <AppText tone={commission.status === 'pending' ? 'amber' : 'down'} variant="body">
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
  accountCard: {
    alignItems: 'flex-start',
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  accountCardBody: {
    flex: 1,
    gap: 9,
    minWidth: 0,
  },
  accountCardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  accountDivider: {
    height: lineWidth.hairline,
  },
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
  accountMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minWidth: 0,
  },
  accountNumberRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  accountTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  accountValueCell: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  accountValueAmount: {
    ...typography.displayLg,
  },
  accountValueLabel: {
    ...typography.caption,
  },
  accountValues: {
    flexDirection: 'row',
    gap: 12,
  },
  descriptionSheet: {
    gap: spacing.lg,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
  },
  descriptionValueCard: {
    borderRadius: 10,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    padding: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  overviewCardContent: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 14,
  },
  overviewDailyBlock: {
    gap: 6,
    marginTop: 16,
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
    gap: 12,
    justifyContent: 'center',
    minWidth: 116,
  },
  overviewSideMetric: {
    gap: 3,
    minWidth: 0,
  },
  overviewSideMetricLabel: {
    ...typography.captionRegular,
  },
  overviewTrend: {
    alignItems: 'flex-end',
    height: 56,
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
    gap: 12,
    minHeight: 60,
    paddingVertical: 10,
  },
  recordSide: {
    alignItems: 'flex-end',
    minWidth: 92,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    marginTop: 12,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
