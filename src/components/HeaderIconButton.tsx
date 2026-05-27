import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { layout, radius } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { NativePressable } from './NativePressable';

type HeaderIconButtonProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: AppIconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | IconTone;
  variant?: 'filled' | 'ghost';
};

export function HeaderIconButton({
  accessibilityLabel,
  disabled,
  icon,
  onPress,
  style,
  tone = 'default',
  variant = 'filled',
}: HeaderIconButtonProps) {
  const colors = useThemeColors();
  const iconTone = tone === 'default' ? undefined : tone;
  const buttonStyle = StyleSheet.flatten([
    styles.button,
    variant === 'filled' && {
      backgroundColor: colors.surface.subtle,
    },
    variant === 'ghost' && styles.ghost,
    style,
  ]);

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      minTouch={layout.headerIconButtonSize}
      onPress={onPress}
      style={buttonStyle}>
      <AppIcon name={icon} size={layout.headerIconSize} tone={iconTone} />
    </NativePressable>
  );
}

export function HeaderIconSlot({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={StyleSheet.flatten([styles.slot, style])}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.full,
    height: layout.headerIconButtonSize,
    justifyContent: 'center',
    width: layout.headerIconButtonSize,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  slot: {
    alignItems: 'center',
    height: layout.headerIconButtonSize,
    justifyContent: 'center',
    width: layout.headerIconButtonSize,
  },
});
