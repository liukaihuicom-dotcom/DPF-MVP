import { PropsWithChildren, ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInputProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { layout, lineWidth, radius, size, spacing, typography } from '@/src/theme/tokens';
import { impactLight } from '@/src/feedback/haptics';
import { navigateBackOrReplace, navigateReplace, safeRouteTargets, type NavigationTarget } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/settings/ProductSettings';
import { localeOptions, type Locale } from '@/src/i18n/translations';

import { AppIcon } from './AppIcon';
import { NativePressable } from './NativePressable';
import type { AppIconName } from './AppIcon';
import { bottomSheetPresets, useBottomSheet } from './BottomSheet';
import { FlagIcon } from './FlagIcon';
import { HeaderIconButton } from './HeaderIconButton';
import { useKeyboardVisible } from './layout/useKeyboardVisible';
import { TextField } from './TextField';
import { AppText } from './Typography';

type AuthShellProps = PropsWithChildren<{
  backTarget?: NavigationTarget;
  closeTarget?: NavigationTarget;
  descriptionAction?: ReactNode;
  /**
   * @deprecated Use navMode="close" with closeTarget instead.
   */
  closeToLaunch?: boolean;
  footer?: ReactNode;
  kicker?: string;
  navMode?: 'close' | 'back' | 'none';
  onBackPress?: () => void;
  progressStep?: number;
  progressTotal?: number;
  rightAction?: ReactNode;
  step?: string;
  subtitle: string;
  title: string;
}>;

type AuthTextFieldProps = TextInputProps & {
  containerStyle?: React.ComponentProps<typeof TextField>['containerStyle'];
  error?: string;
  fieldState?: React.ComponentProps<typeof TextField>['fieldState'];
  helperText?: string;
  icon?: AppIconName;
  label: string;
  labelHidden?: React.ComponentProps<typeof TextField>['labelHidden'];
  rightSlot?: ReactNode;
  rightSlotFlush?: React.ComponentProps<typeof TextField>['rightSlotFlush'];
  shape?: React.ComponentProps<typeof TextField>['shape'];
  sizePreset?: React.ComponentProps<typeof TextField>['sizePreset'];
};

export function AuthShell({
  backTarget,
  children,
  closeTarget = safeRouteTargets.launch,
  closeToLaunch,
  descriptionAction,
  footer,
  kicker: _kicker,
  navMode,
  onBackPress,
  progressStep,
  progressTotal = 3,
  rightAction,
  step: _step,
  subtitle,
  title,
}: AuthShellProps) {
  const { colors, resolvedThemeMode, t } = useProductSettings();
  const keyboardVisible = useKeyboardVisible();
  const backgroundColor = resolvedThemeMode === 'lightBroker' ? colors.surface.panel : colors.surface.canvas;
  const resolvedNavMode = navMode ?? (closeToLaunch ? 'close' : 'back');
  const bottomActionInset = keyboardVisible ? layout.bottomActionArea.keyboardContentInset : layout.bottomActionArea.contentInset;
  const bottomActionPadding = keyboardVisible ? layout.bottomActionArea.keyboardPaddingBottom : layout.bottomActionArea.paddingBottom;

  const body = (
    <SafeAreaView edges={['top']} style={StyleSheet.flatten([styles.safe, { backgroundColor }])}>
      <View style={styles.topBar}>
        {resolvedNavMode === 'none' ? (
          <View style={styles.topSpacer} />
        ) : (
          <HeaderIconButton
            accessibilityLabel={resolvedNavMode === 'close' ? t('common.cancel') : t('top.back')}
            icon={resolvedNavMode === 'close' ? 'icon.system.close' : 'icon.system.back'}
            onPress={() => {
              void impactLight();
              if (onBackPress) {
                onBackPress();
                return;
              }

              if (resolvedNavMode === 'close') {
                navigateReplace(closeTarget);
                return;
              }

              navigateBackOrReplace(backTarget ?? safeRouteTargets.launch);
            }}
            tone="default"
          />
        )}
        <View style={styles.rightAction}>{rightAction ?? <AuthLanguageAction />}</View>
      </View>

      <ScrollView
        contentContainerStyle={StyleSheet.flatten([styles.content, { paddingBottom: footer ? bottomActionInset : spacing.xl }])}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {progressStep ? <AuthProgressBar current={progressStep} total={progressTotal} /> : null}
        <View style={styles.hero}>
          <AppText style={styles.titleText} variant="title.page">
            {title}
          </AppText>
          <AppText numberOfLines={3} style={styles.subtitleText} tone="muted" variant="bodyLg">
            {subtitle}
          </AppText>
          {descriptionAction}
        </View>
        <View style={styles.form}>{children}</View>
      </ScrollView>

      {footer ? (
        <SafeAreaView edges={keyboardVisible ? [] : ['bottom']} style={StyleSheet.flatten([styles.footerSafe, { backgroundColor }])}>
          <View style={StyleSheet.flatten([styles.footer, { paddingBottom: bottomActionPadding }])}>{footer}</View>
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0} style={styles.flex}>
      <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.flex}>
        {body}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

function AuthProgressBar({ current, total }: { current: number; total: number }) {
  const { colors } = useProductSettings();
  const normalizedCurrent = Math.max(1, Math.min(current, total));

  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ max: total, min: 1, now: normalizedCurrent }} style={styles.progressRow}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={StyleSheet.flatten([
            styles.progressSegment,
            {
              backgroundColor: index < normalizedCurrent ? colors.text.primary : colors.border.subtle,
            },
          ])}
        />
      ))}
    </View>
  );
}

export function AuthTextField({ containerStyle, error, fieldState, helperText, icon, label, labelHidden, rightSlot, rightSlotFlush, shape, sizePreset, style, ...props }: AuthTextFieldProps) {
  return (
    <TextField
      autoCapitalize="none"
      containerStyle={containerStyle}
      error={error}
      fieldState={fieldState}
      helperText={helperText}
      icon={icon}
      inputStyle={StyleSheet.flatten([styles.authInputText, style])}
      label={label}
      labelHidden={labelHidden}
      rightSlot={rightSlot}
      rightSlotFlush={rightSlotFlush}
      shape={shape}
      sizePreset={sizePreset}
      {...props}
    />
  );
}

export function AuthInlineSwitch({ description, label, onPress }: { description?: string; label: string; onPress: () => void }) {
  return (
    <NativePressable accessibilityRole="button" minTouch={36} onPress={onPress} style={styles.inlineSwitch}>
        <AppText numberOfLines={1} style={styles.authLinkText} tone="brand" variant="label.control">
        {label}
      </AppText>
      {description ? (
          <AppText numberOfLines={2} tone="dim" variant="label.minimum">
          {description}
        </AppText>
      ) : null}
    </NativePressable>
  );
}

export function AuthLink({
  description,
  label,
  onPress,
  style,
  tone = 'link',
}: {
  description?: string;
  label: string;
  onPress: () => void;
  style?: React.ComponentProps<typeof NativePressable>['style'];
  tone?: React.ComponentProps<typeof AppText>['tone'];
}) {
  return (
    <NativePressable accessibilityRole="button" minTouch={36} onPress={onPress} style={StyleSheet.flatten([styles.linkButton, style])}>
      <AppText numberOfLines={1} style={styles.authLinkText} tone={tone} variant="label.control">
        {label}
      </AppText>
      {description ? (
        <AppText numberOfLines={2} tone="dim" variant="label.minimum">
          {description}
        </AppText>
      ) : null}
    </NativePressable>
  );
}

export function AuthLanguageAction() {
  const { locale, setLocale, t } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const selectLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    bottomSheet.hide();
  };
  const openLanguageSheet = () => {
    bottomSheet.show(bottomSheetPresets.selection({
      content: <AuthLanguageSheetContent onSelect={selectLocale} selectedLocale={locale} />,
      title: t('auth.language.selectTitle'),
    }));
  };

  return (
    <HeaderIconButton
      accessibilityLabel={t('auth.language.open')}
      icon="icon.market.global"
      onPress={openLanguageSheet}
      variant="ghost"
    />
  );
}

function AuthLanguageSheetContent({
  onSelect,
  selectedLocale,
}: {
  onSelect: (locale: Locale) => void;
  selectedLocale: Locale;
}) {
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

export function AuthDescriptionAction({
  actionLabel,
  label,
  onPress,
}: {
  actionLabel: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.descriptionActionRow}>
      {label ? (
        <AppText numberOfLines={1} style={styles.descriptionActionLabelText} tone="muted" variant="bodyLg">
          {label}
        </AppText>
      ) : null}
      <NativePressable
        accessibilityLabel={`${label}${actionLabel}`}
        accessibilityRole="button"
        minTouch={32}
        onPress={onPress}
        style={styles.descriptionActionLink}>
        <AppText numberOfLines={1} style={styles.descriptionActionText} tone="link" variant="bodyLg">
          {actionLabel}
        </AppText>
      </NativePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  authInputText: {
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null),
  },
  authLinkText: {
    ...typography.bodyMd,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: layout.screenPaddingX,
  },
  descriptionActionLink: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  descriptionActionLabelText: {
    ...typography.bodyLg,
  },
  descriptionActionText: {
    ...typography.bodyLg,
    textDecorationLine: 'underline',
  },
  descriptionActionRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: spacing.xxs,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    rowGap: spacing.none,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  footer: {
    gap: layout.bottomActionArea.gap,
    paddingHorizontal: layout.bottomActionArea.paddingX,
    paddingTop: layout.bottomActionArea.paddingTop,
  },
  footerSafe: {},
  form: {
    gap: spacing.md,
  },
  hero: {
    paddingTop: spacing.sm,
  },
  inlineSwitch: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    gap: spacing.xxs,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  linkButton: {
    alignItems: 'center',
    gap: spacing.xxs,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
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
    paddingHorizontal: spacing.none,
  },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  progressSegment: {
    borderRadius: radius.full,
    flex: 1,
    height: spacing.xs,
  },
  rightAction: {
    alignItems: 'center',
    minWidth: size.input.authOtpCellWidth,
  },
  safe: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: size.input.floatingMinHeight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  topSpacer: {
    width: size.input.authOtpCellWidth,
  },
  titleText: {
    minWidth: 0,
  },
  subtitleText: {
    marginTop: spacing.xs,
    minWidth: 0,
  },
});
