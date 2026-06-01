import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppIcon,
  AppText,
  CompactActionRow,
  MarketMiniCard,
  ModeSwitchEntry,
  PartnerMetricCard,
  PriorityFocusCard,
  QuietAssistBar,
  Screen,
  StatusMetricTile,
  WorkspaceHeader,
  WorkspaceSummaryCard,
} from '@/src/design-public-assets/components';
import { buildWorkspaceViewModel } from '@/src/domain/workspace';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';
import { layout, radius, spacing } from '@/src/design-public-assets/tokens';

export default function WorkspaceScreen() {
  const broker = useBroker();
  const settings = useProductSettings();
  const {
    authStatus,
    colors,
    kycStatus,
    locale,
    pendingOrderDataPreset,
    positionDataPreset,
    role,
    setRole,
    t,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
  } = settings;
  const viewModel = buildWorkspaceViewModel({
    account: broker.account,
    authStatus,
    instruments: broker.instruments,
    kycStatus,
    locale,
    partnerClients: broker.partnerClients,
    pendingOrderDataPreset,
    positionDataPreset,
    positions: broker.positions,
    role,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
    upgradeRequest: broker.upgradeRequest,
  });
  const switchToTrader = () => {
    setRole('trader');
    router.push('/accounts' as never);
  };

  return (
    <Screen contentInsetBottom={spacing.md} title={t('tabs.workspace')} topBar={<WorkspaceHeader viewModel={viewModel} />}>
      <WorkspaceSummaryCard viewModel={viewModel} />
      <View style={styles.metricGrid}>
        {viewModel.metrics.map((metric) => (
          <StatusMetricTile key={metric.id} metric={metric} />
        ))}
      </View>
      <PriorityFocusCard viewModel={viewModel} />
      <View style={styles.actionStack}>
        {viewModel.actions.map((action) => (
          <CompactActionRow action={action} key={action.id} />
        ))}
      </View>
      {viewModel.modeSwitch ? <ModeSwitchEntry action={viewModel.modeSwitch} onPress={switchToTrader} /> : null}
      {viewModel.markets.length > 0 ? (
        <View style={styles.marketSection}>
          <View style={styles.sectionTitle}>
            <AppText variant="subtitle">{t('workspace.section.marketFocus')}</AppText>
            <AppText tone="dim" variant="caption">
              {t('workspace.section.lowNoise')}
            </AppText>
          </View>
          <View style={styles.marketGrid}>
            {viewModel.markets.map((market) => (
              <MarketMiniCard key={market.id} market={market} />
            ))}
          </View>
        </View>
      ) : null}
      {viewModel.segment === 'partner_mode' ? <PartnerMetricCard /> : null}
      <QuietAssistBar viewModel={viewModel} />
      <View style={StyleSheet.flatten([styles.riskNote, { backgroundColor: colors.surface.subtle }])}>
        <AppIcon name="icon.security.risk_shield" sizeVariant="xs" tone="tertiary" />
        <AppText style={styles.flex} tone="muted" variant="caption">
          {t('workspace.riskNote')}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionStack: {
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  marketGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  marketSection: {
    gap: spacing.sm,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  riskNote: {
    alignItems: 'flex-start',
    borderRadius: radius.card,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: layout.cardPaddingX,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
