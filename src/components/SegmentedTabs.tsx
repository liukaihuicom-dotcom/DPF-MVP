import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

export type SegmentedTabItem<T extends string> = {
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  value: T;
};

export type SegmentedTabsVariant = 'pill' | 'underline';
export type SegmentedTabsLabelSize = 'default' | 'large';

type SegmentedTabsProps<T extends string> = {
  containerStyle?: StyleProp<ViewStyle>;
  equalWidth?: boolean;
  items: SegmentedTabItem<T>[];
  labelSize?: SegmentedTabsLabelSize;
  onValueChange: (value: T) => void;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  value: T;
  variant?: SegmentedTabsVariant;
};

export function SegmentedTabs<T extends string>({
  containerStyle,
  equalWidth,
  items,
  labelSize = 'default',
  onValueChange,
  scrollable,
  style,
  value,
  variant = 'pill',
}: SegmentedTabsProps<T>) {
  const colors = useThemeColors();
  const isUnderline = variant === 'underline';
  const shouldScroll = scrollable ?? false;
  const shouldEqualWidth = equalWidth ?? !shouldScroll;
  const labelVariant = labelSize === 'large' ? 'label.controlLarge' : 'label.control';
  const contentStyle = StyleSheet.flatten([
    isUnderline ? styles.underlineRail : styles.pillRail,
    !isUnderline && !shouldScroll && styles.containedPillRail,
    !isUnderline && !shouldScroll && { backgroundColor: colors.surface.subtle, borderColor: colors.border.subtle },
    shouldScroll && styles.scrollContent,
    style,
  ]);
  const tabNodes = items.map((item) => {
    const selected = value === item.value;
    const tabStyle: StyleProp<ViewStyle> = isUnderline
      ? [
          styles.underlineItem,
          shouldEqualWidth && styles.equalItem,
        ]
      : [
          styles.pillItem,
          shouldEqualWidth && styles.equalItem,
          {
            backgroundColor: selected ? colors.surface.panel : colors.surface.subtle,
            borderColor: selected ? colors.text.primary : colors.border.subtle,
          },
        ];
    return (
      <NativePressable
        accessibilityLabel={item.accessibilityLabel ?? item.label}
        accessibilityRole="tab"
        accessibilityState={{ disabled: item.disabled, selected }}
        disabled={item.disabled}
        key={item.value}
        minTouch={isUnderline ? size.touch.min : size.tab.pillMinHeight}
        onPress={() => onValueChange(item.value)}
        style={StyleSheet.flatten(tabStyle)}>
        <AppText adjustsFontSizeToFit numberOfLines={1} tone={selected ? 'default' : 'muted'} variant={labelVariant}>
          {item.label}
        </AppText>
        {isUnderline ? (
          <View
            style={StyleSheet.flatten([
              styles.underlineIndicator,
              {
                backgroundColor: selected ? colors.text.primary : 'transparent',
              },
            ])}
          />
        ) : null}
      </NativePressable>
    );
  });

  if (shouldScroll) {
    return (
      <ScrollView contentContainerStyle={contentStyle} horizontal showsHorizontalScrollIndicator={false} style={containerStyle}>
        {tabNodes}
      </ScrollView>
    );
  }

  return <View style={StyleSheet.flatten([containerStyle, contentStyle])}>{tabNodes}</View>;
}

const styles = StyleSheet.create({
  equalItem: {
    flex: 1,
    minWidth: 0,
  },
  pillItem: {
    alignItems: 'center',
    borderWidth: lineWidth.selected,
    borderRadius: radius.full,
    justifyContent: 'center',
    minHeight: size.tab.pillMinHeight,
    paddingHorizontal: spacing.md,
  },
  pillRail: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  containedPillRail: {
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    gap: spacing.xs,
    padding: spacing.xs,
  },
  scrollContent: {
    paddingRight: spacing.sm,
  },
  underlineIndicator: {
    borderRadius: radius.full,
    height: size.tab.indicatorHeight,
    width: size.tab.indicatorWidth,
  },
  underlineItem: {
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: size.tab.underlineMinHeight,
    justifyContent: 'center',
  },
  underlineRail: {
    flexDirection: 'row',
  },
});
