import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MetricDescriptionSheet } from '@/src/design-public-assets/business-components';
import { openDetailSheet, useBottomSheet } from '@/src/design-public-assets/components';
import { Card } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { Screen } from '@/src/design-public-assets/components';
import { StatusPill, type StatusPillTone } from '@/src/design-public-assets/components';
import { AppText, type AppTextTone } from '@/src/design-public-assets/components';
import { buildSharedTradingAccountProfiles } from '@/src/domain/tradingAccountView';
import { getAccountStatusLabel, type TradingAccountProfile } from '@/src/domain/accountProfiles';
import { formatMoney, formatNumber, localizeText } from '@/src/domain/format';
import type { Locale, TranslationKey } from '@/src/design-public-assets/copy';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, spacing } from '@/src/design-public-assets/tokens';

type ProfileRow = {
  descriptionKey?: TranslationKey;
  label: string;
  tone?: AppTextTone;
  value: string;
};

type ProfileSection = {
  rows: ProfileRow[];
};

export default function AccountBasicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bottomSheet = useBottomSheet();
  const { account, orders, positions } = useBroker();
  const {
    locale,
    colors,
    t,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
  } = useProductSettings();
  const profiles = buildSharedTradingAccountProfiles(account, positions, tradingAccountScenario, {
    countPreset: tradingAccountCountPreset,
    dataPreset: tradingAccountDataPreset,
    statusPreset: tradingAccountStatusPreset,
  });
  const profile = profiles.find((item) => item.id === id) ?? profiles[0];
  const statusTone: StatusPillTone =
    profile.group === 'demo'
      ? 'brand'
      : profile.group === 'active'
        ? 'success'
        : profile.group === 'readOnly'
          ? 'warning'
          : 'danger';
  const rows = buildProfileSections({
    accountName: localizeText(account.label, locale),
    closedPnl: profile.realizedPnl + calculateClosedPnl(orders),
    deposit: calculateFundingTotal(account.transactions, 'deposit'),
    locale,
    negativeBalanceProtection: Math.max(0, profile.freeMargin - profile.usedMargin),
    profile,
    received: account.credit,
    sent: 0,
    statusLabel: getAccountStatusLabel(profile.group, locale),
    t,
    trades: orders.length + positions.length,
    volumeLots: calculateVolumeLots(orders, positions),
    withdrawal: calculateFundingTotal(account.transactions, 'withdrawal'),
  });
  const openDescription = (row: ProfileRow) => {
    if (!row.descriptionKey) {
      return;
    }

    openDetailSheet(bottomSheet, {
      content: <MetricDescriptionSheet description={t(row.descriptionKey)} label={row.label} value={row.value} />,
      title: row.label,
    });
  };

  return (
    <Screen align="center" back backHref="/accounts" rightActions={[]} title={t('accountDetails.menuBasicInfo')}>
      <Card compact>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryCopy}>
            <AppText numberOfLines={1} variant="subtitle">
              {profile.accountNo}
            </AppText>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {profile.platform} · {profile.currency} · {profile.type}
            </AppText>
          </View>
          <StatusPill compact label={getAccountStatusLabel(profile.group, locale)} tone={statusTone} />
        </View>
      </Card>

      {rows.map((section, sectionIndex) => (
        <Card compact key={`${sectionIndex}-${section.rows[0]?.label}`}>
          {section.rows.map((row, rowIndex) => (
            <View
              key={row.label}
              style={StyleSheet.flatten([
                styles.infoRow,
                rowIndex < section.rows.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline },
              ])}>
              <InfoLabel row={row} onPress={() => openDescription(row)} />
              <AppText numberOfLines={1} style={styles.infoValue} tone={row.tone} variant="body">
                {row.value}
              </AppText>
            </View>
          ))}
        </Card>
      ))}
    </Screen>
  );
}

function InfoLabel({ onPress, row }: { onPress: () => void; row: ProfileRow }) {
  const { colors } = useProductSettings();

  if (!row.descriptionKey) {
    return (
      <AppText style={styles.infoLabel} tone="muted" variant="body">
        {row.label}
      </AppText>
    );
  }

  return (
    <NativePressable accessibilityLabel={row.label} minTouch={32} onPress={onPress} style={styles.infoLabelButton}>
      <AppText style={StyleSheet.flatten([styles.explainableLabel, { borderBottomColor: colors.text.primary }])} tone="default" variant="body">
        {row.label}
      </AppText>
    </NativePressable>
  );
}

function buildProfileSections({
  accountName,
  closedPnl,
  deposit,
  locale,
  negativeBalanceProtection,
  profile,
  received,
  sent,
  statusLabel,
  t,
  trades,
  volumeLots,
  withdrawal,
}: {
  accountName: string;
  closedPnl: number;
  deposit: number;
  locale: Locale;
  negativeBalanceProtection: number;
  profile: TradingAccountProfile;
  received: number;
  sent: number;
  statusLabel: string;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
  trades: number;
  volumeLots: number;
  withdrawal: number;
}): ProfileSection[] {
  const formatPlainMoney = (value: number) => formatNumber(value, 2, locale);
  const profitBase = Math.max(1, Math.abs(profile.realizedPnl) + Math.abs(profile.unrealizedPnl));
  const profitability = Math.max(0, Math.min(99.99, (Math.max(profile.realizedPnl, 0) / profitBase) * 100));
  const averageProfit = trades > 0 ? Math.max(profile.realizedPnl, 0) / trades : 0;
  const averageLoss = trades > 0 ? Math.min(profile.unrealizedPnl, 0) / trades : 0;

  return [
    {
      rows: [
        { label: t('accountDetails.name'), value: accountName },
        { label: t('accountDetails.accountNo'), value: profile.accountNo },
        { label: t('accountDetails.type'), value: profile.type },
        { label: t('accountDetails.mode'), value: profile.group === 'demo' ? 'Hedging' : 'Netting' },
        { label: t('accountDetails.status'), tone: profile.group === 'active' || profile.group === 'demo' ? 'down' : 'amber', value: statusLabel },
        { label: t('accountDetails.leverage'), value: profile.leverage },
        { label: t('accountDetails.platform'), value: profile.platform },
        { label: t('accountDetails.serverTimeZone'), value: 'UTC+3' },
        { label: t('accountDetails.createdOn'), value: buildCreatedAt(profile.accountNo) },
        { label: t('accountDetails.serverName'), value: profile.server },
      ],
    },
    {
      rows: [
        {
          descriptionKey: 'accountDetails.description.unrealizedPnl',
          label: t('accountDetails.unrealizedPnl'),
          tone: toneForSigned(profile.unrealizedPnl),
          value: formatPlainMoney(profile.unrealizedPnl),
        },
        {
          descriptionKey: 'accountDetails.description.realizedPnl',
          label: t('accountDetails.realizedPnl'),
          tone: toneForSigned(profile.realizedPnl),
          value: formatPlainMoney(profile.realizedPnl),
        },
        {
          descriptionKey: 'accountDetails.description.volumeLots',
          label: t('accountDetails.volumeLots'),
          value: formatNumber(volumeLots, 2, locale),
        },
        {
          descriptionKey: 'accountDetails.description.trades',
          label: t('accountDetails.trades'),
          value: `${trades}`,
        },
        { label: t('accountDetails.profitability'), value: formatNumber(profitability, 2, locale) },
        { label: t('accountDetails.averageProfit'), tone: averageProfit > 0 ? 'down' : undefined, value: formatPlainMoney(averageProfit) },
        { label: t('accountDetails.averageLoss'), tone: averageLoss < 0 ? 'up' : undefined, value: formatPlainMoney(averageLoss) },
        { label: t('accountDetails.lastTrade'), value: profile.lastTrade },
      ],
    },
    {
      rows: [
        { label: t('accountDetails.deposit'), value: formatPlainMoney(deposit) },
        { label: t('accountDetails.withdrawal'), value: formatPlainMoney(withdrawal) },
        { label: t('accountDetails.received'), value: formatPlainMoney(received) },
        { label: t('accountDetails.sent'), value: formatPlainMoney(sent) },
        {
          descriptionKey: 'accountDetails.description.closedPnl',
          label: t('accountDetails.closedPnl'),
          tone: toneForSigned(closedPnl),
          value: formatPlainMoney(closedPnl),
        },
        { label: t('accountDetails.swap'), value: formatPlainMoney(-36.12) },
        { label: t('accountDetails.commission'), value: formatPlainMoney(0) },
        { label: t('accountDetails.negativeBalanceProtection'), value: formatMoney(negativeBalanceProtection, profile.currency, 2, locale) },
        { label: t('accountDetails.withdrawalRefund'), value: formatPlainMoney(0) },
        { label: t('accountDetails.adjustment'), value: formatPlainMoney(received) },
      ],
    },
  ];
}

function toneForSigned(value: number): AppTextTone | undefined {
  if (value > 0) {
    return 'up';
  }

  if (value < 0) {
    return 'down';
  }

  return undefined;
}

function buildCreatedAt(accountNo: string) {
  const numericSeed = Number(accountNo.replace(/\D/g, '').slice(-2)) || 54;
  const day = String((numericSeed % 24) + 1).padStart(2, '0');
  const hour = String((numericSeed % 12) + 9).padStart(2, '0');
  return `${day}/07/2024 ${hour}:21:48`;
}

function calculateFundingTotal(
  transactions: ReturnType<typeof useBroker>['account']['transactions'],
  type: 'deposit' | 'withdrawal',
) {
  return transactions
    .filter((transaction) => transaction.type === type && transaction.status === 'completed')
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
}

function calculateClosedPnl(orders: ReturnType<typeof useBroker>['orders']) {
  return orders
    .filter((order) => order.status === 'closed')
    .reduce((total, order) => total + (order.direction === 'buy' ? 1 : -1) * 24.6, 0);
}

function calculateVolumeLots(
  orders: ReturnType<typeof useBroker>['orders'],
  positions: ReturnType<typeof useBroker>['positions'],
) {
  const orderLots = orders.reduce((total, order) => total + order.lots, 0);
  const positionLots = positions.reduce((total, position) => total + position.lots, 0);
  return orderLots + positionLots;
}

const styles = StyleSheet.create({
  explainableLabel: {
    alignSelf: 'flex-start',
    borderBottomWidth: lineWidth.hairline,
    borderStyle: 'dotted',
  },
  infoLabel: {
    flex: 1,
    minWidth: 0,
  },
  infoLabelButton: {
    alignItems: 'flex-start',
    flex: 1,
    minWidth: 0,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: spacing.xs,
  },
  infoValue: {
    flex: 1,
    minWidth: 0,
    textAlign: 'right',
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
});
