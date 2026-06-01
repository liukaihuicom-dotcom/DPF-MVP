import { Screen } from '@/src/design-public-assets/components';
import { ProfileModule } from '@/src/screens/discover/DiscoverModuleScreen';
import { useProductSettings } from '@/src/design-public-assets/copy';
import type { NavigationTarget } from '@/src/navigation/navigationPolicy';
import { useBroker } from '@/src/state/BrokerStore';

export default function SettingsScreen({ backHref = '/workspace', showBack = true }: { backHref?: NavigationTarget; showBack?: boolean }) {
  const { account, role, upgradeRequest } = useBroker();
  const { t } = useProductSettings();

  return (
    <Screen align="center" back={showBack} backHref={backHref} contentInsetBottom={0} rightActions={[]} title={t('discover.module.profile.title')}>
      <ProfileModule account={account} role={role} upgradeStatus={upgradeRequest.status} />
    </Screen>
  );
}
