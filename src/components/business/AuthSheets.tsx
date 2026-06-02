import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { countryOptions, type CountryOption } from '@/src/auth/authFlow';
import type { Locale } from '@/src/i18n/translations';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { layout, lineWidth, radius, size, spacing } from '@/src/theme/tokens';

import { AppIcon } from '../AppIcon';
import { FlagIcon } from '../FlagIcon';
import { NativePressable } from '../NativePressable';
import { TextField as AuthTextField } from '../TextField';
import { AppText } from '../Typography';

export type CountryPickerSheetContentProps = {
  onSelect: (country: CountryOption) => void;
  selected: CountryOption;
};

export type AuthLanguageSheetContentProps = {
  onSelect: (locale: Locale) => void;
  selectedLocale: Locale;
};

const localeOptions: { flag: string; label: string; value: Locale }[] = [
  { flag: 'US', label: 'English', value: 'en-US' },
  { flag: 'CN', label: '简体中文', value: 'zh-CN' },
  { flag: 'ID', label: 'Bahasa Indonesia', value: 'id-ID' },
];

export function CountryPickerSheetContent({ onSelect, selected }: CountryPickerSheetContentProps) {
  const { t } = useProductSettings();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return countryOptions;
    }

    return countryOptions.filter((item) => `${item.name} ${item.dialCode} ${item.code}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <View style={styles.countryPickerContent}>
      <AuthTextField
        accessibilityLabel={t('auth.country.search')}
        icon="icon.system.search"
        label={t('auth.country.search')}
        labelHidden
        onChangeText={setQuery}
        placeholder={t('auth.country.search')}
        returnKeyType="search"
        shape="pill"
        sizePreset="sm"
        value={query}
      />
      <View style={styles.countryList}>
        {filtered.length ? filtered.map((country) => {
          const active = country.code === selected.code;

          return (
            <NativePressable
              accessibilityLabel={`${country.name} ${country.dialCode}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: active, selected: active }}
              key={country.code}
              minTouch={44}
              onPress={() => onSelect(country)}
              style={styles.countryRow}>
              <FlagBadge code={country.flag} />
              <View style={styles.countryCopyStack}>
                <AppText numberOfLines={1} style={styles.countryDial} variant="titleSm">
                  {country.dialCode}
                </AppText>
                <AppText numberOfLines={1} style={styles.countryName} tone="muted" variant="caption">
                  {country.name}
                </AppText>
              </View>
              <View style={styles.countrySelectSlot}>
                {active ? <AppIcon name="icon.status.check" /> : null}
              </View>
            </NativePressable>
          );
        }) : (
          <View
            accessibilityLabel={t('auth.country.noResults')}
            accessibilityRole="text"
            style={styles.countryEmptyState}>
            <AppText style={styles.centerText} tone="muted" variant="caption">
              {t('auth.country.noResults')}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
}

export function AuthLanguageSheetContent({ onSelect, selectedLocale }: AuthLanguageSheetContentProps) {
  return (
    <View style={styles.languageList}>
      {localeOptions.map((option) => {
        const active = option.value === selectedLocale;

        return (
          <NativePressable
            accessibilityLabel={option.label}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={option.value}
            minTouch={44}
            onPress={() => onSelect(option.value)}
            style={styles.languageRow}>
            <FlagIcon code={option.flag} size={30} />
            <AppText numberOfLines={1} style={styles.languageName} variant={active ? 'titleMd' : 'bodyLg'}>
              {option.label}
            </AppText>
            {active ? <AppIcon name="icon.status.check" sizeVariant="sm" styleVariant="fill" /> : null}
          </NativePressable>
        );
      })}
    </View>
  );
}

function FlagBadge({ code }: { code: string }) {
  const { colors } = useProductSettings();

  return (
    <View style={StyleSheet.flatten([styles.flagBadge, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
      <FlagIcon code={code} size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    textAlign: 'center',
  },
  countryCopyStack: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  countryDial: {
    minWidth: 0,
  },
  countryEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: size.input.countryRowMinHeight,
    paddingHorizontal: spacing.md,
  },
  countryList: {
    gap: spacing.xs,
  },
  countryName: {
    minWidth: 0,
  },
  countryPickerContent: {
    gap: spacing.md,
  },
  countryRow: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: size.input.countryRowMinHeight,
    paddingHorizontal: spacing.md,
  },
  countrySelectSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    width: size.icon.md,
  },
  flagBadge: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.input.countryBadge,
    justifyContent: 'center',
    width: size.input.countryBadge,
  },
  languageList: {
    gap: spacing.xs,
  },
  languageName: {
    flex: 1,
    minWidth: 0,
  },
  languageRow: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: size.input.countryRowMinHeight,
    paddingHorizontal: layout.listRowPaddingX,
  },
});
