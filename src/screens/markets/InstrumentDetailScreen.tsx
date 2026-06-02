import { router, Stack, useLocalSearchParams } from 'expo-router';

import { AppText, Screen } from '@/src/design-public-assets/components';
import { InstrumentDetailWorkspace } from '@/src/design-public-assets/business-components';
import { useToast } from '@/src/feedback/Toast';
import { impactLight } from '@/src/feedback/haptics';
import { navigateBackOrReplace, safeRouteTargets } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { useBroker } from '@/src/state/BrokerStore';

export default function InstrumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findInstrument } = useBroker();
  const { colors, locale, t } = useProductSettings();
  const toast = useToast();
  const instrument = findInstrument(id);

  if (!instrument) {
    return (
      <Screen back backHref="/markets" title={t('common.invalidInstrument')}>
        <AppText variant="title">{t('common.invalidInstrument')}</AppText>
      </Screen>
    );
  }

  const showPlaceholder = (action: string) => {
    void impactLight();
    toast.show({
      message: t('top.placeholderMessage'),
      title: t('top.placeholderTitle', { action }),
    });
  };
  const openOrder = (direction: 'buy' | 'sell') => {
    void impactLight();
    router.push(`/order/${instrument.id}?direction=${direction}` as never);
  };

  return (
    <>
      <Stack.Screen options={{ title: instrument.symbol }} />
      <InstrumentDetailWorkspace
        colors={colors}
        instrument={instrument}
        locale={locale}
        onBack={() => {
          void impactLight();
          navigateBackOrReplace(safeRouteTargets.markets);
        }}
        onBuy={() => openOrder('buy')}
        onSecondaryAction={showPlaceholder}
        onSell={() => openOrder('sell')}
        t={t}
      />
    </>
  );
}
