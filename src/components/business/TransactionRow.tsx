import { StyleSheet, View } from 'react-native';

import { formatMoney, localizeText } from '@/src/domain/format';
import type { Locale } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, layout, size, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from '../AppIcon';
import { IconSurface, type IconSurfaceTone } from '../IconSurface';
import { NativePressable } from '../NativePressable';
import { StatusPill, type StatusPillTone } from '../StatusPill';
import { AppText } from '../Typography';

export type TransactionListRow = {
  amount: number;
  createdAt: string;
  id: string;
  note: Partial<Record<Locale, string>> & Record<'en-US' | 'zh-CN', string>;
  status: 'completed' | 'rejected' | 'reviewing';
  type: 'adjustment' | 'deposit' | 'withdrawal';
};

type TransactionRowProps<T extends TransactionListRow> = {
  currency: string;
  formatTime: (createdAt: string, locale: Locale) => string;
  getIcon: (transaction: T) => AppIconName;
  getStatusLabel: (transaction: T) => string;
  getTone: (transaction: T) => StatusPillTone;
  onPress: () => void;
  resolveColor: (transaction: T, colors: ReturnType<typeof useProductSettings>['colors']) => string;
  resolveIconTone: (transaction: T) => IconTone;
  showDivider?: boolean;
  transaction: T;
};

export function TransactionRow<T extends TransactionListRow>({
  currency,
  formatTime,
  getIcon,
  getStatusLabel,
  getTone,
  onPress,
  resolveColor,
  resolveIconTone,
  showDivider,
  transaction,
}: TransactionRowProps<T>) {
  const { locale, colors, t } = useProductSettings();
  const icon = getIcon(transaction);
  const surfaceTone = resolveIconSurfaceTone(resolveIconTone(transaction));

  return (
    <NativePressable
      accessibilityLabel={t('balance.detail.open', { title: localizeText(transaction.note, locale) })}
      accessibilityRole="button"
      minTouch={58}
      onPress={onPress}
      style={StyleSheet.flatten([styles.row, showDivider && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
      <IconSurface icon={icon} sizeVariant="sm" tone={surfaceTone} />
      <View style={styles.main}>
        <AppText numberOfLines={1} variant="subtitle">
          {localizeText(transaction.note, locale)}
        </AppText>
        <AppText numberOfLines={1} tone="muted" variant="caption">
          {formatTime(transaction.createdAt, locale)}
        </AppText>
      </View>
      <View style={styles.side}>
        <AppText adjustsFontSizeToFit numberOfLines={1} tone={transaction.amount >= 0 ? 'down' : 'up'} variant="subtitle">
          {formatSignedMoney(transaction.amount, currency, locale)}
        </AppText>
        <StatusPill compact label={getStatusLabel(transaction)} tone={getTone(transaction)} />
      </View>
      <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" />
    </NativePressable>
  );
}

function resolveIconSurfaceTone(tone: IconTone): IconSurfaceTone {
  if (tone === 'down' || tone === 'success') return 'down';
  if (tone === 'up' || tone === 'danger') return 'up';
  if (tone === 'amber' || tone === 'warning') return 'warning';
  if (tone === 'blue' || tone === 'info') return 'info';
  if (tone === 'brand') return 'brand';
  return 'neutral';
}

function formatSignedMoney(value: number, currency: string, locale: Locale, digits = 2) {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatMoney(Math.abs(value), currency, digits, locale)}`;
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  side: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    maxWidth: size.viewport.detailSideMaxWidth,
    minWidth: size.viewport.detailSideMinWidth,
  },
});
