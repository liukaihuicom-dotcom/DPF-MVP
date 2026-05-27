import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { NativePressable } from '../NativePressable';

type SwitchControlProps = {
  accessibilityLabel: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
};

export function SwitchControl({ accessibilityLabel, onValueChange, value }: SwitchControlProps) {
  const colors = useThemeColors();

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      minTouch={size.touch.min}
      onPress={() => onValueChange(!value)}
      style={styles.touchTarget}>
      <View
        style={StyleSheet.flatten([
          styles.track,
          {
            backgroundColor: value ? colors.brand.fg : colors.surface.subtle,
            borderColor: value ? colors.brand.fg : colors.border.subtle,
          },
        ])}>
        <View style={StyleSheet.flatten([styles.thumb, { backgroundColor: value ? colors.text.inverse : colors.text.tertiary, transform: [{ translateX: value ? size.icon.xs : 0 }] }])} />
      </View>
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  thumb: {
    borderRadius: radius.full,
    height: size.icon.sm,
    width: size.icon.sm,
  },
  touchTarget: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flexDirection: 'row',
    height: size.icon.md,
    paddingHorizontal: spacing.xxs,
    width: size.control.sm,
  },
});
