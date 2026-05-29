import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { buildAuthRoute, isValidEmail, maskDisplayAccount, safeRedirect, sanitizePhone } from '@/src/auth/authFlow';
import { ActionButton } from '@/src/design-public-assets/components';
import { AuthDescriptionAction, AuthLanguageAction, AuthShell, AuthTextField } from '@/src/design-public-assets/components';
import { AuthErrorSheet } from '@/src/design-public-assets/components';
import { AppIcon } from '@/src/design-public-assets/components';
import { HeaderIconButton } from '@/src/design-public-assets/components';
import { NativePressable } from '@/src/design-public-assets/components';
import { ProfileAvatar } from '@/src/design-public-assets/components';
import { AppText } from '@/src/design-public-assets/components';
import type { AuthChannel } from '@/src/domain/types';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import {
  REMEMBERED_LOCAL_DEVICE_LABEL,
  REMEMBERED_WEB_DEMO_DEVICE_LABEL,
  type RememberedLoginSnapshot,
  useProductSettings,
} from '@/src/design-public-assets/copy';
import { lineWidth, radius, size, spacing } from '@/src/design-public-assets/tokens';

export default function LoginScreen() {
  const params = useLocalSearchParams<{ account?: string; channel?: AuthChannel; redirect?: string }>();
  const {
    locale,
    localPinCode,
    colors,
    profileAvatarId,
    profileNickname,
    setAuthStatus,
    setPinGateStatus,
    setPinStatus,
    rememberedLoginSnapshot,
    setRememberedLoginSnapshot,
    t,
  } = useProductSettings();
  const hasAccountParam = typeof params.account === 'string' && params.account.length > 0;
  const [useRememberedAccount, setUseRememberedAccount] = useState(Boolean(rememberedLoginSnapshot?.account) && !hasAccountParam);
  const remembered = useRememberedAccount && Boolean(rememberedLoginSnapshot?.account);
  const [loginAccount, setLoginAccount] = useState(typeof params.account === 'string' ? normalizeInitialAccount(params.account) : '');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const resolvedAccount = resolveLoginAccount(loginAccount);
  const account = remembered && rememberedLoginSnapshot ? rememberedLoginSnapshot.account : resolvedAccount.account;
  const channel = remembered && rememberedLoginSnapshot ? rememberedLoginSnapshot.channel : resolvedAccount.channel;
  const rememberedAccountLabel = rememberedLoginSnapshot
    ? rememberedLoginSnapshot.nickname?.trim() || maskDisplayAccount(rememberedLoginSnapshot.account, rememberedLoginSnapshot.channel, t('auth.profile.noNickname'))
    : '';
  const rememberedAccountMeta = rememberedLoginSnapshot?.nickname
    ? maskDisplayAccount(rememberedLoginSnapshot.account, rememberedLoginSnapshot.channel, t('auth.profile.noNickname'))
    : '';
  const rememberedLoginMeta = rememberedLoginSnapshot ? formatRememberedLoginMeta(rememberedLoginSnapshot, locale, t) : '';
  const rememberedSecurityHint = rememberedLoginSnapshot ? formatRememberedSecurityHint(rememberedLoginSnapshot) : '';
  const accountValid = remembered || resolvedAccount.valid;
  const credentialValid = password.length >= 6;
  const canSubmit = accountValid && credentialValid;
  const accountError = submitted && !accountValid ? t('auth.error.account') : '';
  const passwordError = submitted && password.length < 6 ? t('auth.error.password') : '';

  const completeLogin = () => {
    setRememberedLoginSnapshot({
      account,
      avatarId: profileAvatarId,
      channel,
      deviceLabel: getDemoDeviceLabel(),
      lastLoginAt: new Date().toISOString(),
      lastLoginMethod: 'password',
      nickname: profileNickname.trim() || undefined,
    });
    setAuthStatus('signedIn');
    void notifySuccess();
    if (localPinCode.length === 6) {
      setPinGateStatus('unlocked');
      setPinStatus('set');
      router.replace(redirect);
      return;
    }

    setPinGateStatus('unlocked');
    setPinStatus('skipped');
    router.replace(redirect);
  };

  const submit = () => {
    setSubmitted(true);

    if (!canSubmit) {
      void notifyWarning();
      setErrorOpen(true);
      return;
    }

    completeLogin();
  };

  const switchAccount = () => {
    setUseRememberedAccount(false);
    setLoginAccount('');
    setPassword('');
    setSubmitted(false);
  };
  return (
    <AuthShell
      navMode="close"
      descriptionAction={
        !remembered ? (
          <AuthDescriptionAction
            actionLabel={t('auth.login.createAccountAction')}
            label={t('auth.login.noAccountPrefix')}
            onPress={() => router.push(buildAuthRoute('/auth/register', redirect, { entry: 'login' }) as never)}
          />
        ) : null
      }
      footer={<ActionButton disabled={!canSubmit} label={t('auth.login.submitShort')} onPress={submit} tone="brand" variant="filled" />}
      rightAction={
        <View style={styles.topActions}>
          <HeaderIconButton
            accessibilityLabel={t('auth.forgotPassword')}
            icon="icon.support.help_center"
            onPress={() => router.push(buildAuthRoute('/auth/forgot-password', redirect) as never)}
            variant="ghost"
          />
          <AuthLanguageAction />
        </View>
      }
      subtitle={remembered ? t('auth.login.returningSubtitle') : t('auth.login.subtitleV2')}
      title={remembered ? t('auth.login.welcomeBack') : t('auth.login.title')}>
      {remembered && rememberedLoginSnapshot ? (
        <View style={StyleSheet.flatten([styles.accountSummary, { backgroundColor: colors.surface.subtle }])}>
          <ProfileAvatar id={rememberedLoginSnapshot.avatarId} size={48} />
          <View style={styles.flex}>
            <AppText numberOfLines={1} variant="subtitle">
              {rememberedAccountLabel}
            </AppText>
            {rememberedAccountMeta ? (
              <AppText numberOfLines={1} tone="muted" variant="caption">
                {rememberedAccountMeta}
              </AppText>
            ) : null}
            {rememberedLoginMeta ? (
              <AppText numberOfLines={1} tone="dim" variant="caption">
                {rememberedLoginMeta}
              </AppText>
            ) : null}
            {rememberedSecurityHint ? (
              <AppText numberOfLines={1} tone="dim" variant="caption">
                {rememberedSecurityHint}
              </AppText>
            ) : null}
          </View>
          <NativePressable
            accessibilityLabel={t('auth.login.useOtherAccount')}
            accessibilityRole="button"
            minTouch={40}
            onPress={switchAccount}
            style={StyleSheet.flatten([styles.switchAccountButton, { backgroundColor: colors.surface.panel, borderColor: colors.border.subtle }])}>
            <AppIcon name="icon.account.add_user" sizeVariant="sm" />
          </NativePressable>
        </View>
      ) : null}

      {!remembered ? (
        <View style={styles.loginInputStack}>
          <AuthTextField
            autoFocus
            autoComplete="username"
            error={accountError}
            inputMode="email"
            keyboardType="email-address"
            label={t('auth.login.account')}
            onChangeText={(value) => {
              setLoginAccount(value);
              setSubmitted(false);
            }}
            placeholder={t('auth.login.accountPlaceholder')}
            textContentType="username"
            value={loginAccount}
          />
        </View>
      ) : null}

      <AuthTextField
        autoComplete="password"
        error={passwordError}
        label={t('auth.password')}
        onChangeText={setPassword}
        placeholder={t('auth.passwordPlaceholder')}
        secureTextEntry
        textContentType="password"
        value={password}
      />
      <AuthErrorSheet body={t('auth.error.fixFields')} onClose={() => setErrorOpen(false)} open={errorOpen} title={t('auth.login.blocked')} />
    </AuthShell>
  );
}

function resolveLoginAccount(value: string): { account: string; channel: AuthChannel; valid: boolean } {
  const trimmed = value.trim();

  if (isValidEmail(trimmed)) {
    return { account: trimmed, channel: 'email', valid: true };
  }

  const phone = sanitizePhone(trimmed);

  if (phone.length >= 6) {
    return { account: phone, channel: 'phone', valid: true };
  }

  return { account: trimmed, channel: trimmed.includes('@') ? 'email' : 'phone', valid: false };
}

function normalizeInitialAccount(value: string) {
  return value.trim();
}

function getDemoDeviceLabel() {
  return Platform.OS === 'web' ? REMEMBERED_WEB_DEMO_DEVICE_LABEL : REMEMBERED_LOCAL_DEVICE_LABEL;
}

function formatRememberedLoginMeta(
  snapshot: RememberedLoginSnapshot,
  locale: string,
  t: ReturnType<typeof useProductSettings>['t'],
) {
  const parts: string[] = [];

  if (snapshot.lastLoginAt) {
    parts.push(formatLastLoginAt(snapshot.lastLoginAt, locale, t));
  }

  if (snapshot.deviceLabel) {
    parts.push(formatDeviceLabel(snapshot.deviceLabel, t));
  }

  return parts.length > 0 ? `${t('auth.login.lastLogin')}: ${parts.join(' · ')}` : '';
}

function formatRememberedSecurityHint(
  snapshot: RememberedLoginSnapshot,
) {
  const parts = [
    snapshot.locationHint?.trim() || 'Jakarta, Indonesia',
    snapshot.ipHint?.trim() || '103.127.16.88',
  ].filter(Boolean);

  return parts.join(' · ');
}

function formatLastLoginAt(
  value: string,
  locale: string,
  t: ReturnType<typeof useProductSettings>['t'],
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);

  if (isSameDay) {
    return `${t('auth.login.today')} ${time}`;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(date);
}

function formatDeviceLabel(label: string, t: ReturnType<typeof useProductSettings>['t']) {
  if (label === REMEMBERED_WEB_DEMO_DEVICE_LABEL) {
    return t('auth.login.webDemoDevice');
  }

  if (label === REMEMBERED_LOCAL_DEVICE_LABEL) {
    return t('auth.login.localDevice');
  }

  return label;
}

const styles = StyleSheet.create({
  accountSummary: {
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: lineWidth.none,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  loginInputStack: {
    gap: spacing.md,
  },
  switchAccountButton: {
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: lineWidth.hairline,
    height: size.button.icon,
    justifyContent: 'center',
    width: size.button.icon,
  },
  topActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
