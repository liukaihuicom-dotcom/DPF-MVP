import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, spacing, typography } from '@/src/theme/tokens';

import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

type DescribedLabelProps = {
  accessibilityLabel?: string;
  label: string;
  onPress?: () => void;
};

export function DescribedLabel({ accessibilityLabel, label, onPress }: DescribedLabelProps) {
  const colors = useThemeColors();
  const content = (
    <View style={styles.wrap} testID="described-label">
      <AppText style={styles.label} tone="muted">
        {label}
      </AppText>
      <View style={StyleSheet.flatten([styles.underline, { borderBottomColor: colors.text.tertiary }])} testID="described-label-underline" />
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <NativePressable accessibilityLabel={accessibilityLabel ?? label} minTouch={32} onPress={onPress}>
      {content}
    </NativePressable>
  );
}

const styles = StyleSheet.create({
  underline: {
    alignSelf: 'stretch',
    borderBottomWidth: lineWidth.hairline,
    borderStyle: 'dashed',
    marginTop: spacing.xxs,
  },
  wrap: {
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.titleSm,
  },
});
