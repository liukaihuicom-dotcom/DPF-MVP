import { StyleSheet, View } from 'react-native';

import { buildTradingAccountProfiles, getAccountStatusLabel, tradingAccountStatusGroups, type TradingAccountProfile } from '@/src/domain/accountProfiles';
import { formatMoney } from '@/src/domain/format';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, spacing, typography } from '@/src/theme/tokens';

import { CurrencyFlag } from './CurrencyFlag';
import { IconSurface } from './IconSurface';
import { NativePressable } from './NativePressable';
import { StatusPill, type StatusPillTone } from './StatusPill';
import { AppText } from './Typography';

type TradingAccountSwitchSheetProps = {
  accounts: ReturnType<typeof buildTradingAccountProfiles>;
  getDisabledReason?: (profile: TradingAccountProfile) => string | undefined;
  mode?: 'compact' | 'detailed';
  onSelect: (id: string) => void;
  selectedId: string;
};

export function TradingAccountSwitchSheet({
  accounts,
  getDisabledReason,
  mode = 'detailed',
  onSelect,
  selectedId,
}: TradingAccountSwitchSheetProps) {
  const { locale } = useProductSettings();

  return (
    <View style={styles.sheet}>
      <View style={styles.groups}>
        {tradingAccountStatusGroups.map((group) => {
          const groupedAccounts = accounts.filter((profile) => profile.group === group);

          if (groupedAccounts.length === 0) {
            return null;
          }

          return (
            <View key={group} style={styles.group}>
              <AppText style={styles.groupTitle} tone="muted" variant="body">
                {getAccountStatusLabel(group, locale)} ({groupedAccounts.length})
              </AppText>
              {groupedAccounts.map((profile) => (
                <SwitchAccountCard
                  disabledReason={getDisabledReason?.(profile)}
                  key={profile.id}
                  mode={mode}
                  onPress={() => onSelect(profile.id)}
                  profile={profile}
                  selected={profile.id === selectedId}
                />
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function createTradingAccountSwitchHeader({
  locale,
  onAddAccount,
  title,
}: {
  locale: ReturnType<typeof useProductSettings>['locale'];
  onAddAccount: () => void;
  title: string;
}) {
  return {
    rightAction: {
      accessibilityLabel: locale !== 'zh-CN' ? 'Add Account' : '添加账户',
      icon: 'icon.account.add_user' as const,
      onPress: onAddAccount,
    },
    title,
  };
}

function SwitchAccountCard({
  disabledReason,
  mode,
  onPress,
  profile,
  selected,
}: {
  disabledReason?: string;
  mode: 'compact' | 'detailed';
  onPress: () => void;
  profile: TradingAccountProfile;
  selected: boolean;
}) {
  const { locale, colors, t } = useProductSettings();
  const status = getAccountStatusLabel(profile.group, locale);
  const statusTone = getAccountStatusTone(profile);
  const title = `${t('accountDetails.accountNo')} ${profile.accountNo}`;
  const borderWidth = selected ? lineWidth.selected : lineWidth.none;
  const paddingOffset = borderWidth - lineWidth.none;
  const disabled = Boolean(disabledReason);
  const selectedBorderColor = colors.text.primary;

  return (
    <NativePressable
      accessibilityLabel={`${t('funding.account.selectSource')} ${profile.accountNo}`}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      minTouch={mode === 'detailed' ? 96 : 86}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.card,
        mode === 'compact' && styles.compactCard,
        {
          backgroundColor: disabled ? colors.surface.disabled : colors.surface.panel,
          borderColor: selected ? selectedBorderColor : disabled ? colors.border.disabled : colors.border.subtle,
          borderWidth,
          paddingHorizontal: (mode === 'compact' ? layout.cardPaddingCompactX : layout.cardPaddingX) - paddingOffset,
          paddingVertical: (mode === 'compact' ? layout.cardPaddingCompactY : layout.cardPaddingY) - paddingOffset,
        },
      ])}>
      <IconSurface icon="icon.wallet.balance" sizeVariant="md" />
      <View style={styles.cardBody}>
        <View style={styles.topRow}>
          <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <AppText numberOfLines={1} tone={disabled ? 'dim' : 'default'} variant="subtitle">
                {title}
              </AppText>
              {mode === 'detailed' && (profile.group !== 'active' || disabled) ? <StatusPill compact label={status} tone={statusTone} /> : null}
            </View>
            <View style={styles.metaRow}>
              <CurrencyFlag currency={profile.currency} size={18} />
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {profile.currency} · {profile.platform} · {profile.type}
              </AppText>
            </View>
          </View>
          {mode === 'detailed' ? (
            <View style={StyleSheet.flatten([styles.radio, { borderColor: selected ? selectedBorderColor : colors.text.tertiary }])}>
              {selected ? <View style={StyleSheet.flatten([styles.radioDot, { backgroundColor: selectedBorderColor }])} /> : null}
            </View>
          ) : (
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {profile.currency}
            </AppText>
          )}
        </View>

        {mode === 'detailed' ? (
          <>
            <DetailedAccountStats profile={profile} />
            {disabledReason ? (
              <AppText numberOfLines={2} tone="danger" variant="caption">
                {disabledReason}
              </AppText>
            ) : null}
          </>
        ) : (
          <CompactAccountMeta disabledReason={disabledReason} profile={profile} status={status} />
        )}
      </View>
    </NativePressable>
  );
}

function CompactAccountMeta({ disabledReason, profile, status }: { disabledReason?: string; profile: TradingAccountProfile; status: string }) {
  const { locale, t } = useProductSettings();

  return (
    <>
      <AppText numberOfLines={2} tone="muted" variant="caption">
        {status} · {t('account.equity')} {formatMoney(profile.equity, profile.currency, 0, locale)} · {t('portfolio.unrealizedPnl')}{' '}
        {formatMoney(profile.unrealizedPnl, profile.currency, 0, locale)}
      </AppText>
      {disabledReason ? (
        <AppText numberOfLines={2} tone="danger" variant="caption">
          {disabledReason}
        </AppText>
      ) : null}
    </>
  );
}

function DetailedAccountStats({ profile }: { profile: TradingAccountProfile }) {
  const { locale, colors, t } = useProductSettings();

  return (
    <>
      <View style={StyleSheet.flatten([styles.divider, { backgroundColor: colors.border.subtle }])} />
      <View style={styles.values}>
        <ValueCell label={t('account.equity')} value={formatMoney(profile.equity, profile.currency, 2, locale)} />
        <ValueCell label={t('portfolio.unrealizedPnl')} tone={profile.unrealizedPnl >= 0 ? 'down' : 'up'} value={formatMoney(profile.unrealizedPnl, profile.currency, 2, locale)} />
      </View>
      <View style={StyleSheet.flatten([styles.divider, { backgroundColor: colors.border.subtle }])} />
      <AppText tone="muted" variant="caption">
        {t('accountDetails.lastTrade')} {profile.lastTrade}
      </AppText>
    </>
  );
}

function ValueCell({ label, tone, value }: { label: string; tone?: 'down' | 'up'; value: string }) {
  return (
    <View style={styles.valueCell}>
      <AppText tone={tone} variant="title">
        {value}
      </AppText>
      <AppText variant="body">{label}</AppText>
    </View>
  );
}

function getAccountStatusTone(profile: TradingAccountProfile): StatusPillTone {
  if (profile.group === 'demo') {
    return 'brand';
  }

  if (profile.group === 'disabled' || profile.group === 'archived') {
    return 'danger';
  }

  if (profile.group === 'active') {
    return 'success';
  }

  return 'warning';
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: layout.cardPaddingY,
  },
  cardBody: {
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  compactCard: {
    paddingHorizontal: layout.cardPaddingCompactX,
    paddingVertical: layout.cardPaddingCompactY,
  },
  divider: {
    height: lineWidth.hairline,
  },
  group: {
    gap: 10,
  },
  groupTitle: {
    ...typography.caption,
    paddingLeft: spacing.md,
  },
  groups: {
    gap: 18,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    minWidth: 0,
  },
  radio: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.selected,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  radioDot: {
    borderRadius: radius.full,
    height: 12,
    width: 12,
  },
  sheet: {
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  valueCell: {
    flex: 1,
    gap: 2,
  },
  values: {
    flexDirection: 'row',
    gap: spacing.lg - spacing.xxs,
  },
});
