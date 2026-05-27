import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { isStrongPassword, safeRedirect } from '@/src/auth/authFlow';
import { ActionButton } from '@/src/components/ActionButton';
import { AppIcon } from '@/src/components/AppIcon';
import { AuthShell, AuthTextField } from '@/src/components/AuthShell';
import { AuthErrorSheet, AuthLeaveVerifiedStepDialog, PasswordRuleList } from '@/src/components/AuthFlowControls';
import { NativePressable } from '@/src/components/NativePressable';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import type { NavigationTarget } from '@/src/navigation/navigationPolicy';
import { REMEMBERED_WEB_DEMO_DEVICE_LABEL, useProductSettings } from '@/src/settings/ProductSettings';
import { spacing } from '@/src/theme/tokens';

export default function RegisterPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string; phone?: string; redirect?: string }>();
  const { profileAvatarId, setLocalPinCode, setPinGateStatus, setPinStatus, setProfileNickname, setRememberedLoginSnapshot, t } = useProductSettings();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const email = typeof params.email === 'string' ? params.email : '';
  const passwordValid = isStrongPassword(password);
  const confirmValid = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = passwordValid && confirmValid;
  const passwordError = submitted && !passwordValid ? t('auth.error.passwordStrong') : '';
  const confirmTouched = confirmPassword.length > 0;
  const confirmError = passwordValid && (submitted || confirmTouched) && !confirmValid ? t('auth.error.confirmPassword') : '';
  const emailStepTarget = `/auth/register-phone?phone=${encodeURIComponent(phone)}&redirect=${encodeURIComponent(String(redirect))}` as NavigationTarget;
  const phoneStepTarget = `/auth/register?redirect=${encodeURIComponent(String(redirect))}` as NavigationTarget;

  useEffect(() => {
    if (!phone) {
      router.replace(phoneStepTarget as never);
      return;
    }

    if (!email) {
      router.replace(emailStepTarget as never);
    }
  }, [email, emailStepTarget, phone, phoneStepTarget]);

  const submit = () => {
    setSubmitted(true);

    if (!phone || !email) {
      void notifyWarning();
      router.replace(phone ? (emailStepTarget as never) : (phoneStepTarget as never));
      return;
    }

    if (!canSubmit) {
      void notifyWarning();
      setErrorOpen(true);
      return;
    }

    setRememberedLoginSnapshot({
      account: phone || email,
      avatarId: profileAvatarId,
      channel: phone ? 'phone' : 'email',
      deviceLabel: REMEMBERED_WEB_DEMO_DEVICE_LABEL,
      lastLoginAt: new Date().toISOString(),
      lastLoginMethod: 'register',
    });
    setLocalPinCode('');
    setPinGateStatus('unlocked');
    setPinStatus('unset');
    setProfileNickname('');
    void notifySuccess();
    router.replace(`/auth/pin-setup?mode=setup&redirect=${encodeURIComponent(String(redirect))}` as never);
  };

  const visibilityButton = (
    <NativePressable
      accessibilityLabel={visible ? t('auth.password.hide') : t('auth.password.show')}
      accessibilityRole="button"
      hitSlop={12}
      minTouch={20}
      onPress={() => setVisible((value) => !value)}
      style={styles.visibilityButton}>
      <AppIcon name={visible ? 'icon.system.password_hidden' : 'icon.system.password_visible'} sizeVariant="sm" />
    </NativePressable>
  );

  return (
    <AuthShell
      backTarget={emailStepTarget}
      footer={<ActionButton disabled={!canSubmit} label={t('auth.register.finish')} onPress={submit} tone="brand" variant="filled" />}
      navMode="back"
      onBackPress={() => setLeaveOpen(true)}
      progressStep={3}
      subtitle={t('auth.register.passwordSubtitle')}
      title={t('auth.register.passwordTitle')}>
      <View style={styles.passwordGroup}>
        <AuthTextField
          autoFocus
          autoComplete="new-password"
          error={passwordError}
          label={t('auth.password.new')}
          onChangeText={setPassword}
          placeholder={t('auth.password.newPlaceholder')}
          rightSlot={visibilityButton}
          rightSlotFlush
          secureTextEntry={!visible}
          textContentType="newPassword"
          value={password}
        />
        <PasswordRuleList password={password} />
      </View>
      <AuthTextField
        autoComplete="new-password"
        error={confirmError}
        label={t('auth.confirmPassword')}
        onChangeText={setConfirmPassword}
        placeholder={t('auth.confirmPasswordPlaceholder')}
        secureTextEntry={!visible}
        textContentType="newPassword"
        value={confirmPassword}
      />
      <AuthErrorSheet body={t('auth.error.fixFields')} onClose={() => setErrorOpen(false)} open={errorOpen} title={t('auth.register.blocked')} />
      <AuthLeaveVerifiedStepDialog
        body={t('auth.register.leaveAfterEmailBody')}
        onCancel={() => setLeaveOpen(false)}
        onConfirm={() => router.replace(emailStepTarget as never)}
        open={leaveOpen}
        title={t('auth.register.leaveAfterEmailTitle')}
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  passwordGroup: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  visibilityButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
