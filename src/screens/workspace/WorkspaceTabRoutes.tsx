import { PartnerCommissionRoute } from '@/src/screens/accounts/AccountScreen';
import DiscoverModuleScreen from '@/src/screens/discover/DiscoverModuleScreen';
import PartnerToolsScreen from '@/src/screens/discover/PartnerToolsScreen';
import { PartnerClientOrdersRoute } from '@/src/screens/portfolio/PortfolioScreen';
import SettingsScreen from '@/src/screens/settings/SettingsScreen';

export function LearnRoute() {
  return <DiscoverModuleScreen moduleIdOverride="education" />;
}

export function DemoRoute() {
  return <DiscoverModuleScreen moduleIdOverride="challenge" />;
}

export function ClientsRoute() {
  return <PartnerClientOrdersRoute />;
}

export function GrowthRoute() {
  return <PartnerToolsScreen />;
}

export function WalletRoute() {
  return <PartnerCommissionRoute />;
}

export function MeRoute() {
  return <SettingsScreen showBack={false} />;
}
