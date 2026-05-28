import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { lineWidth, layout, spacing } from '@/src/theme/tokens';

import { AppIcon, type AppIconName } from '../AppIcon';
import { AppText, type AppTextTone } from '../Typography';

export type DetailRowItem = {
  label: string;
  trailingIcon?: AppIconName | boolean;
  value: string;
  valueTone?: AppTextTone;
};

type DetailRowProps = {
  row: DetailRowItem;
  showDivider?: boolean;
};

export function DetailRow({ row, showDivider }: DetailRowProps) {
  const colors = useThemeColors();
  const trailingIcon = row.trailingIcon === true ? 'icon.system.chevron_right' : row.trailingIcon;

  return (
    <View style={StyleSheet.flatten([styles.row, showDivider && { borderBottomColor: colors.border.subtle, borderBottomWidth: lineWidth.hairline }])}>
      <AppText numberOfLines={1} style={styles.label} tone="muted" variant="caption">
        {row.label}
      </AppText>
      <View style={styles.valueWrap}>
        <AppText adjustsFontSizeToFit numberOfLines={2} style={styles.value} tone={row.valueTone} variant="caption">
          {row.value}
        </AppText>
        {trailingIcon ? <AppIcon name={trailingIcon} size={layout.menuDisclosureIconSize} tone="tertiary" /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    flex: 0.72,
    minWidth: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingHorizontal: layout.listRowPaddingX,
    paddingVertical: spacing.md,
  },
  value: {
    flex: 1,
    minWidth: 0,
    textAlign: 'right',
  },
  valueWrap: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'flex-end',
    minWidth: 0,
  },
});
