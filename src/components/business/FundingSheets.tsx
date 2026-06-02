import { StyleSheet, View } from 'react-native';

import type { FundingMethodType, FundingPaymentMethod } from '@/src/domain/funding';
import { localizeText } from '@/src/domain/format';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { radius, spacing } from '@/src/theme/tokens';

import { FinancialMethodRow } from './FinancialPagePatterns';
import { AppText } from '../Typography';

export type PaymentMethodSheetProps = {
  methods: FundingPaymentMethod[];
  onSelect: (id: string) => void;
  selectedId: string;
};

export function PaymentMethodSheet({ methods, onSelect, selectedId }: PaymentMethodSheetProps) {
  const { t } = useProductSettings();
  const groups: FundingMethodType[] = ['virtual_account', 'bank_transfer', 'e_wallet'];

  return (
    <View style={styles.sheet}>
      {groups.map((type) => {
        const rows = methods.filter((method) => method.type === type);

        if (rows.length === 0) {
          return null;
        }

        return (
          <View key={type} style={styles.group}>
            <AppText tone="muted" variant="subtitle">
              {methodTypeText(type, t)} ({rows.length})
            </AppText>
            {rows.map((method) => (
              <PaymentMethodRow
                key={method.id}
                method={method}
                onPress={() => onSelect(method.id)}
                selected={method.id === selectedId}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

function PaymentMethodRow({ method, onPress, selected }: { method: FundingPaymentMethod; onPress: () => void; selected: boolean }) {
  const { locale, t } = useProductSettings();
  const disabled = !method.available;
  const helper = disabled && method.maintenanceNote ? localizeText(method.maintenanceNote, locale) : t('funding.method.estimated', { minutes: method.estimatedMinutes });

  return (
    <FinancialMethodRow
      disabled={disabled}
      helper={helper}
      icon={method.icon}
      label={localizeText(method.label, locale)}
      onPress={onPress}
      selected={selected}
      statusLabel={disabled ? t('funding.method.unavailable') : t('status.active')}
      statusTone={disabled ? 'warning' : 'success'}
    />
  );
}

function methodTypeText(type: FundingMethodType, t: ReturnType<typeof useProductSettings>['t']) {
  return t(`funding.method.type.${type}`);
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  sheet: {
    borderRadius: radius.none,
    gap: spacing.lg,
  },
});
