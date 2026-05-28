import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemePreviewSelector } from '@/src/design-public-assets/business-components';
import { Screen } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import { useProductSettings } from '@/src/design-public-assets/copy';
import { spacing } from '@/src/design-public-assets/tokens';
import type { ResolvedThemeMode, ThemeMode } from '@/src/design-public-assets/tokens';

type AppearanceOption = {
  descriptionKey: 'settings.appearance.option.system.description' | 'settings.appearance.option.light.description' | 'settings.appearance.option.dark.description';
  labelKey: 'settings.appearance.option.system.label' | 'settings.appearance.option.light.label' | 'settings.appearance.option.dark.label';
  previewMode: ResolvedThemeMode;
  value: ThemeMode;
};

const appearanceOptions: AppearanceOption[] = [
  {
    descriptionKey: 'settings.appearance.option.system.description',
    labelKey: 'settings.appearance.option.system.label',
    previewMode: 'darkTerminal',
    value: 'system',
  },
  {
    descriptionKey: 'settings.appearance.option.light.description',
    labelKey: 'settings.appearance.option.light.label',
    previewMode: 'lightBroker',
    value: 'lightBroker',
  },
  {
    descriptionKey: 'settings.appearance.option.dark.description',
    labelKey: 'settings.appearance.option.dark.label',
    previewMode: 'darkTerminal',
    value: 'darkTerminal',
  },
];

export default function AppearanceScreen() {
  const { locale, colors, setThemeMode, t, themeMode } = useProductSettings();
  const selectedOption = appearanceOptions.find((item) => item.value === themeMode) ?? appearanceOptions[0];

  return (
    <Screen
      align="center"
      back
      backHref="/settings"
      contentInsetBottom={32}
      rightActions={[]}
      title={t('settings.appearance.title')}>
      <ThemePreviewSelector
        colors={colors}
        locale={locale}
        onChange={setThemeMode}
        options={appearanceOptions.map((option) => ({
          label: t(option.labelKey),
          previewMode: option.previewMode,
          value: option.value,
        }))}
        selectedValue={themeMode}
      />

      <AppText numberOfLines={2} style={styles.helperText} tone="dim" variant="body">
        {t(selectedOption.descriptionKey)}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  helperText: {
    paddingHorizontal: spacing.lg,
  },
});
