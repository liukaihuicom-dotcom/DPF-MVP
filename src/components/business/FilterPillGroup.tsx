import { StyleSheet, View } from 'react-native';

import { NativePressable } from '@/src/components/NativePressable';
import { StatusPill } from '@/src/components/StatusPill';
import { AppText } from '@/src/components/Typography';
import type { AppIconName } from '@/src/icons/iconRegistry';
import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, radius, spacing } from '@/src/theme/tokens';

export type FilterPillItem<T extends string> = {
  icon?: AppIconName;
  label: string;
  value: T;
};

type FilterPillGroupProps<T extends string> = {
  items: FilterPillItem<T>[];
  onChange: (value: T) => void;
  value: T;
  variant?: 'button' | 'status';
};

export function FilterPillGroup<T extends string>({ items, onChange, value, variant = 'button' }: FilterPillGroupProps<T>) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      {items.map((item) => {
        const selected = item.value === value;

        if (variant === 'status') {
          return <StatusPill icon={item.icon} key={item.value} label={item.label} tone="neutral" />;
        }

        return (
          <NativePressable
            accessibilityLabel={item.label}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={item.value}
            minTouch={36}
            onPress={() => onChange(item.value)}
            style={StyleSheet.flatten([
              styles.button,
              { backgroundColor: colors.surface.subtle, borderColor: selected ? colors.text.primary : colors.border.subtle },
            ])}>
            <AppText tone={selected ? 'default' : 'muted'} variant="caption">
              {item.label}
            </AppText>
          </NativePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
