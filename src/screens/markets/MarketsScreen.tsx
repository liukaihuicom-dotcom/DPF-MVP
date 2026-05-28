import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { bottomSheetPresets, useBottomSheet } from '@/src/design-public-assets/components';
import { Card } from '@/src/design-public-assets/components';
import { FeaturedInstrumentCard } from '@/src/design-public-assets/components';
import { InstrumentRow } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { AppIcon } from '@/src/design-public-assets/components';
import { createTradingAccountContextSwitcherHeader, TradingAccountContextSwitcher } from '@/src/design-public-assets/business-components';
import { Screen } from '@/src/design-public-assets/components';
import { SegmentedTabs } from '@/src/design-public-assets/components';
import { TextField } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import type { AppTextTone } from '@/src/design-public-assets/components';
import { getAccountStatusLabel } from '@/src/domain/accountProfiles';
import { formatMoney, localizeText } from '@/src/domain/format';
import { buildSharedTradingAccountProfiles } from '@/src/domain/tradingAccountView';
import type { Instrument, InstrumentAssetClass } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';
import { layout, lineWidth, radius, size, spacing, typography } from '@/src/design-public-assets/tokens';

type MarketTabKey = 'watchlist' | InstrumentAssetClass;

const marketTabs: { key: MarketTabKey; labelKey: 'markets.tab.watchlist' | 'markets.tab.forex' | 'markets.tab.metals' | 'markets.tab.futures' | 'markets.tab.stocks' }[] = [
  { key: 'watchlist', labelKey: 'markets.tab.watchlist' },
  { key: 'forex', labelKey: 'markets.tab.forex' },
  { key: 'metals', labelKey: 'markets.tab.metals' },
  { key: 'futures', labelKey: 'markets.tab.futures' },
  { key: 'stocks', labelKey: 'markets.tab.stocks' },
];

const featuredInstrumentIds = ['eur-usd', 'gbp-usd', 'usd-jpy', 'xau-usd', 'us30'] as const;

export default function HomeScreen() {
  const { account, instruments, positions } = useBroker();
  const { t } = useProductSettings();
  const [amountsVisible, setAmountsVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState<MarketTabKey>(() => resolveInitialMarketTab(instruments));
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const closeSearch = () => {
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <Screen
      rightActions={[
        { icon: 'icon.system.search', label: t('markets.search'), onPress: () => setSearchOpen(true) },
      ]}
      title={t('brand.name')}>
      <AccountMiniCard account={account} amountsVisible={amountsVisible} onToggleAmountsVisible={() => setAmountsVisible((visible) => !visible)} positions={positions} />

      {searchOpen ? (
        <View style={styles.marketSearchShell}>
          <MarketSearchInput onCancel={closeSearch} onChangeText={setSearchQuery} searchQuery={searchQuery} />
        </View>
      ) : null}

      <MarketTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <MarketList instruments={instruments} normalizedQuery={normalizedQuery} selectedTab={selectedTab} />

      <FeaturedMarketCards instruments={instruments} />
    </Screen>
  );
}

function FeaturedMarketCards({ instruments }: { instruments: Instrument[] }) {
  const featuredInstruments = useMemo(
    () =>
      featuredInstrumentIds
        .map((instrumentId) => instruments.find((instrument) => instrument.id === instrumentId))
        .filter((instrument): instrument is Instrument => Boolean(instrument))
        .slice(0, 5),
    [instruments],
  );

  if (!featuredInstruments.length) {
    return null;
  }

  return (
    <View style={styles.featuredSection}>
      <ScrollView contentContainerStyle={styles.featuredRail} horizontal showsHorizontalScrollIndicator={false}>
        {featuredInstruments.map((instrument) => (
          <FeaturedInstrumentCard instrument={instrument} key={instrument.id} />
        ))}
      </ScrollView>
    </View>
  );
}

function AccountMiniCard({
  account,
  amountsVisible,
  onToggleAmountsVisible,
  positions,
}: {
  account: ReturnType<typeof useBroker>['account'];
  amountsVisible: boolean;
  onToggleAmountsVisible: () => void;
  positions: ReturnType<typeof useBroker>['positions'];
}) {
  const {
    locale,
    colors,
    selectedTradingAccountId,
    setSelectedTradingAccountId,
    t,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
  } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const toast = useToast();
  const accounts = useMemo(
    () =>
      buildSharedTradingAccountProfiles(account, positions, tradingAccountScenario, {
        countPreset: tradingAccountCountPreset,
        dataPreset: tradingAccountDataPreset,
        statusPreset: tradingAccountStatusPreset,
      }),
    [account, positions, tradingAccountCountPreset, tradingAccountDataPreset, tradingAccountScenario, tradingAccountStatusPreset],
  );
  const selectedAccount = accounts.find((profile) => profile.id === selectedTradingAccountId) ?? accounts[0];
  const accountStatusLabel = getAccountStatusLabel(selectedAccount.group, locale);
  const shouldShowAccountException = selectedAccount.group !== 'active' && selectedAccount.group !== 'demo';
  const showAddAccountFeedback = () => {
    toast.show({
      message: t('common.demoActionNoAccount'),
      title: t('account.addAccount'),
    });
  };
  const openAccountPicker = () => {
    bottomSheet.show(bottomSheetPresets.selection({
      ...createTradingAccountContextSwitcherHeader({
        locale,
        onAddAccount: showAddAccountFeedback,
        title: t('funding.account.switchTitle'),
      }),
      content: (
        <TradingAccountContextSwitcher
          accounts={accounts}
          mode="detailed"
          onSelect={(nextId) => {
            setSelectedTradingAccountId(nextId);
            bottomSheet.hide();
          }}
          selectedId={selectedAccount.id}
        />
      ),
    }));
  };
  const metrics = [
    { label: t('account.equity'), value: amountsVisible ? formatMoney(selectedAccount.equity, selectedAccount.currency, 0, locale) : '••••••' },
    {
      label: t('portfolio.unrealizedPnl'),
      tone: amountsVisible ? signedValueTone(selectedAccount.unrealizedPnl) : ('muted' as const),
      value: amountsVisible ? formatMoney(selectedAccount.unrealizedPnl, selectedAccount.currency, 0, locale) : '••••',
    },
  ];

  return (
    <View style={StyleSheet.flatten([styles.accountStrip, { backgroundColor: colors.surface.panel }])}>
      <NativePressable accessibilityLabel={t('funding.account.accessibilitySwitch')} minTouch={size.iconSurface.xs} onPress={openAccountPicker} style={styles.accountSwitcher}>
        <AppText numberOfLines={1} style={styles.accountTitle} variant="label.control">
          {t('markets.account.current', { accountNo: selectedAccount.accountNo })}
        </AppText>
        {shouldShowAccountException ? (
          <View style={StyleSheet.flatten([styles.accountStatusPill, { backgroundColor: colors.status.warning.bg, borderColor: colors.status.warning.border }])}>
            <AppText numberOfLines={1} tone="amber" variant="caption">
              {accountStatusLabel}
            </AppText>
          </View>
        ) : null}
        <AppIcon name="icon.system.chevron_down" sizeVariant="xs" tone="tertiary" />
      </NativePressable>
      <NativePressable
        accessibilityLabel={amountsVisible ? t('markets.account.hideAmounts') : t('markets.account.showAmounts')}
        minTouch={size.iconSurface.xs}
        onPress={onToggleAmountsVisible}
        style={StyleSheet.flatten([styles.accountAmountToggle, { backgroundColor: colors.surface.subtle }])}>
        <AppIcon name={amountsVisible ? 'icon.account.amount_visible' : 'icon.account.amount_hidden'} sizeVariant="xs" tone="tertiary" />
      </NativePressable>

      <View style={styles.accountMetrics}>
        {metrics.map((metric, index) => (
          <View key={metric.label} style={StyleSheet.flatten([styles.accountMetric, index > 0 && styles.accountMetricEnd])}>
            <AppText numberOfLines={1} tone={metric.tone} variant="title.listItem">
              {metric.value}
            </AppText>
            <AppText numberOfLines={1} tone="muted" variant="label.metadata">
              {metric.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function MarketTabs({ selectedTab, setSelectedTab }: { selectedTab: MarketTabKey; setSelectedTab: (tab: MarketTabKey) => void }) {
  const { t } = useProductSettings();

  return (
    <View style={styles.marketTabsBlock}>
      <SegmentedTabs
        items={marketTabs.map((tab) => ({
          accessibilityLabel: t(tab.labelKey),
          label: t(tab.labelKey),
          value: tab.key,
        }))}
        onValueChange={setSelectedTab}
        scrollable
        value={selectedTab}
        variant="pill"
      />
    </View>
  );
}

function MarketSearchInput({ onCancel, onChangeText, searchQuery }: { onCancel: () => void; onChangeText: (value: string) => void; searchQuery: string }) {
  const { colors, t } = useProductSettings();

  return (
    <>
      <TextField
        accessibilityLabel={t('markets.search')}
        autoCapitalize="characters"
        autoCorrect={false}
        autoFocus
        containerStyle={styles.marketSearchField}
        icon="icon.system.search"
        inputStyle={styles.marketSearchInput}
        label={t('markets.search')}
        labelHidden
        onChangeText={onChangeText}
        placeholder={t('markets.onboarding.searchHint')}
        returnKeyType="search"
        shellStyle={StyleSheet.flatten([styles.marketSearchExpanded, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}
        value={searchQuery}
      />
      <NativePressable
        accessibilityLabel={t('common.cancel')}
        accessibilityRole="button"
        minTouch={layout.headerIconButtonSize}
        onPress={onCancel}
        style={StyleSheet.flatten([styles.marketSearchClose, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
        <AppIcon name="icon.system.close" sizeVariant="xs" />
      </NativePressable>
    </>
  );
}

function MarketList({ instruments, normalizedQuery, selectedTab }: { instruments: Instrument[]; normalizedQuery: string; selectedTab: MarketTabKey }) {
  const { locale, colors, t } = useProductSettings();
  const filteredInstruments = useMemo(() => {
    const tabInstruments =
      selectedTab === 'watchlist' ? instruments.filter((instrument) => instrument.favorite) : instruments.filter((instrument) => instrument.assetClass === selectedTab);

    if (!normalizedQuery) {
      return tabInstruments;
    }

    return tabInstruments.filter((instrument) => {
      const localizedName = localizeText(instrument.name, locale).toLowerCase();
      const searchable = [instrument.symbol, instrument.baseCurrency, instrument.quoteCurrency, localizedName].join(' ').toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [instruments, locale, normalizedQuery, selectedTab]);

  return (
    <Card compact style={styles.marketBoard}>
      <View style={styles.marketRows}>
        {filteredInstruments.length > 0 ? (
          filteredInstruments.map((instrument, index) => (
            <InstrumentRow instrument={instrument} key={instrument.id} showDivider={index < filteredInstruments.length - 1} />
          ))
        ) : (
          <View style={StyleSheet.flatten([styles.emptyMarketRows, { backgroundColor: colors.surface.subtle }])}>
            <AppText tone="muted" variant="caption">
              {t('markets.empty')}
            </AppText>
          </View>
        )}
      </View>
    </Card>
  );
}

function resolveInitialMarketTab(instruments: Instrument[]): MarketTabKey {
  return instruments.some((instrument) => instrument.favorite) ? 'watchlist' : 'forex';
}

function signedValueTone(value: number): AppTextTone {
  if (value > 0) {
    return 'up';
  }

  if (value < 0) {
    return 'down';
  }

  return 'default';
}

const styles = StyleSheet.create({
  accountAvatar: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: size.iconSurface.xs,
    justifyContent: 'center',
    width: size.iconSurface.xs,
  },
  accountStatusPill: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    paddingHorizontal: spacing.xs,
    paddingVertical: lineWidth.strong,
  },
  accountStrip: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  accountIdentity: {
    flex: 1,
    gap: lineWidth.strong,
    minWidth: 0,
  },
  accountMetric: {
    flex: 1,
    gap: lineWidth.strong,
    minWidth: 0,
  },
  accountMetricEnd: {
    alignItems: 'flex-end',
  },
  accountMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  accountSwitcher: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    maxWidth: '100%',
    minWidth: 0,
  },
  accountAmountToggle: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: size.iconSurface.xs,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    width: size.iconSurface.xs,
  },
  accountTitle: {
    flexShrink: 1,
    minWidth: 0,
  },
  featuredRail: {
    gap: spacing.sm + spacing.xxs,
    paddingRight: spacing.md,
  },
  featuredSection: {
    gap: spacing.xs,
  },
  emptyMarketRows: {
    alignItems: 'center',
    borderRadius: radius.card,
    minHeight: spacing.section + spacing.xl,
    justifyContent: 'center',
    paddingHorizontal: radius.lg,
  },
  marketBoard: {
    gap: spacing.none,
    paddingVertical: spacing.none,
  },
  marketRows: {
    gap: spacing.none,
  },
  marketSearchClose: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.control.sm - spacing.xxs,
    justifyContent: 'center',
    width: size.control.sm - spacing.xxs,
  },
  marketSearchExpanded: {
    borderRadius: radius.full,
    gap: spacing.xs + spacing.xxs,
    height: size.control.sm - spacing.xxs,
    minHeight: size.control.sm - spacing.xxs,
    paddingHorizontal: spacing.sm + spacing.xxs + lineWidth.strong,
  },
  marketSearchField: {
    flex: 1,
    minWidth: 0,
  },
  marketSearchInput: {
    flex: 1,
    ...typography.microLabel,
    minWidth: 0,
    padding: spacing.none,
  },
  marketSearchShell: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  marketTabsBlock: {
    gap: spacing.xs,
  },
});
