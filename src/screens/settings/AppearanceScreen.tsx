import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { NativePressable } from '@/src/components/NativePressable';
import { Screen } from '@/src/components/Screen';
import { AppText } from '@/src/components/Typography';
import { impactLight } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, spacing } from '@/src/theme/tokens';
import { themeColors, type ResolvedThemeMode, type ThemeMode, type ThemeColors } from '@/src/theme/colors';

type AppearanceOption = {
  description: {
    'en-US': string;
    'id-ID': string;
    'zh-CN': string;
  };
  label: {
    'en-US': string;
    'id-ID': string;
    'zh-CN': string;
  };
  previewMode: ResolvedThemeMode;
  value: ThemeMode;
};

const appearanceOptions: AppearanceOption[] = [
  {
    description: {
      'en-US': 'Uses your device appearance.',
      'id-ID': 'Mengikuti pengaturan tampilan perangkat Anda.',
      'zh-CN': '选择后，将跟随设备的系统设置切换外观',
    },
    label: {
      'en-US': 'System',
      'id-ID': 'Sistem',
      'zh-CN': '跟随系统',
    },
    previewMode: 'darkTerminal',
    value: 'system',
  },
  {
    description: {
      'en-US': 'Keeps the interface bright.',
      'id-ID': 'Menjaga antarmuka tetap terang.',
      'zh-CN': '始终使用浅色外观',
    },
    label: {
      'en-US': 'Light',
      'id-ID': 'Terang',
      'zh-CN': '浅色',
    },
    previewMode: 'lightBroker',
    value: 'lightBroker',
  },
  {
    description: {
      'en-US': 'Keeps the interface dark.',
      'id-ID': 'Menjaga antarmuka tetap gelap.',
      'zh-CN': '始终使用深色外观',
    },
    label: {
      'en-US': 'Dark',
      'id-ID': 'Gelap',
      'zh-CN': '深色',
    },
    previewMode: 'darkTerminal',
    value: 'darkTerminal',
  },
];

export default function AppearanceScreen() {
  const { locale, colors, setThemeMode, themeMode } = useProductSettings();
  const selectedOption = appearanceOptions.find((item) => item.value === themeMode) ?? appearanceOptions[0];

  return (
    <Screen
      align="center"
      back
      backHref="/settings"
      contentInsetBottom={32}
      rightActions={[]}
      title={locale === 'zh-CN' ? '外观' : locale === 'id-ID' ? 'Tampilan' : 'Appearance'}>
      <View style={StyleSheet.flatten([styles.optionCard, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
        <View style={styles.options}>
          {appearanceOptions.map((option) => {
            const selected = option.value === themeMode;
            const previewColors = themeColors[option.previewMode];

            return (
              <NativePressable
                accessibilityLabel={option.label[locale]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                key={option.value}
                minTouch={150}
                onPress={() => {
                  setThemeMode(option.value);
                  void impactLight();
                }}
                style={styles.option}>
                <ThemePreview colors={previewColors} split={option.value === 'system'} />
                <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.optionLabel} variant="subtitle">
                  {option.label[locale]}
                </AppText>
                <RadioMark selected={selected} />
              </NativePressable>
            );
          })}
        </View>
      </View>

      <AppText numberOfLines={2} style={styles.helperText} tone="dim" variant="body">
        {selectedOption.description[locale]}
      </AppText>
    </Screen>
  );
}

function ThemePreview({ colors, split }: { colors: ThemeColors; split?: boolean }) {
  const darkColors = themeColors.darkTerminal;
  const lightColors = themeColors.lightBroker;

  return (
    <View style={StyleSheet.flatten([styles.previewFrame, { backgroundColor: split ? lightColors.surface.panel : colors.surface.panel, borderColor: colors.border.default }])}>
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
              {item === 1 ? (
                <View
                  style={StyleSheet.flatten([
                    styles.previewBlock,
                    {
                      backgroundColor: colors.overlay.info.muted,
                    },
                  ])}
                />
              ) : (
                <View
                  style={StyleSheet.flatten([
                    styles.previewBlockMuted,
                    {
                      backgroundColor: split && item !== 1 ? lightColors.border.subtle : colors.overlay.inverse.subtle,
                    },
                  ])}
                />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function RadioMark({ selected }: { selected: boolean }) {
  const { colors } = useProductSettings();

  return (
    <View
      style={StyleSheet.flatten([
        styles.radio,
        {
          borderColor: selected ? colors.text.primary : colors.text.tertiary,
          borderWidth: selected ? 9 : 3,
        },
      ])}
    />
  );
}

const styles = StyleSheet.create({
  helperText: {
    paddingHorizontal: spacing.lg,
  },
  option: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    minWidth: 92,
  },
  optionCard: {
    borderRadius: radius.lg,
    borderWidth: lineWidth.none,
    paddingHorizontal: layout.cardPaddingX,
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
    gap: 5,
    minWidth: 0,
  },
  previewBlock: {
    borderRadius: 5,
    height: 34,
    width: '82%',
  },
  previewBlockMuted: {
    borderRadius: 5,
    height: 32,
    width: '96%',
  },
  previewContent: {
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  previewDot: {
    borderRadius: radius.full,
    height: 13,
    marginTop: 1,
    width: 13,
  },
  previewFrame: {
    borderRadius: radius.md,
    borderWidth: lineWidth.hairline,
    height: 136,
    overflow: 'hidden',
    position: 'relative',
    width: 78,
  },
  previewLine: {
    borderRadius: radius.full,
    height: 15,
    width: '100%',
  },
  previewRow: {
    flexDirection: 'row',
    gap: 8,
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
    height: 24,
    width: 24,
  },
});
