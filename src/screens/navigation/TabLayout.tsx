import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/src/design-public-assets/components';
import { getDiscoverModuleMeta } from '@/src/domain/discoverModules';
import { buildWorkspaceViewModel, type WorkspaceTabKey } from '@/src/domain/workspace';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';
import { lineWidth, size, titleTypography } from '@/src/design-public-assets/tokens';

export default function TabLayout() {
  const settings = useProductSettings();
  const {
    authStatus,
    colors,
    kycStatus,
    locale,
    pendingOrderDataPreset,
    positionDataPreset,
    role,
    selectedDiscoverModuleId,
    t,
    tradingAccountCountPreset,
    tradingAccountDataPreset,
    tradingAccountScenario,
    tradingAccountStatusPreset,
    tradingAccountUsageOverride,
  } = settings;
  const broker = useBroker();
  const workspace = buildWorkspaceViewModel({
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
  const visibleTabs = new Set(workspace.tabs);
  const tabVisible = (tab: WorkspaceTabKey) => (visibleTabs.has(tab) ? undefined : null);
  const selectedDiscoverModule = getDiscoverModuleMeta(selectedDiscoverModuleId);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand.fg,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarItemStyle: {
          minHeight: size.tab.itemMinHeight,
        },
        tabBarStyle: {
          backgroundColor: colors.surface.panel,
          borderTopColor: colors.border.default,
          borderTopWidth: lineWidth.hairline,
          height: size.tab.barHeight,
          paddingBottom: size.tab.paddingBottom,
          paddingTop: size.tab.paddingTop,
        },
        tabBarLabelStyle: {
          ...titleTypography.bottomTabs,
        },
      }}>
      <Tabs.Screen
        name="workspace"
        options={{
          title: t('tabs.workspace'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.navigation.function_center" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          href: tabVisible('markets'),
          title: t('tabs.markets'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.trading.market" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          href: tabVisible('trade'),
          title: t('tabs.trade'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.trading.order_ticket" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          href: tabVisible('accounts'),
          title: t('tabs.accounts'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.wallet.balance" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          href: tabVisible('discover'),
          title: t('tabs.discover'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.navigation.discover" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="quick"
        options={{
          href: tabVisible('quick'),
          title: t(`discover.module.${selectedDiscoverModuleId}.short`),
          tabBarAccessibilityLabel: `${t('tabs.status')}: ${t(`discover.module.${selectedDiscoverModuleId}.short`)}`,
          tabBarIcon: ({ focused }) => <TabBarIcon name={selectedDiscoverModule.icon} selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          href: tabVisible('learn'),
          title: t('tabs.learn'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.education.academy" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="demo"
        options={{
          href: tabVisible('demo'),
          title: t('tabs.demo'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.education.academy" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          href: tabVisible('clients'),
          title: t('tabs.clients'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.kyc.identity" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="growth"
        options={{
          href: tabVisible('growth'),
          title: t('tabs.growth'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.promotion.achievement" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          href: tabVisible('wallet'),
          title: t('tabs.wallet'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.wallet.balance" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          href: tabVisible('me'),
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.account.avatar" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen name="portfolio" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="partner-tools" options={{ href: null }} />
      <Tabs.Screen name="discover-entry" options={{ href: null }} />
    </Tabs>
  );
}
