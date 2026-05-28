import { StyleSheet, View } from 'react-native';

import { impactLight } from '@/src/feedback/haptics';
import type { Locale } from '@/src/i18n/translations';
import { themeColors, type ResolvedThemeMode, type ThemeColors, type ThemeMode } from '@/src/theme/colors';
import { layout, lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { Card } from '../Card';
import { NativePressable } from '../NativePressable';
import { AppText } from '../Typography';

type ThemePreviewOption = {
  description?: LocalizedThemePreviewText;
  label: LocalizedThemePreviewText;
  previewMode: ResolvedThemeMode;
  value: ThemeMode;
};

type LocalizedThemePreviewText = string | Record<Locale, string>;

type ThemePreviewSelectorProps = {
  colors: ThemeColors;
  locale: Locale;
  onChange: (value: ThemeMode) => void;
  options: ThemePreviewOption[];
  selectedValue: ThemeMode;
};

function resolvePreviewText(value: LocalizedThemePreviewText, locale: Locale) {
  return typeof value === 'string' ? value : value[locale];
}

export function ThemePreviewSelector({ colors, locale, onChange, options, selectedValue }: ThemePreviewSelectorProps) {
  return (
    <Card compact style={StyleSheet.flatten([styles.optionCard, { backgroundColor: colors.surface.panel }])}>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = option.value === selectedValue;
          const previewColors = themeColors[option.previewMode];
          const label = resolvePreviewText(option.label, locale);

          return (
            <NativePressable
              accessibilityLabel={label}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              key={option.value}
              minTouch={150}
              onPress={() => {
                onChange(option.value);
                void impactLight();
              }}
              style={styles.option}>
              <ThemePreview colors={previewColors} split={option.value === 'system'} />
              <AppText numberOfLines={1} style={styles.optionLabel} variant="subtitle">
                {label}
              </AppText>
              <RadioMark colors={colors} selected={selected} />
            </NativePressable>
          );
        })}
      </View>
    </Card>
  );
}

function ThemePreview({ colors, split }: { colors: ThemeColors; split?: boolean }) {
  const darkColors = themeColors.darkTerminal;
  const lightColors = themeColors.lightBroker;

  return (
    <View style={StyleSheet.flatten([styles.previewFrame, { backgroundColor: split ? lightColors.surface.panel : colors.surface.panel }])}>
      {split ? <View style={StyleSheet.flatten([styles.previewSplit, { backgroundColor: darkColors.surface.panel }])} /> : null}
      <View style={styles.previewContent}>
        {[0, 1, 2].map((item) => (
          <View key={item} style={styles.previewRow}>
            <View
              style={StyleSheet.flatten([
                styles.previewDot,
                {
                  backgroundColor: split && item !== 0 ? lightColors.text.tertiary : colors.text.tertiary,
                },
              ])}
            />
            <View style={styles.previewBars}>
              <View
                style={StyleSheet.flatten([
                  styles.previewLine,
                  {
                    backgroundColor: split && item !== 1 ? lightColors.surface.subtle : colors.overlay.inverse.muted,
                  },
                ])}
              />
              <View
                style={StyleSheet.flatten([
                  item === 1 ? styles.previewBlock : styles.previewBlockMuted,
                  {
                    backgroundColor: item === 1 ? colors.overlay.info.muted : split && item !== 1 ? lightColors.border.subtle : colors.overlay.inverse.subtle,
                  },
                ])}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function RadioMark({ colors, selected }: { colors: ThemeColors; selected: boolean }) {
  return (
    <View
      style={StyleSheet.flatten([
        styles.radio,
        {
          borderColor: selected ? colors.text.primary : colors.text.tertiary,
          borderWidth: selected ? spacing.sm + lineWidth.strong : lineWidth.strong + lineWidth.selected,
        },
      ])}
    />
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    minWidth: size.themePreview.optionMinWidth,
  },
  optionCard: {
    borderWidth: lineWidth.none,
    paddingVertical: spacing.xl,
  },
  optionLabel: {
    textAlign: 'center',
  },
  options: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  previewBars: {
    flex: 1,
    gap: spacing.xs + lineWidth.strong,
    minWidth: 0,
  },
  previewBlock: {
    borderRadius: radius.xs + lineWidth.strong,
    height: size.control.xs + spacing.xs + lineWidth.selected,
    width: '82%',
  },
  previewBlockMuted: {
    borderRadius: radius.xs + lineWidth.strong,
    height: size.control.xs + spacing.xs,
    width: '96%',
  },
  previewContent: {
    gap: spacing.md,
    paddingHorizontal: spacing.sm + lineWidth.selected,
    paddingVertical: radius.lg,
  },
  previewDot: {
    borderRadius: radius.full,
    height: spacing.md + lineWidth.strong,
    marginTop: lineWidth.strong,
    width: spacing.md + lineWidth.strong,
  },
  previewFrame: {
    borderRadius: radius.md,
    borderWidth: lineWidth.none,
    height: size.themePreview.frameHeight,
    overflow: 'hidden',
    position: 'relative',
    width: size.themePreview.frameWidth,
  },
  previewLine: {
    borderRadius: radius.full,
    height: radius.lg + lineWidth.strong,
    width: '100%',
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  previewSplit: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
  },
  radio: {
    borderRadius: radius.full,
    height: layout.menuDisclosureIconSize + spacing.sm,
    width: layout.menuDisclosureIconSize + spacing.sm,
  },
});
