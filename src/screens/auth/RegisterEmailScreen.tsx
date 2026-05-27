import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { isValidEmail, safeRedirect } from '@/src/auth/authFlow';
import { ActionButton } from '@/src/components/ActionButton';
import { AuthShell, AuthTextField } from '@/src/components/AuthShell';
import { AuthContactConfirmDialog, AuthErrorSheet, AuthLeaveVerifiedStepDialog } from '@/src/components/AuthFlowControls';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import type { NavigationTarget } from '@/src/navigation/navigationPolicy';
import { useProductSettings } from '@/src/settings/ProductSettings';

export default function RegisterEmailScreen() {
  const params = useLocalSearchParams<{ phone?: string; redirect?: string }>();
  const { t } = useProductSettings();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const trimmedEmail = email.trim();
  const emailError = submitted && !isValidEmail(email) ? t('auth.error.email') : '';
  const canSubmit = isValidEmail(email);
  const phoneStepTarget = `/auth/register?redirect=${encodeURIComponent(String(redirect))}` as NavigationTarget;

  useEffect(() => {
    if (!phone) {
      router.replace(phoneStepTarget as never);
    }
  }, [phone, phoneStepTarget]);

  const submit = () => {
    setSubmitted(true);

    if (!phone) {
      void notifyWarning();
      router.replace(phoneStepTarget as never);
      return;
    }

    if (!isValidEmail(email)) {
      void notifyWarning();
      setErrorOpen(true);
      return;
    }

    setConfirmOpen(true);
  };

  const confirmEmail = () => {
    setConfirmOpen(false);
    void notifySuccess();
    router.push(
      `/auth/register-email-code?phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(trimmedEmail)}&redirect=${encodeURIComponent(String(redirect))}` as never,
    );
  };

  return (
    <AuthShell
      backTarget={phoneStepTarget}
      footer={<ActionButton disabled={!canSubmit} label={t('auth.action.continue')} onPress={submit} tone="brand" variant="filled" />}
      navMode="back"
      onBackPress={() => setLeaveOpen(true)}
      progressStep={2}
      subtitle={t('auth.register.emailEntrySubtitle')}
      title={t('auth.register.emailEntryTitle')}>
      <AuthTextField
        autoFocus
        autoComplete="email"
        error={emailError}
        keyboardType="email-address"
        label={t('auth.email')}
        onChangeText={setEmail}
        placeholder={t('auth.emailPlaceholder')}
        textContentType="emailAddress"
        value={email}
      />
      <AuthErrorSheet body={t('auth.error.fixFields')} onClose={() => setErrorOpen(false)} open={errorOpen} title={t('auth.register.blocked')} />
      <AuthLeaveVerifiedStepDialog
        body={t('auth.register.leaveAfterPhoneBody')}
        onCancel={() => setLeaveOpen(false)}
        onConfirm={() => router.replace(phoneStepTarget as never)}
        open={leaveOpen}
        title={t('auth.register.leaveAfterPhoneTitle')}
      />
      <AuthContactConfirmDialog
        channel="email"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmEmail}
        open={confirmOpen}
        target={trimmedEmail}
      />
    </AuthShell>
  );
}
