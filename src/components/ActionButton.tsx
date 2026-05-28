import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type IconTone } from './AppIcon';
import { NativePressable } from './NativePressable';
import { AppText, type AppTextTone } from './Typography';

export type ActionButtonTone = 'up' | 'down' | 'blue' | 'brand' | 'neutral' | 'amber' | 'danger';
export type ActionButtonVariant = 'filled' | 'outline';
export type ActionButtonSizePreset = 'default' | 'lg';

type ActionButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  icon?: AppIconName;
  label: string;
  loading?: boolean;
  onPress: () => void;
  sizePreset?: ActionButtonSizePreset;
  tone?: ActionButtonTone;
  style?: ViewStyle;
  variant?: ActionButtonVariant;
};

export function ActionButton({
  accessibilityLabel,
  disabled,
  icon,
  label,
  loading,
  onPress,
  sizePreset = 'default',
  tone = 'neutral',
  style,
  variant = 'filled',
}: ActionButtonProps) {
  const colors = useThemeColors();
  const filledToneStyles = {
    amber: {
      backgroundColor: colors.status.warning.fg,
      borderColor: colors.status.warning.fg,
    },
    blue: {
      backgroundColor: colors.status.info.fg,
      borderColor: colors.status.info.fg,
    },
    brand: {
      backgroundColor: colors.text.primary,
      borderColor: colors.text.primary,
    },
    danger: {
      backgroundColor: colors.status.danger.fg,
      borderColor: colors.status.danger.fg,
    },
    down: {
      backgroundColor: colors.market.down.fg,
      borderColor: colors.market.down.fg,
    },
    neutral: {
      backgroundColor: colors.surface.subtle,
      borderColor: colors.border.subtle,
    },
    up: {
      backgroundColor: colors.market.up.fg,
      borderColor: colors.market.up.fg,
    },
  };

  const outlineToneStyles = {
    amber: {
      backgroundColor: 'transparent',
      borderColor: colors.status.warning.fg,
    },
    blue: {
      backgroundColor: 'transparent',
      borderColor: colors.status.info.fg,
    },
    brand: {
      backgroundColor: 'transparent',
      borderColor: colors.text.primary,
    },
    danger: {
      backgroundColor: 'transparent',
      borderColor: colors.status.danger.fg,
    },
    down: {
      backgroundColor: 'transparent',
      borderColor: colors.market.down.fg,
    },
    neutral: {
      backgroundColor: 'transparent',
      borderColor: colors.border.default,
    },
    up: {
      backgroundColor: 'transparent',
      borderColor: colors.market.up.fg,
    },
  };
  const filledTextTones = {
    amber: 'white',
    blue: 'white',
    brand: 'panel',
    danger: 'white',
    down: 'white',
    neutral: 'default',
    up: 'white',
  } satisfies Record<ActionButtonTone, AppTextTone>;
  const outlineTextTones = {
    amber: 'amber',
    blue: 'blue',
    brand: 'default',
    danger: 'danger',
    down: 'down',
    neutral: 'default',
    up: 'up',
  } satisfies Record<ActionButtonTone, AppTextTone>;
  const toneStyles = variant === 'filled' ? filledToneStyles : outlineToneStyles;
  const toneForeground = variant === 'filled' ? filledTextTones : outlineTextTones;
  const foregroundTone = disabled ? 'disabled' : toneForeground[tone];
  const textToneColors = {
    amber: colors.status.warning.fg,
    bg: colors.surface.canvas,
    blue: colors.status.info.fg,
    brand: colors.brand.fg,
    cyan: colors.accent.cyan.fg,
    danger: colors.status.danger.fg,
    default: colors.text.primary,
    dim: colors.text.tertiary,
    disabled: colors.text.disabled,
    down: colors.market.down.fg,
    link: colors.text.link,
    muted: colors.text.secondary,
    panel: colors.surface.panel,
    panelMuted: `${colors.surface.panel}CC`,
    success: colors.status.success.fg,
    up: colors.market.up.fg,
    white: colors.text.inverse,
  } satisfies Record<AppTextTone, string>;
  const foregroundColor = textToneColors[foregroundTone];
  const iconTone: IconTone = disabled
    ? 'disabled'
    : variant === 'filled' && tone !== 'neutral'
      ? tone === 'brand'
        ? 'panel'
        : 'white'
      : tone === 'neutral'
        ? 'text'
        : tone;
  const spinnerColor = disabled
    ? colors.text.disabled
    : variant === 'filled'
      ? tone === 'neutral'
        ? colors.text.secondary
        : foregroundColor
      : foregroundColor;
  const disabledButtonStyle =
    variant === 'outline'
      ? { backgroundColor: 'transparent', borderColor: colors.border.disabled }
      : { backgroundColor: colors.surface.disabled, borderColor: 'transparent' };

  return (
    <NativePressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: Boolean(loading), disabled: Boolean(disabled || loading) }}
      disableDefaultDisabledStyle
      disabled={disabled || loading}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.button,
        sizePreset === 'lg' && styles.buttonLg,
        variant === 'filled' && styles.filledButton,
        toneStyles[tone],
        disabled && styles.disabledButton,
        disabled && disabledButtonStyle,
        style,
      ])}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View style={styles.buttonContent}>
          {icon ? <AppIcon name={icon} sizeVariant="sm" tone={iconTone} /> : null}
          <AppText numberOfLines={1} tone={foregroundTone} variant={sizePreset === 'lg' ? 'buttonLg' : 'buttonMd'}>
            {label}
          </AppText>
        </View>
      )}
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    justifyContent: 'center',
    minHeight: size.button.minHeight,
    paddingHorizontal: layout.actionButtonPaddingX,
    paddingVertical: spacing.md,
  },
  buttonLg: {
    minHeight: size.control.lg,
    paddingHorizontal: spacing.xl,
  },
  filledButton: {
    borderWidth: lineWidth.none,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minWidth: 0,
  },
  disabledButton: {
    opacity: 1,
  },
});
