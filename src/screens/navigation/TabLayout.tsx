import { Tabs } from 'expo-router';

import type { AppIconName } from '@/src/design-public-assets/components';
import { TabBarIcon } from '@/src/design-public-assets/components';
import type { DiscoverModuleId } from '@/src/domain/types';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { lineWidth, size, titleTypography } from '@/src/design-public-assets/tokens';

export default function TabLayout() {
  const { colors, selectedDiscoverModuleId, t } = useProductSettings();
  const selectedModule = getDiscoverModuleMeta(selectedDiscoverModuleId);

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
        name="markets"
        options={{
          title: t('tabs.markets'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.trading.market" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: t('tabs.trade'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.trading.order_ticket" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: t('tabs.accounts'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.wallet.balance" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t('tabs.discover'),
          tabBarIcon: ({ focused }) => <TabBarIcon name="icon.navigation.discover" selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen
        name="quick"
        options={{
          title: t(`discover.module.${selectedDiscoverModuleId}.short`),
          tabBarAccessibilityLabel: `${t('tabs.status')}: ${t(`discover.module.${selectedDiscoverModuleId}.short`)}`,
          tabBarIcon: ({ focused }) => <TabBarIcon name={selectedModule.icon} selected={focused} tone={focused ? colors.brand.fg : 'textDim'} />,
        }}
      />
      <Tabs.Screen name="portfolio" options={{ href: null }} />
      <Tabs.Screen name="account" options={{ href: null }} />
      <Tabs.Screen name="partner-tools" options={{ href: null }} />
    </Tabs>
  );
}

function getDiscoverModuleMeta(moduleId: DiscoverModuleId) {
  const iconByModule: Record<DiscoverModuleId, AppIconName> = {
    accounts: 'icon.account.trading',
    challenge: 'icon.promotion.achievement',
    community: 'icon.copy.community',
    education: 'icon.education.academy',
    markets: 'icon.trading.market',
    onboarding: 'icon.kyc.identity',
    partner: 'icon.ib.network',
    profile: 'icon.account.avatar',
    rewards: 'icon.promotion.reward',
    support: 'icon.support.headset',
  };

  return {
    icon: iconByModule[moduleId],
  };
}
