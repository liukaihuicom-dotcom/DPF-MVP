import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';

import { countryOptions, getPasswordChecks, sanitizeOtp, type CountryOption } from '@/src/auth/authFlow';
import { layout, lineWidth, radius, size, spacing, typography } from '@/src/theme/tokens';
import { useProductSettings } from '@/src/settings/ProductSettings';

import { ActionButton } from './ActionButton';
import { AppIcon } from './AppIcon';
import { AuthTextField } from './AuthShell';
import { bottomSheetPresets, useBottomSheet } from './BottomSheet';
import { FlagIcon } from './FlagIcon';
import { GlobalDialog } from './GlobalDialog';
import { IconSurface } from './IconSurface';
import { NativePressable } from './NativePressable';
import { AppText } from './Typography';

const phoneFieldVisibleHeight = size.input.floatingMinHeight + lineWidth.selected * 2;
const countryPickerSnapPoint = layout.appDeviceHeight - layout.topReservedSpace;

export function CountryPhoneField({
  autoFocus,
  country,
  error,
  onChangeCountry,
  onChangePhone,
  phone,
}: {
  autoFocus?: boolean;
  country: CountryOption;
  error?: string;
  onChangeCountry: (country: CountryOption) => void;
  onChangePhone: (phone: string) => void;
  phone: string;
}) {
  const { colors, t } = useProductSettings();
  const [pickerOpen, setPickerOpen] = useState(false);
  const chipBorderWidth = pickerOpen ? lineWidth.selected : lineWidth.strong;
  const chipPaddingOffset = chipBorderWidth - lineWidth.strong;
  const openCountryPicker = () => {
    Keyboard.dismiss();
    setPickerOpen(true);
  };

  return (
    <>
      <View style={styles.phoneRow}>
        <NativePressable
          accessibilityLabel={t('auth.country.select')}
          accessibilityRole="button"
          minTouch={56}
          onPress={openCountryPicker}
          style={StyleSheet.flatten([
            styles.countryChip,
            {
              backgroundColor: colors.surface.panel,
              borderColor: pickerOpen ? colors.text.primary : colors.border.default,
              borderWidth: chipBorderWidth,
              paddingHorizontal: spacing.md - chipPaddingOffset,
            },
          ])}>
          <FlagBadge code={country.flag} />
          <AppText numberOfLines={1} style={styles.countryChipDial} tone="default" variant="titleMd">
            {country.dialCode}
          </AppText>
          <AppIcon name="icon.system.chevron_down" sizeVariant="xs" />
        </NativePressable>
        <AuthTextField
          autoFocus={autoFocus}
          containerStyle={styles.phoneInput}
          error={error}
          inputMode="tel"
          keyboardType="phone-pad"
          label={t('auth.phone')}
          onChangeText={onChangePhone}
          placeholder={t('auth.phonePlaceholder')}
          textContentType="telephoneNumber"
          value={phone}
        />
      </View>
      <CountryPickerModal
        onClose={() => setPickerOpen(false)}
        onSelect={(next) => {
          onChangeCountry(next);
          setPickerOpen(false);
        }}
        open={pickerOpen}
        selected={country}
      />
    </>
  );
}

export function CountryPickerModal({
  onClose,
  onSelect,
  open,
  selected,
}: {
  onClose: () => void;
  onSelect: (country: CountryOption) => void;
  open: boolean;
  selected: CountryOption;
}) {
  const { t } = useProductSettings();
  const bottomSheet = useBottomSheet();
  const selectedRef = useRef(selected);
  const onCloseRef = useRef(onClose);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    selectedRef.current = selected;
    onCloseRef.current = onClose;
    onSelectRef.current = onSelect;
  }, [onClose, onSelect, selected]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    bottomSheet.show(bottomSheetPresets.selection({
      content: (
        <CountryPickerSheetContent
          onSelect={(country) => {
            onSelectRef.current(country);
            bottomSheet.hide();
          }}
          selected={selectedRef.current}
        />
      ),
      contentPadding: 'plain',
      onDismiss: () => onCloseRef.current(),
      sheetSurface: 'panel',
      snapPoints: [countryPickerSnapPoint],
      title: t('auth.country.select'),
    }));

    return undefined;
  }, [bottomSheet, open, t]);

  return null;
}

function CountryPickerSheetContent({
  onSelect,
  selected,
}: {
  onSelect: (country: CountryOption) => void;
  selected: CountryOption;
}) {
  const { colors, t } = useProductSettings();
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

export function OtpInput({
  autoFocus,
  error,
  onChange,
  value,
}: {
  autoFocus?: boolean;
  error?: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const { colors, t } = useProductSettings();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? '');

  useEffect(() => {
    if (!autoFocus) {
      return undefined;
    }

    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  return (
    <NativePressable
      accessibilityLabel={t('auth.verify.code')}
      accessibilityRole="button"
      minTouch={56}
      onPress={() => inputRef.current?.focus()}
      style={styles.otpWrap}>
      <TextInput
        ref={inputRef}
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        inputMode="numeric"
        keyboardType="number-pad"
        maxLength={6}
        onChangeText={(next) => onChange(sanitizeOtp(next))}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        style={styles.hiddenOtpInput}
        textContentType="oneTimeCode"
        value={value}
      />
      <View style={styles.otpCells}>
        {digits.map((digit, index) => {
          const active = focused && index === value.length;
          const completed = Boolean(digit);
          const borderWidth = error || active ? lineWidth.selected : lineWidth.strong;

          return (
            <View
              key={index}
              style={StyleSheet.flatten([
                styles.otpCell,
                {
                  backgroundColor: colors.surface.panel,
                  borderColor: error ? colors.status.danger.fg : active || completed ? colors.text.primary : colors.border.subtle,
                  borderWidth,
                },
              ])}>
              <AppText variant="titleSm">
                {digit ? '•' : index === value.length ? '|' : ''}
              </AppText>
            </View>
          );
        })}
      </View>
      {error ? (
        <AppText tone="danger" variant="caption">
          {error}
        </AppText>
      ) : null}
    </NativePressable>
  );
}

export function OtpRecoveryActions({
  canResend,
  changeTargetLabel,
  maxResends,
  onChangeTarget,
  onOpenHelp,
  onResend,
  resendCount,
  secondsLeft,
}: {
  canResend: boolean;
  changeTargetLabel: string;
  maxResends: number;
  onChangeTarget: () => void;
  onOpenHelp: () => void;
  onResend: () => void;
  resendCount: number;
  secondsLeft: number;
}) {
  const { t } = useProductSettings();
  const time = `00:${String(secondsLeft).padStart(2, '0')}`;
  const resendLocked = secondsLeft > 0;
  const resendLimitReached = resendCount >= maxResends;

  if (resendLocked) {
    return (
      <View style={styles.otpRecoveryStack}>
        <AppText style={styles.leftText} tone="muted" variant="caption">
          {t('auth.verify.resendCountdownV2', { time })}
        </AppText>
        <NativePressable accessibilityRole="button" minTouch={36} onPress={onOpenHelp} style={styles.leftLink}>
          <AppText tone="brand" variant="caption">
            {t('auth.verify.noCode')}
          </AppText>
        </NativePressable>
      </View>
    );
  }

  return (
    <View style={styles.otpRecoveryStack}>
      <NativePressable accessibilityRole="button" minTouch={36} onPress={onOpenHelp} style={styles.leftLink}>
        <AppText tone="brand" variant="caption">
          {t('auth.verify.noCode')}
        </AppText>
      </NativePressable>
      <AppText style={styles.leftText} tone="muted" variant="caption">
        {resendLimitReached ? t('auth.verify.resendLimitBody') : t('auth.verify.noCodeBody')}
      </AppText>
      <View style={styles.otpRecoveryActions}>
        {!resendLimitReached ? (
          <ActionButton
            disabled={!canResend}
            label={t('auth.verify.resend')}
            onPress={onResend}
            style={styles.otpRecoveryAction}
            tone="brand"
            variant="outline"
          />
        ) : null}
        <ActionButton
          label={changeTargetLabel}
          onPress={onChangeTarget}
          style={styles.otpRecoveryAction}
          tone="neutral"
          variant="filled"
        />
      </View>
    </View>
  );
}

export function AuthContactConfirmDialog({
  channel,
  countryFlag,
  onCancel,
  onConfirm,
  open,
  target,
}: {
  channel: 'email' | 'phone';
  countryFlag?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  target: string;
}) {
  const { t } = useProductSettings();
  const accessibilityLabel = channel === 'phone'
    ? t('auth.confirmContact.phoneAccessibility', { target })
    : t('auth.confirmContact.emailAccessibility', { target });

  return (
    <GlobalDialog
      accessibilityLabel={accessibilityLabel}
      actions={[
        { label: t('auth.confirmContact.confirm'), onPress: onConfirm, tone: 'brand', variant: 'filled' },
        { label: t('auth.confirmContact.goBack'), onPress: onCancel, tone: 'neutral', variant: 'filled' },
      ]}
      onRequestClose={onCancel}
      open={open}>
      <View style={styles.confirmCopyStack}>
        <View style={styles.confirmTargetRow}>
          {channel === 'phone' && countryFlag ? <FlagBadge code={countryFlag} /> : null}
          <AppText numberOfLines={1} style={styles.confirmTargetText} variant="titleMd">
            {target}
          </AppText>
        </View>
        <AppText style={styles.centerText} tone="muted" variant="bodyLg">
          {t(channel === 'phone' ? 'auth.confirmContact.phoneBody' : 'auth.confirmContact.emailBody')}
        </AppText>
      </View>
    </GlobalDialog>
  );
}

export function AuthLeaveVerifiedStepDialog({
  body,
  onCancel,
  onConfirm,
  open,
  title,
}: {
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}) {
  const { t } = useProductSettings();

  return (
    <GlobalDialog
      actions={[
        { label: t('auth.register.leaveStay'), onPress: onCancel, tone: 'brand', variant: 'filled' },
        { label: t('auth.register.leaveConfirm'), onPress: onConfirm, tone: 'neutral', variant: 'outline' },
      ]}
      accessibilityLabel={`${title} ${body}`}
      onRequestClose={onCancel}
      open={open}>
      <View style={styles.errorCopy}>
        <AppText numberOfLines={2} style={styles.centerText} variant="title.dialog">
          {title}
        </AppText>
        <AppText style={styles.centerText} tone="muted" variant="bodyMd">
          {body}
        </AppText>
      </View>
    </GlobalDialog>
  );
}

export function PasswordRuleList({ password }: { password: string }) {
  const { t } = useProductSettings();
  const checks = getPasswordChecks(password);
  const rules = [
    ['length', t('auth.password.rule.length')],
    ['letterCase', t('auth.password.rule.case')],
    ['number', t('auth.password.rule.number')],
    ['symbol', t('auth.password.rule.symbol')],
  ] as const;

  return (
    <View style={styles.ruleList}>
      {rules.map(([key, label]) => {
        const passed = checks[key];

        return (
          <View key={key} style={styles.ruleRow}>
            <View style={styles.ruleIconSlot}>
              <AppIcon tone={passed ? 'success' : 'textMuted'} name="icon.status.check" sizeVariant="xs" />
            </View>
            <AppText tone={passed ? 'success' : 'muted'} variant="caption">
              {label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

export function AuthErrorSheet({
  body,
  onClose,
  open,
  title,
}: {
  body: string;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  const { t } = useProductSettings();
  const bottomSheet = useBottomSheet();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    bottomSheet.show(bottomSheetPresets.actionMenu({
      content: (
        <View style={styles.errorFeedbackContent}>
          <IconSurface icon="icon.system.close" sizeVariant="md" tone="danger" />
          <View style={styles.errorCopy}>
            <AppText numberOfLines={2} style={styles.centerText} variant="title.dialog">
              {title}
            </AppText>
            <AppText style={styles.centerText} tone="muted" variant="caption">
              {body}
            </AppText>
          </View>
        </View>
      ),
      footer: [
        {
          label: t('auth.error.gotIt'),
          onPress: onClose,
          tone: 'brand',
          variant: 'filled',
        },
      ],
      onDismiss: onClose,
    }));

    return undefined;
  }, [body, bottomSheet, onClose, open, t, title]);

  return null;
}

export function AuthErrorDialog({
  body,
  onClose,
  open,
  title,
}: {
  body: string;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  const { t } = useProductSettings();

  return (
    <GlobalDialog
      actions={[
        { label: t('auth.error.gotIt'), onPress: onClose, tone: 'brand', variant: 'filled' },
      ]}
      accessibilityLabel={`${title} ${body}`}
      onRequestClose={onClose}
      open={open}>
      <View style={styles.errorFeedbackContent}>
        <IconSurface icon="icon.system.close" sizeVariant="md" tone="danger" />
        <View style={styles.errorCopy}>
          <AppText numberOfLines={2} style={styles.centerText} variant="title.dialog">
            {title}
          </AppText>
          <AppText style={styles.centerText} tone="muted" variant="caption">
            {body}
          </AppText>
        </View>
      </View>
    </GlobalDialog>
  );
}

export function FlagBadge({ code }: { code: string }) {
  return <FlagIcon code={code} size={30} style={styles.flagBadge} />;
}

export function useCountdown(seconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => setSecondsLeft((value) => Math.max(value - 1, 0)), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return {
    reset: () => setSecondsLeft(seconds),
    secondsLeft,
  };
}

const styles = StyleSheet.create({
  centerText: {
    textAlign: 'center',
  },
  confirmTargetRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: size.control.sm,
    minWidth: 0,
  },
  confirmTargetText: {
    flexShrink: 1,
    fontSize: typography.sheetTitle.fontSize,
    lineHeight: typography.sheetTitle.lineHeight,
    minWidth: 0,
  },
  countryChip: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: lineWidth.strong,
    flexDirection: 'row',
    gap: spacing.sm,
    height: phoneFieldVisibleHeight,
    minHeight: size.input.phoneChipMinHeight,
    paddingHorizontal: spacing.md,
  },
  countryChipDial: {
    flexShrink: 0,
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
  confirmCopyStack: {
    alignItems: 'center',
    gap: spacing.xs,
    width: '100%',
  },
  errorCopy: {
    gap: spacing.sm,
  },
  errorFeedbackContent: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  flagBadge: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.input.countryBadge,
    justifyContent: 'center',
    width: size.input.countryBadge,
  },
  hiddenOtpInput: {
    height: size.input.hiddenInput,
    opacity: 0,
    position: 'absolute',
    width: size.input.hiddenInput,
  },
  otpCell: {
    alignItems: 'center',
    borderRadius: radius.md,
    height: size.input.authOtpCellHeight,
    justifyContent: 'center',
    width: size.input.authOtpCellWidth,
  },
  otpCells: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  otpWrap: {
    gap: spacing.sm,
  },
  leftLink: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  leftText: {
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  otpRecoveryAction: {
    flex: 1,
  },
  otpRecoveryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  otpRecoveryStack: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  phoneInput: {
    flex: 1,
  },
  phoneRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ruleList: {
    gap: spacing.sm,
    paddingLeft: layout.formFieldTextInset,
  },
  ruleIconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    width: size.icon.xs,
  },
  ruleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
