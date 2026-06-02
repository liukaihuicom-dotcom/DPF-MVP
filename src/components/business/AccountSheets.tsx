import { StyleSheet, View } from 'react-native';

import { getAccountStatusLabel, type TradingAccountProfile } from '@/src/domain/accountProfiles';
import { getFundingOperationActions } from '@/src/domain/funding';
import { formatMoney } from '@/src/domain/format';
import type { Locale } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, spacing } from '@/src/theme/tokens';
import type { Transaction, TransactionStatus } from '@/src/domain/types';

import { AppIcon, type AppIconName } from '../AppIcon';
import { DetailRow, type DetailRowItem } from '../data-display';
import { FundActionGrid } from '../FundActionGrid';
import { GlobalMenuList } from '../GlobalMenuList';
import { IconSurface, type IconSurfaceTone } from '../IconSurface';
import { NativePressable } from '../NativePressable';
import { StatusPill, type StatusPillTone } from '../StatusPill';
import { AppText } from '../Typography';

export type BalanceTransactionSheetItem = Transaction & {
  trendLabel?: string;
};

export type TransactionDetailSheetProps = {
  currency: string;
  profile: TradingAccountProfile;
  transaction: BalanceTransactionSheetItem;
};

export type AccountMoreSheetProps = {
  items?: {
    icon: AppIconName;
    label: string;
    tone?: 'danger' | 'default';
  }[];
  onSelect: (label: string, tone?: 'danger' | 'default') => void;
};

export type AccountMenuSheetProps = {
  account: TradingAccountProfile;
  onSelectPlaceholder?: (label: string) => void;
  onViewBasicInfo: () => void;
  onViewBalance: () => void;
  onViewDetails: () => void;
};

export function TransactionDetailSheet({ currency, profile, transaction }: TransactionDetailSheetProps) {
  const { locale, colors, t } = useProductSettings();
  const statusTone = getTransactionTone(transaction);
  const statusOverlay = resolveStatusOverlay(transaction.status, colors);
  const completedValue = resolveCompletedAmount(transaction, currency, locale, t('balance.detail.pending'), t('balance.detail.notAvailable'));
  const reviewTimeLabel = transaction.status === 'completed' ? t('balance.detail.completeTime') : t('balance.detail.reviewTime');
  const reviewTimeValue =
    transaction.status === 'reviewing' ? t('balance.detail.pending') : formatTransactionTime(addMinutes(transaction.createdAt, transaction.status === 'rejected' ? 23 : 12), locale);
  const detailRows: DetailRowItem[] = [
    { label: t('balance.detail.requestTime'), value: formatTransactionTime(transaction.createdAt, locale) },
    { label: t('balance.detail.account'), value: profile.accountNo },
    { label: t('balance.detail.server'), value: profile.server },
    { label: t('balance.detail.reference'), value: formatTransactionReference(transaction) },
    { label: t('balance.detail.type'), value: getTransactionTypeLabel(transaction.type, t) },
    { label: t('balance.detail.method'), value: getTransactionMethodLabel(transaction.type, t) },
    { label: reviewTimeLabel, value: reviewTimeValue },
    { label: t('balance.detail.requestAmount'), value: formatSignedMoney(transaction.amount, currency, locale) },
    { label: t('balance.detail.completedAmount'), value: completedValue },
    ...(transaction.status === 'rejected' ? [{ label: t('balance.detail.failedReason'), value: t('balance.detail.failedReasonCopy') }] : []),
    { label: t('balance.detail.voucher'), value: t('balance.detail.view'), trailingIcon: true },
  ];

  return (
    <View style={styles.detailSheet}>
      <View style={StyleSheet.flatten([styles.detailHero, { backgroundColor: statusOverlay.muted }])}>
        <IconSurface icon={getDetailStatusIcon(transaction.status)} sizeVariant="lg" tone={resolveStatusSurfaceTone(transaction.status)} />
        <StatusPill icon={getDetailStatusIcon(transaction.status)} label={t(`balance.detail.status.${transaction.status}`)} tone={statusTone} />
        <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.detailAmount} tone={transaction.amount >= 0 ? 'up' : 'down'} variant="displayXl">
          {formatSignedMoney(transaction.amount, currency, locale)}
        </AppText>
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {getTransactionTypeLabel(transaction.type, t)}
        </AppText>
      </View>

      <View style={StyleSheet.flatten([styles.detailRows, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        {detailRows.map((row, index) => (
          <DetailRow key={`${row.label}-${row.value}`} row={row} showDivider={index < detailRows.length - 1} />
        ))}
      </View>
    </View>
  );
}

export function AccountMoreSheet({ items: providedItems, onSelect }: AccountMoreSheetProps) {
  const { colors, t } = useProductSettings();
  const items = providedItems ?? [
    { icon: 'icon.account.trading' as const, label: t('accountDetails.accountSettings'), tone: 'default' as const },
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

export function AccountMenuSheet({ account, onSelectPlaceholder, onViewBasicInfo, onViewBalance, onViewDetails }: AccountMenuSheetProps) {
  const { locale, colors, t } = useProductSettings();
  const status = getAccountStatusLabel(account.group, locale);
  const statusTone: StatusPillTone =
    account.group === 'demo'
      ? 'brand'
      : account.group === 'readOnly'
        ? 'warning'
        : 'success';
  const statusIcon =
    account.group === 'readOnly'
      ? 'icon.security.lock'
      : account.group === 'demo'
        ? 'icon.account.avatar'
        : 'icon.status.verified';
  const menuItems = [
    {
      icon: 'icon.kyc.identity' as const,
      label: t('accountDetails.menuBasicInfo'),
      onPress: onViewBasicInfo,
    },
    { icon: 'icon.trading.history' as const, label: t('portfolio.orderRecords'), onPress: () => onSelectPlaceholder?.(t('portfolio.orderRecords')) },
    { icon: 'icon.wallet.balance' as const, label: t('balance.title'), onPress: onViewBalance },
    { icon: 'icon.wallet.transfer' as const, label: t('accountDetails.swap'), onPress: () => onSelectPlaceholder?.(t('accountDetails.swap')) },
  ];

  return (
    <View style={styles.accountMenuSheet}>
      <View style={styles.menuAccountHeader}>
        <AppText style={styles.menuAccountNo} variant="largeNumber">
          {account.accountNo}
        </AppText>
        <AppText tone="muted" variant="subtitle">
          {t('account.margin')} · {account.currency}
        </AppText>
        <StatusPill icon={statusIcon} label={status} tone={statusTone} />
      </View>

      <FundActionGrid items={getFundingOperationActions(t, account.id)} />

      <View style={StyleSheet.flatten([styles.menuListInset, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        <GlobalMenuList contained items={menuItems} />
      </View>

      <NativePressable
        accessibilityLabel={t('accountDetails.open')}
        minTouch={spacing.xxl + spacing.xl + spacing.xxs}
        onPress={onViewDetails}
        style={StyleSheet.flatten([
          styles.viewDetailsButton,
          { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle },
        ])}>
        <AppText tone="blue" variant="subtitle">
          {t('accountDetails.open')}
        </AppText>
      </NativePressable>
    </View>
  );
}

function getTransactionTone(transaction: Transaction): StatusPillTone {
  const toneByStatus: Record<TransactionStatus, StatusPillTone> = {
    completed: 'success',
    rejected: 'danger',
    reviewing: 'warning',
  };

  return toneByStatus[transaction.status];
}

function getDetailStatusIcon(status: TransactionStatus): AppIconName {
  if (status === 'completed') {
    return 'icon.status.verified';
  }

  if (status === 'rejected') {
    return 'icon.status.rejected';
  }

  return 'icon.trading.history';
}

function resolveStatusOverlay(status: TransactionStatus, colors: ReturnType<typeof useProductSettings>['colors']) {
  if (status === 'completed') {
    return {
      muted: `${colors.status.success.fg}18`,
      scrim: `${colors.status.success.fg}66`,
      strong: `${colors.status.success.fg}55`,
      subtle: `${colors.status.success.fg}12`,
    };
  }

  if (status === 'rejected') {
    return colors.overlay.danger;
  }

  return colors.overlay.warning;
}

function resolveStatusSurfaceTone(status: TransactionStatus): IconSurfaceTone {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'rejected') {
    return 'danger';
  }

  return 'warning';
}

function getTransactionTypeLabel(type: Transaction['type'], t: ReturnType<typeof useProductSettings>['t']) {
  return t(`balance.type.${type}`);
}

function getTransactionMethodLabel(type: Transaction['type'], t: ReturnType<typeof useProductSettings>['t']) {
  if (type === 'withdrawal') {
    return t('balance.method.demoWithdrawal');
  }

  if (type === 'adjustment') {
    return t('balance.method.creditAdjustment');
  }

  return t('balance.method.bankTransfer');
}

function resolveCompletedAmount(transaction: Transaction, currency: string, locale: Locale, pendingLabel: string, emptyLabel: string) {
  if (transaction.status === 'reviewing') {
    return pendingLabel;
  }

  if (transaction.status === 'rejected') {
    return emptyLabel;
  }

  return formatSignedMoney(transaction.amount, currency, locale);
}

function formatTransactionReference(transaction: Transaction) {
  const normalizedId = transaction.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const dateStamp = transaction.createdAt.slice(5, 10).replace('-', '');

  return `REF-${dateStamp}-${normalizedId.slice(-6)}`;
}

function addMinutes(createdAt: string, minutes: number) {
  const date = new Date(createdAt.replace(' ', 'T'));
  date.setMinutes(date.getMinutes() + minutes);

  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatSignedMoney(value: number, currency: string, locale: Locale, digits = 2) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatMoney(Math.abs(value), currency, digits, locale)}`;
}

function formatTransactionTime(createdAt: string, locale: Locale) {
  const [, , month = '00', day = '00', hour = '00', minute = '00'] =
    /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/.exec(createdAt) ?? [];

  return locale !== 'zh-CN' ? `${month}/${day} ${hour}:${minute}` : `${month}月${day}日 ${hour}:${minute}`;
}

const styles = StyleSheet.create({
  accountMenuSheet: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  detailAmount: {
    marginTop: spacing.xs,
  },
  detailHero: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.sm,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  detailRows: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  detailSheet: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  menuListInset: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  menuAccountHeader: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  menuAccountNo: {
    textAlign: 'center',
  },
  moreSheet: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  viewDetailsButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.none,
    justifyContent: 'center',
  },
});
