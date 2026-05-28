import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/src/settings/ProductSettings';
import { layout, lineWidth, spacing } from '@/src/theme/tokens';
import { AppText, type AppTextTone } from './Typography';

export type KeyValueListVariant = 'compact' | 'detail';

export type KeyValueListItem = {
  id?: string;
  label: string;
  tone?: AppTextTone;
  value: string;
};

type KeyValueListProps = {
  divided?: boolean;
  fill?: boolean;
  inset?: 'default' | 'none';
  items: KeyValueListItem[];
  style?: StyleProp<ViewStyle>;
  variant?: KeyValueListVariant;
};

export function KeyValueList({
  divided = false,
  fill = false,
  inset = 'default',
  items,
  style,
  variant = 'compact',
}: KeyValueListProps) {
  const colors = useThemeColors();
  const isDetail = variant === 'detail';

  return (
    <View
      style={StyleSheet.flatten([
        styles.list,
        isDetail && styles.detailList,
        fill && styles.fill,
        style,
      ])}
    >
      {items.map((item, index) => (
        <View
          key={item.id ?? item.label}
          style={StyleSheet.flatten([
            styles.row,
            isDetail && styles.detailRow,
            inset === 'none' && styles.rowFlush,
            fill && styles.fillRow,
            divided &&
              index < items.length - 1 && {
                borderBottomColor: colors.border.subtle,
                borderBottomWidth: lineWidth.hairline,
              },
          ])}
        >
          <AppText
            numberOfLines={1}
            style={styles.label}
            tone={isDetail ? 'default' : 'muted'}
            variant={isDetail ? 'subtitle' : 'body'}
          >
            {item.label}
          </AppText>
          <AppText
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.value}
            tone={item.tone ?? 'default'}
            variant={isDetail ? 'subtitle' : 'label.default'}
          >
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    flex: 1,
    minWidth: 0,
  },
  detailList: {
    gap: 0,
  },
  detailRow: {
    minHeight: 54,
  },
  fill: {
    flex: 1,
  },
  fillRow: {
    flex: 1,
  },
  list: {
    gap: spacing.xs,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
    minHeight: 24,
    paddingHorizontal: layout.listRowPaddingX,
  },
  rowFlush: {
    paddingHorizontal: spacing.none,
  },
  value: {
    flexShrink: 1,
    minWidth: 92,
    textAlign: 'right',
  },
});
