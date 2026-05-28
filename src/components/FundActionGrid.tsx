import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getFundingOperationActions, type FundingOperation, type FundingOperationTone } from '@/src/domain/funding';
import type { TranslationKey } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import type { AppIconName } from './AppIcon';
import { IconSurface, type IconSurfaceTone } from './IconSurface';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type FundActionTone = FundingOperationTone | 'blue' | 'up' | 'brand';

export type FundActionGridItem = {
  accessibilityLabel?: string;
  href?: Href;
  icon: AppIconName;
  label: string;
  onPress?: () => void;
  operation?: FundingOperation;
  tone: FundActionTone;
};

type FundActionGridProps = {
  accountId?: string;
  items?: FundActionGridItem[];
};

export function FundActionGrid({ accountId, items }: FundActionGridProps) {
  const { colors, t } = useProductSettings();
  const actionItems = items ?? getDefaultFundActions(t, accountId);
  const iconToneByTone: Record<FundActionTone, IconSurfaceTone> = {
    blue: 'info',
    brand: 'brand',
    deposit: 'success',
    transfer: 'info',
    up: 'up',
    withdraw: 'warning',
  };

  return (
    <View style={styles.grid}>
      {actionItems.map((item) => {
        const onPress = item.onPress ?? (item.href ? () => router.push(item.href as never) : undefined);

        return (
          <NativePressable
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            key={item.label}
            minTouch={72}
            onPress={onPress}
            style={StyleSheet.flatten([styles.tile, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
            <IconSurface background="hidden" icon={item.icon} sizeVariant="md" tone={iconToneByTone[item.tone]} />
            <AppText numberOfLines={1} variant="buttonMd">
              {item.label}
            </AppText>
          </NativePressable>
        );
      })}
    </View>
  );
}

export function getDefaultFundActions(t: (key: TranslationKey) => string, accountId?: string): FundActionGridItem[] {
  return getFundingOperationActions(t, accountId);
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexBasis: '30%',
    flexGrow: 1,
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: size.control.lg + size.icon.sm,
    minWidth: size.control.lg + size.control.sm,
    padding: spacing.sm,
  },
});
