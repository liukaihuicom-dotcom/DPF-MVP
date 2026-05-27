import { StyleSheet, View } from 'react-native';

import { spacing } from '@/src/theme/tokens';

import { ActionButton, type ActionButtonTone } from './ActionButton';
import { IconSurface, type IconSurfaceTone } from './IconSurface';
import type { AppIconName } from './AppIcon';
import { AppText } from './Typography';

type ConfirmActionSheetProps = {
  body: string;
  cancelLabel: string;
  confirmDisabled?: boolean;
  confirmLabel: string;
  confirmTone?: Extract<ActionButtonTone, 'brand' | 'danger'>;
  icon: AppIconName;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

export function ConfirmActionSheet({
  body,
  cancelLabel,
  confirmDisabled,
  confirmLabel,
  confirmTone = 'brand',
  icon,
  onCancel,
  onConfirm,
  title,
}: ConfirmActionSheetProps) {
  const iconTone: IconSurfaceTone = confirmTone === 'danger' ? 'danger' : 'neutral';

  return (
    <View style={styles.content}>
      <IconSurface icon={icon} sizeVariant="lg" tone={iconTone} />
      <AppText style={styles.centerText} variant="subtitle">
        {title}
      </AppText>
      <AppText style={styles.centerText} tone="muted" variant="body">
        {body}
      </AppText>
      <View style={styles.actions}>
        <ActionButton label={cancelLabel} onPress={onCancel} tone="neutral" variant="outline" />
        <ActionButton disabled={confirmDisabled} label={confirmLabel} onPress={onConfirm} tone={confirmTone} variant="filled" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    width: '100%',
  },
  centerText: {
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
});
