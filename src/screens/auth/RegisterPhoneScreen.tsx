import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { buildAccount, buildAuthRoute, defaultCountry, safeRedirect, sanitizePhone } from '@/src/auth/authFlow';
import { ActionButton } from '@/src/components/ActionButton';
import { AuthDescriptionAction, AuthShell } from '@/src/components/AuthShell';
import { AuthContactConfirmDialog, AuthErrorSheet, CountryPhoneField } from '@/src/components/AuthFlowControls';
import { notifySuccess, notifyWarning } from '@/src/feedback/haptics';
import { useProductSettings } from '@/src/settings/ProductSettings';

export default function RegisterPhoneScreen() {
  const params = useLocalSearchParams<{ entry?: string; redirect?: string }>();
  const { t } = useProductSettings();
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(defaultCountry);
  const [submitted, setSubmitted] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const redirect = safeRedirect(typeof params.redirect === 'string' ? params.redirect : undefined);
  const fromLogin = params.entry === 'login';
  const account = buildAccount('phone', phone, country.dialCode);
  const phoneError = submitted && phone.length < 6 ? t('auth.error.phone') : '';
  const canSubmit = phone.length >= 6;

  const submit = () => {
    setSubmitted(true);

    if (phone.length < 6) {
      void notifyWarning();
      setErrorOpen(true);
      return;
    }

    setConfirmOpen(true);
  };

  const confirmPhone = () => {
    setConfirmOpen(false);
    void notifySuccess();
    router.push(
      `/auth/register-phone-code?phone=${encodeURIComponent(account)}&redirect=${encodeURIComponent(String(redirect))}` as never,
    );
  };

  return (
    <AuthShell
      backTarget={buildAuthRoute('/auth', redirect)}
      descriptionAction={
        <AuthDescriptionAction
          actionLabel={t('auth.register.loginAction')}
          label={t('auth.register.haveAccountPrefix')}
          onPress={() => router.replace(buildAuthRoute('/auth', redirect) as never)}
        />
      }
      footer={<ActionButton disabled={!canSubmit} label={t('auth.action.continue')} onPress={submit} tone="brand" variant="filled" />}
      navMode={fromLogin ? 'back' : 'close'}
      progressStep={1}
      subtitle={t('auth.register.phoneEntrySubtitle')}
      title={t('auth.register.phoneEntryTitle')}>
      <CountryPhoneField
        autoFocus
        country={country}
        error={phoneError}
        onChangeCountry={setCountry}
        onChangePhone={(value) => setPhone(sanitizePhone(value))}
        phone={phone}
      />
      <AuthErrorSheet body={t('auth.error.fixFields')} onClose={() => setErrorOpen(false)} open={errorOpen} title={t('auth.register.blocked')} />
      <AuthContactConfirmDialog
        channel="phone"
        countryFlag={country.flag}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmPhone}
        open={confirmOpen}
        target={account}
      />
    </AuthShell>
  );
}
