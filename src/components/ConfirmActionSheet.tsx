import { StyleSheet, View } from 'react-native';

import { spacing } from '@/src/theme/tokens';

import { IconSurface, type IconSurfaceTone } from './IconSurface';
import type { AppIconName } from './AppIcon';
import { AppText } from './Typography';

type ConfirmActionSheetProps = {
  body: string;
  confirmTone?: 'brand' | 'danger';
  icon: AppIconName;
  title: string;
};

export function ConfirmActionSheet({
  body,
  confirmTone = 'brand',
  icon,
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
    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
  },
});
