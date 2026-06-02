import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName, type AppIconSizeVariant, type IconTone } from './AppIcon';
import { NativePressable } from './NativePressable';
import { AppText, type AppTextTone } from './Typography';

export type ActionButtonTone = 'up' | 'down' | 'blue' | 'brand' | 'neutral' | 'amber' | 'danger';
export type ActionButtonVariant = 'filled' | 'outline';
export type ActionButtonSizePreset = 'sm' | 'md' | 'lg' | 'xl' | 'default';

type ActionButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  disabledReason?: string;
  icon?: AppIconName;
  label: string;
  leadingIcon?: AppIconName;
  loading?: boolean;
  loadingLabel?: string;
  onPress: () => void;
  reserveLeadingIcon?: boolean;
  reserveTrailingIcon?: boolean;
  sizePreset?: ActionButtonSizePreset;
  tone?: ActionButtonTone;
  style?: ViewStyle;
  trailingIcon?: AppIconName;
  variant?: ActionButtonVariant;
};

type ResolvedButtonSize = Exclude<ActionButtonSizePreset, 'default'>;

const buttonSizeConfig = {
  sm: {
    contentGap: spacing.xs,
    height: size.button.sm,
    horizontalPadding: spacing.md,
    iconSizeVariant: 'xs',
    textVariant: 'buttonSm',
  },
  md: {
    contentGap: spacing.sm,
    height: size.button.md,
    horizontalPadding: layout.actionButtonPaddingX,
    iconSizeVariant: 'sm',
    textVariant: 'buttonMd',
  },
  lg: {
    contentGap: spacing.sm,
    height: size.button.lg,
    horizontalPadding: spacing.xl,
    iconSizeVariant: 'md',
    textVariant: 'buttonLg',
  },
  xl: {
    contentGap: spacing.md,
    height: size.button.xl,
    horizontalPadding: spacing.xl,
    iconSizeVariant: 'md',
    textVariant: 'buttonLg',
  },
} satisfies Record<
  ResolvedButtonSize,
  {
    contentGap: number;
    height: number;
    horizontalPadding: number;
    iconSizeVariant: AppIconSizeVariant;
    textVariant: 'buttonSm' | 'buttonMd' | 'buttonLg';
  }
>;

function resolveButtonSizePreset(sizePreset: ActionButtonSizePreset): ResolvedButtonSize {
  return sizePreset === 'default' ? 'md' : sizePreset;
}

export function ActionButton({
  accessibilityLabel,
  disabled,
  disabledReason,
  icon,
  label,
  leadingIcon,
  loading,
  loadingLabel,
  onPress,
  reserveLeadingIcon,
  reserveTrailingIcon,
  sizePreset = 'default',
  tone = 'neutral',
  style,
  trailingIcon,
  variant = 'filled',
}: ActionButtonProps) {
  const colors = useThemeColors();
  const resolvedSizePreset = resolveButtonSizePreset(sizePreset);
  const sizeConfig = buttonSizeConfig[resolvedSizePreset];
  const resolvedLeadingIcon = leadingIcon ?? icon;
  const showLeadingSlot = Boolean(resolvedLeadingIcon || reserveLeadingIcon);
  const showTrailingSlot = Boolean(trailingIcon || reserveTrailingIcon);
  const visibleLabel = loading ? loadingLabel : label;
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
  const iconSlotStyle = {
    height: size.icon[sizeConfig.iconSizeVariant],
    width: size.icon[sizeConfig.iconSizeVariant],
  };

  return (
    <NativePressable
      accessibilityHint={disabled && disabledReason ? disabledReason : undefined}
      accessibilityLabel={accessibilityLabel ?? visibleLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: Boolean(loading), disabled: Boolean(disabled || loading) }}
      disableDefaultDisabledStyle
      disabled={disabled || loading}
      focusedStyle={StyleSheet.flatten([styles.focusedButton, { borderColor: colors.border.focus }])}
      hoveredStyle={styles.hoveredButton}
      minTouch={Math.max(size.touch.min, sizeConfig.height)}
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.button,
        {
          minHeight: sizeConfig.height,
          paddingHorizontal: sizeConfig.horizontalPadding,
        },
        variant === 'filled' && styles.filledButton,
        toneStyles[tone],
        disabled && styles.disabledButton,
        disabled && disabledButtonStyle,
        style,
      ])}>
      <View style={StyleSheet.flatten([styles.buttonContent, { gap: sizeConfig.contentGap }])}>
        {loading ? <ActivityIndicator color={spinnerColor} size={size.icon[sizeConfig.iconSizeVariant]} /> : null}
        {!loading && showLeadingSlot ? (
          <View style={StyleSheet.flatten([styles.iconSlot, iconSlotStyle])}>
            {resolvedLeadingIcon ? <AppIcon name={resolvedLeadingIcon} sizeVariant={sizeConfig.iconSizeVariant} tone={iconTone} /> : null}
          </View>
        ) : null}
        {visibleLabel ? (
          <AppText numberOfLines={1} tone={foregroundTone} variant={sizeConfig.textVariant}>
            {visibleLabel}
          </AppText>
        ) : null}
        {!loading && showTrailingSlot ? (
          <View style={StyleSheet.flatten([styles.iconSlot, iconSlotStyle])}>
            {trailingIcon ? <AppIcon name={trailingIcon} sizeVariant={sizeConfig.iconSizeVariant} tone={iconTone} /> : null}
          </View>
        ) : null}
      </View>
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    justifyContent: 'center',
    paddingVertical: spacing.none,
  },
  filledButton: {
    borderWidth: lineWidth.none,
  },
  focusedButton: {
    borderWidth: lineWidth.strong,
  },
  hoveredButton: {
    opacity: 0.92,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minWidth: 0,
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 1,
  },
});
