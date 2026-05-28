import { type ComponentProps, type ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import type { Direction } from '@/src/domain/types';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { lineWidth, layout, size, spacing } from '@/src/theme/tokens';

import { AppIcon } from './AppIcon';
import { Card } from './Card';
import { NativePressable } from './NativePressable';
import { TradeDirectionIcon } from './TradeDirectionIcon';
import { AppText, type AppTextTone } from './Typography';

export type TradeOrderListRow = {
  accessibilityLabel: string;
  direction: Direction;
  id: string;
  meta: string;
  onPress?: () => void;
  quantityLabel: string;
  rightMeta?: ReactNode;
  rightTone?: AppTextTone;
  rightValue: string;
  showDisclosure?: boolean;
  symbol: string;
};

type TradeOrderListProps = {
  iconSizeVariant?: ComponentProps<typeof TradeDirectionIcon>['sizeVariant'];
  rows: TradeOrderListRow[];
  rowMinTouch?: number;
  style?: ViewStyle;
};

export function TradeOrderList({
  iconSizeVariant = 'md',
  rows,
  rowMinTouch = 64,
  style,
}: TradeOrderListProps) {
  const { colors } = useProductSettings();

  return (
    <Card compact style={StyleSheet.flatten([styles.card, style])}>
      {rows.map((row, index) => (
        <NativePressable
          accessibilityLabel={row.accessibilityLabel}
          accessibilityRole="button"
          disabled={!row.onPress}
          key={row.id}
          minTouch={rowMinTouch}
          onPress={row.onPress}
          style={StyleSheet.flatten([
            styles.row,
            index < rows.length - 1 && {
              borderBottomColor: colors.border.subtle,
              borderBottomWidth: lineWidth.hairline,
            },
          ])}
        >
          <TradeDirectionIcon direction={row.direction} sizeVariant={iconSizeVariant} />
          <View style={styles.main}>
            <View style={styles.titleRow}>
              <AppText numberOfLines={1} variant="subtitle">
                {row.symbol}
              </AppText>
              <AppText
                numberOfLines={1}
                tone={row.direction === 'buy' ? 'up' : 'down'}
                variant="subtitle"
              >
                {row.quantityLabel}
              </AppText>
            </View>
            <AppText numberOfLines={1} tone="muted" variant="caption">
              {row.meta}
            </AppText>
          </View>
          <View style={styles.side}>
            <AppText
              adjustsFontSizeToFit
              numberOfLines={1}
              tone={row.rightTone}
              variant="number"
            >
              {row.rightValue}
            </AppText>
            {row.rightMeta}
          </View>
          {row.showDisclosure ? (
            <AppIcon
              name="icon.system.chevron_right"
              size={layout.menuDisclosureIconSize}
              tone="tertiary"
            />
          ) : null}
        </NativePressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingBottom: spacing.none,
    paddingHorizontal: layout.cardPaddingX,
    paddingTop: spacing.none,
  },
  main: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
    minWidth: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  side: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    maxWidth: size.viewport.detailSideMaxWidth,
    minWidth: size.viewport.detailSideMinWidth,
  },
  titleRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
