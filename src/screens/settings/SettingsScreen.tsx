import { Screen } from '@/src/design-public-assets/components';
import { ProfileModule } from '@/src/screens/discover/DiscoverModuleScreen';
import { useProductSettings } from '@/src/design-public-assets/copy';
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
