import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, layout, radius, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from './AppIcon';
import { Card } from './Card';
import { SwitchControl } from './forms/SwitchControl';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

type GlobalMenuListAccessory =
  | {
      accessibilityLabel?: string;
      onValueChange: (value: boolean) => void;
      type: 'switch';
      value: boolean;
    }
  | {
      type: 'value';
      value: string;
    }
  | {
      count?: number;
      type: 'rating';
    };

export type GlobalMenuListItem = {
  accessory?: GlobalMenuListAccessory;
  accessibilityLabel?: string;
  description?: string;
  icon: AppIconName;
  label: string;
  onPress?: () => void;
  tone?: 'default' | 'danger';
};

type GlobalMenuListProps = {
  items: GlobalMenuListItem[];
  contained?: boolean;
  showChevron?: boolean;
  variant?: 'navigation' | 'descriptive';
};

export function GlobalMenuList({ contained, items, showChevron = true, variant = 'navigation' }: GlobalMenuListProps) {
  const colors = useThemeColors();
  const content = (
    <View style={StyleSheet.flatten([styles.list, contained && styles.containedList, contained && { borderColor: colors.border.subtle }])}>
      {items.map((item, index) => {
        const isDanger = item.tone === 'danger';
        const iconTone = isDanger ? 'danger' : 'primary';
        const textTone = isDanger ? 'danger' : 'default';

        return (
          <NativePressable
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            key={item.label}
            minTouch={layout.menuRowMinTouch}
            onPress={item.onPress}
            style={StyleSheet.flatten([
              styles.row,
              variant === 'descriptive' && styles.descriptiveRow,
              index < items.length - 1 && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline },
            ])}>
            <View style={styles.rowLeft}>
              <AppIcon name={item.icon} sizeVariant="md" tone={iconTone} />
              <View style={styles.rowText}>
                <AppText numberOfLines={1} tone={textTone} variant="buttonMd">
                  {item.label}
                </AppText>
                {item.description ? (
                  <AppText numberOfLines={2} tone="muted" variant="caption">
                    {item.description}
                  </AppText>
                ) : null}
              </View>
            </View>
            <GlobalMenuListRight accessory={item.accessory} label={item.label} showChevron={showChevron} />
          </NativePressable>
        );
      })}
    </View>
  );

  if (contained) {
    return <View style={styles.container}>{content}</View>;
  }

  return <Card compact>{content}</Card>;
}

function GlobalMenuListRight({
  accessory,
  label,
  showChevron,
}: {
  accessory?: GlobalMenuListAccessory;
  label: string;
  showChevron: boolean;
}) {
  if (accessory?.type === 'switch') {
    return (
      <View style={styles.switchAccessory} pointerEvents="box-only">
        <SwitchControl
          accessibilityLabel={accessory.accessibilityLabel ?? label}
          onValueChange={accessory.onValueChange}
          value={accessory.value}
        />
      </View>
    );
  }

  if (accessory?.type === 'rating') {
    const count = accessory.count ?? 5;

    return (
      <View style={styles.ratingAccessory}>
        {Array.from({ length: count }).map((_, index) => (
          <AppIcon key={index} name="icon.feedback.rating" size={layout.menuDisclosureIconSize} styleVariant="fill" tone="tertiary" />
        ))}
        {showChevron ? <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" /> : null}
      </View>
    );
  }

  if (accessory?.type === 'value') {
    return (
      <View style={styles.valueAccessory}>
        <AppText numberOfLines={1} tone="muted" variant="body.secondary">
          {accessory.value}
        </AppText>
        {showChevron ? <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" /> : null}
      </View>
    );
  }

  return showChevron ? <AppIcon name="icon.system.chevron_right" size={layout.menuDisclosureIconSize} tone="tertiary" /> : null;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    overflow: 'hidden',
  },
  descriptiveRow: {
    gap: layout.controlGap,
    minHeight: layout.menuDescriptiveRowMinHeight,
    paddingVertical: layout.listRowPaddingY,
  },
  list: {
    overflow: 'hidden',
  },
  containedList: {
    paddingHorizontal: layout.listRowPaddingX,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: layout.menuRowMinHeight,
  },
  rowLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: layout.menuRowGap,
    minWidth: 0,
  },
  rowText: {
    flex: 1,
    gap: layout.menuRowTextGap,
    minWidth: 0,
  },
  ratingAccessory: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  switchAccessory: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueAccessory: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing.xs,
    justifyContent: 'flex-end',
    maxWidth: '48%',
  },
});
