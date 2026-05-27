import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { bottomSheetPresets, useBottomSheet } from '@/src/components/BottomSheet';
import { Card } from '@/src/components/Card';
import { CurrencyFlag } from '@/src/components/CurrencyFlag';
import { FeaturedInstrumentCard } from '@/src/components/FeaturedInstrumentCard';
import { InstrumentRow } from '@/src/components/InstrumentRow';
import { NativePressable } from '@/src/components/NativePressable';
import { AppIcon } from '@/src/components/AppIcon';
import { Screen } from '@/src/components/Screen';
import { SegmentedTabs } from '@/src/components/SegmentedTabs';
import { TextField } from '@/src/components/TextField';
import { createTradingAccountSwitchHeader, TradingAccountSwitchSheet } from '@/src/components/TradingAccountSwitchSheet';
import { AppText } from '@/src/components/Typography';
import { getAccountStatusLabel } from '@/src/domain/accountProfiles';
import { formatCompactMoney, formatMoney, localizeText } from '@/src/domain/format';
import { buildSharedTradingAccountProfiles } from '@/src/domain/tradingAccountView';
import type { Instrument, InstrumentAssetClass } from '@/src/domain/types';
import { useToast } from '@/src/feedback/Toast';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, typography } from '@/src/theme/tokens';

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

  return (
    <Screen
      rightActions={[
        { icon: 'icon.notification.bell', label: t('top.notifications') },
        { icon: 'icon.support.headset', label: t('top.support') },
      ]}
      title="Dupoin">
      <AccountMiniCard account={account} positions={positions} />

      <FeaturedMarketCards instruments={instruments} />

      <MarketList instruments={instruments} />
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

function AccountMiniCard({ account, positions }: { account: ReturnType<typeof useBroker>['account']; positions: ReturnType<typeof useBroker>['positions'] }) {
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
  const statusLabel = getAccountStatusLabel(selectedAccount.group, locale);
  const showAddAccountFeedback = () => {
    toast.show({
      message: locale !== 'zh-CN' ? 'Action unavailable. No account was created.' : '当前操作暂不可用，未创建新账户。',
      title: locale !== 'zh-CN' ? 'Add Account' : '添加账户',
    });
  };
  const openAccountPicker = () => {
    bottomSheet.show(bottomSheetPresets.selection({
      ...createTradingAccountSwitchHeader({
        locale,
        onAddAccount: showAddAccountFeedback,
        title: locale !== 'zh-CN' ? 'Switch Trading Account' : '切换交易账号',
      }),
      content: (
        <TradingAccountSwitchSheet
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
    { label: t('account.equity'), value: formatMoney(selectedAccount.equity, selectedAccount.currency, 0, locale) },
    {
      label: t('portfolio.unrealizedPnl'),
      tone: selectedAccount.unrealizedPnl >= 0 ? ('down' as const) : ('up' as const),
      value: formatMoney(selectedAccount.unrealizedPnl, selectedAccount.currency, 0, locale),
    },
    { label: t('account.availableMargin'), value: formatCompactMoney(selectedAccount.freeMargin, selectedAccount.currency, locale) },
  ];

  return (
    <Card compact style={styles.accountCard}>
      <View style={styles.accountCardHeader}>
        <NativePressable accessibilityLabel={locale !== 'zh-CN' ? 'Switch Trading Account' : '切换交易账号'} minTouch={40} onPress={openAccountPicker} style={styles.accountSwitcher}>
          <View style={StyleSheet.flatten([styles.accountAvatar, { backgroundColor: colors.surface.subtle }])}>
            <AppIcon name="icon.account.trading" sizeVariant="sm" />
          </View>
          <View style={styles.accountIdentity}>
            <AppText numberOfLines={1} variant="subtitle">
              {locale !== 'zh-CN' ? `Trading account ${selectedAccount.accountNo}` : `交易账号 ${selectedAccount.accountNo}`}
            </AppText>
            <View style={styles.accountMetaRow}>
              <CurrencyFlag currency={selectedAccount.currency} size={18} />
              <AppText numberOfLines={1} style={styles.accountMetaText} tone="muted" variant="caption">
                {selectedAccount.currency} · {statusLabel}
              </AppText>
            </View>
          </View>
          <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
        </NativePressable>
      </View>

      <View style={styles.accountMetrics}>
        {metrics.map((metric, index) => (
          <View key={metric.label} style={StyleSheet.flatten([styles.accountMetric, index > 0 && { borderLeftColor: colors.border.subtle, borderLeftWidth: lineWidth.hairline }])}>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {metric.label}
            </AppText>
            <AppText adjustsFontSizeToFit numberOfLines={1} tone={metric.tone} variant="number">
              {metric.value}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

function MarketList({ instruments }: { instruments: Instrument[] }) {
  const { locale, colors, t } = useProductSettings();
  const [selectedTab, setSelectedTab] = useState<MarketTabKey>('watchlist');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const closeSearch = () => {
    setSearchQuery('');
    setSearchOpen(false);
  };
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
      <View style={styles.marketToolbar}>
        {searchOpen ? (
          <View style={styles.marketSearchShell}>
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
              onChangeText={setSearchQuery}
              placeholder={t('markets.search')}
              returnKeyType="search"
              shellStyle={StyleSheet.flatten([styles.marketSearchExpanded, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}
              value={searchQuery}
            />
            <NativePressable
              accessibilityLabel={t('common.cancel')}
              accessibilityRole="button"
              minTouch={38}
              onPress={closeSearch}
              style={StyleSheet.flatten([styles.marketSearchClose, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
              <AppIcon name="icon.system.close" sizeVariant="xs" />
            </NativePressable>
          </View>
        ) : (
          <>
            <SegmentedTabs
              containerStyle={styles.marketTabsRail}
              items={marketTabs.map((tab) => ({
                accessibilityLabel: t(tab.labelKey),
                label: t(tab.labelKey),
                value: tab.key,
              }))}
              onValueChange={setSelectedTab}
              scrollable
              style={styles.marketTabs}
              value={selectedTab}
              variant="pill"
            />
            <NativePressable
              accessibilityLabel={t('markets.search')}
              accessibilityRole="button"
              minTouch={38}
              onPress={() => setSearchOpen(true)}
              style={StyleSheet.flatten([styles.marketSearchTrigger, { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle }])}>
              <AppIcon name="icon.system.search" sizeVariant="sm" />
            </NativePressable>
          </>
        )}
      </View>

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

const styles = StyleSheet.create({
  accountAvatar: {
    alignItems: 'center',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  accountCard: {
    gap: 8,
    padding: 10,
  },
  accountCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  accountIdentity: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  accountMetric: {
    flex: 1,
    gap: 2,
    minHeight: 42,
    minWidth: 0,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  accountMetrics: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  accountMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    minWidth: 0,
  },
  accountMetaText: {
    flex: 1,
    minWidth: 0,
  },
  accountSwitcher: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minWidth: 0,
  },
  featuredRail: {
    gap: 10,
    paddingRight: 12,
  },
  featuredSection: {
    gap: 8,
  },
  emptyMarketRows: {
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 72,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  marketBoard: {
    gap: 12,
  },
  marketRows: {
    gap: 0,
  },
  marketSearchClose: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: lineWidth.hairline,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  marketSearchExpanded: {
    borderRadius: 999,
    gap: 6,
    height: 38,
    minHeight: 38,
    paddingHorizontal: 11,
  },
  marketSearchField: {
    flex: 1,
    minWidth: 0,
  },
  marketSearchInput: {
    flex: 1,
    ...typography.microLabel,
    minWidth: 0,
    padding: 0,
  },
  marketSearchShell: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minWidth: 0,
  },
  marketSearchTrigger: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: lineWidth.hairline,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  marketTabs: {
    paddingRight: 8,
  },
  marketTabsRail: {
    flex: 1,
    minWidth: 0,
  },
  marketToolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
