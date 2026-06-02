import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName, type IconTone } from '@/src/design-public-assets/components';
import { openScrollableDetailSheet, useBottomSheet } from '@/src/design-public-assets/components';
import { FilterPillGroup, FundingTrendBars, TransactionDetailSheet, TransactionRow } from '@/src/design-public-assets/business-components';
import { Card } from '@/src/design-public-assets/components';
import { LegendDot, MiniMetric } from '@/src/design-public-assets/components';
import { EmptyState } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { StatusPill, type StatusPillTone } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { buildTradingAccountProfiles } from '@/src/domain/accountProfiles';
import { formatMoney } from '@/src/domain/format';
import type { Locale } from '@/src/design-public-assets/copy';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';
import { resolveThemeTone } from '@/src/design-public-assets/tokens';
import { layout, lineWidth, radius, size, spacing } from '@/src/design-public-assets/tokens';
import type { Transaction, TransactionStatus } from '@/src/domain/types';

type BalanceFilter = 'all' | 'deposit' | 'withdrawal';
type BalanceTransaction = Transaction & {
  trendLabel: string;
};
type TrendPoint = {
  deposit: number;
  label: string;
  withdrawal: number;
};

const filterOrder: BalanceFilter[] = ['all', 'deposit', 'withdrawal'];

export default function AccountBalanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bottomSheet = useBottomSheet();
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
  const [filter, setFilter] = useState<BalanceFilter>('all');
  const profiles = buildTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const profile = profiles.find((item) => item.id === id) ?? profiles[0];
  const transactions = useMemo(
    () => buildBalanceTransactions(account.transactions, account.credit, t('balance.adjustment.demoCredit'), t('balance.withdrawal.demoRejected')),
    [account.credit, account.transactions, t],
  );
  const filteredTransactions = filter === 'all' ? transactions : transactions.filter((item) => item.type === filter);
  const groupedTransactions = groupTransactions(filteredTransactions, locale, t('balance.group.today'));
  const completedTransactions = transactions.filter((item) => item.status === 'completed');
  const trend = buildTrend(completedTransactions);
  const depositTotal = completedTransactions.filter((item) => item.type === 'deposit').reduce((total, item) => total + item.amount, 0);
  const withdrawalTotal = completedTransactions.filter((item) => item.type === 'withdrawal').reduce((total, item) => total + Math.abs(item.amount), 0);
  const netCashFlow = depositTotal - withdrawalTotal;
  const nextFilter = () => setFilter((current) => filterOrder[(filterOrder.indexOf(current) + 1) % filterOrder.length]);
  const openTransactionDetail = (transaction: BalanceTransaction) => {
    openScrollableDetailSheet(bottomSheet, {
      content: <TransactionDetailSheet currency={profile.currency} profile={profile} transaction={transaction} />,
      footer: [
        {
          label: t('balance.detail.ok'),
          onPress: bottomSheet.hide,
          tone: 'brand',
          variant: 'filled',
        },
      ],
      leftIcon: getTransactionIcon(transaction),
      title: t('balance.detail.title'),
    });
  };

  return (
    <Screen
      align="center"
      back
      backHref="/accounts"
      rightActions={[{ icon: 'icon.system.settings', label: t('balance.filter'), onPress: nextFilter }]}
      title={t('balance.title')}>
      <Card style={styles.periodCard}>
        <View style={styles.periodHeader}>
          <View style={styles.flexBlock}>
            <AppText tone="muted" variant="caption">
              {t('balance.globalPeriod')}
            </AppText>
            <AppText numberOfLines={1} variant="subtitle">
              {profile.accountNo} · {profile.server}
            </AppText>
          </View>
          <NativePressable
            accessibilityLabel={t('balance.period.last7')}
            minTouch={36}
            style={StyleSheet.flatten([styles.periodButton, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
            <AppText variant="caption">{t('balance.period.last7')}</AppText>
            <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
          </NativePressable>
        </View>
        <View style={StyleSheet.flatten([styles.snapshotGrid, { borderTopColor: colors.border.subtle }])}>
          <MiniMetric label={t('balance.currentBalance')} value={formatMoney(profile.balance, profile.currency, 0, locale)} variant="snapshot" />
          <MiniMetric label={t('balance.available')} value={formatMoney(profile.freeMargin, profile.currency, 0, locale)} variant="snapshot" />
          <MiniMetric label={t('balance.netCashFlow')} tone={netCashFlow >= 0 ? 'up' : 'down'} value={formatSignedMoney(netCashFlow, profile.currency, locale, 0)} variant="snapshot" />
        </View>
      </Card>

      <Card style={styles.trendCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.flexBlock}>
            <AppText variant="subtitle">{t('balance.fundingTrend')}</AppText>
            <AppText tone="muted" variant="caption">
              {t('balance.fundingSubtitle')}
            </AppText>
          </View>
          <StatusPill compact label={t('balance.period.last7')} tone="neutral" />
        </View>

        <View style={styles.totalRow}>
          <FundingTotal tone="success" label={t('balance.depositTotal')} value={formatMoney(depositTotal, profile.currency, 0, locale)} />
          <FundingTotal tone="amber" label={t('balance.withdrawalTotal')} value={formatMoney(withdrawalTotal, profile.currency, 0, locale)} />
        </View>

        <FundingTrendBars points={trend} />

        <View style={styles.legendRow}>
          <LegendDot tone="success" label={t('balance.legend.deposit')} />
          <LegendDot tone="amber" label={t('balance.legend.withdrawal')} />
        </View>
      </Card>

      <Card style={styles.transactionCard}>
        <View style={styles.sectionHeader}>
          <AppText variant="subtitle">{t('balance.transactions')}</AppText>
          <AppText tone="muted" variant="caption">
            {filteredTransactions.length}
          </AppText>
        </View>

        <FilterPillGroup
          items={filterOrder.map((item) => ({ label: t(`balance.filter.${item}`), value: item }))}
          onChange={setFilter}
          value={filter}
        />

        {groupedTransactions.length === 0 ? (
          <EmptyState body={t('balance.empty')} />
        ) : (
          groupedTransactions.map((group) => (
            <View key={group.label} style={styles.transactionGroup}>
              <AppText tone="muted" variant="caption">
                {group.label}
              </AppText>
              <View style={StyleSheet.flatten([styles.transactionList, { borderColor: colors.border.subtle }])}>
                {group.rows.map((transaction, index) => (
                  <TransactionRow
                    currency={profile.currency}
                    formatTime={formatTransactionTime}
                    getIcon={getTransactionIcon}
                    getStatusLabel={(item) => t(`balance.detail.status.${item.status}`)}
                    getTone={getTransactionTone}
                    key={transaction.id}
                    onPress={() => openTransactionDetail(transaction)}
                    resolveColor={resolveTransactionColor}
                    resolveIconTone={resolveTransactionIconTone}
                    showDivider={index < group.rows.length - 1}
                    transaction={transaction}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

function FundingTotal({ label, tone, value }: { label: string; tone: Extract<IconTone, 'amber' | 'success'>; value: string }) {
  const { colors } = useProductSettings();

  return (
    <View style={styles.totalCell}>
      <View style={styles.totalLabelRow}>
        <View style={StyleSheet.flatten([styles.legendDot, { backgroundColor: resolveThemeTone(colors, tone) }])} />
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {label}
        </AppText>
      </View>
      <AppText adjustsFontSizeToFit numberOfLines={1} variant="subtitle">
        {value}
      </AppText>
    </View>
  );
}

function buildBalanceTransactions(transactions: Transaction[], credit: number, creditLabel: string, rejectedWithdrawalLabel: string): BalanceTransaction[] {
  const syntheticCredit: BalanceTransaction = {
    amount: credit,
    createdAt: '2026-05-22 10:12',
    id: 'balance-credit-adjustment',
    note: { 'en-US': creditLabel, 'zh-CN': creditLabel },
    status: 'completed',
    trendLabel: '05/22',
    type: 'adjustment',
  };
  const syntheticRejectedWithdrawal: BalanceTransaction = {
    amount: -800,
    createdAt: '2026-05-18 14:20',
    id: 'balance-withdrawal-rejected',
    note: { 'en-US': rejectedWithdrawalLabel, 'zh-CN': rejectedWithdrawalLabel },
    status: 'rejected',
    trendLabel: '05/18',
    type: 'withdrawal',
  };

  return [syntheticCredit, syntheticRejectedWithdrawal, ...transactions.map((transaction) => ({ ...transaction, trendLabel: formatTrendLabel(transaction.createdAt) }))]
    .sort((left, right) => parseTransactionTime(right.createdAt) - parseTransactionTime(left.createdAt));
}

function buildTrend(transactions: BalanceTransaction[]): TrendPoint[] {
  const bucket = new Map<string, TrendPoint>();

  transactions.forEach((transaction) => {
    const label = transaction.trendLabel;
    const current = bucket.get(label) ?? { deposit: 0, label, withdrawal: 0 };

    if (transaction.type === 'deposit') {
      current.deposit += Math.max(transaction.amount, 0);
    }

    if (transaction.type === 'withdrawal') {
      current.withdrawal += Math.abs(transaction.amount);
    }

    bucket.set(label, current);
  });

  return [...bucket.values()].sort((left, right) => left.label.localeCompare(right.label)).slice(-4);
}

function groupTransactions(rows: BalanceTransaction[], locale: Locale, todayLabel: string) {
  const groups: { key: string; label: string; rows: BalanceTransaction[] }[] = [];
  const mostRecentKey = rows[0] ? getDateKey(rows[0].createdAt) : '';

  rows.forEach((row) => {
    const key = getDateKey(row.createdAt);
    let group = groups.find((item) => item.key === key);

    if (!group) {
      group = { key, label: key === mostRecentKey ? todayLabel : formatDateGroupLabel(row.createdAt, locale), rows: [] };
      groups.push(group);
    }

    group.rows.push(row);
  });

  return groups;
}

function getTransactionIcon(transaction: Transaction): AppIconName {
  if (transaction.type === 'withdrawal') {
    return 'icon.wallet.withdrawal';
  }

  if (transaction.type === 'adjustment') {
    return 'icon.wallet.transfer';
  }

  return 'icon.wallet.deposit';
}

function getTransactionTone(transaction: Transaction): StatusPillTone {
  const toneByStatus: Record<TransactionStatus, StatusPillTone> = {
    completed: 'success',
    rejected: 'danger',
    reviewing: 'warning',
  };

  return toneByStatus[transaction.status];
}

function resolveStatusIconTone(status: TransactionStatus): IconTone {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'rejected') {
    return 'danger';
  }

  return 'amber';
}

function resolveTransactionColor(transaction: Transaction, colors: ReturnType<typeof useProductSettings>['colors']) {
  if (transaction.type === 'withdrawal') {
    return colors.status.warning.fg;
  }

  if (transaction.type === 'adjustment') {
    return colors.status.info.fg;
  }

  return colors.status.success.fg;
}

function resolveTransactionIconTone(transaction: Transaction): IconTone {
  if (transaction.type === 'withdrawal') {
    return 'amber';
  }

  if (transaction.type === 'adjustment') {
    return 'blue';
  }

  return 'success';
}


function formatSignedMoney(value: number, currency: string, locale: Locale, digits = 2) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatMoney(Math.abs(value), currency, digits, locale)}`;
}

function formatTrendLabel(createdAt: string) {
  const [, , month = '00', day = '00'] = /^(\d{4})-(\d{2})-(\d{2})/.exec(createdAt) ?? [];
  return `${month}/${day}`;
}

function getDateKey(createdAt: string) {
  return createdAt.slice(0, 10);
}

function formatDateGroupLabel(createdAt: string, locale: Locale) {
  const [, , month = '00', day = '00'] = /^(\d{4})-(\d{2})-(\d{2})/.exec(createdAt) ?? [];
  return locale !== 'zh-CN' ? `${month}/${day}` : `${month}月${day}日`;
}

function formatTransactionTime(createdAt: string, locale: Locale) {
  const [, , month = '00', day = '00', hour = '00', minute = '00'] =
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/.exec(createdAt) ?? [];

  return locale !== 'zh-CN' ? `${month}/${day} ${hour}:${minute}` : `${month}月${day}日 ${hour}:${minute}`;
}

function parseTransactionTime(createdAt: string) {
  return new Date(createdAt.replace(' ', 'T')).getTime();
}

const styles = StyleSheet.create({
  flexBlock: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  legendDot: {
    borderRadius: radius.full,
    height: size.indicator.dotSm,
    width: size.indicator.dotSm,
  },
  legendRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
  },
  periodButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  periodCard: {
    gap: spacing.lg,
  },
  periodHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  snapshotGrid: {
    borderTopWidth: lineWidth.hairline,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  totalCell: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  totalLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  transactionCard: {
    gap: spacing.lg,
  },
  transactionGroup: {
    gap: spacing.sm,
  },
  transactionList: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  trendCard: {
    gap: spacing.lg,
  },
});
