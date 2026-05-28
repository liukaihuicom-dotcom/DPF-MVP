import type { ReactNode } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, radius, spacing } from '@/src/theme/tokens';
import { shadows } from '@/src/theme/colors';

import { ActionButton, type ActionButtonTone, type ActionButtonVariant } from './ActionButton';
import type { AppIconName } from './AppIcon';
import { IconSurface, type IconSurfaceTone } from './IconSurface';
import { AppText } from './Typography';

export type GlobalDialogAction = {
  accessibilityLabel?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  tone?: ActionButtonTone;
  variant?: ActionButtonVariant;
};

export type GlobalDialogProps = {
  accessibilityLabel?: string;
  actions: GlobalDialogAction[];
  body?: string;
  children?: ReactNode;
  icon?: AppIconName;
  iconTone?: IconSurfaceTone;
  onRequestClose: () => void;
  open: boolean;
  target?: React.ReactNode;
  title?: string;
};

export function GlobalDialog({
  accessibilityLabel,
  actions,
  body,
  children,
  icon,
  iconTone = 'neutral',
  onRequestClose,
  open,
  target,
  title,
}: GlobalDialogProps) {
  const { colors, resolvedThemeMode } = useProductSettings();
  const scrimColor = `${resolvedThemeMode === 'darkTerminal' || resolvedThemeMode === 'midnightBlue' ? colors.surface.canvas : colors.text.primary}99`;
  const resolvedAccessibilityLabel = accessibilityLabel ?? [title, body].filter(Boolean).join(' ');

  if (!open) {
    return null;
  }

  return (
    <Modal accessibilityViewIsModal animationType="fade" onRequestClose={onRequestClose} transparent visible>
      <View style={StyleSheet.flatten([styles.backdrop, { backgroundColor: scrimColor }])}>
        <View style={styles.stage}>
          <View
            accessibilityHint={body}
            accessibilityLabel={resolvedAccessibilityLabel || undefined}
            accessibilityRole="alert"
            style={StyleSheet.flatten([styles.dialog, { backgroundColor: colors.surface.raised }])}>
            {children ?? (
              <View style={styles.copyStack}>
                {icon ? <IconSurface icon={icon} sizeVariant="md" tone={iconTone} /> : null}
                {target ? <View style={styles.targetSlot}>{target}</View> : null}
                {title ? (
                  <AppText numberOfLines={2} style={styles.centerText} variant="title.dialog">
                    {title}
                  </AppText>
                ) : null}
                {body ? (
                  <AppText style={styles.centerText} tone="muted" variant="bodyMd">
                    {body}
                  </AppText>
                ) : null}
              </View>
            )}
            <View style={styles.actions}>
              {actions.map((action) => (
                <ActionButton
                  accessibilityLabel={action.accessibilityLabel}
                  disabled={action.disabled}
                  key={action.label}
                  label={action.label}
                  onPress={action.onPress}
                  tone={action.tone ?? 'neutral'}
                  variant={action.variant ?? 'filled'}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignSelf: 'stretch',
    gap: spacing.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  copyStack: {
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  dialog: {
    alignItems: 'center',
    borderRadius: radius.sheet,
    gap: spacing.xl,
    padding: spacing.xl,
    width: '100%',
    ...shadows.dialog,
  },
  stage: {
    maxWidth: layout.appMaxWidth,
    paddingHorizontal: spacing.xxl,
    width: '100%',
  },
  targetSlot: {
    alignItems: 'center',
    width: '100%',
  },
});
