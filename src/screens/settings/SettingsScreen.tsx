import { Screen } from '@/src/components/Screen';
import { ProfileModule } from '@/src/screens/discover/DiscoverModuleScreen';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { useBroker } from '@/src/state/BrokerStore';

export default function SettingsScreen() {
  const { account, role, upgradeRequest } = useBroker();
  const { t } = useProductSettings();

  return (
    <Screen align="center" back backHref="/accounts" contentInsetBottom={12} rightActions={[]} title={t('discover.module.profile.title')}>
      <ProfileModule account={account} role={role} upgradeStatus={upgradeRequest.status} />
    </Screen>
  );
}
